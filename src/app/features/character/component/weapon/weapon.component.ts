import { Component, EventEmitter, HostListener, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { weapon, CharStatus, HttpService, TYPE_SYS_LANG, WeaponService, ExtraDataService, character, Const, CalculatorService, RelayoutMsgService, ExpansionPanelCommon } from 'src/app/shared/shared.module';
import { environment } from 'src/environments/environment';

interface levelOption {
  level: string;
  levelNum: number;
  isAscend?: boolean;
}

interface subProp {
  isPercent: boolean;
  value: any;
}

interface weaponOption {
  index: string;
  names: Record<TYPE_SYS_LANG, string>;
  rankLevel: number;
  weaponType: string;
}

@Component({
  selector: 'app-weapon',
  templateUrl: './weapon.component.html',
  styleUrls: ['./weapon.component.css']
})
export class WeaponComponent extends ExpansionPanelCommon implements OnInit, OnDestroy, OnChanges {

  private readonly notExitLevel = -1;
  private readonly minLevel = 1;
  private readonly maxLevel = 90;
  private readonly minSmeltingLevel = 1;
  private readonly maxSmeltingLevel = 5;
  private readonly defaultSmeltingLevel = this.minSmeltingLevel.toString();
  private readonly ascendLevels = [20, 40, 50, 60, 70, 80, 90];
  private readonly ascendLevelsMap: Record<number, number> = {
    5: 6,
    4: 6,
    3: 6,
    2: 4,
    1: 4,
  }
  private readonly levelPadNum = 2;
  private readonly smeltingLevelPadNum = 1;

  readonly name_effect = Const.NAME_EFFECT;

  readonly props = Const.PROPS_WEAPON_BASE;
  readonly props_sub = Const.PROPS_CHARA_WEAPON_SUB;
  readonly percent_props = Const.PROPS_CHARA_WEAPON_PERCENT;

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
  //武器タイプ
  charWeaponType!: string;
  //武器リスト
  weaponList: weaponOption[] = [];
  //選択された武器インデックス
  selectedWeaponIndex!: string;
  //選択された武器マックスレベル
  selectedWeaponAbleMaxLevel!: number;
  //選択された武器マックス精錬レベル
  selectedWeaponAbleMaxSmeltingLevel!: number;

  //武器データ
  weaponData!: weapon;
  //アイコン
  avatarURL!: string;
  //アイコンローディングフラグ
  avatarLoadFlg!: boolean;
  //レベル選択オプションリスト
  levelOptions: levelOption[] = [];
  //選択されたレベル
  selectedLevel!: levelOption;
  //選択されたレベル属性
  selectedLevelProps!: Record<string, subProp>;
  //突破レベルオプションリスト
  smeltingLevelOptions: string[] = [];
  //選択された突破レベル
  selectedSmeltingLevel!: string;

  //表示用
  effectNameRecord!: Record<TYPE_SYS_LANG, string>;
  effectName!: string;
  effectContentRecord!: Record<TYPE_SYS_LANG, string>;
  effectContent!: string;
  effectValidIndexes!: number[];

  listFilterFunc!: ((value:any) => boolean);

  constructor(private httpService: HttpService,
    public weaponService: WeaponService,
    private calculatorService: CalculatorService,
    private extraDataService: ExtraDataService,
    private relayoutMsgService: RelayoutMsgService,) { 
      super(relayoutMsgService, 1);
      this.setExpandStatus(0, true);
    }

  ngOnInit(): void {
    //武器タイプ設定
    this.charWeaponType = this.data.weaponType;
    //フィルター関数
    this.listFilterFunc = ((weapon: any)=>weapon.weaponType == this.charWeaponType);
    //武器リスト初期化
    this.initializeWeaponList();
    //その他
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
    for (let i = this.minSmeltingLevel; i <= this.maxSmeltingLevel; ++i) {
      this.smeltingLevelOptions.push(i.toString().padStart(this.smeltingLevelPadNum, '0'));
    }
    //武器初期選択
    let storageWeaponIndex = this.weaponService.getIndex(this.data.id);
    if(storageWeaponIndex){
      this.selectedWeaponIndex = storageWeaponIndex;
    }else{
      for (let i = 1; i < this.weaponList.length; ++i) {
        if (this.weaponList[i].weaponType == this.charWeaponType && this.weaponList[i].rankLevel == this.maxSmeltingLevel) {
          this.selectedWeaponIndex = this.weaponList[i].index;
          break;
        }
      }
    }
    //レベル初期選択
    this.selectedLevel = this.getLevelFromString(this.weaponService.getLevel(this.data.id)) ?? this.levelOptions[this.levelOptions.length - 1];
    this.selectedSmeltingLevel = this.getSmeltingLevelFromString(this.weaponService.getSmeltingLevel(this.data.id)) ?? this.defaultSmeltingLevel;
    //初期データ更新
    this.onSelectWeapon(this.selectedWeaponIndex);
    this.onChangeLevel(this.selectedLevel);
    this.onChangeSmeltingLevel(this.selectedSmeltingLevel);
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes['currentLanguage']) {
      if(this.effectNameRecord != undefined){
        this.effectName = this.effectNameRecord[this.currentLanguage];
      }
      if(this.effectContentRecord != undefined){
        this.effectContent = this.effectContentRecord[this.currentLanguage];
      }
    }
  }

  updateRecords(){
    if(this.weaponData.skillAffixMap){
      this.effectNameRecord = this.getEffectName(this.selectedSmeltingLevel);
      this.effectContentRecord = this.getEffectContent(this.selectedSmeltingLevel);
      this.effectValidIndexes = this.getEffectValidIndexes(this.selectedSmeltingLevel);
      this.effectName = this.effectNameRecord[this.currentLanguage];
      this.effectContent = this.effectContentRecord[this.currentLanguage];
    }else{
      this.effectValidIndexes = [];
      this.effectName = "";
      this.effectContent = "";
    }
  }

  @HostListener('window:unload')
  ngOnDestroy(): void {
    //データ保存
    this.weaponService.saveData();
  }

  /**
   * 武器変更処理
   * @param weaponIndex 
   */
  onSelectWeapon(weaponIndex: string) {
    this.selectedWeaponIndex = weaponIndex;
    let oldWeaponAbleMaxLevel = this.notExitLevel;
    if (this.weaponData) {
      //旧武器最高レベル
      oldWeaponAbleMaxLevel = this.ascendLevels[this.ascendLevelsMap[this.weaponData.rankLevel]];
      //旧追加データクリア
      this.weaponService.clearExtraData(this.data.id);
    }
    //武器の切り替え
    this.weaponData = this.weaponService.get(weaponIndex);
    if(environment.outputLog){
      //DEBUG
      console.log(this.weaponData);
    }
    //武器最高レベル
    this.selectedWeaponAbleMaxLevel = this.ascendLevels[this.ascendLevelsMap[this.weaponData.rankLevel]];
    // if (oldWeaponAbleMaxLevel == this.notExitLevel || oldWeaponAbleMaxLevel == this.selectedLevel.levelNum || this.selectedLevel.levelNum > this.selectedWeaponAbleMaxLevel) {
    //   //実行あり得ない（三星以上）
    //   this.selectedLevel = this.getLevelFromString(this.weaponService.getLevel(this.data.id)) ?? this.levelOptions[this.selectedWeaponAbleMaxLevel + this.ascendLevels.indexOf(this.selectedWeaponAbleMaxLevel) - 1];
    // }
    //武器最高精錬レベル
    this.selectedWeaponAbleMaxSmeltingLevel = Object.keys(this.weaponData.skillAffixMap??{}).length;
    if (this.selectedWeaponAbleMaxSmeltingLevel != 0 && parseInt(this.selectedSmeltingLevel) > this.selectedWeaponAbleMaxSmeltingLevel){
      this.selectedSmeltingLevel = this.selectedWeaponAbleMaxSmeltingLevel.toString();
      //武器突破レベル設定
      this.weaponService.setSmeltingLevel(this.data.id, this.selectedSmeltingLevel);
      //更新
      this.calculatorService.initExtraWeaponData(this.data.id);
    }
    //追加データ更新
    this.weaponService.setDefaultExtraData(this.data.id, weaponIndex);
    this.calculatorService.initWeaponData(this.data.id, weaponIndex);
    //武器属性更新
    this.onChangeLevel(this.selectedLevel);
    //表示用更新
    this.updateRecords();
    //プロフィール画像初期化
    this.initializeBackGroundImage();
    //武器設定
    this.weaponService.setIndex(this.data.id, this.weaponData.id);
  }

  /**
   * レベル変更処理
   * @param value 
   */
  onChangeLevel(value: levelOption) {
    this.selectedLevelProps = {};
    let temp = this.weaponData.levelMap[value.level];
    for (let key in temp) {
      let upperKey = key.toUpperCase();
      this.selectedLevelProps[upperKey] = {
        isPercent: this.percent_props.includes(upperKey),
        value: temp[key as keyof CharStatus],
      }
    }
    //武器レベル設定
    this.weaponService.setLevel(this.data.id, value.level);
    //更新
    this.calculatorService.setDirtyFlag(this.data.id);
  }

  /**
   * 突破レベル変更処理
   * @param value 
   */
  onChangeSmeltingLevel(value: string) {
    //武器突破レベル設定
    this.weaponService.setSmeltingLevel(this.data.id, value);
    //更新
    this.calculatorService.initExtraWeaponData(this.data.id);
    //表示用更新
    this.updateRecords();
  }

  getEffectName(selectedSmeltingLevel: string): Record<TYPE_SYS_LANG, string> {
    return this.weaponData.skillAffixMap[selectedSmeltingLevel]!.name;
  }

  getEffectContent(selectedSmeltingLevel: string): Record<TYPE_SYS_LANG, string> {
    return this.weaponData.skillAffixMap[selectedSmeltingLevel]!.desc;
  }

  getEffectValidIndexes(selectedSmeltingLevel: string): number[]{
    return this.weaponData.skillAffixMap[selectedSmeltingLevel].paramValidIndexes;
  }

  //ドラッグ開始
  onDrag(){
    this.draged.emit(this.name);
  }

  /**
   * プロフィール画像初期化
   */
  private initializeBackGroundImage() {
    this.avatarLoadFlg = false;
    let url = this.weaponData.images.icon;
    this.httpService.get<Blob>(url, 'blob', true).then((v: Blob | null) => {
      if (v) {
        this.avatarURL = window.URL.createObjectURL(v);
        setTimeout(() => {
          this.avatarLoadFlg = true;
        }, 100)
      }
    }).catch(() => { });
  }

  /**
   * 武器選択リスト初期化
   */
  private initializeWeaponList() {
    this.weaponList = [];
    let tempMap = this.weaponService.getMap();
    for (let key in tempMap) {
      this.weaponList.push({
        index: key,
        names: tempMap[key].name,
        rankLevel: tempMap[key].rankLevel,
        weaponType: tempMap[key].weaponType,
      })
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

  private getSmeltingLevelFromString(smeltingLevel: string | undefined) {
    if (!smeltingLevel) {
      return undefined;
    }

    return smeltingLevel;
  }

}
