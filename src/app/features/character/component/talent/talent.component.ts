import { PercentPipe, DecimalPipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NoCommaPipe } from 'src/app/shared/pipe/no-comma.pipe';
import { character, CharSkill, CharSkillDescObject, CharSkills, TYPE_SYS_LANG } from 'src/app/shared/shared.module';

interface levelOption {
  level: string;
  levelNum: number;
}

@Component({
  selector: 'app-talent',
  templateUrl: './talent.component.html',
  styleUrls: ['./talent.component.css']
})
export class TalentComponent implements OnInit {

  private readonly minLevel = 1;
  private readonly maxLevel = 15;
  private readonly defaultLevel = 10;

  readonly skills = ['normal', 'skill', 'elemental_burst'];
  readonly otherSkills = ['other'];
  readonly prundSkills = ['proudSkills']
  readonly levelPadNum = 2;

  readonly props = ['LEVEL', 'HP', 'ATTACK', 'DEFENSE'];
  readonly props_sub = [
    'HP_UP', 'ATTACK_UP', 'DEFENSE_UP',
    'CRIT_RATE', 'CRIT_DMG', 'ENERGY_RECHARGE',
    'HEALING_BONUS', 'REVERSE_HEALING_BONUS',
    'ELEMENTAL_MASTERY', 'DMG_BONUS_CRYO', 'DMG_BONUS_ANEMO',
    'DMG_BONUS_PHYSICAL', 'DMG_BONUS_ELECTRO', 'DMG_BONUS_GEO',
    'DMG_BONUS_PYRO', 'DMG_BONUS_HYDRO', 'DMG_BONUS_DENDRO',
    'DMG_BONUS_ALL', 'DMG_BONUS_NORMAL', 'DMG_BONUS_CHARGED',
    'DMG_BONUS_PLUNGING', 'DMG_BONUS_SKILL', 'DMG_BONUS_ELEMENTAL_BURST',
  ];
  readonly percent_props = [
    'HP_UP', 'ATTACK_UP', 'DEFENSE_UP',
    'CRIT_RATE', 'CRIT_DMG', 'ENERGY_RECHARGE',
    'HEALING_BONUS', 'REVERSE_HEALING_BONUS', 'DMG_BONUS_CRYO',
    'DMG_BONUS_ANEMO', 'DMG_BONUS_PHYSICAL', 'DMG_BONUS_ELECTRO',
    'DMG_BONUS_GEO', 'DMG_BONUS_PYRO', 'DMG_BONUS_HYDRO',
    'DMG_BONUS_DENDRO', 'DMG_BONUS_ALL', 'DMG_BONUS_NORMAL',
    'DMG_BONUS_CHARGED', 'DMG_BONUS_PLUNGING', 'DMG_BONUS_SKILL',
    'DMG_BONUS_ELEMENTAL_BURST',
  ]

  //キャラデータ
  @Input('data') data!: character;
  //言語
  @Input('language') currentLanguage!: TYPE_SYS_LANG;
  //レベルオプションリスト
  levelOptions: levelOption[] = [];
  //選択されたレベルリスト
  selectedLevels: levelOption[] = [];

  constructor(private percentPipe: PercentPipe, private decimalPipe: DecimalPipe, private noCommaPipe: NoCommaPipe) { }

  ngOnInit(): void {
    //レベル初期設定
    for (let i = this.minLevel; i <= this.maxLevel; ++i) {
      this.levelOptions.push({
        level: i.toString().padStart(this.levelPadNum, '0'),
        levelNum: i,
      });
    }
    //初期選択
    this.selectedLevels = Array.from({ length: this.skills.length }).map((_, i) => this.levelOptions[this.defaultLevel - 1]);
    this.selectedLevels.forEach((v, i) => {
      this.onChangeLevel(this.skills[i], v);
    });
  }

  onChangeLevel(propName: string, value: levelOption) {
    //TODO
  }

  getDataProperty(key: string): CharSkill {
    return this.data.skills[key as keyof CharSkills] as CharSkill;
  }

  getDataProperties(key: string): CharSkill[] {
    return this.data.skills[key as keyof CharSkills] as CharSkill[];
  }

  getCharSkillDescObject(key: string, lang: TYPE_SYS_LANG): CharSkillDescObject[] {
    return this.getDataProperty(key).paramDescSplitedList[lang];
  }

  getTalentValue(key: string, obj: CharSkillDescObject, lang: TYPE_SYS_LANG, currentLevel: string, withOrigin: boolean = false): string {
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
