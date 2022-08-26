import { PercentPipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { ArtifactService, ArtifactStorageInfo, ArtifactStoragePartData, ChipData, Const, GenshinDataService, NoCommaPipe } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-artifact-chips',
  templateUrl: './artifact-chips.component.html',
  styleUrls: ['./artifact-chips.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArtifactChipsComponent implements OnInit {

  readonly parts = [
    Const.ARTIFACT_FLOWER,
    Const.ARTIFACT_PLUME,
    Const.ARTIFACT_SANDS,
    Const.ARTIFACT_GOBLET,
    Const.ARTIFACT_CIRCLET,
  ]
  readonly subs = [
    Const.ARTIFACT_SUB1,
    Const.ARTIFACT_SUB2,
    Const.ARTIFACT_SUB3,
    Const.ARTIFACT_SUB4,
  ];
  readonly subMax = 69;
  readonly fixNum = 1;

  //キャラインデックス
  @Input('characterIndex') characterIndex!: number;
  //聖遺物セットインデックス
  @Input('index') index!: number;
  //フラグ
  @Input('isFull') isFull!: boolean;
  //フラグ
  @Input('isAuto') isAuto!: boolean;
  //パート名
  @Input('part') partName!: string;
  //アップデータフラグ
  @Input('changed') changed!: number;
  //サブ属性
  dataReliquaryAffix = GenshinDataService.dataReliquaryAffix;
  //チップ
  chips!: ChipData[];
  //キャラ名（Zh）
  nameZh!: string;

  constructor(private genshinDataService: GenshinDataService,
    private artifactService: ArtifactService,
    private percentPipe: PercentPipe,
    private decimalPipe: DecimalPipe,
    private noCommaPipe: NoCommaPipe,) { }

  ngOnInit(): void {
    this.nameZh = this.genshinDataService.getCharacter(this.characterIndex.toString()).name.cn_sim;
    this.updateChips();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['changed']) {
      this.updateChips();
    }
  }

  updateChips(){
    this.chips = [];
    //計算準備
    let partData: ArtifactStoragePartData;
    let allData: Record<string, number|string>;
    let isFull: boolean;
    let isAuto: boolean;
    let tempData;
    isFull = this.isFull != undefined && this.isFull == true;
    isAuto = this.isAuto;
    allData = {};
    allData[Const.ALL_PROPS_KEY] = 0;
    for(let part of this.parts){
      let partName;
      if(isFull){
        partName = part;
      }else{
        partName = this.partName;
      }
      partData = this.artifactService.getStorageInfo(this.characterIndex, this.index, partName.toLowerCase());
      for(let sub of this.subs){
        tempData = partData[sub.toLowerCase()];
        if(tempData.name != undefined){
          let indexValue;
          if(!isAuto){
            allData[tempData.name + Const.SUFFIX_ACTUAL_KEY] = (allData[tempData.name + Const.SUFFIX_ACTUAL_KEY] as number ?? 0) + tempData.value!;
            indexValue = this.dataReliquaryAffix[tempData.name].indexOf((allData[tempData.name + Const.SUFFIX_ACTUAL_KEY] as number));
          }else{
            allData[tempData.name + Const.SUFFIX_ACTUAL_KEY] = (allData[tempData.name + Const.SUFFIX_ACTUAL_KEY] as number ?? 0) + tempData.value!/this.parts.length;
            indexValue = this.floorIndexByDichotomy(this.dataReliquaryAffix[tempData.name], (allData[tempData.name + Const.SUFFIX_ACTUAL_KEY] as number));
          }
          allData[tempData.name] = ((allData[tempData.name] as number) ?? 0) + +(indexValue * 100/this.subMax).toFixed(this.fixNum);
        }
      }
      {
        tempData = partData[Const.ARTIFACT_MAIN.toLowerCase()];
        if(tempData.name != undefined){
          allData[Const.ARTIFACT_MAIN + Const.CONCATENATION_CHIP + tempData.name] = ((allData[Const.ARTIFACT_MAIN + Const.CONCATENATION_CHIP + tempData.name] as number) ?? 0) + 1;
          // let tempValue;
          // if(!isAuto){
          //   tempValue = tempData.value!;
          // }else{
          //   tempValue = tempData.value!/this.parts.length;
          // }
          // allData[tempData.name + Const.SUFFIX_ACTUAL_KEY] = ((allData[tempData.name + Const.SUFFIX_ACTUAL_KEY] as number)??0) + tempValue;
          allData[partName + Const.CONCATENATION_CHIP + Const.ARTIFACT_MAIN + Const.CONCATENATION_CHIP + tempData.name] = 1;
        }
      }
      if(!isFull){
        break;
      }
    }
    for(let key of Const.PROPS_ARTIFACT_SUB){
      if(allData[key] != undefined){
        allData[Const.ALL_PROPS_KEY] = (allData[Const.ALL_PROPS_KEY] as number) + (allData[key] as number);
      }
    }
    allData[Const.ALL_PROPS_KEY] = +(allData[Const.ALL_PROPS_KEY] as number).toFixed(this.fixNum);
    if(isFull && !isAuto){
      for(let key in allData){
        if(key.includes(Const.ARTIFACT_MAIN)){
          continue; 
        }
        if(key.includes(Const.SUFFIX_ACTUAL_KEY)){
          allData[key] = (allData[key] as number) / this.parts.length;
          continue;
        }
        allData[key] = +((allData[key] as number) / this.parts.length).toFixed(this.fixNum);
      }
    }
    //補足
    for(let toAddProp of Const.PROPS_ARTIFACT_SUB){
      if(allData[toAddProp] == undefined){
        allData[toAddProp] = 0;
        allData[toAddProp + Const.SUFFIX_ACTUAL_KEY] = 0;
      }
    }
    for(let originKey of Const.PROPS_ARTIFACT_SUB){
      let strValue = '';
      if (Const.PROPS_CHIP_DECIMAL.includes(originKey)) {
        strValue = this.noCommaPipe.transform(this.decimalPipe.transform(allData[originKey+Const.SUFFIX_ACTUAL_KEY], '1.0-1') as string);
      } else {
        strValue = this.percentPipe.transform(allData[originKey+Const.SUFFIX_ACTUAL_KEY], '1.0-1') as string;
      }
      allData[originKey + Const.SUFFIX_ACTUAL_KEY + Const.SUFFIX_KEY_STR] = strValue;
    }
    //計算
    for(let chip of this.genshinDataService.getChip(Const.ALL_CHARACTER_KEY).concat(this.genshinDataService.getChip(this.nameZh) ?? [])){
      if(chip.onlyForAll == true && isFull != true){
        continue;
      }
      if(chip.onlyForOne == true && isFull == true){
        continue;
      }
      if(chip.rules == undefined){
        continue;
      }
      let resBool = true;
      if(chip.rules.length > 0){
        for(let rule of chip.rules){
          if(!resBool){
            break;
          }
          let subResBool = false;
          for(let subRule of rule){
            if(subRule.propName != undefined && subRule.propName in allData){
              let isMatch = true;
              if(subRule.expectGEValue != undefined){
                isMatch = isMatch && allData[subRule.propName] >= subRule.expectGEValue;
              }
              if(subRule.expectLEValue != undefined){
                isMatch = isMatch && allData[subRule.propName] <= subRule.expectLEValue;
              }
              subResBool = isMatch;
              if(subResBool){
                break;
              }
            }
          }
          resBool = subResBool;
        }  
      }
      if(resBool){
        let toSetChip = chip;
        if(chip.needValue){
          toSetChip = {
            ...chip,
            value: allData
          }
        }
        this.chips.push(toSetChip);
      }
    }
  }

  getColor(chip: ChipData){
    if(chip.colors != undefined && chip.colors.length > 0){
      if(chip.needValue != true){
        return chip.colors[0];
      }else if(chip.colorPropName != undefined && chip.colorDivides != undefined){
        let index = 0;
        let target = chip.value[chip.colorPropName];
        for(let v of chip.colorDivides){
          if(target > v){
            ++index;
          }else{
            break;
          }
        }
        if(index < chip.colors.length){
          return chip.colors[index];
        }
      }
      return chip.colors[0];
    }else{
      return "";
    }
  }

  private floorIndexByDichotomy(array: number[], target: number, start?: number, end?: number): number{
    if(start == undefined) start = 0;
    if(end == undefined) end = array.length - 1;
    let center = Math.floor((start + end) / 2);
    if(center == start){
      return start;
    }
    if(target < array[center]){
      return this.floorIndexByDichotomy(array, target, start, center);
    }else if(target > array[center]){
      return this.floorIndexByDichotomy(array, target, center, end);
    }else{
      return center;
    }
  }
}
