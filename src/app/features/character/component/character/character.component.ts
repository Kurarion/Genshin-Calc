import { Component, Input, OnInit } from '@angular/core';
import { character, CharStatus, Const, ExtraDataService, HttpService, TYPE_SYS_LANG } from 'src/app/shared/shared.module';

interface levelOption {
  level: string;
  levelNum: number;
  isAscend?: boolean;
}

interface subProp {
  isPercent: boolean;
  value: any;
}

@Component({
  selector: 'app-character',
  templateUrl: './character.component.html',
  styleUrls: ['./character.component.css']
})
export class CharacterComponent implements OnInit {

  private readonly minLevel = 1;
  private readonly maxLevel = 90;
  private readonly ascendLevels = [20, 40, 50, 60, 70, 80, 90];
  private readonly levelPadNum = 2;

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
  //キャラアイコン
  avatarURL!: string;
  //キャラアイコンローディングフラグ
  avatarLoadFlg!: boolean;
  //レベルオプション
  levelOptions: levelOption[] = [];
  //選択されたレベル
  selectedLevel!: levelOption;
  //選択されたレベル属性
  selectedLevelProps!: Record<string, subProp>;

  constructor(private httpService: HttpService, private extraDataService: ExtraDataService) { }

  ngOnInit(): void {
    //プロフィール画像初期化
    this.initializeBackGroundImage();
    //レベルリスト初期化
    for (let i = this.minLevel; i <= this.maxLevel; ++i) {
      this.levelOptions.push({
        level: i.toString().padStart(this.levelPadNum, '0'),
        levelNum: i,
      });
      if (this.ascendLevels.includes(i) && i != this.maxLevel) {
        this.levelOptions.push({
          level: i.toString().padStart(this.levelPadNum, '0') + '+',
          levelNum: i,
          isAscend: true,
        });
      }
    }
    //初期選択
    this.selectedLevel = this.levelOptions[this.levelOptions.length - 1];
    this.onChangeLevel(this.selectedLevel);
  }

  /**
   * レベル変更処理
   * @param value 
   */
  onChangeLevel(value: levelOption) {
    this.selectedLevelProps = {};
    let temp = this.data.levelMap[value.level];
    for (let key in temp) {
      let upperKey = key.toUpperCase();
      this.selectedLevelProps[upperKey] = {
        isPercent: this.percent_props.includes(upperKey),
        value: temp[key as keyof CharStatus],
      }
    }
  }

  /**
   * プロフィール画像初期化
   */
  private initializeBackGroundImage() {
    if (!this.avatarURL) {
      this.avatarLoadFlg = false;
      let url = this.data.images.icon;
      this.httpService.get<Blob>(url, 'blob').then((v: Blob | null) => {
        if (v) {
          this.avatarURL = window.URL.createObjectURL(v);
          setTimeout(() => {
            this.avatarLoadFlg = true;
          }, 100)
        }
      }).catch(()=>{});
    }
  }

}
