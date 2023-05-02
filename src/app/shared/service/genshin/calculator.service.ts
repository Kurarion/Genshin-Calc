import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { CharacterService, Const, character, weapon, CharStatus, EnemyService, enemy, EnemyStatus, ExtraDataService, WeaponService, WeaponStatus, ExtraCharacterData, ExtraSkillBuff, ExtraStatus, CharSkill, ExtraSkillInfo, WeaponSkillAffix, ExtraCharacterSkills, CharSkills, artifactStatus, ArtifactService, ExtraArtifact, ExtraArtifactSetData, ArtifactSetAddProp, OtherService, OtherStorageInfo, WeaponType, ElementType, TeamService } from 'src/app/shared/shared.module';
import { environment } from 'src/environments/environment';

const name_normal = Const.NAME_SKILLS_NORMAL;
const name_skill = Const.NAME_SKILLS_SKILL;
const name_other = Const.NAME_SKILLS_OTHER;
const name_elementalBurst = Const.NAME_SKILLS_ELEMENTAL_BURST;
const name_proudSkills = Const.NAME_SKILLS_PROUD;
const name_constellation = Const.NAME_CONSTELLATION;
const name_effect = Const.NAME_EFFECT;
const name_set = Const.NAME_SET;

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
  selfTeamBuff?: SelfTeamBuff;
  extraTeamSecondaryResult?: Record<string, number>;
  extraTeamOnceResult?: Record<string, number>;
  extraSpecialTeamResult?: SpecialBuff[];
  extraSpecialSelfTeamCharaResult?: TeamBuff[];
  extraSpecialSelfTeamWeaponResult?: TeamBuff[];
  extraSpecialSelfTeamArtifactSetResult?: TeamBuff[];
  allData?: Record<string, number>;
  buffTag?: Record<string, string[]>;
  isDirty?: boolean;
}

export interface SpecialBuff {
  target?: string;
  base?: string;
  base2?: string;
  baseModifyValue?: number;
  multiValue?: number;
  priority?: number;
  maxVal?: number;
  specialMaxVal?: SpecialBuffMaxVal;
  tag?: string;
  finallyCal?: boolean;
}

export interface SelfTeamBuff {
  [name_normal]: TeamBuff[];
  [name_skill]: TeamBuff[];
  [name_other]: TeamBuff[];
  [name_elementalBurst]: TeamBuff[];
  [name_proudSkills]: TeamBuff[][];
  [name_constellation]: Record<string, TeamBuff[]>;
  [name_effect]: TeamBuff[];
  [name_set]: TeamBuff[];
}

export interface TeamBuff {
  path?: any[];

  index?: number;

  tag?: string;
  target: string;
  val?: number;

  canSecondaryTrans?: boolean;
  canOverlying?: boolean;
  calByOrigin?: boolean;

  isSlider?: boolean;
  isSpecialSlider?: boolean;
  specialSliderVals?: number[];
  sliderVals?: number;
  sliderStep?: number;
  sliderMin?: number;
  sliderMax?: number;

  isSpecial?: boolean;
  base?: string;
  base2?: string;
  baseModifyValue?: number;
  multiValue?: number;
  priority?: number;
  maxVal?: number;
  specialMaxVal?: SpecialBuffMaxVal;
  buffTag?: string,
}

export interface SpecialBuffMaxVal {
  base?: string;
  multiValue?: number;
}

export interface DamageParam {
  rate: number; //倍率
  base: string; //数値ベース
  rateAttach: number[][]; //倍率
  baseAttach: string[]; //数値ベース
  elementBonusType: string; //元素タイプ
  attackBonusType: string; //攻撃タイプ
  tag?: string; //タグ
}

export interface DamageResult {
  elementBonusType: string;
  finalCritRate: number;

  originDmg: number;
  critDmg: number;
  expectDmg: number;

  originVaporizeDmg?: number;//蒸発 1.5
  cirtVaporizeDmg?: number;//蒸発 1.5
  expectVaporizeDmg?: number;//蒸発 1.5

  originMeltDmg?: number;//溶解 2.0
  cirtMeltDmg?: number;//溶解 2.0
  expectMeltDmg?: number;//溶解 2.0

  originAggravateDmg?: number;//激化 雷
  cirtAggravateDmg?: number;//激化 雷
  expectAggravateDmg?: number;//激化 雷

  originSpreadDmg?: number;//激化 草
  cirtSpreadDmg?: number;//激化 草
  expectSpreadDmg?: number;//激化 草

  overloadedDmg?: number;//過負荷
  burningDmg?: number;//燃焼
  electroChargedDmg?: number;//感電
  superconductDmg?: number;//超電導
  shieldHp?: number;//結晶
  destructionDmg?: number;//氷砕き

  ruptureDmg?: number;//開花 草 水
  burgeonDmg?: number;//列開花 草 水 炎
  hyperbloomDmg?: number;//超開花 草 水 雷

  swirlCryoDmg?: number;//拡散 氷
  swirlElectroDmg?: number;//拡散 雷
  swirlElectroAggravateDmg?: number;//拡散 雷 激化
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
  shieldBonusType?: string //シールドタイプ
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
  desc?: string;
  title?: string;
  isAllTeam?: boolean;
  isOnlyForOther?: boolean;
}

export interface artifactSetInfo {
  index: string;
  level: number;
  setIndex: number;
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

interface SetBuffResult {
  overrideElement?: string;
}

const REACTION_RATE_1_5 = 1.5;
const REACTION_RATE_2_0 = 2.0;
const REACTION_RATE_1_15 = 1.15;
const REACTION_RATE_1_25 = 1.25;

const BASE_BURNING = [
  4.3,
  4.6,
  5,
  5.3,
  5.7,
  6.2,
  6.7,
  7.2,
  7.8,
  8.5,
  9.3,
  10.2,
  11.1,
  12.1,
  13.4,
  14.8,
  16.1,
  17.4,
  18.8,
  20.1,
  21.5,
  22.9,
  24.3,
  25.7,
  27.1,
  28.3,
  29.5,
  30.7,
  32.4,
  34.1,
  35.7,
  37.3,
  38.9,
  40.5,
  42.3,
  44.1,
  46,
  47.9,
  49.9,
  51.8,
  53.8,
  56,
  58.4,
  60.8,
  64,
  67.1,
  70.4,
  73.8,
  77.3,
  80.9,
  84.2,
  87.6,
  91.1,
  94.7,
  99.7,
  104.1,
  108.6,
  113.2,
  118.2,
  123.2,
  128.4,
  134.8,
  141.4,
  148.1,
  156.1,
  162.9,
  169.9,
  176.9,
  184.2,
  191.4,
  198.7,
  206.2,
  212.8,
  219.4,
  228.6,
  236.7,
  244.9,
  252.8,
  261.2,
  269.4,
  277.5,
  285.7,
  294.1,
  302.5,
  313.5,
  322.2,
  331.4,
  340.9,
  351.3,
  361.7,
  372.1,
  382.1,
  395.1,
  407.7,
  427.8,
  445.1,
  461.8,
  477.9,
  493.2,
  507.5,  
]
const BASE_SUPERCONDUCT = [
  8.6,
  9.3,
  10,
  10.6,
  11.3,
  12.3,
  13.3,
  14.4,
  15.7,
  17.1,
  18.6,
  20.3,
  22.2,
  24.3,
  26.9,
  29.5,
  32.2,
  34.9,
  37.6,
  40.3,
  43.1,
  45.9,
  48.6,
  51.4,
  54.2,
  56.6,
  59.1,
  61.5,
  64.9,
  68.1,
  71.3,
  74.5,
  77.7,
  80.9,
  84.6,
  88.3,
  92,
  95.9,
  99.8,
  103.7,
  107.7,
  112.1,
  116.8,
  121.7,
  128,
  134.3,
  140.8,
  147.5,
  154.5,
  161.8,
  168.4,
  175.3,
  182.2,
  189.3,
  199.3,
  208.2,
  217.2,
  226.5,
  236.3,
  246.4,
  256.8,
  269.6,
  282.8,
  296.3,
  312.2,
  325.7,
  339.7,
  353.9,
  368.3,
  382.8,
  397.4,
  412.3,
  425.6,
  438.9,
  457.1,
  473.4,
  489.7,
  505.6,
  522.4,
  538.7,
  555,
  571.5,
  588.2,
  605.1,
  626.9,
  644.5,
  662.7,
  681.7,
  702.5,
  723.4,
  744.1,
  764.2,
  790.2,
  815.4,
  855.6,
  890.2,
  923.7,
  955.7,
  986.4,
  1015,
]
const BASE_SWIRL = [
  10.3,
  11.1,
  11.9,
  12.8,
  13.6,
  14.8,
  16,
  17.3,
  18.8,
  20.5,
  22.3,
  24.4,
  26.7,
  29.1,
  32.2,
  35.4,
  38.7,
  41.8,
  45.1,
  48.4,
  51.7,
  55,
  58.3,
  61.7,
  65,
  67.9,
  70.9,
  73.8,
  77.8,
  81.8,
  85.6,
  89.4,
  93.3,
  97.1,
  101.5,
  105.9,
  110.4,
  115,
  119.7,
  124.4,
  129.2,
  134.5,
  140.1,
  146,
  153.6,
  161.1,
  168.9,
  177,
  185.4,
  194.2,
  202.1,
  210.3,
  218.7,
  227.2,
  239.2,
  249.8,
  260.6,
  271.8,
  283.6,
  295.7,
  308.1,
  323.5,
  339.3,
  355.5,
  374.7,
  390.9,
  407.7,
  424.7,
  442,
  459.4,
  476.9,
  494.8,
  510.7,
  526.6,
  548.5,
  568,
  587.6,
  606.7,
  626.9,
  646.5,
  666,
  685.8,
  705.8,
  726.1,
  752.3,
  773.4,
  795.3,
  818.1,
  843.1,
  868.1,
  892.9,
  917.1,
  948.2,
  978.5,
  1026.7,
  1068.3,
  1108.4,
  1146.9,
  1183.7,
  1218,  
]
const BASE_ELECTROCHARGED = [
  20.6,
  22.2,
  23.9,
  25.5,
  27.2,
  29.6,
  32,
  34.6,
  37.6,
  41,
  44.6,
  48.8,
  53.3,
  58.3,
  64.5,
  70.9,
  77.3,
  83.7,
  90.1,
  96.7,
  103.3,
  110,
  116.7,
  123.4,
  130.1,
  135.8,
  141.7,
  147.6,
  155.7,
  163.6,
  171.2,
  178.8,
  186.5,
  194.2,
  202.9,
  211.8,
  220.9,
  230.1,
  239.5,
  248.9,
  258.5,
  269,
  280.2,
  292,
  307.3,
  322.3,
  337.8,
  354,
  370.9,
  388.3,
  404.1,
  420.6,
  437.4,
  454.3,
  478.3,
  499.7,
  521.3,
  543.5,
  567.1,
  591.5,
  616.3,
  646.9,
  678.6,
  711,
  749.3,
  781.8,
  815.4,
  849.4,
  884,
  918.8,
  953.7,
  989.6,
  1021.4,
  1053.3,
  1097.1,
  1136.1,
  1175.3,
  1213.5,
  1253.8,
  1292.9,
  1332,
  1371.6,
  1411.6,
  1452.2,
  1504.6,
  1546.7,
  1590.6,
  1636.1,
  1686.1,
  1736.2,
  1785.9,
  1834.1,
  1896.4,
  1957,
  2053.4,
  2136.5,
  2216.8,
  2293.8,
  2367.4,
  2436.1,  
]
const BASE_DESTRUCTION = [
  25.7,
  27.8,
  29.9,
  31.9,
  34,
  37,
  40,
  43.3,
  47.1,
  51.2,
  55.8,
  61,
  66.7,
  72.8,
  80.6,
  88.6,
  96.6,
  104.6,
  112.7,
  120.9,
  129.2,
  137.6,
  145.9,
  154.2,
  162.6,
  169.8,
  177.2,
  184.5,
  194.6,
  204.4,
  214,
  223.5,
  233.1,
  242.7,
  253.7,
  264.8,
  276.1,
  287.6,
  299.3,
  311.1,
  323.1,
  336.2,
  350.3,
  365,
  384.1,
  402.8,
  422.3,
  442.5,
  463.6,
  485.4,
  505.1,
  525.8,
  546.7,
  567.9,
  597.9,
  624.6,
  651.6,
  679.4,
  708.9,
  739.3,
  770.4,
  808.7,
  848.3,
  888.8,
  936.7,
  977.2,
  1019.2,
  1061.7,
  1105,
  1148.5,
  1192.2,
  1237,
  1276.7,
  1316.6,
  1371.3,
  1420.1,
  1469.1,
  1516.8,
  1567.2,
  1616.2,
  1665,
  1714.5,
  1764.6,
  1815.3,
  1880.8,
  1933.4,
  1988.2,
  2045.2,
  2107.6,
  2170.3,
  2232.3,
  2292.7,
  2370.6,
  2446.3,
  2566.8,
  2670.7,
  2771,
  2867.2,
  2959.3,
  3045.1,  
]
const BASE_OVERLOADED = [
  34.3,
  37.1,
  39.8,
  42.5,
  45.3,
  49.3,
  53.3,
  57.7,
  62.7,
  68.3,
  74.4,
  81.3,
  88.9,
  97.1,
  107.5,
  118.2,
  128.8,
  139.4,
  150.2,
  161.2,
  172.2,
  183.4,
  194.5,
  205.6,
  216.8,
  226.4,
  236.2,
  246,
  259.5,
  272.6,
  285.3,
  298.1,
  310.8,
  323.7,
  338.2,
  353,
  368.1,
  383.4,
  399.1,
  414.8,
  430.8,
  448.3,
  467,
  486.7,
  512.1,
  537.1,
  563.1,
  590,
  618.1,
  647.2,
  673.5,
  701.1,
  729,
  757.2,
  797.2,
  832.8,
  868.8,
  905.9,
  945.2,
  985.8,
  1027.1,
  1078.2,
  1131,
  1185.1,
  1248.9,
  1302.9,
  1359,
  1415.6,
  1473.3,
  1531.3,
  1589.5,
  1649.4,
  1702.3,
  1755.5,
  1828.5,
  1893.5,
  1958.8,
  2022.4,
  2089.6,
  2154.9,
  2220,
  2286,
  2352.7,
  2420.4,
  2507.7,
  2577.9,
  2651,
  2726.9,
  2810.2,
  2893.7,
  2976.4,
  3056.9,
  3160.7,
  3261.7,
  3422.4,
  3560.9,
  3694.6,
  3822.9,
  3945.7,
  4060.1,  
]
const BASE_RUPTURE = BASE_OVERLOADED;
const BASE_BURGEON = Array.from(BASE_RUPTURE, x => x*1.5);
const BASE_HYPERBLOOM = BASE_BURGEON;
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
  383.7,
  394.43,
  405.18,
  415.95,
  426.74,
  437.54,
  450.6,
  463.7,
  476.85,
  491.13,
  502.55,
  514.01,
  531.41,
  549.98,
  568.58,
  585,
  605.67,
  626.39,
  646.05,
  665.76,
  685.5,
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
  1726.1,
  1754.67,
  1785.87,
  1817.14,
  1851.06,
  1885.07,
  1921.75,
  1958.52,
  2006.19,
  2041.57,
  2054.47,
  2065.98,
  2174.72,
  2186.77,
  2198.81,  
]
const BASE_LEVEL_MULTIPLIER = [
  17.17,
  18.54,
  19.9,
  21.27,
  22.65,
  24.65,
  26.64,
  28.87,
  31.37,
  34.14,
  37.2,
  40.66,
  44.45,
  48.56,
  53.75,
  59.08,
  64.42,
  69.72,
  75.12,
  80.58,
  86.11,
  91.7,
  97.24,
  102.81,
  108.41,
  113.2,
  118.1,
  122.98,
  129.73,
  136.29,
  142.67,
  149.03,
  155.42,
  161.83,
  169.11,
  176.52,
  184.07,
  191.71,
  199.56,
  207.38,
  215.4,
  224.17,
  233.5,
  243.35,
  256.06,
  268.54,
  281.53,
  295.01,
  309.07,
  323.6,
  336.76,
  350.53,
  364.48,
  378.62,
  398.6,
  416.4,
  434.39,
  452.95,
  472.61,
  492.88,
  513.57,
  539.1,
  565.51,
  592.54,
  624.44,
  651.47,
  679.5,
  707.79,
  736.67,
  765.64,
  794.77,
  824.68,
  851.16,
  877.74,
  914.23,
  946.75,
  979.41,
  1011.22,
  1044.79,
  1077.44,
  1110,
  1142.98,
  1176.37,
  1210.18,
  1253.84,
  1288.95,
  1325.48,
  1363.46,
  1405.1,
  1446.85,
  1488.22,
  1528.44,
  1580.37,
  1630.85,
  1711.2,
  1780.45,
  1847.32,
  1911.47,
  1972.86,
  2030.07,  
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
  private allDatahasChanged: Subject<boolean> = new Subject<boolean>();
  private allDatahasChanged$: Observable<boolean> = this.allDatahasChanged.asObservable();

  constructor(
    private characterService: CharacterService,
    private weaponService: WeaponService,
    private extraDataService: ExtraDataService,
    private enemyService: EnemyService,
    private artifactService: ArtifactService,
    private otherService: OtherService,
    private teamService: TeamService,
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

  //計算後データ変更検知
  allDataChanged(){
    return this.allDatahasChanged$;
  }

  //初期化（チームバフ）
  initTeamBuffData(indexStr: string, withSelfTeamBuff: boolean = true){
    if(withSelfTeamBuff){
      this.dataMap[indexStr].selfTeamBuff = {
        [name_normal]: [],
        [name_skill]: [],
        [name_other]: [],
        [name_elementalBurst]: [],
        [name_proudSkills]: [],
        [name_constellation]: {
          [Const.NAME_CONSTELLATION_1]: [],
          [Const.NAME_CONSTELLATION_2]: [],
          [Const.NAME_CONSTELLATION_3]: [],
          [Const.NAME_CONSTELLATION_4]: [],
          [Const.NAME_CONSTELLATION_5]: [],
          [Const.NAME_CONSTELLATION_6]: [],
        },
        [name_effect]: [],
        [name_set]: [],
      };
    }
    this.dataMap[indexStr].extraTeamSecondaryResult = {};
    this.dataMap[indexStr].extraTeamOnceResult = {};
    this.dataMap[indexStr].extraSpecialTeamResult = [];
    this.dataMap[indexStr].buffTag = {};
  }

  //初期化（キャラ）
  initCharacterData(index: string | number) {
    if(environment.outputLog){
      //DEBUG
      console.log("初期化（キャラ）")
    }
    let indexStr = index.toString();
    if(!(indexStr in this.dataMap)){
      this.dataMap[indexStr] = {};
      this.initTeamBuffData(indexStr);
    }
    this.dataMap[indexStr].characterData = this.characterService.get(indexStr);
    this.initExtraCharacterData(indexStr);
  }
  
  //初期化（キャラ追加）
  initExtraCharacterData(index: string | number, data?: CharLevelConfig) {
    if(environment.outputLog){
      //DEBUG
      console.log("初期化（キャラ追加）")
    }
    let indexStr = index.toString();
    let temps = this.getExtraCharacterData(indexStr, data);
    this.dataMap[indexStr].extraCharaResult = temps[0] as Record<string, number>;
    this.dataMap[indexStr].extraSpecialCharaResult = temps[1] as SpecialBuff[];
    this.dataMap[indexStr].extraSpecialSelfTeamCharaResult = temps[2] as TeamBuff[];
    this.setDirty(indexStr, true);
  }

  //初期化（武器）
  initWeaponData(index: string | number, weaponIndex: string | number) {
    if(environment.outputLog){
      //DEBUG
      console.log("初期化（武器）")
    }
    let indexStr = index.toString();
    let weaponIndexStr = weaponIndex.toString();
    if(!(indexStr in this.dataMap)){
      this.dataMap[indexStr] = {};
      this.initTeamBuffData(indexStr);
    }
    this.dataMap[indexStr].weaponData = this.weaponService.get(weaponIndexStr);
    this.initExtraWeaponData(indexStr);
  }

  //初期化（武器追加）
  initExtraWeaponData(index: string | number, data?: WeaponLevelConfig) {
    if(environment.outputLog){
      //DEBUG
      console.log("初期化（武器追加）")
    }
    let indexStr = index.toString();
    let temps = this.getExtraWeaponData(indexStr, data);
    this.dataMap[indexStr].extraWeaponResult = temps[0] as Record<string, number>;
    this.dataMap[indexStr].extraSpecialWeaponResult = temps[1] as SpecialBuff[];
    this.dataMap[indexStr].extraSpecialSelfTeamWeaponResult = temps[2] as TeamBuff[];
    this.setDirty(indexStr, true);
  }

  //初期化（聖遺物セット追加）
  initExtraArtifactSetData(index: string | number) {
    if(environment.outputLog){
      //DEBUG
      console.log("初期化（聖遺物セット追加）")
    }
    let indexStr = index.toString();
    let temps = this.getExtraReliquarySetData(indexStr);
    this.dataMap[indexStr].extraArtifactSetResult = temps[0] as Record<string, number>;
    this.dataMap[indexStr].extraSpecialArtifactSetResult = temps[1] as SpecialBuff[];
    this.dataMap[indexStr].extraSpecialSelfTeamArtifactSetResult = temps[2] as TeamBuff[];
    this.setDirty(indexStr, true);
  }

  //初期化（チームバフ追加）
  initExtraTeamBuffData(index: string | number) {
    if(environment.outputLog){
      //DEBUG
      console.log("初期化（チームバフ追加）")
    }
    let indexStr = index.toString();
    this.setExtraTeamData(indexStr);
    this.setDirty(indexStr, true);
  }

  //初期化（敵）
  initEnemyData(index: string | number, enemyIndex: string | number) {
    if(environment.outputLog){
      //DEBUG
      console.log("初期化（敵）")
    }
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
    this.setDirty(indexStr, false);
    this.allDatahasChanged.next(true);
  }

  //計算後データ取得
  getAllDataCache(index: string | number){
    let indexStr = index.toString();
    return this.dataMap[indexStr].allData;
  }

  //チームバフ取得
  getSelfTeamBuff(index: string | number) {
    let indexStr = index.toString();
    return this.dataMap[indexStr].selfTeamBuff;
  }

  //初期化（計算用情報合計）（チーム用）
  initAllDataBackground(index: string | number){
    let indexStr = index.toString();
    if(this.dataMap.hasOwnProperty(indexStr)){

      // let temp1 = this.getExtraCharacterData(indexStr);
      // this.dataMap[indexStr].extraCharaResult = temp1[0] as Record<string, number>;
      // this.dataMap[indexStr].extraSpecialCharaResult = temp1[1] as SpecialBuff[];

      // let temp2 = this.getExtraWeaponData(indexStr);
      // this.dataMap[indexStr].extraWeaponResult = temp2[0] as Record<string, number>;
      // this.dataMap[indexStr].extraSpecialWeaponResult = temp2[1] as SpecialBuff[];

      this.dataMap[indexStr].selfTeamBuff![name_set] = [];

      let temp3 = this.getExtraReliquarySetData(indexStr);
      this.dataMap[indexStr].extraArtifactSetResult = temp3[0] as Record<string, number>;
      this.dataMap[indexStr].extraSpecialArtifactSetResult = temp3[1] as SpecialBuff[];

      this.getAllData(indexStr, undefined, undefined, false);
    }else{
      //初期化
      if(!this.characterService.getStorageInfo(indexStr)){
        //キャラデータ存在しない
        return;
      }
      if(!(indexStr in this.dataMap)){
        this.dataMap[indexStr] = {};
      }
      this.dataMap[indexStr].characterData = this.characterService.get(indexStr);
      this.initTeamBuffData(indexStr);

      let temp1 = this.getExtraCharacterData(indexStr);
      this.dataMap[indexStr].extraCharaResult = temp1[0] as Record<string, number>;
      this.dataMap[indexStr].extraSpecialCharaResult = temp1[1] as SpecialBuff[];
      this.dataMap[indexStr].extraSpecialSelfTeamCharaResult = temp1[2] as TeamBuff[];

      let weaponIndexStr = this.weaponService.getIndex(indexStr)!;
      this.dataMap[indexStr].weaponData = this.weaponService.get(weaponIndexStr);

      let temp2 = this.getExtraWeaponData(indexStr);
      this.dataMap[indexStr].extraWeaponResult = temp2[0] as Record<string, number>;
      this.dataMap[indexStr].extraSpecialWeaponResult = temp2[1] as SpecialBuff[];
      this.dataMap[indexStr].extraSpecialSelfTeamWeaponResult = temp2[2] as TeamBuff[];

      let temp3 = this.getExtraReliquarySetData(indexStr);
      this.dataMap[indexStr].extraArtifactSetResult = temp3[0] as Record<string, number>;
      this.dataMap[indexStr].extraSpecialArtifactSetResult = temp3[1] as SpecialBuff[];
      this.dataMap[indexStr].extraSpecialSelfTeamArtifactSetResult = temp3[2] as TeamBuff[];

      this.getAllData(indexStr, undefined, undefined, false);
    }
  }

  //ダメージ取得
  getDamage(index: string | number, param: DamageParam, extraData?: Record<string, number>, toAddWeaponSmelting?: number){
    let indexStr = index.toString();
    if(this.isDirty(indexStr) && extraData == undefined){
      this.initAllData(indexStr);
    }
    let result: DamageResult;
    let data = this.dataMap[indexStr].allData!;
    if(extraData != undefined){
      data = this.getAllData(indexStr, extraData, toAddWeaponSmelting);
    }
    let rate = param.rate;
    let base = param.base;
    let rateAttach = param.rateAttach ?? [];
    let baseAttach = param.baseAttach ?? [];
    let attackBonusType = param.attackBonusType;
    let elementBonusType = param.elementBonusType;
    let hasTag = param.tag != undefined;
    let tag = Const.CONCATENATION_TAG + param.tag;

    //計算
    //--------------------
    //1.ダメージ値区域
    //--------------------
    let finalRate = rate;
    let dmgSectionValue = 0;
    //倍率
    finalRate += data[Const.PROP_DMG_RATE_UP_ALL];
    // rateAttach = rateAttach.map((x)=>(x+data[Const.PROP_DMG_RATE_UP_ALL]));
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
    let tempIgnoreValue = data[Const.PROP_DMG_ENEMY_DEFENSE_IGNORE] ?? 0;
    let tempDefenseValue = data[Const.PROP_DMG_ENEMY_DEFENSE];
    switch(attackBonusType){
      case Const.PROP_DMG_BONUS_NORMAL:
        tempDefenseValue -= data[Const.PROP_DMG_ENEMY_DEFENSE_BASE] * data[Const.PROP_DMG_ENEMY_DEFENSE_DOWN_NORMAL];
        tempIgnoreValue += data[Const.PROP_DMG_ENEMY_DEFENSE_IGNORE_NORMAL] ?? 0;
        //特別処理
        if(hasTag){
          tempIgnoreValue += data[Const.PROP_DMG_ENEMY_DEFENSE_IGNORE_NORMAL + tag] ?? 0;
        }
        tempDefenseValue *= (1 - tempIgnoreValue);
        break;
      case Const.PROP_DMG_BONUS_CHARGED:
        tempDefenseValue -= data[Const.PROP_DMG_ENEMY_DEFENSE_BASE] * data[Const.PROP_DMG_ENEMY_DEFENSE_DOWN_CHARGED];
        tempIgnoreValue += data[Const.PROP_DMG_ENEMY_DEFENSE_IGNORE_CHARGED] ?? 0;
        //特別処理
        if(hasTag){
          tempIgnoreValue += data[Const.PROP_DMG_ENEMY_DEFENSE_IGNORE_CHARGED + tag] ?? 0;
        }
        tempDefenseValue *= (1 - tempIgnoreValue);
        break;
      case Const.PROP_DMG_BONUS_PLUNGING:
        tempDefenseValue -= data[Const.PROP_DMG_ENEMY_DEFENSE_BASE] * data[Const.PROP_DMG_ENEMY_DEFENSE_DOWN_PLUNGING];
        tempIgnoreValue += data[Const.PROP_DMG_ENEMY_DEFENSE_IGNORE_PLUNGING] ?? 0;
        //特別処理
        if(hasTag){
          tempIgnoreValue += data[Const.PROP_DMG_ENEMY_DEFENSE_IGNORE_PLUNGING + tag] ?? 0;
        }
        tempDefenseValue *= (1 - tempIgnoreValue);
        break;
      case Const.PROP_DMG_BONUS_SKILL:
        tempDefenseValue -= data[Const.PROP_DMG_ENEMY_DEFENSE_BASE] * data[Const.PROP_DMG_ENEMY_DEFENSE_DOWN_SKILL];
        tempIgnoreValue += data[Const.PROP_DMG_ENEMY_DEFENSE_IGNORE_SKILL] ?? 0;
        //特別処理
        if(hasTag){
          tempIgnoreValue += data[Const.PROP_DMG_ENEMY_DEFENSE_IGNORE_SKILL + tag] ?? 0;
        }
        tempDefenseValue *= (1 - tempIgnoreValue);
        break;
      case Const.PROP_DMG_BONUS_ELEMENTAL_BURST:
        tempDefenseValue -= data[Const.PROP_DMG_ENEMY_DEFENSE_BASE] * data[Const.PROP_DMG_ENEMY_DEFENSE_DOWN_ELEMENTAL_BURST];
        tempIgnoreValue += data[Const.PROP_DMG_ENEMY_DEFENSE_IGNORE_ELEMENTAL_BURST] ?? 0;
        //特別処理
        if(hasTag){
          tempIgnoreValue += data[Const.PROP_DMG_ENEMY_DEFENSE_IGNORE_ELEMENTAL_BURST + tag] ?? 0;
        }
        tempDefenseValue *= (1 - tempIgnoreValue);
        break;
    }  
    defenceSectionValue = tempDefenseValue/(tempDefenseValue + data[Const.PROP_LEVEL]*5 + 500);
    //--------------------
    //6.元素反応区域
    //--------------------
    let elementSectionValue = 0;
    let elementAmplitudeRate = 2.78/(1 + 1400/data[Const.PROP_ELEMENTAL_MASTERY]);
    let elementCataclysmRate = 16.0/(1 + 2000/data[Const.PROP_ELEMENTAL_MASTERY]);
    let elementShieldRate = 4.44/(1 + 1400/data[Const.PROP_ELEMENTAL_MASTERY]);
    let elementSpread = 5/(1 + 1200/data[Const.PROP_ELEMENTAL_MASTERY]);
    let elementAggravate = elementSpread;

    //--------------------
    //補足
    //--------------------
    switch(elementBonusType){
      case Const.PROP_DMG_BONUS_CRYO:
        finalRate += data[Const.PROP_DMG_RATE_UP_CRYO];
        // rateAttach = rateAttach.map((x)=>(x+data[Const.PROP_DMG_RATE_UP_CRYO]));
        dmgSectionValue += data[Const.PROP_DMG_VAL_UP_CRYO];
        finalCritRate += data[Const.PROP_DMG_CRIT_RATE_UP_CRYO];
        finalCritDmg += data[Const.PROP_DMG_CRIT_DMG_UP_CRYO];
        dmgUpSectionValue += data[Const.PROP_DMG_BONUS_CRYO];
        dmgAntiSectionValue += data[Const.PROP_DMG_ANTI_CRYO];
        dmgAntiSectionValue -= data[Const.PROP_DMG_ANTI_CRYO_MINUS];
        break;
      case Const.PROP_DMG_BONUS_ANEMO:
        finalRate += data[Const.PROP_DMG_RATE_UP_ANEMO];
        // rateAttach = rateAttach.map((x)=>(x+data[Const.PROP_DMG_RATE_UP_ANEMO]));
        dmgSectionValue += data[Const.PROP_DMG_VAL_UP_ANEMO];
        finalCritRate += data[Const.PROP_DMG_CRIT_RATE_UP_ANEMO];
        finalCritDmg += data[Const.PROP_DMG_CRIT_DMG_UP_ANEMO];
        dmgUpSectionValue += data[Const.PROP_DMG_BONUS_ANEMO];
        dmgAntiSectionValue += data[Const.PROP_DMG_ANTI_ANEMO];
        dmgAntiSectionValue -= data[Const.PROP_DMG_ANTI_ANEMO_MINUS];
        break;
      case Const.PROP_DMG_BONUS_PHYSICAL:
        finalRate += data[Const.PROP_DMG_RATE_UP_PHYSICAL];
        // rateAttach = rateAttach.map((x)=>(x+data[Const.PROP_DMG_RATE_UP_PHYSICAL]));
        dmgSectionValue += data[Const.PROP_DMG_VAL_UP_PHYSICAL];
        finalCritRate += data[Const.PROP_DMG_CRIT_RATE_UP_PHYSICAL];
        finalCritDmg += data[Const.PROP_DMG_CRIT_DMG_UP_PHYSICAL];
        dmgUpSectionValue += data[Const.PROP_DMG_BONUS_PHYSICAL];
        dmgAntiSectionValue += data[Const.PROP_DMG_ANTI_PHYSICAL];
        dmgAntiSectionValue -= data[Const.PROP_DMG_ANTI_PHYSICAL_MINUS];
        break;
      case Const.PROP_DMG_BONUS_ELECTRO:
        finalRate += data[Const.PROP_DMG_RATE_UP_ELECTRO];
        // rateAttach = rateAttach.map((x)=>(x+data[Const.PROP_DMG_RATE_UP_ELECTRO]));
        dmgSectionValue += data[Const.PROP_DMG_VAL_UP_ELECTRO];
        finalCritRate += data[Const.PROP_DMG_CRIT_RATE_UP_ELECTRO];
        finalCritDmg += data[Const.PROP_DMG_CRIT_DMG_UP_ELECTRO];
        dmgUpSectionValue += data[Const.PROP_DMG_BONUS_ELECTRO];
        dmgAntiSectionValue += data[Const.PROP_DMG_ANTI_ELECTRO];
        dmgAntiSectionValue -= data[Const.PROP_DMG_ANTI_ELECTRO_MINUS];
        break;
      case Const.PROP_DMG_BONUS_GEO:
        finalRate += data[Const.PROP_DMG_RATE_UP_GEO];
        // rateAttach = rateAttach.map((x)=>(x+data[Const.PROP_DMG_RATE_UP_GEO]));
        dmgSectionValue += data[Const.PROP_DMG_VAL_UP_GEO];
        finalCritRate += data[Const.PROP_DMG_CRIT_RATE_UP_GEO];
        finalCritDmg += data[Const.PROP_DMG_CRIT_DMG_UP_GEO];
        dmgUpSectionValue += data[Const.PROP_DMG_BONUS_GEO];
        dmgAntiSectionValue += data[Const.PROP_DMG_ANTI_GEO];
        dmgAntiSectionValue -= data[Const.PROP_DMG_ANTI_GEO_MINUS];
        break;
      case Const.PROP_DMG_BONUS_PYRO:
        finalRate += data[Const.PROP_DMG_RATE_UP_PYRO];
        // rateAttach = rateAttach.map((x)=>(x+data[Const.PROP_DMG_RATE_UP_PYRO]));
        dmgSectionValue += data[Const.PROP_DMG_VAL_UP_PYRO];
        finalCritRate += data[Const.PROP_DMG_CRIT_RATE_UP_PYRO];
        finalCritDmg += data[Const.PROP_DMG_CRIT_DMG_UP_PYRO];
        dmgUpSectionValue += data[Const.PROP_DMG_BONUS_PYRO];
        dmgAntiSectionValue += data[Const.PROP_DMG_ANTI_PYRO];
        dmgAntiSectionValue -= data[Const.PROP_DMG_ANTI_PYRO_MINUS];
        break;
      case Const.PROP_DMG_BONUS_HYDRO:
        finalRate += data[Const.PROP_DMG_RATE_UP_HYDRO];
        // rateAttach = rateAttach.map((x)=>(x+data[Const.PROP_DMG_RATE_UP_HYDRO]));
        dmgSectionValue += data[Const.PROP_DMG_VAL_UP_HYDRO];
        finalCritRate += data[Const.PROP_DMG_CRIT_RATE_UP_HYDRO];
        finalCritDmg += data[Const.PROP_DMG_CRIT_DMG_UP_HYDRO];
        dmgUpSectionValue += data[Const.PROP_DMG_BONUS_HYDRO];
        dmgAntiSectionValue += data[Const.PROP_DMG_ANTI_HYDRO];
        dmgAntiSectionValue -= data[Const.PROP_DMG_ANTI_HYDRO_MINUS];
        break;
      case Const.PROP_DMG_BONUS_DENDRO:
        finalRate += data[Const.PROP_DMG_RATE_UP_DENDRO];
        // rateAttach = rateAttach.map((x)=>(x+data[Const.PROP_DMG_RATE_UP_DENDRO]));
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
        // rateAttach = rateAttach.map((x)=>(x+data[Const.PROP_DMG_RATE_UP_NORMAL]));
        dmgSectionValue += data[Const.PROP_DMG_VAL_UP_NORMAL];
        finalCritRate += data[Const.PROP_DMG_CRIT_RATE_UP_NORMAL];
        finalCritDmg += data[Const.PROP_DMG_CRIT_DMG_UP_NORMAL];
        dmgUpSectionValue += data[Const.PROP_DMG_BONUS_NORMAL];
        //特別処理
        if(hasTag){
          finalRate += data[Const.PROP_DMG_RATE_UP_NORMAL + tag] ?? 0;
          // rateAttach = rateAttach.map((x)=>(x+data[Const.PROP_DMG_RATE_UP_NORMAL + tag] ?? 0));
          dmgSectionValue += data[Const.PROP_DMG_VAL_UP_NORMAL + tag] ?? 0;
          finalCritRate += data[Const.PROP_DMG_CRIT_RATE_UP_NORMAL + tag] ?? 0;
          finalCritDmg += data[Const.PROP_DMG_CRIT_DMG_UP_NORMAL + tag] ?? 0;
          dmgUpSectionValue += data[Const.PROP_DMG_BONUS_NORMAL + tag] ?? 0;
        }
        break;
      case Const.PROP_DMG_BONUS_CHARGED:
        finalRate += data[Const.PROP_DMG_RATE_UP_CHARGED];
        // rateAttach = rateAttach.map((x)=>(x+data[Const.PROP_DMG_RATE_UP_CHARGED]));
        dmgSectionValue += data[Const.PROP_DMG_VAL_UP_CHARGED];
        finalCritRate += data[Const.PROP_DMG_CRIT_RATE_UP_CHARGED];
        finalCritDmg += data[Const.PROP_DMG_CRIT_DMG_UP_CHARGED];
        dmgUpSectionValue += data[Const.PROP_DMG_BONUS_CHARGED];
        //特別処理
        if(hasTag){
          finalRate += data[Const.PROP_DMG_RATE_UP_CHARGED + tag] ?? 0;
          // rateAttach = rateAttach.map((x)=>(x+data[Const.PROP_DMG_RATE_UP_CHARGED + tag] ?? 0));
          dmgSectionValue += data[Const.PROP_DMG_VAL_UP_CHARGED + tag] ?? 0;
          finalCritRate += data[Const.PROP_DMG_CRIT_RATE_UP_CHARGED + tag] ?? 0;
          finalCritDmg += data[Const.PROP_DMG_CRIT_DMG_UP_CHARGED + tag] ?? 0;
          dmgUpSectionValue += data[Const.PROP_DMG_BONUS_CHARGED + tag] ?? 0;
        }
        break;
      case Const.PROP_DMG_BONUS_PLUNGING:
        finalRate += data[Const.PROP_DMG_RATE_UP_PLUNGING];
        // rateAttach = rateAttach.map((x)=>(x+data[Const.PROP_DMG_RATE_UP_PLUNGING]));
        dmgSectionValue += data[Const.PROP_DMG_VAL_UP_PLUNGING];
        finalCritRate += data[Const.PROP_DMG_CRIT_RATE_UP_PLUNGING];
        finalCritDmg += data[Const.PROP_DMG_CRIT_DMG_UP_PLUNGING];
        dmgUpSectionValue += data[Const.PROP_DMG_BONUS_PLUNGING];
        //特別処理
        if(hasTag){
          finalRate += data[Const.PROP_DMG_RATE_UP_PLUNGING + tag] ?? 0;
          // rateAttach = rateAttach.map((x)=>(x+data[Const.PROP_DMG_RATE_UP_PLUNGING + tag] ?? 0));
          dmgSectionValue += data[Const.PROP_DMG_VAL_UP_PLUNGING + tag] ?? 0;
          finalCritRate += data[Const.PROP_DMG_CRIT_RATE_UP_PLUNGING + tag] ?? 0;
          finalCritDmg += data[Const.PROP_DMG_CRIT_DMG_UP_PLUNGING + tag] ?? 0;
          dmgUpSectionValue += data[Const.PROP_DMG_BONUS_PLUNGING + tag] ?? 0;
        }
        break;
      case Const.PROP_DMG_BONUS_SKILL:
        finalRate += data[Const.PROP_DMG_RATE_UP_SKILL];
        // rateAttach = rateAttach.map((x)=>(x+data[Const.PROP_DMG_RATE_UP_SKILL]));
        dmgSectionValue += data[Const.PROP_DMG_VAL_UP_SKILL];
        finalCritRate += data[Const.PROP_DMG_CRIT_RATE_UP_SKILL];
        finalCritDmg += data[Const.PROP_DMG_CRIT_DMG_UP_SKILL];
        dmgUpSectionValue += data[Const.PROP_DMG_BONUS_SKILL];
        //特別処理
        if(hasTag){
          finalRate += data[Const.PROP_DMG_RATE_UP_SKILL + tag] ?? 0;
          // rateAttach = rateAttach.map((x)=>(x+data[Const.PROP_DMG_RATE_UP_SKILL + tag] ?? 0));
          dmgSectionValue += data[Const.PROP_DMG_VAL_UP_SKILL + tag] ?? 0;
          finalCritRate += data[Const.PROP_DMG_CRIT_RATE_UP_SKILL + tag] ?? 0;
          finalCritDmg += data[Const.PROP_DMG_CRIT_DMG_UP_SKILL + tag] ?? 0;
          dmgUpSectionValue += data[Const.PROP_DMG_BONUS_SKILL + tag] ?? 0;
        }
        break;
      case Const.PROP_DMG_BONUS_ELEMENTAL_BURST:
        finalRate += data[Const.PROP_DMG_RATE_UP_ELEMENTAL_BURST];
        // rateAttach = rateAttach.map((x)=>(x+data[Const.PROP_DMG_RATE_UP_ELEMENTAL_BURST]));
        dmgSectionValue += data[Const.PROP_DMG_VAL_UP_ELEMENTAL_BURST];
        finalCritRate += data[Const.PROP_DMG_CRIT_RATE_UP_ELEMENTAL_BURST];
        finalCritDmg += data[Const.PROP_DMG_CRIT_DMG_UP_ELEMENTAL_BURST];
        dmgUpSectionValue += data[Const.PROP_DMG_BONUS_ELEMENTAL_BURST];
        //特別処理
        if(hasTag){
          finalRate += data[Const.PROP_DMG_RATE_UP_ELEMENTAL_BURST + tag] ?? 0;
          // rateAttach = rateAttach.map((x)=>(x+data[Const.PROP_DMG_RATE_UP_ELEMENTAL_BURST + tag] ?? 0));
          dmgSectionValue += data[Const.PROP_DMG_VAL_UP_ELEMENTAL_BURST + tag] ?? 0;
          finalCritRate += data[Const.PROP_DMG_CRIT_RATE_UP_ELEMENTAL_BURST + tag] ?? 0;
          finalCritDmg += data[Const.PROP_DMG_CRIT_DMG_UP_ELEMENTAL_BURST + tag] ?? 0;
          dmgUpSectionValue += data[Const.PROP_DMG_BONUS_ELEMENTAL_BURST + tag] ?? 0;
        }
        break;
      case Const.PROP_DMG_BONUS_WEAPON:
        finalRate += data[Const.PROP_DMG_RATE_UP_WEAPON];
        // rateAttach = rateAttach.map((x)=>(x+data[Const.PROP_DMG_RATE_UP_WEAPON]));
        dmgSectionValue += data[Const.PROP_DMG_VAL_UP_WEAPON];
        finalCritRate += data[Const.PROP_DMG_CRIT_RATE_UP_WEAPON];
        finalCritDmg += data[Const.PROP_DMG_CRIT_DMG_UP_WEAPON];
        dmgUpSectionValue += data[Const.PROP_DMG_BONUS_WEAPON];
        //特別処理
        if(hasTag){
          finalRate += data[Const.PROP_DMG_RATE_UP_WEAPON + tag] ?? 0;
          // rateAttach = rateAttach.map((x)=>(x+data[Const.PROP_DMG_RATE_UP_WEAPON + tag] ?? 0));
          dmgSectionValue += data[Const.PROP_DMG_VAL_UP_WEAPON + tag] ?? 0;
          finalCritRate += data[Const.PROP_DMG_CRIT_RATE_UP_WEAPON + tag] ?? 0;
          finalCritDmg += data[Const.PROP_DMG_CRIT_DMG_UP_WEAPON + tag] ?? 0;
          dmgUpSectionValue += data[Const.PROP_DMG_BONUS_WEAPON + tag] ?? 0;
        }
        break;
      case Const.PROP_DMG_BONUS_OTHER:
        finalRate += data[Const.PROP_DMG_RATE_UP_OTHER];
        // rateAttach = rateAttach.map((x)=>(x+data[Const.PROP_DMG_RATE_UP_OTHER]));
        dmgSectionValue += data[Const.PROP_DMG_VAL_UP_OTHER];
        finalCritRate += data[Const.PROP_DMG_CRIT_RATE_UP_OTHER];
        finalCritDmg += data[Const.PROP_DMG_CRIT_DMG_UP_OTHER];
        dmgUpSectionValue += data[Const.PROP_DMG_BONUS_OTHER];
        //特別処理
        if(hasTag){
          finalRate += data[Const.PROP_DMG_RATE_UP_OTHER + tag] ?? 0;
          // rateAttach = rateAttach.map((x)=>(x+data[Const.PROP_DMG_RATE_UP_OTHER + tag] ?? 0));
          dmgSectionValue += data[Const.PROP_DMG_VAL_UP_OTHER + tag] ?? 0;
          finalCritRate += data[Const.PROP_DMG_CRIT_RATE_UP_OTHER + tag] ?? 0;
          finalCritDmg += data[Const.PROP_DMG_CRIT_DMG_UP_OTHER + tag] ?? 0;
          dmgUpSectionValue += data[Const.PROP_DMG_BONUS_OTHER + tag] ?? 0;
        }
        break;
      case Const.PROP_DMG_BONUS_SET:
        finalRate += data[Const.PROP_DMG_RATE_UP_SET];
        // rateAttach = rateAttach.map((x)=>(x+data[Const.PROP_DMG_BONUS_SET]));
        dmgSectionValue += data[Const.PROP_DMG_VAL_UP_SET];
        finalCritRate += data[Const.PROP_DMG_CRIT_RATE_UP_SET];
        finalCritDmg += data[Const.PROP_DMG_CRIT_DMG_UP_SET];
        dmgUpSectionValue += data[Const.PROP_DMG_BONUS_SET];
        //特別処理
        if(hasTag){
          finalRate += data[Const.PROP_DMG_RATE_UP_SET + tag] ?? 0;
          // rateAttach = rateAttach.map((x)=>(x+data[Const.PROP_DMG_BONUS_SET + tag] ?? 0));
          dmgSectionValue += data[Const.PROP_DMG_VAL_UP_SET + tag] ?? 0;
          finalCritRate += data[Const.PROP_DMG_CRIT_RATE_UP_SET + tag] ?? 0;
          finalCritDmg += data[Const.PROP_DMG_CRIT_DMG_UP_SET + tag] ?? 0;
          dmgUpSectionValue += data[Const.PROP_DMG_BONUS_SET + tag] ?? 0;
        }
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
      case Const.PROP_ELEMENTAL_MASTERY:
        dmgSectionValue += finalRate * data[Const.PROP_ELEMENTAL_MASTERY];
        break;
    }
    for(let i = 0; i < rateAttach.length; ++i){
      switch(baseAttach[i]){
        case Const.PROP_ATTACK:
          rateAttach[i].forEach((v)=>{
            dmgSectionValue += v * data[Const.PROP_ATTACK];
          })
          break;
        case Const.PROP_HP:
          rateAttach[i].forEach((v)=>{
            dmgSectionValue += v * data[Const.PROP_HP];
          })
          break;
        case Const.PROP_DEFENSE:
          rateAttach[i].forEach((v)=>{
            dmgSectionValue += v * data[Const.PROP_DEFENSE];
          })
          break;
        case Const.PROP_ELEMENTAL_MASTERY:
          rateAttach[i].forEach((v)=>{
            dmgSectionValue += v * data[Const.PROP_ELEMENTAL_MASTERY];
          })
          break;
      }
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
    let originAggravateDmg;//激化 雷
    let cirtAggravateDmg;//激化 雷
    let expectAggravateDmg;//激化 雷
    let originSpreadDmg;//激化 草
    let cirtSpreadDmg;//激化 草
    let expectSpreadDmg;//激化 草
    let burningDmg;
    let superconductDmg;
    let ruptureDmg;//開花 草 水
    let burgeonDmg;//列開花 草 水 炎
    let hyperbloomDmg;//超開花 草 水 雷
    let swirlCryoDmg;
    let swirlElectroDmg;
    let swirlElectroAggravateDmg;//拡散 雷 激化
    let swirlPyroDmg;
    let swirlHydroDmg;
    let electroChargedDmg;
    let destructionDmg;
    let overloadedDmg;
    let shieldHp;
    if([Const.PROP_DMG_BONUS_PYRO, Const.PROP_DMG_BONUS_HYDRO].includes(elementBonusType)){
      let reactionRate = REACTION_RATE_2_0;
      if(elementBonusType == Const.PROP_DMG_BONUS_PYRO){
        reactionRate = REACTION_RATE_1_5;
      }
      originVaporizeDmg = reactionRate * (1 + data[Const.PROP_DMG_ELEMENT_VAPORIZE_UP] + elementAmplitudeRate) * originDmg;
      cirtVaporizeDmg = reactionRate * (1 + data[Const.PROP_DMG_ELEMENT_VAPORIZE_UP] + elementAmplitudeRate) * critDmg;
      expectVaporizeDmg = reactionRate * (1 + data[Const.PROP_DMG_ELEMENT_VAPORIZE_UP] + elementAmplitudeRate) * expectDmg;
    }
    if([Const.PROP_DMG_BONUS_PYRO, Const.PROP_DMG_BONUS_CRYO].includes(elementBonusType)){
      let reactionRate = REACTION_RATE_2_0;
      if(elementBonusType == Const.PROP_DMG_BONUS_CRYO){
        reactionRate = REACTION_RATE_1_5;
      }
      originMeltDmg = reactionRate * (1 + data[Const.PROP_DMG_ELEMENT_MELT_UP] + elementAmplitudeRate) * originDmg;
      cirtMeltDmg = reactionRate * (1 + data[Const.PROP_DMG_ELEMENT_MELT_UP] + elementAmplitudeRate) * critDmg;
      expectMeltDmg = reactionRate * (1 + data[Const.PROP_DMG_ELEMENT_MELT_UP] + elementAmplitudeRate) * expectDmg;
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
      swirlElectroAggravateDmg = BASE_LEVEL_MULTIPLIER[data[Const.PROP_LEVEL] - 1] * REACTION_RATE_1_15 * (1 + elementSpread) * (1 - tempElectroDmgAntiSectionValue) + swirlElectroDmg;
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
    if([Const.PROP_DMG_BONUS_ELECTRO].includes(elementBonusType)){
      originAggravateDmg = (dmgSectionValue + BASE_LEVEL_MULTIPLIER[data[Const.PROP_LEVEL] - 1] * REACTION_RATE_1_15 * (1 + data[Const.PROP_DMG_ELEMENT_AGGRAVATE_UP] + elementSpread)) * (1 + dmgUpSectionValue) * (1 - dmgAntiSectionValue) * (1 - defenceSectionValue);
      cirtAggravateDmg = originAggravateDmg * (1 + finalCritDmg);
      expectAggravateDmg = originAggravateDmg * (1 - finalCritRate) + cirtAggravateDmg * finalCritRate;

      let tempDmgAntiSectionValue = this.getDmgAntiSectionValue(data, Const.ELEMENT_DENDRO);
      hyperbloomDmg = BASE_HYPERBLOOM[data[Const.PROP_LEVEL] - 1] * (1 + data[Const.PROP_DMG_ELEMENT_HYPERBLOOM_UP] + elementCataclysmRate) * (1 - tempDmgAntiSectionValue);
    }
    if([Const.PROP_DMG_BONUS_DENDRO].includes(elementBonusType)){
      originSpreadDmg = (dmgSectionValue + BASE_LEVEL_MULTIPLIER[data[Const.PROP_LEVEL] - 1] * REACTION_RATE_1_25 * (1 + data[Const.PROP_DMG_ELEMENT_SPREAD_UP] + elementSpread)) * (1 + dmgUpSectionValue) * (1 - dmgAntiSectionValue) * (1 - defenceSectionValue);
      cirtSpreadDmg = originSpreadDmg * (1 + finalCritDmg);
      expectSpreadDmg = originSpreadDmg * (1 - finalCritRate) + cirtSpreadDmg * finalCritRate;
    }
    if([Const.PROP_DMG_BONUS_PYRO].includes(elementBonusType)){
      let tempDmgAntiSectionValue = this.getDmgAntiSectionValue(data, Const.ELEMENT_DENDRO);
      burgeonDmg = BASE_BURGEON[data[Const.PROP_LEVEL] - 1] * (1 + data[Const.PROP_DMG_ELEMENT_BURGEON_UP] + elementCataclysmRate) * (1 - tempDmgAntiSectionValue);
    }
    if([Const.PROP_DMG_BONUS_HYDRO, Const.PROP_DMG_BONUS_DENDRO].includes(elementBonusType)){
      let tempDmgAntiSectionValue = this.getDmgAntiSectionValue(data, Const.ELEMENT_DENDRO);
      ruptureDmg = BASE_RUPTURE[data[Const.PROP_LEVEL] - 1] * (1 + data[Const.PROP_DMG_ELEMENT_RUPTURE_UP] + elementCataclysmRate) * (1 - tempDmgAntiSectionValue);
    }
    result = {
      elementBonusType: elementBonusType,
      finalCritRate: finalCritRate,
      originDmg: originDmg,
      critDmg: critDmg,
      expectDmg: expectDmg,
      originVaporizeDmg: originVaporizeDmg,
      cirtVaporizeDmg: cirtVaporizeDmg,
      expectVaporizeDmg: expectVaporizeDmg,
      originMeltDmg: originMeltDmg,
      cirtMeltDmg: cirtMeltDmg,
      expectMeltDmg: expectMeltDmg,
      originAggravateDmg: originAggravateDmg,//激化 雷
      cirtAggravateDmg: cirtAggravateDmg,//激化 雷
      expectAggravateDmg: expectAggravateDmg,//激化 雷
      originSpreadDmg: originSpreadDmg,//激化 草
      cirtSpreadDmg: cirtSpreadDmg,//激化 草
      expectSpreadDmg: expectSpreadDmg,//激化 草
      overloadedDmg: overloadedDmg,
      burningDmg: burningDmg,
      electroChargedDmg: electroChargedDmg,
      superconductDmg: superconductDmg,
      ruptureDmg: ruptureDmg,//開花 草 水
      burgeonDmg: burgeonDmg,//列開花 草 水 炎
      hyperbloomDmg: hyperbloomDmg,//超開花 草 水 雷
      swirlCryoDmg: swirlCryoDmg,
      swirlElectroDmg: swirlElectroDmg,
      swirlElectroAggravateDmg: swirlElectroAggravateDmg,//拡散 雷 激化
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
    let extra = param.extra ?? 0;
    let rate = param.rate ?? 0;
    let healingBonusType = param.healingBonusType;
    //計算
    let healing: number = 0;
    //特殊
    if(healingBonusType){
      switch(healingBonusType){
        case Const.PROP_HEALING_BONUS_SKILL:
          rate += data[Const.PROP_HEALING_RATE_UP_SKILL] ?? 0;
          extra += data[Const.PROP_HEALING_VAL_UP_SKILL] ?? 0;
          break;
        case Const.PROP_HEALING_BONUS_ELEMENTAL_BURST:
          rate += data[Const.PROP_HEALING_RATE_UP_ELEMENTAL_BURST] ?? 0;
          extra += data[Const.PROP_HEALING_VAL_UP_ELEMENTAL_BURST] ?? 0;
          break;
        case Const.PROP_HEALING_BONUS_WEAPON:
        case Const.PROP_HEALING_BONUS_OTHER:
        case Const.PROP_HEALING_BONUS_SET:
          break;
      }
    }
    if(base != undefined && rate != undefined){
      healing += data[base] * rate;
    }
    if(extra != undefined){
      healing += extra;
    }
    healing *= (1 + data[Const.PROP_HEALING_BONUS] + data[Const.PROP_REVERSE_HEALING_BONUS] + (healingBonusType?(data[healingBonusType] ?? 0):0));
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
    let extra = param.extra ?? 0;
    let rate = param.rate ?? 0;
    let shieldBonusType = param.shieldBonusType;
    //計算
    let shield: number = 0;
    if(base != undefined && rate != undefined){
      shield += data[base] * rate;
    }
    if(extra != undefined){
      shield += extra;
    }
    //特殊
    if(shieldBonusType){
      switch(shieldBonusType){
        case Const.PROP_SHIELD_BONUS_NORMAL:
          shield *= 1 + (data[Const.PROP_SHIELD_BONUS_NORMAL] ?? 0);
          break;
        case Const.PROP_SHIELD_BONUS_SKILL:
          shield *= 1 + (data[Const.PROP_SHIELD_BONUS_SKILL] ?? 0);
          break;
        case Const.PROP_SHIELD_BONUS_ELEMENTAL_BURST:
          shield *= 1 + (data[Const.PROP_SHIELD_BONUS_ELEMENTAL_BURST] ?? 0);
          break;
        case Const.PROP_SHIELD_BONUS_WEAPON:
          shield *= 1 + (data[Const.PROP_SHIELD_BONUS_WEAPON] ?? 0);
          break;
        case Const.PROP_SHIELD_BONUS_OTHER:
          shield *= 1 + (data[Const.PROP_SHIELD_BONUS_OTHER] ?? 0);
          break;
        case Const.PROP_SHIELD_BONUS_SET:
          shield *= 1 + (data[Const.PROP_SHIELD_BONUS_SET] ?? 0);
          break;
      }
    }
    shield *= 1 + (data[Const.PROP_DMG_ELEMENT_SHIELD_UP] ?? 0);
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
    let extra = param.extra ?? 0;
    let rate = param.rate ?? 0;
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

  getSkillDmgValue(index: string | number, skill: string, valueIndexs: number[], overrideElement?: string, skillIndex?: number | string): [DamageResult[], DamageParam[]]{
    let indexStr = index.toString();
    let params: DamageParam[] = [];
    let results: DamageResult[] = []

    if([Const.NAME_SKILLS_NORMAL, Const.NAME_SKILLS_SKILL, Const.NAME_SKILLS_ELEMENTAL_BURST,
    Const.NAME_CONSTELLATION, Const.NAME_SKILLS_PROUD, Const.NAME_SKILLS_OTHER, Const.NAME_EFFECT, Const.NAME_SET].includes(skill)){
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
      }else if(skill == Const.NAME_SKILLS_OTHER){
        infos = extraCharacterData?.skills!.other ?? [];
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
        let indexsAttach = damageInfo?.indexsAttach ?? [];
        let tempRateInfo: CharSkill;
        let rateAttach: number[][] = [];
        switch(skill){
          case Const.NAME_CONSTELLATION:
            tempRateInfo = characterData!.skills.talents[parseInt(skillIndex as string)];
            indexsAttach.forEach((valueIndexs)=>{
              let temp:number[] = [];
              valueIndexs.forEach((valueIndex)=>{
                temp.push(tempRateInfo.paramMap[currentLevel!][valueIndex]);
              })
              rateAttach.push(temp);
            })
            break;
          case Const.NAME_SKILLS_PROUD:
            tempRateInfo = characterData!.skills.proudSkills[skillIndex as number];
            indexsAttach.forEach((valueIndexs)=>{
              let temp:number[] = [];
              valueIndexs.forEach((valueIndex)=>{
                temp.push(tempRateInfo.paramMap[currentLevel!][valueIndex]);
              })
              rateAttach.push(temp);
            })
            break;
          case Const.NAME_SKILLS_OTHER:
            tempRateInfo = characterData!.skills.other;
            indexsAttach.forEach((valueIndexs)=>{
              let temp:number[] = [];
              valueIndexs.forEach((valueIndex)=>{
                temp.push(tempRateInfo.paramMap[currentLevel!][valueIndex]);
              })
              rateAttach.push(temp);
            })
            break;
          case Const.NAME_EFFECT:
            indexsAttach.forEach((valueIndexs)=>{
              let temp:number[] = [];
              valueIndexs.forEach((valueIndex)=>{
                temp.push(weaponData!.skillAffixMap[currentLevel].paramList[valueIndex]);
              })
              rateAttach.push(temp);
            })
            break;
          case Const.NAME_SET:
            indexsAttach.forEach((valueIndexs)=>{
              let temp:number[] = [];
              valueIndexs.forEach((valueIndex)=>{
                temp.push(artifactSetData.setAffixs[1].paramList[valueIndex]);
              })
              rateAttach.push(temp);
            })
            break;
          default:
            tempRateInfo = characterData!.skills![skill as keyof CharSkills] as CharSkill;
            indexsAttach.forEach((valueIndexs)=>{
              let temp:number[] = [];
              valueIndexs.forEach((valueIndex)=>{
                temp.push(tempRateInfo.paramMap[currentLevel!][valueIndex]);
              })
              rateAttach.push(temp);
            })
            break;
        }
        if(damageInfo?.customValues){
          for(let value of damageInfo.customValues){
            let base = damageInfo.base!;     
            let baseAttach = damageInfo.baseAttach!;
            let attackBonusType = damageInfo.attackBonusType!;
            let elementBonusType = damageInfo.elementBonusType!;
            let rate = value;
            if(damageInfo.originSkills){
              for(let i = 0; i < damageInfo.originSkills.length; ++i){
                let originRateInfo = characterData!.skills![damageInfo.originSkills[i] as keyof CharSkills] as CharSkill;
                let originSkillLevel = this.getCharacterSkillLevel(indexStr, damageInfo.originSkills[i]);
                let originRate = originRateInfo.paramMap[originSkillLevel][damageInfo.originIndexs![i]]
                switch(damageInfo.originRelations![i]){
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
            }
            params.push({
              base: base,
              rate: rate,
              baseAttach: baseAttach,
              rateAttach: rateAttach,
              attackBonusType: attackBonusType,
              elementBonusType: elementBonusType,
              tag: damageInfo.tag,
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
              }else if(skill == Const.NAME_SKILLS_OTHER){
                rateInfo = characterData!.skills.other;
                rate = rateInfo.paramMap[currentLevel!][valueIndex];
              }else if(skill == Const.NAME_EFFECT){
                rate = weaponData!.skillAffixMap[currentLevel].paramList[valueIndex];
              }else if(skill == Const.NAME_SET){
                rate = artifactSetData.setAffixs[1].paramList[valueIndex];
              }else{
                rateInfo = characterData!.skills![skill as keyof CharSkills] as CharSkill;
                rate = rateInfo.paramMap[currentLevel!][valueIndex];
              }
              if(damageInfo.originSkills){
                for(let i = 0; i < damageInfo.originSkills.length; ++i){
                  let originRateInfo = characterData!.skills![damageInfo.originSkills[i] as keyof CharSkills] as CharSkill;
                  let originSkillLevel = this.getCharacterSkillLevel(indexStr, damageInfo.originSkills[i]);
                  let originRate = originRateInfo.paramMap[originSkillLevel][damageInfo.originIndexs![i]]
                  switch(damageInfo.originRelations![i]){
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
              }
              let base = damageInfo.base!;
              let baseAttach = damageInfo.baseAttach!;
              let attackBonusType = damageInfo.attackBonusType!;
              let elementBonusType = damageInfo.elementBonusType!;
              if(damageInfo?.canOverride && overrideElement){
                elementBonusType = overrideElement;
              }
              params.push({
                base: base,
                rate: rate,
                baseAttach: baseAttach,
                rateAttach: rateAttach,
                attackBonusType: attackBonusType,
                elementBonusType: elementBonusType,
                tag: damageInfo.tag,
              });
            }
          }
        }
      }
    }

    for(let param of params){
      results.push(this.getDamage(indexStr, param));
    }

    return [results, params];
  }

  getSkillHealingValue(index: string | number, skill: string, valueIndexs: number[], skillIndex?: number | string){
    let indexStr = index.toString();
    let params: HealingParam[] = [];
    let results: HealingResult[] = []

    if([Const.NAME_SKILLS_NORMAL, Const.NAME_SKILLS_SKILL, Const.NAME_SKILLS_ELEMENTAL_BURST,
    Const.NAME_CONSTELLATION, Const.NAME_SKILLS_PROUD, Const.NAME_SKILLS_OTHER, Const.NAME_EFFECT, Const.NAME_SET].includes(skill)){
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
      }else if(skill == Const.NAME_SKILLS_OTHER){
        infos = extraCharacterData?.skills!.other ?? [];
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
                extra = (healingInfo.constIndex!=undefined)?rateInfo.paramMap[currentLevel!][healingInfo.constIndex] : 0;
              }else if(skill == Const.NAME_SKILLS_PROUD){
                rateInfo = characterData!.skills.proudSkills[skillIndex as number];
                rate = rateInfo.paramMap[currentLevel!][valueIndex];
                extra = (healingInfo.constIndex!=undefined)?rateInfo.paramMap[currentLevel!][healingInfo.constIndex] : 0;
              }else if(skill == Const.NAME_SKILLS_OTHER){
                rateInfo = characterData!.skills.other;
                rate = rateInfo.paramMap[currentLevel!][valueIndex];
                extra = (healingInfo.constIndex!=undefined)?rateInfo.paramMap[currentLevel!][healingInfo.constIndex] : 0;
              }else if(skill == Const.NAME_EFFECT){
                rate = weaponData!.skillAffixMap[currentLevel].paramList[valueIndex];
                extra = (healingInfo.constIndex!=undefined)?weaponData!.skillAffixMap[currentLevel].paramList[healingInfo.constIndex] : 0;
              }else if(skill == Const.NAME_SET){
                rate = artifactSetData.setAffixs[1].paramList[valueIndex];
                extra = (healingInfo.constIndex!=undefined)?artifactSetData.setAffixs[1].paramList[healingInfo.constIndex] : 0;
              }else{
                rateInfo = characterData!.skills![skill as keyof CharSkills] as CharSkill;
                rate = rateInfo.paramMap[currentLevel!][valueIndex];
                extra = (healingInfo.constIndex!=undefined)?rateInfo.paramMap[currentLevel!][healingInfo.constIndex] : 0;
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
              if(healingInfo.originSkills){
                const tempRate = rate
                for(let i = 0; i < healingInfo.originSkills.length; ++i){
                  let originRateInfo = characterData!.skills![healingInfo.originSkills[i] as keyof CharSkills] as CharSkill;
                  let originSkillLevel = this.getCharacterSkillLevel(indexStr, healingInfo.originSkills[i]);
                  let originRate = originRateInfo.paramMap[originSkillLevel][healingInfo.originIndexs![i]]
                  switch(healingInfo.originRelations![i]){
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

                  let tempExtra = 0
                  let originConstVal = originRateInfo.paramMap[originSkillLevel][healingInfo.originConstIndexs![i]]
                  switch(healingInfo.originConstRelations![i]){
                    case "*":
                      tempExtra = tempRate * originConstVal
                      break;
                    case "+":
                      tempExtra = tempRate + originConstVal
                      break;
                    case "-":
                      tempExtra = tempRate - originConstVal
                      break;
                    case "/":
                      tempExtra = tempRate / originConstVal
                      break;
                  }

                  switch(healingInfo.originInnerRelations![i]){
                    case "+":
                      extra += tempExtra
                      break;
                    case "-":
                      extra -= tempExtra
                      break;
                  }
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
      Const.NAME_CONSTELLATION, Const.NAME_SKILLS_PROUD, Const.NAME_SKILLS_OTHER, Const.NAME_EFFECT, Const.NAME_SET].includes(skill)){
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
        }else if(skill == Const.NAME_SKILLS_OTHER){
          infos = extraCharacterData?.skills!.other!;
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
            let shieldBonusType = shieldInfo.shieldBonusType;
            params.push({
              base: base,
              rate: rate,
              shieldBonusType: shieldBonusType
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
                  extra = (shieldInfo.constIndex!=undefined)?rateInfo.paramMap[currentLevel!][shieldInfo.constIndex] : 0;
                }else if(skill == Const.NAME_SKILLS_PROUD){
                  rateInfo = characterData!.skills.proudSkills[skillIndex as number];
                  rate = rateInfo.paramMap[currentLevel!][valueIndex];
                  extra = (shieldInfo.constIndex!=undefined)?rateInfo.paramMap[currentLevel!][shieldInfo.constIndex] : 0;
                }else if(skill == Const.NAME_SKILLS_OTHER){
                  rateInfo = characterData!.skills.other;
                  rate = rateInfo.paramMap[currentLevel!][valueIndex];
                  extra = (shieldInfo.constIndex!=undefined)?rateInfo.paramMap[currentLevel!][shieldInfo.constIndex] : 0;
                }else if(skill == Const.NAME_EFFECT){
                  rate = weaponData!.skillAffixMap[currentLevel].paramList[valueIndex];
                  extra = (shieldInfo.constIndex!=undefined)?weaponData!.skillAffixMap[currentLevel].paramList[shieldInfo.constIndex] : 0;
                }else if(skill == Const.NAME_SET){
                  rate = artifactSetData.setAffixs[1].paramList[valueIndex];
                  extra = (shieldInfo.constIndex!=undefined)?artifactSetData.setAffixs[1].paramList[shieldInfo.constIndex] : 0;
                }else{
                  rateInfo = characterData!.skills![skill as keyof CharSkills] as CharSkill;
                  rate = rateInfo.paramMap[currentLevel!][valueIndex];
                  extra = (shieldInfo.constIndex!=undefined)?rateInfo.paramMap[currentLevel!][shieldInfo.constIndex] : 0;
                }
                
                let base = shieldInfo.base!;
                let shieldBonusType = shieldInfo.shieldBonusType;
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
                  shieldBonusType: shieldBonusType,
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
      Const.NAME_CONSTELLATION, Const.NAME_SKILLS_PROUD, Const.NAME_SKILLS_OTHER, Const.NAME_EFFECT, Const.NAME_SET].includes(skill)){
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
        }else if(skill == Const.NAME_SKILLS_OTHER){
          infos = extraCharacterData?.skills!.other ?? [];
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
                  extra = (productHpInfo.constIndex!=undefined)?rateInfo.paramMap[currentLevel!][valueIndex] : 0;
                }else if(skill == Const.NAME_SKILLS_PROUD){
                  rateInfo = characterData!.skills.proudSkills[skillIndex as number];
                  rate = rateInfo.paramMap[currentLevel!][valueIndex];
                  extra = (productHpInfo.constIndex!=undefined)?rateInfo.paramMap[currentLevel!][valueIndex] : 0;
                }else if(skill == Const.NAME_SKILLS_OTHER){
                  rateInfo = characterData!.skills.other;
                  rate = rateInfo.paramMap[currentLevel!][valueIndex];
                  extra = (productHpInfo.constIndex!=undefined)?rateInfo.paramMap[currentLevel!][valueIndex] : 0;
                }else if(skill == Const.NAME_EFFECT){
                  rate = weaponData!.skillAffixMap[currentLevel].paramList[valueIndex];
                  extra = (productHpInfo.constIndex!=undefined)?weaponData!.skillAffixMap[currentLevel].paramList[productHpInfo.constIndex] : 0;
                }else if(skill == Const.NAME_SET){
                  rate = artifactSetData.setAffixs[1].paramList[valueIndex];
                  extra = (productHpInfo.constIndex!=undefined)?artifactSetData.setAffixs[1].paramList[productHpInfo.constIndex] : 0;
                }else{
                  rateInfo = characterData!.skills![skill as keyof CharSkills] as CharSkill;
                  rate = rateInfo.paramMap[currentLevel!][valueIndex];
                  extra = (productHpInfo.constIndex!=undefined)?rateInfo.paramMap[currentLevel!][valueIndex] : 0;
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
      Const.NAME_CONSTELLATION, Const.NAME_SKILLS_PROUD, Const.NAME_SKILLS_OTHER, Const.NAME_EFFECT, Const.NAME_SET].includes(skill)){
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
        }else if(skill == Const.NAME_SKILLS_OTHER){
          infos = extraCharacterData?.skills!.other ?? [];
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
          let buffInfos = info.buffs || [];
          for(let buffInfo of buffInfos){       
            let tempValue: any;
            //聖遺物と武器効果が一箇所しないため、表示チェックを排除する（一時的）
            if(skill != Const.NAME_SET && skill != Const.NAME_EFFECT){
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
                    desc: buffInfo.desc,
                    title: buffInfo.title,
                    isAllTeam: buffInfo.isAllTeam,
                    isOnlyForOther: buffInfo.isOnlyForOther,
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
                    desc: buffInfo.desc,
                    title: buffInfo.title,
                    isAllTeam: buffInfo.isAllTeam,
                    isOnlyForOther: buffInfo.isOnlyForOther,
                  })
                  break;
                case 'resident':
                default:
                  continue;
              }
            }
          }
        }
      }
  
      return results;
  }

  setSkillBuffValue(index: string | number, skill: string, valueIndex: number, type: string, setValue: number | boolean, skillIndex?: number | string){
    let indexStr = index.toString();
    if([Const.NAME_SKILLS_NORMAL, Const.NAME_SKILLS_SKILL, Const.NAME_SKILLS_ELEMENTAL_BURST,
    Const.NAME_CONSTELLATION, Const.NAME_SKILLS_PROUD, Const.NAME_SKILLS_OTHER].includes(skill)){
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
  private getAllData(index: string | number, extraData?: Record<string, number>, toAddWeaponSmelting: number = 0, withEnemyAnt: boolean = true){
    let result: Record<string, number> = {};
    let indexStr = index.toString();
    //その他バフ処理(二度転換可能)
    let otherSecondaryData = this.getOtherData(indexStr, 'secondary') ?? {};
    //その他バフ処理(一度)
    let otherOnceData = this.getOtherData(indexStr, 'once') ?? {};
    //チームバフ処理(二度転換可能)
    let teamSecondaryData = this.dataMap[indexStr].extraTeamSecondaryResult ?? {};
    //チームバフ処理(一度)
    let teamOnceData = this.dataMap[indexStr].extraTeamOnceResult ?? {};
    //一時武器データ
    let tempWeaponData: [Record<string, number>, SpecialBuff[], TeamBuff[]]|null = null;
    //カスタム武器精錬
    let useCustomWeaponSmelting = toAddWeaponSmelting !== 0;

    for(let key of Const.PROPS_ALL_BASE){
      if(!(key in result)){
        result[key] = 0;
      }
      result[key] += this.getProperty(index, key, useCustomWeaponSmelting);
    }
    if(withEnemyAnt){
      for(let key of Const.PROPS_ENEMY_ANTI.concat(Const.PROPS_ENEMY_DEFENSE)){
        if(!(key in result)){
          result[key] = 0;
        }
        result[key] += this.getPropertyEnemy(index, key);
      }
    }
    if(useCustomWeaponSmelting) {
      let weaponStorageData = this.weaponService.getStorageInfo(index);
      let smeltingLevel = (parseInt(weaponStorageData.smeltingLevel!) + toAddWeaponSmelting).toString();
      smeltingLevel = smeltingLevel > Const.MAX_WEAPON_SMELTING ? Const.MAX_WEAPON_SMELTING : smeltingLevel.toString();
      tempWeaponData = this.getExtraWeaponData(indexStr, {smeltingLevel});
    }
    if(tempWeaponData) {
      for(let key of Object.keys(tempWeaponData[0])) {
        result[key] += tempWeaponData[0][key];
      }
    }

    //その他バフ処理(二度転換可能)
    for(let target in otherSecondaryData){
      result[target] += otherSecondaryData[target] ?? 0;
    }
    //チームバフ処理(二度転換可能)
    for(let target in teamSecondaryData){
      result[target] += teamSecondaryData[target] ?? 0;
    }

    if(extraData != undefined){
      for(let key in extraData){
        if([Const.PROP_HP, Const.PROP_ATTACK, Const.PROP_DEFENSE].includes(key)){
          switch(key){
            case Const.PROP_HP:
              result[Const.PROP_VAL_HP] += extraData[key];
              break;
            case Const.PROP_ATTACK:
              result[Const.PROP_VAL_ATTACK] += extraData[key];
              break;
            case Const.PROP_DEFENSE:
              result[Const.PROP_VAL_DEFENSE] += extraData[key];
              break;
          }
        }else{
          result[key] += extraData[key];
        }
      }
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
    let specialOrdersFinally: SpecialBuff[] = [];
    specialOrders = specialOrders.concat(
      this.dataMap[index].extraSpecialCharaResult!,
      this.dataMap[index].extraSpecialArtifactSetResult!,
      this.dataMap[index].extraSpecialTeamResult!,
    );
    if(tempWeaponData){
      specialOrders = specialOrders.concat(tempWeaponData[1])
    }else{
      specialOrders = specialOrders.concat(this.dataMap[index].extraSpecialWeaponResult!)
    }
    specialOrders.sort((x, y) => x.priority! - y.priority!);

    //スペシャル処理
    for(let buff of specialOrders){
      //最後に計算する場合
      if(buff.finallyCal){
        specialOrdersFinally.push(buff);
        continue;
      }
      this.calSpecialToResult(buff, result);
    }

    //チームバフ
    let specialTeamSelfOrders: TeamBuff[] = [];
    specialTeamSelfOrders = specialTeamSelfOrders.concat(
      this.dataMap[index].extraSpecialSelfTeamCharaResult!,
      this.dataMap[index].extraSpecialSelfTeamWeaponResult!,
      this.dataMap[index].extraSpecialSelfTeamArtifactSetResult!,
    );

    //チーム特殊バフ計算
    let resultSelfTeamBuff: SelfTeamBuff = this.dataMap[index].selfTeamBuff!;
    //重複のリストを削除
    let selfTeamBuff = this.dataMap[index].selfTeamBuff!;
    for(let key of [
      Const.NAME_SKILLS_NORMAL,
      Const.NAME_SKILLS_SKILL,
      Const.NAME_SKILLS_ELEMENTAL_BURST,
      Const.NAME_SKILLS_OTHER,
      // Const.NAME_SKILLS_PROUD,
      // Const.NAME_CONSTELLATION,
      Const.NAME_EFFECT,
      Const.NAME_SET,
    ]){
      (selfTeamBuff[key as keyof SelfTeamBuff] as TeamBuff[]) = (selfTeamBuff[key as keyof SelfTeamBuff] as TeamBuff[]).filter((v:TeamBuff)=>(!v.path && v.val!=0));
    }
    for(let [i,_] of selfTeamBuff.proudSkills.entries()){
      selfTeamBuff.proudSkills[i] = selfTeamBuff.proudSkills[i].filter((v:TeamBuff)=>(!v.path && v.val!=0));
    }
    for(let key of [
      Const.NAME_CONSTELLATION_1,
      Const.NAME_CONSTELLATION_2,
      Const.NAME_CONSTELLATION_3,
      Const.NAME_CONSTELLATION_4,
      Const.NAME_CONSTELLATION_5,
      Const.NAME_CONSTELLATION_6,
    ]){
      selfTeamBuff.constellation[key] = selfTeamBuff.constellation[key].filter((v:TeamBuff)=>(!v.path && v.val!=0));
    }
    //再計算
    this.calTeamSpecialBuff(specialTeamSelfOrders, result, resultSelfTeamBuff);
    this.dataMap[index].selfTeamBuff = resultSelfTeamBuff;

    //その他バフ処理(一度)
    for(let target in otherOnceData){
      result[target] += otherOnceData[target] ?? 0;
      //計算必要分再計算
      this.recalBaseProp(target, result);
    }
    //チームバフ処理(一度)
    for(let target in teamOnceData){
      result[target] += teamOnceData[target] ?? 0;
      //計算必要分再計算
      this.recalBaseProp(target, result);
    }

    //スペシャル処理(ファイナリー)
    for(let buff of specialOrdersFinally){
      this.calSpecialToResult(buff, result);
    }

    return result;
  }

  private calSpecialToResult(buff: SpecialBuff, result: Record<string,number>){
    let baseValue = buff.base?result[buff.base]:0;
    //特殊BUFFに変えるための仮想属性
    if(buff.base == Const.PROP_FIX_NUMBER_1){
      baseValue = 1;
    }
    if(buff.base2 != undefined){
      baseValue *= result[buff.base2];
    }
    let modifyValue = buff.baseModifyValue?buff.baseModifyValue:0;
    let toAdd = ((baseValue + modifyValue>0)?(baseValue + modifyValue):0) * buff.multiValue!;
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
    this.recalBaseProp(buff.target, result);
  }

  private appendToExtraTeam(buffs: TeamBuff[], extraTeamOnceResult: Record<string, number>, extraTeamSecondaryResult: Record<string, number>, extraSpecialTeamResult: SpecialBuff[], buffTag: Record<string,string[]>){
    for(let v of buffs){
      if(v.calByOrigin && v.isSpecial){
        extraSpecialTeamResult.push(v as SpecialBuff);
      }else {
        if(!v.canSecondaryTrans){
          if(!extraTeamOnceResult.hasOwnProperty(v.target)){
            extraTeamOnceResult[v.target] = 0;
          }
          if(this.checkAndSetBuffTag(v.tag,v.target,buffTag)){
            extraTeamOnceResult[v.target] += v.val ?? 0;
          }
        }else{
          if(!extraTeamSecondaryResult.hasOwnProperty(v.target)){
            extraTeamSecondaryResult[v.target] = 0;
          }
          if(this.checkAndSetBuffTag(v.tag,v.target,buffTag)){
            extraTeamSecondaryResult[v.target] += v.val ?? 0;
          }
        }
      }
    }
  }

  private calTeamSpecialBuff(buffs: TeamBuff[], props: Record<string,number>, resultSelfTeamBuff: SelfTeamBuff){
    for(let buff of buffs){
      let v = {...buff};
      if(!v.calByOrigin && v.isSpecial){
        v.isSpecial = false;
        let baseValue = v.base?props[v.base]:0;
        //特殊BUFFに変えるための仮想属性
        if(v.base == Const.PROP_FIX_NUMBER_1){
          baseValue = 1;
        }
        if(v.base2 != undefined){
          baseValue *= props[v.base2];
        }
        let modifyValue = v.baseModifyValue?v.baseModifyValue:0;
        let toAdd = ((baseValue + modifyValue>0)?(baseValue + modifyValue):0) * v.multiValue!;
        if(v.maxVal && toAdd > v.maxVal){
          toAdd = v.maxVal;
        }else if(v.specialMaxVal != undefined){
          let specialMaxVal = props[v.specialMaxVal.base!] * v.specialMaxVal.multiValue!;
          if(toAdd > specialMaxVal){
            toAdd = specialMaxVal;
          }
        }
        v.val = toAdd;
      }
      if(v.path && v.val != 0){
        let temp: any = resultSelfTeamBuff;
        for(let i of v.path){
          temp = temp[i];
        }
        (temp as TeamBuff[]).push(v);
      }
    }
  }

  private recalBaseProp(traget: string | undefined, result: Record<string,number>){
    //計算必要分再計算
    switch(traget){
      case Const.PROP_HP_UP:
      case Const.PROP_VAL_HP:
        result[Const.PROP_HP] = result[Const.PROP_HP_BASE] * (1 + result[Const.PROP_HP_UP]) + result[Const.PROP_VAL_HP];
        break;
      case Const.PROP_ATTACK_UP:
      case Const.PROP_VAL_ATTACK:
        result[Const.PROP_ATTACK] = result[Const.PROP_ATTACK_BASE] * (1 + result[Const.PROP_ATTACK_UP]) + result[Const.PROP_VAL_ATTACK];
        break;
      case Const.PROP_DEFENSE_UP:
      case Const.PROP_VAL_DEFENSE:
        result[Const.PROP_DEFENSE] = result[Const.PROP_DEFENSE_BASE] * (1 + result[Const.PROP_DEFENSE_UP]) + result[Const.PROP_VAL_DEFENSE];
        break;
      case Const.PROP_DMG_ENEMY_DEFENSE_DOWN:
        result[Const.PROP_DMG_ENEMY_DEFENSE] = result[Const.PROP_DMG_ENEMY_DEFENSE_BASE] * (1 - result[Const.PROP_DMG_ENEMY_DEFENSE_DOWN]);
        break;
    }
  }

  //全情報から属性取得（まとめ）
  private getProperty(index: string | number, prop: string, withoutWeaponExtra: boolean = false) {
    let result = 0;
    let indexStr = index.toString();
    let genshinDataProp = prop;
    let genshinArtifactDataProp = prop;
    if([Const.PROP_LEVEL,
      Const.PROP_ELEMENTAL_BURST_ENERGY,
      Const.PROP_DMG_ENEMY_DEFENSE_BASE,
      Const.PROP_HP_BASE,
      Const.PROP_ATTACK_BASE,
      Const.PROP_DEFENSE_BASE,
    ].includes(prop)){
      switch(prop){
        case Const.PROP_LEVEL:
          result = this.getCharacterData(indexStr).level;
          return result;
          //break;
        case Const.PROP_ELEMENTAL_BURST_ENERGY:
          result = this.characterService.get(indexStr).skills.elementalBurst.costElemVal;
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
    if(!withoutWeaponExtra){
      let extraWeaponResult = this.dataMap[indexStr].extraWeaponResult!;
      if(extraWeaponResult[prop] != undefined){
        result += extraWeaponResult[prop];
      }
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

    return result;
  }

  //全情報から属性取得（敵）
  private getPropertyEnemy(index: string | number, prop: string) {
    let indexStr = index.toString();
    let genshinDataProp = prop.toLowerCase();

    if([Const.PROP_DMG_ENEMY_DEFENSE_BASE].includes(prop)){
      switch(prop){
        case Const.PROP_DMG_ENEMY_DEFENSE_BASE:
          return this.getEnemyData(indexStr).defense;
      }
    }
    return this.getEnemyData(indexStr)[genshinDataProp as keyof EnemyStatus] ?? 0;
  }

  //キャラ追加データ解析
  private getExtraCharacterData(index: string | number, data?: CharLevelConfig): [Record<string, number>, SpecialBuff[], TeamBuff[]]{
    let characterData = this.dataMap[index]!.characterData!;
    let skillLevel;
    let elementalBurstLevel;
    let characterStorageData = this.characterService.getStorageInfo(index);
    let overrideElement = this.characterService.getOverrideElement(index);
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
    let specialTeamSlefResult: TeamBuff[] = [];
    let hasOverride: boolean = false;
    
    if(skillLevel == undefined || elementalBurstLevel == undefined){
      return [result, specialResult, specialTeamSlefResult];
    }

    if(Const.NAME_SKILLS in setting && setting.skills){
      if(Const.NAME_SKILLS_SKILL in setting.skills){
        let setBuffResult = this.setBuffDataToResult(
          characterData.skills?.skill, 
          skillLevel, 
          extraCharacterData.skills!.skill,
          setting.skills.skill!,
          result,
          specialResult,
          specialTeamSlefResult,
          [name_skill],
          this.dataMap[index].selfTeamBuff!.skill,
          this.dataMap[index].buffTag!,
          characterData.weaponType,
          characterData.info.elementType,
          overrideElement,
        );
        if(!hasOverride && overrideElement != setBuffResult.overrideElement){
          hasOverride = true;
          overrideElement = setBuffResult.overrideElement!;
          this.characterService.setOverrideElement(index, setBuffResult.overrideElement);
        }
      }
      if(Const.NAME_SKILLS_ELEMENTAL_BURST in setting.skills){
        let setBuffResult = this.setBuffDataToResult(
          characterData.skills?.elementalBurst, 
          elementalBurstLevel, 
          extraCharacterData.skills!.elementalBurst,
          setting.skills.elementalBurst!,
          result,
          specialResult,
          specialTeamSlefResult,
          [name_elementalBurst],
          this.dataMap[index].selfTeamBuff!.elementalBurst,
          this.dataMap[index].buffTag!,
          characterData.weaponType,
          characterData.info.elementType,
          overrideElement,
        );
        if(!hasOverride && overrideElement != setBuffResult.overrideElement){
          hasOverride = true;
          overrideElement = setBuffResult.overrideElement!;
          this.characterService.setOverrideElement(index, setBuffResult.overrideElement);
        }
      }
      if(Const.NAME_SKILLS_OTHER in setting.skills && extraCharacterData.skills!.other != undefined){
        let setBuffResult = this.setBuffDataToResult(
          characterData.skills?.other, 
          Const.NAME_TALENT_DEFAULT_LEVEL, 
          extraCharacterData.skills!.other,
          setting.skills.other!,
          result,
          specialResult,
          specialTeamSlefResult,
          [name_other],
          this.dataMap[index].selfTeamBuff!.other,
          this.dataMap[index].buffTag!,
          characterData.weaponType,
          characterData.info.elementType,
          overrideElement,
        );
        if(!hasOverride && overrideElement != setBuffResult.overrideElement){
          hasOverride = true;
          overrideElement = setBuffResult.overrideElement!;
          this.characterService.setOverrideElement(index, setBuffResult.overrideElement);
        }
      }
      if(Const.NAME_SKILLS_PROUD in setting.skills){
        this.dataMap[index].selfTeamBuff!.proudSkills.length = 0;
        for(let i = 0; i < setting.skills.proudSkills!.length; ++i){
          let obj = setting.skills.proudSkills![i];
          this.dataMap[index].selfTeamBuff!.proudSkills.push([]);
          if(Object.keys(obj).length === 0){
            continue;
          }
          let setBuffResult = this.setBuffDataToResult(
            characterData.skills?.proudSkills[i], 
            Const.NAME_TALENT_DEFAULT_LEVEL, 
            extraCharacterData.skills!.proudSkills![i],
            obj,
            result,
            specialResult,
            specialTeamSlefResult,
            [name_proudSkills, i],
            this.dataMap[index].selfTeamBuff!.proudSkills[i],
            this.dataMap[index].buffTag!,
            characterData.weaponType,
            characterData.info.elementType,
            overrideElement,
          );
          if(!hasOverride && overrideElement != setBuffResult.overrideElement){
            hasOverride = true;
            overrideElement = setBuffResult.overrideElement!;
            this.characterService.setOverrideElement(index, setBuffResult.overrideElement);
          }
        }
      }
    }

    if(Const.NAME_CONSTELLATION in setting && setting.constellation){
      for(let i of [Const.NAME_CONSTELLATION_1, Const.NAME_CONSTELLATION_2, Const.NAME_CONSTELLATION_3, Const.NAME_CONSTELLATION_4, Const.NAME_CONSTELLATION_5, Const.NAME_CONSTELLATION_6]){
        if(i in setting.constellation){
          let setBuffResult = this.setBuffDataToResult(
            characterData.skills.talents[parseInt(i)], 
            Const.NAME_TALENT_DEFAULT_LEVEL, 
            extraCharacterData.constellation![i],
            setting.constellation![i],
            result,
            specialResult,
            specialTeamSlefResult,
            [name_constellation, i],
            this.dataMap[index].selfTeamBuff!.constellation[i],
            this.dataMap[index].buffTag!,
            characterData.weaponType,
            characterData.info.elementType,
            overrideElement,
          );
          if(!hasOverride && overrideElement != setBuffResult.overrideElement){
            hasOverride = true;
            overrideElement = setBuffResult.overrideElement!;
            this.characterService.setOverrideElement(index, setBuffResult.overrideElement);
          }
        }
      }
    }

    return [result, specialResult, specialTeamSlefResult];
  }

  //武器追加データ解析
  private getExtraWeaponData(index: string | number, data?: WeaponLevelConfig): [Record<string, number>, SpecialBuff[], TeamBuff[]]{
    let weaponData = this.dataMap[index]!.weaponData!;
    let characterData = this.dataMap[index]!.characterData!;
    let smeltingLevel;
    let weaponStorageData = this.weaponService.getStorageInfo(index);
    let overrideElement = this.characterService.getOverrideElement(index);
    if(data && data.smeltingLevel){
      smeltingLevel = data.smeltingLevel!;
    }else{
      smeltingLevel = weaponStorageData.smeltingLevel!;
    }
    let extraWeaponData = this.extraDataService.getWeapon(weaponData.id);
    let setting = this.weaponService.getExtraData(index)!;
    let result: Record<string, number> = {};
    let specialResult: SpecialBuff[] = [];
    let specialTeamSlefResult: TeamBuff[] = [];

    if("effect" in setting && setting.effect){
      let setBuffResult = this.setBuffDataToResult(
        weaponData.skillAffixMap[smeltingLevel] ?? weaponData.skillAffixMap[Const.MIN_WEAPON_SMELTING], 
        Const.NAME_NO_LEVEL, 
        extraWeaponData.effect!,
        setting.effect!,
        result,
        specialResult,
        specialTeamSlefResult,
        [name_effect],
        this.dataMap[index].selfTeamBuff!.effect,
        this.dataMap[index].buffTag!,
        characterData.weaponType,
        characterData.info.elementType,
        overrideElement,
      );
      if(overrideElement != setBuffResult.overrideElement){
        this.characterService.setOverrideElement(index, setBuffResult.overrideElement);
      }
    }

    return [result, specialResult, specialTeamSlefResult];
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
  private getExtraReliquarySetData(index: string): [Record<string, number>, SpecialBuff[], TeamBuff[]]{
    let characterData = this.dataMap[index]!.characterData!;
    let artifactSetIndexs = this.artifactService.getStorageSetIndexs(index);
    let overrideElement = this.characterService.getOverrideElement(index);
    let result: Record<string, number> = {};
    let specialResult: SpecialBuff[] = [];
    let specialTeamSlefResult: TeamBuff[] = [];
    let targetIndexInfos: artifactSetInfo[] = [];
    let ownedIndexs: string[] = [];
    for(let [i,setIndex] of artifactSetIndexs.entries()){
      if(setIndex != undefined && setIndex != ""){
        ownedIndexs.push(setIndex);
        targetIndexInfos.push({
          index: setIndex,
          level: ownedIndexs.filter(x => x == setIndex).length,
          setIndex: i + 1,
        });
      }
    }
    for(let targetIndexInfo of targetIndexInfos){
      let tempResult: Record<string, number> = {};
      let tempSpecialResult: SpecialBuff[] = [];
      let tempSpecialTeamSlefResult: TeamBuff[] = [];
      let artifactSetData = this.artifactService.getSet(targetIndexInfo.index);
      let extraArtifactData = this.extraDataService.getArtifactSet(targetIndexInfo.index);
      let setting = this.artifactService.getExtraData(index)!;
      let setBuffResult = this.setBuffDataToResult(
        artifactSetData.setAffixs[targetIndexInfo.level - 1], 
        Const.NAME_NO_LEVEL,
        extraArtifactData?extraArtifactData[Const.NAME_SET + targetIndexInfo.level as keyof ExtraArtifact]!:[],
        setting[Const.NAME_SET + targetIndexInfo.setIndex as keyof ExtraArtifactSetData] ?? {},
        tempResult,
        tempSpecialResult,
        tempSpecialTeamSlefResult,
        [name_set],
        this.dataMap[index].selfTeamBuff!.set,
        this.dataMap[index].buffTag!,
        characterData.weaponType,
        characterData.info.elementType,
        overrideElement,
      );
      if(overrideElement != setBuffResult.overrideElement){
        this.characterService.setOverrideElement(index, setBuffResult.overrideElement);
      }
      for(let key in tempResult){
        if(result[key] == undefined){
          result[key] = tempResult[key];
        }else{
          result[key] += tempResult[key];
        }
      }
      specialResult.push(...tempSpecialResult);
      specialTeamSlefResult.push(...tempSpecialTeamSlefResult);
    }

    return [result, specialResult, specialTeamSlefResult];
  }

  //チームデータ解析
  private setExtraTeamData(index: string){
    this.initTeamBuffData(index, false);
    let team: string[] = this.teamService.getOtherMembers(index);
    for(let i = 0; i < team.length; ++i){
      let subIndex = team[i];
      if(!subIndex || !(subIndex?.length>0)){
        continue;
      }
      this.initAllDataBackground(subIndex);

      //チームバフ
      let buffs = this.dataMap[subIndex].selfTeamBuff!;
      for(let key of [
        Const.NAME_SKILLS_NORMAL,
        Const.NAME_SKILLS_SKILL,
        Const.NAME_SKILLS_ELEMENTAL_BURST,
        Const.NAME_SKILLS_OTHER,
        Const.NAME_EFFECT,
        Const.NAME_SET,
      ]){
        this.appendToExtraTeam(
          buffs[key as keyof SelfTeamBuff] as TeamBuff[],
          this.dataMap[index].extraTeamOnceResult!,
          this.dataMap[index].extraTeamSecondaryResult!,
          this.dataMap[index].extraSpecialTeamResult!,
          this.dataMap[index].buffTag!,
        );
      }
      for(let v of buffs.proudSkills){
        this.appendToExtraTeam(
          v,
          this.dataMap[index].extraTeamOnceResult!,
          this.dataMap[index].extraTeamSecondaryResult!,
          this.dataMap[index].extraSpecialTeamResult!,
          this.dataMap[index].buffTag!,
        );
      }
      for(let key of [
        Const.NAME_CONSTELLATION_1,
        Const.NAME_CONSTELLATION_2,
        Const.NAME_CONSTELLATION_3,
        Const.NAME_CONSTELLATION_4,
        Const.NAME_CONSTELLATION_5,
        Const.NAME_CONSTELLATION_6,
      ]){
        this.appendToExtraTeam(
          buffs.constellation[key],
          this.dataMap[index].extraTeamOnceResult!,
          this.dataMap[index].extraTeamSecondaryResult!,
          this.dataMap[index].extraSpecialTeamResult!,
          this.dataMap[index].buffTag!,
        );
      }
    }
  }

  //その他データ解析
  private getOtherData(index: string, filter: 'all'|'once'|'secondary'): Record<string, number> | undefined{
    let result: Record<string, number> = {};
    let temps: OtherStorageInfo[] = this.otherService.getStorageInfos(index, undefined, filter);
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
  private setBuffDataToResult(
    skillData: SkillParamInf, 
    skillLevel: string, 
    buffs: ExtraSkillInfo[], 
    setting: ExtraStatus, 
    result: Record<string, number>, 
    specialResult: SpecialBuff[], 
    specialTeamSlefResult: TeamBuff[], 
    path: any[],
    selfTeamBuffs: TeamBuff[],
    buffTag: Record<string, string[]>,
    weaponType: WeaponType, 
    elementType: ElementType, 
    crruentOverrideElement: string): SetBuffResult{
    let setBuffResult: SetBuffResult = {};
    if(skillData == undefined || buffs == undefined){
      return setBuffResult;
    }
    let switchOnSet = setting?.switchOnSet ?? {};
    let sliderNumMap = setting?.sliderNumMap ?? {};
    let overrideElement = crruentOverrideElement;

    selfTeamBuffs.length = 0;

    for(let [buffIndex,buffInfo] of buffs.entries()){
      let subBuffs = buffInfo?.buffs || [];
      for(let buff of subBuffs){
        let isAllTeam = buff.isAllTeam ?? false;
        let isOnlyForOther = buff.isOnlyForOther ?? false;
        let isEnableInSwitch = true;
        let isEnableInSlider = true;
        if(!(buffIndex in switchOnSet) || switchOnSet[buffIndex] != true){
          isEnableInSwitch = false;
        }
        if(!(buffIndex in sliderNumMap) || typeof sliderNumMap[buffIndex] != "number"){
          isEnableInSlider = false;
        }
  
        if(buff){
          //元素付与リセット
          // if(buff.overrideElement == crruentOverrideElement){
          //   overrideElement = "";
          // }
          //限定武器タイプチェック
          if(buff?.weaponTypeLimit != undefined){
            if(!buff.weaponTypeLimit.includes(weaponType)){
              continue;
            }
          }
          //限定自身元素タイプチェック準備
          let checkSelfElementType = buff?.selfElementTypeLimit === true;
          let selfElementType = Const.ELEMENT_TYPE_MAP.get(elementType)!;
          
          if(isEnableInSwitch){
            //元素付与
            if(buff.overrideElement != undefined && overrideElement == ""){
              overrideElement = buff.overrideElement;
            }
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
            let indexMultiValue = 1;
            if(buff?.indexMultiValue != undefined){
              indexMultiValue = buff.indexMultiValue;
            }
            indexValue *= indexMultiValue;
            let indexAddValue = 0;
            if(buff?.indexAddValue != undefined){
              indexAddValue = buff.indexAddValue;
            }
            indexValue += indexAddValue;
            let calRelation = buff?.calRelation ?? '+';
            switch(calRelation){
              case "-":
                indexValue = -1 * indexValue;
                break;
            }
            let constCalRelation = buff?.constCalRelation ?? '+';
      
            let base = buff?.base;
            //ベース２
            let base2 = buff.base2;
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
            let finallyCal = buff?.finallyCal ?? false;
      
            let targets = buff?.target;
            //自身元素タイプチェック
            if(checkSelfElementType){
              targets = targets.filter((v: string)=>{
                return v.includes(selfElementType);
              })
            }
      
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
            }else if(buff?.maxValValue != undefined){
              maxValConstIndexValue = buff.maxValValue;
            }
      
            if(base){
              //特殊バフ
              let temp: SpecialBuff = {};
              temp.base = base;
              temp.base2 = base2;
              temp.baseModifyValue = baseModifyValue;
              temp.multiValue = indexValue;
              temp.priority = priority;
              temp.finallyCal = finallyCal;
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
                if(!isOnlyForOther){
                  specialResult.push({...temp, target: tar, tag: buff.buffTag});
                }
                
                if(isAllTeam || isOnlyForOther){
                  if(!buff.calByOrigin){
                    specialTeamSlefResult.push({
                      ...temp,
                      path,
                      index: buff.index,
                      tag: buff.buffTag,
                      target: tar,
                      isSpecial: true,
                      canSecondaryTrans: buff.canSecondaryTrans,
                      canOverlying: buff.canOverlying,
                      calByOrigin: buff.calByOrigin,
                    })
                  }else{
                    selfTeamBuffs.push({
                      ...temp,
                      index: buff.index,
                      tag: buff.buffTag,
                      target: tar,
                      isSpecial: true,
                      canSecondaryTrans: buff.canSecondaryTrans,
                      canOverlying: buff.canOverlying,
                      calByOrigin: buff.calByOrigin,
                    })
                  }
                }
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
                if(!isOnlyForOther){
                  if(!result[tar]){
                    result[tar] = 0;
                  }
                  if(this.checkAndSetBuffTagForSelf(buff.buffTag, tar, buffTag)){
                    result[tar] += value;
                  }
                }
                
                if(isAllTeam || isOnlyForOther){
                  selfTeamBuffs.push({
                    index: buff.index,
                    tag: buff.buffTag,
                    target: tar,
                    val: value,
                    canSecondaryTrans: buff.canSecondaryTrans,
                    canOverlying: buff.canOverlying,
                    calByOrigin: buff.calByOrigin,
                  })
                }
              }
            }
          }else if(isEnableInSlider){
            let id = 0;
            let indexValue = 0;
            let isMaximumStackBuff = buff?.isMaximumStackBuff || false;
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
            let indexMultiValue = 1;
            if(buff?.indexMultiValue != undefined){
              indexMultiValue = buff.indexMultiValue;
            }
            indexValue *= indexMultiValue;
            let indexAddValue = 0;
            if(buff?.indexAddValue != undefined){
              indexAddValue = buff.indexAddValue;
            }
            indexValue += indexAddValue;
            let calRelation = buff?.calRelation ?? '+';
            switch(calRelation){
              case "-":
                indexValue = -1 * indexValue;
                break;
            }
            let constCalRelation = buff?.constCalRelation ?? '+';
      
            let base = buff?.base;
            //ベース２
            let base2 = buff.base2;
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
            let finallyCal = buff?.finallyCal ?? false;
      
            let targets = buff?.target;
            //自身元素タイプチェック
            if(checkSelfElementType){
              targets = targets.filter((v: string)=>{
                return v.includes(selfElementType);
              })
            }
  
            let sliderMax = buff?.sliderMax;
            let sliderStep = buff?.sliderStep;
            let sliderStartIndex = buff?.sliderStartIndex;
            
            if(base){
              //特殊バフ
              let temp: SpecialBuff = {};
              temp.base = base;
              temp.base2 = base2;
              temp.baseModifyValue = baseModifyValue;
              if(isMaximumStackBuff){
                temp.multiValue = 0;
                if((sliderMax || 0) <= sliderNumMap[buffIndex]){
                  temp.multiValue = indexValue;
                }
              }else{
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
              }
              temp.priority = priority;
              temp.finallyCal = finallyCal;
  
              for(let tar of targets){
                if(!isOnlyForOther){
                  specialResult.push({...temp, target: tar, tag: buff.buffTag});
                }
                if(isAllTeam || isOnlyForOther){
                  if(isMaximumStackBuff){
                    if((buff?.sliderMax || 0) <= sliderNumMap[buffIndex]){
                      if(!buff.calByOrigin){
                        specialTeamSlefResult.push({
                          ...temp,
                          path,
                          index: buff.index,
                          tag: buff.buffTag,
                          target: tar,
                          multiValue: indexValue,
                          isSpecial: true,
                          canSecondaryTrans: buff.canSecondaryTrans,
                          canOverlying: buff.canOverlying,
                          calByOrigin: buff.calByOrigin,
                        })
                      }else{
                        selfTeamBuffs.push({
                          ...temp,
                          index: buff.index,
                          tag: buff.buffTag,
                          target: tar,
                          multiValue: indexValue,
                          isSpecial: true,
                          canSecondaryTrans: buff.canSecondaryTrans,
                          canOverlying: buff.canOverlying,
                          calByOrigin: buff.calByOrigin,
                        })
                      }
                    }
                  }else{
                    //
                    if(sliderStartIndex != undefined){
                      let tempValue = 0;
                      if(sliderNumMap[buffIndex] != 0){
                        if(skillData.paramMap){
                          tempValue = skillData.paramMap[skillLevel][sliderStartIndex + sliderNumMap[buffIndex] - 1];
                        }else if(skillData.paramList){
                          tempValue = skillData.paramList[sliderStartIndex + sliderNumMap[buffIndex] - 1];
                        }
                      }
                      if(!buff.calByOrigin){
                        specialTeamSlefResult.push({
                          ...temp,
                          path,
                          index: buff.index,
                          tag: buff.buffTag,
                          target: tar,
                          multiValue: tempValue,
                          isSpecial: true,
                          canSecondaryTrans: buff.canSecondaryTrans,
                          canOverlying: buff.canOverlying,
                          calByOrigin: buff.calByOrigin,
                        })
                      }else{
                        selfTeamBuffs.push({
                          ...temp,
                          index: buff.index,
                          tag: buff.buffTag,
                          target: tar,
                          multiValue: tempValue,
                          isSpecial: true,
                          canSecondaryTrans: buff.canSecondaryTrans,
                          canOverlying: buff.canOverlying,
                          calByOrigin: buff.calByOrigin,
                        })
                      }
                    }else{
                      if(!buff.calByOrigin){
                        specialTeamSlefResult.push({
                          ...temp,
                          path,
                          index: buff.index,
                          tag: buff.buffTag,
                          target: tar,
                          multiValue: indexValue * sliderNumMap[buffIndex],
                          isSpecial: true,
                          canSecondaryTrans: buff.canSecondaryTrans,
                          canOverlying: buff.canOverlying,
                          calByOrigin: buff.calByOrigin,
                        })
                      }else{
                        selfTeamBuffs.push({
                          ...temp,
                          index: buff.index,
                          tag: buff.buffTag,
                          target: tar,
                          multiValue: indexValue * sliderNumMap[buffIndex],
                          isSpecial: true,
                          canSecondaryTrans: buff.canSecondaryTrans,
                          canOverlying: buff.canOverlying,
                          calByOrigin: buff.calByOrigin,
                        })
                      }
                    }
                    //
                    // if(sliderStartIndex != undefined){
                    //   let specialVals = [0];
                    //   if(skillData.paramMap){
                    //     specialVals.push(...skillData.paramMap[skillLevel].slice(sliderStartIndex,sliderStartIndex+(buff?.sliderMax??0)+1));
                    //   }else if(skillData.paramList){
                    //     specialVals.push(...skillData.paramList.slice(sliderStartIndex,sliderStartIndex+(buff?.sliderMax??0)+1));
                    //   }
                    //   selfTeamBuffs.push({
                    //     index: buff.index,
                    //     tag: buff.buffTag,
                    //     target: tar,
                    //     isSlider: true,
                    //     isSpecialSlider: true,
                    //     specialSliderVals: specialVals,
                    //     sliderMax: buff.sliderMax,
                    //     sliderMin: buff.sliderMin,
                    //     sliderStep: buff.sliderStep,
                    //     canSecondaryTrans: buff.canSecondaryTrans,
                    //     canOverlying: buff.canOverlying,
                    //     calByOrigin: buff.calByOrigin,
                    //   })
                    // }else{
                    //   selfTeamBuffs.push({
                    //     index: buff.index,
                    //     tag: buff.buffTag,
                    //     target: tar,
                    //     isSlider: true,
                    //     isSpecial: true,
                    //     sliderMax: buff.sliderMax,
                    //     sliderMin: buff.sliderMin,
                    //     sliderStep: buff.sliderStep,
                    //     canSecondaryTrans: buff.canSecondaryTrans,
                    //     canOverlying: buff.canOverlying,
                    //     calByOrigin: buff.calByOrigin,
                    //   })
                    // }
                  }
                }
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
                if(!isOnlyForOther){
                  if(result[tar] == undefined){
                    result[tar] = 0;
                  }
                  let resultValue: number;
                  if(isMaximumStackBuff){
                    resultValue = 0;
                    if((buff?.sliderMax || 0) <= sliderNumMap[buffIndex]){
                      resultValue = value;
                    }
                  }else{
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
                  }
                  if(this.checkAndSetBuffTagForSelf(buff.buffTag, tar, buffTag)){
                    result[tar] += resultValue!;
                  }
                }
                if(isAllTeam || isOnlyForOther){
                  if(isMaximumStackBuff){
                    selfTeamBuffs.push({
                      index: buff.index,
                      tag: buff.buffTag,
                      target: tar,
                      val: value,
                      canSecondaryTrans: buff.canSecondaryTrans,
                      canOverlying: buff.canOverlying,
                      calByOrigin: buff.calByOrigin,
                    })
                  }else{
                    if(sliderStartIndex != undefined){
                      let tempValue = 0;
                      if(sliderNumMap[buffIndex] != 0){
                        if(skillData.paramMap){
                          tempValue = skillData.paramMap[skillLevel][sliderStartIndex + sliderNumMap[buffIndex] - 1];
                        }else if(skillData.paramList){
                          tempValue = skillData.paramList[sliderStartIndex + sliderNumMap[buffIndex] - 1];
                        }
                      }
                      selfTeamBuffs.push({
                        index: buff.index,
                        tag: buff.buffTag,
                        target: tar,
                        val: tempValue,
                        canSecondaryTrans: buff.canSecondaryTrans,
                        canOverlying: buff.canOverlying,
                        calByOrigin: buff.calByOrigin,
                      })
                    }else{
                      selfTeamBuffs.push({
                        index: buff.index,
                        tag: buff.buffTag,
                        target: tar,
                        val: value * sliderNumMap[buffIndex],
                        canSecondaryTrans: buff.canSecondaryTrans,
                        canOverlying: buff.canOverlying,
                        calByOrigin: buff.calByOrigin,
                      })
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    //結果セット
    setBuffResult.overrideElement = overrideElement;

    return setBuffResult;
  }

  private checkAndSetBuffTagForSelf(tag: string|undefined, target: string, buffTag: Record<string, string[]>){
    if(tag){
      if(buffTag.hasOwnProperty(tag) && buffTag[tag].includes(target)){
        return false;
      }
    }
    return true;
  }

  private checkAndSetBuffTag(tag: string|undefined, target: string, buffTag: Record<string, string[]>){
    if(tag){
      if(buffTag.hasOwnProperty(tag) && buffTag[tag].includes(target)){
        return false;
      }
      if(!buffTag[tag]){
        buffTag[tag] = [];
      }
      buffTag[tag].push(target);  
    }
    return true;
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
