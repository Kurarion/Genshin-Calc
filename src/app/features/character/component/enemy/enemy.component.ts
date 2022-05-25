import { Component, OnInit } from '@angular/core';
import { enemy, Const, HttpService, LanguageService, TYPE_SYS_LANG, EnemyService, EnemyStatus, ExtraDataService } from 'src/app/shared/shared.module';
import { environment } from 'src/environments/environment';

interface levelOption {
  level: number;
  isAscend?: boolean;
}

interface subProp {
  isPercent: boolean;
  value: any;
}

interface enemyOption {
  queryName: string;
  name: string;
  specialname: string;
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

  enemyList: enemyOption[] = [];
  selectedEnemyKey!: string;
  selectedEnemyAbleMaxLevel!: number;

  data!: enemy;
  dataForCal!: enemy;
  avatarURL!: string;
  avatarLoadFlg!: boolean;

  levelOptions: levelOption[] = [];
  playerNumOptions: number[] = [];

  selectedLevel!: levelOption;
  selectedPlayerNum!: number;
  selectedLevelProps!: Record<string, subProp>;

  constructor(private httpService: HttpService, private enemyService: EnemyService, private languageService: LanguageService,
    private extraDataService: ExtraDataService) {
    this.languageService.getLang().subscribe((lang: TYPE_SYS_LANG) => {
      //敵リスト再設定
      this.initializeEnemyList();
      //選択された敵データ更新
      if (this.selectedEnemyKey) {
        this.data = this.enemyService.get(this.selectedEnemyKey, lang);
      }
    })
  }

  ngOnInit(): void {
    //敵リスト初期化
    this.initializeEnemyList();
    //その他
    for (let i = this.minLevel; i <= this.maxLevel; ++i) {
      this.levelOptions.push({
        level: i,
      });
    }
    for (let i = this.minPlayerNum; i <= this.maxPlayerNum; ++i) {
      this.playerNumOptions.push(i);
    }
    //敵初期選択
    this.selectedEnemyKey = this.enemyList[0].queryName;
    this.selectedPlayerNum = this.minPlayerNum;
    //レベル初期選択
    this.selectedLevel = this.levelOptions[this.defaultLevel - 1];
    //初期データ更新
    this.onSelectEnemy(this.selectedEnemyKey);
  }

  onSelectEnemy(enemyKey: string) {
    //敵の切り替え
    this.data = this.enemyService.get(enemyKey);
    this.dataForCal = this.enemyService.get(enemyKey, Const.QUERY_LANG);
    console.log(this.data);
    //敵属性更新
    this.onChangeLevel(this.selectedLevel);
    //プロフィール画像初期化
    // this.initializeBackGroundImage();
  }

  onChangeLevel(value: levelOption) {
    this.selectedLevelProps = {};
    let temp = this.dataForCal.stats(value.level);
    for (let propName of this.props) {
      this.selectedLevelProps[propName] = {
        isPercent: false,
        value: temp[propName.toLowerCase() as keyof EnemyStatus],
      }
    }
  }

  getPropRate(name: string): number[]{
    return this[name.toLocaleLowerCase() + 'Rates' as keyof EnemyComponent] as number[];
  }

  /**
   * プロフィール画像初期化
   */
  private initializeBackGroundImage() {
    this.avatarLoadFlg = false;
    let url = this.data.images.nameicon;
    if (true) {
      url = environment.thirdPartyAPIHost + this.data.images.nameicon + environment.thirdPartyAPIPicType;
    }
    this.httpService.get<Blob>(url, 'blob').then((v: Blob | null) => {
      if (v) {
        this.avatarURL = window.URL.createObjectURL(v);
        setTimeout(() => {
          this.avatarLoadFlg = true;
        }, 100)
      }
    }).catch(()=>{});
  }

  /**
   * 敵選択リスト初期化
   */
  private initializeEnemyList(lang?: TYPE_SYS_LANG) {
    this.enemyList = [];
    this.enemyService.getMap(lang).forEach((value: enemy, key: string) => {
      this.enemyList.push({
        queryName: key,
        name: value.name,
        specialname: value.specialname,
        enemyType: value.enemytype,
      })
    })
  }

}
