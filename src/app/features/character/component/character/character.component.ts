import { ChangeDetectionStrategy, Component, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { CalculatorService, character, CharacterService, CharStatus, Const, ExpansionPanelCommon, ExtraDataService, HttpService, RelayoutMsgService, TYPE_SYS_LANG } from 'src/app/shared/shared.module';

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
export class CharacterComponent extends ExpansionPanelCommon implements OnInit, OnDestroy {

  private readonly minLevel = 1;
  private readonly maxLevel = 90;
  private readonly ascendLevels = [20, 40, 50, 60, 70, 80, 90];
  private readonly levelPadNum = 2;

  readonly props = Const.PROPS_CHARA_ENEMY_BASE;
  readonly props_sub = Const.PROPS_CHARA_WEAPON_SUB;
  readonly percent_props = Const.PROPS_CHARA_WEAPON_PERCENT;
  readonly props_all = Const.PROPS_ALL_DATA;
  readonly props_all_percent = Const.PROPS_ALL_DATA_PERCENT;

  //キャラデータ
  @Input('data') data!: character;
  //言語
  @Input('language') currentLanguage!: TYPE_SYS_LANG;
  //カード横幅
  @Input('cardWidth') cardWidth!: number;
  //Z-index
  @Input('zIndex') zIndex!: number;
  //命名
  @Input('name') name!: string;
  //ドラッグイベント
  @Output('draged') draged = new EventEmitter<string>();
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
  //計算後データ
  allData!: Record<string, number> | undefined;

  constructor(private httpService: HttpService, 
    private extraDataService: ExtraDataService, 
    private characterService: CharacterService,
    private calculatorService: CalculatorService,
    private relayoutMsgService: RelayoutMsgService,) { 
      super(relayoutMsgService);
    }

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
    this.selectedLevel = this.getLevelFromString(this.characterService.getLevel(this.data.id)) ?? this.levelOptions[this.levelOptions.length - 1];
    //初期データ更新
    this.onChangeLevel(this.selectedLevel);
    //計算後データ取得
    setTimeout(() => {
      this.getAllData();
    })
    setTimeout(() => {
      this.calculatorService.allDataChanged().subscribe(()=>{
        this.getAllData();
      })
    })
  }

  @HostListener('window:unload')
  ngOnDestroy(): void {
    //データ保存
    this.characterService.saveData();
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
    this.characterService.setLevel(this.data.id, value.level);
    //更新
    this.calculatorService.setDirtyFlag(this.data.id);
  }

  //ドラッグ開始
  onDrag(){
    this.draged.emit(this.name);
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
      }).catch(() => { });
    }
  }

  private getLevelFromString(level: string | undefined) {
    if (!level) {
      return undefined;
    }
    let levelNum = parseInt(level);
    let isAscend = level.includes("+");
    let index = -1;
    for (let i = 0; i < this.ascendLevels.length; ++i) {
      if(this.ascendLevels[i] < levelNum){
        ++index
      }else{
        break;
      }
    }
    let resultIndex = index + (isAscend ? 1 : 0) + levelNum;

    return this.levelOptions[resultIndex];
  }

  private getAllData(){
    this.allData = this.calculatorService.getAllDataCache(this.data.id);
  }

}
