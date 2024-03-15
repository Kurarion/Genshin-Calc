import { ChangeDetectionStrategy, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatSliderChange } from '@angular/material/slider';
import { lastValueFrom, Subscription } from 'rxjs';
import { CalculatorService, DamageResult, HealingResult, character, Const, CharacterService, CharacterStorageInfo, enemy, EnemyService, EnemyStorageInfo, ExtraCharacter, ExtraData, ExtraDataService, ExtraDataStorageInfo, ExtraWeapon, weapon, WeaponService, WeaponStorageInfo, ShieldResult, ProductResult, BuffResult, RelayoutMsgService, DamageParam, GenshinDataService, TYPE_SYS_LANG, LanguageService, NoCommaPipe, DPSService, DmgInfo, ExtraInfoService, ExtraInfoStatus, HealingParam, ShieldParam, ProductParam } from 'src/app/shared/shared.module';
import { environment } from 'src/environments/environment';
import type { EChartsOption } from 'echarts';
import { TranslateService } from '@ngx-translate/core';
import { DecimalPipe, PercentPipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

const type_damage = "damage";
const type_healing = "healing";
const type_shield = "shield";
const type_product = "product";

type ValueType = typeof type_damage | typeof type_healing | typeof type_shield | typeof type_product
type ValueParam = DamageParam | HealingParam | ShieldParam | ProductParam | undefined
type ValueResult = DamageResult | HealingResult | ShieldResult | ProductResult | undefined

@Component({
  selector: 'app-extra-data',
  templateUrl: './extra-data.component.html',
  styleUrls: ['./extra-data.component.css']
})
export class ExtraDataComponent implements OnInit, OnDestroy, OnChanges {

  private readonly colorMap: Record<string, string> = {
    [Const.ELEMENT_CRYO]: Const.ELEMENT_COLOR_MAP['CRYO'] + environment.elementColorAlpha,
    [Const.ELEMENT_ANEMO]: Const.ELEMENT_COLOR_MAP['ANEMO'] + environment.elementColorAlpha,
    [Const.ELEMENT_PHYSICAL]: Const.ELEMENT_COLOR_MAP['PHYSICAL'] + environment.elementColorAlpha,
    [Const.ELEMENT_NONE]: Const.ELEMENT_COLOR_MAP['PHYSICAL'] + environment.elementColorAlpha,
    [Const.ELEMENT_ELECTRO]: Const.ELEMENT_COLOR_MAP['ELECTRO'] + environment.elementColorAlpha,
    [Const.ELEMENT_GEO]: Const.ELEMENT_COLOR_MAP['GEO'] + environment.elementColorAlpha,
    [Const.ELEMENT_PYRO]: Const.ELEMENT_COLOR_MAP['PYRO'] + environment.elementColorAlpha,
    [Const.ELEMENT_HYDRO]: Const.ELEMENT_COLOR_MAP['HYDRO'] + environment.elementColorAlpha,
    [Const.ELEMENT_DENDRO]: Const.ELEMENT_COLOR_MAP['DENDRO'] + environment.elementColorAlpha,
  }

  readonly subs = Const.PROPS_OPTIMAL_ARTIFACT_ALL_SUB;
  readonly stepRange = 9;
  readonly dmgPropList: (keyof DamageResult)[] = [
    'originDmg',
    'critDmg',
    'expectDmg',
    'originVaporizeDmg',
    'cirtVaporizeDmg',
    'expectVaporizeDmg',
    'originMeltDmg',
    'cirtMeltDmg',
    'expectMeltDmg',
    'originAggravateDmg',
    'cirtAggravateDmg',
    'expectAggravateDmg',
    'originSpreadDmg',
    'cirtSpreadDmg',
    'expectSpreadDmg',
    'overloadedDmg',
    'burningDmg',
    'electroChargedDmg',
    'superconductDmg',
    'ruptureDmg',
    'burgeonDmg',
    'hyperbloomDmg',
    'swirlCryoDmg',
    'swirlElectroDmg',
    'swirlElectroAggravateDmg',
    'swirlPyroDmg',
    'swirlHydroDmg',
    'shieldHp',
    'shieldSpecialHp',
    'destructionDmg',
  ];
  readonly notAddToDPSPropList: (keyof DamageResult)[] = [
    'shieldHp',
    'shieldSpecialHp',
  ]
  readonly healingPropList: (keyof HealingResult)[] = [
    'healing',
  ];
  readonly productPropList: (keyof ProductResult)[] = [
    'product',
  ];
  readonly shieldPropList: (keyof ShieldResult)[] = [
    'shield',
    'shieldCryo',
    'shieldAnemo',
    'shieldPhysical',
    'shieldElectro',
    'shieldGeo',
    'shieldPyro',
    'shieldHydro',
    'shieldDendro',
  ];

  readonly propNameMap: Record<string, string> = {
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
    'shieldSpecialHp': 'SHIELD_SPECIAL',
    'destructionDmg': 'DESTRUCTION',

    'healing': 'HEALING',
    'product': 'PRODUCT',
    'shield': 'SHIELD',
    'shieldCryo': 'SHIELD_CRYO',
    'shieldAnemo': 'SHIELD_ANEMO',
    'shieldPhysical': 'SHIELD_PHYSICAL',
    'shieldElectro': 'SHIELD_ELECTRO',
    'shieldGeo': 'SHIELD_GEO',
    'shieldPyro': 'SHIELD_PYRO',
    'shieldHydro': 'SHIELD_HYDRO',
    'shieldDendro': 'SHIELD_DENDRO',
  };

  readonly processNameMap: Record<string, string> = {
    'dmgSectionValueProcess': 'DMG_DMG_SECTION',
    'critRateSectionValueProcess': 'DMG_CRITE_RATE',
    'critDmgSectionValueProcess': 'DMG_CRITE_DMG',
    'critExpectDmgSectionValueProcess': 'DMG_CRITE_EXPECT',
    'dmgUpSectionValueProcess': 'DMG_DMG_UP',
    'dmgAntiSectionValueProcess': 'DMG_DMG_ANTI',
    'dmgAntiSectionMinusOnlyValueProcess': 'DMG_DMG_ANTI_ONLY_MINUS',
    'defenceSectionValueProcess': 'DMG_DEFENCE_SECTION',
    'cryoAntiProcess': 'DMG_CRYO_ANTI',
    'anemoAntiProcess': 'DMG_ANEMO_ANTI',
    'physicalAntiProcess': 'DMG_PHYSICAL_ANTI',
    'electroAntiProcess': 'DMG_ELECTRO_ANTI',
    'geoAntiProcess': 'DMG_GEO_ANTI',
    'pyroAntiProcess': 'DMG_PYRO_ANTI',
    'hydroAntiProcess': 'DMG_HYDRO_ANTI',
    'dendroAntiProcess': 'DMG_DENDRO_ANTI',
    'vaporProcess': 'DMG_VAPORIZE_RATE',
    'meltProcess': 'DMG_MELT_RATE',
    'burningBaseProcess': 'DMG_BURNING_BASE',
    'burningRateProcess': 'DMG_BURNING_RATE',
    'superconductBaseProcess': 'DMG_SUPERCONDUCT_BASE',
    'superconductRateProcess': 'DMG_SUPERCONDUCT_RATE',
    'swirlBaseProcess': 'DMG_SWIRL_BASE',
    'swirlRateProcess': 'DMG_SWIRL_RATE',
    'swirlElectroAggravateBaseProcess': 'DMG_SWIRL_ELECTRO_AGGRAVATE_BASE',
    'swirlElectroAggravateRateProcess': 'DMG_SWIRL_ELECTRO_AGGRAVATE_RATE',
    'electroChargedRateProcess': 'DMG_ELECTRO_CHARGED_RATE',
    'electroChargedBaseProcess': 'DMG_ELECTRO_CHARGED_BASE',
    'destructionRateProcess': 'DMG_DESTRUCTION_RATE',
    'destructionBaseProcess': 'DMG_DESTRUCTION_BASE',
    'overloadedRateProcess': 'DMG_OVERLOADED_RATE',
    'overloadedBaseProcess': 'DMG_OVERLOADED_BASE',
    'shieldRateProcess': 'DMG_SHIELD_RATE',
    'shieldBaseProcess': 'DMG_SHIELD_BASE',
    'aggravateDmgBaseProcess': 'DMG_AGGRAVATE_BASE',
    'spreadDmgBaseProcess': 'DMG_SPREAD_BASE',
    'hyperbloomRateProcess': 'DMG_HYPER_BLOOM_RATE',
    'hyperbloomBaseProcess': 'DMG_HYPER_BLOOM_BASE',
    'burgeonRateProcess': 'DMG_BURGEON_RATE',
    'burgeonBaseProcess': 'DMG_BURGEON_BASE',
    'ruptureRateProcess': 'DMG_RUPTURE_RATE',
    'ruptureBaseProcess': 'DMG_RUPTURE_BASE',
    'shieldSpecialRateProcess': 'DMG_SHIELD_SPECIAL_RATE',

    'healingProcess': 'HEALING_BASE',
    'healingUpProcess': 'HEALING_UP',

    'shieldProcess': 'SHIELD_BASE',
    'shieldSpecialUpProcess': 'SHIELD_SPECIAL_UP',
    'shieldCommonUpProcess': 'SHIELD_COMMON_UP',
    'specialElementAbsProcess': 'SHIELD_SPECIAL_ELEMENT_ABS',
    'geoElementAbsProcess': 'SHIELD_GEO_ELEMENT_ABS',

    'productProcess': 'PRODUCT_BASE',
  };

  readonly specialColorMap: Record<string, string|undefined> = {
    'overloadedDmg': this.colorMap["PYRO"],
    'burningDmg': this.colorMap["PYRO"],
    'electroChargedDmg': this.colorMap["ELECTRO"],
    'superconductDmg': this.colorMap["CRYO"],
    'swirlCryoDmg': this.colorMap["CRYO"],
    'swirlElectroDmg': this.colorMap["ELECTRO"],
    'swirlElectroAggravateDmg': this.colorMap["ELECTRO"],
    'swirlPyroDmg': this.colorMap["PYRO"],
    'swirlHydroDmg': this.colorMap["HYDRO"],
    'shieldHp': this.colorMap["GEO"],
    'shieldSpecialHp': this.colorMap["GEO"],
    'destructionDmg': this.colorMap["PHYSICAL"],
    'ruptureDmg': this.colorMap["DENDRO"],
    'burgeonDmg': this.colorMap["DENDRO"],
    'hyperbloomDmg': this.colorMap["DENDRO"],

    'healing': '#91ffa3'+ environment.elementColorAlpha,
    'product': '#91ffa3'+ environment.elementColorAlpha,
    'shield': this.colorMap["PHYSICAL"],
    'shieldCryo': this.colorMap["CRYO"],
    'shieldAnemo': this.colorMap["ANEMO"],
    'shieldPhysical': this.colorMap["PHYSICAL"],
    'shieldElectro': this.colorMap["ELECTRO"],
    'shieldGeo': this.colorMap["GEO"],
    'shieldPyro': this.colorMap["PYRO"],
    'shieldHydro': this.colorMap["HYDRO"],
    'shieldDendro': this.colorMap["DENDRO"],
  };

  //キャラ
  @Input('characterIndex') characterIndex!: number | string;
  //スキル
  @Input('skill') skill!: string;
  //スキルサブインデックス
  @Input('skillIndex') skillIndex!: number;
  //インデックス値
  @Input('valueIndexes') valueIndexes!: number[];
  //強制元素オーバライド
  @Input('overrideElement') overrideElement!: string;
  //更新フラグ
  @Input('refreshFlg') refreshFlg!: number;
  //Buffによる変更検知フラグ
  @Input('refreshBuffOnChangeFlg') refreshBuffOnChangeFlg: boolean = false;

  //ダメージデータ
  dmgDatas!: DamageResult[];
  //ダメージループ用リスト
  dmgTempDataList: number[] = [];
  //ダメージパラメータデータ
  dmgParamDatas!: DamageParam[];
  //治療データ
  healingDatas!: HealingResult[];
  //治療ループ用リスト
  healingTempDataList: number[] = [];
  //治療パラメータデータ
  healingParamDatas!: HealingParam[];
  //バリアデータ
  shieldDatas!: ShieldResult[];
  //バリアループ用リスト
  shieldTempDataList: number[] = [];
  //バリアパラメータデータ
  shieldParamDatas!: ShieldParam[];
  //生成物生命値データ
  productDatas!: ProductResult[];
  //生成物生命値ループ用リスト
  productTempDataList: number[] = [];
  //生成物生命値パラメータデータ
  productParamDatas!: ProductParam[];
  //バフデータ
  buffDatas!: BuffResult[];
  //バフループ用リスト
  buffTempDataList: number[] = [];
  //バフswitch
  buffSwitchValue!: boolean;
  //バフslider
  buffSliderValue!: number;
  buffSliderMin!: number;
  buffSliderMax!: number;
  buffSliderStep!: number;
  //ダメージカラー
  dmgColors!: string[];
  //変更検知
  subscription!: Subscription;
  //ダメージECharts表示フラグ
  showDamageEchartsFlag: boolean = false;
  //クリックしたダメージ名
  currentDamageProp: string = '';
  //クリックしたダメージインデックス
  currentDamageIndex: number = -1;
  //治療ECharts表示フラグ
  showHealingEchartsFlag: boolean = false;
  //クリックした治療名
  currentHealingProp: string = '';
  //クリックした治療インデックス
  currentHealingIndex: number = -1;
  //バリアECharts表示フラグ
  showShieldEchartsFlag: boolean = false;
  //クリックしたバリア名
  currentShieldProp: string = '';
  //クリックしたバリアインデックス
  currentShieldIndex: number = -1;
  //生成物生命値ECharts表示フラグ
  showProductEchartsFlag: boolean = false;
  //クリックした生成物生命値名
  currentProductProp: string = '';
  //クリックした生成物生命値インデックス
  currentProductIndex: number = -1;
  //EChartsローディングフラグ
  commonEchartsLoading: boolean = false;
  //ダメージラスト計算結果リスト
  lastDamageCalcResults: [number, ValueResult[]][] = [];
  //治療ラスト計算結果リスト
  lastHealingCalcResults: [number, ValueResult[]][] = [];
  //バリアラスト計算結果リスト
  lastShieldCalcResults: [number, ValueResult[]][] = [];
  //生成物ラスト計算結果リスト
  lastProductCalcResults: [number, ValueResult[]][] = [];
  //共通ECharts設定
  commonEchartsOption: EChartsOption = {
    title: {
      right: '2%',
      bottom: '10%',
      subtext: '',
      textAlign: 'left',
    },
    toolbox: {
      show: true,
      feature: {
        dataView: { show: true, readOnly: true },
        saveAsImage: { show: true },
      },
    },
    tooltip: {
      trigger: 'axis',
      formatter: (param: any) => {
        (param as any[]).sort((item2, item1) => {
          return item1.value[item1.seriesIndex + 1] - item2.value[item2.seriesIndex + 1]
        })
        let result = ""
        param.forEach((v: any) => {
          const isOtherProp = v.seriesIndex >= this.subs.length
          const zeroVal = v.value[v.value.length - 1];
          const currentVal = v.value[v.seriesIndex + 1];
          const diffVal = currentVal - zeroVal;
          const diff = (diffVal / zeroVal * 100).toFixed(1)+'%';
          if(!isOtherProp){
            const prop = this.subs[v.seriesIndex];
            const addVal = this.genshinDataService.getOptimalReliquaryAffixStep(prop) * 10 * parseInt(v.name);
            let sign = '';
            let valStr = '';
            if(v.name != 0){
              if ([Const.PROP_ELEMENTAL_MASTERY,
                  Const.PROP_ATTACK,
                  Const.PROP_HP,
                  Const.PROP_DEFENSE,].includes(prop)) {
                valStr = this.noCommaPipe.transform(this.decimalPipe.transform(addVal, '1.0-1') as string);
              } else {
                valStr = this.percentPipe.transform(addVal, '1.0-1') as string;
              }
              sign = addVal > 0 ? "+" : "";
            }
            result += `<div style="margin: 0px 0 0;line-height:1;">
            <span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:${v.color};"></span>
            <span style="font-size:14px;color:#666;font-weight:400;margin-left:2px;margin-right:5px">${v.seriesName}</span>
            <span style="float:right;font-size:12px;${addVal<0?'color:#91cc75;':'color:#fc8452;'}font-weight:700;margin-left:0px">${sign}${valStr}</span>
            ${v.name != 0?`<br/><span style="font-size:14px;${diffVal<0?'color:#91cc75;':(diffVal !== 0?'color:#fc8452;':'color:#666;')};font-weight:700;margin-left:20px;margin-right:2px">(${diff})</span>`:''}
            <span style="float:right;margin-left:20px;font-size:14px;color:#666;font-weight:900">${v.value[v.seriesIndex + 1].toFixed(1)}</span>
            <div style="clear:both"></div></div> `
          }else{
            result += `<div style="margin: 0px 0 0;line-height:1;">
            <span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:${v.color};"></span>
            <span style="font-size:14px;color:#666;font-weight:400;margin-left:2px;margin-right:5px">${v.seriesName}</span>
            <br/><span style="font-size:14px;${diffVal<0?'color:#91cc75;':(diffVal !== 0?'color:#fc8452;':'color:#666;')};font-weight:700;margin-left:20px;margin-right:2px">(${diff})</span>
            <span style="float:right;margin-left:20px;font-size:14px;color:#666;font-weight:900">${v.value[v.seriesIndex + 1].toFixed(1)}</span>
            <div style="clear:both"></div></div> `
          }
        })
        return result;
      },
      valueFormatter: (value) => value.toString(),
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      }
    },
    legend: {
      align: 'auto',
      data: []
    },
    grid: {
      top: '31%',
      left: '0%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: []
      }
    ],
    yAxis: [
      {
        type: 'value',
        alignTicks: true,
        scale: true,
        axisLabel: {
          formatter: (value: number) => value.toString(),
        }
      }
    ],
    dataset: {
      source: []
    },
    series: []
  };
  //ダメージECharts設定
  damageEchartsOption: EChartsOption = {}
  //治療ECharts設定
  healingEchartsOption: EChartsOption = {}
  //バリアECharts設定
  shieldEchartsOption: EChartsOption = {}
  //生成物ECharts設定
  productEchartsOption: EChartsOption = {}
  //共通計算過程ECharts設定
  commonCalcProcessEchartsOption: EChartsOption = {
    title: {
      subtext: '',
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: (param: any) => {
        let result = "";
        result += `<div style="margin: 0px 0 0;line-height:1.1;">`;
        result += `<span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:${param.color};"></span>`;
        result += `<span style="font-size:14px;color:#666;font-weight:400;margin-left:2px;margin-right:5px;">`;
        result += `${param.value.name}<br>`;
        result += `</span>`;
        result += `<div style="height:8px"></div>`;
        result += `<span style="margin-right:14px;"></span>`;
        if (param.value.processPrefix) {
          result += `<span>${param.value.processPrefix}</span>`;
        }
        if (param.value.processSuffix) {
          result += `<span>${param.value.process}</span>`;
          result += `<div style="height:4px"></div>`;
          result += `<span style="font-size:14px;color:#666;font-weight:700">`;
          result += `${param.value.processSuffix}`;
          result += `</span>`;
        } else {
          result += `<span style="font-size:14px;color:#666;font-weight:700">`;
          result += `${param.value.process}`;
          result += `</span>`;
        }
        result += `</div>`;
        
        return result;
      },
    },
    legend: {
      align: 'auto'
    },
    grid: {
      containLabel: true
    },
    dataset: {
      source: []
    },
    series: [
      {
        name: '',
        type: 'pie',
        radius: [10, 65],
        center: ['50%', '50%'],
        roseType: 'area',
        itemStyle: {
          borderRadius: 5
        }
      }
    ]
  };
  //ダメージ計算過程ECharts設定
  damageCalcProcessEchartsOption: EChartsOption = {}
  //治療計算過程ECharts設定
  healingCalcProcessEchartsOption: EChartsOption = {}
  //バリア計算過程ECharts設定
  shieldCalcProcessEchartsOption: EChartsOption = {}
  //生成物計算過程ECharts設定
  productCalcProcessEchartsOption: EChartsOption = {}
  //言語検知結果
  langChange!: Subscription
  //元素付与変更検知結果
  overrideElementChange!: Subscription
  //ダメージ表示状態
  extraInfoStatus: ExtraInfoStatus | undefined = undefined;

  constructor(private calculatorService: CalculatorService, 
    private characterService: CharacterService,
    private weaponService: WeaponService,
    private relayoutMsgService: RelayoutMsgService,
    private genshinDataService: GenshinDataService,
    private languageService: LanguageService,
    private translateService: TranslateService,
    private percentPipe: PercentPipe, 
    private decimalPipe: DecimalPipe, 
    private noCommaPipe: NoCommaPipe,
    private DPSService: DPSService,
    private matSnackBar: MatSnackBar,
    private extraInfoService: ExtraInfoService) { 
      //変更検知
      this.subscription = this.calculatorService.changed().subscribe((v: boolean)=>{
        if(v){
          this.initDamageDatas();
          this.calEchartsDatas(type_damage);
          this.calEchartsDatas(type_healing);
          this.calEchartsDatas(type_shield);
          this.calEchartsDatas(type_product);
          this.initHealingDatas();
          this.initShieldDatas();
          this.initProducDatas();
          if(this.refreshBuffOnChangeFlg){
            this.initBuffDatas();
          }
        }
      });
      //言語変更検知
      this.langChange = this.languageService.getLang().subscribe((lang: TYPE_SYS_LANG) => {
        this.calEchartsDatas(type_damage, false);
        this.calEchartsDatas(type_healing, false);
        this.calEchartsDatas(type_shield, false);
        this.calEchartsDatas(type_product, false);
      })
      //元素付与変更検知
      this.overrideElementChange = this.characterService.getOverrideElementChanged().subscribe(() => {
        setTimeout(()=>{
          this.calEchartsDatas(type_damage, false);
          this.calEchartsDatas(type_healing, false);
          this.calEchartsDatas(type_shield, false);
          this.calEchartsDatas(type_product, false);
        }, 1)
      })
    }

  ngOnInit(): void {
    this.initExtraInfoStatus();
    this.initDamageDatas();
    this.initHealingDatas();
    this.initShieldDatas();
    this.initProducDatas();
    this.initBuffDatas();
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes['overrideElement']){
      this.initDamageDatas();
      this.calEchartsDatas(type_damage);
      this.calEchartsDatas(type_healing);
      this.calEchartsDatas(type_shield);
      this.calEchartsDatas(type_product);
    }
    if(changes['valueIndexes']
    && (changes['valueIndexes'].previousValue?.length !== changes['valueIndexes'].currentValue?.length
    || changes['valueIndexes'].previousValue?.some((element: any, index: number) => element != changes['valueIndexes'].currentValue[index]))){
      this.initDamageDatas();
      this.calEchartsDatas(type_damage);
      this.calEchartsDatas(type_healing);
      this.calEchartsDatas(type_shield);
      this.calEchartsDatas(type_product);
      this.initHealingDatas();
      this.initShieldDatas();
      this.initProducDatas();
      this.initBuffDatas();
    }
    if(changes['refreshFlg']){
      this.initBuffDatas();
    }
  }

  ngOnDestroy(): void {
    if(this.subscription && !this.subscription.closed){
      this.subscription.unsubscribe();
    }
    if(this.langChange && !this.langChange.closed){
      this.langChange.unsubscribe();
    }
    if(this.overrideElementChange && !this.overrideElementChange.closed){
      this.overrideElementChange.unsubscribe();
    }
  }

  initDamageDatas(){
    const tempDatas = this.getDmgInfos();
    this.dmgDatas = tempDatas[0];
    this.dmgParamDatas = tempDatas[1];
    this.dmgColors = [];
    for(let data of this.dmgDatas){
      this.dmgColors.push(this.getElementColor(data.elementBonusType));
      if (data.forceDisplay !== undefined && data.originIndex !== undefined && this.extraInfoStatus !== undefined) {
        this.extraInfoStatus[data.originIndex] = data.forceDisplay;
      }
    }
    if(this.dmgTempDataList.length != this.dmgDatas.length) {
      this.dmgTempDataList = new Array(this.dmgDatas.length).fill(0);
    }
  }
  initHealingDatas(){
    const tempDatas = this.getHealingInfos();
    this.healingDatas = tempDatas[0];
    this.healingParamDatas = tempDatas[1];
    if(this.healingTempDataList.length != this.healingDatas.length) {
      this.healingTempDataList = new Array(this.healingDatas.length).fill(0);
    }
  }

  initShieldDatas(){
    const tempDatas = this.getShieldInfos();
    this.shieldDatas = tempDatas[0];
    this.shieldParamDatas = tempDatas[1];
    if(this.shieldTempDataList.length != this.shieldDatas.length) {
      this.shieldTempDataList = new Array(this.shieldDatas.length).fill(0);
    }
  }

  initProducDatas(){
    const tempDatas = this.getProductInfos();
    this.productDatas = tempDatas[0];
    this.productParamDatas = tempDatas[1];
    if(this.productTempDataList.length != this.productDatas.length) {
      this.productTempDataList = new Array(this.productDatas.length).fill(0);
    }
  }

  initBuffDatas(){
    let temp = this.getBuffInfos();
    // if(this.buffDatas != undefined && this.buffDatas.length == temp.length){
    //   for(let i = 0; i < temp.length; ++i){
    //     this.copyObjectValue(this.buffDatas, temp);
    //   }
    // }else{
      this.buffDatas = temp;
    // }
    if(this.buffTempDataList.length != this.buffDatas.length) {
      this.buffTempDataList = new Array(this.buffDatas.length).fill(0);
    }
  }
  initExtraInfoStatus(){
    //ダメージ表示状態をリンク
    this.extraInfoStatus = this.extraInfoService.getCharExtraInfoStatus(this.characterIndex, this.skill, this.skillIndex);
  }

  onChangeSwitch(change: MatSlideToggleChange, valueIndex: number){
    this.calculatorService.setSkillBuffValue(this.characterIndex, this.skill, valueIndex, 'switch', change.checked as boolean, this.skillIndex);
    if(this.skill == Const.NAME_EFFECT){
      this.calculatorService.initExtraWeaponData(this.characterIndex);
    }else if(this.skill == Const.NAME_SET){
      this.calculatorService.initExtraArtifactSetData(this.characterIndex);
    }else{
      this.calculatorService.initExtraCharacterData(this.characterIndex);
    }
  }

  onChangeSlider(change: MatSliderChange, valueIndex: number){
    this.calculatorService.setSkillBuffValue(this.characterIndex, this.skill, valueIndex, 'slider', change.value as number, this.skillIndex);
    if(this.skill == Const.NAME_EFFECT){
      this.calculatorService.initExtraWeaponData(this.characterIndex);
    }else if(this.skill == Const.NAME_SET){
      this.calculatorService.initExtraArtifactSetData(this.characterIndex);
    }else{
      this.calculatorService.initExtraCharacterData(this.characterIndex);
    }
  }

  //Echartsを表示
  showEcharts(prop: string, index: number, type: ValueType) {
    let typeProp = "";
    let typeIndex = "";
    let typeFlag = "";
    switch(type){
      case type_damage:
        typeProp = "currentDamageProp";
        typeIndex = "currentDamageIndex";
        typeFlag = "showDamageEchartsFlag";
        break;
      case type_healing:
        typeProp = "currentHealingProp";
        typeIndex = "currentHealingIndex";
        typeFlag = "showHealingEchartsFlag";
        break;
      case type_shield:
        typeProp = "currentShieldProp";
        typeIndex = "currentShieldIndex";
        typeFlag = "showShieldEchartsFlag";
        break;
      case type_product:
        typeProp = "currentProductProp";
        typeIndex = "currentProductIndex";
        typeFlag = "showProductEchartsFlag";
        break;
    }
    const indexChanged = (this as any)[typeIndex] !== index
    if((this as any)[typeProp] !== prop || indexChanged) {
      (this as any)[typeProp] = prop;
      (this as any)[typeIndex] = index;
      (this as any)[typeFlag] = true;
    }else{
      (this as any)[typeFlag] = !(this as any)[typeFlag];
    }
    //再計算
    this.calEchartsDatas(type, indexChanged).finally(()=>{
      setTimeout(()=>{
        this.relayoutMsgService.update("echarts")
      }, 50);
    })
  }

  //DPSリストに追加
  addToDPS(prop: string, index: number) {
    const dmgInfo: DmgInfo = {
      skill: this.skill,
      valueIndexes: this.valueIndexes,
      resultIndex: index,
      skillIndex: this.skillIndex,
      damageProp: prop as keyof DamageResult,
      times: 1,
    };
    this.DPSService.appendDmg(this.characterIndex, dmgInfo);
    this.translateService.get('DPS.APPENDED').subscribe((res: string) => {
      this.matSnackBar.open(res, undefined, {
        duration: 500
      })
    });
  }

  //Echarts設定を計算
  async calEchartsDatas(type: ValueType, reCalc: boolean = true){
    this.commonEchartsLoading = true;
    //設定名
    let currentOptionProp: string = "";
    //計算過程設定名
    let currentClacProcessOptionProp: string = "";
    //結果名
    let currentResultProp: string = "";
    //数値名
    let currentProp: string = "";
    //数値インデックス
    let currentIndex: number = -1;
    //数値結果
    let valueResult: ValueResult = undefined;
    //数値パラメータ
    let valueParam: ValueParam = undefined;
    //数値計算式
    let valueFunc: Function | undefined = undefined;
    //数値i18n
    let valueI18nPrefix: string | undefined = undefined;
    //表示フラグ
    let showFlag: boolean = false;
    switch(type){
      case type_damage:
        currentOptionProp = "damageEchartsOption";
        currentClacProcessOptionProp = "damageCalcProcessEchartsOption";
        currentResultProp = "lastDamageCalcResults";
        currentProp = this.currentDamageProp;
        currentIndex = this.currentDamageIndex;
        valueResult = currentIndex != -1 ? this.dmgDatas[currentIndex] : undefined;
        valueParam = currentIndex != -1 ? this.dmgParamDatas[currentIndex] : undefined;
        valueFunc = this.calculatorService.getDamage.bind(this.calculatorService);
        valueI18nPrefix = "DMG";
        showFlag = this.showDamageEchartsFlag;
        break;
      case type_healing:
        currentOptionProp = "healingEchartsOption";
        currentClacProcessOptionProp = "healingCalcProcessEchartsOption";
        currentResultProp = "lastHealingCalcResults";
        currentProp = this.currentHealingProp;
        currentIndex = this.currentHealingIndex;
        valueResult = currentIndex != -1 ? this.healingDatas[currentIndex] : undefined;
        valueParam = currentIndex != -1 ? this.healingParamDatas[currentIndex] : undefined;
        valueFunc = this.calculatorService.getHealing.bind(this.calculatorService);
        valueI18nPrefix = "OTHER";
        showFlag = this.showHealingEchartsFlag;
        break;
      case type_shield:
        currentOptionProp = "shieldEchartsOption";
        currentClacProcessOptionProp = "shieldCalcProcessEchartsOption";
        currentResultProp = "lastShieldCalcResults";
        currentProp = this.currentShieldProp;
        currentIndex = this.currentShieldIndex;
        valueResult = currentIndex != -1 ? this.shieldDatas[currentIndex] : undefined;
        valueParam = currentIndex != -1 ? this.shieldParamDatas[currentIndex] : undefined;
        valueFunc = this.calculatorService.getShield.bind(this.calculatorService);
        valueI18nPrefix = "OTHER";
        showFlag = this.showShieldEchartsFlag;
        break;
      case type_product:
        currentOptionProp = "productEchartsOption";
        currentClacProcessOptionProp = "productCalcProcessEchartsOption";
        currentResultProp = "lastProductCalcResults";
        currentProp = this.currentProductProp;
        currentIndex = this.currentProductIndex;
        valueResult = currentIndex != -1 ? this.productDatas[currentIndex] : undefined;
        valueParam = currentIndex != -1 ? this.productParamDatas[currentIndex] : undefined;
        valueFunc = this.calculatorService.getProductHp.bind(this.calculatorService);
        valueI18nPrefix = "OTHER";
        showFlag = this.showProductEchartsFlag;
        break;
      default:
        currentOptionProp = "";
        currentResultProp = "";
        currentProp = "";
        currentIndex = -1;
        valueResult = undefined;
        valueParam = undefined;
        valueFunc = () => 0;
        valueI18nPrefix = "";
        showFlag = false;
        break;
    }
    if(!showFlag){
      this.commonEchartsLoading = false;
      return;
    }
    //ECharts設定をリセット
    (this as any)[currentOptionProp] = this.deepClone(this.commonEchartsOption);
    (this as any)[currentClacProcessOptionProp] = this.deepClone(this.commonCalcProcessEchartsOption);
    //ーーーーーーーーーーーーーー
    //ーーーーダメージ計算ーーーー
    //ーーーーーーーーーーーーーー
    //追加属性
    const extraData: Record<string, number>={};
    //追加属性初期化
    for(let key of this.subs){
      extraData[key] = 0;
    }
    //現在武器精錬レベル
    const currentSmeltingLevel = parseInt(this.weaponService.getStorageInfo(this.characterIndex).smeltingLevel!);
    const smeltingPlusTimes = 5 - currentSmeltingLevel;
    let currentGridTop = '';
    let currentToolBoxTop = '';
    switch(smeltingPlusTimes){
      case 0:
      case 1:
        currentGridTop = '40%';
        currentToolBoxTop = '31%';
        break;
      case 2:
        currentGridTop = '42%';
        currentToolBoxTop = '33%';
        break;
      case 3:
        currentGridTop = '45%';
        currentToolBoxTop = '36%';
        break;
      case 4:
        currentGridTop = '45%';
        currentToolBoxTop = '36%';
        break;
      default:
        currentGridTop = '45%';
        currentToolBoxTop = '36%';
        break;
    }
    ((this as any)[currentOptionProp]!.grid! as any).top = currentGridTop;
    ((this as any)[currentOptionProp]!.toolbox! as any).top = currentToolBoxTop;
    //計算
    if(reCalc || (this as any)[currentResultProp].length === 0){
      (this as any)[currentResultProp].splice(0);
      const currentClacResult: ValueResult = valueFunc(this.characterIndex, valueParam);
      const weaponSmeltingAddOneResults: ValueResult[] = [];
      for(let [i] of new Array(smeltingPlusTimes).entries()) {
        weaponSmeltingAddOneResults.push(valueFunc(this.characterIndex, valueParam, extraData, i+1));
      }
      const startIndex = -Math.floor(this.stepRange/2);
      const endIndex = this.stepRange + startIndex;
      for(let i = startIndex; i < endIndex; ++i) {
        const calcResults: ValueResult[] = [];
        if(i === 0){
          calcResults.push(...new Array(this.subs.length).fill(currentClacResult))
        }else{
          for(let key of this.subs){
            const extraData: Record<string, number> = {};
            extraData[key] = this.genshinDataService.getOptimalReliquaryAffixStep(key) * 10 * i;
            calcResults.push(valueFunc(this.characterIndex, valueParam, extraData));
          }
        }
        //精錬プラス
        calcResults.push(...weaponSmeltingAddOneResults);
        //参照用のため
        calcResults.push(currentClacResult);
        (this as any)[currentResultProp].push([i, calcResults]);
      }
    }
    //dataSet設定更新とxAxis設定更新
    const dataSetItems = [];
    const xAxisItems = [];
    for(let i = 0; i < (this as any)[currentResultProp].length; ++i){
      const [index, results] = (this as any)[currentResultProp][i];
      const indexStr = (index > 0?"+":"") + index.toString();
      dataSetItems.push([indexStr, ...results.map((v: any)=>{
        return Math.floor((v as any)[currentProp] as number * 10) / 10;
      })])
      xAxisItems.push(indexStr);
    }
    //title設定更新とlegend設定更新
    const awaitArray = [];
    awaitArray.push(lastValueFrom(this.translateService.get(`GENSHIN.${valueI18nPrefix}.${this.propNameMap[currentProp]}`)));
    for(let i = 0; i < this.subs.length; ++i) {
      awaitArray.push(lastValueFrom(this.translateService.get(`PROPS.${this.subs[i]}`)));
    }
    //精錬プラス
    for(let [i] of new Array(smeltingPlusTimes).entries()) {
      awaitArray.push(lastValueFrom(this.translateService.get(`OTHER.WEAPON_SMELTING_PLUS_`+ (i+1))));
    }
    const [dmgTitle, ...legendItems] = await Promise.all(awaitArray);
    //series設定更新
    const seriesItems = [];
    for(let i = 0; i < legendItems.length; ++i) {
      seriesItems.push({
        name: legendItems[i],
        type: 'line',
        encode: {
          x: 0,
          y: i + 1
        }
      })
    }
    //変更のみの属性を絞り込む
    const hiddenIndexArray = [];
    for(let i = 0; i < this.subs.length + smeltingPlusTimes; ++i){
      const isAllSame = dataSetItems.every((currentResultList: any[]) => {
        return currentResultList[i + 1] == currentResultList[currentResultList.length - 1];
      })
      if(isAllSame){
        hiddenIndexArray.push(i);
      }
    }
    const selected: Record<string, boolean> = {};
    hiddenIndexArray.forEach((val: number) => {
      selected[legendItems[val]] = false;
    })
    //値を反映
    const temp1 = (this as any)[currentOptionProp].dataset;
    const temp2 = (this as any)[currentOptionProp].legend;
    const temp3 = ((this as any)[currentOptionProp]!.xAxis as any[])[0];
    const temp4 = (this as any)[currentOptionProp];
    const temp5 = (this as any)[currentOptionProp]!.title;;
    if(!Array.isArray(temp1)){
      (temp1!.source as any[]) = dataSetItems;
    }
    if(!Array.isArray(temp2)){
      (temp2!.data as any[]) = legendItems;
      (temp2!.selected as any) = selected;
    }
    if(!Array.isArray(temp3)){
      (temp3!.data as any[]) = xAxisItems;
    }
    if(!Array.isArray(temp4)){
      (temp4!.series as any[]) = seriesItems;
    }
    if(!Array.isArray(temp5)){
      temp5!.subtext = dmgTitle;
    }
    //ーーーーーーーーーーーーーー
    //ーーーー　計算過程　ーーーー
    //ーーーーーーーーーーーーーー
    const currentClacResult = valueFunc(this.characterIndex, valueParam);
    const calcProcessDataList: any[] = [];
    let alignedCalcProcessDataList: any[] = [];
    let minVal = Infinity;
    let maxVal = -Infinity;
    const MaxRate = 6;
    const DistanceRate = 1;
    const processKeys: string[] = [];
    const valueSortedKey: string[] = [];
    (currentClacResult.calcProcessKeyMap[currentProp] as string[]).forEach((key: string)=>{
      const tempValues = currentClacResult.calcProcessValMap[key];
      processKeys.push(this.processNameMap[key]);
      const needRes = tempValues[1].includes("&");
      let processPrefix = "";
      let processSuffix = "";
      if (needRes) {
        processPrefix = "";
        processSuffix = `&equals; ${tempValues[0]}`;
      }
      calcProcessDataList.push({
        name: key,
        value: tempValues[0],
        process: tempValues[1],
        processPrefix,
        processSuffix,
      });
    })
    //ソート
    calcProcessDataList.slice().sort((a: any, b: any) => {
      return b.value - a.value;
    }).forEach((val: any, index: number, array: any[]) => {
      if (index == 0) {
        maxVal = val.value;
      }
      if (index == array.length - 1) {
        minVal = val.value;
      }
      valueSortedKey.push(val.name);
    })
    //位置調整
    let currentY = '50%';
    switch(calcProcessDataList.length){
      case 0:
      case 1:
        currentY = '50%';
        break;
      case 2:
        currentY = '55%';
        break;
      case 3:
        currentY = '57%';
        break;
      case 4:
        currentY = '60%';
        break;
      case 5:
        currentY = '60%';
        break;
      case 6:
        currentY = '63%';
        break;
      default:
        currentY = '65%';
        break;
    }
    ((this as any)[currentClacProcessOptionProp]!.series![0].center as any)[1] = currentY;
    //title設定更新
    const processAwaitArray: Promise<string>[] = [];
    processKeys.forEach ((key: string)=>{
      processAwaitArray.push(lastValueFrom(this.translateService.get(`GENSHIN.PROCESS.${key}`)));
    })
    const processNames = await Promise.all(processAwaitArray);
    //再計算
    alignedCalcProcessDataList = calcProcessDataList.map((val: any, index: number) => {
      const currentValRate = val.value / minVal;
      const currentValIndex = valueSortedKey.indexOf(val.name);
      const toSetMaxVal = (MaxRate - DistanceRate * currentValIndex) * minVal;
      return {
        name: processNames[index],
        value: currentValRate >= MaxRate || val.value >= toSetMaxVal ? toSetMaxVal : val.value,
        process: val.process,
        processPrefix: val.processPrefix,
        processSuffix: val.processSuffix,
      }
    })
    const temp6 = (this as any)[currentClacProcessOptionProp]!.dataset;
    if(!Array.isArray(temp6)){
      (temp6!.source as any[]) = alignedCalcProcessDataList;
    }

    this.commonEchartsLoading = false;
  }

  changeDisplayStatus(index: number | undefined, flag: boolean){
    if (index !== undefined && this.extraInfoStatus) {
      this.extraInfoStatus[index] = flag;
      this.showDamageEchartsFlag = false;
    }
    setTimeout(()=>{
      this.relayoutMsgService.update("+/-")
    }, 50);
  }

  private getDmgInfos(){
    let temp = this.calculatorService.getSkillDmgValue(this.characterIndex, this.skill, this.valueIndexes, this.overrideElement, this.skillIndex);
    return temp;
  }

  private getHealingInfos(){
    let temp = this.calculatorService.getSkillHealingValue(this.characterIndex, this.skill, this.valueIndexes, this.skillIndex);
    return temp;
  }

  private getShieldInfos(){
    let temp = this.calculatorService.getSkillShieldValue(this.characterIndex, this.skill, this.valueIndexes, this.skillIndex);
    return temp;
  }

  private getProductInfos(){
    let temp = this.calculatorService.getSkillProductHpValue(this.characterIndex, this.skill, this.valueIndexes, this.skillIndex);
    return temp;
  }

  private getBuffInfos(){
    let temp = this.calculatorService.getSkillBuffValue(this.characterIndex, this.skill, this.skillIndex, this.valueIndexes);
    return temp;
  }

  private getElementFromBonus(element: string){
    return Const.MAP_ELEMENT_REVERSE.get(element)!;
  }

  private getElementColor(element: string){
    return this.colorMap[this.getElementFromBonus(element)];
  }

  private deepClone(obj: any){
    // もし基本型またはnullであれば、そのまま返す
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }

    // オリジナルのオブジェクトの型に基づいて、クローンを作成する
    const clone: any = Array.isArray(obj) ? [] : {};

    // オブジェクトのプロパティを再帰的にコピーする
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clone[key] = this.deepClone(obj[key]);
      }
    }

    return clone; 
  }

}
