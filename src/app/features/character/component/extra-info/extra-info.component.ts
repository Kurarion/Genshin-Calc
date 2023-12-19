import { DecimalPipe, PercentPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { CalculatorService, character, CharacterService, CharSkill, CharSkillDescObject, CharSkills, Const, NoCommaPipe, RelayoutMsgService, TYPE_SYS_LANG } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-extra-info',
  templateUrl: './extra-info.component.html',
  styleUrls: ['./extra-info.component.css']
})
export class ExtraInfoComponent implements OnInit, OnChanges {

  //キャラデータ
  @Input('data') data!: character;
  //スキルタイプ
  @Input('skill') skill!: string;
  //言語
  @Input('language') currentLanguage!: TYPE_SYS_LANG;
  //スキルレベルインデックス
  @Input('skillLevelIndex') skillLevelIndex!: string;
  //
  @Input('hasLevel') hasLevel!: boolean;

  overrideElement!: string;
  elementList!: string[];

  //データ
  skillDescDatas!: CharSkillDescObject[];
  //表示値
  showValues!: string[];
  //ヒント値
  tipValues!: string[];

  //通常攻撃
  isNormal!: boolean;
  //元素付与変更検知
  elementChangedSub!: Subscription;

  //ループ用リスト
  tempDataList: number[] = [];

  constructor(private percentPipe: PercentPipe, 
    private decimalPipe: DecimalPipe, 
    private noCommaPipe: NoCommaPipe,
    private calculatorService: CalculatorService,
    private characterService: CharacterService,
    private relayoutMsgService: RelayoutMsgService,) { }

  ngOnInit(): void {
    this.isNormal = this.skill == 'normal';
    if(this.isNormal){
      this.elementChangedSub = this.characterService.getOverrideElementChanged().subscribe(()=>{
        //元素付与更新
        this.overrideElement = this.characterService.getOverrideElement(this.data.id);
      });
    }
    this.initDatas();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['currentLanguage'] || changes['skillLevelIndex']) {
      this.initDatas();
    }
  }

  ngOnDestroy(): void {
    if(this.isNormal && !this.elementChangedSub.closed){
      this.elementChangedSub.unsubscribe();
    }
  }

  onChangeElement(value: string){
    this.overrideElement = value;
    this.characterService.setOverrideElement(this.data.id, value);
    this.relayoutMsgService.update("changeOverrideElement");
  }

  private initDatas(){
    this.skillDescDatas = this.getCharSkillDescObject(this.skill, this.currentLanguage);
    if(this.tempDataList.length != this.skillDescDatas.length) {
      this.tempDataList = new Array(this.skillDescDatas.length).fill(0);
    }
    this.showValues = [];
    this.tipValues = [];
    for(let skillDescData of this.skillDescDatas){
      this.showValues.push(this.getTalentValue(this.skill, skillDescData, this.currentLanguage, this.skillLevelIndex));
      this.tipValues.push(this.getTalentValue(this.skill, skillDescData, this.currentLanguage, this.skillLevelIndex, true));
    }

    //元素付与初期化
    this.overrideElement = this.characterService.getOverrideElement(this.data.id);
    //元素上書き
    this.elementList = Const.PROPS_ELEMENTS;
  }

  private getDataProperty(key: string): CharSkill {
    return this.data.skills[key as keyof CharSkills] as CharSkill;
  }

  private getDataProperties(key: string): CharSkill[] {
    return this.data.skills[key as keyof CharSkills] as CharSkill[];
  }

  private getCharSkillDescObject(key: string, lang: TYPE_SYS_LANG): CharSkillDescObject[] {
    return this.getDataProperty(key).paramDescSplitedList[lang];
  }

  private getTalentValue(key: string, obj: CharSkillDescObject, lang: TYPE_SYS_LANG, currentLevel: string, withOrigin: boolean = false): string {
    let result = obj.prefix;
    let values: string[] = [];
    obj.valuePropIndexes.forEach((index: number, i: number) => {
      let value: string | number = (this.data.skills[key as keyof CharSkills] as CharSkill).paramMap[currentLevel][index];
      if (!withOrigin) {
        if (obj.isPercent[i]) {
          value = this.percentPipe.transform(value, '1.0-1') as string;
        } else {
          value = this.noCommaPipe.transform(this.decimalPipe.transform(value, '1.0-1') as string);
        }
      }
      values.push(`${value}`);
    })
    let middlesLength = 0;
    let middlesMaxLength = obj.middles.length;
    for (let i = 0; i < values.length; ++i) {
      result += values[i];
      if (middlesLength < middlesMaxLength) {
        result += obj.middles[middlesLength++];
      }
    }
    result += obj.suffix;

    return result;
  }

}
