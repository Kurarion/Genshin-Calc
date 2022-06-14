import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { enemy, HttpService, LanguageService, TYPE_SYS_LANG, EnemyService, EnemyStatus, ExtraDataService, character, Const, CalculatorService } from 'src/app/shared/shared.module';

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

  readonly props = Const.PROPS_CHARA_ENEMY_BASE;
  readonly props_sub = Const.PROPS_ENEMY_SUB;
  readonly percent_props = Const.PROPS_ENEMY_PERCENT;

  //キャラデータ
  @Input('data') data!: character;
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

  constructor(private httpService: HttpService, 
    private enemyService: EnemyService, 
    private calculatorService: CalculatorService,
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
    this.selectedEnemyIndex = this.enemyService.getIndex(this.data.id) ?? this.enemyList[0].index;
    this.selectedPlayerNum = this.getPlayerNumFromNumber(this.enemyService.getPlayerNum(this.data.id)) ?? this.minPlayerNum;
    //レベル初期選択
    this.selectedLevel = this.getLevelFromString(this.enemyService.getLevel(this.data.id)) ?? this.levelOptions[this.defaultLevel - 1];
    //初期データ更新
    this.onSelectEnemy(this.selectedEnemyIndex);
    this.onChangeLevel(this.selectedLevel);
    this.onChangePlayerNum(this.selectedPlayerNum);
  }

  ngOnDestroy(): void {
    //データ保存
    this.enemyService.saveData();
  }

  onSelectEnemy(enemyIndex: string) {
    //敵の切り替え
    this.enemyData = this.enemyService.get(enemyIndex);
    //DEBUG
    console.log(this.enemyData);
    //初期化
    this.calculatorService.initEnemyData(this.data.id, enemyIndex);
    //敵設定
    this.enemyService.setIndex(this.data.id, this.enemyData.id);
    // //敵属性更新
    // this.onChangeLevel(this.selectedLevel);
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
    //レベル設定
    this.enemyService.setLevel(this.data.id, value.level);
    //更新
    this.calculatorService.setDirtyFlag(this.data.id);
  }

  onChangePlayerNum(num: number) {
    //プレイヤー数設定
    this.enemyService.setPlayerNum(this.data.id, num);
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

  private getLevelFromString(level: string | undefined) {
    if (!level) {
      return undefined;
    }

    return this.levelOptions[parseInt(level) - 1];
  }

  private getPlayerNumFromNumber(playerNum: number | undefined) {
    if (!playerNum) {
      return undefined;
    }

    return playerNum;
  }

}
