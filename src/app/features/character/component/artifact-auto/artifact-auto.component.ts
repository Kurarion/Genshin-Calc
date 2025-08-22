import {DecimalPipe, PercentPipe} from '@angular/common';
import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  AbstractControl,
  UntypedFormControl,
  UntypedFormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {TranslateService} from '@ngx-translate/core';
import {
  ArtifactService,
  ArtifactStorageInfo,
  ArtifactStoragePartData,
  CalculatorService,
  Const,
  DamageParam,
  DamageResult,
  ExpansionPanelCommon,
  GenshinDataService,
  GlobalProgressService,
  LanguageService,
  NoCommaPipe,
  RelayoutMsgService,
  TYPE_SYS_LANG,
  DPSService,
  CharacterService,
  OverlayService,
} from 'src/app/shared/shared.module';
import type {EChartsOption} from 'echarts';
import {lastValueFrom, Subscription} from 'rxjs';

interface InputItem {
  name: string;
  title: string;
  isInput?: boolean;
  isSelect?: boolean;
  isSwitch?: boolean;
  hidden?: string[];
  hasEmpty?: boolean;
  isRequire: boolean;
  selectListName?: string;
  isSelectObjectList?: boolean;
  useNameMap?: 'default' | 'custom' | 'none';
  optionNameMap?: Record<string, string>;
  optionTranslationTag?: string;
  model: string;
  onChange: any;
  onSelectOpenedChanged?: any;
}

@Component({
  selector: 'app-artifact-auto',
  templateUrl: './artifact-auto.component.html',
  styleUrls: ['./artifact-auto.component.css'],
})
export class ArtifactAutoComponent extends ExpansionPanelCommon implements OnInit, OnDestroy {
  readonly isDPS = 'isDPS';
  readonly notDPS = 'notDPS';
  readonly isMix = 'isMix';
  readonly notMix = 'notMix';
  readonly optimalStep = 10;
  readonly step = 1;
  readonly minValid = 0;
  readonly maxValid = (4 + 5) * 5 * this.optimalStep;
  readonly maxValidEffective3 = (3 + 5) * 5 * this.optimalStep;
  readonly maxValidEffective2 = (2 + 5) * 5 * this.optimalStep;
  readonly maxValidEffective1 = (1 + 5) * 5 * this.optimalStep;
  readonly maxValidArray = [
    this.maxValidEffective1,
    this.maxValidEffective2,
    this.maxValidEffective3,
    this.maxValid,
  ];
  readonly damageTypeNameMap: Record<string, string> = {
    'originDmg': 'ORIGIN',
    'critDmg': 'CRIT',
    'expectDmg': 'EXPECT',
    'originVaporizeDmg': 'ORIGIN_VAPORIZE',
    'cirtVaporizeDmg': 'CRIT_VAPORIZE',
    'expectVaporizeDmg': 'EXPECT_VAPORIZE',
    'originMeltDmg': 'ORIGIN_MELT',
    'cirtMeltDmg': 'CRIT_MELT',
    'expectMeltDmg': 'EXPECT_MELT',
    'originAggravateDmg': 'ORIGIN_AGGRAVATE',
    'cirtAggravateDmg': 'CRIT_AGGRAVATE',
    'expectAggravateDmg': 'EXPECT_AGGRAVATE',
    'originSpreadDmg': 'ORIGIN_SPREAD',
    'cirtSpreadDmg': 'CRIT_SPREAD',
    'expectSpreadDmg': 'EXPECT_SPREAD',
    'overloadedDmg': 'OVERLOADED',
    'burningDmg': 'BURNING',
    'electroChargedDmg': 'ELECTROCHARGED',
    'superconductDmg': 'SUPERCONDUCT',
    'ruptureDmg': 'RUPTURE',
    'burgeonDmg': 'BURGEON',
    'hyperbloomDmg': 'HYPERBLOOM',
    'swirlCryoDmg': 'SWIRL_CRYO',
    'swirlElectroDmg': 'SWIRL_ELECTRO',
    'swirlElectroAggravateDmg': 'SWIRL_ELECTRO_AGGRAVATE',
    'swirlPyroDmg': 'SWIRL_PYRO',
    'swirlHydroDmg': 'SWIRL_HYDRO',
    'shieldHp': 'SHIELD',
    'destructionDmg': 'DESTRUCTION',

    'healing': 'HEALING',
    'product': 'PRODUCT',
    'shield': 'SHIELD',

    'originMoonElectroChargedDirectlyDmg': 'ORIGIN_MOON_ELECTROCHARGED_DIRECTLY',
    'cirtMoonElectroChargedDirectlyDmg': 'CRIT_MOON_ELECTROCHARGED_DIRECTLY',
    'expectMoonElectroChargedDirectlyDmg': 'EXPECT_MOON_ELECTROCHARGED_DIRECTLY',
    'originMoonElectroChargedReactionalDmg': 'ORIGIN_MOON_ELECTROCHARGED_REACTIONAL',
    'cirtMoonElectroChargedReactionalDmg': 'CRIT_MOON_ELECTROCHARGED_REACTIONAL',
    'expectMoonElectroChargedReactionalDmg': 'EXPECT_MOON_ELECTROCHARGED_REACTIONAL',
    'originMoonRuptureDirectlyDmg': 'ORIGIN_MOON_RUPTURE_DIRECTLY',
    'cirtMoonRuptureDirectlyDmg': 'CRIT_MOON_RUPTURE_DIRECTLY',
    'expectMoonRuptureDirectlyDmg': 'EXPECT_MOON_RUPTURE_DIRECTLY',
  };

  readonly subs = Const.PROPS_OPTIMAL_ARTIFACT_SUB;
  readonly subsMap: Map<string, number> = new Map([
    [Const.PROP_CRIT_RATE, 1],
    [Const.PROP_CRIT_DMG, 2],
    [Const.PROP_ATTACK_UP, 3],
    [Const.PROP_HP_UP, 4],
    [Const.PROP_DEFENSE_UP, 5],
    [Const.PROP_ELEMENTAL_MASTERY, 6],
    [Const.PROP_ENERGY_RECHARGE, 7],
    [Const.PROP_ATTACK, 8],
    [Const.PROP_HP, 9],
    [Const.PROP_DEFENSE, 0],
  ]);
  readonly subsSlotMap: Map<string, string[]> = new Map([
    [
      Const.PROP_CRIT_RATE,
      [Const.ARTIFACT_FLOWER.toLowerCase(), Const.ARTIFACT_SUB1.toLowerCase()],
    ],
    [Const.PROP_CRIT_DMG, [Const.ARTIFACT_FLOWER.toLowerCase(), Const.ARTIFACT_SUB2.toLowerCase()]],
    [
      Const.PROP_ATTACK_UP,
      [Const.ARTIFACT_FLOWER.toLowerCase(), Const.ARTIFACT_SUB3.toLowerCase()],
    ],
    [Const.PROP_HP_UP, [Const.ARTIFACT_FLOWER.toLowerCase(), Const.ARTIFACT_SUB4.toLowerCase()]],
    [
      Const.PROP_DEFENSE_UP,
      [Const.ARTIFACT_PLUME.toLowerCase(), Const.ARTIFACT_SUB1.toLowerCase()],
    ],
    [
      Const.PROP_ELEMENTAL_MASTERY,
      [Const.ARTIFACT_PLUME.toLowerCase(), Const.ARTIFACT_SUB2.toLowerCase()],
    ],
    [
      Const.PROP_ENERGY_RECHARGE,
      [Const.ARTIFACT_PLUME.toLowerCase(), Const.ARTIFACT_SUB3.toLowerCase()],
    ],
    [Const.PROP_ATTACK, [Const.ARTIFACT_PLUME.toLowerCase(), Const.ARTIFACT_SUB4.toLowerCase()]],
    [Const.PROP_HP, [Const.ARTIFACT_SANDS.toLowerCase(), Const.ARTIFACT_SUB1.toLowerCase()]],
    [Const.PROP_DEFENSE, [Const.ARTIFACT_SANDS.toLowerCase(), Const.ARTIFACT_SUB2.toLowerCase()]],
  ]);
  readonly defaultPoint: number = 250;

  readonly inputItems: InputItem[] = [
    {
      name: 'USE_DPS',
      title: 'USE_DPS',
      isSwitch: true,
      isRequire: true,
      model: 'useDPS',
      onChange: this.setUseDPS.bind(this),
    },
    {
      name: 'USED_DPS_INDEX',
      title: 'USED_DPS_INDEX',
      isSelect: true,
      isRequire: true,
      hasEmpty: false,
      selectListName: 'dpsIndexes',
      isSelectObjectList: true,
      model: 'usedDPSIndex',
      useNameMap: 'none',
      hidden: [this.notDPS],
      onChange: this.setUsedDPSIndex.bind(this),
      onSelectOpenedChanged: this.setDPSIndexList.bind(this),
    },
    {
      name: 'DAMAGE_RATE',
      title: 'DAMAGE_RATE',
      isInput: true,
      isRequire: true,
      model: 'damageRate',
      hidden: [this.isDPS],
      onChange: this.setDamageRate.bind(this),
    },
    {
      name: 'DAMAGE_BASE',
      title: 'DAMAGE_BASE',
      isSelect: true,
      isRequire: true,
      hasEmpty: true,
      selectListName: 'damageBaseList',
      optionTranslationTag: 'PROPS.',
      model: 'damageBase',
      hidden: [this.isDPS],
      onChange: this.setDamageBase.bind(this),
    },
    {
      name: 'DAMAGE_RATE_ATTACH',
      title: 'DAMAGE_RATE_ATTACH',
      isInput: true,
      isRequire: false,
      model: 'damageRateAttach',
      hidden: [this.isDPS, this.notMix],
      onChange: this.setDamageRateAttach.bind(this),
    },
    {
      name: 'DAMAGE_BASE_ATTACH',
      title: 'DAMAGE_BASE_ATTACH',
      isSelect: true,
      isRequire: false,
      hasEmpty: true,
      selectListName: 'damageBaseList',
      optionTranslationTag: 'PROPS.',
      model: 'damageBaseAttach',
      hidden: [this.isDPS, this.notMix],
      onChange: this.setDamageBaseAttach.bind(this),
    },
    {
      name: 'ELEMENT_TYPE',
      title: 'ELEMENT_TYPE',
      isSelect: true,
      isRequire: true,
      hasEmpty: true,
      selectListName: 'elementTypeList',
      optionTranslationTag: 'PROPS.',
      model: 'elementType',
      hidden: [this.isDPS],
      onChange: this.setElementType.bind(this),
    },
    {
      name: 'ATTACK_TYPE',
      title: 'ATTACK_TYPE',
      isSelect: true,
      isRequire: true,
      hasEmpty: true,
      selectListName: 'attackTypeList',
      optionTranslationTag: 'PROPS.',
      model: 'attackType',
      hidden: [this.isDPS],
      onChange: this.setAttackType.bind(this),
    },
    {
      name: 'DAMAGE_TYPE',
      title: 'DAMAGE_TYPE',
      isSelect: true,
      isRequire: true,
      hasEmpty: false,
      selectListName: 'damageTypeList',
      optionTranslationTag: 'GENSHIN.DMG.',
      useNameMap: 'custom',
      optionNameMap: this.damageTypeNameMap,
      model: 'damageType',
      hidden: [this.isDPS],
      onChange: this.setDamageType.bind(this),
    },
    {
      name: 'DAMAGE_TAG',
      title: 'DAMAGE_TAG',
      isSelect: true,
      isRequire: false,
      hasEmpty: true,
      selectListName: 'damageTagList',
      optionTranslationTag: 'TAG.',
      model: 'damageTag',
      hidden: [this.isDPS],
      onChange: this.setDamageTag.bind(this),
    },
    {
      name: 'MAX_CRIT_RATE',
      title: 'MAX_CRIT_RATE',
      isInput: true,
      isRequire: true,
      model: 'maxCritRate',
      onChange: this.setMaxCritRate.bind(this),
    },
  ];

  readonly maxCritRate: number = 101;
  readonly minCritRate: number = 5;
  readonly initDamageRate: number = 50;
  subsReverseMap: Map<string, string> = new Map();

  //キャラインデックス
  @Input('characterIndex') characterIndex!: number;
  //聖遺物セットインデックス
  @Input('index') index!: number;
  //データ
  data!: ArtifactStorageInfo;
  //ミクスタイプ
  isMixRate: boolean = false;

  userInput = new UntypedFormGroup({
    useDPS: new UntypedFormControl(false, Validators.required), //DPSを使用
    usedDPSIndex: new UntypedFormControl(1, this.useDPSValidator(true)), //使用したDPSインデックス
    damageRate: new UntypedFormControl(0, [Validators.min(0.01), this.useDPSValidator(false)]), //ダメージ倍率
    damageBase: new UntypedFormControl('', this.useDPSValidator(false)), //ダメージベース
    damageRateAttach: new UntypedFormControl(0, [Validators.min(0)]), //ダメージ倍率(追加)
    damageBaseAttach: new UntypedFormControl(''), //ダメージベース(追加)
    elementType: new UntypedFormControl('', this.useDPSValidator(false)), //元素タイプ
    attackType: new UntypedFormControl('', this.useDPSValidator(false)), //攻撃タイプ
    damageType: new UntypedFormControl('', this.useDPSValidator(false)), //ダメージタイプ
    damageTag: new UntypedFormControl(''), //タグ
    maxCritRate: new UntypedFormControl(0, [Validators.min(this.minCritRate)]), //最大会心率
  });

  userInputList: Record<string, (number | string | {name: any; value: any})[]> = {
    dpsIndexes: [],
    damageBaseList: [],
    elementTypeList: [],
    attackTypeList: [],
    damageTypeList: [],
    damageTagList: [],
  };

  userInputHiddenFlag: Set<string> = new Set<string>();
  userInputHiddenStatus: Map<string, boolean> = new Map<string, boolean>();

  // //ダメージ倍率
  // damageRate!: number;
  // //ダメージベース
  // damageBase!: string;
  // //元素タイプ
  // elementType!: string;
  // //攻撃タイプ
  // attackType!: string;
  // //ダメージタイプ
  // damageType!: string;
  // //タグ
  // damageTag!: string;

  //現在のポイント
  currentPoint = new UntypedFormControl({value: 0, disabled: true});
  //現在のポイント/10
  currentPointInput = new UntypedFormControl({value: 0, disabled: true});
  //結果
  resultCurve!: string;
  //有効個数
  effectNum!: number;
  //計算用結果
  resultForCalc!: Uint8Array;
  //更新必要
  needUpdate!: boolean;

  // damageBaseList!: string[];
  // elementTypeList!: string[];
  // attackTypeList!: string[];
  // damageTypeList!: string[];
  // damageTagList!: string[];

  //表示メソッド
  displayWith!: (value: number) => string | number;
  //Echarts
  echartsOption: EChartsOption = {
    tooltip: {
      trigger: 'item',
      formatter: (param: any) => {
        const prop = this.subs[param.value[2]];
        const addVal =
          this.genshinDataService.getOptimalReliquaryAffixStep(prop) * 10 * param.value[1];
        let sign = '';
        let valStr = '';
        if (param.name != 0) {
          if (
            [
              Const.PROP_ELEMENTAL_MASTERY,
              Const.PROP_ATTACK,
              Const.PROP_HP,
              Const.PROP_DEFENSE,
            ].includes(prop)
          ) {
            valStr = this.noCommaPipe.transform(
              this.decimalPipe.transform(addVal, '1.0-1') as string,
            );
          } else {
            valStr = this.percentPipe.transform(addVal, '1.0-1') as string;
          }
          sign = addVal > 0 ? '+' : '';
        }
        return `<div style="margin: 0px 0 0;line-height:1;">
        <span style="display:inline-block;margin-right:2px;border-radius:10px;width:10px;height:10px;background-color:${param.color};"></span>
        <span style="font-size:14px;color:#666;font-weight:400;margin-left:2px;margin-right:5px">${param.name}<span style="font-size:9px;color:#666;font-weight:700;margin-left:2px;">(${param.percent + '%'})</span></span>
        <span style="float:right;font-size:12px;${addVal < 0 ? 'color:#91cc75;' : 'color:#fc8452;'}font-weight:700;margin-left:0px">${sign}${valStr}</span>
        <div style="clear:both"></div></div> `;
      },
    },
    legend: {
      align: 'auto',
      bottom: 10,
      data: [],
    },
    dataset: {
      source: [],
    },
    series: [
      {
        type: 'pie',
        radius: [8, 75],
        center: ['50%', '40%'],
        roseType: 'radius',
        encode: {itemName: 0, value: 1, propIndex: 2},
      },
    ],
  };
  langChange!: Subscription;
  hasClickCal: boolean = false;

  constructor(
    private artifactService: ArtifactService,
    private genshinDataService: GenshinDataService,
    private calculatorService: CalculatorService,
    private percentPipe: PercentPipe,
    private decimalPipe: DecimalPipe,
    private noCommaPipe: NoCommaPipe,
    private matSnackBar: MatSnackBar,
    private translateService: TranslateService,
    private relayoutMsgService: RelayoutMsgService,
    private DPSService: DPSService,
    private characterService: CharacterService,
    private languageService: LanguageService,
    private globalProgressService: GlobalProgressService,
    private overlayService: OverlayService,
  ) {
    super(relayoutMsgService);
    this.subsMap.forEach((v, k) => {
      this.subsReverseMap.set(v.toString(), k);
    });
    this.effectNum = 1;
    this.setDisplayWith();
    this.langChange = this.languageService.getLang().subscribe((lang: TYPE_SYS_LANG) => {
      this.getAllPropsData();
    });
  }

  setDisplayWith() {
    this.displayWith = (value: number) => {
      return this.percentPipe.transform(
        value / this.maxValidArray[this.effectNum - 1],
        '1.0-0',
      ) as string;
    };
  }

  ngOnInit(): void {
    //チェックミクス
    this.isMixRate = Const.PROPS_HAS_MIX_RATE.has(this.characterIndex.toString());
    this.userInputHiddenFlag.add(this.isMixRate ? this.isMix : this.notMix);
    this.calcHiddenStatus();
    this.initList();
    this.initData();
  }

  @HostListener('window:unload')
  ngOnDestroy(): void {
    //データ保存
    this.artifactService.saveData();
    //言語検知取り消し
    if (this.langChange && !this.langChange.closed) {
      this.langChange.unsubscribe();
    }
  }

  initData() {
    this.data = this.artifactService.getAllStorageInfo(this.characterIndex, this.index);
    this.userInput.get('useDPS')?.setValue(this.data.autoUseDPS ?? false);
    this.userInput.get('usedDPSIndex')?.setValue(this.data.autoUsedDPSIndex ?? 0);
    this.userInput.get('damageRate')?.setValue(this.data.autoDamageRate ?? this.initDamageRate);
    this.userInput.get('damageBase')?.setValue(this.data.autoDamageBase ?? '');
    this.userInput.get('damageRateAttach')?.setValue(this.data.autoDamageRateAttach ?? 0);
    this.userInput.get('damageBaseAttach')?.setValue(this.data.autoDamageBaseAttach ?? '');
    this.userInput.get('elementType')?.setValue(this.data.autoElementType ?? '');
    this.userInput.get('attackType')?.setValue(this.data.autoAttackType ?? '');
    this.userInput.get('damageType')?.setValue(this.data.autoDamageType ?? '');
    this.userInput.get('damageTag')?.setValue(this.data.autoDamageTag ?? '');
    this.userInput.get('maxCritRate')?.setValue(this.data.autoMaxCritRate ?? this.maxCritRate);
    this.needUpdate = this.data.autoNeedUpdate ?? true;
    this.effectNum = this.data.autoEffectNum ?? 0;
    this.currentPoint.setValue(this.data.autoPropCurrentPoint ?? 0);
    this.currentPointInput.setValue(this.currentPoint.value / 10);
    this.resultCurve = this.data.autoPropCurve ?? '';
    if (this.resultCurve.length > 0) {
      this.currentPoint.enable();
      this.currentPointInput.enable();
    }
    //初期化表示
    this.setElementType(this.userInput.get('elementType')?.value);
    this.setUseDPS(this.userInput.get('useDPS')?.value);
    //初期化処理
    this.setDisplayWith();
    this.getAllPropsData();
  }

  initList() {
    this.userInputList['dpsIndexes'] = [];
    this.userInputList['damageBaseList'] = Const.PROPS_OPTIMAL_DAMAGE_BASE_LIST;
    this.userInputList['damageBaseListAttach'] = Const.PROPS_OPTIMAL_DAMAGE_BASE_LIST;
    this.userInputList['elementTypeList'] = Const.PROPS_OPTIMAL_ELEMENT_TYPE_LIST;
    this.userInputList['attackTypeList'] = Const.PROPS_OPTIMAL_ATTACK_TYPE_LIST;
    this.userInputList['damageTypeList'] = [];
    this.userInputList['damageTagList'] =
      Const.PROPS_TAG_MAP.get(this.characterIndex.toString()) ?? [];
    this.resultForCalc = new Uint8Array(this.maxValid);
  }

  setUseDPS(value: boolean) {
    if (value != this.data.autoUseDPS) {
      this.willNeedUpdate();
    }
    this.data.autoUseDPS = value;
    if (value) {
      this.userInputHiddenFlag.delete(this.notDPS);
      this.userInputHiddenFlag.add(this.isDPS);
    } else {
      this.userInputHiddenFlag.delete(this.isDPS);
      this.userInputHiddenFlag.add(this.notDPS);
    }
    this.calcHiddenStatus();
    if (this.userInput?.get('useDPS')?.value) {
      this.setDPSIndexList();
    } else {
      this.userInputList['dpsIndexes'] = [];
    }
    this.onExpandStatusChanged();
  }

  setUsedDPSIndex(value: number) {
    if (value != this.data.autoUsedDPSIndex) {
      this.willNeedUpdate();
    }
    this.data.autoUsedDPSIndex = value;
  }

  setDamageRate(value: number) {
    if (value != this.data.autoDamageRate) {
      this.willNeedUpdate();
    }
    this.data.autoDamageRate = value;
  }

  setDamageBase(value: string) {
    if (value != this.data.autoDamageBase) {
      this.willNeedUpdate();
    }
    this.data.autoDamageBase = value;
  }

  setDamageRateAttach(value: number) {
    if (value != this.data.autoDamageRateAttach) {
      this.willNeedUpdate();
    }
    this.data.autoDamageRateAttach = value;
  }

  setDamageBaseAttach(value: string) {
    if (value != this.data.autoDamageBaseAttach) {
      this.willNeedUpdate();
    }
    this.data.autoDamageBaseAttach = value;
  }

  setElementType(value: string) {
    if (value != this.data.autoElementType) {
      this.willNeedUpdate();
    }
    this.data.autoElementType = value;
    if (
      this.userInput.get('elementType')!.value != undefined &&
      this.userInput.get('elementType')!.value.length > 0
    ) {
      this.userInputList['damageTypeList'] = Const.PROPS_OPTIMAL_DAMAGE_TYPE_LIST_MAP.get(
        this.userInput.get('elementType')!.value as string,
      ) as (keyof DamageResult)[];
    } else {
      this.userInputList['damageTypeList'] = [];
    }
    this.onExpandStatusChanged();
  }

  setAttackType(value: string) {
    if (value != this.data.autoAttackType) {
      this.willNeedUpdate();
    }
    this.data.autoAttackType = value;
  }

  setDamageType(value: string) {
    if (value != this.data.autoDamageType) {
      this.willNeedUpdate();
    }
    this.data.autoDamageType = value;
  }

  setDamageTag(value: string) {
    if (value != this.data.autoDamageTag) {
      this.willNeedUpdate();
    }
    this.data.autoDamageTag = value;
  }

  setMaxCritRate(value: number) {
    if (value != this.data.autoMaxCritRate) {
      this.willNeedUpdate();
    }
    // setTimeout(()=>{
    // if(value > this.maxCritRate){
    //   this.userInput.get('maxCritRate')!.setValue(this.maxCritRate);
    // }
    // if(value < this.minCritRate){
    //   this.userInput.get('maxCritRate')!.setValue(this.minCritRate);
    // }
    this.data.autoMaxCritRate = this.userInput.get('maxCritRate')!.value as number;
    // })
  }

  setNeedUpdate(value = true) {
    this.data.autoNeedUpdate = value;
  }

  willNeedUpdate(value = true) {
    this.needUpdate = value;
    this.setNeedUpdate();
  }

  setPropCurve(value: string) {
    this.data.autoPropCurve = value;
  }

  setPropEffectNum(value: number) {
    this.data.autoEffectNum = value;
  }

  setPropCurrentPoint(value: number) {
    this.data.autoPropCurrentPoint = value;
    this.calcActualProp();
  }

  resetActualProp() {
    this.subsSlotMap.forEach((v, k) => {
      (this.data[v[0] as keyof ArtifactStorageInfo] as ArtifactStoragePartData)[v[1]].name = k;
      (this.data[v[0] as keyof ArtifactStorageInfo] as ArtifactStoragePartData)[v[1]].value = 0;
    });
  }

  calcActualProp() {
    if (this.currentPoint.value <= this.resultCurve.length) {
      this.resetActualProp();
      for (let i = 0; i < this.currentPoint.value; ++i) {
        let prop = this.subsReverseMap.get(this.resultCurve[i])!;
        let slot = this.subsSlotMap.get(prop)!;
        (this.data[slot[0] as keyof ArtifactStorageInfo] as ArtifactStoragePartData)[
          slot[1]
        ].value! += this.genshinDataService.getOptimalReliquaryAffixStep(prop);
      }
    }
    //更新
    this.calculatorService.setDirtyFlag(this.characterIndex);
    this.artifactService.next();
    this.setDisplayWith();
    this.getAllPropsData();
  }

  onChangeCurrentPointSlider() {
    if (this.currentPoint.value > this.maxValidArray[this.effectNum - 1]) {
      this.currentPoint.setValue(this.maxValidArray[this.effectNum - 1]);
    }
    if (this.currentPoint.value < this.minValid) {
      this.currentPoint.setValue(0);
    }
    this.currentPointInput.setValue(this.getDisplayValue(this.currentPoint.value));
    this.setPropCurrentPoint(this.currentPoint.value);
  }

  onChangeCurrentPointInput() {
    this.currentPointInput.setValue(
      parseFloat((Math.floor(this.currentPointInput.value * 10) / 10).toFixed(1)),
    );
    this.currentPoint.setValue(this.getRowValue(this.currentPointInput.value));
    this.onChangeCurrentPointSlider();
  }

  async getAllPropsData() {
    //リフレッシュ
    this.echartsOption = {...this.echartsOption};
    //データ準備
    const curve = this.data.autoPropCurve ?? '';
    const resultArray: number[] = new Array(this.subs.length).fill(0);
    const dataSetitems = [];
    //計算
    for (let i = 0; i < curve.length && i < this.currentPoint.value; ++i) {
      resultArray[parseInt(curve[i])] += 0.1;
    }
    for (let i = 0; i < this.subs.length; ++i) {
      const value = resultArray[this.subsMap.get(this.subs[i])!];
      if (value > 0) {
        dataSetitems.push([
          this.subs[i],
          Math.floor(resultArray[this.subsMap.get(this.subs[i])!] * 100) / 100,
          i,
        ]);
      }
    }
    //ソート
    dataSetitems.sort((a: any, b: any) => {
      return a[1] - b[1];
    });
    //タイトル設定
    const awaitArray = [];
    for (let i = 0; i < dataSetitems.length; ++i) {
      awaitArray.push(lastValueFrom(this.translateService.get(`PROPS.${dataSetitems[i][0]}`)));
    }
    const legendItems = await Promise.all(awaitArray);
    //タイトル更新
    for (let i = 0; i < dataSetitems.length; ++i) {
      dataSetitems[i][0] = legendItems[i];
    }
    //値を反映
    const temp1 = this.echartsOption.dataset;
    const temp2 = this.echartsOption.legend;
    if (!Array.isArray(temp1)) {
      (temp1!.source as any[]) = dataSetitems;
    }
    if (!Array.isArray(temp2)) {
      (temp2!.data as any[]) = legendItems;
    }
  }

  async optimize() {
    if (this.hasClickCal) {
      return;
    }
    this.globalProgressService.setMode('buffer');
    this.globalProgressService.setValue(0);
    this.hasClickCal = true;
    return new Promise<void>((resolve, reject) => {
      this.overlayService.showLoading();
      //チェック
      let hasError = false;
      for (let [key, hidden] of this.userInputHiddenStatus.entries()) {
        if (!hidden) {
          this.userInput.get(key)!.markAsDirty();
          this.userInput.get(key)!.markAsTouched();
          const controlErrors: ValidationErrors | undefined | null =
            this.userInput!.get(key)?.errors;
          if (controlErrors != null && controlErrors != undefined) {
            hasError = true;
          }
        }
      }
      if (hasError) {
        reject();
        return;
      }

      setTimeout(() => {
        //リセット
        this.currentPoint.setValue(0);
        this.currentPointInput.setValue(this.getDisplayValue(this.currentPoint.value));
        this.setPropCurrentPoint(this.currentPoint.value);

        //DPS
        const isDPS = this.userInput.get('useDPS')!.value;
        const selectedDPSIndex = this.userInput.get('usedDPSIndex')!.value - 1;
        const params: DamageParam[] = [];
        const damageTypes: string[] = [];
        const times: number[] = [];

        if (isDPS) {
          const len = this.DPSService.getStorageInfoLength(this.characterIndex);
          let isFailed = false;
          let failedMsg = '';
          switch (null) {
            default: {
              //存在チェック
              if (len <= selectedDPSIndex) {
                //存在しないDPSインデックス
                this.setDPSIndexList();
                this.userInput.get('usedDPSIndex')?.setValue(1);
                this.setUsedDPSIndex(1);
                //失敗
                isFailed = true;
                failedMsg = 'AUTO.NOT_EXIT_DPS_INDEX';
                break;
              }
              //DPS詳細リスト取得
              const info = this.DPSService.getStorageInfo(this.characterIndex, selectedDPSIndex);
              for (let i = 0; i < info.dmgs.length; ++i) {
                const dmg = info.dmgs[i];
                const skill = dmg.skill;
                const valueIndexes = dmg.valueIndexes;
                const resultIndex = dmg.resultIndex;
                const skillIndex = dmg.skillIndex;
                const dmgTimes = dmg.times ?? 1;
                //元素付与
                let overrideElement = '';
                if (skill === Const.NAME_SKILLS_NORMAL) {
                  overrideElement = this.characterService.getOverrideElement(this.characterIndex);
                }
                const dmgValues = this.calculatorService.getSkillDmgValue(
                  this.characterIndex,
                  skill,
                  valueIndexes,
                  overrideElement,
                  skillIndex,
                  true,
                );
                const dmgParam = dmgValues[1][resultIndex];
                //入力パラメータ設定
                params.push(dmgParam);
                damageTypes.push(dmg.damageProp);
                times.push(dmgTimes);
              }
              //チェック
              if (params.length < 1) {
                //失敗
                isFailed = true;
                failedMsg = 'AUTO.BLANK_DPS_LIST';
                break;
              }
            }
          }
          //失敗した場合
          if (isFailed) {
            this.resultCurve = '';
            this.currentPoint.disable();
            this.currentPointInput.disable();
            this.effectNum = 0;
            this.setPropEffectNum(this.effectNum);
            this.setPropCurve(this.resultCurve);
            this.setPropCurrentPoint(this.currentPoint.value);
            this.getAllPropsData();
            reject(failedMsg);
            return;
          }
        } else {
          const param: DamageParam = {
            rate: (this.userInput.get('damageRate')!.value as number) / 100,
            base: this.userInput.get('damageBase')!.value as string,
            rateAttach: [],
            baseAttach: [],
            elementBonusType: this.userInput.get('elementType')!.value as string,
            attackBonusType: this.userInput.get('attackType')!.value as string,
            tag: (this.userInput.get('damageTag')!.value as string) ?? undefined,
          };
          if (this.isMixRate) {
            if (
              this.userInput.get('damageRateAttach')!.value !== 0 &&
              this.userInput.get('damageBase')!.value !== ''
            ) {
              param.rateAttach = [
                [(this.userInput.get('damageRateAttach')!.value as number) / 100],
              ];
              param.baseAttach = [this.userInput.get('damageBaseAttach')!.value as string];
            }
          }
          const damageType = this.userInput.get('damageType')!.value;
          //入力パラメータ設定
          params.push(param);
          damageTypes.push(damageType);
          times.push(1);
        }

        let calcResult: DamageResult;
        let actualEffectSet = new Set();
        let tempResultForCalc = new Uint8Array(this.maxValid);
        let actualEffectNum: number = 0;
        let maxCritRate: number = (this.userInput.get('maxCritRate')!.value as number) / 100;
        let extraData: Record<string, number> = {};
        for (let key of this.subs) {
          extraData[key] = 0;
        }
        let lastLoopMaxValue = 0;
        const steps = this.maxValid;
        let step = this.minValid;
        let errorFlag = false;
        let errorMsg = '';
        const calcFunc = () => {
          //計算
          let tempExtraData = {...extraData};
          let currentLoopMaxProp = '';
          let currentLoopMaxValue = lastLoopMaxValue;
          for (let key of this.subs) {
            let oldValue = tempExtraData[key];
            let finalDamageVal = 0;
            let critOverflow = false;
            let reuseDatas = undefined;
            tempExtraData[key] += this.genshinDataService.getOptimalReliquaryAffixStep(key);
            for (let i = 0; i < params.length; ++i) {
              const param = params[i];
              calcResult = this.calculatorService.getDamage(
                this.characterIndex,
                param,
                tempExtraData,
                reuseDatas,
              );
              reuseDatas = calcResult.tempAllDate;
              finalDamageVal +=
                ((calcResult[damageTypes[i] as keyof DamageResult] as number) ?? 0) * times[i];
              if (key == Const.PROP_CRIT_RATE && calcResult.displayCritRate > maxCritRate) {
                critOverflow = true;
                break;
              }
            }
            if (critOverflow) {
              continue;
            }
            if (currentLoopMaxValue < finalDamageVal) {
              currentLoopMaxProp = key;
              tempResultForCalc[step] = this.subsMap.get(currentLoopMaxProp)!;
              currentLoopMaxValue = finalDamageVal;
            }
            tempExtraData[key] = oldValue;
          }
          //無効なる計算
          if (currentLoopMaxValue == 0 || currentLoopMaxValue == lastLoopMaxValue) {
            errorFlag = true;
            errorMsg = 'AUTO.NO_RESULT';
          }
          actualEffectSet.add(currentLoopMaxProp);
          extraData[currentLoopMaxProp] +=
            this.genshinDataService.getOptimalReliquaryAffixStep(currentLoopMaxProp);
          lastLoopMaxValue = currentLoopMaxValue;

          ++step;
          //エラーチェック
          if (errorFlag) {
            this.resultCurve = '';
            this.currentPoint.disable();
            this.currentPointInput.disable();
            this.effectNum = 0;
            this.setPropEffectNum(this.effectNum);
            this.setPropCurve(this.resultCurve);
            this.setPropCurrentPoint(this.currentPoint.value);
            this.getAllPropsData();
            reject(errorMsg);
            return;
          }
          //判断
          if (step < steps) {
            //ループ
            this.globalProgressService.setValue((step / steps) * 104);
            setTimeout(calcFunc);
          } else {
            this.globalProgressService.setValue(100);
            //計算終了処理
            actualEffectNum = actualEffectSet.size;

            this.resultForCalc = tempResultForCalc;
            this.resultCurve = this.resultForCalc.join('');
            this.currentPoint.setValue(this.defaultPoint);
            this.currentPoint.enable();
            this.currentPointInput.setValue(this.defaultPoint / 10);
            this.currentPointInput.enable();
            this.effectNum =
              actualEffectNum > this.maxValidArray.length - 1
                ? this.maxValidArray.length - 1
                : actualEffectNum;
            this.setPropEffectNum(this.effectNum);
            this.setPropCurve(this.resultCurve);
            this.setPropCurrentPoint(this.currentPoint.value);
            this.willNeedUpdate(false);
            this.getAllPropsData();
            resolve();
          }
        };
        setTimeout(calcFunc);
        // for(let i = this.minValid; i <= this.maxValid; ++i){
        //   let tempExtraData = {...extraData};
        //   let currentLoopMaxProp = "";
        //   let currentLoopMaxValue = lastLoopMaxValue;
        //   for(let key of this.subs){
        //     let oldValue = tempExtraData[key];
        //     let finalDamageVal = 0;
        //     let critOverflow = false;
        //     let reuseDatas = undefined;
        //     tempExtraData[key] += this.genshinDataService.getOptimalReliquaryAffixStep(key);
        //     for(let i = 0; i < params.length; ++i){
        //       const param = params[i];
        //       calcResult = this.calculatorService.getDamage(this.characterIndex, param, tempExtraData, reuseDatas);
        //       reuseDatas = calcResult.tempAllDate;
        //       finalDamageVal += (calcResult[damageTypes[i] as keyof DamageResult] as number ?? 0) * times[i];
        //       if(key == Const.PROP_CRIT_RATE && calcResult.displayCritRate > maxCritRate){
        //         critOverflow = true
        //         break;
        //       }
        //     }
        //     if(critOverflow){
        //       continue;
        //     }
        //     if(currentLoopMaxValue < finalDamageVal){
        //       currentLoopMaxProp = key;
        //       tempResultForCalc[i] = this.subsMap.get(currentLoopMaxProp)!;
        //       currentLoopMaxValue = finalDamageVal;
        //     }
        //     tempExtraData[key] = oldValue;
        //   }
        //   //無効なる計算
        //   if(currentLoopMaxValue == 0 || currentLoopMaxValue == lastLoopMaxValue){
        //     this.resultCurve = '';
        //     this.currentPoint.disable();
        //     this.currentPointInput.disable();
        //     this.effectNum = 0;
        //     this.setPropEffectNum(this.effectNum);
        //     this.setPropCurve(this.resultCurve);
        //     this.setPropCurrentPoint(this.currentPoint.value);
        //     this.getAllPropsData();
        //     reject('AUTO.NO_RESULT');
        //     return;
        //   }
        //   actualEffectSet.add(currentLoopMaxProp);
        //   extraData[currentLoopMaxProp] += this.genshinDataService.getOptimalReliquaryAffixStep(currentLoopMaxProp);
        //   lastLoopMaxValue = currentLoopMaxValue;
        // }

        // actualEffectNum = actualEffectSet.size;

        // this.resultForCalc = tempResultForCalc;
        // this.resultCurve = this.resultForCalc.join('');
        // this.currentPoint.setValue(this.defaultPoint);
        // this.currentPoint.enable();
        // this.currentPointInput.setValue(this.defaultPoint / 10);
        // this.currentPointInput.enable();
        // this.effectNum = (actualEffectNum > this.maxValidArray.length - 1)?this.maxValidArray.length - 1:actualEffectNum;
        // this.setPropEffectNum(this.effectNum);
        // this.setPropCurve(this.resultCurve);
        // this.setPropCurrentPoint(this.currentPoint.value);
        // this.willNeedUpdate(false);
        // this.getAllPropsData();
        // resolve();
      });
    })
      .then(() => {
        //完了
        this.translateService.get('AUTO.DONE').subscribe((res: string) => {
          this.matSnackBar.open(res, undefined, {
            duration: 1000,
          });
        });
      })
      .catch((error: string) => {
        //失敗
        this.translateService.get(error ?? 'AUTO.FAILED').subscribe((res: string) => {
          this.matSnackBar.open(res, undefined, {
            duration: 1000,
          });
        });
      })
      .finally(() => {
        this.globalProgressService.setMode('determinate');
        this.globalProgressService.setValue(100);
        this.hasClickCal = false;
        this.overlayService.hideLoading();
      });
  }

  getRowValue(v: number, base = 10) {
    return parseInt((v * base).toFixed(0));
  }

  getDisplayValue(v: number, base = 10) {
    return parseFloat((v / base).toFixed(1));
  }

  useDPSValidator(inDPS: boolean) {
    return (control: AbstractControl): ValidationErrors | null => {
      const useDPS = this.userInput?.get('useDPS')?.value ?? false;
      if (useDPS === inDPS) {
        return Validators.required(control);
      }
      return null;
    };
  }

  calcHiddenStatus() {
    const tempMap = new Map<string, boolean>();
    this.inputItems.forEach((item: InputItem) => {
      let state = false;
      if (item.hidden) {
        state = item.hidden.some((v) => this.userInputHiddenFlag.has(v));
      }
      tempMap.set(item.model, state);
    });
    this.userInputHiddenStatus = tempMap;
  }

  setDPSIndexList() {
    const tags = this.DPSService.getStorageInfoTags(this.characterIndex);
    this.userInputList['dpsIndexes'] = Array.from({length: tags.length}).map((_, i) => {
      const index = i + 1;
      const outline = tags[i];
      const hasTag = outline.length > 0;
      let tag = outline;
      let name = '';
      if (outline.length > 11) {
        tag = outline.substring(0, 11).trimEnd() + '...';
      }
      if (hasTag) {
        name = index.toString() + ' (' + tag + ')';
      } else {
        name = index.toString();
      }

      return {
        name: name,
        value: index,
      };
    });
  }
}
