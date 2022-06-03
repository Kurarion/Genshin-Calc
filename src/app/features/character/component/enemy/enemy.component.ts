import { Component, Input, OnInit } from '@angular/core';
import { enemy, HttpService, LanguageService, TYPE_SYS_LANG, EnemyService, EnemyStatus, ExtraDataService } from 'src/app/shared/shared.module';

interface levelOption {
  level: string;
  levelNum: number;
  isAscend?: boolean;
}

interface subProp {
  isPercent: boolean;
  value: any;
}

interface enemyOption {
  index: string;
  names: Record<TYPE_SYS_LANG, string>;
  codeName: string;
  enemyType: string;
}

@Component({
  selector: 'app-enemy',
  templateUrl: './enemy.component.html',
  styleUrls: ['./enemy.component.css']
})
export class EnemyComponent implements OnInit {

  private readonly minLevel = 1;
  private readonly maxLevel = 100;
  private readonly defaultLevel = 90;

  private readonly minPlayerNum = 1;
  private readonly maxPlayerNum = 4;
  readonly hpRates = [1.0, 1.5, 2.0, 2.5];
  readonly attackRates = [1.0, 1.10, 1.25, 1.40];
  private readonly levelPadNum = 3;

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
    "DMG_ANTI_CRYO", "DMG_ANTI_ANEMO", "DMG_ANTI_PHYSICAL",
    "DMG_ANTI_ELECTRO", "DMG_ANTI_GEO", "DMG_ANTI_PYRO",
    "DMG_ANTI_HYDRO", "DMG_ANTI_DENDRO"
  ];
  readonly percent_props = [
    'HP_UP', 'ATTACK_UP', 'DEFENSE_UP',
    'CRIT_RATE', 'CRIT_DMG', 'ENERGY_RECHARGE',
    'HEALING_BONUS', 'REVERSE_HEALING_BONUS', 'DMG_BONUS_CRYO',
    'DMG_BONUS_ANEMO', 'DMG_BONUS_PHYSICAL', 'DMG_BONUS_ELECTRO',
    'DMG_BONUS_GEO', 'DMG_BONUS_PYRO', 'DMG_BONUS_HYDRO',
    'DMG_BONUS_DENDRO', 'DMG_BONUS_ALL', 'DMG_BONUS_NORMAL',
    'DMG_BONUS_CHARGED', 'DMG_BONUS_PLUNGING', 'DMG_BONUS_SKILL',
    'DMG_BONUS_ELEMENTAL_BURST', "DMG_ANTI_CRYO", "DMG_ANTI_ANEMO",
    "DMG_ANTI_PHYSICAL", "DMG_ANTI_ELECTRO", "DMG_ANTI_GEO",
    "DMG_ANTI_PYRO", "DMG_ANTI_HYDRO", "DMG_ANTI_DENDRO"
  ]

  //言語
  @Input('language') currentLanguage!: TYPE_SYS_LANG;
  //敵リスト
  enemyList: enemyOption[] = [];
  //選択された敵インデックス
  selectedEnemyIndex!: string;

  //敵データ
  enemyData!: enemy;
  //アイコン
  avatarURL!: string;
  //アイコンローディングフラグ
  avatarLoadFlg!: boolean;

  //レベル選択オプションリスト
  levelOptions: levelOption[] = [];
  //プレイヤー数オプションリスト
  playerNumOptions: number[] = [];

  //選択されたレベル
  selectedLevel!: levelOption;
  //選択されたプレイヤー数
  selectedPlayerNum!: number;
  //選択されたレベル属性
  selectedLevelProps!: Record<string, subProp>;

  constructor(private httpService: HttpService, private enemyService: EnemyService, private languageService: LanguageService,
    private extraDataService: ExtraDataService) { }

  ngOnInit(): void {
    //敵リスト初期化
    this.initializeEnemyList();
    //その他
    for (let i = this.minLevel; i <= this.maxLevel; ++i) {
      this.levelOptions.push({
        level: i.toString().padStart(this.levelPadNum, '0'),
        levelNum: i,
      });
    }
    for (let i = this.minPlayerNum; i <= this.maxPlayerNum; ++i) {
      this.playerNumOptions.push(i);
    }
    //敵初期選択
    this.selectedEnemyIndex = this.enemyList[0].index;
    this.selectedPlayerNum = this.minPlayerNum;
    //レベル初期選択
    this.selectedLevel = this.levelOptions[this.defaultLevel - 1];
    //初期データ更新
    this.onSelectEnemy(this.selectedEnemyIndex);
  }

  onSelectEnemy(enemyIndex: string) {
    //敵の切り替え
    this.enemyData = this.enemyService.get(enemyIndex);
    //DEBUG
    console.log(this.enemyData);
    //敵属性更新
    this.onChangeLevel(this.selectedLevel);
    // //プロフィール画像初期化
    // this.initializeBackGroundImage();
  }

  onChangeLevel(value: levelOption) {
    this.selectedLevelProps = {};
    let temp = this.enemyData.levelMap[value.level];
    for (let key in temp) {
      let upperKey = key.toUpperCase();
      this.selectedLevelProps[upperKey] = {
        isPercent: this.percent_props.includes(upperKey),
        value: temp[key as keyof EnemyStatus],
      }
    }
  }

  getPropRate(name: string): number[] {
    return this[name.toLocaleLowerCase() + 'Rates' as keyof EnemyComponent] as number[];
  }

  /**
   * プロフィール画像初期化
   */
  private initializeBackGroundImage() {
    this.avatarLoadFlg = false;
    let url = this.enemyData.images.icon;
    this.httpService.get<Blob>(url, 'blob').then((v: Blob | null) => {
      if (v) {
        this.avatarURL = window.URL.createObjectURL(v);
        setTimeout(() => {
          this.avatarLoadFlg = true;
        }, 100)
      }
    }).catch(() => { });
  }

  /**
   * 敵選択リスト初期化
   */
  private initializeEnemyList(lang?: TYPE_SYS_LANG) {
    this.enemyList = [];
    let tempMap = this.enemyService.getMap();
    for (let key in tempMap) {
      this.enemyList.push({
        index: key,
        names: tempMap[key].name,
        codeName: tempMap[key].monsterName,
        enemyType: tempMap[key].type,
      })
    }
  }

}
