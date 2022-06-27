import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { CharacterService, Const, character, weapon, CharStatus, EnemyService, enemy, EnemyStatus, ExtraDataService, WeaponService, WeaponStatus, ExtraCharacterData, ExtraSkillBuff, ExtraStatus, CharSkill, ExtraSkillInfo, WeaponSkillAffix, ExtraCharacterSkills, CharSkills, artifactStatus, ArtifactService, ExtraArtifact, ExtraArtifactSetData, ArtifactSetAddProp, OtherService, OtherStorageInfo } from 'src/app/shared/shared.module';

export interface CalResult{
  characterData?: character;
  weaponData?: weapon;
  enemyData?: enemy;
  extraCharaResult?: Record<string, number>;
  extraWeaponResult?: Record<string, number>;
  extraArtifactSetResult?: Record<string, number>;
  extraSpecialCharaResult?: SpecialBuff[];
  extraSpecialWeaponResult?: SpecialBuff[];
  extraSpecialArtifactSetResult?: SpecialBuff[];
  allData?: Record<string, number>;
  isDirty?: boolean;
}

export interface SpecialBuff {
  target?: string;
  base?: string;
  baseModifyValue?: number;
  multiValue?: number;
  priority?: number;
  maxVal?: number;
  specialMaxVal?: SpecialBuffMaxVal;
}

export interface SpecialBuffMaxVal {
  base?: string;
  multiValue?: number;
}

export interface DamageParam {
  rate: number; //倍率
  base: string; //数値ベース
  elementBonusType: string; //元素タイプ
  attackBonusType: string; //攻撃タイプ
}

export interface DamageResult {
  elementBonusType: string;

  originDmg: number;
  critDmg: number;
  expectDmg: number;

  originVaporizeDmg?: number;//蒸発 1.5
  cirtVaporizeDmg?: number;//蒸発 1.5
  expectVaporizeDmg?: number;//蒸発 1.5

  originMeltDmg?: number;//溶解 2.0
  cirtMeltDmg?: number;//溶解 2.0
  expectMeltDmg?: number;//溶解 2.0

  overloadedDmg?: number;//過負荷
  burningDmg?: number;//燃焼
  electroChargedDmg?: number;//感電
  superconductDmg?: number;//超電導
  shieldHp?: number;//結晶
  destructionDmg?: number;//氷砕き

  swirlCryoDmg?: number;//拡散 氷
  swirlElectroDmg?: number;//拡散 雷
  swirlPyroDmg?: number;//拡散 火
  swirlHydroDmg?: number;//拡散 水
}

export interface HealingParam {
  rate?: number; //倍率
  base?: string; //数値ベース
  extra?: number; //追加値
  healingBonusType?: string; //治療タイプ
}

export interface HealingResult {
  healing: number;
}

export interface ShieldParam {
  rate?: number; //倍率
  base?: string; //数値ベース
  extra?: number; //追加値
}

export interface ShieldResult {
  shield: number;
}

export interface ProductParam {
  rate?: number; //倍率
  base?: string; //数値ベース
  extra?: number; //追加値
}

export interface ProductResult {
  product: number;
}

export interface BuffResult {
  valueIndex: number;
  type: string;
  switchValue?: boolean;
  sliderValue?: number;
  min?: number;
  max?: number;
  step?: number;
}

export interface artifactSetInfo {
  index: string;
  level: number;
}

interface SkillParamInf {
  paramMap?: Record<string, number[]>;
  paramList?: number[];
  addProps?: ArtifactSetAddProp[];
}

interface CharLevelConfig {
  skillLevel?: string;
  elementalBurstLevel?: string;
}

interface WeaponLevelConfig {
  smeltingLevel?: string;
}

const REACTION_RATE_1_5 = 1.5;
const REACTION_RATE_2_0 = 2.0;

const BASE_BURNING = [
  4.325,
  4.591666667,
  5,
  5.408333333,
  5.65,
  6.158333333,
  6.625,
  7.158333333,
  7.908333333,
  8.475,
  9.325,
  10.1,
  11.11666667,
  12.09166667,
  13.40833333,
  14.79166667,
  16.11666667,
  17.475,
  18.81666667,
  20.1,
  21.525,
  22.94166667,
  24.325,
  25.675,
  27.09166667,
  28.35,
  29.53333333,
  30.71666667,
  32.475,
  34.09166667,
  35.65,
  37.29166667,
  38.88333333,
  40.46666667,
  42.29166667,
  44.125,
  45.975,
  47.94166667,
  49.9,
  51.85,
  53.84166667,
  55.975,
  58.375,
  60.875,
  64.025,
  67.09166667,
  70.40833333,
  73.81666667,
  77.29166667,
  80.875,
  84.15,
  87.6,
  91.11666667,
  94.59166667,
  99.59166667,
  104.125,
  108.6166667,
  113.2166667,
  118.15,
  123.175,
  128.375,
  134.7916667,
  141.3833333,
  148.15,
  156.1166667,
  162.9083333,
  169.9,
  176.9916667,
  184.125,
  191.3833333,
  198.6833333,
  206.1583333,
  212.8416667,
  219.4666667,
  228.5583333,
  236.625,
  244.9,
  252.8416667,
  261.1833333,
  269.35,
  277.5,
  285.7166667,
  294.125,
  302.5,
  313.475,
  322.1583333,
  331.3833333,
  340.875,
  351.3166667,
  361.65,
]
const BASE_SUPERCONDUCT = [
  9,
  9,
  10,
  11,
  11,
  12,
  13,
  14,
  16,
  17,
  19,
  20,
  22,
  24,
  27,
  30,
  32,
  35,
  38,
  40,
  43,
  46,
  49,
  51,
  54,
  57,
  59,
  61,
  65,
  68,
  71,
  75,
  78,
  81,
  85,
  88,
  92,
  96,
  100,
  104,
  108,
  112,
  117,
  122,
  128,
  134,
  141,
  148,
  155,
  162,
  168,
  175,
  182,
  189,
  199,
  208,
  217,
  226,
  236,
  246,
  257,
  270,
  283,
  296,
  312,
  326,
  340,
  354,
  368,
  383,
  397,
  412,
  426,
  439,
  457,
  473,
  490,
  506,
  522,
  539,
  555,
  571,
  588,
  605,
  627,
  644,
  663,
  682,
  703,
  723,
]
const BASE_SWIRL = [
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  19,
  20,
  22,
  24,
  27,
  29,
  32,
  35,
  39,
  42,
  45,
  48,
  52,
  55,
  58,
  62,
  65,
  68,
  71,
  74,
  78,
  82,
  86,
  89,
  93,
  97,
  101,
  106,
  110,
  115,
  120,
  124,
  129,
  134,
  140,
  146,
  154,
  161,
  169,
  177,
  185,
  194,
  202,
  210,
  219,
  227,
  239,
  250,
  261,
  272,
  284,
  296,
  308,
  323,
  339,
  356,
  375,
  391,
  408,
  425,
  442,
  459,
  477,
  495,
  511,
  527,
  549,
  568,
  588,
  607,
  627,
  646,
  666,
  686,
  706,
  726,
  752,
  773,
  795,
  818,
  843,
  868,
]
const BASE_ELECTROCHARGED = [
  21,
  22,
  24,
  26,
  27,
  30,
  32,
  35,
  38,
  41,
  45,
  49,
  53,
  58,
  64,
  71,
  77,
  84,
  90,
  97,
  103,
  110,
  117,
  123,
  130,
  136,
  142,
  148,
  156,
  164,
  171,
  179,
  187,
  194,
  203,
  212,
  221,
  230,
  239,
  249,
  258,
  269,
  280,
  292,
  307,
  322,
  338,
  354,
  371,
  388,
  404,
  421,
  437,
  454,
  478,
  500,
  521,
  544,
  567,
  591,
  616,
  647,
  679,
  711,
  749,
  782,
  815,
  849,
  884,
  919,
  954,
  990,
  1021,
  1053,
  1097,
  1136,
  1175,
  1213,
  1254,
  1293,
  1332,
  1372,
  1412,
  1452,
  1505,
  1547,
  1591,
  1636,
  1686,
  1736,
]
const BASE_DESTRUCTION = [
  26,
  28,
  30,
  32,
  34,
  37,
  40,
  43,
  47,
  51,
  56,
  61,
  67,
  73,
  81,
  89,
  97,
  105,
  113,
  121,
  129,
  138,
  146,
  154,
  163,
  170,
  177,
  184,
  195,
  204,
  214,
  224,
  233,
  243,
  254,
  265,
  276,
  288,
  299,
  311,
  323,
  336,
  350,
  365,
  384,
  403,
  422,
  443,
  464,
  485,
  505,
  526,
  547,
  568,
  598,
  625,
  652,
  679,
  709,
  739,
  770,
  809,
  848,
  889,
  937,
  977,
  1019,
  1062,
  1105,
  1148,
  1192,
  1237,
  1277,
  1317,
  1371,
  1420,
  1469,
  1517,
  1567,
  1616,
  1665,
  1714,
  1765,
  1815,
  1881,
  1933,
  1988,
  2045,
  2108,
  2170,
]
const BASE_OVERLOADED = [
  34,
  37,
  40,
  43,
  45,
  49,
  53,
  58,
  63,
  68,
  74,
  81,
  89,
  97,
  107,
  118,
  129,
  139,
  150,
  161,
  172,
  183,
  194,
  206,
  217,
  226,
  236,
  246,
  259,
  273,
  285,
  298,
  311,
  324,
  338,
  353,
  368,
  383,
  399,
  415,
  431,
  448,
  467,
  487,
  512,
  537,
  563,
  590,
  618,
  647,
  674,
  701,
  729,
  757,
  797,
  833,
  869,
  906,
  945,
  986,
  1027,
  1078,
  1131,
  1185,
  1249,
  1303,
  1359,
  1416,
  1473,
  1531,
  1590,
  1649,
  1702,
  1755,
  1828,
  1893,
  1959,
  2022,
  2090,
  2155,
  2220,
  2286,
  2353,
  2420,
  2508,
  2578,
  2651,
  2727,
  2810,
  2894,
]
const BASE_SHIELD = [
  91.18,
  98.71,
  106.24,
  113.76,
  121.29,
  128.82,
  136.35,
  143.88,
  151.41,
  158.94,
  169.99,
  181.08,
  192.19,
  204.05,
  215.94,
  227.86,
  247.69,
  267.54,
  287.43,
  303.83,
  320.23,
  336.63,
  352.32,
  368.01,
  383.70,
  394.43,
  405.18,
  415.95,
  426.74,
  437.54,
  450.60,
  463.70,
  476.85,
  491.13,
  502.55,
  514.01,
  531.41,
  549.98,
  568.58,
  585.00,
  605.67,
  626.39,
  646.05,
  665.76,
  685.50,
  700.84,
  723.33,
  745.87,
  768.44,
  786.79,
  809.54,
  832.33,
  855.16,
  878.04,
  899.48,
  919.36,
  946.04,
  974.76,
  1003.58,
  1030.08,
  1056.64,
  1085.25,
  1113.92,
  1149.26,
  1178.06,
  1200.22,
  1227.66,
  1257.24,
  1284.92,
  1314.75,
  1342.67,
  1372.75,
  1396.32,
  1427.31,
  1458.37,
  1482.34,
  1511.91,
  1541.55,
  1569.15,
  1596.81,
  1622.42,
  1648.07,
  1666.38,
  1684.68,
  1702.98,
  1726.10,
  1754.67,
  1785.87,
  1817.14,
  1851.06,
]

@Injectable({
  providedIn: 'root'
})
export class CalculatorService {

  //データマップ
  dataMap: Record<string, CalResult> = {};
  //変更検知
  private hasChanged: Subject<boolean> = new Subject<boolean>();
  private hasChanged$: Observable<boolean> = this.hasChanged.asObservable();

  constructor(
    private characterService: CharacterService,
    private weaponService: WeaponService,
    private extraDataService: ExtraDataService,
    private enemyService: EnemyService,
    private artifactService: ArtifactService,
    private otherService: OtherService,
  ) { }

  //更新フラグ設定
  setDirtyFlag(index: string | number){
    this.setDirty(index, true);
  }

  //更新フラグ取得
  isDirty(index: string | number){
    let indexStr = index.toString();
    return this.dataMap[indexStr]?.isDirty ?? false;
  }

  //変更検知
  changed(){
    return this.hasChanged$;
  }

  //初期化（キャラ）
  initCharacterData(index: string | number) {
    //DEBUG
    console.log("初期化（キャラ）")
    let indexStr = index.toString();
    if(!(indexStr in this.dataMap)){
      this.dataMap[indexStr] = {};
    }
    this.dataMap[indexStr].characterData = this.characterService.get(indexStr);
    this.initExtraCharacterData(indexStr);
  }
  
  //初期化（キャラ追加）
  initExtraCharacterData(index: string | number, data?: CharLevelConfig) {
    //DEBUG
    console.log("初期化（キャラ追加）")
    let indexStr = index.toString();
    let temps = this.getExtraCharacterData(indexStr, data);
    this.dataMap[indexStr].extraCharaResult = temps[0] as Record<string, number>;
    this.dataMap[indexStr].extraSpecialCharaResult = temps[1] as SpecialBuff[];
    this.setDirty(indexStr, true);
  }

  //初期化（武器）
  initWeaponData(index: string | number, weaponIndex: string | number) {
    //DEBUG
    console.log("初期化（武器）")
    let indexStr = index.toString();
    let weaponIndexStr = weaponIndex.toString();
    if(!(indexStr in this.dataMap)){
      this.dataMap[indexStr] = {};
    }
    this.dataMap[indexStr].weaponData = this.weaponService.get(weaponIndexStr);
    this.initExtraWeaponData(indexStr);
  }

  //初期化（武器追加）
  initExtraWeaponData(index: string | number, data?: WeaponLevelConfig) {
    //DEBUG
    console.log("初期化（武器追加）")
    let indexStr = index.toString();
    let temps = this.getExtraWeaponData(indexStr, data);
    this.dataMap[indexStr].extraWeaponResult = temps[0] as Record<string, number>;
    this.dataMap[indexStr].extraSpecialWeaponResult = temps[1] as SpecialBuff[];
    this.setDirty(indexStr, true);
  }

  //初期化（聖遺物セット追加）
  initExtraArtifactSetData(index: string | number) {
    //DEBUG
    console.log("初期化（聖遺物セット追加）")
    let indexStr = index.toString();
    let temps = this.getExtraReliquarySetData(indexStr);
    this.dataMap[indexStr].extraArtifactSetResult = temps[0] as Record<string, number>;
    this.dataMap[indexStr].extraSpecialArtifactSetResult = temps[1] as SpecialBuff[];
    this.setDirty(indexStr, true);
  }

  //初期化（敵）
  initEnemyData(index: string | number, enemyIndex: string | number) {
    //DEBUG
    console.log("初期化（敵）")
    let indexStr = index.toString();
    let enemyIndexStr = enemyIndex.toString();
    if(!(indexStr in this.dataMap)){
      this.dataMap[indexStr] = {};
    }
    this.dataMap[indexStr].enemyData = this.enemyService.get(enemyIndexStr);
    this.setDirty(indexStr, true);
  }

  //初期化（計算用情報合計）
  initAllData(index: string | number){
    let indexStr = index.toString();
    this.dataMap[indexStr].allData = this.getAllData(indexStr);
    //DEBUG
    console.log(this.dataMap[indexStr].allData);
    this.setDirty(indexStr, false);
  }

  //ダメージ取得
  getDamage(index: string | number, param: DamageParam){
    let indexStr = index.toString();
    if(this.isDirty(indexStr)){
      this.initAllData(indexStr);
    }
    let result: DamageResult;
    let data = this.dataMap[indexStr].allData!;
    let rate = param.rate;
    let base = param.base;
    let attackBonusType = param.attackBonusType;
    let elementBonusType = param.elementBonusType;

    //計算
    //--------------------
    //1.ダメージ値区域
    //--------------------
    let finalRate = rate;
    let dmgSectionValue = 0;
    //倍率
    finalRate += data[Const.PROP_DMG_RATE_UP_ALL];
    dmgSectionValue += data[Const.PROP_DMG_VAL_UP_ALL];
    //--------------------
    //2.会心区域
    //--------------------
    let critSectionValue = 0;
    let finalCritRate = data[Const.PROP_CRIT_RATE];
    let finalCritDmg = data[Const.PROP_CRIT_DMG];
    finalCritRate += data[Const.PROP_DMG_CRIT_RATE_UP_ALL];
    finalCritDmg += data[Const.PROP_DMG_CRIT_DMG_UP_ALL];
    //--------------------
    //3.ダメージアップ区域
    //--------------------
    let dmgUpSectionValue = 0;
    dmgUpSectionValue += data[Const.PROP_DMG_BONUS_ALL];
    //--------------------
    //4.耐性区域
    //--------------------
    let dmgAntiSectionValue = 0;
    dmgAntiSectionValue -= data[Const.PROP_DMG_ANTI_ALL_MINUS];    
    //--------------------
    //5.防御区域
    //--------------------
    let defenceSectionValue = 0;
    defenceSectionValue = data[Const.PROP_DMG_ENEMY_DEFENSE]/(data[Const.PROP_DMG_ENEMY_DEFENSE] + data[Const.PROP_LEVEL]*5 + 500);
    //--------------------
    //6.元素反応区域
    //--------------------
    let elementSectionValue = 0;
    let elementAmplitudeRate = 2.78/(1 + 1400/data[Const.PROP_ELEMENTAL_MASTERY]);
    let elementCataclysmRate = 16.0/(1 + 2000/data[Const.PROP_ELEMENTAL_MASTERY]);
    let elementShieldRate = 4.44/(1 + 1400/data[Const.PROP_ELEMENTAL_MASTERY]);

    //--------------------
    //補足
    //--------------------
    switch(elementBonusType){
      case Const.PROP_DMG_BONUS_CRYO:
        finalRate += data[Const.PROP_DMG_RATE_UP_CRYO];
        dmgSectionValue += data[Const.PROP_DMG_VAL_UP_CRYO];
        finalCritRate += data[Const.PROP_DMG_CRIT_RATE_UP_CRYO];
        finalCritDmg += data[Const.PROP_DMG_CRIT_DMG_UP_CRYO];
        dmgUpSectionValue += data[Const.PROP_DMG_BONUS_CRYO];
        dmgAntiSectionValue += data[Const.PROP_DMG_ANTI_CRYO];
        dmgAntiSectionValue -= data[Const.PROP_DMG_ANTI_CRYO_MINUS];
        break;
      case Const.PROP_DMG_BONUS_ANEMO:
        finalRate += data[Const.PROP_DMG_RATE_UP_ANEMO];
        dmgSectionValue += data[Const.PROP_DMG_VAL_UP_ANEMO];
        finalCritRate += data[Const.PROP_DMG_CRIT_RATE_UP_ANEMO];
        finalCritDmg += data[Const.PROP_DMG_CRIT_DMG_UP_ANEMO];
        dmgUpSectionValue += data[Const.PROP_DMG_BONUS_ANEMO];
        dmgAntiSectionValue += data[Const.PROP_DMG_ANTI_ANEMO];
        dmgAntiSectionValue -= data[Const.PROP_DMG_ANTI_ANEMO_MINUS];
        break;
      case Const.PROP_DMG_BONUS_PHYSICAL:
        finalRate += data[Const.PROP_DMG_RATE_UP_PHYSICAL];
        dmgSectionValue += data[Const.PROP_DMG_VAL_UP_PHYSICAL];
        finalCritRate += data[Const.PROP_DMG_CRIT_RATE_UP_PHYSICAL];
        finalCritDmg += data[Const.PROP_DMG_CRIT_DMG_UP_PHYSICAL];
        dmgUpSectionValue += data[Const.PROP_DMG_BONUS_PHYSICAL];
        dmgAntiSectionValue += data[Const.PROP_DMG_ANTI_PHYSICAL];
        dmgAntiSectionValue -= data[Const.PROP_DMG_ANTI_PHYSICAL_MINUS];
        break;
      case Const.PROP_DMG_BONUS_ELECTRO:
        finalRate += data[Const.PROP_DMG_RATE_UP_ELECTRO];
        dmgSectionValue += data[Const.PROP_DMG_VAL_UP_ELECTRO];
        finalCritRate += data[Const.PROP_DMG_CRIT_RATE_UP_ELECTRO];
        finalCritDmg += data[Const.PROP_DMG_CRIT_DMG_UP_ELECTRO];
        dmgUpSectionValue += data[Const.PROP_DMG_BONUS_ELECTRO];
        dmgAntiSectionValue += data[Const.PROP_DMG_ANTI_ELECTRO];
        dmgAntiSectionValue -= data[Const.PROP_DMG_ANTI_ELECTRO_MINUS];
        break;
      case Const.PROP_DMG_BONUS_GEO:
        finalRate += data[Const.PROP_DMG_RATE_UP_GEO];
        dmgSectionValue += data[Const.PROP_DMG_VAL_UP_GEO];
        finalCritRate += data[Const.PROP_DMG_CRIT_RATE_UP_GEO];
        finalCritDmg += data[Const.PROP_DMG_CRIT_DMG_UP_GEO];
        dmgUpSectionValue += data[Const.PROP_DMG_BONUS_GEO];
        dmgAntiSectionValue += data[Const.PROP_DMG_ANTI_GEO];
        dmgAntiSectionValue -= data[Const.PROP_DMG_ANTI_GEO_MINUS];
        break;
      case Const.PROP_DMG_BONUS_PYRO:
        finalRate += data[Const.PROP_DMG_RATE_UP_PYRO];
        dmgSectionValue += data[Const.PROP_DMG_VAL_UP_PYRO];
        finalCritRate += data[Const.PROP_DMG_CRIT_RATE_UP_PYRO];
        finalCritDmg += data[Const.PROP_DMG_CRIT_DMG_UP_PYRO];
        dmgUpSectionValue += data[Const.PROP_DMG_BONUS_PYRO];
        dmgAntiSectionValue += data[Const.PROP_DMG_ANTI_PYRO];
        dmgAntiSectionValue -= data[Const.PROP_DMG_ANTI_PYRO_MINUS];
        break;
      case Const.PROP_DMG_BONUS_HYDRO:
        finalRate += data[Const.PROP_DMG_RATE_UP_HYDRO];
        dmgSectionValue += data[Const.PROP_DMG_VAL_UP_HYDRO];
        finalCritRate += data[Const.PROP_DMG_CRIT_RATE_UP_HYDRO];
        finalCritDmg += data[Const.PROP_DMG_CRIT_DMG_UP_HYDRO];
        dmgUpSectionValue += data[Const.PROP_DMG_BONUS_HYDRO];
        dmgAntiSectionValue += data[Const.PROP_DMG_ANTI_HYDRO];
        dmgAntiSectionValue -= data[Const.PROP_DMG_ANTI_HYDRO_MINUS];
        break;
      case Const.PROP_DMG_BONUS_DENDRO:
        finalRate += data[Const.PROP_DMG_RATE_UP_DENDRO];
        dmgSectionValue += data[Const.PROP_DMG_VAL_UP_DENDRO];
        finalCritRate += data[Const.PROP_DMG_CRIT_RATE_UP_DENDRO];
        finalCritDmg += data[Const.PROP_DMG_CRIT_DMG_UP_DENDRO];
        dmgUpSectionValue += data[Const.PROP_DMG_BONUS_DENDRO];
        dmgAntiSectionValue += data[Const.PROP_DMG_ANTI_DENDRO];
        dmgAntiSectionValue -= data[Const.PROP_DMG_ANTI_DENDRO_MINUS];
        break;
    }
    switch(attackBonusType){
      case Const.PROP_DMG_BONUS_NORMAL:
        finalRate += data[Const.PROP_DMG_RATE_UP_NORMAL];
        dmgSectionValue += data[Const.PROP_DMG_VAL_UP_NORMAL];
        finalCritRate += data[Const.PROP_DMG_CRIT_RATE_UP_NORMAL];
        finalCritDmg += data[Const.PROP_DMG_CRIT_DMG_UP_NORMAL];
        dmgUpSectionValue += data[Const.PROP_DMG_BONUS_NORMAL];
        break;
      case Const.PROP_DMG_BONUS_CHARGED:
        finalRate += data[Const.PROP_DMG_RATE_UP_CHARGED];
        dmgSectionValue += data[Const.PROP_DMG_VAL_UP_CHARGED];
        finalCritRate += data[Const.PROP_DMG_CRIT_RATE_UP_CHARGED];
        finalCritDmg += data[Const.PROP_DMG_CRIT_DMG_UP_CHARGED];
        dmgUpSectionValue += data[Const.PROP_DMG_BONUS_CHARGED];
        break;
      case Const.PROP_DMG_BONUS_PLUNGING:
        finalRate += data[Const.PROP_DMG_RATE_UP_PLUNGING];
        dmgSectionValue += data[Const.PROP_DMG_VAL_UP_PLUNGING];
        finalCritRate += data[Const.PROP_DMG_CRIT_RATE_UP_PLUNGING];
        finalCritDmg += data[Const.PROP_DMG_CRIT_DMG_UP_PLUNGING];
        dmgUpSectionValue += data[Const.PROP_DMG_BONUS_PLUNGING];
        break;
      case Const.PROP_DMG_BONUS_SKILL:
        finalRate += data[Const.PROP_DMG_RATE_UP_SKILL];
        dmgSectionValue += data[Const.PROP_DMG_VAL_UP_SKILL];
        finalCritRate += data[Const.PROP_DMG_CRIT_RATE_UP_SKILL];
        finalCritDmg += data[Const.PROP_DMG_CRIT_DMG_UP_SKILL];
        dmgUpSectionValue += data[Const.PROP_DMG_BONUS_SKILL];
        break;
      case Const.PROP_DMG_BONUS_ELEMENTAL_BURST:
        finalRate += data[Const.PROP_DMG_RATE_UP_ELEMENTAL_BURST];
        dmgSectionValue += data[Const.PROP_DMG_VAL_UP_ELEMENTAL_BURST];
        finalCritRate += data[Const.PROP_DMG_CRIT_RATE_UP_ELEMENTAL_BURST];
        finalCritDmg += data[Const.PROP_DMG_CRIT_DMG_UP_ELEMENTAL_BURST];
        dmgUpSectionValue += data[Const.PROP_DMG_BONUS_ELEMENTAL_BURST];
        break;
      case Const.PROP_DMG_BONUS_WEAPON:
        finalRate += data[Const.PROP_DMG_RATE_UP_WEAPON];
        dmgSectionValue += data[Const.PROP_DMG_VAL_UP_WEAPON];
        finalCritRate += data[Const.PROP_DMG_CRIT_RATE_UP_WEAPON];
        finalCritDmg += data[Const.PROP_DMG_CRIT_DMG_UP_WEAPON];
        dmgUpSectionValue += data[Const.PROP_DMG_BONUS_WEAPON];
        break;
      case Const.PROP_DMG_BONUS_OTHER:
        finalRate += data[Const.PROP_DMG_RATE_UP_OTHER];
        dmgSectionValue += data[Const.PROP_DMG_VAL_UP_OTHER];
        finalCritRate += data[Const.PROP_DMG_CRIT_RATE_UP_OTHER];
        finalCritDmg += data[Const.PROP_DMG_CRIT_DMG_UP_OTHER];
        dmgUpSectionValue += data[Const.PROP_DMG_BONUS_OTHER];
        break;
    }
    //ダメージ値区域残り
    switch(base){
      case Const.PROP_ATTACK:
        dmgSectionValue += finalRate * data[Const.PROP_ATTACK];
        break;
      case Const.PROP_HP:
        dmgSectionValue += finalRate * data[Const.PROP_HP];
        break;
      case Const.PROP_DEFENSE:
        dmgSectionValue += finalRate * data[Const.PROP_DEFENSE];
        break;
    }
    //耐性区域残り
    if(dmgAntiSectionValue < 0){
      dmgAntiSectionValue = dmgAntiSectionValue/2;
    }
    //会心区域残り
    if(finalCritRate < 0){
      finalCritRate = 0;
    }else if(finalCritRate > 1){
      finalCritRate = 1;
    }

    //結果まとめ
    let originDmg = dmgSectionValue * (1 + dmgUpSectionValue) * (1 - dmgAntiSectionValue) * (1 - defenceSectionValue);
    let critDmg = originDmg * (1 + finalCritDmg);
    let expectDmg = originDmg * (1 - finalCritRate) + critDmg * finalCritRate;
    let originVaporizeDmg;
    let cirtVaporizeDmg;
    let expectVaporizeDmg;
    let originMeltDmg;
    let cirtMeltDmg;
    let expectMeltDmg;
    let burningDmg;
    let superconductDmg;
    let swirlCryoDmg;
    let swirlElectroDmg;
    let swirlPyroDmg;
    let swirlHydroDmg;
    let electroChargedDmg;
    let destructionDmg;
    let overloadedDmg;
    let shieldHp;
    if([Const.PROP_DMG_BONUS_PYRO, Const.PROP_DMG_BONUS_HYDRO].includes(elementBonusType)){
      originVaporizeDmg = REACTION_RATE_1_5 * (1 + data[Const.PROP_DMG_ELEMENT_VAPORIZE_UP] + elementAmplitudeRate) * originDmg;
      cirtVaporizeDmg = REACTION_RATE_1_5 * (1 + data[Const.PROP_DMG_ELEMENT_VAPORIZE_UP] + elementAmplitudeRate) * critDmg;
      expectVaporizeDmg = REACTION_RATE_1_5 * (1 + data[Const.PROP_DMG_ELEMENT_VAPORIZE_UP] + elementAmplitudeRate) * expectDmg;
    }
    if([Const.PROP_DMG_BONUS_PYRO, Const.PROP_DMG_BONUS_CRYO].includes(elementBonusType)){
      originMeltDmg = REACTION_RATE_2_0 * (1 + data[Const.PROP_DMG_ELEMENT_MELT_UP] + elementAmplitudeRate) * originDmg;
      cirtMeltDmg = REACTION_RATE_2_0 * (1 + data[Const.PROP_DMG_ELEMENT_MELT_UP] + elementAmplitudeRate) * critDmg;
      expectMeltDmg = REACTION_RATE_2_0 * (1 + data[Const.PROP_DMG_ELEMENT_MELT_UP] + elementAmplitudeRate) * expectDmg;
    }
    if([Const.PROP_DMG_BONUS_PYRO, Const.PROP_DMG_BONUS_DENDRO].includes(elementBonusType)){
      let tempDmgAntiSectionValue = this.getDmgAntiSectionValue(data, Const.ELEMENT_PYRO);
      burningDmg = BASE_BURNING[data[Const.PROP_LEVEL] - 1] * (1 + data[Const.PROP_DMG_ELEMENT_BURNING_UP] + elementCataclysmRate) * (1 - tempDmgAntiSectionValue);
    }
    if([Const.PROP_DMG_BONUS_CRYO, Const.PROP_DMG_BONUS_ELECTRO].includes(elementBonusType)){
      let tempDmgAntiSectionValue = this.getDmgAntiSectionValue(data, Const.ELEMENT_CRYO);
      superconductDmg = BASE_SUPERCONDUCT[data[Const.PROP_LEVEL] - 1] * (1 + data[Const.PROP_DMG_ELEMENT_SUPERCONDUCT_UP] + elementCataclysmRate) * (1 - tempDmgAntiSectionValue);
    }
    if([Const.PROP_DMG_BONUS_ANEMO].includes(elementBonusType)){
      let tempCryoDmgAntiSectionValue = this.getDmgAntiSectionValue(data, Const.ELEMENT_CRYO);
      let tempElectroDmgAntiSectionValue = this.getDmgAntiSectionValue(data, Const.ELEMENT_ELECTRO);
      let tempPyroDmgAntiSectionValue = this.getDmgAntiSectionValue(data, Const.ELEMENT_PYRO);
      let tempHydroDmgAntiSectionValue = this.getDmgAntiSectionValue(data, Const.ELEMENT_HYDRO);
      let swirlBaseDmg = BASE_SWIRL[data[Const.PROP_LEVEL] - 1] * (1 + data[Const.PROP_DMG_ELEMENT_SWIRL_UP] + elementCataclysmRate);
      swirlCryoDmg = swirlBaseDmg * (1 - tempCryoDmgAntiSectionValue);
      swirlElectroDmg = swirlBaseDmg * (1 - tempElectroDmgAntiSectionValue);
      swirlPyroDmg = swirlBaseDmg * (1 - tempPyroDmgAntiSectionValue);
      swirlHydroDmg = swirlBaseDmg * (1 - tempHydroDmgAntiSectionValue);
    }
    if([Const.PROP_DMG_BONUS_HYDRO, Const.PROP_DMG_BONUS_ELECTRO].includes(elementBonusType)){
      let tempDmgAntiSectionValue = this.getDmgAntiSectionValue(data, Const.ELEMENT_ELECTRO);
      electroChargedDmg = BASE_ELECTROCHARGED[data[Const.PROP_LEVEL] - 1] * (1 + data[Const.PROP_DMG_ELEMENT_ELECTROCHARGED_UP] + elementCataclysmRate) * (1 - tempDmgAntiSectionValue);
    }
    if([Const.PROP_DMG_BONUS_PHYSICAL].includes(elementBonusType)){
      let tempDmgAntiSectionValue = this.getDmgAntiSectionValue(data, Const.ELEMENT_PHYSICAL);
      destructionDmg = BASE_DESTRUCTION[data[Const.PROP_LEVEL] - 1] * (1 + data[Const.PROP_DMG_ELEMENT_DESTRUCTION_UP] + elementCataclysmRate) * (1 - tempDmgAntiSectionValue);
    }
    if([Const.PROP_DMG_BONUS_ELECTRO, Const.PROP_DMG_BONUS_PYRO].includes(elementBonusType)){
      let tempDmgAntiSectionValue = this.getDmgAntiSectionValue(data, Const.ELEMENT_PYRO);
      overloadedDmg = BASE_OVERLOADED[data[Const.PROP_LEVEL] - 1] * (1 + data[Const.PROP_DMG_ELEMENT_OVERLOADED_UP] + elementCataclysmRate) * (1 - tempDmgAntiSectionValue);
    }
    if([Const.PROP_DMG_BONUS_GEO].includes(elementBonusType)){
      shieldHp = BASE_SHIELD[data[Const.PROP_LEVEL] - 1] * (1 + data[Const.PROP_DMG_ELEMENT_SHIELD_UP] + elementShieldRate);
    }
    result = {
      elementBonusType: elementBonusType,
      originDmg: originDmg,
      critDmg: critDmg,
      expectDmg: expectDmg,
      originVaporizeDmg: originVaporizeDmg,
      cirtVaporizeDmg: cirtVaporizeDmg,
      expectVaporizeDmg: expectVaporizeDmg,
      originMeltDmg: originMeltDmg,
      cirtMeltDmg: cirtMeltDmg,
      expectMeltDmg: expectMeltDmg,
      overloadedDmg: overloadedDmg,
      burningDmg: burningDmg,
      electroChargedDmg: electroChargedDmg,
      superconductDmg: superconductDmg,
      swirlCryoDmg: swirlCryoDmg,
      swirlElectroDmg: swirlElectroDmg,
      swirlPyroDmg: swirlPyroDmg,
      swirlHydroDmg: swirlHydroDmg,
      shieldHp: shieldHp,
      destructionDmg: destructionDmg,
    };

    return result;
  }

  //治療取得
  getHealing(index: string | number, param: HealingParam){
    let indexStr = index.toString();
    if(this.isDirty(indexStr)){
      this.initAllData(indexStr);
    }
    let result: HealingResult;
    let data = this.dataMap[indexStr].allData!;
    let base = param.base;
    let extra = param.extra;
    let rate = param.rate;
    let healingBonusType = param.healingBonusType;
    //計算
    let healing: number = 0;
    if(base != undefined && rate != undefined){
      healing += data[base] * rate;
    }
    if(extra != undefined){
      healing += extra;
    }
    healing *= (1 + data[Const.PROP_HEALING_BONUS]) * (1 + data[Const.PROP_REVERSE_HEALING_BONUS]);
    if(healingBonusType){
      healing *= (1 + (data[healingBonusType] ?? 0));
      //TODO その他治療アップ
    }
    result = {
      healing: healing,
    }

    return result;
  }

  //バリア強度取得
  getShield(index: string | number, param: ShieldParam){
    let indexStr = index.toString();
    if(this.isDirty(indexStr)){
      this.initAllData(indexStr);
    }
    let result: ShieldResult;
    let data = this.dataMap[indexStr].allData!;
    let base = param.base;
    let extra = param.extra;
    let rate = param.rate;
    //計算
    let shield: number = 0;
    if(base != undefined && rate != undefined){
      shield += data[base] * rate;
    }
    if(extra != undefined){
      shield += extra;
    }
    shield *= (1 + data[Const.PROP_DMG_ELEMENT_SHIELD_UP]);
    result = {
      shield: shield,
    }

    return result;
  }

  //生成物HP取得
  getProductHp(index: string | number, param: ProductParam){
    let indexStr = index.toString();
    if(this.isDirty(indexStr)){
      this.initAllData(indexStr);
    }
    let result: ProductResult;
    let data = this.dataMap[indexStr].allData!;
    let base = param.base;
    let extra = param.extra;
    let rate = param.rate;
    //計算
    let product: number = 0;
    if(base != undefined && rate != undefined){
      product += data[base] * rate;
    }
    if(extra != undefined){
      product += extra;
    }
    result = {
      product: product,
    }

    return result;
  }

  getSkillDmgValue(index: string | number, skill: string, valueIndexs: number[], overrideElement?: string, skillIndex?: number | string){
    let indexStr = index.toString();
    let params: DamageParam[] = [];
    let results: DamageResult[] = []

    if([Const.NAME_SKILLS_NORMAL, Const.NAME_SKILLS_SKILL, Const.NAME_SKILLS_ELEMENTAL_BURST,
    Const.NAME_CONSTELLATION, Const.NAME_SKILLS_PROUD, Const.NAME_EFFECT, Const.NAME_SET].includes(skill)){
      let characterData = this.dataMap[indexStr].characterData;
      let weaponData = this.dataMap[indexStr].weaponData;
      let artifactSetId = this.artifactService.getStorageFullSetIndex(indexStr);
      let artifactSetData = this.artifactService.getSetData(artifactSetId);
      let extraCharacterData = this.extraDataService.getCharacter(indexStr);
      let extraWeaponData = this.extraDataService.getWeapon(weaponData!.id);
      let extraArtifactSetData = this.extraDataService.getArtifactSet(artifactSetId);
      let infos: ExtraSkillInfo[];
      let currentLevel: string;
      if(skill == Const.NAME_CONSTELLATION){
        infos = extraCharacterData?.constellation![skillIndex as string] ?? [];
        currentLevel = Const.NAME_TALENT_DEFAULT_LEVEL;
      }else if(skill == Const.NAME_SKILLS_PROUD){
        infos = extraCharacterData?.skills!.proudSkills[skillIndex as number] ?? [];
        currentLevel = Const.NAME_TALENT_DEFAULT_LEVEL;
      }else if(skill == Const.NAME_EFFECT){
        infos = extraWeaponData?.effect ?? [];
        currentLevel = this.getWeaponAffixLevel(index);
      }else if(skill == Const.NAME_SET){
        infos = extraArtifactSetData?(extraArtifactSetData[Const.NAME_SET + skillIndex!.toString() as keyof ExtraArtifact]??[]):[];
        currentLevel = Const.NAME_NO_LEVEL;
      }else{
        infos = extraCharacterData?.skills![skill as keyof ExtraCharacterSkills] as ExtraSkillInfo[] ?? [];
        currentLevel = this.getCharacterSkillLevel(indexStr, skill);
      }

      for(let info of infos){
        //全含め必要
        let damageInfo = info.damage;
        if(damageInfo?.customValues){
          for(let value of damageInfo.customValues){
            let base = damageInfo.base!;
            let attackBonusType = damageInfo.attackBonusType!;
            let elementBonusType = damageInfo.elementBonusType!;
            let rate = value;
            if(damageInfo.originSkill){
              let originRateInfo = characterData!.skills![damageInfo.originSkill as keyof CharSkills] as CharSkill;
              let originSkillLevel = this.getCharacterSkillLevel(indexStr, damageInfo.originSkill);
              let originRate = originRateInfo.paramMap[originSkillLevel][damageInfo.originIndex!]
              switch(damageInfo.originRelation){
                case "*":
                  rate *= originRate
                  break;
                case "+":
                  rate += originRate
                  break;
                case "-":
                  rate -= originRate
                  break;
                case "/":
                  rate /= originRate
                  break;
              }
            }
            params.push({
              base: base,
              rate: rate,
              attackBonusType: attackBonusType,
              elementBonusType: elementBonusType,
            });
          }
        }else{
          for(let valueIndex of valueIndexs){
            if(damageInfo && damageInfo.indexs && damageInfo.indexs.includes(valueIndex)){
              let rateInfo: CharSkill;
              let rate: number;
              if(skill == Const.NAME_CONSTELLATION){
                rateInfo = characterData!.skills.talents[parseInt(skillIndex as string)];
                rate = rateInfo.paramMap[currentLevel!][valueIndex];
              }else if(skill == Const.NAME_SKILLS_PROUD){
                rateInfo = characterData!.skills.proudSkills[skillIndex as number];
                rate = rateInfo.paramMap[currentLevel!][valueIndex];
              }else if(skill == Const.NAME_EFFECT){
                rate = weaponData!.skillAffixMap[currentLevel].paramList[valueIndex];
              }else if(skill == Const.NAME_SET){
                rate = artifactSetData.setAffixs[1].paramList[valueIndex];
              }else{
                rateInfo = characterData!.skills![skill as keyof CharSkills] as CharSkill;
                rate = rateInfo.paramMap[currentLevel!][valueIndex];
              }
              if(damageInfo.originSkill){
                let originRateInfo = characterData!.skills![damageInfo.originSkill as keyof CharSkills] as CharSkill;
                let originSkillLevel = this.getCharacterSkillLevel(indexStr, damageInfo.originSkill);
                let originRate = originRateInfo.paramMap[originSkillLevel][damageInfo.originIndex!]
                switch(damageInfo.originRelation){
                  case "*":
                    rate *= originRate
                    break;
                  case "+":
                    rate += originRate
                    break;
                  case "-":
                    rate -= originRate
                    break;
                  case "/":
                    rate /= originRate
                    break;
                }
              }
              let base = damageInfo.base!;
              let attackBonusType = damageInfo.attackBonusType!;
              let elementBonusType = damageInfo.elementBonusType!;
              if(damageInfo?.canOverride && overrideElement){
                elementBonusType = overrideElement;
              }
              params.push({
                base: base,
                rate: rate,
                attackBonusType: attackBonusType,
                elementBonusType: elementBonusType,
              });
            }
          }
        }
      }
    }

    for(let param of params){
      results.push(this.getDamage(indexStr, param));
    }

    return results;
  }

  getSkillHealingValue(index: string | number, skill: string, valueIndexs: number[], skillIndex?: number | string){
    let indexStr = index.toString();
    let params: HealingParam[] = [];
    let results: HealingResult[] = []

    if([Const.NAME_SKILLS_NORMAL, Const.NAME_SKILLS_SKILL, Const.NAME_SKILLS_ELEMENTAL_BURST,
    Const.NAME_CONSTELLATION, Const.NAME_SKILLS_PROUD, Const.NAME_EFFECT, Const.NAME_SET].includes(skill)){
      let characterData = this.dataMap[indexStr].characterData;
      let weaponData = this.dataMap[indexStr].weaponData;
      let artifactSetId = this.artifactService.getStorageFullSetIndex(indexStr);
      let artifactSetData = this.artifactService.getSetData(artifactSetId);
      let extraCharacterData = this.extraDataService.getCharacter(indexStr);
      let extraWeaponData = this.extraDataService.getWeapon(weaponData!.id);
      let extraArtifactSetData = this.extraDataService.getArtifactSet(artifactSetId);
      let infos: ExtraSkillInfo[];
      let currentLevel: string;
      if(skill == Const.NAME_CONSTELLATION){
        infos = extraCharacterData?.constellation![skillIndex as string] ?? [];
        currentLevel = Const.NAME_TALENT_DEFAULT_LEVEL;
      }else if(skill == Const.NAME_SKILLS_PROUD){
        infos = extraCharacterData?.skills!.proudSkills[skillIndex as number] ?? [];
        currentLevel = Const.NAME_TALENT_DEFAULT_LEVEL;
      }else if(skill == Const.NAME_EFFECT){
        infos = extraWeaponData?.effect ?? [];
        currentLevel = this.getWeaponAffixLevel(index);
      }else if(skill == Const.NAME_SET){
        infos = extraArtifactSetData?(extraArtifactSetData[Const.NAME_SET + skillIndex!.toString() as keyof ExtraArtifact]??[]):[];
        currentLevel = Const.NAME_NO_LEVEL;
      }else{
        infos = extraCharacterData?.skills![skill as keyof ExtraCharacterSkills] as ExtraSkillInfo[] ?? [];
        currentLevel = this.getCharacterSkillLevel(indexStr, skill);
      }

      for(let info of infos){
        //全含め必要
        let healingInfo = info.healing;
        if(healingInfo?.customValue != undefined){
          let base = healingInfo.base!;
          let healingBonusType = healingInfo.healingBonusType;
          let rate = healingInfo.customValue;
          params.push({
            base: base,
            rate: rate,
            healingBonusType: healingBonusType,
          });
        }else{
          for(let valueIndex of valueIndexs){
            if(healingInfo && healingInfo.index != undefined && healingInfo.index == valueIndex){
              let rateInfo: CharSkill;
              let rate: number;
              let extra: number;
              if(skill == Const.NAME_CONSTELLATION){
                rateInfo = characterData!.skills.talents[parseInt(skillIndex as string)];
                rate = rateInfo.paramMap[currentLevel!][valueIndex];
                extra = healingInfo.constIndex?rateInfo.paramMap[currentLevel!][healingInfo.constIndex] : 0;
              }else if(skill == Const.NAME_SKILLS_PROUD){
                rateInfo = characterData!.skills.proudSkills[skillIndex as number];
                rate = rateInfo.paramMap[currentLevel!][valueIndex];
                extra = healingInfo.constIndex?rateInfo.paramMap[currentLevel!][healingInfo.constIndex] : 0;
              }else if(skill == Const.NAME_EFFECT){
                rate = weaponData!.skillAffixMap[currentLevel].paramList[valueIndex];
                extra = healingInfo.constIndex?weaponData!.skillAffixMap[currentLevel].paramList[healingInfo.constIndex] : 0;
              }else if(skill == Const.NAME_SET){
                rate = artifactSetData.setAffixs[1].paramList[valueIndex];
                extra = healingInfo.constIndex?artifactSetData.setAffixs[1].paramList[healingInfo.constIndex] : 0;
              }else{
                rateInfo = characterData!.skills![skill as keyof CharSkills] as CharSkill;
                rate = rateInfo.paramMap[currentLevel!][valueIndex];
                extra = healingInfo.constIndex?rateInfo.paramMap[currentLevel!][healingInfo.constIndex] : 0;
              }
              let base = healingInfo.base!;
              let healingBonusType = healingInfo.healingBonusType;
              if(healingInfo.constIndex != undefined){
                switch(healingInfo.constCalRelation){
                  case "-":
                    extra *= -1;
                    break;
                }
              }
              params.push({
                base: base,
                rate: rate,
                extra: extra,
                healingBonusType: healingBonusType,
              });
            }
          }
        }
      }
    }

    for(let param of params){
      results.push(this.getHealing(indexStr, param));
    }

    return results;
  }

  getSkillShieldValue(index: string | number, skill: string, valueIndexs: number[], skillIndex?: number | string){
    let indexStr = index.toString();
    let params: ShieldParam[] = [];
    let results: ShieldResult[] = []

    if([Const.NAME_SKILLS_NORMAL, Const.NAME_SKILLS_SKILL, Const.NAME_SKILLS_ELEMENTAL_BURST,
      Const.NAME_CONSTELLATION, Const.NAME_SKILLS_PROUD, Const.NAME_EFFECT, Const.NAME_SET].includes(skill)){
        let characterData = this.dataMap[indexStr].characterData;
        let weaponData = this.dataMap[indexStr].weaponData;
        let artifactSetId = this.artifactService.getStorageFullSetIndex(indexStr);
        let artifactSetData = this.artifactService.getSetData(artifactSetId);
        let extraCharacterData = this.extraDataService.getCharacter(indexStr);
        let extraWeaponData = this.extraDataService.getWeapon(weaponData!.id);
        let extraArtifactSetData = this.extraDataService.getArtifactSet(artifactSetId);
        let infos: ExtraSkillInfo[];
        let currentLevel: string;
        if(skill == Const.NAME_CONSTELLATION){
          infos = extraCharacterData?.constellation![skillIndex as string] ?? [];
          currentLevel = Const.NAME_TALENT_DEFAULT_LEVEL;
        }else if(skill == Const.NAME_SKILLS_PROUD){
          infos = extraCharacterData?.skills!.proudSkills[skillIndex as number] ?? [];
          currentLevel = Const.NAME_TALENT_DEFAULT_LEVEL;
        }else if(skill == Const.NAME_EFFECT){
          infos = extraWeaponData?.effect ?? [];
          currentLevel = this.getWeaponAffixLevel(index);
        }else if(skill == Const.NAME_SET){
          infos = extraArtifactSetData?(extraArtifactSetData[Const.NAME_SET + skillIndex!.toString() as keyof ExtraArtifact]??[]):[];
          currentLevel = Const.NAME_NO_LEVEL;
        }else{
          infos = extraCharacterData?.skills![skill as keyof ExtraCharacterSkills] as ExtraSkillInfo[] ?? [];
          currentLevel = this.getCharacterSkillLevel(indexStr, skill);
        }
  
        for(let info of infos){
          //全含め必要
          let shieldInfo = info.shield;
          if(shieldInfo?.customValue != undefined){
            let base = shieldInfo.base!;
            let rate = shieldInfo.customValue;
            params.push({
              base: base,
              rate: rate,
            });
          }else{
            for(let valueIndex of valueIndexs){
              if(shieldInfo && shieldInfo.index != undefined && shieldInfo.index == valueIndex){
                let rateInfo: CharSkill;
                let rate: number;
                let extra: number;
                if(skill == Const.NAME_CONSTELLATION){
                  rateInfo = characterData!.skills.talents[parseInt(skillIndex as string)];
                  rate = rateInfo.paramMap[currentLevel!][valueIndex];
                  extra = shieldInfo.constIndex?rateInfo.paramMap[currentLevel!][shieldInfo.constIndex] : 0;
                }else if(skill == Const.NAME_SKILLS_PROUD){
                  rateInfo = characterData!.skills.proudSkills[skillIndex as number];
                  rate = rateInfo.paramMap[currentLevel!][valueIndex];
                  extra = shieldInfo.constIndex?rateInfo.paramMap[currentLevel!][shieldInfo.constIndex] : 0;
                }else if(skill == Const.NAME_EFFECT){
                  rate = weaponData!.skillAffixMap[currentLevel].paramList[valueIndex];
                  extra = shieldInfo.constIndex?weaponData!.skillAffixMap[currentLevel].paramList[shieldInfo.constIndex] : 0;
                }else if(skill == Const.NAME_SET){
                  rate = artifactSetData.setAffixs[1].paramList[valueIndex];
                  extra = shieldInfo.constIndex?artifactSetData.setAffixs[1].paramList[shieldInfo.constIndex] : 0;
                }else{
                  rateInfo = characterData!.skills![skill as keyof CharSkills] as CharSkill;
                  rate = rateInfo.paramMap[currentLevel!][valueIndex];
                  extra = shieldInfo.constIndex?rateInfo.paramMap[currentLevel!][shieldInfo.constIndex] : 0;
                }
                
                let base = shieldInfo.base!;
                if(shieldInfo.constIndex != undefined){
                  switch(shieldInfo.constCalRelation){
                    case "-":
                      extra *= -1;
                      break;
                  }
                }
                params.push({
                  base: base,
                  rate: rate,
                  extra: extra,
                });
              }
            }
          }
        }
      }
  
      for(let param of params){
        results.push(this.getShield(indexStr, param));
      }
  
      return results;
  }
  
  getSkillProductHpValue(index: string | number, skill: string, valueIndexs: number[], skillIndex?: number | string){
    let indexStr = index.toString();
    let params: ProductParam[] = [];
    let results: ProductResult[] = []

    if([Const.NAME_SKILLS_NORMAL, Const.NAME_SKILLS_SKILL, Const.NAME_SKILLS_ELEMENTAL_BURST,
      Const.NAME_CONSTELLATION, Const.NAME_SKILLS_PROUD, Const.NAME_EFFECT, Const.NAME_SET].includes(skill)){
        let characterData = this.dataMap[indexStr].characterData;
        let weaponData = this.dataMap[indexStr].weaponData;
        let artifactSetId = this.artifactService.getStorageFullSetIndex(indexStr);
        let artifactSetData = this.artifactService.getSetData(artifactSetId);
        let extraCharacterData = this.extraDataService.getCharacter(indexStr);
        let extraWeaponData = this.extraDataService.getWeapon(weaponData!.id);
        let extraArtifactSetData = this.extraDataService.getArtifactSet(artifactSetId);
        let infos: ExtraSkillInfo[];
        let currentLevel: string;
        if(skill == Const.NAME_CONSTELLATION){
          infos = extraCharacterData?.constellation![skillIndex as string] ?? [];
          currentLevel = Const.NAME_TALENT_DEFAULT_LEVEL;
        }else if(skill == Const.NAME_SKILLS_PROUD){
          infos = extraCharacterData?.skills!.proudSkills[skillIndex as number] ?? [];
          currentLevel = Const.NAME_TALENT_DEFAULT_LEVEL;
        }else if(skill == Const.NAME_EFFECT){
          infos = extraWeaponData?.effect ?? [];
          currentLevel = this.getWeaponAffixLevel(index);
        }else if(skill == Const.NAME_SET){
          infos = extraArtifactSetData?(extraArtifactSetData[Const.NAME_SET + skillIndex!.toString() as keyof ExtraArtifact]??[]):[];
          currentLevel = Const.NAME_NO_LEVEL;
        }else{
          infos = extraCharacterData?.skills![skill as keyof ExtraCharacterSkills] as ExtraSkillInfo[] ?? [];
          currentLevel = this.getCharacterSkillLevel(indexStr, skill);
        }
  
        for(let info of infos){
          //全含め必要
          let productHpInfo = info.product;
          if(productHpInfo?.customValue != undefined){
            let base = productHpInfo.base!;
            let rate = productHpInfo.customValue;
            params.push({
              base: base,
              rate: rate,
            });
          }else{
            for(let valueIndex of valueIndexs){
              if(productHpInfo && productHpInfo.index != undefined && productHpInfo.index == valueIndex){
                let rateInfo: CharSkill;
                let rate: number;
                let extra: number;
                if(skill == Const.NAME_CONSTELLATION){
                  rateInfo = characterData!.skills.talents[parseInt(skillIndex as string)];
                  rate = rateInfo.paramMap[currentLevel!][valueIndex];
                  extra = productHpInfo.constIndex?rateInfo.paramMap[currentLevel!][valueIndex] : 0;
                }else if(skill == Const.NAME_SKILLS_PROUD){
                  rateInfo = characterData!.skills.proudSkills[skillIndex as number];
                  rate = rateInfo.paramMap[currentLevel!][valueIndex];
                  extra = productHpInfo.constIndex?rateInfo.paramMap[currentLevel!][valueIndex] : 0;
                }else if(skill == Const.NAME_EFFECT){
                  rate = weaponData!.skillAffixMap[currentLevel].paramList[valueIndex];
                  extra = productHpInfo.constIndex?weaponData!.skillAffixMap[currentLevel].paramList[productHpInfo.constIndex] : 0;
                }else if(skill == Const.NAME_SET){
                  rate = artifactSetData.setAffixs[1].paramList[valueIndex];
                  extra = productHpInfo.constIndex?artifactSetData.setAffixs[1].paramList[productHpInfo.constIndex] : 0;
                }else{
                  rateInfo = characterData!.skills![skill as keyof CharSkills] as CharSkill;
                  rate = rateInfo.paramMap[currentLevel!][valueIndex];
                  extra = productHpInfo.constIndex?rateInfo.paramMap[currentLevel!][valueIndex] : 0;
                }
                let base = productHpInfo.base!;
                if(productHpInfo.constIndex != undefined){
                  switch(productHpInfo.constCalRelation){
                    case "-":
                      extra *= -1;
                      break;
                  }
                }
                params.push({
                  base: base,
                  rate: rate,
                  extra: extra,
                });
              }
            }
          }
        }
      }
  
      for(let param of params){
        results.push(this.getProductHp(indexStr, param));
      }
  
      return results;
  }

  getSkillBuffValue(index: string | number, skill: string, skillIndex?: number | string, valueIndexs?: number[]){
    let indexStr = index.toString();
    let results: BuffResult[] = [];

    if([Const.NAME_SKILLS_NORMAL, Const.NAME_SKILLS_SKILL, Const.NAME_SKILLS_ELEMENTAL_BURST,
      Const.NAME_CONSTELLATION, Const.NAME_SKILLS_PROUD, Const.NAME_EFFECT, Const.NAME_SET].includes(skill)){
        let characterData = this.dataMap[indexStr].characterData;
        let weaponData = this.dataMap[indexStr].weaponData;
        let artifactSetId = this.artifactService.getStorageFullSetIndex(indexStr);
        let artifactSetData = this.artifactService.getSetData(artifactSetId);
        let extraCharacterData = this.extraDataService.getCharacter(indexStr);
        let extraWeaponData = this.extraDataService.getWeapon(weaponData!.id);
        let extraArtifactSetData = this.extraDataService.getArtifactSet(artifactSetId);
        let infos: ExtraSkillInfo[];
        let currentLevel: string;
        if(skill == Const.NAME_CONSTELLATION){
          infos = extraCharacterData?.constellation![skillIndex as string] ?? [];
          currentLevel = Const.NAME_TALENT_DEFAULT_LEVEL;
        }else if(skill == Const.NAME_SKILLS_PROUD){
          infos = extraCharacterData?.skills!.proudSkills[skillIndex as number] ?? [];
          currentLevel = Const.NAME_TALENT_DEFAULT_LEVEL;
        }else if(skill == Const.NAME_EFFECT){
          infos = extraWeaponData?.effect ?? [];
          currentLevel = this.getWeaponAffixLevel(index);
        }else if(skill == Const.NAME_SET){
          infos = extraArtifactSetData?(extraArtifactSetData[Const.NAME_SET + skillIndex!.toString() as keyof ExtraArtifact]??[]):[];
          currentLevel = Const.NAME_NO_LEVEL;
        }else{
          infos = extraCharacterData?.skills![skill as keyof ExtraCharacterSkills] as ExtraSkillInfo[] ?? [];
          currentLevel = this.getCharacterSkillLevel(indexStr, skill);
        }
  
        for(let [infoIndex,info] of infos.entries()){
          //全含め必要
          let buffInfo = info.buff;
            let tempValue: any;
            if(valueIndexs != undefined){
              if(buffInfo?.index != undefined){
                if(!valueIndexs.includes(buffInfo.index)){
                  continue;
                }
              }
              if(buffInfo?.constIndex != undefined){
                if(!valueIndexs.includes(buffInfo.constIndex)){
                  continue;
                }
              }
            }
            if(buffInfo){
              switch(buffInfo.settingType){
                case 'switch-value':
                case 'switch':
                  if(skill == Const.NAME_EFFECT){
                    tempValue = this.weaponService.getExtraSwitch(indexStr, skill, infoIndex, skillIndex);
                  }else if(skill == Const.NAME_SET){
                    tempValue = this.artifactService.getExtraSwitch(indexStr, skill, infoIndex, skillIndex);
                  }else{
                    tempValue = this.characterService.getExtraSwitch(indexStr, skill, infoIndex, skillIndex);
                  }
                  results.push({
                    valueIndex: infoIndex,
                    type: 'switch',
                    switchValue: tempValue,
                  })
                  break;
                case 'slider':
                  if(skill == Const.NAME_EFFECT){
                    tempValue = this.weaponService.getExtraSlider(indexStr, skill, infoIndex, skillIndex);
                  }else if(skill == Const.NAME_SET){
                    tempValue = this.artifactService.getExtraSlider(indexStr, skill, infoIndex, skillIndex);
                  }else{
                    tempValue = this.characterService.getExtraSlider(indexStr, skill, infoIndex, skillIndex);
                  }
                  results.push({
                    valueIndex: infoIndex,
                    type: 'slider',
                    sliderValue: tempValue,
                    min: buffInfo.sliderMin ?? 0,
                    max: buffInfo.sliderMax ?? 1,
                    step: buffInfo.sliderStep ?? 1,
                  })
                  break;
                case 'resident':
                default:
                  continue;
            }
          }
        }
      }
  
      return results;
  }

  setSkillBuffValue(index: string | number, skill: string, valueIndex: number, type: string, setValue: number | boolean, skillIndex?: number | string){
    let indexStr = index.toString();
    if([Const.NAME_SKILLS_NORMAL, Const.NAME_SKILLS_SKILL, Const.NAME_SKILLS_ELEMENTAL_BURST,
    Const.NAME_CONSTELLATION, Const.NAME_SKILLS_PROUD].includes(skill)){
      switch(type){
        case 'switch':
          this.characterService.setExtraSwitch(indexStr, skill, valueIndex, setValue as boolean, skillIndex);
          break;
        case 'slider':
          this.characterService.setExtraSlider(indexStr, skill, valueIndex, setValue as number, skillIndex);
          break;
      }
    }else if([Const.NAME_EFFECT].includes(skill)){
      switch(type){
        case 'switch':
          this.weaponService.setExtraSwitch(indexStr, skill, valueIndex, setValue as boolean, skillIndex);
          break;
        case 'slider':
          this.weaponService.setExtraSlider(indexStr, skill, valueIndex, setValue as number, skillIndex);
          break;
      }
    }else if([Const.NAME_SET].includes(skill)){
      switch(type){
        case 'switch':
          this.artifactService.setExtraSwitch(indexStr, skill, valueIndex, setValue as boolean, skillIndex);
          break;
        case 'slider':
          this.artifactService.setExtraSlider(indexStr, skill, valueIndex, setValue as number, skillIndex);
          break;
      }
    }
  }

  //計算用情報合計取得
  private getAllData(index: string | number){
    let result: Record<string, number> = {};

    for(let key of Const.PROPS_ALL_BASE){
      if(!(key in result)){
        result[key] = 0;
      }
      result[key] += this.getProperty(index, key);
    }
    for(let key of Const.PROPS_TO_CAL){
      if(!(key in result)){
        result[key] = 0;
      }
      let temp = 0;
      switch(key){
        case Const.PROP_HP:
          temp = result[Const.PROP_HP_BASE] * (1 + result[Const.PROP_HP_UP]) + result[Const.PROP_VAL_HP];
          break;
        case Const.PROP_ATTACK:
          temp = result[Const.PROP_ATTACK_BASE] * (1 + result[Const.PROP_ATTACK_UP]) + result[Const.PROP_VAL_ATTACK];
          break;
        case Const.PROP_DEFENSE:
          temp = result[Const.PROP_DEFENSE_BASE] * (1 + result[Const.PROP_DEFENSE_UP]) + result[Const.PROP_VAL_DEFENSE];
          break;
        case Const.PROP_DMG_ENEMY_DEFENSE:
          temp = result[Const.PROP_DMG_ENEMY_DEFENSE_BASE] * (1 - result[Const.PROP_DMG_ENEMY_DEFENSE_DOWN]);
          break;
      }
      result[key] = temp;
    }

    //スペシャルバフ
    let specialOrders: SpecialBuff[] = [];
    specialOrders = specialOrders.concat(
      this.dataMap[index].extraSpecialCharaResult!,
      this.dataMap[index].extraSpecialWeaponResult!,
      this.dataMap[index].extraSpecialArtifactSetResult!,
    );
    specialOrders.sort((x, y) => x.priority! - y.priority!);

    //スペシャル処理
    for(let buff of specialOrders){
      let baseValue = buff.base?result[buff.base]:0;
      let modifyValue = buff.baseModifyValue?buff.baseModifyValue:0;
      let toAdd = (baseValue + modifyValue) * buff.multiValue!;
      if(buff.maxVal && toAdd > buff.maxVal){
        toAdd = buff.maxVal;
      }else if(buff.specialMaxVal != undefined){
        let specialMaxVal = result[buff.specialMaxVal.base!] * buff.specialMaxVal.multiValue!;
        if(toAdd > specialMaxVal){
          toAdd = specialMaxVal;
        }
      }
      result[buff.target!] += toAdd;
      //計算必要分再計算
      switch(buff.target){
        case Const.PROP_HP_UP:
        case Const.PROP_VAL_HP:
          result[Const.PROP_HP] = result[Const.PROP_HP_BASE] * (1 + result[Const.PROP_HP_UP]) + result[Const.PROP_VAL_HP];
          break;
        case Const.PROP_ATTACK_UP:
        case Const.PROP_VAL_ATTACK:
          result[Const.PROP_ATTACK] += result[Const.PROP_ATTACK_BASE] * (1 + result[Const.PROP_ATTACK_UP]) + result[Const.PROP_VAL_ATTACK];
          break;
        case Const.PROP_DEFENSE_UP:
        case Const.PROP_VAL_DEFENSE:
          result[Const.PROP_DEFENSE] += result[Const.PROP_DEFENSE_BASE] * (1 + result[Const.PROP_DEFENSE_UP]) + result[Const.PROP_VAL_DEFENSE];
          break;
        case Const.PROP_DMG_ENEMY_DEFENSE_DOWN:
          result[Const.PROP_DMG_ENEMY_DEFENSE] += result[Const.PROP_DMG_ENEMY_DEFENSE_BASE] * (1 - result[Const.PROP_DMG_ENEMY_DEFENSE_DOWN]);
          break;
      }
    }

    return result;
  }

  //全情報から属性取得（まとめ）
  private getProperty(index: string | number, prop: string) {
    let result = 0;
    let indexStr = index.toString();
    let genshinDataProp = prop;
    let genshinArtifactDataProp = prop;
    if([Const.PROP_LEVEL, Const.PROP_DMG_ENEMY_DEFENSE_BASE, Const.PROP_HP_BASE, Const.PROP_ATTACK_BASE, Const.PROP_DEFENSE_BASE].includes(prop)){
      switch(prop){
        case Const.PROP_LEVEL:
          result = this.getCharacterData(indexStr).level;
          return result;
          //break;
        case Const.PROP_DMG_ENEMY_DEFENSE_BASE:
          result = this.getEnemyData(indexStr).defense;
          return result;
          //break;
        case Const.PROP_HP_BASE:
          genshinDataProp = Const.PROP_HP;
          break;
        case Const.PROP_ATTACK_BASE:
          genshinDataProp = Const.PROP_ATTACK;
          break;
        case Const.PROP_DEFENSE_BASE:
          genshinDataProp = Const.PROP_DEFENSE;
          break;
      }
    }
    genshinDataProp = genshinDataProp.toLowerCase();
    //敵のみのデータ
    if(Const.PROPS_ENEMY_ANTI.includes(prop)){
      return this.getEnemyData(indexStr)[genshinDataProp as keyof EnemyStatus] ?? 0;
    }

    result += this.getCharacterData(indexStr)[genshinDataProp as keyof CharStatus] ?? 0;
    result += this.getWeaponData(indexStr)[genshinDataProp as keyof WeaponStatus] ?? 0;
    let extraCharaResult = this.dataMap[indexStr].extraCharaResult!;
    if(extraCharaResult[prop] != undefined){
      result += extraCharaResult[prop];
    }
    let extraWeaponResult = this.dataMap[indexStr].extraWeaponResult!;
    if(extraWeaponResult[prop] != undefined){
      result += extraWeaponResult[prop];
    }

    if([Const.PROP_VAL_HP, Const.PROP_VAL_ATTACK, Const.PROP_VAL_DEFENSE].includes(prop)){
      switch(prop){
        case Const.PROP_VAL_HP:
          genshinArtifactDataProp = Const.PROP_HP;
          break;
        case Const.PROP_VAL_ATTACK:
          genshinArtifactDataProp = Const.PROP_ATTACK;
          break;
        case Const.PROP_VAL_DEFENSE:
          genshinArtifactDataProp = Const.PROP_DEFENSE;
          break;
      }
    }
    genshinArtifactDataProp = genshinArtifactDataProp.toLowerCase();
    result += this.getReliquaryData(indexStr)[genshinArtifactDataProp as keyof artifactStatus] ?? 0;
    let extraArtifactSetResult = this.dataMap[indexStr].extraArtifactSetResult!;
    if(extraArtifactSetResult[prop] != undefined){
      result += extraArtifactSetResult[prop];
    }
    let otherData = this.getOtherData(indexStr);
    if(otherData && otherData[prop] != undefined){
      result += otherData[prop] ?? 0;
    }

    return result;
  }

  //キャラ追加データ解析
  private getExtraCharacterData(index: string | number, data?: CharLevelConfig){
    let characterData = this.dataMap[index]!.characterData!;
    let skillLevel;
    let elementalBurstLevel;
    let characterStorageData = this.characterService.getStorageInfo(index);
    if(data && data.skillLevel){
      skillLevel = data.skillLevel!;
    }else{
      skillLevel = characterStorageData.skillLevel!;
    }
    if(data && data.elementalBurstLevel){
      elementalBurstLevel = data.elementalBurstLevel!;
    }else{
      elementalBurstLevel = characterStorageData.elementalBurstLevel!;
    }
    let extraCharacterData = this.extraDataService.getCharacter(index);
    let setting = this.characterService.getExtraData(index)!;
    let result: Record<string, number> = {};
    let specialResult: SpecialBuff[] = [];

    if(Const.NAME_SKILLS in setting && setting.skills){
      if(Const.NAME_SKILLS_SKILL in setting.skills){
        this.setBuffDataToResult(
          characterData.skills?.skill, 
          skillLevel, 
          extraCharacterData.skills!.skill,
          setting.skills.skill!,
          result,
          specialResult,
        );
      }
      if(Const.NAME_SKILLS_ELEMENTAL_BURST in setting.skills){
        this.setBuffDataToResult(
          characterData.skills?.elementalBurst, 
          elementalBurstLevel, 
          extraCharacterData.skills!.elementalBurst,
          setting.skills.elementalBurst!,
          result,
          specialResult,
        );
      }
      if(Const.NAME_SKILLS_PROUD in setting.skills){
        for(let index = 0; index < setting.skills.proudSkills!.length; ++index){
          let obj = setting.skills.proudSkills![index];
          if(Object.keys(obj).length === 0){
            continue;
          }
          this.setBuffDataToResult(
            characterData.skills?.proudSkills[index], 
            Const.NAME_TALENT_DEFAULT_LEVEL, 
            extraCharacterData.skills!.proudSkills![index],
            obj,
            result,
            specialResult);
        }
      }
    }

    if(Const.NAME_CONSTELLATION in setting && setting.constellation){
      for(let index of [Const.NAME_CONSTELLATION_1, Const.NAME_CONSTELLATION_2, Const.NAME_CONSTELLATION_3, Const.NAME_CONSTELLATION_4, Const.NAME_CONSTELLATION_5, Const.NAME_CONSTELLATION_6]){
        if(index in setting.constellation){
          this.setBuffDataToResult(
            characterData.skills.talents[parseInt(index)], 
            Const.NAME_TALENT_DEFAULT_LEVEL, 
            extraCharacterData.constellation![index],
            setting.constellation![index],
            result,
            specialResult,
          );
        }
      }
    }

    return [result, specialResult];
  }

  //武器追加データ解析
  private getExtraWeaponData(index: string | number, data?: WeaponLevelConfig){
    let weaponData = this.dataMap[index]!.weaponData!;
    let smeltingLevel;
    let weaponStorageData = this.weaponService.getStorageInfo(index);
    if(data && data.smeltingLevel){
      smeltingLevel = data.smeltingLevel!;
    }else{
      smeltingLevel = weaponStorageData.smeltingLevel!;
    }
    let extraWeaponData = this.extraDataService.getWeapon(weaponData.id);
    let setting = this.weaponService.getExtraData(index)!;
    let result: Record<string, number> = {};
    let specialResult: SpecialBuff[] = [];

    if("effect" in setting && setting.effect){
      this.setBuffDataToResult(
        weaponData.skillAffixMap[smeltingLevel], 
        Const.NAME_NO_LEVEL, 
        extraWeaponData.effect!,
        setting.effect!,
        result,
        specialResult,
      );
    }

    return [result, specialResult];
  }

  //聖遺物データ解析
  private getReliquaryData(index: string): artifactStatus{
    let result: artifactStatus = {};
    let data = this.artifactService.getStorageActiveArtifactInfo(index);
    for(let temp of [
      data?.flower ?? {},
      data?.plume ?? {},
      data?.sands ?? {},
      data?.goblet ?? {},
      data?.circlet ?? {},
    ]){
      for(let key in temp){
        if(temp[key].name == undefined){
          continue;
        }
        let prop = temp[key].name!.toLowerCase();
        if(result[prop as keyof artifactStatus] == undefined){
          result[prop as keyof artifactStatus] = 0;
        }
        result[prop as keyof artifactStatus]! += temp[key].value!;
      }
    }
    return result;
  }

  //聖遺物セットデータ解析
  private getExtraReliquarySetData(index: string){
    let artifactSetIndexs = this.artifactService.getStorageSetIndexs(index);
    let result: Record<string, number> = {};
    let specialResult: SpecialBuff[] = [];
    let targetIndexInfos: artifactSetInfo[] = [];
    let ownedIndexs: string[] = [];
    for(let setIndex of artifactSetIndexs){
      if(setIndex != undefined && setIndex != ""){
        ownedIndexs.push(setIndex);
        targetIndexInfos.push({
          index: setIndex,
          level: ownedIndexs.filter(x => x == setIndex).length,
        });
      }
    }
    for(let targetIndexInfo of targetIndexInfos){
      let tempResult: Record<string, number> = {};
      let tempSpecialResult: SpecialBuff[] = [];
      let artifactSetData = this.artifactService.getSet(targetIndexInfo.index);
      let extraArtifactData = this.extraDataService.getArtifactSet(targetIndexInfo.index);
      let setting = this.artifactService.getExtraData(index)!;
      this.setBuffDataToResult(
        artifactSetData.setAffixs[targetIndexInfo.level - 1], 
        Const.NAME_NO_LEVEL,
        extraArtifactData?extraArtifactData[Const.NAME_SET + targetIndexInfo.level as keyof ExtraArtifact]!:[],
        setting[Const.NAME_SET + targetIndexInfo.level as keyof ExtraArtifactSetData] ?? {},
        tempResult,
        tempSpecialResult,
      );
      for(let key in tempResult){
        if(result[key] == undefined){
          result[key] = tempResult[key];
        }else{
          result[key] += tempResult[key];
        }
      }
      specialResult.push(...tempSpecialResult);
    }

    return [result, specialResult];
  }

  //その他データ解析
  private getOtherData(index: string): Record<string, number> | undefined{
    let result: Record<string, number> = {};
    let temps: OtherStorageInfo[] = this.otherService.getStorageInfos(index);
    for(let value of temps){
      if(value.enable && value.name != undefined && value.name != ''){
        if(!(value.name in result)){
          result[value.name] = 0;
        }
        result[value.name] += value.value ?? 0;
      }
    }

    return result;
  }

  //追加データ解析
  private setBuffDataToResult(skillData: SkillParamInf, skillLevel: string, buffs: ExtraSkillInfo[], setting: ExtraStatus, result: Record<string, number>, specialResult: SpecialBuff[]){
    if(skillData == undefined || buffs == undefined){
      return;
    }
    let switchOnSet = setting?.switchOnSet ?? {};
    let sliderNumMap = setting?.sliderNumMap ?? {};

    for(let [buffIndex,buffInfo] of buffs.entries()){
      let buff = buffInfo?.buff;
      let isEnableInSwitch = true;
      let isEnableInSlider = true;
      if(!(buffIndex in switchOnSet) || switchOnSet[buffIndex] != true){
        isEnableInSwitch = false;
      }
      if(!(buffIndex in sliderNumMap) || typeof sliderNumMap[buffIndex] != "number"){
        isEnableInSlider = false;
      }

      if(buff){
        if(isEnableInSwitch){
          let indexValue = 0;
          if(buff?.index != undefined){
            if(skillData.paramMap){
              indexValue = skillData.paramMap[skillLevel][buff?.index!];
            }else if(skillData.paramList){
              indexValue = skillData.paramList[buff?.index!];
            }
          }else if(buff?.customValue != undefined){
            indexValue = buff.customValue;
          }else if(buff?.propIndex != undefined){
            indexValue = skillData.addProps![buff?.propIndex].value;
          }
          let constIndexValue = 0;
          if(buff?.constIndex != undefined){
            if(skillData.paramMap){
              constIndexValue = skillData.paramMap[skillLevel][buff?.constIndex!];
            }else if(skillData.paramList){
              constIndexValue = skillData.paramList[buff?.constIndex!];
            }
          }
          let calRelation = buff?.calRelation ?? '+';
          switch(calRelation){
            case "-":
              indexValue = -1 * indexValue;
              break;
          }
          let constCalRelation = buff?.constCalRelation ?? '+';
    
          let base = buff?.base;
          let baseModifyValue = buff?.baseModifyValue;
          let baseModifyRelation = buff?.baseModifyRelation;
          if(baseModifyValue != undefined){
            switch(baseModifyRelation){
              case "-":
                baseModifyValue = -1 * baseModifyValue;
                break;
            }
          }
          let priority = buff?.priority ?? 0;
    
          let targets = buff?.target;
          let convertElement = buff?.convertElement;
    
          let isGlobal = buff?.isGlobal ?? false;
          let unableSelf = buff?.unableSelf ?? false;
    
          let maxValIndexValue = 0;
          if(buff?.maxValIndex != undefined){
            if(skillData.paramMap){
              maxValIndexValue = skillData.paramMap[skillLevel][buff?.maxValIndex!];
            }else if(skillData.paramList){
              maxValIndexValue = skillData.paramList[buff?.maxValIndex!];
            }
          }
          let maxValBase = buff?.maxValBase;
          let maxValConstIndexValue = 0;
          if(buff?.maxValConstIndex != undefined){
            if(skillData.paramMap){
              maxValConstIndexValue = skillData.paramMap[skillLevel][buff?.maxValConstIndex!];
            }else if(skillData.paramList){
              maxValConstIndexValue = skillData.paramList[buff?.maxValConstIndex!];
            }
          }
    
          if(unableSelf){
            //TODO
            continue;
          }
    
          if(base){
            //特殊バフ
            let temp: SpecialBuff = {};
            temp.base = base;
            temp.baseModifyValue = baseModifyValue;
            temp.multiValue = indexValue;
            temp.priority = priority;
            if(maxValBase){
              //特殊上限
              temp.specialMaxVal = {
                base: maxValBase,
                multiValue: maxValIndexValue,
              }
            }else{
              //一般上限
              temp.maxVal = maxValConstIndexValue;
            }
            for(let tar of targets){
              specialResult.push({...temp, target: tar});
            }
          }else{
            //一般バフ
            let value = indexValue;
            switch(constCalRelation){
              case '+':
                value += constIndexValue;
                break;
              case '-':
                value -= constIndexValue;
                break;
              case '*':
                value *= constIndexValue;
                break;
              case '/':
                value /= constIndexValue;
                break;
            }
            for(let tar of targets){
              if(!result[tar]){
                result[tar] = 0;
              }
              result[tar] += value;
            }
          }
        }else if(isEnableInSlider){
          let id = 0;
          let indexValue = 0;
          if(buff?.index != undefined){
            if(skillData.paramMap){
              indexValue = skillData.paramMap[skillLevel][buff?.index!];
            }else if(skillData.paramList){
              indexValue = skillData.paramList[buff?.index!];
            }
          }else if(buff?.customValue != undefined){
            indexValue = buff.customValue;
          }else if(buff?.propIndex != undefined){
            indexValue = skillData.addProps![buff?.propIndex].value;
          }
          let constIndexValue = 0;
          if(buff?.constIndex != undefined){
            if(skillData.paramMap){
              constIndexValue = skillData.paramMap[skillLevel][buff?.constIndex!];
            }else if(skillData.paramList){
              constIndexValue = skillData.paramList[buff?.constIndex!];
            }
          }
          let calRelation = buff?.calRelation ?? '+';
          switch(calRelation){
            case "-":
              indexValue = -1 * indexValue;
              break;
          }
          let constCalRelation = buff?.constCalRelation ?? '+';
    
          let base = buff?.base;
          let baseModifyValue = buff?.baseModifyValue;
          let baseModifyRelation = buff?.baseModifyRelation;
          if(baseModifyValue != undefined){
            switch(baseModifyRelation){
              case "-":
                baseModifyValue = -1 * baseModifyValue;
                break;
            }
          }
          let priority = buff?.priority ?? 0;
    
          let targets = buff?.target;
          let convertElement = buff?.convertElement;
    
          let isGlobal = buff?.isGlobal ?? false;
          let unableSelf = buff?.unableSelf ?? false;

          let sliderMax = buff?.sliderMax;
          let sliderStep = buff?.sliderStep;
          let sliderStartIndex = buff?.sliderStartIndex;
    
          if(unableSelf){
            //TODO
            continue;
          }
          
          if(base){
            //特殊バフ
            let temp: SpecialBuff = {};
            temp.base = base;
            temp.baseModifyValue = baseModifyValue;
            if(sliderStartIndex != undefined){
              if(sliderNumMap[buffIndex] == 0){
                temp.multiValue = 0;
              }else{
                if(skillData.paramMap){
                  temp.multiValue = skillData.paramMap[skillLevel][sliderStartIndex + sliderNumMap[buffIndex] - 1];
                }else if(skillData.paramList){
                  temp.multiValue = skillData.paramList[sliderStartIndex + sliderNumMap[buffIndex] - 1];
                }
              }
            }else{
              temp.multiValue = indexValue * sliderNumMap[buffIndex];
            }
            temp.priority = priority;

            for(let tar of targets){
              specialResult.push({...temp, target: tar});
            }
          }else{
            //一般バフ
            let value = indexValue;
            switch(constCalRelation){
              case '+':
                value += constIndexValue;
                break;
              case '-':
                value -= constIndexValue;
                break;
              case '*':
                value *= constIndexValue;
                break;
              case '/':
                value /= constIndexValue;
                break;
            }
            for(let tar of targets){
              if(result[tar] == undefined){
                result[tar] = 0;
              }
              let resultValue: number;
              if(sliderStartIndex != undefined){
                if(sliderNumMap[buffIndex] == 0){
                  resultValue = 0;
                }else{
                  if(skillData.paramMap){
                    resultValue = skillData.paramMap[skillLevel][sliderStartIndex + sliderNumMap[buffIndex] - 1];
                  }else if(skillData.paramList){
                    resultValue = skillData.paramList[sliderStartIndex + sliderNumMap[buffIndex] - 1];
                  }
                }
              }else{
                resultValue = value * sliderNumMap[buffIndex];
              }
              result[tar] += resultValue!;
            }
          }
        }
      }
    }
  }

  private getCharacterData(index: string | number): CharStatus{
    return this.dataMap[index]!.characterData!.levelMap[this.characterService.getLevel(index.toString())!];
  }

  private getWeaponData(index: string | number): WeaponStatus{
    return this.dataMap[index]!.weaponData!.levelMap[this.weaponService.getLevel(index.toString())!];
  }

  private getEnemyData(index: string | number): EnemyStatus{
    return this.dataMap[index]!.enemyData!.levelMap[this.enemyService.getLevel(index.toString())!];
  }

  private setDirty(index: string | number, dirty: boolean){
    this.dataMap[index.toString()].isDirty = dirty;
    if(dirty){
      this.hasChanged.next(true);
    }
  }

  private getCharacterSkillLevel(index: string | number, skill: string){
    let currentLevel: string;
    let characterStorageData = this.characterService.getStorageInfo(index);
    switch(skill){
      case Const.NAME_SKILLS_NORMAL:
        currentLevel = characterStorageData.normalLevel!;
        break;
      case Const.NAME_SKILLS_SKILL:
        currentLevel = characterStorageData.skillLevel!;
        break;
      case Const.NAME_SKILLS_ELEMENTAL_BURST:
        currentLevel = characterStorageData.elementalBurstLevel!;
        break;
    }
    return currentLevel!;
  }

  private getWeaponAffixLevel(index: string | number){
    let currentLevel: string;
    let weaponStorageData = this.weaponService.getStorageInfo(index);
    currentLevel = weaponStorageData.smeltingLevel!;
    return currentLevel!;
  }

  private getDmgAntiSectionValue(data: Record<string, number>, elementType: string){
    let tempDmgAntiSectionValue = 0;
    tempDmgAntiSectionValue -= data[Const.PROP_DMG_ANTI_ALL_MINUS];
    let tempAntiStr = "";
    let tempAntiMinusStr = "";
    switch(elementType){
      case Const.ELEMENT_CRYO:
        tempAntiStr = Const.PROP_DMG_ANTI_CRYO;
        tempAntiMinusStr = Const.PROP_DMG_ANTI_CRYO_MINUS;
        break;
      case Const.ELEMENT_ANEMO:
        tempAntiStr = Const.PROP_DMG_ANTI_ANEMO;
        tempAntiMinusStr = Const.PROP_DMG_ANTI_ANEMO_MINUS;
        break;
      case Const.ELEMENT_PHYSICAL:
        tempAntiStr = Const.PROP_DMG_ANTI_PHYSICAL;
        tempAntiMinusStr = Const.PROP_DMG_ANTI_PHYSICAL_MINUS;
        break;
      case Const.ELEMENT_ELECTRO:
        tempAntiStr = Const.PROP_DMG_ANTI_ELECTRO;
        tempAntiMinusStr = Const.PROP_DMG_ANTI_ELECTRO_MINUS;
        break;
      case Const.ELEMENT_GEO:
        tempAntiStr = Const.PROP_DMG_ANTI_GEO;
        tempAntiMinusStr = Const.PROP_DMG_ANTI_GEO_MINUS;
        break;
      case Const.ELEMENT_PYRO:
        tempAntiStr = Const.PROP_DMG_ANTI_PYRO;
        tempAntiMinusStr = Const.PROP_DMG_ANTI_PYRO_MINUS;
        break;
      case Const.ELEMENT_HYDRO:
        tempAntiStr = Const.PROP_DMG_ANTI_HYDRO;
        tempAntiMinusStr = Const.PROP_DMG_ANTI_HYDRO_MINUS;
        break;
      case Const.ELEMENT_DENDRO:
        tempAntiStr = Const.PROP_DMG_ANTI_DENDRO;
        tempAntiMinusStr = Const.PROP_DMG_ANTI_DENDRO_MINUS;
        break;
    }
    tempDmgAntiSectionValue += data[tempAntiStr];
    tempDmgAntiSectionValue -= data[tempAntiMinusStr];
    if(tempDmgAntiSectionValue < 0){
      tempDmgAntiSectionValue = tempDmgAntiSectionValue/2;
    }
    return tempDmgAntiSectionValue;
  }
}
