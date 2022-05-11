import { PercentPipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { character, characterTalents, CharStatus, CharTalentCombatInfo, CharTalentCombatPassiveType, CharTalentObject, Const, HttpService } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-talent',
  templateUrl: './talent.component.html',
  styleUrls: ['./talent.component.css']
})
export class TalentComponent implements OnInit {

  private readonly minLevel = 1;
  private readonly maxLevel = 15;
  private readonly defaultLevel = 10;
  readonly combatPrefix = 'combat';
  readonly combatspPrefix = 'combatsp';
  readonly passivefix = 'passive';
  readonly combats = ['combat1', 'combat2', 'combat3'];
  readonly combatsps = ['combatsp'];
  readonly passives = ['passive1', 'passive2', 'passive3'];
  readonly combatNum: CharTalentCombatPassiveType[] = [1, 2, 3];
  readonly combatspNum: CharTalentCombatPassiveType[] = ['sp'];
  readonly passiveNum: CharTalentCombatPassiveType[] = [1, 2, 3];

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

  @Input('data') data!: character;
  @Input('dataForCal') dataForCal!: character;
  avatarURL!: string;
  avatarLoadFlg!: boolean;

  levelOptions: number[] = [];

  selectedLevels: number[] = [];
  constructor(private percentPipe: PercentPipe) { }

  ngOnInit(): void {
    //その他
    for (let i = this.minLevel; i <= this.maxLevel; ++i) {
      this.levelOptions.push(i);
    }
    //初期選択
    this.selectedLevels = Array.from({ length: this.combatNum.length }).map((_, i) => this.defaultLevel);
    this.selectedLevels.forEach((v, i) => {
      this.onChangeLevel((i + 1) as CharTalentCombatPassiveType, v);
    });
  }

  onChangeLevel(index: CharTalentCombatPassiveType, value: number) {

  }

  getDataProperty(key: string){
    return this.data.talents![key as keyof characterTalents];
  }

  getTalentValue(index: CharTalentCombatPassiveType, obj: CharTalentObject, currentLevel: number, withOrigin: boolean = false): string {
    let result = obj.prefix;
    let values: string[] = [];
    obj.valuePropKeys.forEach((key: string) => {
      let value: string | number = (this.data.talents!['combat' + index as keyof characterTalents] as CharTalentCombatInfo).attributes.parameters[key][currentLevel - 1];
      if (!withOrigin && obj.isPercent) {
        value = this.percentPipe.transform(value, '1.0-1') as string;
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
