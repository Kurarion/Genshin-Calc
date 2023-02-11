import { ChangeDetectionStrategy, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatSliderChange } from '@angular/material/slider';
import { lastValueFrom, Subscription } from 'rxjs';
import { CalculatorService, DamageResult, HealingResult, character, Const, CharacterService, CharacterStorageInfo, enemy, EnemyService, EnemyStorageInfo, ExtraCharacter, ExtraData, ExtraDataService, ExtraDataStorageInfo, ExtraWeapon, weapon, WeaponService, WeaponStorageInfo, ShieldResult, ProductResult, BuffResult, RelayoutMsgService, DamageParam, GenshinDataService, TYPE_SYS_LANG, LanguageService } from 'src/app/shared/shared.module';
import { environment } from 'src/environments/environment';
import type { EChartsOption } from 'echarts';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-extra-data',
  templateUrl: './extra-data.component.html',
  styleUrls: ['./extra-data.component.css']
})
export class ExtraDataComponent implements OnInit, OnDestroy, OnChanges {

  private readonly colorMap: Record<string, string> = {
    "CRYO": Const.ELEMENT_COLOR_MAP['CRYO'] + environment.elementColorAlpha,
    "ANEMO": Const.ELEMENT_COLOR_MAP['ANEMO'] + environment.elementColorAlpha,
    "PHYSICAL": Const.ELEMENT_COLOR_MAP['PHYSICAL'] + environment.elementColorAlpha,
    "ELECTRO": Const.ELEMENT_COLOR_MAP['ELECTRO'] + environment.elementColorAlpha,
    "GEO": Const.ELEMENT_COLOR_MAP['GEO'] + environment.elementColorAlpha,
    "PYRO": Const.ELEMENT_COLOR_MAP['PYRO'] + environment.elementColorAlpha,
    "HYDRO": Const.ELEMENT_COLOR_MAP['HYDRO'] + environment.elementColorAlpha,
    "DENDRO": Const.ELEMENT_COLOR_MAP['DENDRO'] + environment.elementColorAlpha,
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
    'destructionDmg',
  ];
  readonly healingPropList: (keyof HealingResult)[] = [
    'healing',
  ];
  readonly productPropList: (keyof ProductResult)[] = [
    'product',
  ];
  readonly shieldPropList: (keyof ShieldResult)[] = [
    'shield',
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
    'destructionDmg': 'DESTRUCTION',

    'healing': 'HEALING',
    'product': 'PRODUCT',
    'shield': 'SHIELD',
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
    'destructionDmg': this.colorMap["PHYSICAL"],
    'ruptureDmg': this.colorMap["DENDRO"],
    'burgeonDmg': this.colorMap["DENDRO"],
    'hyperbloomDmg': this.colorMap["DENDRO"],

    'healing': '#91ffa3'+ environment.elementColorAlpha,
    'product': '#91ffa3'+ environment.elementColorAlpha,
    'shield': this.colorMap["GEO"],
  };

  //キャラ
  @Input('characterIndex') characterIndex!: number | string;
  //スキル
  @Input('skill') skill!: string;
  //スキルサブインデックス
  @Input('skillIndex') skillIndex!: number;
  //インデックス値
  @Input('valueIndexs') valueIndexs!: number[];
  //強制元素オーバライド
  @Input('overrideElement') overrideElement!: string;
  //更新フラグ
  @Input('refreshFlg') refreshFlg!: number;

  //ダメージデータ
  dmgDatas!: DamageResult[];
  //ダメージループ用リスト
  dmgTempDataList: number[] = [];
  //ダメージパラメータデータ
  dmgParamDatas!: DamageParam[];
  //治療データ
  healingDatas!: HealingResult[];
  //ダメージループ用リスト
  healingTempDataList: number[] = [];
  //バリアデータ
  shieldDatas!: ShieldResult[];
  //ダメージループ用リスト
  shieldTempDataList: number[] = [];
  //生成物生命値データ
  productDatas!: ProductResult[];
  //ダメージループ用リスト
  productTempDataList: number[] = [];
  //バフデータ
  buffDatas!: BuffResult[];
  //ダメージループ用リスト
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
  //ラスト計算結果リスト
  lastDamgeCalcResults: [number, DamageResult[]][] = [];
  //ダメージEChartsローディングフラグ
  damageEchartsLoading: boolean = false;
  //ダメージECharts設定
  damageEchartsOption: EChartsOption = {
    title: {
      right: '2%',
      bottom: '10%',
      subtext: '',
      textAlign: 'left',
    },
    tooltip: {
      trigger: 'axis',
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
      top: '32%',
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
        scale: true
      }
    ],
    dataset: {
      source: []
    },
    series: []
  };
  //言語検知結果
  langChange!: Subscription

  constructor(private calculatorService: CalculatorService, 
    private characterService: CharacterService,
    private relayoutMsgService: RelayoutMsgService,
    private genshinDataService: GenshinDataService,
    private languageService: LanguageService,
    private translateService: TranslateService,) { 
      //変更検知
      this.subscription = this.calculatorService.changed().subscribe((v: boolean)=>{
        if(v){
          this.initDamageDatas();
          this.calDamageEchartsDatas();
          this.initHealingDatas();
          this.initShieldDatas();
          this.initProducDatas();
          //ユーザースライド操作のため更新しないように
          // this.initBuffDatas();
        }
      });
      //言語変更検知
      this.langChange = this.languageService.getLang().subscribe((lang: TYPE_SYS_LANG) => {
        this.calDamageEchartsDatas();
      })
    }

  ngOnInit(): void {
    this.initDamageDatas();
    this.initHealingDatas();
    this.initShieldDatas();
    this.initProducDatas();
    this.initBuffDatas();
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes['overrideElement']){
      this.initDamageDatas();
      this.calDamageEchartsDatas();
    }
    if(changes['valueIndexs']){
      this.initDamageDatas();
      this.calDamageEchartsDatas();
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
  }

  initDamageDatas(){
    const tempDatas = this.getDmgInfos();
    this.dmgDatas = tempDatas[0];
    this.dmgParamDatas = tempDatas[1];
    this.dmgColors = [];
    for(let data of this.dmgDatas){
      this.dmgColors.push(this.getElementColor(data.elementBonusType));
    }
    if(this.dmgTempDataList.length != this.dmgDatas.length) {
      this.dmgTempDataList = new Array(this.dmgDatas.length).fill(0);
    }
  }
  initHealingDatas(){
    this.healingDatas = this.getHealingInfos();
    if(this.healingTempDataList.length != this.healingDatas.length) {
      this.healingTempDataList = new Array(this.healingDatas.length).fill(0);
    }
  }

  initShieldDatas(){
    this.shieldDatas = this.getShieldInfos();
    if(this.shieldTempDataList.length != this.shieldDatas.length) {
      this.shieldTempDataList = new Array(this.shieldDatas.length).fill(0);
    }
  }

  initProducDatas(){
    this.productDatas = this.getProductInfos();
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
  showDamageEcharts(prop: string, index: number) {
    if(this.currentDamageProp !== prop || this.currentDamageIndex !== index) {
      this.currentDamageProp = prop;
      this.currentDamageIndex = index;
      this.showDamageEchartsFlag = true;
    }else{
      this.showDamageEchartsFlag = !this.showDamageEchartsFlag;
    }
    //再計算
    this.calDamageEchartsDatas().finally(()=>{
      setTimeout(()=>{
        this.relayoutMsgService.update("echarts")
      }, 50);
    })
  }

  //Echarts設定を計算
  async calDamageEchartsDatas(){
    this.damageEchartsLoading = true;
    if(!this.showDamageEchartsFlag){
      return
    }
    //リフレッシュ
    this.damageEchartsOption = {...this.damageEchartsOption}
    //スキル情報
    const damageParam: DamageParam = this.dmgParamDatas[this.currentDamageIndex];
    //追加属性
    const extraData: Record<string, number>={};
    //追加属性初期化
    for(let key of this.subs){
      extraData[key] = 0;
    }
    //計算
    this.lastDamgeCalcResults.splice(0);
    const currentClacResult: DamageResult = this.dmgDatas[this.currentDamageIndex];
    const startIndex = -Math.floor(this.stepRange/2);
    const endIndex = this.stepRange + startIndex;
    for(let i = startIndex; i < endIndex; ++i) {
      const calcResults: DamageResult[] = [];
      if(i === 0){
        calcResults.push(...new Array(this.subs.length).fill(currentClacResult))
      }else{
        for(let key of this.subs){
          const extraData: Record<string, number> = {};
          extraData[key] = this.genshinDataService.getOptimalReliquaryAffixStep(key) * 10 * i;
          calcResults.push(this.calculatorService.getDamage(this.characterIndex, damageParam, extraData));
        }
      }
      this.lastDamgeCalcResults.push([i, calcResults]);
    }
    //dataSet設定更新とxAxis設定更新
    const dataSetItems = [];
    const xAxisItems = [];
    for(let i = 0; i < this.lastDamgeCalcResults.length; ++i){
      const [index, results] = this.lastDamgeCalcResults[i];
      const indexStr = (index > 0?"+":"") + index.toString();
      dataSetItems.push([indexStr, ...results.map((v)=>{
        return Math.floor(v[this.currentDamageProp as keyof DamageResult] as number * 10) / 10;
      })])
      xAxisItems.push(indexStr);
    }
    //title設定更新とlegend設定更新
    const awaitArray = [];
    awaitArray.push(lastValueFrom(this.translateService.get(`GENSHIN.DMG.${this.propNameMap[this.currentDamageProp]}`)));
    for(let i = 0; i < this.subs.length; ++i) {
      awaitArray.push(lastValueFrom(this.translateService.get(`PROPS.${this.subs[i]}`)));
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
    //値を反映
    const temp1 = this.damageEchartsOption.dataset;
    const temp2 = this.damageEchartsOption.legend;
    const temp3 = (this.damageEchartsOption!.xAxis as any[])[0];
    const temp4 = this.damageEchartsOption;
    const temp5 = this.damageEchartsOption!.title;;
    if(!Array.isArray(temp1)){
      (temp1!.source as any[]) = dataSetItems;
    }
    if(!Array.isArray(temp2)){
      (temp2!.data as any[]) = legendItems;
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
    this.damageEchartsLoading = false;
  }

  private getDmgInfos(){
    let temp = this.calculatorService.getSkillDmgValue(this.characterIndex, this.skill, this.valueIndexs, this.overrideElement, this.skillIndex);
    return temp;
  }

  private getHealingInfos(){
    let temp = this.calculatorService.getSkillHealingValue(this.characterIndex, this.skill, this.valueIndexs, this.skillIndex);
    return temp;
  }

  private getShieldInfos(){
    let temp = this.calculatorService.getSkillShieldValue(this.characterIndex, this.skill, this.valueIndexs, this.skillIndex);
    return temp;
  }

  private getProductInfos(){
    let temp = this.calculatorService.getSkillProductHpValue(this.characterIndex, this.skill, this.valueIndexs, this.skillIndex);
    return temp;
  }

  private getBuffInfos(){
    let temp = this.calculatorService.getSkillBuffValue(this.characterIndex, this.skill, this.skillIndex, this.valueIndexs);
    return temp;
  }

  private getElementFromBonus(element: string){
    return Const.MAP_ELEMENT_REVERSE.get(element)!;
  }

  private getElementColor(element: string){
    return this.colorMap[this.getElementFromBonus(element)];
  }

  private copyObjectValue(target: any, source: any){
    for(let key in source){
      if(typeof source[key] === 'object'){
        target[key] = {};
        this.copyObjectValue(target[key], source[key])
      }else{
        target[key] = source[key];
      }
    }
  }

}
