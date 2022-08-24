import { ChangeDetectionStrategy, Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { ArtifactService, ArtifactStorageInfo, ArtifactStoragePartData, ChipData, Const, GenshinDataService } from 'src/app/shared/shared.module';

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
    private artifactService: ArtifactService) { }

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
    let allData: Record<string, number>;
    let isFull: boolean;
    let tempData;
    isFull = this.isFull != undefined && this.isFull == true;
    allData = {};
    allData[Const.ALL_PROPS_KEY] = 0;
    for(let part of this.parts){
      if(isFull){
        partData = this.artifactService.getStorageInfo(this.characterIndex, this.index, part.toLowerCase());
      }else{
        partData = this.artifactService.getStorageInfo(this.characterIndex, this.index, this.partName.toLowerCase());
      }
      for(let sub of this.subs){
        tempData = partData[sub.toLowerCase()];
        if(tempData.name != undefined){
          let indexValue = this.dataReliquaryAffix[tempData.name].indexOf(tempData.value!);
          allData[tempData.name] = (allData[tempData.name] ?? 0) + +(indexValue * 100/this.subMax).toFixed(this.fixNum);
        }
      }
      {
        tempData = partData[Const.ARTIFACT_MAIN.toLowerCase()];
        if(tempData.name != undefined){
          allData[Const.ARTIFACT_MAIN + Const.CONCATENATION_CHIP + tempData.name] = (allData[Const.ARTIFACT_MAIN + Const.CONCATENATION_CHIP + tempData.name] ?? 0) + 1;
        }
      }
      if(!isFull){
        break;
      }
    }
    for(let key of Const.PROPS_ARTIFACT_SUB){
      if(allData[key] != undefined){
        allData[Const.ALL_PROPS_KEY] += allData[key];
      }
    }
    allData[Const.ALL_PROPS_KEY] = +allData[Const.ALL_PROPS_KEY].toFixed(this.fixNum);
    if(isFull){
      for(let key in allData){
        if(key.includes(Const.ARTIFACT_MAIN + Const.CONCATENATION_CHIP)){
          continue; 
        }
        allData[key] = +(allData[key] / this.parts.length).toFixed(this.fixNum);
      }
    }
    //補足
    for(let toAddProp of Const.PROPS_ARTIFACT_SUB){
      if(allData[toAddProp] == undefined){
        allData[toAddProp] = 0;
      }
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
}
