import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {
  CharacterService,
  Const,
  character,
  weapon,
  CharStatus,
  EnemyService,
  enemy,
  EnemyStatus,
  ExtraDataService,
  WeaponService,
  WeaponStatus,
  ExtraCharacterData,
  ExtraSkillBuff,
  ExtraStatus,
  CharSkill,
  ExtraSkillInfo,
  WeaponSkillAffix,
  ExtraCharacterSkills,
  CharSkills,
  artifactStatus,
  ArtifactService,
  ExtraArtifact,
  ExtraArtifactSetData,
  ArtifactSetAddProp,
  OtherService,
  OtherStorageInfo,
  WeaponType,
  ElementType,
  TeamService,
  CalcUnit,
  CalcItem,
  TYPE_RELATION,
  TYPE_SKILL,
  TYPE_ORIGIN,
  TYPE_SPECIAL_DAMAGE_TYPE,
} from 'src/app/shared/shared.module';
import {environment} from 'src/environments/environment';

const name_normal = Const.NAME_SKILLS_NORMAL;
const name_skill = Const.NAME_SKILLS_SKILL;
const name_other = Const.NAME_SKILLS_OTHER;
const name_elementalBurst = Const.NAME_SKILLS_ELEMENTAL_BURST;
const name_proudSkills = Const.NAME_SKILLS_PROUD;
const name_constellation = Const.NAME_CONSTELLATION;
const name_effect = Const.NAME_EFFECT;
const name_set = Const.NAME_SET;

export interface CalResult {
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
  finalResCalQueue?: CalcItem[];
  overrideElement?: string;
  overrideWhenEffective?: boolean;
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
  buffTag?: string;
  finalResCalQueue?: CalcItem[];
  overrideElement?: string;
  overrideWhenEffective?: boolean;

  teamElementTypeLimit?: string[];
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
  isAbsoluteDmg?: boolean; //絶対ダメージ
  specialDamageType?: TYPE_SPECIAL_DAMAGE_TYPE; //特殊ダメージ
  finalResCalQueue?: CalcItem[];
  displayCalQueue?: CalcItem[]; //表示制御
  originIndex?: number;
}

export interface DamageResult {
  calcProcessKeyMap: Record<string, string[]>;
  calcProcessValMap: Record<string, [number, string] | undefined>;

  elementBonusType: string;
  finalCritRate: number;
  displayCritRate: number;
  tempAllDate: any;
  isAbsoluteDmg?: boolean;
  specialDamageType?: TYPE_SPECIAL_DAMAGE_TYPE;
  forceDisplay?: boolean;
  originIndex?: number;

  originDmg?: number;
  critDmg?: number;
  expectDmg?: number;

  originVaporizeDmg?: number; //蒸発 1.5
  cirtVaporizeDmg?: number; //蒸発 1.5
  expectVaporizeDmg?: number; //蒸発 1.5

  originMeltDmg?: number; //溶解 2.0
  cirtMeltDmg?: number; //溶解 2.0
  expectMeltDmg?: number; //溶解 2.0

  originAggravateDmg?: number; //激化 雷
  cirtAggravateDmg?: number; //激化 雷
  expectAggravateDmg?: number; //激化 雷

  originSpreadDmg?: number; //激化 草
  cirtSpreadDmg?: number; //激化 草
  expectSpreadDmg?: number; //激化 草

  overloadedDmg?: number; //過負荷
  burningDmg?: number; //燃焼
  electroChargedDmg?: number; //感電

  superconductDmg?: number; //超電導
  shieldHp?: number; //結晶
  shieldSpecialHp?: number; //結晶特定吸収量
  destructionDmg?: number; //氷砕き

  ruptureDmg?: number; //開花 草 水
  burgeonDmg?: number; //列開花 草 水 炎
  hyperbloomDmg?: number; //超開花 草 水 雷

  swirlCryoDmg?: number; //拡散 氷
  swirlElectroDmg?: number; //拡散 雷
  swirlElectroAggravateDmg?: number; //拡散 雷 激化
  swirlPyroDmg?: number; //拡散 火
  swirlHydroDmg?: number; //拡散 水

  originMoonElectroChargedDirectlyDmg?: number; //月感電（直接）
  cirtMoonElectroChargedDirectlyDmg?: number; //月感電（直接）
  expectMoonElectroChargedDirectlyDmg?: number; //月感電（直接）
  originMoonElectroChargedReactionalDmg?: number; //月感電（反応）
  cirtMoonElectroChargedReactionalDmg?: number; //月感電（反応）
  expectMoonElectroChargedReactionalDmg?: number; //月感電（反応）
  originMoonRuptureDirectlyDmg?: number; //月開花（直接）
  cirtMoonRuptureDirectlyDmg?: number; //月開花（直接）
  expectMoonRuptureDirectlyDmg?: number; //月開花（直接）
}

export interface HealingParam {
  rate?: number; //倍率
  base?: string; //数値ベース
  rateAttach?: number[][]; //倍率
  baseAttach?: string[]; //数値ベース
  extra?: number; //追加値
  healingBonusType?: string; //治療タイプ
  finalResCalQueue?: CalcItem[];
  originIndex?: number;
}

export interface HealingResult {
  calcProcessKeyMap: Record<string, string[]>;
  calcProcessValMap: Record<string, [number, string] | undefined>;
  originIndex?: number;

  tempAllDate: any;

  healing: number;
}

export interface ShieldParam {
  rate?: number; //倍率
  base?: string; //数値ベース
  rateAttach?: number[][]; //倍率
  baseAttach?: string[]; //数値ベース
  extra?: number; //追加値
  shieldBonusType?: string; //シールドタイプ
  shieldElementType?: string; //シールド元素タイプ
  finalResCalQueue?: CalcItem[];
  originIndex?: number;
}

export interface ShieldResult {
  calcProcessKeyMap: Record<string, string[]>;
  calcProcessValMap: Record<string, [number, string] | undefined>;
  originIndex?: number;

  tempAllDate: any;

  shield?: number;
  shieldCryo?: number;
  shieldAnemo?: number;
  shieldPhysical?: number;
  shieldElectro?: number;
  shieldGeo?: number;
  shieldPyro?: number;
  shieldHydro?: number;
  shieldDendro?: number;
  shieldElementType?: string; //シールド元素タイプ
}

export interface ProductParam {
  rate?: number; //倍率
  base?: string; //数値ベース
  rateAttach?: number[][]; //倍率
  baseAttach?: string[]; //数値ベース
  extra?: number; //追加値
  finalResCalQueue?: CalcItem[];
  originIndex?: number;
}

export interface ProductResult {
  calcProcessKeyMap: Record<string, string[]>;
  calcProcessValMap: Record<string, [number, string] | undefined>;
  originIndex?: number;

  tempAllDate: any;

  product: number;
}

export interface BuffResult {
  showIndex?: number;
  showPriority?: number;
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
  sliderIsPercent?: boolean;
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
  normalLevel?: string;
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

// https://genshin-impact.fandom.com/wiki/Elemental_Reaction/Level_Scaling#Level_Multiplier
const BASE_LEVEL_MULTIPLIER = [
  17.165605, 18.535048, 19.904854, 21.274903, 22.6454, 24.649613, 26.640643, 28.868587, 31.367679,
  34.143343, 37.201, 40.66, 44.446668, 48.563519, 53.74848, 59.081897, 64.420047, 69.724455,
  75.123137, 80.584775, 86.112028, 91.703742, 97.244628, 102.812644, 108.409563, 113.201694,
  118.102906, 122.979318, 129.72733, 136.29291, 142.67085, 149.029029, 155.416987, 161.825495,
  169.106313, 176.518077, 184.072741, 191.709518, 199.556908, 207.382042, 215.3989, 224.165667,
  233.50216, 243.350573, 256.063067, 268.543493, 281.526075, 295.013648, 309.067188, 323.601597,
  336.757542, 350.530312, 364.482705, 378.619181, 398.600417, 416.398254, 434.386996, 452.951051,
  472.606217, 492.88489, 513.568543, 539.103198, 565.510563, 592.538753, 624.443427, 651.470148,
  679.49683, 707.79406, 736.671422, 765.640231, 794.773403, 824.677397, 851.157781, 877.74209,
  914.229123, 946.746752, 979.411386, 1011.223022, 1044.791746, 1077.443668, 1109.99754,
  1142.976615, 1176.369483, 1210.184393, 1253.835659, 1288.952801, 1325.484092, 1363.456928,
  1405.097377, 1446.853458, 1488.215547, 1528.444567, 1580.367911, 1630.847528, 1711.197785,
  1780.453941, 1847.322809, 1911.474309, 1972.864342, 2030.071808,
];
const BASE_BURNING = Array.from(BASE_LEVEL_MULTIPLIER, (x) => x * 0.25);
const BASE_SUPERCONDUCT = Array.from(BASE_LEVEL_MULTIPLIER, (x) => x * 1.5);
const BASE_SWIRL = Array.from(BASE_LEVEL_MULTIPLIER, (x) => x * 0.6);
const BASE_ELECTROCHARGED = Array.from(BASE_LEVEL_MULTIPLIER, (x) => x * 2);
const BASE_DESTRUCTION = Array.from(BASE_LEVEL_MULTIPLIER, (x) => x * 3);
const BASE_OVERLOADED = Array.from(BASE_LEVEL_MULTIPLIER, (x) => x * 2.75);
const BASE_RUPTURE = Array.from(BASE_LEVEL_MULTIPLIER, (x) => x * 2);
const BASE_BURGEON = Array.from(BASE_LEVEL_MULTIPLIER, (x) => x * 3);
const BASE_HYPERBLOOM = Array.from(BASE_LEVEL_MULTIPLIER, (x) => x * 3);
const BASE_MOON_ELECTROCHARGED_REACTION = Array.from(BASE_LEVEL_MULTIPLIER, (x) => x * 1.8);
const BASE_SHIELD = [
  91.1791, 98.707667, 106.23622, 113.764771, 121.293322, 128.821878, 136.350422, 143.878978,
  151.407522, 158.936078, 169.991484, 181.076253, 192.190362, 204.048207, 215.938996, 227.86275,
  247.685944, 267.542105, 287.431209, 303.826417, 320.225217, 336.627633, 352.319267, 368.010913,
  383.702548, 394.432358, 405.18147, 415.949907, 426.737645, 437.544709, 450.600004, 463.700301,
  476.845577, 491.127512, 502.554564, 514.012104, 531.409589, 549.979601, 568.58488, 584.99652,
  605.670375, 626.386206, 646.052333, 665.755638, 685.496096, 700.839402, 723.333147, 745.865265,
  768.435731, 786.791945, 809.538812, 832.329057, 855.162654, 878.039628, 899.484802, 919.362018,
  946.039586, 974.764223, 1003.578617, 1030.077002, 1056.634974, 1085.246306, 1113.924427,
  1149.25872, 1178.064819, 1200.223743, 1227.660294, 1257.242987, 1284.917392, 1314.75288,
  1342.665216, 1372.752485, 1396.320986, 1427.312436, 1458.374528, 1482.335772, 1511.910837,
  1541.549377, 1569.153701, 1596.814298, 1622.419626, 1648.074031, 1666.376146, 1684.678276,
  1702.980391, 1726.104684, 1754.671567, 1785.86656, 1817.137404, 1851.060358, 1885.067163,
  1921.749303, 1958.523291, 2006.194108, 2041.569007, 2054.472064, 2065.97498, 2174.7226, 2186.7682,
  2198.81396,
];

@Injectable({
  providedIn: 'root',
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
  ) {}

  //更新フラグ設定
  setDirtyFlag(index: string | number) {
    this.setDirty(index, true);
  }

  //更新フラグ取得
  isDirty(index: string | number) {
    let indexStr = index.toString();
    return this.dataMap[indexStr]?.isDirty ?? false;
  }

  //変更検知
  changed() {
    return this.hasChanged$;
  }

  //計算後データ変更検知
  allDataChanged() {
    return this.allDatahasChanged$;
  }

  //初期化（チームバフ）
  initTeamBuffData(indexStr: string, withSelfTeamBuff: boolean = true) {
    if (withSelfTeamBuff) {
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
    if (environment.outputLog) {
      //DEBUG
      console.log('初期化（キャラ）');
    }
    let indexStr = index.toString();
    if (!(indexStr in this.dataMap)) {
      this.dataMap[indexStr] = {};
      this.initTeamBuffData(indexStr);
    }
    this.dataMap[indexStr].characterData = this.characterService.get(indexStr);
    this.initExtraCharacterData(indexStr);
  }

  //初期化（キャラ追加）
  initExtraCharacterData(index: string | number, data?: CharLevelConfig) {
    if (environment.outputLog) {
      //DEBUG
      console.log('初期化（キャラ追加）');
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
    if (environment.outputLog) {
      //DEBUG
      console.log('初期化（武器）');
    }
    let indexStr = index.toString();
    let weaponIndexStr = weaponIndex.toString();
    if (!(indexStr in this.dataMap)) {
      this.dataMap[indexStr] = {};
      this.initTeamBuffData(indexStr);
    }
    this.dataMap[indexStr].weaponData = this.weaponService.get(weaponIndexStr);
    this.initExtraWeaponData(indexStr);
  }

  //初期化（武器追加）
  initExtraWeaponData(index: string | number, data?: WeaponLevelConfig) {
    if (environment.outputLog) {
      //DEBUG
      console.log('初期化（武器追加）');
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
    if (environment.outputLog) {
      //DEBUG
      console.log('初期化（聖遺物セット追加）');
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
    if (environment.outputLog) {
      //DEBUG
      console.log('初期化（チームバフ追加）');
    }
    let indexStr = index.toString();
    this.setExtraTeamData(indexStr);
    this.setDirty(indexStr, true);
  }

  //初期化（敵）
  initEnemyData(index: string | number, enemyIndex: string | number) {
    if (environment.outputLog) {
      //DEBUG
      console.log('初期化（敵）');
    }
    let indexStr = index.toString();
    let enemyIndexStr = enemyIndex.toString();
    if (!(indexStr in this.dataMap)) {
      this.dataMap[indexStr] = {};
    }
    this.dataMap[indexStr].enemyData = this.enemyService.get(enemyIndexStr);
    this.setDirty(indexStr, true);
  }

  //初期化（計算用情報合計）
  initAllData(index: string | number) {
    let indexStr = index.toString();
    this.dataMap[indexStr].allData = this.getAllData(indexStr);
    this.setDirty(indexStr, false);
    this.allDatahasChanged.next(true);
  }

  //計算後データ取得
  getAllDataCache(index: string | number) {
    let indexStr = index.toString();
    return this.dataMap[indexStr].allData;
  }

  //チームバフ取得
  getSelfTeamBuff(index: string | number) {
    let indexStr = index.toString();
    return this.dataMap[indexStr].selfTeamBuff;
  }

  //初期化（計算用情報合計）（チーム用）
  initAllDataBackground(index: string | number) {
    let indexStr = index.toString();
    if (this.dataMap.hasOwnProperty(indexStr)) {
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

      this.dataMap[indexStr].allData = this.getAllData(indexStr, undefined, undefined, false);
    } else {
      //初期化
      if (!this.characterService.getStorageInfo(indexStr)) {
        //キャラデータ存在しない
        return;
      }
      if (!(indexStr in this.dataMap)) {
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

      this.dataMap[indexStr].allData = this.getAllData(indexStr, undefined, undefined, false);
    }
  }

  //ダメージ取得
  getDamage(
    index: string | number,
    param: DamageParam,
    extraData?: Record<string, number>,
    toAddWeaponSmelting?: number,
    reuseDatas?: Record<string, number>,
  ) {
    let indexStr = index.toString();
    if (this.isDirty(indexStr) && extraData == undefined) {
      this.initAllData(indexStr);
    }
    let result: DamageResult;
    let data = this.dataMap[indexStr].allData!;
    let tempAllDate = undefined;
    if (extraData != undefined) {
      if (reuseDatas != undefined) {
        data = reuseDatas;
      } else {
        data = this.getAllData(indexStr, extraData, toAddWeaponSmelting);
        tempAllDate = data;
      }
    }
    let rate = param.rate;
    let base = param.base;
    let rateAttach = param.rateAttach ?? [];
    let baseAttach = param.baseAttach ?? [];
    let attackBonusType = param.attackBonusType;
    let elementBonusType = param.elementBonusType;
    let hasTag = param.tag != undefined;
    let tag = Const.CONCATENATION_TAG + param.tag;
    const isAbsoluteDmg = param.isAbsoluteDmg;
    const specialDamageType = param.specialDamageType;
    const isDefaultDamageType = specialDamageType === undefined || specialDamageType === '';
    const isDirectlyMoonElectrocharged = specialDamageType === 'moon-electro-charged-direction';
    const isReactionalMoonElectrocharged = specialDamageType === 'moon-electro-charged-reaction';
    const isDirectlyMoonRupture = specialDamageType === 'moon-rupture-direction';

    //表示制御
    let forceDisplay = undefined;
    let originIndex = param.originIndex;
    if (param.displayCalQueue !== undefined) {
      const displayVal = this.getFinalResCalQueueResult(data, 0, param.displayCalQueue);
      if (displayVal < 1) {
        forceDisplay = false;
      } else {
        forceDisplay = true;
      }
    }

    //計算
    //--------------------
    //1.ダメージ値区域
    //--------------------
    let finalRate = rate;
    let dmgSectionValue = 0;
    const dmgSectionValueProcessFunc = this.createProcess(dmgSectionValue);
    //倍率
    finalRate += data[Const.PROP_DMG_RATE_UP_ALL];
    rateAttach = rateAttach.map((x) => x.map((x) => x + data[Const.PROP_DMG_RATE_UP_ALL]));
    dmgSectionValue += data[Const.PROP_DMG_VAL_UP_ALL];
    dmgSectionValueProcessFunc(dmgSectionValue, data[Const.PROP_DMG_VAL_UP_ALL], '+');
    //--------------------
    //2.会心区域
    //--------------------
    let critSectionValue = 0;
    let finalCritRate = data[Const.PROP_CRIT_RATE];
    let displayCritRate = data[Const.PROP_CRIT_RATE];
    let finalCritDmg = data[Const.PROP_CRIT_DMG];
    const critRateSectionValueProcessFunc = this.createProcess(finalCritRate);
    const critDmgSectionValueProcessFunc = this.createProcess(finalCritDmg);
    finalCritRate += data[Const.PROP_DMG_CRIT_RATE_UP_ALL];
    displayCritRate += data[Const.PROP_DMG_CRIT_RATE_UP_ALL];
    finalCritDmg += data[Const.PROP_DMG_CRIT_DMG_UP_ALL];
    critRateSectionValueProcessFunc(finalCritRate, data[Const.PROP_DMG_CRIT_RATE_UP_ALL], '+');
    critDmgSectionValueProcessFunc(finalCritDmg, data[Const.PROP_DMG_CRIT_DMG_UP_ALL], '+');
    //--------------------
    //3.ダメージアップ区域
    //--------------------
    let dmgUpSectionValue = 0;
    const dmgUpSectionValueProcessFunc = this.createProcess(dmgUpSectionValue);
    dmgUpSectionValue += data[Const.PROP_DMG_BONUS_ALL];
    dmgUpSectionValueProcessFunc(dmgUpSectionValue, data[Const.PROP_DMG_BONUS_ALL], '+');
    //--------------------
    //4.耐性区域
    //--------------------
    let dmgAntiSectionValue = 0;
    let dmgAntiSectionMinusOnlyValue = 0;
    const dmgAntiSectionValueProcessFunc = this.createProcess(dmgAntiSectionValue);
    const dmgAntiSectionMinusOnlyValueProcessFunc = this.createProcess(
      dmgAntiSectionMinusOnlyValue,
    );
    dmgAntiSectionValue -= data[Const.PROP_DMG_ANTI_ALL_MINUS];
    dmgAntiSectionMinusOnlyValue -= data[Const.PROP_DMG_ANTI_ALL_MINUS];
    dmgAntiSectionValueProcessFunc(dmgAntiSectionValue, data[Const.PROP_DMG_ANTI_ALL_MINUS], '-');
    dmgAntiSectionMinusOnlyValueProcessFunc(
      dmgAntiSectionMinusOnlyValue,
      data[Const.PROP_DMG_ANTI_ALL_MINUS],
      '-',
    );
    //--------------------
    //5.防御区域
    //--------------------
    let defenceSectionValue = 0;
    const defenceSectionValueProcessFunc = this.createProcess(defenceSectionValue);
    let tempIgnoreValue = data[Const.PROP_DMG_ENEMY_DEFENSE_IGNORE] ?? 0;
    let tempDefenseValue = data[Const.PROP_DMG_ENEMY_DEFENSE];
    defenceSectionValueProcessFunc(tempDefenseValue, data[Const.PROP_DMG_ENEMY_DEFENSE], '+');
    let tempDefenseAttackBonusDefenseBaseProp = Const.PROP_DMG_ENEMY_DEFENSE_BASE;
    let tempDefenseAttackBonusDefenseDownTypeProp = '';
    let tempDefenseAttackBonusDefenseIgnoreTypeProp = '';
    switch (attackBonusType) {
      case Const.PROP_DMG_BONUS_NORMAL:
        tempDefenseAttackBonusDefenseDownTypeProp = Const.PROP_DMG_ENEMY_DEFENSE_DOWN_NORMAL;
        tempDefenseAttackBonusDefenseIgnoreTypeProp = Const.PROP_DMG_ENEMY_DEFENSE_IGNORE_NORMAL;
        break;
      case Const.PROP_DMG_BONUS_CHARGED:
        tempDefenseAttackBonusDefenseDownTypeProp = Const.PROP_DMG_ENEMY_DEFENSE_DOWN_CHARGED;
        tempDefenseAttackBonusDefenseIgnoreTypeProp = Const.PROP_DMG_ENEMY_DEFENSE_IGNORE_CHARGED;
        break;
      case Const.PROP_DMG_BONUS_PLUNGING:
        tempDefenseAttackBonusDefenseDownTypeProp = Const.PROP_DMG_ENEMY_DEFENSE_DOWN_PLUNGING;
        tempDefenseAttackBonusDefenseIgnoreTypeProp = Const.PROP_DMG_ENEMY_DEFENSE_IGNORE_PLUNGING;
        break;
      case Const.PROP_DMG_BONUS_SKILL:
        tempDefenseAttackBonusDefenseDownTypeProp = Const.PROP_DMG_ENEMY_DEFENSE_DOWN_SKILL;
        tempDefenseAttackBonusDefenseIgnoreTypeProp = Const.PROP_DMG_ENEMY_DEFENSE_IGNORE_SKILL;
        break;
      case Const.PROP_DMG_BONUS_ELEMENTAL_BURST:
        tempDefenseAttackBonusDefenseDownTypeProp =
          Const.PROP_DMG_ENEMY_DEFENSE_DOWN_ELEMENTAL_BURST;
        tempDefenseAttackBonusDefenseIgnoreTypeProp =
          Const.PROP_DMG_ENEMY_DEFENSE_IGNORE_ELEMENTAL_BURST;
        break;
    }
    {
      if (
        tempDefenseAttackBonusDefenseDownTypeProp != '' &&
        tempDefenseAttackBonusDefenseIgnoreTypeProp != ''
      ) {
        tempDefenseValue -=
          data[tempDefenseAttackBonusDefenseBaseProp] *
          data[tempDefenseAttackBonusDefenseDownTypeProp];
        defenceSectionValueProcessFunc(
          tempDefenseValue,
          `${this.proximateVal(data[tempDefenseAttackBonusDefenseBaseProp])} ${this.times} ${this.proximateVal(data[tempDefenseAttackBonusDefenseDownTypeProp])}`,
          '-',
        );
        tempIgnoreValue += data[tempDefenseAttackBonusDefenseIgnoreTypeProp] ?? 0;
        //特別処理
        if (hasTag) {
          tempIgnoreValue += data[tempDefenseAttackBonusDefenseIgnoreTypeProp + tag] ?? 0;
        }
      }
      tempDefenseValue *= 1 - tempIgnoreValue;
      defenceSectionValueProcessFunc(
        tempDefenseValue,
        `(1 ${this.minus} ${this.proximateVal(tempIgnoreValue)})`,
        '*',
      );
      defenceSectionValue =
        tempDefenseValue / (tempDefenseValue + data[Const.PROP_LEVEL] * 5 + 500);
      defenceSectionValueProcessFunc(
        defenceSectionValue,
        `(${this.proximateVal(tempDefenseValue)} + ${this.proximateVal(data[Const.PROP_LEVEL])} ${this.times} 5 + 500)`,
        '/',
      );
    }
    //--------------------
    //6.元素反応区域
    //--------------------
    let elementSectionValue = 0;
    let elementAmplitudeRate = 2.78 / (1 + 1400 / data[Const.PROP_ELEMENTAL_MASTERY]);
    let elementCataclysmRate = 16.0 / (1 + 2000 / data[Const.PROP_ELEMENTAL_MASTERY]);
    let elementShieldRate = 4.44 / (1 + 1400 / data[Const.PROP_ELEMENTAL_MASTERY]);
    let elementSpread = 5 / (1 + 1200 / data[Const.PROP_ELEMENTAL_MASTERY]);
    let elementAggravate = elementSpread;
    let elementMoonElectroCharged = 6 / (1 + 2000 / data[Const.PROP_ELEMENTAL_MASTERY]);
    let elementMoonRupture = 6 / (1 + 2000 / data[Const.PROP_ELEMENTAL_MASTERY]);

    //--------------------
    //補足
    //--------------------
    let extraFinalRateMultiTypeProp = '';
    let extraFinalRateUpTypeProp = '';
    let extraDmgSectionValUpTypeProp = '';
    let extraFinalCritRateUpTypeProp = '';
    let extraFinalCritDmgUpTypeProp = '';
    let extraDmgUpSectionBonusTypeProp = '';
    let extraDmgAntiSectionTypeProp = '';
    let extraDmgAntiSectionMinusOnlyTypeProp = '';
    switch (elementBonusType) {
      case Const.PROP_DMG_BONUS_CRYO:
        extraFinalRateMultiTypeProp = Const.PROP_DMG_RATE_MULTI_CRYO;
        extraFinalRateUpTypeProp = Const.PROP_DMG_RATE_UP_CRYO;
        extraDmgSectionValUpTypeProp = Const.PROP_DMG_VAL_UP_CRYO;
        extraFinalCritRateUpTypeProp = Const.PROP_DMG_CRIT_RATE_UP_CRYO;
        extraFinalCritDmgUpTypeProp = Const.PROP_DMG_CRIT_DMG_UP_CRYO;
        extraDmgUpSectionBonusTypeProp = Const.PROP_DMG_BONUS_CRYO;
        extraDmgAntiSectionTypeProp = Const.PROP_DMG_ANTI_CRYO;
        extraDmgAntiSectionMinusOnlyTypeProp = Const.PROP_DMG_ANTI_CRYO_MINUS;
        break;
      case Const.PROP_DMG_BONUS_ANEMO:
        extraFinalRateMultiTypeProp = Const.PROP_DMG_RATE_MULTI_ANEMO;
        extraFinalRateUpTypeProp = Const.PROP_DMG_RATE_UP_ANEMO;
        extraDmgSectionValUpTypeProp = Const.PROP_DMG_VAL_UP_ANEMO;
        extraFinalCritRateUpTypeProp = Const.PROP_DMG_CRIT_RATE_UP_ANEMO;
        extraFinalCritDmgUpTypeProp = Const.PROP_DMG_CRIT_DMG_UP_ANEMO;
        extraDmgUpSectionBonusTypeProp = Const.PROP_DMG_BONUS_ANEMO;
        extraDmgAntiSectionTypeProp = Const.PROP_DMG_ANTI_ANEMO;
        extraDmgAntiSectionMinusOnlyTypeProp = Const.PROP_DMG_ANTI_ANEMO_MINUS;
        break;
      case Const.PROP_DMG_BONUS_PHYSICAL:
        extraFinalRateMultiTypeProp = Const.PROP_DMG_RATE_MULTI_PHYSICAL;
        extraFinalRateUpTypeProp = Const.PROP_DMG_RATE_UP_PHYSICAL;
        extraDmgSectionValUpTypeProp = Const.PROP_DMG_VAL_UP_PHYSICAL;
        extraFinalCritRateUpTypeProp = Const.PROP_DMG_CRIT_RATE_UP_PHYSICAL;
        extraFinalCritDmgUpTypeProp = Const.PROP_DMG_CRIT_DMG_UP_PHYSICAL;
        extraDmgUpSectionBonusTypeProp = Const.PROP_DMG_BONUS_PHYSICAL;
        extraDmgAntiSectionTypeProp = Const.PROP_DMG_ANTI_PHYSICAL;
        extraDmgAntiSectionMinusOnlyTypeProp = Const.PROP_DMG_ANTI_PHYSICAL_MINUS;
        break;
      case Const.PROP_DMG_BONUS_ELECTRO:
        extraFinalRateMultiTypeProp = Const.PROP_DMG_RATE_MULTI_ELECTRO;
        extraFinalRateUpTypeProp = Const.PROP_DMG_RATE_UP_ELECTRO;
        extraDmgSectionValUpTypeProp = Const.PROP_DMG_VAL_UP_ELECTRO;
        extraFinalCritRateUpTypeProp = Const.PROP_DMG_CRIT_RATE_UP_ELECTRO;
        extraFinalCritDmgUpTypeProp = Const.PROP_DMG_CRIT_DMG_UP_ELECTRO;
        extraDmgUpSectionBonusTypeProp = Const.PROP_DMG_BONUS_ELECTRO;
        extraDmgAntiSectionTypeProp = Const.PROP_DMG_ANTI_ELECTRO;
        extraDmgAntiSectionMinusOnlyTypeProp = Const.PROP_DMG_ANTI_ELECTRO_MINUS;
        break;
      case Const.PROP_DMG_BONUS_GEO:
        extraFinalRateMultiTypeProp = Const.PROP_DMG_RATE_MULTI_GEO;
        extraFinalRateUpTypeProp = Const.PROP_DMG_RATE_UP_GEO;
        extraDmgSectionValUpTypeProp = Const.PROP_DMG_VAL_UP_GEO;
        extraFinalCritRateUpTypeProp = Const.PROP_DMG_CRIT_RATE_UP_GEO;
        extraFinalCritDmgUpTypeProp = Const.PROP_DMG_CRIT_DMG_UP_GEO;
        extraDmgUpSectionBonusTypeProp = Const.PROP_DMG_BONUS_GEO;
        extraDmgAntiSectionTypeProp = Const.PROP_DMG_ANTI_GEO;
        extraDmgAntiSectionMinusOnlyTypeProp = Const.PROP_DMG_ANTI_GEO_MINUS;
        break;
      case Const.PROP_DMG_BONUS_PYRO:
        extraFinalRateMultiTypeProp = Const.PROP_DMG_RATE_MULTI_PYRO;
        extraFinalRateUpTypeProp = Const.PROP_DMG_RATE_UP_PYRO;
        extraDmgSectionValUpTypeProp = Const.PROP_DMG_VAL_UP_PYRO;
        extraFinalCritRateUpTypeProp = Const.PROP_DMG_CRIT_RATE_UP_PYRO;
        extraFinalCritDmgUpTypeProp = Const.PROP_DMG_CRIT_DMG_UP_PYRO;
        extraDmgUpSectionBonusTypeProp = Const.PROP_DMG_BONUS_PYRO;
        extraDmgAntiSectionTypeProp = Const.PROP_DMG_ANTI_PYRO;
        extraDmgAntiSectionMinusOnlyTypeProp = Const.PROP_DMG_ANTI_PYRO_MINUS;
        break;
      case Const.PROP_DMG_BONUS_HYDRO:
        extraFinalRateMultiTypeProp = Const.PROP_DMG_RATE_MULTI_HYDRO;
        extraFinalRateUpTypeProp = Const.PROP_DMG_RATE_UP_HYDRO;
        extraDmgSectionValUpTypeProp = Const.PROP_DMG_VAL_UP_HYDRO;
        extraFinalCritRateUpTypeProp = Const.PROP_DMG_CRIT_RATE_UP_HYDRO;
        extraFinalCritDmgUpTypeProp = Const.PROP_DMG_CRIT_DMG_UP_HYDRO;
        extraDmgUpSectionBonusTypeProp = Const.PROP_DMG_BONUS_HYDRO;
        extraDmgAntiSectionTypeProp = Const.PROP_DMG_ANTI_HYDRO;
        extraDmgAntiSectionMinusOnlyTypeProp = Const.PROP_DMG_ANTI_HYDRO_MINUS;
        break;
      case Const.PROP_DMG_BONUS_DENDRO:
        extraFinalRateMultiTypeProp = Const.PROP_DMG_RATE_MULTI_DENDRO;
        extraFinalRateUpTypeProp = Const.PROP_DMG_RATE_UP_DENDRO;
        extraDmgSectionValUpTypeProp = Const.PROP_DMG_VAL_UP_DENDRO;
        extraFinalCritRateUpTypeProp = Const.PROP_DMG_CRIT_RATE_UP_DENDRO;
        extraFinalCritDmgUpTypeProp = Const.PROP_DMG_CRIT_DMG_UP_DENDRO;
        extraDmgUpSectionBonusTypeProp = Const.PROP_DMG_BONUS_DENDRO;
        extraDmgAntiSectionTypeProp = Const.PROP_DMG_ANTI_DENDRO;
        extraDmgAntiSectionMinusOnlyTypeProp = Const.PROP_DMG_ANTI_DENDRO_MINUS;
        break;
    }
    {
      finalRate *= 1 + data[extraFinalRateMultiTypeProp];
      finalRate += data[extraFinalRateUpTypeProp];
      rateAttach = rateAttach.map((x) => x.map((x) => x + data[extraFinalRateUpTypeProp]));
      dmgSectionValue += data[extraDmgSectionValUpTypeProp];
      dmgSectionValueProcessFunc(dmgSectionValue, data[extraDmgSectionValUpTypeProp], '+');
      finalCritRate += data[extraFinalCritRateUpTypeProp];
      critRateSectionValueProcessFunc(finalCritRate, data[extraFinalCritRateUpTypeProp], '+');
      finalCritDmg += data[extraFinalCritDmgUpTypeProp];
      critDmgSectionValueProcessFunc(finalCritDmg, data[extraFinalCritDmgUpTypeProp], '+');
      dmgUpSectionValue += data[extraDmgUpSectionBonusTypeProp];
      dmgUpSectionValueProcessFunc(dmgUpSectionValue, data[extraDmgUpSectionBonusTypeProp], '+');
      dmgAntiSectionValue += data[extraDmgAntiSectionTypeProp];
      dmgAntiSectionValueProcessFunc(
        dmgAntiSectionValue,
        data[extraDmgAntiSectionTypeProp],
        '+',
        'start',
      );
      dmgAntiSectionValue -= data[extraDmgAntiSectionMinusOnlyTypeProp];
      dmgAntiSectionValueProcessFunc(
        dmgAntiSectionValue,
        data[extraDmgAntiSectionMinusOnlyTypeProp],
        '-',
      );
      dmgAntiSectionMinusOnlyValue -= data[extraDmgAntiSectionMinusOnlyTypeProp];
      dmgAntiSectionMinusOnlyValueProcessFunc(
        dmgAntiSectionMinusOnlyValue,
        data[extraDmgAntiSectionMinusOnlyTypeProp],
        '-',
      );
    }
    let extraAttackFinalRateMultiTypeProp = '';
    let extraAttackFinalRateUpTypeProp = '';
    let extraAttackDmgSectionValUpTypeProp = '';
    let extraAttackFinalCritRateUpTypeProp = '';
    let extraAttackFinalCritDmgUpTypeProp = '';
    let extraAttackDmgUpSectionBonusTypeProp = '';
    switch (attackBonusType) {
      case Const.PROP_DMG_BONUS_NORMAL:
        extraAttackFinalRateMultiTypeProp = Const.PROP_DMG_RATE_MULTI_NORMAL;
        extraAttackFinalRateUpTypeProp = Const.PROP_DMG_RATE_UP_NORMAL;
        extraAttackDmgSectionValUpTypeProp = Const.PROP_DMG_VAL_UP_NORMAL;
        extraAttackFinalCritRateUpTypeProp = Const.PROP_DMG_CRIT_RATE_UP_NORMAL;
        extraAttackFinalCritDmgUpTypeProp = Const.PROP_DMG_CRIT_DMG_UP_NORMAL;
        extraAttackDmgUpSectionBonusTypeProp = Const.PROP_DMG_BONUS_NORMAL;
        break;
      case Const.PROP_DMG_BONUS_CHARGED:
        extraAttackFinalRateMultiTypeProp = Const.PROP_DMG_RATE_MULTI_CHARGED;
        extraAttackFinalRateUpTypeProp = Const.PROP_DMG_RATE_UP_CHARGED;
        extraAttackDmgSectionValUpTypeProp = Const.PROP_DMG_VAL_UP_CHARGED;
        extraAttackFinalCritRateUpTypeProp = Const.PROP_DMG_CRIT_RATE_UP_CHARGED;
        extraAttackFinalCritDmgUpTypeProp = Const.PROP_DMG_CRIT_DMG_UP_CHARGED;
        extraAttackDmgUpSectionBonusTypeProp = Const.PROP_DMG_BONUS_CHARGED;
        break;
      case Const.PROP_DMG_BONUS_PLUNGING:
        extraAttackFinalRateMultiTypeProp = Const.PROP_DMG_RATE_MULTI_PLUNGING;
        extraAttackFinalRateUpTypeProp = Const.PROP_DMG_RATE_UP_PLUNGING;
        extraAttackDmgSectionValUpTypeProp = Const.PROP_DMG_VAL_UP_PLUNGING;
        extraAttackFinalCritRateUpTypeProp = Const.PROP_DMG_CRIT_RATE_UP_PLUNGING;
        extraAttackFinalCritDmgUpTypeProp = Const.PROP_DMG_CRIT_DMG_UP_PLUNGING;
        extraAttackDmgUpSectionBonusTypeProp = Const.PROP_DMG_BONUS_PLUNGING;
        break;
      case Const.PROP_DMG_BONUS_SKILL:
        extraAttackFinalRateMultiTypeProp = Const.PROP_DMG_RATE_MULTI_SKILL;
        extraAttackFinalRateUpTypeProp = Const.PROP_DMG_RATE_UP_SKILL;
        extraAttackDmgSectionValUpTypeProp = Const.PROP_DMG_VAL_UP_SKILL;
        extraAttackFinalCritRateUpTypeProp = Const.PROP_DMG_CRIT_RATE_UP_SKILL;
        extraAttackFinalCritDmgUpTypeProp = Const.PROP_DMG_CRIT_DMG_UP_SKILL;
        extraAttackDmgUpSectionBonusTypeProp = Const.PROP_DMG_BONUS_SKILL;
        break;
      case Const.PROP_DMG_BONUS_ELEMENTAL_BURST:
        extraAttackFinalRateMultiTypeProp = Const.PROP_DMG_RATE_MULTI_ELEMENTAL_BURST;
        extraAttackFinalRateUpTypeProp = Const.PROP_DMG_RATE_UP_ELEMENTAL_BURST;
        extraAttackDmgSectionValUpTypeProp = Const.PROP_DMG_VAL_UP_ELEMENTAL_BURST;
        extraAttackFinalCritRateUpTypeProp = Const.PROP_DMG_CRIT_RATE_UP_ELEMENTAL_BURST;
        extraAttackFinalCritDmgUpTypeProp = Const.PROP_DMG_CRIT_DMG_UP_ELEMENTAL_BURST;
        extraAttackDmgUpSectionBonusTypeProp = Const.PROP_DMG_BONUS_ELEMENTAL_BURST;
        break;
      case Const.PROP_DMG_BONUS_WEAPON:
        extraAttackFinalRateMultiTypeProp = Const.PROP_DMG_RATE_MULTI_WEAPON;
        extraAttackFinalRateUpTypeProp = Const.PROP_DMG_RATE_UP_WEAPON;
        extraAttackDmgSectionValUpTypeProp = Const.PROP_DMG_VAL_UP_WEAPON;
        extraAttackFinalCritRateUpTypeProp = Const.PROP_DMG_CRIT_RATE_UP_WEAPON;
        extraAttackFinalCritDmgUpTypeProp = Const.PROP_DMG_CRIT_DMG_UP_WEAPON;
        extraAttackDmgUpSectionBonusTypeProp = Const.PROP_DMG_BONUS_WEAPON;
        break;
      case Const.PROP_DMG_BONUS_OTHER:
        extraAttackFinalRateMultiTypeProp = Const.PROP_DMG_RATE_MULTI_OTHER;
        extraAttackFinalRateUpTypeProp = Const.PROP_DMG_RATE_UP_OTHER;
        extraAttackDmgSectionValUpTypeProp = Const.PROP_DMG_VAL_UP_OTHER;
        extraAttackFinalCritRateUpTypeProp = Const.PROP_DMG_CRIT_RATE_UP_OTHER;
        extraAttackFinalCritDmgUpTypeProp = Const.PROP_DMG_CRIT_DMG_UP_OTHER;
        extraAttackDmgUpSectionBonusTypeProp = Const.PROP_DMG_BONUS_OTHER;
        break;
      case Const.PROP_DMG_BONUS_SET:
        extraAttackFinalRateMultiTypeProp = Const.PROP_DMG_RATE_MULTI_SET;
        extraAttackFinalRateUpTypeProp = Const.PROP_DMG_RATE_UP_SET;
        extraAttackDmgSectionValUpTypeProp = Const.PROP_DMG_VAL_UP_SET;
        extraAttackFinalCritRateUpTypeProp = Const.PROP_DMG_CRIT_RATE_UP_SET;
        extraAttackFinalCritDmgUpTypeProp = Const.PROP_DMG_CRIT_DMG_UP_SET;
        extraAttackDmgUpSectionBonusTypeProp = Const.PROP_DMG_BONUS_SET;
        break;
    }
    {
      finalRate += data[extraAttackFinalRateUpTypeProp];
      rateAttach = rateAttach.map((x) => x.map((x) => x + data[extraAttackFinalRateUpTypeProp]));
      dmgSectionValue += data[extraAttackDmgSectionValUpTypeProp];
      dmgSectionValueProcessFunc(dmgSectionValue, data[extraAttackDmgSectionValUpTypeProp], '+');
      finalCritRate += data[extraAttackFinalCritRateUpTypeProp];
      critRateSectionValueProcessFunc(finalCritRate, data[extraAttackFinalCritRateUpTypeProp], '+');
      finalCritDmg += data[extraAttackFinalCritDmgUpTypeProp];
      critDmgSectionValueProcessFunc(finalCritDmg, data[extraAttackFinalCritDmgUpTypeProp], '+');
      dmgUpSectionValue += data[extraAttackDmgUpSectionBonusTypeProp];
      dmgUpSectionValueProcessFunc(
        dmgUpSectionValue,
        data[extraAttackDmgUpSectionBonusTypeProp],
        '+',
      );
      //特別処理
      if (hasTag) {
        finalRate += data[extraAttackFinalRateUpTypeProp + tag] ?? 0;
        rateAttach = rateAttach.map((x) => x.map((x) => x + data[extraAttackFinalRateUpTypeProp]));
        dmgSectionValue += data[extraAttackDmgSectionValUpTypeProp + tag] ?? 0;
        dmgSectionValueProcessFunc(
          dmgSectionValue,
          data[extraAttackDmgSectionValUpTypeProp + tag] ?? 0,
          '+',
        );
        finalCritRate += data[extraAttackFinalCritRateUpTypeProp + tag] ?? 0;
        critRateSectionValueProcessFunc(
          finalCritRate,
          data[extraAttackFinalCritRateUpTypeProp + tag] ?? 0,
          '+',
        );
        finalCritDmg += data[extraAttackFinalCritDmgUpTypeProp + tag] ?? 0;
        critDmgSectionValueProcessFunc(
          finalCritDmg,
          data[extraAttackFinalCritDmgUpTypeProp + tag] ?? 0,
          '+',
        );
        dmgUpSectionValue += data[extraAttackDmgUpSectionBonusTypeProp + tag] ?? 0;
        dmgUpSectionValueProcessFunc(
          dmgUpSectionValue,
          data[extraAttackDmgUpSectionBonusTypeProp + tag] ?? 0,
          '+',
        );
      }
    }
    //特殊ダメージ
    {
      //月開花（直接）
      if (isDirectlyMoonRupture) {
        //会心区
        finalCritRate += data[Const.PROP_DMG_CRIT_RATE_UP_ELEMENT_MOON_RUPTURE] ?? 0;
        critRateSectionValueProcessFunc(
          finalCritRate,
          data[Const.PROP_DMG_CRIT_RATE_UP_ELEMENT_MOON_RUPTURE] ?? 0,
          '+',
        );
        finalCritDmg += data[Const.PROP_DMG_CRIT_DMG_UP_ELEMENT_MOON_RUPTURE] ?? 0;
        critDmgSectionValueProcessFunc(
          finalCritDmg,
          data[Const.PROP_DMG_CRIT_DMG_UP_ELEMENT_MOON_RUPTURE] ?? 0,
          '+',
        );
      }
    }
    {
      finalRate *= 1 + data[extraAttackFinalRateMultiTypeProp];
      rateAttach = rateAttach.map((x) =>
        x.map((x) => x * (1 + data[extraAttackFinalRateMultiTypeProp])),
      );
      if (hasTag) {
        finalRate *= 1 + (data[extraAttackFinalRateMultiTypeProp + tag] ?? 0);
        rateAttach = rateAttach.map((x) =>
          x.map((x) => x * (1 + (data[extraAttackFinalRateMultiTypeProp + tag] ?? 0))),
        );
      }
    }
    //全ダメージ倍率乗算値
    finalRate *= 1 + data[Const.PROP_DMG_RATE_MULTI_ALL];
    rateAttach = rateAttach.map((x) => x.map((x) => x * (1 + data[Const.PROP_DMG_RATE_MULTI_ALL])));
    //ダメージ値区域残り
    const finalRateProcessFunc = this.createProcess(finalRate);
    const dmg_rate_value = finalRate * (data[base] ?? 0);
    finalRateProcessFunc(dmg_rate_value, data[base] ?? 0, '*', 'start');
    dmgSectionValue += dmg_rate_value;
    dmgSectionValueProcessFunc(dmgSectionValue, finalRateProcessFunc()[1], '+');
    for (let i = 0; i < rateAttach.length; ++i) {
      let tempDmgRateBaseProp = baseAttach[i];
      rateAttach[i].forEach((v) => {
        const tempfinalRateProcessFunc = this.createProcess(v);
        const temp_dmg_rate_value = v * data[tempDmgRateBaseProp];
        tempfinalRateProcessFunc(temp_dmg_rate_value, data[tempDmgRateBaseProp], '*', 'start');
        dmgSectionValue += temp_dmg_rate_value;
        dmgSectionValueProcessFunc(dmgSectionValue, tempfinalRateProcessFunc()[1], '+');
      });
    }
    //耐性区域残り
    if (dmgAntiSectionValue < 0) {
      dmgAntiSectionValue = dmgAntiSectionValue / 2;
      dmgAntiSectionValueProcessFunc(dmgAntiSectionValue, 2, '/');
    }
    if (dmgAntiSectionMinusOnlyValue < 0) {
      dmgAntiSectionMinusOnlyValue = dmgAntiSectionMinusOnlyValue / 2;
      dmgAntiSectionMinusOnlyValueProcessFunc(dmgAntiSectionMinusOnlyValue, 2, '/');
    }
    //会心区域残り
    if (finalCritRate < 0) {
      finalCritRate = 0;
    } else if (finalCritRate > 1) {
      finalCritRate = 1;
    }
    let critExpectRate = 1;
    const critExpectDmgSectionValueProcessFunc = this.createProcess(critExpectRate);
    critExpectRate -= finalCritRate;
    critExpectDmgSectionValueProcessFunc(critExpectRate, finalCritRate, '-');
    critExpectRate += finalCritRate * (1 + finalCritDmg);
    critExpectDmgSectionValueProcessFunc(
      critExpectRate,
      `${this.proximateVal(finalCritRate)} ${this.times} (1 ${this.plus} ${this.proximateVal(finalCritDmg)})`,
      '+',
    );

    //結果まとめ
    let originDmg;
    let critDmg;
    let expectDmg;
    let originVaporizeDmg;
    let cirtVaporizeDmg;
    let expectVaporizeDmg;
    let originMeltDmg;
    let cirtMeltDmg;
    let expectMeltDmg;
    let originAggravateDmg; //激化 雷
    let cirtAggravateDmg; //激化 雷
    let expectAggravateDmg; //激化 雷
    let originSpreadDmg; //激化 草
    let cirtSpreadDmg; //激化 草
    let expectSpreadDmg; //激化 草
    let burningDmg;
    let superconductDmg;
    let ruptureDmg; //開花 草 水
    let burgeonDmg; //列開花 草 水 炎
    let hyperbloomDmg; //超開花 草 水 雷
    let swirlCryoDmg;
    let swirlElectroDmg;
    let swirlElectroAggravateDmg; //拡散 雷 激化
    let swirlPyroDmg;
    let swirlHydroDmg;
    let electroChargedDmg;
    let destructionDmg;
    let overloadedDmg;
    let shieldHp;
    let shieldSpecialHp;
    let originMoonElectroChargedDirectlyDmg; //月感電（直接）
    let cirtMoonElectroChargedDirectlyDmg; //月感電（直接）
    let expectMoonElectroChargedDirectlyDmg; //月感電（直接）
    let originMoonElectroChargedReactionalDmg; //月感電（反応）
    let cirtMoonElectroChargedReactionalDmg; //月感電（反応）
    let expectMoonElectroChargedReactionalDmg; //月感電（反応）
    let originMoonRuptureDirectlyDmg; //月開花（直接）
    let cirtMoonRuptureDirectlyDmg; //月開花（直接）
    let expectMoonRuptureDirectlyDmg; //月開花（直接）

    let cryoAntiProcess;
    let anemoAntiProcess;
    let physicalAntiProcess;
    let electroAntiProcess;
    let geoAntiProcess;
    let pyroAntiProcess;
    let hydroAntiProcess;
    let dendroAntiProcess;

    let vaporProcess;
    let meltProcess;
    let burningBaseProcess;
    let burningRateProcess;
    let superconductBaseProcess;
    let superconductRateProcess;
    let swirlBaseProcess;
    let swirlRateProcess;
    let swirlElectroAggravateBaseProcess;
    let swirlElectroAggravateRateProcess;
    let electroChargedRateProcess;
    let electroChargedBaseProcess;
    let destructionRateProcess;
    let destructionBaseProcess;
    let overloadedRateProcess;
    let overloadedBaseProcess;
    let shieldRateProcess;
    let shieldBaseProcess;
    let aggravateDmgBaseProcess;
    let hyperbloomRateProcess;
    let hyperbloomExtraValSectionProcess;
    let hyperbloomBaseProcess;
    let spreadDmgBaseProcess;
    let burgeonRateProcess;
    let burgeonExtraValSectionProcess;
    let burgeonBaseProcess;
    let ruptureRateProcess;
    let ruptureExtraValSectionProcess;
    let ruptureBaseProcess;
    let shieldSpecialRateProcess;
    // 月感電（直接）
    let moonElectroChargedDirectlyBaseProcess;
    // 月感電（反応）
    let originMoonElectroChargedReactionalProcess1;
    let originMoonElectroChargedReactionalProcess2;
    let originMoonElectroChargedReactionalProcess3;
    let originMoonElectroChargedReactionalProcess4;
    let critMoonElectroChargedReactionalProcess1;
    let critMoonElectroChargedReactionalProcess2;
    let critMoonElectroChargedReactionalProcess3;
    let critMoonElectroChargedReactionalProcess4;
    let expectMoonElectroChargedReactionalProcess;
    let moonElectroChargedDmgUpSectionProcess;
    let moonElectroChargedPromotionProcess;
    // 月開花（直接）
    let moonRuptureDirectlyBaseProcess;
    let moonRuptureDmgUpSectionProcess;
    let moonRuptureExtraValSectionProcess;
    let moonRupturePromotionProcess;

    let showDerivativeDamage = false;

    switch (true) {
      case isAbsoluteDmg: {
        originDmg = rate * (data[base] ?? 0) * (1 - dmgAntiSectionMinusOnlyValue);
        break;
      }
      default: {
        originDmg = 0;
        critDmg = 0;
        expectDmg = 0;
        switch (true) {
          case isDefaultDamageType: {
            originDmg =
              dmgSectionValue *
              (1 + dmgUpSectionValue) *
              (1 - dmgAntiSectionValue) *
              (1 - defenceSectionValue);
            originDmg = this.getFinalResCalQueueResult(data, originDmg, param.finalResCalQueue);
            critDmg = originDmg * (1 + finalCritDmg);
            expectDmg = originDmg * (1 - finalCritRate) + critDmg * finalCritRate;

            showDerivativeDamage = true;
            break;
          }
          case isDirectlyMoonElectrocharged: {
            // 月感電（直接）
            const specialRate = 3;
            let damgeValue = specialRate;
            const directlyMoonElectrochargedProcessFunc = this.createProcess(damgeValue);
            damgeValue *= data[base] ?? 0;
            directlyMoonElectrochargedProcessFunc(damgeValue, data[base] ?? 0, '*', 'end');
            damgeValue *= rate ?? 0;
            directlyMoonElectrochargedProcessFunc(damgeValue, rate ?? 0, '*', 'end');
            damgeValue *= 1 + (data[Const.PROP_DMG_RATE_MULTI_MOON_ELECTROCHARGED] ?? 0);
            directlyMoonElectrochargedProcessFunc(
              damgeValue,
              1 + (data[Const.PROP_DMG_RATE_MULTI_MOON_ELECTROCHARGED] ?? 0),
              '*',
              'end',
            );
            moonElectroChargedDirectlyBaseProcess = directlyMoonElectrochargedProcessFunc();
            // ダメージ
            const baseRate = 1;
            let damgeUp = baseRate;
            const moonElectrochargedDmgUpProcessFunc = this.createProcess(damgeUp);
            const elementalMasteryUp = elementMoonElectroCharged;
            damgeUp += elementalMasteryUp;
            moonElectrochargedDmgUpProcessFunc(damgeUp, elementalMasteryUp, '+', 'end');
            damgeUp += data[Const.PROP_DMG_ELEMENT_MOON_ELECTROCHARGED_UP] ?? 0;
            moonElectrochargedDmgUpProcessFunc(
              damgeUp,
              data[Const.PROP_DMG_ELEMENT_MOON_ELECTROCHARGED_UP] ?? 0,
              '+',
              'end',
            );
            damgeUp += data[Const.PROP_DMG_ELEMENT_MOON_ALL_UP] ?? 0;
            moonElectrochargedDmgUpProcessFunc(
              damgeUp,
              data[Const.PROP_DMG_ELEMENT_MOON_ALL_UP] ?? 0,
              '+',
              'end',
            );
            moonElectroChargedDmgUpSectionProcess = moonElectrochargedDmgUpProcessFunc();
            // 耐性
            let [dmgAntiSectionValue, tempElectroAntiProcess] = this.getDmgAntiSectionValue(
              data,
              Const.ELEMENT_ELECTRO,
            );
            electroAntiProcess = tempElectroAntiProcess();
            // プロモーション
            const basePromotion = 1;
            let promotion = basePromotion;
            const moonElectrochargedPromotionProcessFunc = this.createProcess(promotion);
            promotion += data[Const.PROP_DMG_ELEMENT_MOON_ELECTROCHARGED_PROMOTION] ?? 0;
            moonElectrochargedPromotionProcessFunc(
              promotion,
              data[Const.PROP_DMG_ELEMENT_MOON_ELECTROCHARGED_PROMOTION] ?? 0,
              '+',
              'end',
            );
            moonElectroChargedPromotionProcess = moonElectrochargedPromotionProcessFunc();
            // 計算
            originMoonElectroChargedDirectlyDmg =
              damgeValue * damgeUp * (1 - dmgAntiSectionValue) * promotion;
            originMoonElectroChargedDirectlyDmg = this.getFinalResCalQueueResult(
              data,
              originMoonElectroChargedDirectlyDmg,
              param.finalResCalQueue,
            );
            cirtMoonElectroChargedDirectlyDmg =
              originMoonElectroChargedDirectlyDmg * (1 + finalCritDmg);
            expectMoonElectroChargedDirectlyDmg =
              originMoonElectroChargedDirectlyDmg * (1 - finalCritRate) +
              cirtMoonElectroChargedDirectlyDmg * finalCritRate;

            showDerivativeDamage = true;
            break;
          }
          case isDirectlyMoonRupture: {
            // 月開花（直接）
            let damgeValue = data[base] ?? 0;
            const directlyMoonRuptureProcessFunc = this.createProcess(damgeValue);
            damgeValue *= rate ?? 0;
            directlyMoonRuptureProcessFunc(damgeValue, rate ?? 0, '*', 'end');
            damgeValue *= 1 + (data[Const.PROP_DMG_RATE_MULTI_MOON_RUPTURE] ?? 0);
            directlyMoonRuptureProcessFunc(
              damgeValue,
              1 + (data[Const.PROP_DMG_RATE_MULTI_MOON_RUPTURE] ?? 0),
              '*',
              'end',
            );
            moonRuptureDirectlyBaseProcess = directlyMoonRuptureProcessFunc();
            // ダメージ
            const baseRate = 1;
            let damgeUp = baseRate;
            const moonRuptureDmgUpProcessFunc = this.createProcess(damgeUp);
            const elementalMasteryUp = elementMoonRupture;
            damgeUp += elementalMasteryUp;
            moonRuptureDmgUpProcessFunc(damgeUp, elementalMasteryUp, '+', 'end');
            damgeUp += data[Const.PROP_DMG_ELEMENT_MOON_RUPTURE_UP] ?? 0;
            moonRuptureDmgUpProcessFunc(
              damgeUp,
              data[Const.PROP_DMG_ELEMENT_MOON_RUPTURE_UP] ?? 0,
              '+',
              'end',
            );
            damgeUp += data[Const.PROP_DMG_ELEMENT_MOON_ALL_UP] ?? 0;
            moonRuptureDmgUpProcessFunc(
              damgeUp,
              data[Const.PROP_DMG_ELEMENT_MOON_ALL_UP] ?? 0,
              '+',
              'end',
            );
            moonRuptureDmgUpSectionProcess = moonRuptureDmgUpProcessFunc();
            // 提升値
            const extraVal = data[Const.PROP_DMG_ELEMENT_MOON_RUPTURE_EXTRA_VAL_UP] ?? 0;
            const moonRuptureExtraValProcessFunc = this.createProcess(extraVal);
            moonRuptureExtraValSectionProcess = moonRuptureExtraValProcessFunc();
            // 耐性
            let [dmgAntiSectionValue, tempDendroAntiProcess] = this.getDmgAntiSectionValue(
              data,
              Const.ELEMENT_DENDRO,
            );
            dendroAntiProcess = tempDendroAntiProcess();
            // プロモーション
            const basePromotion = 1;
            let promotion = basePromotion;
            const moonRupturePromotionProcessFunc = this.createProcess(promotion);
            promotion += data[Const.PROP_DMG_ELEMENT_MOON_RUPTURE_PROMOTION] ?? 0;
            moonRupturePromotionProcessFunc(
              promotion,
              data[Const.PROP_DMG_ELEMENT_MOON_RUPTURE_PROMOTION] ?? 0,
              '+',
              'end',
            );
            moonRupturePromotionProcess = moonRupturePromotionProcessFunc();
            // 計算
            originMoonRuptureDirectlyDmg =
              (damgeValue * damgeUp + extraVal) * (1 - dmgAntiSectionValue) * promotion;
            originMoonRuptureDirectlyDmg = this.getFinalResCalQueueResult(
              data,
              originMoonRuptureDirectlyDmg,
              param.finalResCalQueue,
            );
            cirtMoonRuptureDirectlyDmg = originMoonRuptureDirectlyDmg * (1 + finalCritDmg);
            expectMoonRuptureDirectlyDmg =
              originMoonRuptureDirectlyDmg * (1 - finalCritRate) +
              cirtMoonRuptureDirectlyDmg * finalCritRate;

            showDerivativeDamage = true;
            break;
          }
        }

        if ([Const.PROP_DMG_BONUS_PYRO, Const.PROP_DMG_BONUS_HYDRO].includes(elementBonusType)) {
          let reactionRate = REACTION_RATE_2_0;
          if (elementBonusType == Const.PROP_DMG_BONUS_PYRO) {
            reactionRate = REACTION_RATE_1_5;
          }
          let tempReactionFinalRate = 1;
          const tempValueProcessFunc = this.createProcess(tempReactionFinalRate);
          tempReactionFinalRate += data[Const.PROP_DMG_ELEMENT_VAPORIZE_UP];
          tempValueProcessFunc(tempReactionFinalRate, data[Const.PROP_DMG_ELEMENT_VAPORIZE_UP]);
          tempReactionFinalRate += elementAmplitudeRate;
          tempValueProcessFunc(tempReactionFinalRate, elementAmplitudeRate);
          tempReactionFinalRate *= reactionRate;
          vaporProcess = tempValueProcessFunc(tempReactionFinalRate, reactionRate, '*');

          originVaporizeDmg = tempReactionFinalRate * originDmg;
          cirtVaporizeDmg = tempReactionFinalRate * critDmg;
          expectVaporizeDmg = tempReactionFinalRate * expectDmg;
        }
        if ([Const.PROP_DMG_BONUS_PYRO, Const.PROP_DMG_BONUS_CRYO].includes(elementBonusType)) {
          let reactionRate = REACTION_RATE_2_0;
          if (elementBonusType == Const.PROP_DMG_BONUS_CRYO) {
            reactionRate = REACTION_RATE_1_5;
          }
          let tempReactionFinalRate = 1;
          const tempValueProcessFunc = this.createProcess(tempReactionFinalRate);
          tempReactionFinalRate += data[Const.PROP_DMG_ELEMENT_MELT_UP];
          tempValueProcessFunc(tempReactionFinalRate, data[Const.PROP_DMG_ELEMENT_MELT_UP]);
          tempReactionFinalRate += elementAmplitudeRate;
          tempValueProcessFunc(tempReactionFinalRate, elementAmplitudeRate);
          tempReactionFinalRate *= reactionRate;
          meltProcess = tempValueProcessFunc(tempReactionFinalRate, reactionRate, '*');

          originMeltDmg = tempReactionFinalRate * originDmg;
          cirtMeltDmg = tempReactionFinalRate * critDmg;
          expectMeltDmg = tempReactionFinalRate * expectDmg;
        }
        if (
          [Const.PROP_DMG_BONUS_PYRO, Const.PROP_DMG_BONUS_DENDRO].includes(elementBonusType) &&
          !isDirectlyMoonRupture
        ) {
          let [tempDmgAntiSectionValue, tempPyroAntiProcess] = this.getDmgAntiSectionValue(
            data,
            Const.ELEMENT_PYRO,
          );
          pyroAntiProcess = tempPyroAntiProcess();

          let burningRate = 1;
          const burningUpValueProcessFunc = this.createProcess(burningRate);
          burningRate += data[Const.PROP_DMG_ELEMENT_BURNING_UP];
          burningUpValueProcessFunc(burningRate, data[Const.PROP_DMG_ELEMENT_BURNING_UP]);
          burningRate += elementCataclysmRate;
          burningRateProcess = burningUpValueProcessFunc(burningRate, elementCataclysmRate);
          burningBaseProcess = this.createProcess(BASE_BURNING[data[Const.PROP_LEVEL] - 1])();

          burningDmg =
            BASE_BURNING[data[Const.PROP_LEVEL] - 1] * burningRate * (1 - tempDmgAntiSectionValue);
        }
        if (
          [Const.PROP_DMG_BONUS_CRYO, Const.PROP_DMG_BONUS_ELECTRO].includes(elementBonusType) &&
          !isDirectlyMoonElectrocharged
        ) {
          let [tempDmgAntiSectionValue, tempCryoAntiProcess] = this.getDmgAntiSectionValue(
            data,
            Const.ELEMENT_CRYO,
          );
          cryoAntiProcess = tempCryoAntiProcess();

          let superconductRate = 1;
          const superconductUpValueProcessFunc = this.createProcess(superconductRate);
          superconductRate += data[Const.PROP_DMG_ELEMENT_SUPERCONDUCT_UP];
          superconductUpValueProcessFunc(
            superconductRate,
            data[Const.PROP_DMG_ELEMENT_SUPERCONDUCT_UP],
          );
          superconductRate += elementCataclysmRate;
          superconductRateProcess = superconductUpValueProcessFunc(
            superconductRate,
            elementCataclysmRate,
          );
          superconductBaseProcess = this.createProcess(
            BASE_SUPERCONDUCT[data[Const.PROP_LEVEL] - 1],
          )();

          superconductDmg =
            BASE_SUPERCONDUCT[data[Const.PROP_LEVEL] - 1] *
            superconductRate *
            (1 - tempDmgAntiSectionValue);
        }
        if ([Const.PROP_DMG_BONUS_ANEMO].includes(elementBonusType)) {
          let [tempCryoDmgAntiSectionValue, tempCryoAntiProcess] = this.getDmgAntiSectionValue(
            data,
            Const.ELEMENT_CRYO,
          );
          let [tempElectroDmgAntiSectionValue, tempElectroAntiProcess] =
            this.getDmgAntiSectionValue(data, Const.ELEMENT_ELECTRO);
          let [tempPyroDmgAntiSectionValue, tempPyroAntiProcess] = this.getDmgAntiSectionValue(
            data,
            Const.ELEMENT_PYRO,
          );
          let [tempHydroDmgAntiSectionValue, tempHydroAntiProcess] = this.getDmgAntiSectionValue(
            data,
            Const.ELEMENT_HYDRO,
          );
          cryoAntiProcess = tempCryoAntiProcess();
          electroAntiProcess = tempElectroAntiProcess();
          pyroAntiProcess = tempPyroAntiProcess();
          hydroAntiProcess = tempHydroAntiProcess();

          let swirlRate = 1;
          const swirlUpValueProcessFunc = this.createProcess(swirlRate);
          swirlRate += data[Const.PROP_DMG_ELEMENT_SWIRL_UP];
          swirlUpValueProcessFunc(swirlRate, data[Const.PROP_DMG_ELEMENT_SWIRL_UP]);
          swirlRate += elementCataclysmRate;
          swirlRateProcess = swirlUpValueProcessFunc(swirlRate, elementCataclysmRate);
          let swirlBase = BASE_SWIRL[data[Const.PROP_LEVEL] - 1];
          const swirlBaseProcessFunc = this.createProcess(swirlBase);
          swirlBase += data[Const.PROP_DMG_ELEMENT_SWIRL_VAL_UP];
          swirlBaseProcess = swirlBaseProcessFunc(
            swirlBase,
            data[Const.PROP_DMG_ELEMENT_SWIRL_VAL_UP],
          );

          let swirlBaseDmg = swirlBase * swirlRate;
          swirlCryoDmg = swirlBaseDmg * (1 - tempCryoDmgAntiSectionValue);
          swirlElectroDmg = swirlBaseDmg * (1 - tempElectroDmgAntiSectionValue);
          swirlPyroDmg = swirlBaseDmg * (1 - tempPyroDmgAntiSectionValue);
          swirlHydroDmg = swirlBaseDmg * (1 - tempHydroDmgAntiSectionValue);

          let swirlElectroAggravateRate = 1;
          const swirlElectroAggravateBaseProcessFunc =
            this.createProcess(swirlElectroAggravateRate);
          swirlElectroAggravateRate += elementSpread;
          swirlElectroAggravateBaseProcessFunc(swirlElectroAggravateRate, elementSpread, '+');
          swirlElectroAggravateRate *= REACTION_RATE_1_15;
          swirlElectroAggravateRateProcess = swirlElectroAggravateBaseProcessFunc(
            swirlElectroAggravateRate,
            REACTION_RATE_1_15,
            '*',
            'start',
          );
          swirlElectroAggravateBaseProcess = this.createProcess(
            BASE_LEVEL_MULTIPLIER[data[Const.PROP_LEVEL] - 1],
          )();

          swirlElectroAggravateDmg =
            BASE_LEVEL_MULTIPLIER[data[Const.PROP_LEVEL] - 1] *
              swirlElectroAggravateRate *
              (1 - tempElectroDmgAntiSectionValue) +
            swirlElectroDmg;
        }
        if (
          [Const.PROP_DMG_BONUS_HYDRO, Const.PROP_DMG_BONUS_ELECTRO].includes(elementBonusType) &&
          !isDirectlyMoonElectrocharged
        ) {
          let [tempDmgAntiSectionValue, tempElectroAntiProcess] = this.getDmgAntiSectionValue(
            data,
            Const.ELEMENT_ELECTRO,
          );
          electroAntiProcess = tempElectroAntiProcess();

          if (!isReactionalMoonElectrocharged) {
            let electroChargedRate = 1;
            const electroChargedUpValueProcessFunc = this.createProcess(electroChargedRate);
            electroChargedRate += data[Const.PROP_DMG_ELEMENT_ELECTROCHARGED_UP];
            electroChargedUpValueProcessFunc(
              electroChargedRate,
              data[Const.PROP_DMG_ELEMENT_ELECTROCHARGED_UP],
            );
            electroChargedRate += elementCataclysmRate;
            electroChargedRateProcess = electroChargedUpValueProcessFunc(
              electroChargedRate,
              elementCataclysmRate,
            );
            electroChargedBaseProcess = this.createProcess(
              BASE_ELECTROCHARGED[data[Const.PROP_LEVEL] - 1],
            )();

            electroChargedDmg =
              BASE_ELECTROCHARGED[data[Const.PROP_LEVEL] - 1] *
              electroChargedRate *
              (1 - tempDmgAntiSectionValue);
          } else {
            // 月感電（反応）
            const members: string[] = [indexStr].concat(
              ...this.teamService.getOtherMembers(indexStr),
            );
            const originDamageList = [];
            const originDamageProcessList = [];
            const critDamageList = [];
            const critDamageProcessList = [];
            const critRateList = [];
            const damageDistributions = [1, 1 / 2, 1 / 12, 1 / 12];
            for (const memberIndexStr of members) {
              if (memberIndexStr === '') {
                continue;
              }
              let memberData = this.dataMap[memberIndexStr].allData!;
              if (memberIndexStr == indexStr) {
                memberData = data;
              }
              // ベース
              let damageValue = BASE_MOON_ELECTROCHARGED_REACTION[memberData[Const.PROP_LEVEL] - 1];
              const tempResultProcessFunc = this.createProcess(damageValue);
              damageValue *= 1 + (data[Const.PROP_DMG_RATE_MULTI_MOON_ELECTROCHARGED] ?? 0);
              tempResultProcessFunc(
                damageValue,
                `(1 ${this.plus} ${this.proximateVal(data[Const.PROP_DMG_RATE_MULTI_MOON_ELECTROCHARGED] ?? 0)})`,
                '*',
                'end',
              );
              // ダメージ
              const tempElementMoonElectroCharged =
                6 / (1 + 2000 / memberData[Const.PROP_ELEMENTAL_MASTERY]);
              damageValue *=
                1 +
                tempElementMoonElectroCharged +
                (memberData[Const.PROP_DMG_ELEMENT_MOON_ELECTROCHARGED_UP] ?? 0) +
                (memberData[Const.PROP_DMG_ELEMENT_MOON_ALL_UP] ?? 0);
              tempResultProcessFunc(
                damageValue,
                `(1 ${this.plus} ${this.proximateVal(tempElementMoonElectroCharged)} ${this.plus} ${memberData[Const.PROP_DMG_ELEMENT_MOON_ELECTROCHARGED_UP] ?? 0} ${this.plus} ${memberData[Const.PROP_DMG_ELEMENT_MOON_ALL_UP] ?? 0})`,
                '*',
                'end',
              );
              // 耐性
              damageValue *= 1 - tempDmgAntiSectionValue;
              tempResultProcessFunc(damageValue, 1 - tempDmgAntiSectionValue, '*', 'end');
              // プロモーション
              const basePromotion = 1;
              let promotion = basePromotion;
              promotion += data[Const.PROP_DMG_ELEMENT_MOON_ELECTROCHARGED_PROMOTION] ?? 0;
              damageValue *= promotion;
              tempResultProcessFunc(damageValue, promotion, '*', 'end');

              originDamageList.push(damageValue);
              originDamageProcessList.push(tempResultProcessFunc);

              // 会心ダメージ
              let critDamageValue =
                damageValue *
                (1 + memberData[Const.PROP_CRIT_DMG] + memberData[Const.PROP_DMG_CRIT_DMG_UP_ALL]);
              const tempCritResultProcessFunc = this.createProcess(
                damageValue,
                tempResultProcessFunc()[1],
              );
              tempCritResultProcessFunc(
                critDamageValue,
                1 + memberData[Const.PROP_CRIT_DMG] + memberData[Const.PROP_DMG_CRIT_DMG_UP_ALL],
                '*',
                'end',
              );
              critDamageList.push(critDamageValue);
              critDamageProcessList.push(tempCritResultProcessFunc);

              // 会心率
              critRateList.push(
                memberData[Const.PROP_CRIT_RATE] + memberData[Const.PROP_DMG_CRIT_RATE_UP_ALL],
              );
            }

            originMoonElectroChargedReactionalDmg = 0;
            cirtMoonElectroChargedReactionalDmg = 0;
            expectMoonElectroChargedReactionalDmg = 0;

            const originRankingList = this.getRankings(originDamageList);
            const critRankingList = this.getRankings(critDamageList);
            const length = originDamageList.length;
            for (let i = 0; i < length; ++i) {
              const originRankingIndex = originRankingList[i];
              const critRankingIndex = critRankingList[i];

              const currentOriginVal = originDamageList[i];
              const currentOriginProcess = originDamageProcessList[i];
              const finalOriginVal = currentOriginVal * damageDistributions[originRankingIndex];
              currentOriginProcess(
                finalOriginVal,
                damageDistributions[originRankingIndex],
                '*',
                'end',
              );
              originMoonElectroChargedReactionalDmg += finalOriginVal;

              const currentCritVal = critDamageList[i];
              const currentCritProcess = critDamageProcessList[i];
              const finalCritVal = currentCritVal * damageDistributions[critRankingIndex];
              currentCritProcess(finalCritVal, damageDistributions[critRankingIndex], '*', 'end');
              cirtMoonElectroChargedReactionalDmg += finalCritVal;
            }

            expectMoonElectroChargedReactionalDmg = this.calculateExpectedWeightedDamage(
              originDamageList,
              critDamageList,
              critRateList,
              damageDistributions,
            );

            [
              originMoonElectroChargedReactionalProcess1,
              originMoonElectroChargedReactionalProcess2,
              originMoonElectroChargedReactionalProcess3,
              originMoonElectroChargedReactionalProcess4,
            ] = originDamageProcessList.map((func) => func());
            [
              critMoonElectroChargedReactionalProcess1,
              critMoonElectroChargedReactionalProcess2,
              critMoonElectroChargedReactionalProcess3,
              critMoonElectroChargedReactionalProcess4,
            ] = critDamageProcessList.map((func) => func());

            expectMoonElectroChargedReactionalProcess = this.createProcess(
              expectMoonElectroChargedReactionalDmg,
            )();
          }
        }
        if ([Const.PROP_DMG_BONUS_PHYSICAL].includes(elementBonusType)) {
          let [tempDmgAntiSectionValue, tempPhysicalAntiProcess] = this.getDmgAntiSectionValue(
            data,
            Const.ELEMENT_PHYSICAL,
          );
          physicalAntiProcess = tempPhysicalAntiProcess();

          let destructionRate = 1;
          const destructionUpValueProcessFunc = this.createProcess(destructionRate);
          destructionRate += data[Const.PROP_DMG_ELEMENT_DESTRUCTION_UP];
          destructionUpValueProcessFunc(
            destructionRate,
            data[Const.PROP_DMG_ELEMENT_DESTRUCTION_UP],
          );
          destructionRate += elementCataclysmRate;
          destructionRateProcess = destructionUpValueProcessFunc(
            destructionRate,
            elementCataclysmRate,
          );
          destructionBaseProcess = this.createProcess(
            BASE_DESTRUCTION[data[Const.PROP_LEVEL] - 1],
          )();

          destructionDmg =
            BASE_DESTRUCTION[data[Const.PROP_LEVEL] - 1] *
            destructionRate *
            (1 - tempDmgAntiSectionValue);
        }
        if (
          [Const.PROP_DMG_BONUS_ELECTRO, Const.PROP_DMG_BONUS_PYRO].includes(elementBonusType) &&
          !isDirectlyMoonElectrocharged
        ) {
          let [tempDmgAntiSectionValue, tempPyroAntiProcess] = this.getDmgAntiSectionValue(
            data,
            Const.ELEMENT_PYRO,
          );
          pyroAntiProcess = tempPyroAntiProcess();

          let overloadedRate = 1;
          const overloadedUpValueProcessFunc = this.createProcess(overloadedRate);
          overloadedRate += data[Const.PROP_DMG_ELEMENT_OVERLOADED_UP];
          overloadedUpValueProcessFunc(overloadedRate, data[Const.PROP_DMG_ELEMENT_OVERLOADED_UP]);
          overloadedRate += elementCataclysmRate;
          overloadedRateProcess = overloadedUpValueProcessFunc(
            overloadedRate,
            elementCataclysmRate,
          );
          overloadedBaseProcess = this.createProcess(BASE_OVERLOADED[data[Const.PROP_LEVEL] - 1])();

          overloadedDmg =
            BASE_OVERLOADED[data[Const.PROP_LEVEL] - 1] *
            (1 + data[Const.PROP_DMG_ELEMENT_OVERLOADED_UP] + elementCataclysmRate) *
            (1 - tempDmgAntiSectionValue);
        }
        if ([Const.PROP_DMG_BONUS_GEO].includes(elementBonusType)) {
          let shieldRate = 1;
          const shieldUpValueProcessFunc = this.createProcess(shieldRate);
          shieldRate += data[Const.PROP_DMG_ELEMENT_SHIELD_UP];
          shieldUpValueProcessFunc(shieldRate, data[Const.PROP_DMG_ELEMENT_SHIELD_UP]);
          shieldRate += elementShieldRate;
          shieldRateProcess = shieldUpValueProcessFunc(shieldRate, elementShieldRate);
          shieldBaseProcess = this.createProcess(BASE_SHIELD[data[Const.PROP_LEVEL] - 1])();

          shieldSpecialRateProcess = this.createProcess(Const.SHIELD_SPECIAL_ELEMENT_ABS_RATE)();

          shieldHp =
            BASE_SHIELD[data[Const.PROP_LEVEL] - 1] *
            (1 + data[Const.PROP_DMG_ELEMENT_SHIELD_UP] + elementShieldRate);
        }
        if (
          [Const.PROP_DMG_BONUS_ELECTRO].includes(elementBonusType) &&
          !isDirectlyMoonElectrocharged
        ) {
          let AggravateDmgBase = 1;
          const AggravateDmgBaseProcessFunc = this.createProcess(AggravateDmgBase);
          AggravateDmgBase += data[Const.PROP_DMG_ELEMENT_AGGRAVATE_UP];
          AggravateDmgBaseProcessFunc(AggravateDmgBase, data[Const.PROP_DMG_ELEMENT_AGGRAVATE_UP]);
          AggravateDmgBase += elementSpread;
          AggravateDmgBaseProcessFunc(AggravateDmgBase, elementSpread);
          AggravateDmgBase *= REACTION_RATE_1_15;
          AggravateDmgBaseProcessFunc(AggravateDmgBase, REACTION_RATE_1_15, '*');
          AggravateDmgBase *= BASE_LEVEL_MULTIPLIER[data[Const.PROP_LEVEL] - 1];
          aggravateDmgBaseProcess = AggravateDmgBaseProcessFunc(
            AggravateDmgBase,
            BASE_LEVEL_MULTIPLIER[data[Const.PROP_LEVEL] - 1],
            '*',
            'start',
          );

          originAggravateDmg =
            (dmgSectionValue + AggravateDmgBase) *
            (1 + dmgUpSectionValue) *
            (1 - dmgAntiSectionValue) *
            (1 - defenceSectionValue);
          cirtAggravateDmg = originAggravateDmg * (1 + finalCritDmg);
          expectAggravateDmg =
            originAggravateDmg * (1 - finalCritRate) + cirtAggravateDmg * finalCritRate;

          let [tempDmgAntiSectionValue, tempDendroAntiProcess] = this.getDmgAntiSectionValue(
            data,
            Const.ELEMENT_DENDRO,
          );
          dendroAntiProcess = tempDendroAntiProcess();

          let hyperbloomRate = 1;
          const hyperbloomUpValueProcessFunc = this.createProcess(hyperbloomRate);
          hyperbloomRate += data[Const.PROP_DMG_ELEMENT_HYPERBLOOM_UP];
          hyperbloomUpValueProcessFunc(hyperbloomRate, data[Const.PROP_DMG_ELEMENT_HYPERBLOOM_UP]);
          hyperbloomRate += elementCataclysmRate;
          hyperbloomRateProcess = hyperbloomUpValueProcessFunc(
            hyperbloomRate,
            elementCataclysmRate,
          );
          hyperbloomBaseProcess = this.createProcess(BASE_HYPERBLOOM[data[Const.PROP_LEVEL] - 1])();
          // 提升値
          const extraVal = data[Const.PROP_DMG_ELEMENT_HYPERBLOOM_EXTRA_VAL_UP] ?? 0;
          const hyperbloomExtraValSectionProcessFunc = this.createProcess(extraVal);
          hyperbloomExtraValSectionProcess = hyperbloomExtraValSectionProcessFunc();

          hyperbloomDmg =
            (BASE_HYPERBLOOM[data[Const.PROP_LEVEL] - 1] *
              (1 + data[Const.PROP_DMG_ELEMENT_HYPERBLOOM_UP] + elementCataclysmRate) +
              extraVal) *
            (1 - tempDmgAntiSectionValue);
        }
        if ([Const.PROP_DMG_BONUS_DENDRO].includes(elementBonusType) && !isDirectlyMoonRupture) {
          let spreadDmgBase = 1;
          const spreadDmgBaseProcessFunc = this.createProcess(spreadDmgBase);
          spreadDmgBase += data[Const.PROP_DMG_ELEMENT_SPREAD_UP];
          spreadDmgBaseProcessFunc(spreadDmgBase, data[Const.PROP_DMG_ELEMENT_SPREAD_UP]);
          spreadDmgBase += elementSpread;
          spreadDmgBaseProcessFunc(spreadDmgBase, elementSpread);
          spreadDmgBase *= REACTION_RATE_1_25;
          spreadDmgBaseProcessFunc(spreadDmgBase, REACTION_RATE_1_25, '*');
          spreadDmgBase *= BASE_LEVEL_MULTIPLIER[data[Const.PROP_LEVEL] - 1];
          spreadDmgBaseProcess = spreadDmgBaseProcessFunc(
            spreadDmgBase,
            BASE_LEVEL_MULTIPLIER[data[Const.PROP_LEVEL] - 1],
            '*',
            'start',
          );

          originSpreadDmg =
            (dmgSectionValue +
              BASE_LEVEL_MULTIPLIER[data[Const.PROP_LEVEL] - 1] *
                REACTION_RATE_1_25 *
                (1 + data[Const.PROP_DMG_ELEMENT_SPREAD_UP] + elementSpread)) *
            (1 + dmgUpSectionValue) *
            (1 - dmgAntiSectionValue) *
            (1 - defenceSectionValue);
          cirtSpreadDmg = originSpreadDmg * (1 + finalCritDmg);
          expectSpreadDmg = originSpreadDmg * (1 - finalCritRate) + cirtSpreadDmg * finalCritRate;
        }
        if ([Const.PROP_DMG_BONUS_PYRO].includes(elementBonusType)) {
          let [tempDmgAntiSectionValue, tempDendroAntiProcess] = this.getDmgAntiSectionValue(
            data,
            Const.ELEMENT_DENDRO,
          );
          dendroAntiProcess = tempDendroAntiProcess();

          let burgeonRate = 1;
          const burgeonUpValueProcessFunc = this.createProcess(burgeonRate);
          burgeonRate += data[Const.PROP_DMG_ELEMENT_BURGEON_UP];
          burgeonUpValueProcessFunc(burgeonRate, data[Const.PROP_DMG_ELEMENT_BURGEON_UP]);
          burgeonRate += elementCataclysmRate;
          burgeonRateProcess = burgeonUpValueProcessFunc(burgeonRate, elementCataclysmRate);
          burgeonBaseProcess = this.createProcess(BASE_BURGEON[data[Const.PROP_LEVEL] - 1])();
          // 提升値
          const extraVal = data[Const.PROP_DMG_ELEMENT_BURGEON_EXTRA_VAL_UP] ?? 0;
          const burgeonExtraValSectionProcessFunc = this.createProcess(extraVal);
          burgeonExtraValSectionProcess = burgeonExtraValSectionProcessFunc();

          burgeonDmg =
            (BASE_BURGEON[data[Const.PROP_LEVEL] - 1] *
              (1 + data[Const.PROP_DMG_ELEMENT_BURGEON_UP] + elementCataclysmRate) +
              extraVal) *
            (1 - tempDmgAntiSectionValue);
        }
        if (
          [Const.PROP_DMG_BONUS_HYDRO, Const.PROP_DMG_BONUS_DENDRO].includes(elementBonusType) &&
          !isDirectlyMoonRupture
        ) {
          let [tempDmgAntiSectionValue, tempDendroAntiProcess] = this.getDmgAntiSectionValue(
            data,
            Const.ELEMENT_DENDRO,
          );
          dendroAntiProcess = tempDendroAntiProcess();

          let ruptureRate = 1;
          const ruptureUpValueProcessFunc = this.createProcess(ruptureRate);
          ruptureRate += data[Const.PROP_DMG_ELEMENT_RUPTURE_UP];
          ruptureUpValueProcessFunc(ruptureRate, data[Const.PROP_DMG_ELEMENT_RUPTURE_UP]);
          ruptureRate += elementCataclysmRate;
          ruptureRateProcess = ruptureUpValueProcessFunc(ruptureRate, elementCataclysmRate);
          ruptureBaseProcess = this.createProcess(BASE_RUPTURE[data[Const.PROP_LEVEL] - 1])();
          // 提升値
          const extraVal = data[Const.PROP_DMG_ELEMENT_RUPTURE_EXTRA_VAL_UP] ?? 0;
          const ruptureExtraValSectionProcessFunc = this.createProcess(extraVal);
          ruptureExtraValSectionProcess = ruptureExtraValSectionProcessFunc();

          ruptureDmg =
            (BASE_RUPTURE[data[Const.PROP_LEVEL] - 1] *
              (1 + data[Const.PROP_DMG_ELEMENT_RUPTURE_UP] + elementCataclysmRate) +
              extraVal) *
            (1 - tempDmgAntiSectionValue);
        }
      }
    }

    result = {
      calcProcessKeyMap: {
        originDmg: isAbsoluteDmg
          ? ['dmgSectionValueProcess', 'dmgAntiSectionMinusOnlyValueProcess']
          : [
              'dmgSectionValueProcess',
              'dmgUpSectionValueProcess',
              'dmgAntiSectionValueProcess',
              'defenceSectionValueProcess',
            ],
        critDmg: [
          'dmgSectionValueProcess',
          'critDmgSectionValueProcess',
          'dmgUpSectionValueProcess',
          'dmgAntiSectionValueProcess',
          'defenceSectionValueProcess',
        ],
        expectDmg: [
          'dmgSectionValueProcess',
          'critExpectDmgSectionValueProcess',
          'dmgUpSectionValueProcess',
          'dmgAntiSectionValueProcess',
          'defenceSectionValueProcess',
        ],
        originVaporizeDmg: [
          'dmgSectionValueProcess',
          'dmgUpSectionValueProcess',
          'dmgAntiSectionValueProcess',
          'defenceSectionValueProcess',
          'vaporProcess',
        ],
        cirtVaporizeDmg: [
          'dmgSectionValueProcess',
          'critDmgSectionValueProcess',
          'dmgUpSectionValueProcess',
          'dmgAntiSectionValueProcess',
          'defenceSectionValueProcess',
          'vaporProcess',
        ],
        expectVaporizeDmg: [
          'dmgSectionValueProcess',
          'critExpectDmgSectionValueProcess',
          'dmgUpSectionValueProcess',
          'dmgAntiSectionValueProcess',
          'defenceSectionValueProcess',
          'vaporProcess',
        ],
        originMeltDmg: [
          'dmgSectionValueProcess',
          'dmgUpSectionValueProcess',
          'dmgAntiSectionValueProcess',
          'defenceSectionValueProcess',
          'meltProcess',
        ],
        cirtMeltDmg: [
          'dmgSectionValueProcess',
          'critDmgSectionValueProcess',
          'dmgUpSectionValueProcess',
          'dmgAntiSectionValueProcess',
          'defenceSectionValueProcess',
          'meltProcess',
        ],
        expectMeltDmg: [
          'dmgSectionValueProcess',
          'critExpectDmgSectionValueProcess',
          'dmgUpSectionValueProcess',
          'dmgAntiSectionValueProcess',
          'defenceSectionValueProcess',
          'meltProcess',
        ],
        originAggravateDmg: [
          'dmgSectionValueProcess',
          'aggravateDmgBaseProcess',
          'dmgUpSectionValueProcess',
          'dmgAntiSectionValueProcess',
          'defenceSectionValueProcess',
        ],
        cirtAggravateDmg: [
          'dmgSectionValueProcess',
          'aggravateDmgBaseProcess',
          'critDmgSectionValueProcess',
          'dmgUpSectionValueProcess',
          'dmgAntiSectionValueProcess',
          'defenceSectionValueProcess',
        ],
        expectAggravateDmg: [
          'dmgSectionValueProcess',
          'aggravateDmgBaseProcess',
          'critExpectDmgSectionValueProcess',
          'dmgUpSectionValueProcess',
          'dmgAntiSectionValueProcess',
          'defenceSectionValueProcess',
        ],
        originSpreadDmg: [
          'dmgSectionValueProcess',
          'spreadDmgBaseProcess',
          'dmgUpSectionValueProcess',
          'dmgAntiSectionValueProcess',
          'defenceSectionValueProcess',
        ],
        cirtSpreadDmg: [
          'dmgSectionValueProcess',
          'spreadDmgBaseProcess',
          'critDmgSectionValueProcess',
          'dmgUpSectionValueProcess',
          'dmgAntiSectionValueProcess',
          'defenceSectionValueProcess',
        ],
        expectSpreadDmg: [
          'dmgSectionValueProcess',
          'spreadDmgBaseProcess',
          'critExpectDmgSectionValueProcess',
          'dmgUpSectionValueProcess',
          'dmgAntiSectionValueProcess',
          'defenceSectionValueProcess',
        ],
        overloadedDmg: ['overloadedBaseProcess', 'overloadedRateProcess', 'pyroAntiProcess'],
        burningDmg: ['burningBaseProcess', 'burningRateProcess', 'pyroAntiProcess'],
        electroChargedDmg: [
          'electroChargedRateProcess',
          'electroChargedBaseProcess',
          'electroAntiProcess',
        ],
        superconductDmg: ['superconductBaseProcess', 'superconductRateProcess', 'cryoAntiProcess'],
        ruptureDmg: [
          'ruptureBaseProcess',
          'ruptureRateProcess',
          'ruptureExtraValSectionProcess',
          'dendroAntiProcess',
        ],
        burgeonDmg: [
          'burgeonBaseProcess',
          'burgeonRateProcess',
          'burgeonExtraValSectionProcess',
          'dendroAntiProcess',
        ],
        hyperbloomDmg: [
          'hyperbloomBaseProcess',
          'hyperbloomRateProcess',
          'hyperbloomExtraValSectionProcess',
          'dendroAntiProcess',
        ],
        swirlCryoDmg: ['swirlBaseProcess', 'swirlRateProcess', 'cryoAntiProcess'],
        swirlElectroDmg: ['swirlBaseProcess', 'swirlRateProcess', 'electroAntiProcess'],
        swirlElectroAggravateDmg: [
          'swirlBaseProcess',
          'swirlRateProcess',
          'swirlElectroAggravateBaseProcess',
          'swirlElectroAggravateRateProcess',
          'electroAntiProcess',
        ],
        swirlPyroDmg: ['swirlBaseProcess', 'swirlRateProcess', 'pyroAntiProcess'],
        swirlHydroDmg: ['swirlBaseProcess', 'swirlRateProcess', 'hydroAntiProcess'],
        shieldHp: ['shieldBaseProcess', 'shieldRateProcess'],
        shieldSpecialHp: ['shieldBaseProcess', 'shieldRateProcess', 'shieldSpecialRateProcess'],
        destructionDmg: ['destructionBaseProcess', 'destructionRateProcess', 'physicalAntiProcess'],
        originMoonElectroChargedDirectlyDmg: [
          'moonElectroChargedDirectlyBaseProcess',
          'moonElectroChargedDmgUpSectionProcess',
          'moonElectroChargedPromotionProcess',
          'electroAntiProcess',
        ],
        cirtMoonElectroChargedDirectlyDmg: [
          'moonElectroChargedDirectlyBaseProcess',
          'critDmgSectionValueProcess',
          'moonElectroChargedDmgUpSectionProcess',
          'moonElectroChargedPromotionProcess',
          'electroAntiProcess',
        ],
        expectMoonElectroChargedDirectlyDmg: [
          'moonElectroChargedDirectlyBaseProcess',
          'critExpectDmgSectionValueProcess',
          'moonElectroChargedDmgUpSectionProcess',
          'moonElectroChargedPromotionProcess',
          'electroAntiProcess',
        ],
        originMoonElectroChargedReactionalDmg: [
          'originMoonElectroChargedReactionalProcess1',
          'originMoonElectroChargedReactionalProcess2',
          'originMoonElectroChargedReactionalProcess3',
          'originMoonElectroChargedReactionalProcess4',
        ],
        cirtMoonElectroChargedReactionalDmg: [
          'critMoonElectroChargedReactionalProcess1',
          'critMoonElectroChargedReactionalProcess2',
          'critMoonElectroChargedReactionalProcess3',
          'critMoonElectroChargedReactionalProcess4',
        ],
        expectMoonElectroChargedReactionalDmg: ['expectMoonElectroChargedReactionalProcess'],
        originMoonRuptureDirectlyDmg: [
          'moonRuptureDirectlyBaseProcess',
          'moonRuptureDmgUpSectionProcess',
          'moonRuptureExtraValSectionProcess',
          'moonRupturePromotionProcess',
          'dendroAntiProcess',
        ],
        cirtMoonRuptureDirectlyDmg: [
          'moonRuptureDirectlyBaseProcess',
          'moonRuptureDmgUpSectionProcess',
          'moonRuptureExtraValSectionProcess',
          'critDmgSectionValueProcess',
          'moonRupturePromotionProcess',
          'dendroAntiProcess',
        ],
        expectMoonRuptureDirectlyDmg: [
          'moonRuptureDirectlyBaseProcess',
          'moonRuptureDmgUpSectionProcess',
          'moonRuptureExtraValSectionProcess',
          'critExpectDmgSectionValueProcess',
          'moonRupturePromotionProcess',
          'dendroAntiProcess',
        ],
      },
      calcProcessValMap: {
        dmgSectionValueProcess: dmgSectionValueProcessFunc(),
        critRateSectionValueProcess: critRateSectionValueProcessFunc(),
        critDmgSectionValueProcess: critDmgSectionValueProcessFunc(
          1 + critDmgSectionValueProcessFunc()[0],
          '1',
          '+',
          'start',
        ),
        critExpectDmgSectionValueProcess: critExpectDmgSectionValueProcessFunc(),
        dmgUpSectionValueProcess: dmgUpSectionValueProcessFunc(
          1 + dmgUpSectionValueProcessFunc()[0],
          '1',
          '+',
          'start',
        ),
        dmgAntiSectionValueProcess: dmgAntiSectionValueProcessFunc(
          1 - dmgAntiSectionValueProcessFunc()[0],
          '1',
          '-',
          'start',
        ),
        dmgAntiSectionMinusOnlyValueProcess: dmgAntiSectionMinusOnlyValueProcessFunc(
          1 - dmgAntiSectionMinusOnlyValueProcessFunc()[0],
          '1',
          '-',
          'start',
        ),
        defenceSectionValueProcess: defenceSectionValueProcessFunc(
          1 - defenceSectionValueProcessFunc()[0],
          '1',
          '-',
          'start',
        ),

        cryoAntiProcess,
        anemoAntiProcess,
        physicalAntiProcess,
        electroAntiProcess,
        geoAntiProcess,
        pyroAntiProcess,
        hydroAntiProcess,
        dendroAntiProcess,
        vaporProcess,
        meltProcess,
        burningBaseProcess,
        burningRateProcess,
        superconductBaseProcess,
        superconductRateProcess,
        swirlBaseProcess,
        swirlRateProcess,
        swirlElectroAggravateBaseProcess,
        swirlElectroAggravateRateProcess,
        electroChargedRateProcess,
        electroChargedBaseProcess,
        destructionRateProcess,
        destructionBaseProcess,
        overloadedRateProcess,
        overloadedBaseProcess,
        shieldRateProcess,
        shieldBaseProcess,
        aggravateDmgBaseProcess,
        hyperbloomRateProcess,
        hyperbloomExtraValSectionProcess,
        hyperbloomBaseProcess,
        spreadDmgBaseProcess,
        burgeonRateProcess,
        burgeonExtraValSectionProcess,
        burgeonBaseProcess,
        ruptureRateProcess,
        ruptureExtraValSectionProcess,
        ruptureBaseProcess,
        shieldSpecialRateProcess,
        // 月感電（直接）
        moonElectroChargedDirectlyBaseProcess,
        // 月感電（反応）
        originMoonElectroChargedReactionalProcess1,
        originMoonElectroChargedReactionalProcess2,
        originMoonElectroChargedReactionalProcess3,
        originMoonElectroChargedReactionalProcess4,
        critMoonElectroChargedReactionalProcess1,
        critMoonElectroChargedReactionalProcess2,
        critMoonElectroChargedReactionalProcess3,
        critMoonElectroChargedReactionalProcess4,
        expectMoonElectroChargedReactionalProcess,
        moonElectroChargedDmgUpSectionProcess,
        moonElectroChargedPromotionProcess,
        // 月開花（直接）
        moonRuptureDirectlyBaseProcess,
        moonRuptureDmgUpSectionProcess,
        moonRuptureExtraValSectionProcess,
        moonRupturePromotionProcess,
      },
      elementBonusType: elementBonusType,
      finalCritRate: finalCritRate,
      displayCritRate: displayCritRate,
      tempAllDate: tempAllDate,
      isAbsoluteDmg: isAbsoluteDmg,
      forceDisplay,
      originIndex,
      originDmg: originDmg,
      critDmg: critDmg,
      expectDmg: expectDmg,
      originVaporizeDmg: originVaporizeDmg,
      cirtVaporizeDmg: cirtVaporizeDmg,
      expectVaporizeDmg: expectVaporizeDmg,
      originMeltDmg: originMeltDmg,
      cirtMeltDmg: cirtMeltDmg,
      expectMeltDmg: expectMeltDmg,
      originAggravateDmg: showDerivativeDamage ? originAggravateDmg : undefined, //激化 雷
      cirtAggravateDmg: showDerivativeDamage ? cirtAggravateDmg : undefined, //激化 雷
      expectAggravateDmg: showDerivativeDamage ? expectAggravateDmg : undefined, //激化 雷
      originSpreadDmg: showDerivativeDamage ? originSpreadDmg : undefined, //激化 草
      cirtSpreadDmg: showDerivativeDamage ? cirtSpreadDmg : undefined, //激化 草
      expectSpreadDmg: showDerivativeDamage ? expectSpreadDmg : undefined, //激化 草
      overloadedDmg: showDerivativeDamage ? overloadedDmg : undefined,
      burningDmg: showDerivativeDamage ? burningDmg : undefined,
      electroChargedDmg: showDerivativeDamage ? electroChargedDmg : undefined,
      superconductDmg: showDerivativeDamage ? superconductDmg : undefined,
      ruptureDmg: showDerivativeDamage ? ruptureDmg : undefined, //開花 草 水
      burgeonDmg: showDerivativeDamage ? burgeonDmg : undefined, //列開花 草 水 炎
      hyperbloomDmg: showDerivativeDamage ? hyperbloomDmg : undefined, //超開花 草 水 雷
      swirlCryoDmg: showDerivativeDamage ? swirlCryoDmg : undefined,
      swirlElectroDmg: showDerivativeDamage ? swirlElectroDmg : undefined,
      swirlElectroAggravateDmg: showDerivativeDamage ? swirlElectroAggravateDmg : undefined, //拡散 雷 激化
      swirlPyroDmg: showDerivativeDamage ? swirlPyroDmg : undefined,
      swirlHydroDmg: showDerivativeDamage ? swirlHydroDmg : undefined,
      shieldHp: showDerivativeDamage ? shieldHp : undefined,
      shieldSpecialHp: (showDerivativeDamage ? shieldHp : undefined)
        ? (shieldHp || 0) * Const.SHIELD_SPECIAL_ELEMENT_ABS_RATE
        : undefined,
      destructionDmg: showDerivativeDamage ? destructionDmg : undefined,
      originMoonElectroChargedDirectlyDmg: originMoonElectroChargedDirectlyDmg, //月感電（直接）
      cirtMoonElectroChargedDirectlyDmg: cirtMoonElectroChargedDirectlyDmg, //月感電（直接）
      expectMoonElectroChargedDirectlyDmg: expectMoonElectroChargedDirectlyDmg, //月感電（直接）
      originMoonElectroChargedReactionalDmg: originMoonElectroChargedReactionalDmg, //月感電（反応）
      cirtMoonElectroChargedReactionalDmg: cirtMoonElectroChargedReactionalDmg, //月感電（反応）
      expectMoonElectroChargedReactionalDmg: expectMoonElectroChargedReactionalDmg, //月感電（反応）
      originMoonRuptureDirectlyDmg: originMoonRuptureDirectlyDmg, //月開花（直接）
      cirtMoonRuptureDirectlyDmg: cirtMoonRuptureDirectlyDmg, //月開花（直接）
      expectMoonRuptureDirectlyDmg: expectMoonRuptureDirectlyDmg, //月開花（直接）
    };

    return result;
  }

  //治療取得
  getHealing(
    index: string | number,
    param: HealingParam,
    extraData?: Record<string, number>,
    toAddWeaponSmelting?: number,
    reuseDatas?: Record<string, number>,
  ) {
    let indexStr = index.toString();
    if (this.isDirty(indexStr)) {
      this.initAllData(indexStr);
    }
    let result: HealingResult;
    let data = this.dataMap[indexStr].allData!;
    let tempAllDate = undefined;
    if (extraData != undefined) {
      if (reuseDatas != undefined) {
        data = reuseDatas;
      } else {
        data = this.getAllData(indexStr, extraData, toAddWeaponSmelting);
        tempAllDate = data;
      }
    }
    let base = param.base;
    let extra = param.extra ?? 0;
    let rate = param.rate ?? 0;
    let rateAttach = param.rateAttach ?? [];
    let baseAttach = param.baseAttach ?? [];
    let healingBonusType = param.healingBonusType;
    let originIndex = param.originIndex;
    //計算
    let healing: number = 0;
    const healingProcessFunc = this.createProcess(healing);
    //特殊
    if (healingBonusType) {
      switch (healingBonusType) {
        case Const.PROP_HEALING_BONUS_SKILL:
          rate *= 1 + data[Const.PROP_HEALING_RATE_MULTI_SKILL];
          rate += data[Const.PROP_HEALING_RATE_UP_SKILL] ?? 0;
          extra += data[Const.PROP_HEALING_VAL_UP_SKILL] ?? 0;
          rateAttach = rateAttach.map((x) =>
            x.map(
              (x) =>
                x * (1 + data[Const.PROP_HEALING_RATE_MULTI_SKILL]) +
                (data[Const.PROP_HEALING_RATE_UP_SKILL] ?? 0),
            ),
          );
          break;
        case Const.PROP_HEALING_BONUS_ELEMENTAL_BURST:
          rate *= 1 + data[Const.PROP_HEALING_RATE_MULTI_ELEMENTAL_BURST];
          rate += data[Const.PROP_HEALING_RATE_UP_ELEMENTAL_BURST] ?? 0;
          extra += data[Const.PROP_HEALING_VAL_UP_ELEMENTAL_BURST] ?? 0;
          rateAttach = rateAttach.map((x) =>
            x.map(
              (x) =>
                x * (1 + data[Const.PROP_HEALING_RATE_MULTI_ELEMENTAL_BURST]) +
                (data[Const.PROP_HEALING_RATE_UP_ELEMENTAL_BURST] ?? 0),
            ),
          );
          break;
        case Const.PROP_HEALING_BONUS_WEAPON:
        case Const.PROP_HEALING_BONUS_OTHER:
        case Const.PROP_HEALING_BONUS_SET:
          break;
      }
    }
    if (base != undefined && rate != undefined) {
      healing += data[base] * rate;
      healingProcessFunc(
        healing,
        `${this.proximateVal(data[base])} ${this.times} ${this.proximateVal(rate)}`,
        '+',
      );
    }
    for (let i = 0; i < rateAttach.length; ++i) {
      let tempHealingRateBaseProp = baseAttach[i];
      rateAttach[i].forEach((v) => {
        const tempfinalRateProcessFunc = this.createProcess(v);
        const temp_healing_rate_value = v * data[tempHealingRateBaseProp];
        tempfinalRateProcessFunc(
          temp_healing_rate_value,
          data[tempHealingRateBaseProp],
          '*',
          'start',
        );
        healing += temp_healing_rate_value;
        healingProcessFunc(healing, tempfinalRateProcessFunc()[1], '+');
      });
    }
    if (extra != undefined) {
      healing += extra;
      healingProcessFunc(healing, extra, '+');
    }
    let healingUp = 1;
    const healingUpProcessFunc = this.createProcess(healingUp);
    healingUp += data[Const.PROP_HEALING_BONUS];
    healingUpProcessFunc(healingUp, data[Const.PROP_HEALING_BONUS], '+');
    healingUp += data[Const.PROP_REVERSE_HEALING_BONUS];
    healingUpProcessFunc(healingUp, data[Const.PROP_REVERSE_HEALING_BONUS], '+');
    healingUp += healingBonusType ? (data[healingBonusType] ?? 0) : 0;
    healingUpProcessFunc(healingUp, healingBonusType ? (data[healingBonusType] ?? 0) : 0, '+');
    healing *= healingUp;
    healing = this.getFinalResCalQueueResult(data, healing, param.finalResCalQueue);
    result = {
      calcProcessKeyMap: {
        healing: ['healingProcess', 'healingUpProcess'],
      },
      calcProcessValMap: {
        healingProcess: healingProcessFunc(),
        healingUpProcess: healingUpProcessFunc(),
      },
      tempAllDate,
      healing: healing,
      originIndex,
    };

    return result;
  }

  //バリア強度取得
  getShield(
    index: string | number,
    param: ShieldParam,
    extraData?: Record<string, number>,
    toAddWeaponSmelting?: number,
    reuseDatas?: Record<string, number>,
  ) {
    let indexStr = index.toString();
    if (this.isDirty(indexStr)) {
      this.initAllData(indexStr);
    }
    let result: ShieldResult;
    let data = this.dataMap[indexStr].allData!;
    let tempAllDate = undefined;
    if (extraData != undefined) {
      if (reuseDatas != undefined) {
        data = reuseDatas;
      } else {
        data = this.getAllData(indexStr, extraData, toAddWeaponSmelting);
        tempAllDate = data;
      }
    }
    let base = param.base;
    let extra = param.extra ?? 0;
    let rate = param.rate ?? 0;
    let rateAttach = param.rateAttach ?? [];
    let baseAttach = param.baseAttach ?? [];
    let shieldBonusType = param.shieldBonusType;
    let shieldElementType = param.shieldElementType;
    let originIndex = param.originIndex;
    //計算
    let shield: number = 0;
    const shieldProcessFunc = this.createProcess(shield);
    if (base != undefined && rate != undefined) {
      shield += data[base] * rate;
      shieldProcessFunc(
        shield,
        `${this.proximateVal(data[base])} ${this.times} ${this.proximateVal(rate)}`,
        '+',
      );
    }
    for (let i = 0; i < rateAttach.length; ++i) {
      let tempShieldRateBaseProp = baseAttach[i];
      rateAttach[i].forEach((v) => {
        const tempfinalRateProcessFunc = this.createProcess(v);
        const temp_shield_rate_value = v * data[tempShieldRateBaseProp];
        tempfinalRateProcessFunc(
          temp_shield_rate_value,
          data[tempShieldRateBaseProp],
          '*',
          'start',
        );
        shield += temp_shield_rate_value;
        shieldProcessFunc(shield, tempfinalRateProcessFunc()[1], '+');
      });
    }
    if (extra != undefined) {
      shield += extra;
      shieldProcessFunc(shield, extra, '+');
    }
    //特殊
    let specialUp = 1;
    const shieldSpecialUpProcessFunc = this.createProcess(specialUp);
    if (shieldBonusType) {
      switch (shieldBonusType) {
        case Const.PROP_SHIELD_BONUS_NORMAL:
          specialUp += data[Const.PROP_SHIELD_BONUS_NORMAL] ?? 0;
          break;
        case Const.PROP_SHIELD_BONUS_SKILL:
          specialUp += data[Const.PROP_SHIELD_BONUS_SKILL] ?? 0;
          break;
        case Const.PROP_SHIELD_BONUS_ELEMENTAL_BURST:
          specialUp += data[Const.PROP_SHIELD_BONUS_ELEMENTAL_BURST] ?? 0;
          break;
        case Const.PROP_SHIELD_BONUS_WEAPON:
          specialUp += data[Const.PROP_SHIELD_BONUS_WEAPON] ?? 0;
          break;
        case Const.PROP_SHIELD_BONUS_OTHER:
          specialUp += data[Const.PROP_SHIELD_BONUS_OTHER] ?? 0;
          break;
        case Const.PROP_SHIELD_BONUS_SET:
          specialUp += data[Const.PROP_SHIELD_BONUS_SET] ?? 0;
          break;
      }
    }
    shieldSpecialUpProcessFunc(specialUp, specialUp - 1, '+');
    shield *= specialUp;
    let shiledCommonUp = 1;
    const shieldCommonUpProcessFunc = this.createProcess(shiledCommonUp);
    shiledCommonUp += data[Const.PROP_DMG_ELEMENT_SHIELD_UP] ?? 0;
    shieldCommonUpProcessFunc(shiledCommonUp, data[Const.PROP_DMG_ELEMENT_SHIELD_UP] ?? 0, '+');
    shield *= shiledCommonUp;
    shield = this.getFinalResCalQueueResult(data, shield, param.finalResCalQueue);
    const specialElementAbsRate = Const.SHIELD_SPECIAL_ELEMENT_ABS_RATE;
    const geoElementAbsRate = Const.SHIELD_GEO_ELEMENT_ABS_RATE;
    const specialElementAbsProcess = this.createProcess(specialElementAbsRate)();
    const geoElementAbsProcess = this.createProcess(geoElementAbsRate)();
    //シールド元素タイプ
    let tempRes: ShieldResult = {
      calcProcessKeyMap: {
        shield: ['shieldProcess', 'shieldSpecialUpProcess', 'shieldCommonUpProcess'],
        shieldCryo: ['shieldProcess', 'shieldSpecialUpProcess', 'shieldCommonUpProcess'],
        shieldAnemo: ['shieldProcess', 'shieldSpecialUpProcess', 'shieldCommonUpProcess'],
        shieldPhysical: ['shieldProcess', 'shieldSpecialUpProcess', 'shieldCommonUpProcess'],
        shieldElectro: ['shieldProcess', 'shieldSpecialUpProcess', 'shieldCommonUpProcess'],
        shieldGeo: ['shieldProcess', 'shieldSpecialUpProcess', 'shieldCommonUpProcess'],
        shieldPyro: ['shieldProcess', 'shieldSpecialUpProcess', 'shieldCommonUpProcess'],
        shieldHydro: ['shieldProcess', 'shieldSpecialUpProcess', 'shieldCommonUpProcess'],
        shieldDendro: ['shieldProcess', 'shieldSpecialUpProcess', 'shieldCommonUpProcess'],
      },
      calcProcessValMap: {
        shieldProcess: shieldProcessFunc(),
        shieldSpecialUpProcess: shieldSpecialUpProcessFunc(),
        shieldCommonUpProcess: shieldCommonUpProcessFunc(),
        specialElementAbsProcess,
        geoElementAbsProcess,
      },
      tempAllDate,
      shield: shield,
      shieldCryo: shield,
      shieldAnemo: shield,
      shieldPhysical: shield,
      shieldElectro: shield,
      shieldGeo: shield,
      shieldPyro: shield,
      shieldHydro: shield,
      shieldDendro: shield,
    };
    switch (shieldElementType) {
      case Const.ELEMENT_CRYO:
        tempRes.shieldCryo = shield * specialElementAbsRate;
        tempRes.calcProcessKeyMap['shieldCryo'].push('specialElementAbsProcess');
        break;
      case Const.ELEMENT_ANEMO:
        tempRes.shieldAnemo = shield * specialElementAbsRate;
        tempRes.calcProcessKeyMap['shieldAnemo'].push('specialElementAbsProcess');
        break;
      case Const.ELEMENT_PHYSICAL:
        tempRes.shieldPhysical = shield * specialElementAbsRate;
        tempRes.calcProcessKeyMap['shieldPhysical'].push('specialElementAbsProcess');
        break;
      case Const.ELEMENT_ELECTRO:
        tempRes.shieldElectro = shield * specialElementAbsRate;
        tempRes.calcProcessKeyMap['shieldElectro'].push('specialElementAbsProcess');
        break;
      case Const.ELEMENT_GEO:
        tempRes.shieldCryo = shield * geoElementAbsRate;
        tempRes.shieldAnemo = shield * geoElementAbsRate;
        tempRes.shieldPhysical = shield * geoElementAbsRate;
        tempRes.shieldElectro = shield * geoElementAbsRate;
        tempRes.shieldGeo = shield * geoElementAbsRate;
        tempRes.shieldPyro = shield * geoElementAbsRate;
        tempRes.shieldHydro = shield * geoElementAbsRate;
        tempRes.shieldDendro = shield * geoElementAbsRate;
        tempRes.calcProcessKeyMap['shieldCryo'].push('geoElementAbsProcess');
        tempRes.calcProcessKeyMap['shieldAnemo'].push('geoElementAbsProcess');
        tempRes.calcProcessKeyMap['shieldPhysical'].push('geoElementAbsProcess');
        tempRes.calcProcessKeyMap['shieldElectro'].push('geoElementAbsProcess');
        tempRes.calcProcessKeyMap['shieldGeo'].push('geoElementAbsProcess');
        tempRes.calcProcessKeyMap['shieldPyro'].push('geoElementAbsProcess');
        tempRes.calcProcessKeyMap['shieldHydro'].push('geoElementAbsProcess');
        tempRes.calcProcessKeyMap['shieldDendro'].push('geoElementAbsProcess');
        break;
      case Const.ELEMENT_PYRO:
        tempRes.shieldPyro = shield * specialElementAbsRate;
        tempRes.calcProcessKeyMap['shieldPyro'].push('specialElementAbsProcess');
        break;
      case Const.ELEMENT_HYDRO:
        tempRes.shieldHydro = shield * specialElementAbsRate;
        tempRes.calcProcessKeyMap['shieldHydro'].push('specialElementAbsProcess');
        break;
      case Const.ELEMENT_DENDRO:
        tempRes.shieldDendro = shield * specialElementAbsRate;
        tempRes.calcProcessKeyMap['shieldDendro'].push('specialElementAbsProcess');
        break;
    }
    result = {
      ...tempRes,
      shieldElementType,
      originIndex,
    };

    return result;
  }

  //生成物HP取得
  getProductHp(
    index: string | number,
    param: ProductParam,
    extraData?: Record<string, number>,
    toAddWeaponSmelting?: number,
    reuseDatas?: Record<string, number>,
  ) {
    let indexStr = index.toString();
    if (this.isDirty(indexStr)) {
      this.initAllData(indexStr);
    }
    let result: ProductResult;
    let data = this.dataMap[indexStr].allData!;
    let tempAllDate = undefined;
    if (extraData != undefined) {
      if (reuseDatas != undefined) {
        data = reuseDatas;
      } else {
        data = this.getAllData(indexStr, extraData, toAddWeaponSmelting);
        tempAllDate = data;
      }
    }
    let base = param.base;
    let extra = param.extra ?? 0;
    let rate = param.rate ?? 0;
    let rateAttach = param.rateAttach ?? [];
    let baseAttach = param.baseAttach ?? [];
    let originIndex = param.originIndex;
    //計算
    let product: number = 0;
    const productProcessFunc = this.createProcess(product);
    if (base != undefined && rate != undefined) {
      product += data[base] * rate;
      productProcessFunc(
        product,
        `${this.proximateVal(data[base])} ${this.times} ${this.proximateVal(rate)}`,
        '+',
      );
    }
    for (let i = 0; i < rateAttach.length; ++i) {
      let tempProductRateBaseProp = baseAttach[i];
      rateAttach[i].forEach((v) => {
        const tempfinalRateProcessFunc = this.createProcess(v);
        const temp_product_rate_value = v * data[tempProductRateBaseProp];
        tempfinalRateProcessFunc(
          temp_product_rate_value,
          data[tempProductRateBaseProp],
          '*',
          'start',
        );
        product += temp_product_rate_value;
        productProcessFunc(product, tempfinalRateProcessFunc()[1], '+');
      });
    }
    if (extra != undefined) {
      product += extra;
      productProcessFunc(product, extra, '+');
    }
    product = this.getFinalResCalQueueResult(data, product, param.finalResCalQueue);
    result = {
      calcProcessKeyMap: {
        product: ['productProcess'],
      },
      calcProcessValMap: {
        productProcess: productProcessFunc(),
      },
      tempAllDate,
      product: product,
      originIndex,
    };

    return result;
  }

  getSkillDmgValue(
    index: string | number,
    skill: string,
    valueIndexes: number[],
    overrideElement?: string,
    skillIndex?: number | string,
    onlyParam: boolean = false,
  ): [DamageResult[], DamageParam[]] {
    let indexStr = index.toString();
    let params: DamageParam[] = [];
    let results: DamageResult[] = [];

    if (
      [
        Const.NAME_SKILLS_NORMAL,
        Const.NAME_SKILLS_SKILL,
        Const.NAME_SKILLS_ELEMENTAL_BURST,
        Const.NAME_CONSTELLATION,
        Const.NAME_SKILLS_PROUD,
        Const.NAME_SKILLS_OTHER,
        Const.NAME_EFFECT,
        Const.NAME_SET,
      ].includes(skill)
    ) {
      let characterData = this.dataMap[indexStr].characterData;
      let weaponData = this.dataMap[indexStr].weaponData;
      let artifactSetId = this.artifactService.getStorageFullSetIndex(indexStr);
      let artifactSetData = this.artifactService.getSetData(artifactSetId);
      let extraCharacterData = this.extraDataService.getCharacter(indexStr);
      let extraWeaponData = this.extraDataService.getWeapon(weaponData!.id);
      let extraArtifactSetData = this.extraDataService.getArtifactSet(artifactSetId);
      let infos: ExtraSkillInfo[];
      let currentLevel: string;
      if (skill == Const.NAME_CONSTELLATION) {
        infos = extraCharacterData?.constellation![skillIndex as string] ?? [];
        currentLevel = Const.NAME_TALENT_DEFAULT_LEVEL;
      } else if (skill == Const.NAME_SKILLS_PROUD) {
        infos = extraCharacterData?.skills!.proudSkills[skillIndex as number] ?? [];
        currentLevel = Const.NAME_TALENT_DEFAULT_LEVEL;
      } else if (skill == Const.NAME_SKILLS_OTHER) {
        infos = extraCharacterData?.skills!.other ?? [];
        currentLevel = Const.NAME_TALENT_DEFAULT_LEVEL;
      } else if (skill == Const.NAME_EFFECT) {
        infos = extraWeaponData?.effect ?? [];
        currentLevel = this.getWeaponAffixLevel(index);
      } else if (skill == Const.NAME_SET) {
        infos = extraArtifactSetData
          ? (extraArtifactSetData[
              (Const.NAME_SET + skillIndex!.toString()) as keyof ExtraArtifact
            ] ?? [])
          : [];
        currentLevel = Const.NAME_NO_LEVEL;
      } else {
        infos =
          (extraCharacterData?.skills![skill as keyof ExtraCharacterSkills] as ExtraSkillInfo[]) ??
          [];
        currentLevel = this.getCharacterSkillLevel(indexStr, skill);
      }

      for (let info of infos) {
        //全含め必要
        let damageInfo = info.damage;
        let indexesAttach = damageInfo?.indexesAttach ?? [];
        let tempRateInfo: CharSkill;
        let rateAttach: number[][] = [];
        switch (skill) {
          case Const.NAME_CONSTELLATION:
            tempRateInfo = characterData!.skills.talents[parseInt(skillIndex as string)];
            indexesAttach.forEach((valueIndexes) => {
              let temp: number[] = [];
              valueIndexes.forEach((valueIndex) => {
                temp.push(tempRateInfo.paramMap[currentLevel!][valueIndex]);
              });
              rateAttach.push(temp);
            });
            break;
          case Const.NAME_SKILLS_PROUD:
            tempRateInfo = characterData!.skills.proudSkills[skillIndex as number];
            indexesAttach.forEach((valueIndexes) => {
              let temp: number[] = [];
              valueIndexes.forEach((valueIndex) => {
                temp.push(tempRateInfo.paramMap[currentLevel!][valueIndex]);
              });
              rateAttach.push(temp);
            });
            break;
          case Const.NAME_SKILLS_OTHER:
            tempRateInfo = characterData!.skills.other;
            indexesAttach.forEach((valueIndexes) => {
              let temp: number[] = [];
              valueIndexes.forEach((valueIndex) => {
                temp.push(tempRateInfo.paramMap[currentLevel!][valueIndex]);
              });
              rateAttach.push(temp);
            });
            break;
          case Const.NAME_EFFECT:
            indexesAttach.forEach((valueIndexes) => {
              let temp: number[] = [];
              valueIndexes.forEach((valueIndex) => {
                temp.push(weaponData!.skillAffixMap[currentLevel].paramList[valueIndex]);
              });
              rateAttach.push(temp);
            });
            break;
          case Const.NAME_SET:
            indexesAttach.forEach((valueIndexes) => {
              let temp: number[] = [];
              valueIndexes.forEach((valueIndex) => {
                temp.push(artifactSetData.setAffixs[1].paramList[valueIndex]);
              });
              rateAttach.push(temp);
            });
            break;
          default:
            tempRateInfo = characterData!.skills![skill as keyof CharSkills] as CharSkill;
            indexesAttach.forEach((valueIndexes) => {
              let temp: number[] = [];
              valueIndexes.forEach((valueIndex) => {
                temp.push(tempRateInfo.paramMap[currentLevel!][valueIndex]);
              });
              rateAttach.push(temp);
            });
            break;
        }
        if (damageInfo?.customValues) {
          for (let value of damageInfo.customValues) {
            if (damageInfo && damageInfo.indexes && !valueIndexes.includes(damageInfo.indexes[0])) {
              continue;
            }
            let base = damageInfo.base!;
            let baseAttach = damageInfo.baseAttach!;
            let attackBonusType = damageInfo.attackBonusType!;
            let elementBonusType = damageInfo.elementBonusType!;
            let rate = value;
            const originRateForAttach = rate;
            if (damageInfo.originSkills) {
              for (let i = 0; i < damageInfo.originSkills.length; ++i) {
                let originRateInfo = characterData!.skills![
                  damageInfo.originSkills[i] as keyof CharSkills
                ] as CharSkill;
                let originSkillLevel = this.getCharacterSkillLevel(
                  indexStr,
                  damageInfo.originSkills[i],
                );
                let originRate =
                  originRateInfo.paramMap[originSkillLevel][damageInfo.originIndexes![i]];
                switch (damageInfo.originRelations![i]) {
                  case '*':
                    rate *= originRate;
                    break;
                  case '+':
                    rate += originRate;
                    break;
                  case '-':
                    rate -= originRate;
                    break;
                  case '/':
                    rate /= originRate;
                    break;
                }
                //付属
                const originAttachSkills = damageInfo.originAttachSkills ?? [];
                originAttachSkills.forEach(
                  (attachSkills: TYPE_SKILL[], attachSkillsIndex: number) => {
                    const attachIndexes = damageInfo!.originAttachIndexes![attachSkillsIndex];
                    let temp: number[] = [];
                    attachSkills.forEach((attachSkill: TYPE_SKILL) => {
                      const originAttachRateInfo = characterData!.skills![
                        attachSkill as keyof CharSkills
                      ] as CharSkill;
                      const originAttachSkillLevel = this.getCharacterSkillLevel(
                        indexStr,
                        attachSkill,
                      );
                      let originAttachRate =
                        originAttachRateInfo.paramMap[originAttachSkillLevel][attachIndexes![i]];
                      switch (damageInfo!.originRelations![i]) {
                        case '*':
                          originAttachRate *= originRateForAttach;
                          break;
                        case '+':
                          originAttachRate += originRateForAttach;
                          break;
                        case '-':
                          originAttachRate -= originRateForAttach;
                          break;
                        case '/':
                          originAttachRate /= originRateForAttach;
                          break;
                      }
                      temp.push(originAttachRate);
                    });
                    rateAttach.push(temp);
                  },
                );
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
              isAbsoluteDmg: damageInfo.isAbsoluteDmg,
              specialDamageType: damageInfo.specialDamageType,
              finalResCalQueue: damageInfo.finalResCalQueue,
              displayCalQueue: damageInfo.displayCalQueue,
              originIndex: damageInfo.originSkills
                ? damageInfo.originIndexes![0]
                : damageInfo?.customValues
                  ? -1
                  : undefined,
            });
          }
        } else {
          for (let valueIndex of valueIndexes) {
            if (damageInfo && damageInfo.indexes && damageInfo.indexes.includes(valueIndex)) {
              let rateInfo: CharSkill;
              let rate: number;
              if (skill == Const.NAME_CONSTELLATION) {
                rateInfo = characterData!.skills.talents[parseInt(skillIndex as string)];
                rate = rateInfo.paramMap[currentLevel!][valueIndex];
              } else if (skill == Const.NAME_SKILLS_PROUD) {
                rateInfo = characterData!.skills.proudSkills[skillIndex as number];
                rate = rateInfo.paramMap[currentLevel!][valueIndex];
              } else if (skill == Const.NAME_SKILLS_OTHER) {
                rateInfo = characterData!.skills.other;
                rate = rateInfo.paramMap[currentLevel!][valueIndex];
              } else if (skill == Const.NAME_EFFECT) {
                rate = weaponData!.skillAffixMap[currentLevel].paramList[valueIndex];
              } else if (skill == Const.NAME_SET) {
                rate = artifactSetData.setAffixs[1].paramList[valueIndex];
              } else {
                rateInfo = characterData!.skills![skill as keyof CharSkills] as CharSkill;
                rate = rateInfo.paramMap[currentLevel!][valueIndex];
              }
              const originRateForAttach = rate;
              if (damageInfo.originSkills) {
                for (let i = 0; i < damageInfo.originSkills.length; ++i) {
                  let originRateInfo = characterData!.skills![
                    damageInfo.originSkills[i] as keyof CharSkills
                  ] as CharSkill;
                  let originSkillLevel = this.getCharacterSkillLevel(
                    indexStr,
                    damageInfo.originSkills[i],
                  );
                  let originRate =
                    originRateInfo.paramMap[originSkillLevel][damageInfo.originIndexes![i]];
                  switch (damageInfo.originRelations![i]) {
                    case '*':
                      rate *= originRate;
                      break;
                    case '+':
                      rate += originRate;
                      break;
                    case '-':
                      rate -= originRate;
                      break;
                    case '/':
                      rate /= originRate;
                      break;
                  }
                  //付属
                  const originAttachSkills = damageInfo.originAttachSkills ?? [];
                  originAttachSkills.forEach(
                    (attachSkills: TYPE_SKILL[], attachSkillsIndex: number) => {
                      const attachIndexes = damageInfo!.originAttachIndexes![attachSkillsIndex];
                      let temp: number[] = [];
                      attachSkills.forEach((attachSkill: TYPE_SKILL) => {
                        const originAttachRateInfo = characterData!.skills![
                          attachSkill as keyof CharSkills
                        ] as CharSkill;
                        const originAttachSkillLevel = this.getCharacterSkillLevel(
                          indexStr,
                          attachSkill,
                        );
                        let originAttachRate =
                          originAttachRateInfo.paramMap[originAttachSkillLevel][attachIndexes![i]];
                        switch (damageInfo!.originRelations![i]) {
                          case '*':
                            originAttachRate *= originRateForAttach;
                            break;
                          case '+':
                            originAttachRate += originRateForAttach;
                            break;
                          case '-':
                            originAttachRate -= originRateForAttach;
                            break;
                          case '/':
                            originAttachRate /= originRateForAttach;
                            break;
                        }
                        temp.push(originAttachRate);
                      });
                      rateAttach.push(temp);
                    },
                  );
                }
              }
              let base = damageInfo.base!;
              let baseAttach = damageInfo.baseAttach!;
              let attackBonusType = damageInfo.attackBonusType!;
              let elementBonusType = damageInfo.elementBonusType!;
              if (damageInfo?.canOverride && overrideElement) {
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
                isAbsoluteDmg: damageInfo.isAbsoluteDmg,
                specialDamageType: damageInfo.specialDamageType,
                finalResCalQueue: damageInfo.finalResCalQueue,
                displayCalQueue: damageInfo.displayCalQueue,
                originIndex: damageInfo.originSkills ? damageInfo.originIndexes![0] : valueIndex,
              });
            }
          }
        }
      }
    }

    if (!onlyParam) {
      for (let param of params) {
        results.push(this.getDamage(indexStr, param));
      }
    }

    return [results, params];
  }

  getSkillHealingValue(
    index: string | number,
    skill: string,
    valueIndexes: number[],
    skillIndex?: number | string,
  ): [HealingResult[], HealingParam[]] {
    let indexStr = index.toString();
    let params: HealingParam[] = [];
    let results: HealingResult[] = [];

    if (
      [
        Const.NAME_SKILLS_NORMAL,
        Const.NAME_SKILLS_SKILL,
        Const.NAME_SKILLS_ELEMENTAL_BURST,
        Const.NAME_CONSTELLATION,
        Const.NAME_SKILLS_PROUD,
        Const.NAME_SKILLS_OTHER,
        Const.NAME_EFFECT,
        Const.NAME_SET,
      ].includes(skill)
    ) {
      let characterData = this.dataMap[indexStr].characterData;
      let weaponData = this.dataMap[indexStr].weaponData;
      let artifactSetId = this.artifactService.getStorageFullSetIndex(indexStr);
      let artifactSetData = this.artifactService.getSetData(artifactSetId);
      let extraCharacterData = this.extraDataService.getCharacter(indexStr);
      let extraWeaponData = this.extraDataService.getWeapon(weaponData!.id);
      let extraArtifactSetData = this.extraDataService.getArtifactSet(artifactSetId);
      let infos: ExtraSkillInfo[];
      let currentLevel: string;
      if (skill == Const.NAME_CONSTELLATION) {
        infos = extraCharacterData?.constellation![skillIndex as string] ?? [];
        currentLevel = Const.NAME_TALENT_DEFAULT_LEVEL;
      } else if (skill == Const.NAME_SKILLS_PROUD) {
        infos = extraCharacterData?.skills!.proudSkills[skillIndex as number] ?? [];
        currentLevel = Const.NAME_TALENT_DEFAULT_LEVEL;
      } else if (skill == Const.NAME_SKILLS_OTHER) {
        infos = extraCharacterData?.skills!.other ?? [];
        currentLevel = Const.NAME_TALENT_DEFAULT_LEVEL;
      } else if (skill == Const.NAME_EFFECT) {
        infos = extraWeaponData?.effect ?? [];
        currentLevel = this.getWeaponAffixLevel(index);
      } else if (skill == Const.NAME_SET) {
        infos = extraArtifactSetData
          ? (extraArtifactSetData[
              (Const.NAME_SET + skillIndex!.toString()) as keyof ExtraArtifact
            ] ?? [])
          : [];
        currentLevel = Const.NAME_NO_LEVEL;
      } else {
        infos =
          (extraCharacterData?.skills![skill as keyof ExtraCharacterSkills] as ExtraSkillInfo[]) ??
          [];
        currentLevel = this.getCharacterSkillLevel(indexStr, skill);
      }

      for (let info of infos) {
        //全含め必要
        let healingInfo = info.healing;
        let indexesAttach = healingInfo?.indexesAttach ?? [];
        let tempRateInfo: CharSkill;
        let rateAttach: number[][] = [];
        let baseAttach = healingInfo?.baseAttach;
        switch (skill) {
          case Const.NAME_CONSTELLATION:
            tempRateInfo = characterData!.skills.talents[parseInt(skillIndex as string)];
            indexesAttach.forEach((valueIndexes) => {
              let temp: number[] = [];
              valueIndexes.forEach((valueIndex) => {
                temp.push(tempRateInfo.paramMap[currentLevel!][valueIndex]);
              });
              rateAttach.push(temp);
            });
            break;
          case Const.NAME_SKILLS_PROUD:
            tempRateInfo = characterData!.skills.proudSkills[skillIndex as number];
            indexesAttach.forEach((valueIndexes) => {
              let temp: number[] = [];
              valueIndexes.forEach((valueIndex) => {
                temp.push(tempRateInfo.paramMap[currentLevel!][valueIndex]);
              });
              rateAttach.push(temp);
            });
            break;
          case Const.NAME_SKILLS_OTHER:
            tempRateInfo = characterData!.skills.other;
            indexesAttach.forEach((valueIndexes) => {
              let temp: number[] = [];
              valueIndexes.forEach((valueIndex) => {
                temp.push(tempRateInfo.paramMap[currentLevel!][valueIndex]);
              });
              rateAttach.push(temp);
            });
            break;
          case Const.NAME_EFFECT:
            indexesAttach.forEach((valueIndexes) => {
              let temp: number[] = [];
              valueIndexes.forEach((valueIndex) => {
                temp.push(weaponData!.skillAffixMap[currentLevel].paramList[valueIndex]);
              });
              rateAttach.push(temp);
            });
            break;
          case Const.NAME_SET:
            indexesAttach.forEach((valueIndexes) => {
              let temp: number[] = [];
              valueIndexes.forEach((valueIndex) => {
                temp.push(artifactSetData.setAffixs[1].paramList[valueIndex]);
              });
              rateAttach.push(temp);
            });
            break;
          default:
            tempRateInfo = characterData!.skills![skill as keyof CharSkills] as CharSkill;
            indexesAttach.forEach((valueIndexes) => {
              let temp: number[] = [];
              valueIndexes.forEach((valueIndex) => {
                temp.push(tempRateInfo.paramMap[currentLevel!][valueIndex]);
              });
              rateAttach.push(temp);
            });
            break;
        }

        if (healingInfo?.customValue != undefined) {
          let base = healingInfo.base!;
          let healingBonusType = healingInfo.healingBonusType;
          let rate = healingInfo.customValue;
          params.push({
            base: base,
            rate: rate,
            baseAttach: baseAttach,
            rateAttach: rateAttach,
            healingBonusType: healingBonusType,
            finalResCalQueue: healingInfo.finalResCalQueue,
            originIndex: healingInfo.originSkills
              ? healingInfo.originIndexes![0]
              : healingInfo?.customValue
                ? -1
                : undefined,
          });
        } else {
          for (let valueIndex of valueIndexes) {
            if (healingInfo && healingInfo.index != undefined && healingInfo.index == valueIndex) {
              let rateInfo: CharSkill;
              let rate: number;
              let extra: number;
              if (skill == Const.NAME_CONSTELLATION) {
                rateInfo = characterData!.skills.talents[parseInt(skillIndex as string)];
                rate = rateInfo.paramMap[currentLevel!][valueIndex];
                extra =
                  healingInfo.constIndex != undefined
                    ? rateInfo.paramMap[currentLevel!][healingInfo.constIndex]
                    : 0;
              } else if (skill == Const.NAME_SKILLS_PROUD) {
                rateInfo = characterData!.skills.proudSkills[skillIndex as number];
                rate = rateInfo.paramMap[currentLevel!][valueIndex];
                extra =
                  healingInfo.constIndex != undefined
                    ? rateInfo.paramMap[currentLevel!][healingInfo.constIndex]
                    : 0;
              } else if (skill == Const.NAME_SKILLS_OTHER) {
                rateInfo = characterData!.skills.other;
                rate = rateInfo.paramMap[currentLevel!][valueIndex];
                extra =
                  healingInfo.constIndex != undefined
                    ? rateInfo.paramMap[currentLevel!][healingInfo.constIndex]
                    : 0;
              } else if (skill == Const.NAME_EFFECT) {
                rate = weaponData!.skillAffixMap[currentLevel].paramList[valueIndex];
                extra =
                  healingInfo.constIndex != undefined
                    ? weaponData!.skillAffixMap[currentLevel].paramList[healingInfo.constIndex]
                    : 0;
              } else if (skill == Const.NAME_SET) {
                rate = artifactSetData.setAffixs[1].paramList[valueIndex];
                extra =
                  healingInfo.constIndex != undefined
                    ? artifactSetData.setAffixs[1].paramList[healingInfo.constIndex]
                    : 0;
              } else {
                rateInfo = characterData!.skills![skill as keyof CharSkills] as CharSkill;
                rate = rateInfo.paramMap[currentLevel!][valueIndex];
                extra =
                  healingInfo.constIndex != undefined
                    ? rateInfo.paramMap[currentLevel!][healingInfo.constIndex]
                    : 0;
              }
              let base = healingInfo.base!;
              let healingBonusType = healingInfo.healingBonusType;
              if (healingInfo.constIndex != undefined) {
                switch (healingInfo.constCalRelation) {
                  case '-':
                    extra *= -1;
                    break;
                }
              }
              if (healingInfo.originSkills) {
                const tempRate = rate;
                for (let i = 0; i < healingInfo.originSkills.length; ++i) {
                  let originRateInfo = characterData!.skills![
                    healingInfo.originSkills[i] as keyof CharSkills
                  ] as CharSkill;
                  let originSkillLevel = this.getCharacterSkillLevel(
                    indexStr,
                    healingInfo.originSkills[i],
                  );
                  let originRate =
                    originRateInfo.paramMap[originSkillLevel][healingInfo.originIndexes![i]];
                  switch (healingInfo.originRelations![i]) {
                    case '*':
                      rate *= originRate;
                      break;
                    case '+':
                      rate += originRate;
                      break;
                    case '-':
                      rate -= originRate;
                      break;
                    case '/':
                      rate /= originRate;
                      break;
                  }

                  let tempExtra = 0;
                  let originConstVal =
                    originRateInfo.paramMap[originSkillLevel][healingInfo.originConstIndexes![i]];
                  switch (healingInfo.originConstRelations![i]) {
                    case '*':
                      tempExtra = tempRate * originConstVal;
                      break;
                    case '+':
                      tempExtra = tempRate + originConstVal;
                      break;
                    case '-':
                      tempExtra = tempRate - originConstVal;
                      break;
                    case '/':
                      tempExtra = tempRate / originConstVal;
                      break;
                  }

                  switch (healingInfo.originInnerRelations![i]) {
                    case '+':
                      extra += tempExtra;
                      break;
                    case '-':
                      extra -= tempExtra;
                      break;
                  }
                }
              }
              params.push({
                base: base,
                rate: rate,
                baseAttach: baseAttach,
                rateAttach: rateAttach,
                extra: extra,
                healingBonusType: healingBonusType,
                finalResCalQueue: healingInfo.finalResCalQueue,
                originIndex: healingInfo.originSkills ? healingInfo.originIndexes![0] : valueIndex,
              });
            }
          }
        }
      }
    }

    for (let param of params) {
      results.push(this.getHealing(indexStr, param));
    }

    return [results, params];
  }

  getSkillShieldValue(
    index: string | number,
    skill: string,
    valueIndexes: number[],
    skillIndex?: number | string,
  ): [ShieldResult[], ShieldParam[]] {
    let indexStr = index.toString();
    let params: ShieldParam[] = [];
    let results: ShieldResult[] = [];

    if (
      [
        Const.NAME_SKILLS_NORMAL,
        Const.NAME_SKILLS_SKILL,
        Const.NAME_SKILLS_ELEMENTAL_BURST,
        Const.NAME_CONSTELLATION,
        Const.NAME_SKILLS_PROUD,
        Const.NAME_SKILLS_OTHER,
        Const.NAME_EFFECT,
        Const.NAME_SET,
      ].includes(skill)
    ) {
      let characterData = this.dataMap[indexStr].characterData;
      let weaponData = this.dataMap[indexStr].weaponData;
      let artifactSetId = this.artifactService.getStorageFullSetIndex(indexStr);
      let artifactSetData = this.artifactService.getSetData(artifactSetId);
      let extraCharacterData = this.extraDataService.getCharacter(indexStr);
      let extraWeaponData = this.extraDataService.getWeapon(weaponData!.id);
      let extraArtifactSetData = this.extraDataService.getArtifactSet(artifactSetId);
      let infos: ExtraSkillInfo[];
      let currentLevel: string;
      if (skill == Const.NAME_CONSTELLATION) {
        infos = extraCharacterData?.constellation![skillIndex as string] ?? [];
        currentLevel = Const.NAME_TALENT_DEFAULT_LEVEL;
      } else if (skill == Const.NAME_SKILLS_PROUD) {
        infos = extraCharacterData?.skills!.proudSkills[skillIndex as number] ?? [];
        currentLevel = Const.NAME_TALENT_DEFAULT_LEVEL;
      } else if (skill == Const.NAME_SKILLS_OTHER) {
        infos = extraCharacterData?.skills!.other!;
        currentLevel = Const.NAME_TALENT_DEFAULT_LEVEL;
      } else if (skill == Const.NAME_EFFECT) {
        infos = extraWeaponData?.effect ?? [];
        currentLevel = this.getWeaponAffixLevel(index);
      } else if (skill == Const.NAME_SET) {
        infos = extraArtifactSetData
          ? (extraArtifactSetData[
              (Const.NAME_SET + skillIndex!.toString()) as keyof ExtraArtifact
            ] ?? [])
          : [];
        currentLevel = Const.NAME_NO_LEVEL;
      } else {
        infos =
          (extraCharacterData?.skills![skill as keyof ExtraCharacterSkills] as ExtraSkillInfo[]) ??
          [];
        currentLevel = this.getCharacterSkillLevel(indexStr, skill);
      }

      for (let info of infos) {
        //全含め必要
        let shieldInfo = info.shield;
        let indexesAttach = shieldInfo?.indexesAttach ?? [];
        let tempRateInfo: CharSkill;
        let rateAttach: number[][] = [];
        let baseAttach = shieldInfo?.baseAttach;
        switch (skill) {
          case Const.NAME_CONSTELLATION:
            tempRateInfo = characterData!.skills.talents[parseInt(skillIndex as string)];
            indexesAttach.forEach((valueIndexes) => {
              let temp: number[] = [];
              valueIndexes.forEach((valueIndex) => {
                temp.push(tempRateInfo.paramMap[currentLevel!][valueIndex]);
              });
              rateAttach.push(temp);
            });
            break;
          case Const.NAME_SKILLS_PROUD:
            tempRateInfo = characterData!.skills.proudSkills[skillIndex as number];
            indexesAttach.forEach((valueIndexes) => {
              let temp: number[] = [];
              valueIndexes.forEach((valueIndex) => {
                temp.push(tempRateInfo.paramMap[currentLevel!][valueIndex]);
              });
              rateAttach.push(temp);
            });
            break;
          case Const.NAME_SKILLS_OTHER:
            tempRateInfo = characterData!.skills.other;
            indexesAttach.forEach((valueIndexes) => {
              let temp: number[] = [];
              valueIndexes.forEach((valueIndex) => {
                temp.push(tempRateInfo.paramMap[currentLevel!][valueIndex]);
              });
              rateAttach.push(temp);
            });
            break;
          case Const.NAME_EFFECT:
            indexesAttach.forEach((valueIndexes) => {
              let temp: number[] = [];
              valueIndexes.forEach((valueIndex) => {
                temp.push(weaponData!.skillAffixMap[currentLevel].paramList[valueIndex]);
              });
              rateAttach.push(temp);
            });
            break;
          case Const.NAME_SET:
            indexesAttach.forEach((valueIndexes) => {
              let temp: number[] = [];
              valueIndexes.forEach((valueIndex) => {
                temp.push(artifactSetData.setAffixs[1].paramList[valueIndex]);
              });
              rateAttach.push(temp);
            });
            break;
          default:
            tempRateInfo = characterData!.skills![skill as keyof CharSkills] as CharSkill;
            indexesAttach.forEach((valueIndexes) => {
              let temp: number[] = [];
              valueIndexes.forEach((valueIndex) => {
                temp.push(tempRateInfo.paramMap[currentLevel!][valueIndex]);
              });
              rateAttach.push(temp);
            });
            break;
        }

        if (shieldInfo?.customValue != undefined) {
          let base = shieldInfo.base!;
          let rate = shieldInfo.customValue;
          let shieldBonusType = shieldInfo.shieldBonusType;
          let shieldElementType = shieldInfo.shieldElementType;
          params.push({
            base: base,
            rate: rate,
            baseAttach: baseAttach,
            rateAttach: rateAttach,
            shieldBonusType: shieldBonusType,
            shieldElementType: shieldElementType,
            finalResCalQueue: shieldInfo.finalResCalQueue,
            originIndex: shieldInfo.originSkills
              ? shieldInfo.originIndexes![0]
              : shieldInfo?.customValue
                ? -1
                : undefined,
          });
        } else {
          for (let valueIndex of valueIndexes) {
            if (shieldInfo && shieldInfo.index != undefined && shieldInfo.index == valueIndex) {
              let rateInfo: CharSkill;
              let rate: number;
              let extra: number;
              if (skill == Const.NAME_CONSTELLATION) {
                rateInfo = characterData!.skills.talents[parseInt(skillIndex as string)];
                rate = rateInfo.paramMap[currentLevel!][valueIndex];
                extra =
                  shieldInfo.constIndex != undefined
                    ? rateInfo.paramMap[currentLevel!][shieldInfo.constIndex]
                    : 0;
              } else if (skill == Const.NAME_SKILLS_PROUD) {
                rateInfo = characterData!.skills.proudSkills[skillIndex as number];
                rate = rateInfo.paramMap[currentLevel!][valueIndex];
                extra =
                  shieldInfo.constIndex != undefined
                    ? rateInfo.paramMap[currentLevel!][shieldInfo.constIndex]
                    : 0;
              } else if (skill == Const.NAME_SKILLS_OTHER) {
                rateInfo = characterData!.skills.other;
                rate = rateInfo.paramMap[currentLevel!][valueIndex];
                extra =
                  shieldInfo.constIndex != undefined
                    ? rateInfo.paramMap[currentLevel!][shieldInfo.constIndex]
                    : 0;
              } else if (skill == Const.NAME_EFFECT) {
                rate = weaponData!.skillAffixMap[currentLevel].paramList[valueIndex];
                extra =
                  shieldInfo.constIndex != undefined
                    ? weaponData!.skillAffixMap[currentLevel].paramList[shieldInfo.constIndex]
                    : 0;
              } else if (skill == Const.NAME_SET) {
                rate = artifactSetData.setAffixs[1].paramList[valueIndex];
                extra =
                  shieldInfo.constIndex != undefined
                    ? artifactSetData.setAffixs[1].paramList[shieldInfo.constIndex]
                    : 0;
              } else {
                rateInfo = characterData!.skills![skill as keyof CharSkills] as CharSkill;
                rate = rateInfo.paramMap[currentLevel!][valueIndex];
                extra =
                  shieldInfo.constIndex != undefined
                    ? rateInfo.paramMap[currentLevel!][shieldInfo.constIndex]
                    : 0;
              }

              let base = shieldInfo.base!;
              let shieldBonusType = shieldInfo.shieldBonusType;
              let shieldElementType = shieldInfo.shieldElementType;
              if (shieldInfo.constIndex != undefined) {
                switch (shieldInfo.constCalRelation) {
                  case '-':
                    extra *= -1;
                    break;
                }
              }
              if (shieldInfo.originSkills) {
                const tempRate = rate;
                for (let i = 0; i < shieldInfo.originSkills.length; ++i) {
                  let originRateInfo = characterData!.skills![
                    shieldInfo.originSkills[i] as keyof CharSkills
                  ] as CharSkill;
                  let originSkillLevel = this.getCharacterSkillLevel(
                    indexStr,
                    shieldInfo.originSkills[i],
                  );
                  let originRate =
                    originRateInfo.paramMap[originSkillLevel][shieldInfo.originIndexes![i]];
                  switch (shieldInfo.originRelations![i]) {
                    case '*':
                      rate *= originRate;
                      break;
                    case '+':
                      rate += originRate;
                      break;
                    case '-':
                      rate -= originRate;
                      break;
                    case '/':
                      rate /= originRate;
                      break;
                  }

                  let tempExtra = 0;
                  let originConstVal =
                    originRateInfo.paramMap[originSkillLevel][shieldInfo.originConstIndexes![i]];
                  switch (shieldInfo.originConstRelations![i]) {
                    case '*':
                      tempExtra = tempRate * originConstVal;
                      break;
                    case '+':
                      tempExtra = tempRate + originConstVal;
                      break;
                    case '-':
                      tempExtra = tempRate - originConstVal;
                      break;
                    case '/':
                      tempExtra = tempRate / originConstVal;
                      break;
                  }

                  switch (shieldInfo.originInnerRelations![i]) {
                    case '+':
                      extra += tempExtra;
                      break;
                    case '-':
                      extra -= tempExtra;
                      break;
                  }
                }
              }
              params.push({
                base: base,
                rate: rate,
                baseAttach: baseAttach,
                rateAttach: rateAttach,
                extra: extra,
                shieldBonusType: shieldBonusType,
                shieldElementType: shieldElementType,
                finalResCalQueue: shieldInfo.finalResCalQueue,
                originIndex: shieldInfo.originSkills ? shieldInfo.originIndexes![0] : valueIndex,
              });
            }
          }
        }
      }
    }

    for (let param of params) {
      results.push(this.getShield(indexStr, param));
    }

    return [results, params];
  }

  getSkillProductHpValue(
    index: string | number,
    skill: string,
    valueIndexes: number[],
    skillIndex?: number | string,
  ): [ProductResult[], ProductParam[]] {
    let indexStr = index.toString();
    let params: ProductParam[] = [];
    let results: ProductResult[] = [];

    if (
      [
        Const.NAME_SKILLS_NORMAL,
        Const.NAME_SKILLS_SKILL,
        Const.NAME_SKILLS_ELEMENTAL_BURST,
        Const.NAME_CONSTELLATION,
        Const.NAME_SKILLS_PROUD,
        Const.NAME_SKILLS_OTHER,
        Const.NAME_EFFECT,
        Const.NAME_SET,
      ].includes(skill)
    ) {
      let characterData = this.dataMap[indexStr].characterData;
      let weaponData = this.dataMap[indexStr].weaponData;
      let artifactSetId = this.artifactService.getStorageFullSetIndex(indexStr);
      let artifactSetData = this.artifactService.getSetData(artifactSetId);
      let extraCharacterData = this.extraDataService.getCharacter(indexStr);
      let extraWeaponData = this.extraDataService.getWeapon(weaponData!.id);
      let extraArtifactSetData = this.extraDataService.getArtifactSet(artifactSetId);
      let infos: ExtraSkillInfo[];
      let currentLevel: string;
      if (skill == Const.NAME_CONSTELLATION) {
        infos = extraCharacterData?.constellation![skillIndex as string] ?? [];
        currentLevel = Const.NAME_TALENT_DEFAULT_LEVEL;
      } else if (skill == Const.NAME_SKILLS_PROUD) {
        infos = extraCharacterData?.skills!.proudSkills[skillIndex as number] ?? [];
        currentLevel = Const.NAME_TALENT_DEFAULT_LEVEL;
      } else if (skill == Const.NAME_SKILLS_OTHER) {
        infos = extraCharacterData?.skills!.other ?? [];
        currentLevel = Const.NAME_TALENT_DEFAULT_LEVEL;
      } else if (skill == Const.NAME_EFFECT) {
        infos = extraWeaponData?.effect ?? [];
        currentLevel = this.getWeaponAffixLevel(index);
      } else if (skill == Const.NAME_SET) {
        infos = extraArtifactSetData
          ? (extraArtifactSetData[
              (Const.NAME_SET + skillIndex!.toString()) as keyof ExtraArtifact
            ] ?? [])
          : [];
        currentLevel = Const.NAME_NO_LEVEL;
      } else {
        infos =
          (extraCharacterData?.skills![skill as keyof ExtraCharacterSkills] as ExtraSkillInfo[]) ??
          [];
        currentLevel = this.getCharacterSkillLevel(indexStr, skill);
      }

      for (let info of infos) {
        //全含め必要
        let productHpInfo = info.product;
        let indexesAttach = productHpInfo?.indexesAttach ?? [];
        let tempRateInfo: CharSkill;
        let rateAttach: number[][] = [];
        let baseAttach = productHpInfo?.baseAttach;
        switch (skill) {
          case Const.NAME_CONSTELLATION:
            tempRateInfo = characterData!.skills.talents[parseInt(skillIndex as string)];
            indexesAttach.forEach((valueIndexes) => {
              let temp: number[] = [];
              valueIndexes.forEach((valueIndex) => {
                temp.push(tempRateInfo.paramMap[currentLevel!][valueIndex]);
              });
              rateAttach.push(temp);
            });
            break;
          case Const.NAME_SKILLS_PROUD:
            tempRateInfo = characterData!.skills.proudSkills[skillIndex as number];
            indexesAttach.forEach((valueIndexes) => {
              let temp: number[] = [];
              valueIndexes.forEach((valueIndex) => {
                temp.push(tempRateInfo.paramMap[currentLevel!][valueIndex]);
              });
              rateAttach.push(temp);
            });
            break;
          case Const.NAME_SKILLS_OTHER:
            tempRateInfo = characterData!.skills.other;
            indexesAttach.forEach((valueIndexes) => {
              let temp: number[] = [];
              valueIndexes.forEach((valueIndex) => {
                temp.push(tempRateInfo.paramMap[currentLevel!][valueIndex]);
              });
              rateAttach.push(temp);
            });
            break;
          case Const.NAME_EFFECT:
            indexesAttach.forEach((valueIndexes) => {
              let temp: number[] = [];
              valueIndexes.forEach((valueIndex) => {
                temp.push(weaponData!.skillAffixMap[currentLevel].paramList[valueIndex]);
              });
              rateAttach.push(temp);
            });
            break;
          case Const.NAME_SET:
            indexesAttach.forEach((valueIndexes) => {
              let temp: number[] = [];
              valueIndexes.forEach((valueIndex) => {
                temp.push(artifactSetData.setAffixs[1].paramList[valueIndex]);
              });
              rateAttach.push(temp);
            });
            break;
          default:
            tempRateInfo = characterData!.skills![skill as keyof CharSkills] as CharSkill;
            indexesAttach.forEach((valueIndexes) => {
              let temp: number[] = [];
              valueIndexes.forEach((valueIndex) => {
                temp.push(tempRateInfo.paramMap[currentLevel!][valueIndex]);
              });
              rateAttach.push(temp);
            });
            break;
        }

        if (productHpInfo?.customValue != undefined) {
          let base = productHpInfo.base!;
          let rate = productHpInfo.customValue;
          params.push({
            base: base,
            rate: rate,
            baseAttach: baseAttach,
            rateAttach: rateAttach,
            finalResCalQueue: productHpInfo.finalResCalQueue,
            originIndex: -1,
          });
        } else {
          for (let valueIndex of valueIndexes) {
            if (
              productHpInfo &&
              productHpInfo.index != undefined &&
              productHpInfo.index == valueIndex
            ) {
              let rateInfo: CharSkill;
              let rate: number;
              let extra: number;
              if (skill == Const.NAME_CONSTELLATION) {
                rateInfo = characterData!.skills.talents[parseInt(skillIndex as string)];
                rate = rateInfo.paramMap[currentLevel!][valueIndex];
                extra =
                  productHpInfo.constIndex != undefined
                    ? rateInfo.paramMap[currentLevel!][valueIndex]
                    : 0;
              } else if (skill == Const.NAME_SKILLS_PROUD) {
                rateInfo = characterData!.skills.proudSkills[skillIndex as number];
                rate = rateInfo.paramMap[currentLevel!][valueIndex];
                extra =
                  productHpInfo.constIndex != undefined
                    ? rateInfo.paramMap[currentLevel!][valueIndex]
                    : 0;
              } else if (skill == Const.NAME_SKILLS_OTHER) {
                rateInfo = characterData!.skills.other;
                rate = rateInfo.paramMap[currentLevel!][valueIndex];
                extra =
                  productHpInfo.constIndex != undefined
                    ? rateInfo.paramMap[currentLevel!][valueIndex]
                    : 0;
              } else if (skill == Const.NAME_EFFECT) {
                rate = weaponData!.skillAffixMap[currentLevel].paramList[valueIndex];
                extra =
                  productHpInfo.constIndex != undefined
                    ? weaponData!.skillAffixMap[currentLevel].paramList[productHpInfo.constIndex]
                    : 0;
              } else if (skill == Const.NAME_SET) {
                rate = artifactSetData.setAffixs[1].paramList[valueIndex];
                extra =
                  productHpInfo.constIndex != undefined
                    ? artifactSetData.setAffixs[1].paramList[productHpInfo.constIndex]
                    : 0;
              } else {
                rateInfo = characterData!.skills![skill as keyof CharSkills] as CharSkill;
                rate = rateInfo.paramMap[currentLevel!][valueIndex];
                extra =
                  productHpInfo.constIndex != undefined
                    ? rateInfo.paramMap[currentLevel!][valueIndex]
                    : 0;
              }
              let base = productHpInfo.base!;
              if (productHpInfo.constIndex != undefined) {
                switch (productHpInfo.constCalRelation) {
                  case '-':
                    extra *= -1;
                    break;
                }
              }
              params.push({
                base: base,
                rate: rate,
                baseAttach: baseAttach,
                rateAttach: rateAttach,
                extra: extra,
                finalResCalQueue: productHpInfo.finalResCalQueue,
                originIndex: valueIndex,
              });
            }
          }
        }
      }
    }

    for (let param of params) {
      results.push(this.getProductHp(indexStr, param));
    }

    return [results, params];
  }

  getSkillBuffValue(
    index: string | number,
    skill: string,
    skillIndex?: number | string,
    valueIndexes?: number[],
  ) {
    let indexStr = index.toString();
    let results: BuffResult[] = [];

    if (
      [
        Const.NAME_SKILLS_NORMAL,
        Const.NAME_SKILLS_SKILL,
        Const.NAME_SKILLS_ELEMENTAL_BURST,
        Const.NAME_CONSTELLATION,
        Const.NAME_SKILLS_PROUD,
        Const.NAME_SKILLS_OTHER,
        Const.NAME_EFFECT,
        Const.NAME_SET,
      ].includes(skill)
    ) {
      let characterData = this.dataMap[indexStr].characterData;
      let weaponData = this.dataMap[indexStr].weaponData;
      let artifactSetIds = this.artifactService.getStorageSetIndexes(indexStr);
      let artifactFullSetId = this.artifactService.getStorageFullSetIndex(indexStr);
      let currentartifactSetId = artifactFullSetId;
      let isFullSet = true;
      if (
        skill == Const.NAME_SET &&
        artifactSetIds != undefined &&
        artifactFullSetId != undefined &&
        skillIndex != undefined &&
        artifactFullSetId.length < 1
      ) {
        currentartifactSetId = artifactSetIds[(skillIndex as number) - 1];
        isFullSet = false;
      }
      let artifactSetData = this.artifactService.getSetData(currentartifactSetId);
      let extraCharacterData = this.extraDataService.getCharacter(indexStr);
      let extraWeaponData = this.extraDataService.getWeapon(weaponData!.id);
      let extraArtifactSetData = this.extraDataService.getArtifactSet(currentartifactSetId);
      let infos: ExtraSkillInfo[];
      let currentLevel: string;
      if (skill == Const.NAME_CONSTELLATION) {
        infos = extraCharacterData?.constellation![skillIndex as string] ?? [];
        currentLevel = Const.NAME_TALENT_DEFAULT_LEVEL;
      } else if (skill == Const.NAME_SKILLS_PROUD) {
        infos = extraCharacterData?.skills!.proudSkills[skillIndex as number] ?? [];
        currentLevel = Const.NAME_TALENT_DEFAULT_LEVEL;
      } else if (skill == Const.NAME_SKILLS_OTHER) {
        infos = extraCharacterData?.skills!.other ?? [];
        currentLevel = Const.NAME_TALENT_DEFAULT_LEVEL;
      } else if (skill == Const.NAME_EFFECT) {
        infos = extraWeaponData?.effect ?? [];
        currentLevel = this.getWeaponAffixLevel(index);
      } else if (skill == Const.NAME_SET) {
        infos = extraArtifactSetData
          ? (extraArtifactSetData[
              (Const.NAME_SET + (isFullSet ? skillIndex!.toString() : '1')) as keyof ExtraArtifact
            ] ?? [])
          : [];
        currentLevel = Const.NAME_NO_LEVEL;
      } else {
        infos =
          (extraCharacterData?.skills![skill as keyof ExtraCharacterSkills] as ExtraSkillInfo[]) ??
          [];
        currentLevel = this.getCharacterSkillLevel(indexStr, skill);
      }

      for (let [infoIndex, info] of infos.entries()) {
        //全含め必要
        let buffInfos = info.buffs || [];
        for (let buffInfo of buffInfos) {
          let tempValue: any;
          //聖遺物と武器効果が一箇所しないため、表示チェックを排除する（一時的）
          if (skill != Const.NAME_SET && skill != Const.NAME_EFFECT) {
            if (valueIndexes != undefined) {
              if (buffInfo?.showIndex != undefined) {
                if (!valueIndexes.includes(buffInfo.showIndex)) {
                  continue;
                }
              } else if (buffInfo?.index != undefined) {
                if (!valueIndexes.includes(buffInfo.index)) {
                  continue;
                }
              }
            }
          }
          if (buffInfo) {
            switch (buffInfo.settingType) {
              case 'switch-value':
              case 'switch':
                if (skill == Const.NAME_EFFECT) {
                  tempValue = this.weaponService.getExtraSwitch(
                    indexStr,
                    skill,
                    infoIndex,
                    skillIndex,
                  );
                } else if (skill == Const.NAME_SET) {
                  tempValue = this.artifactService.getExtraSwitch(
                    indexStr,
                    skill,
                    infoIndex,
                    skillIndex,
                  );
                } else {
                  tempValue = this.characterService.getExtraSwitch(
                    indexStr,
                    skill,
                    infoIndex,
                    skillIndex,
                  );
                }
                results.push({
                  showIndex: buffInfo.showIndex,
                  showPriority: buffInfo.showPriority ?? 1,
                  valueIndex: infoIndex,
                  type: 'switch',
                  switchValue: tempValue,
                  desc: buffInfo.desc,
                  title: buffInfo.title,
                  isAllTeam: buffInfo.isAllTeam,
                  isOnlyForOther: buffInfo.isOnlyForOther,
                });
                break;
              case 'slider':
                if (skill == Const.NAME_EFFECT) {
                  tempValue = this.weaponService.getExtraSlider(
                    indexStr,
                    skill,
                    infoIndex,
                    skillIndex,
                  );
                } else if (skill == Const.NAME_SET) {
                  tempValue = this.artifactService.getExtraSlider(
                    indexStr,
                    skill,
                    infoIndex,
                    skillIndex,
                  );
                } else {
                  tempValue = this.characterService.getExtraSlider(
                    indexStr,
                    skill,
                    infoIndex,
                    skillIndex,
                  );
                }
                results.push({
                  showIndex: buffInfo.showIndex,
                  showPriority: buffInfo.showPriority ?? 1,
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
                  sliderIsPercent: buffInfo.sliderIsPercent,
                });
                break;
              case 'resident':
              default:
                continue;
            }
          }
        }
      }
    }

    return results.sort((a: BuffResult, b: BuffResult) => b.showPriority! - a.showPriority!);
  }

  setSkillBuffValue(
    index: string | number,
    skill: string,
    valueIndex: number,
    type: string,
    setValue: number | boolean,
    skillIndex?: number | string,
  ) {
    let indexStr = index.toString();
    if (
      [
        Const.NAME_SKILLS_NORMAL,
        Const.NAME_SKILLS_SKILL,
        Const.NAME_SKILLS_ELEMENTAL_BURST,
        Const.NAME_CONSTELLATION,
        Const.NAME_SKILLS_PROUD,
        Const.NAME_SKILLS_OTHER,
      ].includes(skill)
    ) {
      switch (type) {
        case 'switch':
          this.characterService.setExtraSwitch(
            indexStr,
            skill,
            valueIndex,
            setValue as boolean,
            skillIndex,
          );
          break;
        case 'slider':
          this.characterService.setExtraSlider(
            indexStr,
            skill,
            valueIndex,
            setValue as number,
            skillIndex,
          );
          break;
      }
    } else if ([Const.NAME_EFFECT].includes(skill)) {
      switch (type) {
        case 'switch':
          this.weaponService.setExtraSwitch(
            indexStr,
            skill,
            valueIndex,
            setValue as boolean,
            skillIndex,
          );
          break;
        case 'slider':
          this.weaponService.setExtraSlider(
            indexStr,
            skill,
            valueIndex,
            setValue as number,
            skillIndex,
          );
          break;
      }
    } else if ([Const.NAME_SET].includes(skill)) {
      switch (type) {
        case 'switch':
          this.artifactService.setExtraSwitch(
            indexStr,
            skill,
            valueIndex,
            setValue as boolean,
            skillIndex,
          );
          break;
        case 'slider':
          this.artifactService.setExtraSlider(
            indexStr,
            skill,
            valueIndex,
            setValue as number,
            skillIndex,
          );
          break;
      }
    }
  }

  //計算用情報合計取得
  private getAllData(
    index: string | number,
    extraData?: Record<string, number>,
    toAddWeaponSmelting: number = 0,
    withEnemyAnt: boolean = true,
  ) {
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
    let tempWeaponData: [Record<string, number>, SpecialBuff[], TeamBuff[]] | null = null;
    //カスタム武器精錬
    let useCustomWeaponSmelting = toAddWeaponSmelting !== 0;

    for (let key of Const.PROPS_ALL_BASE) {
      if (!(key in result)) {
        result[key] = 0;
      }
      result[key] += this.getProperty(index, key, useCustomWeaponSmelting);
    }
    if (withEnemyAnt) {
      for (let key of Const.PROPS_ENEMY_ANTI.concat(Const.PROPS_ENEMY_DEFENSE)) {
        if (!(key in result)) {
          result[key] = 0;
        }
        result[key] += this.getPropertyEnemy(index, key);
      }
    }
    if (useCustomWeaponSmelting) {
      let weaponStorageData = this.weaponService.getStorageInfo(index);
      let smeltingLevel = (
        parseInt(weaponStorageData.smeltingLevel!) + toAddWeaponSmelting
      ).toString();
      smeltingLevel =
        smeltingLevel > Const.MAX_WEAPON_SMELTING
          ? Const.MAX_WEAPON_SMELTING
          : smeltingLevel.toString();
      tempWeaponData = this.getExtraWeaponData(indexStr, {smeltingLevel});
    }
    if (tempWeaponData) {
      for (let key of Object.keys(tempWeaponData[0])) {
        result[key] += tempWeaponData[0][key];
      }
    }

    //その他バフ処理(二度転換可能)
    for (let target in otherSecondaryData) {
      result[target] += otherSecondaryData[target] ?? 0;
    }
    //チームバフ処理(二度転換可能)
    for (let target in teamSecondaryData) {
      result[target] += teamSecondaryData[target] ?? 0;
    }

    if (extraData != undefined) {
      for (let key in extraData) {
        if ([Const.PROP_HP, Const.PROP_ATTACK, Const.PROP_DEFENSE].includes(key)) {
          switch (key) {
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
        } else {
          result[key] += extraData[key];
        }
      }
    }
    for (let key of Const.PROPS_TO_CAL) {
      if (!(key in result)) {
        result[key] = 0;
      }
      let temp = 0;
      switch (key) {
        case Const.PROP_HP:
          temp =
            (result[Const.PROP_HP_BASE] + result[Const.PROP_HP_BASE_EXTRA]) *
              (1 + result[Const.PROP_HP_UP]) +
            result[Const.PROP_VAL_HP];
          break;
        case Const.PROP_ATTACK:
          temp =
            (result[Const.PROP_ATTACK_BASE] + result[Const.PROP_ATTACK_BASE_EXTRA]) *
              (1 + result[Const.PROP_ATTACK_UP]) +
            result[Const.PROP_VAL_ATTACK];
          break;
        case Const.PROP_DEFENSE:
          temp =
            (result[Const.PROP_DEFENSE_BASE] + result[Const.PROP_DEFENSE_BASE_EXTRA]) *
              (1 + result[Const.PROP_DEFENSE_UP]) +
            result[Const.PROP_VAL_DEFENSE];
          break;
        case Const.PROP_DMG_ENEMY_DEFENSE:
          temp =
            result[Const.PROP_DMG_ENEMY_DEFENSE_BASE] *
            (1 - result[Const.PROP_DMG_ENEMY_DEFENSE_DOWN]);
          break;
        case Const.PROP_BOND_OF_LIFE_VAL:
          temp = result[Const.PROP_HP] * result[Const.PROP_BOND_OF_LIFE];
          break;
      }
      result[key] = temp;
    }

    //特殊範囲処理（命の契約）
    if (result[Const.PROP_BOND_OF_LIFE] > Const.MAX_BOND_OF_LIFE) {
      result[Const.PROP_BOND_OF_LIFE] = Const.MAX_BOND_OF_LIFE;
      result[Const.PROP_BOND_OF_LIFE_VAL] = result[Const.PROP_BOND_OF_LIFE] * result[Const.PROP_HP];
    }

    //スペシャルバフ
    let specialOrders: SpecialBuff[] = [];
    let specialOrdersFinally: SpecialBuff[] = [];
    specialOrders = specialOrders.concat(
      this.dataMap[index].extraSpecialCharaResult!,
      this.dataMap[index].extraSpecialArtifactSetResult!,
      this.dataMap[index].extraSpecialTeamResult!,
    );
    if (tempWeaponData) {
      specialOrders = specialOrders.concat(tempWeaponData[1]);
    } else {
      specialOrders = specialOrders.concat(this.dataMap[index].extraSpecialWeaponResult!);
    }
    specialOrders.sort((x, y) => x.priority! - y.priority!);

    //スペシャル処理
    for (let buff of specialOrders) {
      //最後に計算する場合
      if (buff.finallyCal) {
        specialOrdersFinally.push(buff);
        continue;
      }
      const buffResultInfo = this.calSpecialToResult(buff, result);
      if (buffResultInfo?.['overrideElement'] !== undefined) {
        this.characterService.setOverrideElement(index, buffResultInfo['overrideElement'], true);
      }
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
    for (let key of [
      Const.NAME_SKILLS_NORMAL,
      Const.NAME_SKILLS_SKILL,
      Const.NAME_SKILLS_ELEMENTAL_BURST,
      Const.NAME_SKILLS_OTHER,
      // Const.NAME_SKILLS_PROUD,
      // Const.NAME_CONSTELLATION,
      Const.NAME_EFFECT,
      Const.NAME_SET,
    ]) {
      (selfTeamBuff[key as keyof SelfTeamBuff] as TeamBuff[]) = (
        selfTeamBuff[key as keyof SelfTeamBuff] as TeamBuff[]
      ).filter((v: TeamBuff) => !v.path && v.val != 0);
    }
    for (let [i, _] of selfTeamBuff.proudSkills.entries()) {
      selfTeamBuff.proudSkills[i] = selfTeamBuff.proudSkills[i].filter(
        (v: TeamBuff) => !v.path && v.val != 0,
      );
    }
    for (let key of [
      Const.NAME_CONSTELLATION_1,
      Const.NAME_CONSTELLATION_2,
      Const.NAME_CONSTELLATION_3,
      Const.NAME_CONSTELLATION_4,
      Const.NAME_CONSTELLATION_5,
      Const.NAME_CONSTELLATION_6,
    ]) {
      selfTeamBuff.constellation[key] = selfTeamBuff.constellation[key].filter(
        (v: TeamBuff) => !v.path && v.val != 0,
      );
    }
    //再計算
    this.calTeamSpecialBuff(specialTeamSelfOrders, result, resultSelfTeamBuff);
    this.dataMap[index].selfTeamBuff = resultSelfTeamBuff;

    //その他バフ処理(一度)
    for (let target in otherOnceData) {
      result[target] += otherOnceData[target] ?? 0;
      //計算必要分再計算
      this.recalBaseProp(target, result);
    }
    //チームバフ処理(一度)
    for (let target in teamOnceData) {
      result[target] += teamOnceData[target] ?? 0;
      //計算必要分再計算
      this.recalBaseProp(target, result);
    }

    //スペシャル処理(ファイナリー)
    for (let buff of specialOrdersFinally) {
      const buffResultInfo = this.calSpecialToResult(buff, result);
      if (buffResultInfo?.['overrideElement'] !== undefined) {
        this.characterService.setOverrideElement(index, buffResultInfo['overrideElement'], true);
      }
    }

    //特殊範囲処理（命の契約）
    if (result[Const.PROP_BOND_OF_LIFE] > Const.MAX_BOND_OF_LIFE) {
      result[Const.PROP_BOND_OF_LIFE] = Const.MAX_BOND_OF_LIFE;
      result[Const.PROP_BOND_OF_LIFE_VAL] = result[Const.PROP_BOND_OF_LIFE] * result[Const.PROP_HP];
    }

    if (environment.outputLog) {
      //DEBUG
      console.log(result);
    }

    return result;
  }

  private calSpecialToResult(buff: SpecialBuff, result: Record<string, number>) {
    const resultInfo: Record<string, any> = {};
    let baseValue = buff.base ? result[buff.base] : 0;
    //特殊BUFFに変えるための仮想属性
    if (buff.base == Const.PROP_FIX_NUMBER_1) {
      baseValue = 1;
    } else if (buff.base == Const.PROP_FIX_NUMBER_0) {
      baseValue = 0;
    }
    if (buff.base2 != undefined) {
      baseValue *= result[buff.base2];
    }
    let modifyValue = buff.baseModifyValue ? buff.baseModifyValue : 0;
    let toAdd = (baseValue + modifyValue > 0 ? baseValue + modifyValue : 0) * buff.multiValue!;
    toAdd = this.getFinalResCalQueueResult(result, toAdd, buff.finalResCalQueue);
    if (
      buff.overrideElement &&
      (!buff.overrideWhenEffective || (buff.overrideWhenEffective && toAdd != 0))
    ) {
      resultInfo['overrideElement'] = buff.overrideElement;
    }
    if (buff.maxVal && toAdd > buff.maxVal) {
      toAdd = buff.maxVal;
    } else if (buff.specialMaxVal != undefined) {
      let specialMaxVal = result[buff.specialMaxVal.base!] * buff.specialMaxVal.multiValue!;
      if (toAdd > specialMaxVal) {
        toAdd = specialMaxVal;
      }
    }
    result[buff.target!] += toAdd;
    //計算必要分再計算
    this.recalBaseProp(buff.target, result);

    return resultInfo;
  }

  private appendToExtraTeam(
    buffs: TeamBuff[],
    extraTeamOnceResult: Record<string, number>,
    extraTeamSecondaryResult: Record<string, number>,
    extraSpecialTeamResult: SpecialBuff[],
    buffTag: Record<string, string[]>,
    result: Record<string, number> = {},
    elementType: string,
  ) {
    const resultInfo: Record<string, any> = {};
    let overrideElement = undefined;
    for (let v of buffs) {
      //バフ元素チェック
      if (v.teamElementTypeLimit && !v.teamElementTypeLimit.includes(elementType)) {
        continue;
      }
      if (v.calByOrigin && v.isSpecial) {
        extraSpecialTeamResult.push(v as SpecialBuff);
      } else {
        if (
          v.overrideElement &&
          (!v.overrideWhenEffective || (v.overrideWhenEffective && v.val != 0))
        ) {
          overrideElement = v.overrideElement;
        }
        if (!v.canSecondaryTrans) {
          if (!extraTeamOnceResult.hasOwnProperty(v.target)) {
            extraTeamOnceResult[v.target] = 0;
          }
          if (this.checkAndSetBuffTag(v.tag, v.target, buffTag)) {
            extraTeamOnceResult[v.target] += v.val ?? 0;
          }
        } else {
          if (!extraTeamSecondaryResult.hasOwnProperty(v.target)) {
            extraTeamSecondaryResult[v.target] = 0;
          }
          if (this.checkAndSetBuffTag(v.tag, v.target, buffTag)) {
            extraTeamSecondaryResult[v.target] += v.val ?? 0;
          }
        }
      }
    }
    resultInfo['overrideElement'] = overrideElement;
    return resultInfo;
  }

  private calTeamSpecialBuff(
    buffs: TeamBuff[],
    props: Record<string, number>,
    resultSelfTeamBuff: SelfTeamBuff,
  ) {
    for (let buff of buffs) {
      let v = {...buff};
      if (!v.calByOrigin && v.isSpecial) {
        v.isSpecial = false;
        let baseValue = v.base ? props[v.base] : 0;
        //特殊BUFFに変えるための仮想属性
        if (v.base == Const.PROP_FIX_NUMBER_1) {
          baseValue = 1;
        } else if (v.base == Const.PROP_FIX_NUMBER_0) {
          baseValue = 0;
        }
        if (v.base2 != undefined) {
          baseValue *= props[v.base2];
        }
        let modifyValue = v.baseModifyValue ? v.baseModifyValue : 0;
        let toAdd = (baseValue + modifyValue > 0 ? baseValue + modifyValue : 0) * v.multiValue!;
        toAdd = this.getFinalResCalQueueResult(props, toAdd, buff.finalResCalQueue);
        if (v.maxVal && toAdd > v.maxVal) {
          toAdd = v.maxVal;
        } else if (v.specialMaxVal != undefined) {
          let specialMaxVal = props[v.specialMaxVal.base!] * v.specialMaxVal.multiValue!;
          if (toAdd > specialMaxVal) {
            toAdd = specialMaxVal;
          }
        }
        v.val = toAdd;
      }
      if (v.path && v.val != 0) {
        let temp: any = resultSelfTeamBuff;
        for (let i of v.path) {
          temp = temp[i];
        }
        (temp as TeamBuff[]).push(v);
      }
    }
  }

  private recalBaseProp(traget: string | undefined, result: Record<string, number>) {
    //計算必要分再計算
    switch (traget) {
      case Const.PROP_HP_UP:
      case Const.PROP_VAL_HP:
        result[Const.PROP_HP] =
          (result[Const.PROP_HP_BASE] + result[Const.PROP_HP_BASE_EXTRA]) *
            (1 + result[Const.PROP_HP_UP]) +
          result[Const.PROP_VAL_HP];
        result[Const.PROP_BOND_OF_LIFE_VAL] =
          result[Const.PROP_BOND_OF_LIFE] * result[Const.PROP_HP];
        break;
      case Const.PROP_ATTACK_UP:
      case Const.PROP_VAL_ATTACK:
        result[Const.PROP_ATTACK] =
          (result[Const.PROP_ATTACK_BASE] + result[Const.PROP_ATTACK_BASE_EXTRA]) *
            (1 + result[Const.PROP_ATTACK_UP]) +
          result[Const.PROP_VAL_ATTACK];
        break;
      case Const.PROP_DEFENSE_UP:
      case Const.PROP_VAL_DEFENSE:
        result[Const.PROP_DEFENSE] =
          (result[Const.PROP_DEFENSE_BASE] + result[Const.PROP_DEFENSE_BASE_EXTRA]) *
            (1 + result[Const.PROP_DEFENSE_UP]) +
          result[Const.PROP_VAL_DEFENSE];
        break;
      case Const.PROP_DMG_ENEMY_DEFENSE_DOWN:
        result[Const.PROP_DMG_ENEMY_DEFENSE] =
          result[Const.PROP_DMG_ENEMY_DEFENSE_BASE] *
          (1 - result[Const.PROP_DMG_ENEMY_DEFENSE_DOWN]);
        break;
      case Const.PROP_BOND_OF_LIFE:
        result[Const.PROP_BOND_OF_LIFE_VAL] =
          result[Const.PROP_BOND_OF_LIFE] * result[Const.PROP_HP];
        break;
    }
  }

  //全情報から属性取得（まとめ）
  private getProperty(index: string | number, prop: string, withoutWeaponExtra: boolean = false) {
    let result = 0;
    let indexStr = index.toString();
    let genshinDataProp = prop;
    let genshinArtifactDataProp = prop;
    if (
      [
        Const.PROP_LEVEL,
        Const.PROP_ELEMENTAL_BURST_ENERGY,
        Const.PROP_DMG_ENEMY_DEFENSE_BASE,
        Const.PROP_HP_BASE,
        Const.PROP_ATTACK_BASE,
        Const.PROP_DEFENSE_BASE,
      ].includes(prop)
    ) {
      switch (prop) {
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
    if (Const.PROPS_ENEMY_ANTI.includes(prop)) {
      return this.getEnemyData(indexStr)[genshinDataProp as keyof EnemyStatus] ?? 0;
    }

    result += this.getCharacterData(indexStr)[genshinDataProp as keyof CharStatus] ?? 0;
    result += this.getWeaponData(indexStr)[genshinDataProp as keyof WeaponStatus] ?? 0;
    let extraCharaResult = this.dataMap[indexStr].extraCharaResult!;
    if (extraCharaResult[prop] != undefined) {
      result += extraCharaResult[prop];
    }
    if (!withoutWeaponExtra) {
      let extraWeaponResult = this.dataMap[indexStr].extraWeaponResult!;
      if (extraWeaponResult[prop] != undefined) {
        result += extraWeaponResult[prop];
      }
    }

    if ([Const.PROP_VAL_HP, Const.PROP_VAL_ATTACK, Const.PROP_VAL_DEFENSE].includes(prop)) {
      switch (prop) {
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
    if (extraArtifactSetResult[prop] != undefined) {
      result += extraArtifactSetResult[prop];
    }

    return result;
  }

  //全情報から属性取得（敵）
  private getPropertyEnemy(index: string | number, prop: string) {
    let indexStr = index.toString();
    let genshinDataProp = prop.toLowerCase();

    if ([Const.PROP_DMG_ENEMY_DEFENSE_BASE].includes(prop)) {
      switch (prop) {
        case Const.PROP_DMG_ENEMY_DEFENSE_BASE:
          return this.getEnemyData(indexStr).defense;
      }
    }
    return this.getEnemyData(indexStr)[genshinDataProp as keyof EnemyStatus] ?? 0;
  }

  //キャラ追加データ解析
  private getExtraCharacterData(
    index: string | number,
    data?: CharLevelConfig,
  ): [Record<string, number>, SpecialBuff[], TeamBuff[]] {
    let characterData = this.dataMap[index]!.characterData!;
    let normalLevel;
    let skillLevel;
    let elementalBurstLevel;
    let characterStorageData = this.characterService.getStorageInfo(index);
    let overrideElement = this.characterService.getOverrideElement(index);
    if (data && data.normalLevel) {
      normalLevel = data.normalLevel!;
    } else {
      normalLevel = characterStorageData.normalLevel!;
    }
    if (data && data.skillLevel) {
      skillLevel = data.skillLevel!;
    } else {
      skillLevel = characterStorageData.skillLevel!;
    }
    if (data && data.elementalBurstLevel) {
      elementalBurstLevel = data.elementalBurstLevel!;
    } else {
      elementalBurstLevel = characterStorageData.elementalBurstLevel!;
    }
    let extraCharacterData = this.extraDataService.getCharacter(index);
    let setting = this.characterService.getExtraData(index)!;
    let result: Record<string, number> = {};
    let specialResult: SpecialBuff[] = [];
    let specialTeamSlefResult: TeamBuff[] = [];
    let hasOverride: boolean = false;

    if (skillLevel == undefined || elementalBurstLevel == undefined) {
      return [result, specialResult, specialTeamSlefResult];
    }

    if (Const.NAME_SKILLS in setting && setting.skills) {
      if (Const.NAME_SKILLS_NORMAL in setting.skills) {
        let setBuffResult = this.setBuffDataToResult(
          characterData.skills?.normal,
          normalLevel,
          extraCharacterData.skills!.normal,
          setting.skills.normal!,
          result,
          specialResult,
          specialTeamSlefResult,
          [name_normal],
          this.dataMap[index].selfTeamBuff!.normal,
          this.dataMap[index].buffTag!,
          characterData.weaponType,
          characterData.info.elementType,
          overrideElement,
          index,
        );
        if (setBuffResult?.['overrideElement'] !== undefined) {
          hasOverride = true;
          overrideElement = setBuffResult.overrideElement!;
          this.characterService.setOverrideElement(index, setBuffResult.overrideElement, true);
        }
      }
      if (Const.NAME_SKILLS_SKILL in setting.skills) {
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
          index,
        );
        if (setBuffResult?.['overrideElement'] !== undefined) {
          hasOverride = true;
          overrideElement = setBuffResult.overrideElement!;
          this.characterService.setOverrideElement(index, setBuffResult.overrideElement, true);
        }
      }
      if (Const.NAME_SKILLS_ELEMENTAL_BURST in setting.skills) {
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
          index,
        );
        if (setBuffResult?.['overrideElement'] !== undefined) {
          hasOverride = true;
          overrideElement = setBuffResult.overrideElement!;
          this.characterService.setOverrideElement(index, setBuffResult.overrideElement, true);
        }
      }
      if (
        Const.NAME_SKILLS_OTHER in setting.skills &&
        extraCharacterData.skills!.other != undefined
      ) {
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
          index,
        );
        if (setBuffResult?.['overrideElement'] !== undefined) {
          hasOverride = true;
          overrideElement = setBuffResult.overrideElement!;
          this.characterService.setOverrideElement(index, setBuffResult.overrideElement, true);
        }
      }
      if (Const.NAME_SKILLS_PROUD in setting.skills) {
        this.dataMap[index].selfTeamBuff!.proudSkills.length = 0;
        for (let i = 0; i < setting.skills.proudSkills!.length; ++i) {
          let obj = setting.skills.proudSkills![i];
          this.dataMap[index].selfTeamBuff!.proudSkills.push([]);
          if (Object.keys(obj).length === 0) {
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
            index,
          );
          if (setBuffResult?.['overrideElement'] !== undefined) {
            hasOverride = true;
            overrideElement = setBuffResult.overrideElement!;
            this.characterService.setOverrideElement(index, setBuffResult.overrideElement, true);
          }
        }
      }
    }

    if (Const.NAME_CONSTELLATION in setting && setting.constellation) {
      for (let i of [
        Const.NAME_CONSTELLATION_1,
        Const.NAME_CONSTELLATION_2,
        Const.NAME_CONSTELLATION_3,
        Const.NAME_CONSTELLATION_4,
        Const.NAME_CONSTELLATION_5,
        Const.NAME_CONSTELLATION_6,
      ]) {
        if (i in setting.constellation) {
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
            index,
          );
          if (setBuffResult?.['overrideElement'] !== undefined) {
            hasOverride = true;
            overrideElement = setBuffResult.overrideElement!;
            this.characterService.setOverrideElement(index, setBuffResult.overrideElement, true);
          }
        }
      }
    }

    return [result, specialResult, specialTeamSlefResult];
  }

  //武器追加データ解析
  private getExtraWeaponData(
    index: string | number,
    data?: WeaponLevelConfig,
  ): [Record<string, number>, SpecialBuff[], TeamBuff[]] {
    let weaponData = this.dataMap[index]!.weaponData!;
    let characterData = this.dataMap[index]!.characterData!;
    let smeltingLevel;
    let weaponStorageData = this.weaponService.getStorageInfo(index);
    let overrideElement = this.characterService.getOverrideElement(index);
    if (data && data.smeltingLevel) {
      smeltingLevel = data.smeltingLevel!;
    } else {
      smeltingLevel = weaponStorageData.smeltingLevel!;
    }
    let extraWeaponData = this.extraDataService.getWeapon(weaponData.id);
    let setting = this.weaponService.getExtraData(index)!;
    let result: Record<string, number> = {};
    let specialResult: SpecialBuff[] = [];
    let specialTeamSlefResult: TeamBuff[] = [];

    if ('effect' in setting && setting.effect) {
      let setBuffResult = this.setBuffDataToResult(
        weaponData.skillAffixMap[smeltingLevel] ??
          weaponData.skillAffixMap[Const.MIN_WEAPON_SMELTING],
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
        index,
      );
      if (setBuffResult?.['overrideElement'] !== undefined) {
        this.characterService.setOverrideElement(index, setBuffResult.overrideElement, true);
      }
    }

    return [result, specialResult, specialTeamSlefResult];
  }

  //聖遺物データ解析
  private getReliquaryData(index: string): artifactStatus {
    let result: artifactStatus = {};
    let data = this.artifactService.getStorageActiveArtifactInfo(index);
    for (let temp of [
      data?.flower ?? {},
      data?.plume ?? {},
      data?.sands ?? {},
      data?.goblet ?? {},
      data?.circlet ?? {},
    ]) {
      for (let key in temp) {
        if (temp[key].name == undefined) {
          continue;
        }
        let prop = temp[key].name!.toLowerCase();
        if (result[prop as keyof artifactStatus] == undefined) {
          result[prop as keyof artifactStatus] = 0;
        }
        result[prop as keyof artifactStatus]! += temp[key].value!;
      }
    }
    return result;
  }

  //聖遺物セットデータ解析
  private getExtraReliquarySetData(
    index: string,
  ): [Record<string, number>, SpecialBuff[], TeamBuff[]] {
    let characterData = this.dataMap[index]!.characterData!;
    let artifactSetIndexes = this.artifactService.getStorageSetIndexes(index);
    let overrideElement = this.characterService.getOverrideElement(index);
    let result: Record<string, number> = {};
    let specialResult: SpecialBuff[] = [];
    let specialTeamSlefResult: TeamBuff[] = [];
    let targetIndexInfos: artifactSetInfo[] = [];
    let ownedIndexes: string[] = [];
    for (let [i, setIndex] of artifactSetIndexes.entries()) {
      if (setIndex != undefined && setIndex != '') {
        ownedIndexes.push(setIndex);
        targetIndexInfos.push({
          index: setIndex,
          level: ownedIndexes.filter((x) => x == setIndex).length,
          setIndex: i + 1,
        });
      }
    }
    for (let targetIndexInfo of targetIndexInfos) {
      let tempResult: Record<string, number> = {};
      let tempSpecialResult: SpecialBuff[] = [];
      let tempSpecialTeamSlefResult: TeamBuff[] = [];
      let artifactSetData = this.artifactService.getSet(targetIndexInfo.index);
      let extraArtifactData = this.extraDataService.getArtifactSet(targetIndexInfo.index);
      let setting = this.artifactService.getExtraData(index)!;
      let setBuffResult = this.setBuffDataToResult(
        artifactSetData.setAffixs[targetIndexInfo.level - 1],
        Const.NAME_NO_LEVEL,
        extraArtifactData
          ? extraArtifactData[(Const.NAME_SET + targetIndexInfo.level) as keyof ExtraArtifact]!
          : [],
        setting[(Const.NAME_SET + targetIndexInfo.setIndex) as keyof ExtraArtifactSetData] ?? {},
        tempResult,
        tempSpecialResult,
        tempSpecialTeamSlefResult,
        [name_set],
        this.dataMap[index].selfTeamBuff!.set,
        this.dataMap[index].buffTag!,
        characterData.weaponType,
        characterData.info.elementType,
        overrideElement,
        index,
      );
      if (setBuffResult?.['overrideElement'] !== undefined) {
        this.characterService.setOverrideElement(index, setBuffResult.overrideElement, true);
      }
      for (let key in tempResult) {
        if (result[key] == undefined) {
          result[key] = tempResult[key];
        } else {
          result[key] += tempResult[key];
        }
      }
      specialResult.push(...tempSpecialResult);
      specialTeamSlefResult.push(...tempSpecialTeamSlefResult);
    }

    return [result, specialResult, specialTeamSlefResult];
  }

  //チームデータ解析
  private setExtraTeamData(index: string) {
    this.initTeamBuffData(index, false);
    let team: string[] = this.teamService.getOtherMembers(index);
    const characterData = this.dataMap[index]!.characterData!;
    const elementType: string = Const.ELEMENT_TYPE_MAP.get(characterData.info.elementType)!;
    for (let i = 0; i < team.length; ++i) {
      let subIndex = team[i];
      if (!subIndex || !(subIndex?.length > 0)) {
        continue;
      }
      this.initAllDataBackground(subIndex);

      //チームバフ
      let buffs = this.dataMap[subIndex].selfTeamBuff!;
      const result = this.dataMap[subIndex].allData;
      for (let key of [
        Const.NAME_SKILLS_NORMAL,
        Const.NAME_SKILLS_SKILL,
        Const.NAME_SKILLS_ELEMENTAL_BURST,
        Const.NAME_SKILLS_OTHER,
        Const.NAME_EFFECT,
        Const.NAME_SET,
      ]) {
        const buffResultInfo = this.appendToExtraTeam(
          buffs[key as keyof SelfTeamBuff] as TeamBuff[],
          this.dataMap[index].extraTeamOnceResult!,
          this.dataMap[index].extraTeamSecondaryResult!,
          this.dataMap[index].extraSpecialTeamResult!,
          this.dataMap[index].buffTag!,
          result,
          elementType,
        );
        if (buffResultInfo?.['overrideElement'] !== undefined) {
          this.characterService.setOverrideElement(index, buffResultInfo['overrideElement'], true);
        }
      }
      for (let v of buffs.proudSkills) {
        const buffResultInfo = this.appendToExtraTeam(
          v,
          this.dataMap[index].extraTeamOnceResult!,
          this.dataMap[index].extraTeamSecondaryResult!,
          this.dataMap[index].extraSpecialTeamResult!,
          this.dataMap[index].buffTag!,
          result,
          elementType,
        );
        if (buffResultInfo?.['overrideElement'] !== undefined) {
          this.characterService.setOverrideElement(index, buffResultInfo['overrideElement'], true);
        }
      }
      for (let key of [
        Const.NAME_CONSTELLATION_1,
        Const.NAME_CONSTELLATION_2,
        Const.NAME_CONSTELLATION_3,
        Const.NAME_CONSTELLATION_4,
        Const.NAME_CONSTELLATION_5,
        Const.NAME_CONSTELLATION_6,
      ]) {
        const buffResultInfo = this.appendToExtraTeam(
          buffs.constellation[key],
          this.dataMap[index].extraTeamOnceResult!,
          this.dataMap[index].extraTeamSecondaryResult!,
          this.dataMap[index].extraSpecialTeamResult!,
          this.dataMap[index].buffTag!,
          result,
          elementType,
        );
        if (buffResultInfo?.['overrideElement'] !== undefined) {
          this.characterService.setOverrideElement(index, buffResultInfo['overrideElement'], true);
        }
      }
    }
  }

  //その他データ解析
  private getOtherData(
    index: string,
    filter: 'all' | 'once' | 'secondary',
  ): Record<string, number> | undefined {
    let result: Record<string, number> = {};
    let temps: OtherStorageInfo[] = this.otherService.getStorageInfos(index, undefined, filter);
    for (let value of temps) {
      if (value.enable && value.name != undefined && value.name != '') {
        if (!(value.name in result)) {
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
    crruentOverrideElement: string,
    index: string | number,
  ): SetBuffResult {
    let setBuffResult: SetBuffResult = {};
    if (skillData == undefined || buffs == undefined) {
      return setBuffResult;
    }
    let switchOnSet = setting?.switchOnSet ?? {};
    let sliderNumMap = setting?.sliderNumMap ?? {};
    let overrideElement = '';
    let overrideWhenEffective = false;
    let buffValIsNotZero = false;

    selfTeamBuffs.length = 0;

    for (let [buffIndex, buffInfo] of buffs.entries()) {
      let subBuffs = buffInfo?.buffs || [];
      for (let buff of subBuffs) {
        let isAllTeam = buff.isAllTeam ?? false;
        let isOnlyForOther = buff.isOnlyForOther ?? false;
        let isEnableInSwitch = true;
        let isEnableInSlider = true;
        let toSetOriginalVal = 0;
        if (!(buffIndex in switchOnSet) || switchOnSet[buffIndex] != true) {
          isEnableInSwitch = false;
        } else {
          toSetOriginalVal = 1;
        }
        if (!(buffIndex in sliderNumMap) || typeof sliderNumMap[buffIndex] != 'number') {
          isEnableInSlider = false;
        } else {
          toSetOriginalVal = sliderNumMap[buffIndex];
        }

        if (buff) {
          //元素付与リセット
          // if(buff.overrideElement == crruentOverrideElement){
          //   overrideElement = "";
          // }
          //限定武器タイプチェック
          if (buff?.weaponTypeLimit != undefined) {
            if (!buff.weaponTypeLimit.includes(weaponType)) {
              continue;
            }
          }
          //限定自身元素タイプチェック準備
          let checkSelfElementType = buff?.selfElementTypeLimit === true;
          let selfElementType = Const.ELEMENT_TYPE_MAP.get(elementType)!;
          //入力値を変数に保存
          if (buff.setTos !== undefined) {
            for (const [index, tempSetTo] of buff.setTos.entries()) {
              const tempCalQueue = buff.setValCalQueues ? buff.setValCalQueues[index] : [];
              const tempToSetVal = this.getFinalResCalQueueResult(
                {},
                toSetOriginalVal,
                tempCalQueue,
              );
              result[tempSetTo] = tempToSetVal;
            }
          }
          //結果再計算列
          const calQueue = buff.finalResCalQueue;
          //共通
          let indexValue = 0;
          if (buff?.index != undefined) {
            if (skillData.paramMap) {
              indexValue = skillData.paramMap[skillLevel][buff?.index!];
            } else if (skillData.paramList) {
              indexValue = skillData.paramList[buff?.index!];
            }
          } else if (buff?.customValue != undefined) {
            indexValue = buff.customValue;
          } else if (buff?.propIndex != undefined) {
            indexValue = skillData.addProps![buff?.propIndex].value;
          }
          let constIndexValue = 0;
          if (buff?.constIndex != undefined) {
            if (skillData.paramMap) {
              constIndexValue = skillData.paramMap[skillLevel][buff?.constIndex!];
            } else if (skillData.paramList) {
              constIndexValue = skillData.paramList[buff?.constIndex!];
            }
          }
          let indexMultiValue = 1;
          if (buff?.indexMultiValue != undefined) {
            indexMultiValue = buff.indexMultiValue;
          }
          indexValue *= indexMultiValue;
          let indexAddValue = 0;
          if (buff?.indexAddValue != undefined) {
            indexAddValue = buff.indexAddValue;
          }
          indexValue += indexAddValue;
          if (buff.originSkills) {
            for (let i = 0; i < buff.originSkills.length; ++i) {
              const indexStr = index.toString();
              const characterData = this.dataMap[indexStr].characterData;
              let originRateInfo = characterData!.skills![
                buff.originSkills[i] as keyof CharSkills
              ] as CharSkill;
              let originSkillLevel = this.getCharacterSkillLevel(indexStr, buff.originSkills[i]);
              let originRate = originRateInfo.paramMap[originSkillLevel][buff.originIndexes![i]];
              switch (buff.originRelations![i]) {
                case '*':
                  indexValue *= originRate;
                  break;
                case '+':
                  indexValue += originRate;
                  break;
                case '-':
                  indexValue -= originRate;
                  break;
                case '/':
                  indexValue /= originRate;
                  break;
              }
            }
          }
          let calRelation = buff?.calRelation ?? '+';
          switch (calRelation) {
            case '-':
              indexValue = -1 * indexValue;
              break;
          }
          let constCalRelation = buff?.constCalRelation ?? '+';

          let base = buff?.base;
          //ベース２
          let base2 = buff.base2;
          let baseModifyValue = buff?.baseModifyValue;
          let baseModifyRelation = buff?.baseModifyRelation;
          if (baseModifyValue != undefined) {
            switch (baseModifyRelation) {
              case '-':
                baseModifyValue = -1 * baseModifyValue;
                break;
            }
          }
          let priority = buff?.priority ?? 0;
          let finallyCal = buff?.finallyCal ?? false;

          let targets = (buff?.target ?? []).map(
            (val) => val + (buff?.tag ? Const.CONCATENATION_TAG + buff.tag : ''),
          );
          //自身元素タイプチェック
          if (checkSelfElementType) {
            targets = targets.filter((v: string) => {
              return v.includes(selfElementType);
            });
          }

          let maxValIndexValue = 0;
          if (buff?.maxValIndex != undefined) {
            if (skillData.paramMap) {
              maxValIndexValue = skillData.paramMap[skillLevel][buff?.maxValIndex!];
            } else if (skillData.paramList) {
              maxValIndexValue = skillData.paramList[buff?.maxValIndex!];
            }
          }
          let maxValBase = buff?.maxValBase;
          let maxValConstIndexValue = 0;
          if (buff?.maxValConstIndex != undefined) {
            if (skillData.paramMap) {
              maxValConstIndexValue = skillData.paramMap[skillLevel][buff?.maxValConstIndex!];
            } else if (skillData.paramList) {
              maxValConstIndexValue = skillData.paramList[buff?.maxValConstIndex!];
            }
          } else if (buff?.maxValValue != undefined) {
            maxValConstIndexValue = buff.maxValValue;
          }
          //元素付与
          overrideWhenEffective = buff.overrideWhenEffective ?? false;

          // ------------
          // 入力タイプ分岐処理
          // ------------
          if (isEnableInSwitch) {
            if (buff.overrideElement !== undefined && buff.overrideElement !== '') {
              overrideElement = buff.overrideElement;
            }
            if (base) {
              //特殊バフ
              let temp: SpecialBuff = {};
              temp.base = base;
              temp.base2 = base2;
              temp.baseModifyValue = baseModifyValue;
              temp.multiValue = indexValue;
              temp.priority = priority;
              temp.finallyCal = finallyCal;
              temp.finalResCalQueue = calQueue;
              if (maxValBase) {
                //特殊上限
                temp.specialMaxVal = {
                  base: maxValBase,
                  multiValue: maxValIndexValue,
                };
              } else {
                //一般上限
                temp.maxVal = maxValConstIndexValue;
              }
              for (let tar of targets) {
                if (!isOnlyForOther) {
                  specialResult.push({
                    ...temp,
                    target: tar,
                    tag: buff.buffTag,
                    overrideElement: overrideElement,
                    overrideWhenEffective: overrideWhenEffective,
                  });
                }

                if (isAllTeam || isOnlyForOther) {
                  if (!buff.calByOrigin) {
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
                      overrideElement: overrideElement,
                      overrideWhenEffective: overrideWhenEffective,
                      teamElementTypeLimit: buff.teamElementTypeLimit,
                    });
                  } else {
                    selfTeamBuffs.push({
                      ...temp,
                      index: buff.index,
                      tag: buff.buffTag,
                      target: tar,
                      isSpecial: true,
                      canSecondaryTrans: buff.canSecondaryTrans,
                      canOverlying: buff.canOverlying,
                      calByOrigin: buff.calByOrigin,
                      overrideElement: overrideElement,
                      overrideWhenEffective: overrideWhenEffective,
                      teamElementTypeLimit: buff.teamElementTypeLimit,
                    });
                  }
                }
              }
            } else {
              //一般バフ
              let value = indexValue;
              value = this.calRelationResult(value, constIndexValue, constCalRelation);
              value = this.getFinalResCalQueueResult(result, value, calQueue);
              if (value != 0) {
                buffValIsNotZero = true;
              }
              for (let tar of targets) {
                if (!isOnlyForOther) {
                  if (!result[tar]) {
                    result[tar] = 0;
                  }
                  if (this.checkAndSetBuffTagForSelf(buff.buffTag, tar, buffTag)) {
                    result[tar] += value;
                  }
                }

                if (isAllTeam || isOnlyForOther) {
                  selfTeamBuffs.push({
                    index: buff.index,
                    tag: buff.buffTag,
                    target: tar,
                    val: value,
                    canSecondaryTrans: buff.canSecondaryTrans,
                    canOverlying: buff.canOverlying,
                    calByOrigin: buff.calByOrigin,
                    overrideElement: overrideElement,
                    overrideWhenEffective: overrideWhenEffective,
                    teamElementTypeLimit: buff.teamElementTypeLimit,
                  });
                }
              }
            }
          } else if (isEnableInSlider) {
            if (buff.overrideElement !== undefined && buff.overrideElement !== '') {
              overrideElement = buff.overrideElement;
            }
            let isMaximumStackBuff = buff?.isMaximumStackBuff || false;
            let sliderMax = buff?.sliderMax;
            let sliderStep = buff?.sliderStep;
            let sliderStartIndex = buff?.sliderStartIndex;

            if (base) {
              //特殊バフ
              let temp: SpecialBuff = {};
              temp.base = base;
              temp.base2 = base2;
              temp.baseModifyValue = baseModifyValue;
              temp.finalResCalQueue = calQueue;
              if (maxValBase) {
                //特殊上限
                temp.specialMaxVal = {
                  base: maxValBase,
                  multiValue: maxValIndexValue,
                };
              } else {
                //一般上限
                temp.maxVal = maxValConstIndexValue;
              }
              if (isMaximumStackBuff) {
                temp.multiValue = 0;
                if ((sliderMax || 0) <= sliderNumMap[buffIndex]) {
                  temp.multiValue = indexValue;
                }
              } else {
                if (sliderStartIndex != undefined) {
                  if (sliderNumMap[buffIndex] == 0) {
                    temp.multiValue = 0;
                  } else {
                    if (skillData.paramMap) {
                      temp.multiValue =
                        skillData.paramMap[skillLevel][
                          sliderStartIndex + sliderNumMap[buffIndex] - 1
                        ];
                    } else if (skillData.paramList) {
                      temp.multiValue =
                        skillData.paramList[sliderStartIndex + sliderNumMap[buffIndex] - 1];
                    }
                  }
                } else {
                  temp.multiValue = indexValue * sliderNumMap[buffIndex];
                }
              }
              temp.priority = priority;
              temp.finallyCal = finallyCal;

              for (let tar of targets) {
                if (!isOnlyForOther) {
                  specialResult.push({...temp, target: tar, tag: buff.buffTag});
                }
                if (isAllTeam || isOnlyForOther) {
                  if (isMaximumStackBuff) {
                    if ((buff?.sliderMax || 0) <= sliderNumMap[buffIndex]) {
                      if (!buff.calByOrigin) {
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
                          overrideElement: overrideElement,
                          overrideWhenEffective: overrideWhenEffective,
                          teamElementTypeLimit: buff.teamElementTypeLimit,
                        });
                      } else {
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
                          overrideElement: overrideElement,
                          overrideWhenEffective: overrideWhenEffective,
                          teamElementTypeLimit: buff.teamElementTypeLimit,
                        });
                      }
                    }
                  } else {
                    //
                    if (sliderStartIndex != undefined) {
                      let tempValue = 0;
                      if (sliderNumMap[buffIndex] != 0) {
                        if (skillData.paramMap) {
                          tempValue =
                            skillData.paramMap[skillLevel][
                              sliderStartIndex + sliderNumMap[buffIndex] - 1
                            ];
                        } else if (skillData.paramList) {
                          tempValue =
                            skillData.paramList[sliderStartIndex + sliderNumMap[buffIndex] - 1];
                        }
                      }
                      if (!buff.calByOrigin) {
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
                          overrideElement: overrideElement,
                          overrideWhenEffective: overrideWhenEffective,
                          teamElementTypeLimit: buff.teamElementTypeLimit,
                        });
                      } else {
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
                          overrideElement: overrideElement,
                          overrideWhenEffective: overrideWhenEffective,
                          teamElementTypeLimit: buff.teamElementTypeLimit,
                        });
                      }
                    } else {
                      if (!buff.calByOrigin) {
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
                          overrideElement: overrideElement,
                          overrideWhenEffective: overrideWhenEffective,
                          teamElementTypeLimit: buff.teamElementTypeLimit,
                        });
                      } else {
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
                          overrideElement: overrideElement,
                          overrideWhenEffective: overrideWhenEffective,
                          teamElementTypeLimit: buff.teamElementTypeLimit,
                        });
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
            } else {
              //一般バフ
              let value = indexValue;
              value = this.calRelationResult(value, constIndexValue, constCalRelation);
              if (value != 0) {
                buffValIsNotZero = true;
              }
              if (
                buff.overrideElement != undefined &&
                overrideElement == '' &&
                sliderNumMap[buffIndex] !== 0
              ) {
                overrideElement = buff.overrideElement;
              }
              for (let tar of targets) {
                if (!isOnlyForOther) {
                  if (result[tar] == undefined) {
                    result[tar] = 0;
                  }
                  let resultValue: number;
                  if (isMaximumStackBuff) {
                    resultValue = 0;
                    if ((buff?.sliderMax || 0) <= sliderNumMap[buffIndex]) {
                      resultValue = value;
                    }
                  } else {
                    if (sliderStartIndex != undefined) {
                      if (sliderNumMap[buffIndex] == 0) {
                        resultValue = 0;
                      } else {
                        if (skillData.paramMap) {
                          resultValue =
                            skillData.paramMap[skillLevel][
                              sliderStartIndex + sliderNumMap[buffIndex] - 1
                            ];
                        } else if (skillData.paramList) {
                          resultValue =
                            skillData.paramList[sliderStartIndex + sliderNumMap[buffIndex] - 1];
                        }
                      }
                    } else {
                      resultValue = value * sliderNumMap[buffIndex];
                    }
                  }
                  if (this.checkAndSetBuffTagForSelf(buff.buffTag, tar, buffTag)) {
                    result[tar] += resultValue!;
                  }
                }
                if (isAllTeam || isOnlyForOther) {
                  if (isMaximumStackBuff) {
                    selfTeamBuffs.push({
                      index: buff.index,
                      tag: buff.buffTag,
                      target: tar,
                      val: value,
                      canSecondaryTrans: buff.canSecondaryTrans,
                      canOverlying: buff.canOverlying,
                      calByOrigin: buff.calByOrigin,
                      overrideElement: overrideElement,
                      overrideWhenEffective: overrideWhenEffective,
                      teamElementTypeLimit: buff.teamElementTypeLimit,
                    });
                  } else {
                    if (sliderStartIndex != undefined) {
                      let tempValue = 0;
                      if (sliderNumMap[buffIndex] != 0) {
                        if (skillData.paramMap) {
                          tempValue =
                            skillData.paramMap[skillLevel][
                              sliderStartIndex + sliderNumMap[buffIndex] - 1
                            ];
                        } else if (skillData.paramList) {
                          tempValue =
                            skillData.paramList[sliderStartIndex + sliderNumMap[buffIndex] - 1];
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
                        overrideElement: overrideElement,
                        overrideWhenEffective: overrideWhenEffective,
                        teamElementTypeLimit: buff.teamElementTypeLimit,
                      });
                    } else {
                      selfTeamBuffs.push({
                        index: buff.index,
                        tag: buff.buffTag,
                        target: tar,
                        val: value * sliderNumMap[buffIndex],
                        canSecondaryTrans: buff.canSecondaryTrans,
                        canOverlying: buff.canOverlying,
                        calByOrigin: buff.calByOrigin,
                        overrideElement: overrideElement,
                        overrideWhenEffective: overrideWhenEffective,
                        teamElementTypeLimit: buff.teamElementTypeLimit,
                      });
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
    if (!overrideWhenEffective || (overrideWhenEffective && buffValIsNotZero)) {
      setBuffResult.overrideElement = overrideElement;
    }

    return setBuffResult;
  }

  private checkAndSetBuffTagForSelf(
    tag: string | undefined,
    target: string,
    buffTag: Record<string, string[]>,
  ) {
    if (tag) {
      if (buffTag.hasOwnProperty(tag) && buffTag[tag].includes(target)) {
        return false;
      }
    }
    return true;
  }

  private checkAndSetBuffTag(
    tag: string | undefined,
    target: string,
    buffTag: Record<string, string[]>,
  ) {
    if (tag) {
      if (buffTag.hasOwnProperty(tag) && buffTag[tag].includes(target)) {
        return false;
      }
      if (!buffTag[tag]) {
        buffTag[tag] = [];
      }
      buffTag[tag].push(target);
    }
    return true;
  }

  private getCharacterData(index: string | number): CharStatus {
    return this.dataMap[index]!.characterData!.levelMap[
      this.characterService.getLevel(index.toString())!
    ];
  }

  private getWeaponData(index: string | number): WeaponStatus {
    return this.dataMap[index]!.weaponData!.levelMap[
      this.weaponService.getLevel(index.toString())!
    ];
  }

  private getEnemyData(index: string | number): EnemyStatus {
    return this.dataMap[index]!.enemyData!.levelMap[this.enemyService.getLevel(index.toString())!];
  }

  private setDirty(index: string | number, dirty: boolean) {
    this.dataMap[index.toString()].isDirty = dirty;
    if (dirty) {
      this.hasChanged.next(true);
    }
  }

  private getCharacterSkillLevel(index: string | number, skill: string) {
    let currentLevel: string;
    let characterStorageData = this.characterService.getStorageInfo(index);
    switch (skill) {
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

  private getWeaponAffixLevel(index: string | number) {
    let currentLevel: string;
    let weaponStorageData = this.weaponService.getStorageInfo(index);
    currentLevel = weaponStorageData.smeltingLevel!;
    return currentLevel!;
  }

  private getDmgAntiSectionValue(
    data: Record<string, number>,
    elementType: string,
  ): [number, Function] {
    let tempDmgAntiSectionValue = 0;
    const tempDmgAntiSectionValueProcess = this.createProcess(tempDmgAntiSectionValue);
    tempDmgAntiSectionValue -= data[Const.PROP_DMG_ANTI_ALL_MINUS];
    tempDmgAntiSectionValueProcess(
      tempDmgAntiSectionValue,
      data[Const.PROP_DMG_ANTI_ALL_MINUS],
      '-',
    );
    let tempAntiStr = '';
    let tempAntiMinusStr = '';
    switch (elementType) {
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
    tempDmgAntiSectionValueProcess(tempDmgAntiSectionValue, data[tempAntiStr], '+', 'start');
    tempDmgAntiSectionValue -= data[tempAntiMinusStr];
    tempDmgAntiSectionValueProcess(tempDmgAntiSectionValue, data[tempAntiMinusStr], '-');
    if (tempDmgAntiSectionValue < 0) {
      tempDmgAntiSectionValue = tempDmgAntiSectionValue / 2;
      tempDmgAntiSectionValueProcess(tempDmgAntiSectionValue, 2, '/');
    }
    tempDmgAntiSectionValueProcess(1 - tempDmgAntiSectionValueProcess()[0], '1', '-', 'start');
    return [tempDmgAntiSectionValue, tempDmgAntiSectionValueProcess];
  }

  private getFinalResCalQueueResult(
    data: Record<string, number>,
    currentVal: number,
    finalResCalQueue?: CalcItem[],
  ): number {
    let result = currentVal;
    for (const item of finalResCalQueue ?? []) {
      let tempRes = 0;
      for (const unit of item.inner) {
        let tempVal = 0;
        if (unit.variable !== undefined) {
          tempVal = data[unit.variable] ?? 0;
          if (unit.varMap !== undefined) {
            const varMap = unit.varMap;
            tempVal = this.valMapFunc(tempVal, varMap);
          }
        } else {
          tempVal = unit.const ?? 0;
        }
        tempRes = this.calRelationResult(
          tempRes,
          tempVal,
          unit.relation,
          unit.trueResult,
          unit.falseResult,
        );
      }
      if (item.innerClampMin !== undefined && tempRes < item.innerClampMin) {
        tempRes = item.innerClampMin;
      }
      if (item.innerClampMax !== undefined && tempRes > item.innerClampMax) {
        tempRes = item.innerClampMax;
      }
      result = this.calRelationResult(
        result,
        tempRes,
        item.relation,
        item.trueResult,
        item.falseResult,
      );
      if (item.clampMin !== undefined && result < item.clampMin) {
        result = item.clampMin;
      }
      if (item.clampMax !== undefined && result > item.clampMax) {
        result = item.clampMax;
      }
    }
    return result;
  }

  private calRelationResult(
    val1: number,
    val2: number,
    relation: TYPE_RELATION,
    trueResult?: number | TYPE_ORIGIN,
    falseResult?: number | TYPE_ORIGIN,
  ): number {
    let result = val1;
    switch (relation) {
      case '+':
        result += val2;
        break;
      case '-':
        result -= val2;
        break;
      case '*':
        result *= val2;
        break;
      case '/':
        result /= val2;
        break;
    }
    if (trueResult !== undefined && falseResult !== undefined) {
      let calc = undefined;
      switch (relation) {
        case '>':
          calc = val1 > val2;
          break;
        case '>=':
          calc = val1 >= val2;
          break;
        case '<':
          calc = val1 < val2;
          break;
        case '<=':
          calc = val1 <= val2;
          break;
        case '==':
          calc = val1 == val2;
          break;
        case '!=':
          calc = val1 != val2;
          break;
      }
      if (calc !== undefined) {
        result = calc
          ? trueResult === 'origin'
            ? result
            : trueResult
          : falseResult === 'origin'
            ? result
            : falseResult;
      }
    }
    return result;
  }

  private valMapFunc(value: number, varMap: Record<string, number>): number {
    let result = value;
    if (varMap.hasOwnProperty(value)) {
      result = varMap[value];
    }
    return result;
  }

  readonly needBracketsSign = ['+', '-'];
  readonly plus = '&plus;';
  readonly minus = '&minus;';
  readonly times = '&times;';
  readonly divide = '&divide;';
  private proximateVal(originVal?: number) {
    if (originVal == 0 || originVal === undefined) {
      return 0;
    }
    return Math.round(originVal * 10000) / 10000;
  }

  private createProcess(val: number, existText?: string) {
    let lastValue = val;
    let processText = lastValue == 0 ? '' : `${this.proximateVal(lastValue)}`;
    if (existText != undefined) {
      processText = existText;
    }
    let lastSign = '';
    return (
      newVal?: number,
      changedVal?: number | string,
      sign: '+' | '-' | '*' | '/' = '+',
      postion: 'start' | 'end' = 'end',
    ): [number, string] => {
      if (newVal !== undefined) {
        let tempChangedVal = undefined;
        if (typeof changedVal === 'number') {
          tempChangedVal = this.proximateVal(changedVal);
        } else {
          tempChangedVal = changedVal;
        }
        if (tempChangedVal) {
          if (processText == '') {
            processText = `${tempChangedVal}`;
          } else if (Math.abs(newVal - lastValue) >= Number.EPSILON) {
            let signText = '';
            switch (sign) {
              case '+': {
                signText = this.plus;
                break;
              }
              case '-': {
                signText = this.minus;
                if (postion == 'start' && lastSign !== '') {
                  processText = `(${processText})`;
                }
                break;
              }
              case '*': {
                signText = this.times;
                if (this.needBracketsSign.includes(lastSign)) {
                  processText = `(${processText})`;
                }
                break;
              }
              case '/': {
                signText = this.divide;
                if (this.needBracketsSign.includes(lastSign) || postion == 'start') {
                  processText = `(${processText})`;
                }
              }
            }
            const temp_text = `${tempChangedVal}`;
            if (postion == 'start') {
              processText = temp_text + ` ${signText} ` + processText;
            } else {
              processText = processText + ` ${signText} ` + temp_text;
            }
            lastSign = sign;
          }
        }
        lastValue = newVal;
      }
      return [this.proximateVal(lastValue), processText];
    };
  }

  private calculateExpectedWeightedDamage(
    originDamageList: number[],
    critDamageList: number[],
    critRateList: number[],
    damageDistributions: number[],
  ) {
    const n = originDamageList.length;

    if (n === 0) {
      return 0;
    }

    const expectedSortedDamages = new Array(n).fill(0.0);

    const numCombinations = 1 << n;

    for (let i = 0; i < numCombinations; i++) {
      let combinationProbability = 1.0;
      const combinationDamages = [];

      for (let j = 0; j < n; j++) {
        if ((i >> j) & 1) {
          combinationProbability *= critRateList[j];
          combinationDamages.push(critDamageList[j]);
        } else {
          combinationProbability *= 1 - critRateList[j];
          combinationDamages.push(originDamageList[j]);
        }
      }

      combinationDamages.sort((a, b) => b - a);

      for (let k = 0; k < n; k++) {
        expectedSortedDamages[k] += combinationDamages[k] * combinationProbability;
      }
    }

    let finalExpectedDamage = 0.0;
    for (let i = 0; i < n; i++) {
      const weight = damageDistributions[i] || 0;
      finalExpectedDamage += expectedSortedDamages[i] * weight;
    }

    return finalExpectedDamage;
  }

  private getRankings(arr: number[]) {
    const n = arr.length;

    const indexedList = arr.map((value, index) => ({value, index}));

    indexedList.sort((a, b) => b.value - a.value);

    const ranks = new Array(n);
    indexedList.forEach((item, rank) => {
      ranks[item.index] = rank;
    });

    return ranks;
  }
}
