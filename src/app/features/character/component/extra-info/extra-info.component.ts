import { DecimalPipe, PercentPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { CalculatorService, character, CharSkill, CharSkillDescObject, CharSkills, Const, NoCommaPipe, TYPE_SYS_LANG } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-extra-info',
  templateUrl: './extra-info.component.html',
  styleUrls: ['./extra-info.component.css']
})
export class ExtraInfoComponent implements OnInit {

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

  overrideElement: string = "";
  elementList!: string[];

  //データ
  skillDescDatas!: CharSkillDescObject[];
  //表示値
  showValues!: string[];
  //ヒント値
  tipValues!: string[];

  constructor(private percentPipe: PercentPipe, 
    private decimalPipe: DecimalPipe, 
    private noCommaPipe: NoCommaPipe,
    private calculatorService: CalculatorService) { }

  ngOnInit(): void { 
    this.initDatas();
  }

  // ngOnChanges(changes: SimpleChanges) {
  //   if (changes['currentLanguage'] || changes['skillLevelIndex']) {
  //     this.initDatas();
  //   }
  // }

  onChangeElement(value: string){ }

  private initDatas(){
    this.skillDescDatas = this.getCharSkillDescObject(this.skill, this.currentLanguage);
    this.showValues = [];
    this.tipValues = [];
    for(let skillDescData of this.skillDescDatas){
      this.showValues.push(this.getTalentValue(this.skill, skillDescData, this.currentLanguage, this.skillLevelIndex));
      this.tipValues.push(this.getTalentValue(this.skill, skillDescData, this.currentLanguage, this.skillLevelIndex, true));
    }

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
    obj.valuePropIndexs.forEach((index: number, i: number) => {
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
