import { Component, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { CalculatorService, character, CharacterService, Const, DamageResult, DPSService, DPSStorageInfo, ExpansionPanelCommon, RelayoutMsgService, TYPE_SYS_LANG } from 'src/app/shared/shared.module';
import { environment } from 'src/environments/environment';

interface DamageInfo {
  name: string;
  skillIndex?: number;
  index: number;
  rate: string;
  elementType: string;
  attackType: string;
  resultProp: keyof DamageResult;
  results: DamageResult;
  times: number;
  tag?: string;
  isAbsoluteDmg?: boolean;
}
@Component({
  selector: 'app-dps',
  templateUrl: './dps.component.html',
  styleUrls: ['./dps.component.css']
})
export class DpsComponent extends ExpansionPanelCommon implements OnInit {

  readonly elementColorMap: Record<string, string> = {
    [Const.PROP_DMG_BONUS_CRYO]: Const.ELEMENT_COLOR_MAP['CRYO'] + environment.elementColorAlpha,
    [Const.PROP_DMG_BONUS_ANEMO]: Const.ELEMENT_COLOR_MAP['ANEMO'] + environment.elementColorAlpha,
    [Const.PROP_DMG_BONUS_PHYSICAL]: Const.ELEMENT_COLOR_MAP['PHYSICAL'] + environment.elementColorAlpha,
    [Const.PROP_DMG_BONUS_ELECTRO]: Const.ELEMENT_COLOR_MAP['ELECTRO'] + environment.elementColorAlpha,
    [Const.PROP_DMG_BONUS_GEO]: Const.ELEMENT_COLOR_MAP['GEO'] + environment.elementColorAlpha,
    [Const.PROP_DMG_BONUS_PYRO]: Const.ELEMENT_COLOR_MAP['PYRO'] + environment.elementColorAlpha,
    [Const.PROP_DMG_BONUS_HYDRO]: Const.ELEMENT_COLOR_MAP['HYDRO'] + environment.elementColorAlpha,
    [Const.PROP_DMG_BONUS_DENDRO]: Const.ELEMENT_COLOR_MAP['DENDRO'] + environment.elementColorAlpha,
  }

  readonly specialColorMap: Record<string, string|undefined> = {
    'overloadedDmg': this.elementColorMap[Const.PROP_DMG_BONUS_PYRO],
    'burningDmg': this.elementColorMap[Const.PROP_DMG_BONUS_PYRO],
    'electroChargedDmg': this.elementColorMap[Const.PROP_DMG_BONUS_ELECTRO],
    'superconductDmg': this.elementColorMap[Const.PROP_DMG_BONUS_CRYO],
    'swirlCryoDmg': this.elementColorMap[Const.PROP_DMG_BONUS_CRYO],
    'swirlElectroDmg': this.elementColorMap[Const.PROP_DMG_BONUS_ELECTRO],
    'swirlElectroAggravateDmg': this.elementColorMap[Const.PROP_DMG_BONUS_ELECTRO],
    'swirlPyroDmg': this.elementColorMap[Const.PROP_DMG_BONUS_PYRO],
    'swirlHydroDmg': this.elementColorMap[Const.PROP_DMG_BONUS_HYDRO],
    'shieldHp': this.elementColorMap[Const.PROP_DMG_BONUS_GEO],
    'destructionDmg': this.elementColorMap[Const.PROP_DMG_BONUS_PHYSICAL],
    'ruptureDmg': this.elementColorMap[Const.PROP_DMG_BONUS_DENDRO],
    'burgeonDmg': this.elementColorMap[Const.PROP_DMG_BONUS_DENDRO],
    'hyperbloomDmg': this.elementColorMap[Const.PROP_DMG_BONUS_DENDRO],

    'healing': '#91ffa3'+ environment.elementColorAlpha,
    'product': '#91ffa3'+ environment.elementColorAlpha,
    'shield': this.elementColorMap[Const.PROP_DMG_BONUS_GEO],
  };

  readonly damageTypeMap: Map<string, string[]> = Const.PROPS_OPTIMAL_DAMAGE_TYPE_LIST_MAP;
  readonly damageTypeAbsMap: Map<string, string[]> = Const.PROPS_OPTIMAL_DAMAGE_TYPE_LIST_ABS_MAP;

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
  };

  readonly dmgFromName: Record<string, string> = {
    [Const.NAME_SKILLS_NORMAL]: "SKILL_A_NAME",
    [Const.NAME_SKILLS_SKILL]: "SKILL_E_NAME",
    [Const.NAME_SKILLS_ELEMENTAL_BURST]: "SKILL_Q_NAME",
    [Const.NAME_SKILLS_OTHER]: "SKILL_X_NAME",
    [Const.NAME_SKILLS_PROUD + '0']: "PROUND_1_NAME",
    [Const.NAME_SKILLS_PROUD + '1']: "PROUND_2_NAME",
    [Const.NAME_SKILLS_PROUD + '2']: "PROUND_3_NAME",
    [Const.NAME_CONSTELLATION + '0']: "CONSTELLATION_1_NAME",
    [Const.NAME_CONSTELLATION + '1']: "CONSTELLATION_2_NAME",
    [Const.NAME_CONSTELLATION + '2']: "CONSTELLATION_3_NAME",
    [Const.NAME_CONSTELLATION + '3']: "CONSTELLATION_4_NAME",
    [Const.NAME_CONSTELLATION + '4']: "CONSTELLATION_5_NAME",
    [Const.NAME_CONSTELLATION + '5']: "CONSTELLATION_6_NAME",
    [Const.NAME_EFFECT]: "WEAPON_NAME",
    [Const.NAME_SET + '1']: "ARTIFACT_NAME",
    [Const.NAME_SET + '2']: "ARTIFACT_NAME",
  }

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

  //タブ
  tabs: string[] = [];
  //選択されたインデックス
  selectedIndex!: number;
  //全情報
  infos!: DPSStorageInfo[];
  //元素付与変更検知
  elementChangedSub!: Subscription;
  //データ変更検知
  dataChangedSub!: Subscription;
  //データ追加検知
  dataAppendChangedSub!: Subscription;
  //DPSタイム
  showDurationValue!: number;
  //元素付与
  overrideElement!: string;
  //DPS
  dps!: string;
  //DPSカラー
  dpsBGColor!: string;


  //画面表示するダメージ情報リスト
  damageInfos!: DamageInfo[];

  constructor(
    private DPSService: DPSService, 
    private calculatorService: CalculatorService, 
    private translateService: TranslateService,
    private characterService: CharacterService,
    private relayoutMsgService: RelayoutMsgService,) { 
      super(relayoutMsgService);
    }

  ngOnInit(): void {
    //DPSカラー設定
    this.dpsBGColor = Const.ELEMENT_COLOR_MAP[Const.ELEMENT_TYPE_MAP.get(this.data.info.elementType)!] + environment.elementColorAlpha;
    //タブリスト初期化
    let length = this.DPSService.getStorageInfoLength(this.data.id);
    if(length == undefined || length == 0){
      length = 1;
    }
    this.tabs = Array.from({length: length}).map((_, i) => `${i}`);
    //選択中インデックス
    this.selectedIndex = this.DPSService.getStorageSelectedIndex(this.data.id);
    //元素付与初期化
    this.overrideElement = this.characterService.getOverrideElement(this.data.id);
    //情報初期化
    this.initInfos();
    this.updateDatas();
    this.updateShowValue();
    //元素付与更新
    this.elementChangedSub = this.characterService.getOverrideElementChanged().subscribe(()=>{
      //元素付与更新
      this.overrideElement = this.characterService.getOverrideElement(this.data.id);
      setTimeout(()=>{
        //再計算
        this.updateDatas();
      })
    });
    //データ更新
    this.dataChangedSub = this.calculatorService.changed().subscribe((v: boolean)=>{
      if(v) {
        //再計算
        this.updateDatas();
      }
    })
    //データ追加
    this.dataAppendChangedSub = this.DPSService.changed().subscribe(()=>{
      //再計算
      this.updateDatas();
    })
  }

  @HostListener('window:unload')
  ngOnDestroy(): void {
    //データ保存
    this.DPSService.saveData();
    //検知停止
    this.elementChangedSub.unsubscribe();
    this.dataChangedSub.unsubscribe();
    this.dataAppendChangedSub.unsubscribe();
  }

  addTab() {
    this.DPSService.addStorageInfo(this.data.id);
    this.localAddTab();
    this.setSelectedIndex();
  }

  copyTab() {
    this.DPSService.copyAndCreateStorageInfo(this.data.id, this.selectedIndex);
    this.localAddTab();
    this.setSelectedIndex();
  }

  removeTab(index: number) {
    this.tabs.splice(index, 1);
    this.DPSService.deleteStorageInfo(this.data.id, index);
    if(this.selectedIndex >= index){
      let toSetIndex = this.tabs.length - 1
      this.selectedIndex = toSetIndex > 0?toSetIndex:0;
    }else{
      this.selectedIndex = 0;
    }
    this.setSelectedIndex();
  }

  removeItem(index: number) {
    this.infos[this.selectedIndex].dmgs.splice(index, 1);
    this.damageInfos.splice(index, 1);
    this.calcDPS();
  }

  changeProp(index: number, prop: keyof DamageResult) {
    this.infos[this.selectedIndex].dmgs[index].damageProp = prop;
    this.damageInfos[index].resultProp = prop;
    this.calcDPS();
  }

  onTabChanged() {
    this.setSelectedIndex();
  }

  setSelectedIndex(){
    this.DPSService.setStorageSelectedIndex(this.data.id, this.selectedIndex);
    this.updateShowValue();
    this.updateDatas();
  }

  //ドラッグ開始
  onDrag(){
    this.draged.emit(this.name);
  }

  onDurationValueKeyup(event: KeyboardEvent){
    let originValue = (event.target as HTMLInputElement).value;
    let value = parseFloat(originValue);
    if(isNaN(value)){
      value = 1;
    }
    this.infos[this.selectedIndex].duration = value;
    this.calcDPS();
  }

  onTimesValueKeyup(index: number, event: KeyboardEvent){
    let originValue = (event.target as HTMLInputElement).value;
    let value = parseFloat(originValue);
    if(isNaN(value) || value < 0){
      value = 0;
    }
    this.infos[this.selectedIndex].dmgs[index].times = value;
    this.calcDPS();
  }

  private localAddTab(){
    this.tabs.push((this.tabs.length + 1).toString());
    this.selectedIndex = this.tabs.length - 1;
  }

  private updateShowValue(){
    let durationValue = this.infos[this.selectedIndex].duration;
    this.showDurationValue = parseFloat(durationValue.toFixed(8));
  }

  private initInfos(){
    this.infos = this.DPSService.getStorageInfos(this.data.id);
  }

  private updateDatas(){
    this.damageInfos = [];
    const badDmgInfoIndexs = [];
    for(let [i, dmg] of this.infos[this.selectedIndex].dmgs.entries()) {
      const skill = dmg.skill;
      const valueIndexs = dmg.valueIndexs;
      const resultIndex = dmg.resultIndex;
      const skillIndex = dmg.skillIndex;
      const times = dmg.times ?? 1;
      let overrideElement = "";
      if (skill === Const.NAME_SKILLS_NORMAL){
        overrideElement = this.overrideElement;
      }
      const dmgValues = this.calculatorService.getSkillDmgValue(this.data.id, skill, valueIndexs, overrideElement, skillIndex)
      const dmgResult = dmgValues[0][resultIndex];
      const dmgParam = dmgValues[1][resultIndex];
      const hasHiddenResult = dmgValues[0].length > 1;
      const damageProp = dmg.damageProp;
      if (dmgResult === undefined || dmgParam === undefined) {
        badDmgInfoIndexs.push(i);
        continue;
      }
      this.damageInfos.push({
        name: skill,
        skillIndex: skillIndex,
        index: hasHiddenResult ? (resultIndex + 1) : valueIndexs[resultIndex] + 1,
        rate: dmgParam.rateAttach.reduce((pre: string, cur: number[]) => {
          return pre + ' + ' + cur.reduce((pre1: string, cur1: number)=>{
            return pre1 + (pre1.length > 0 ?' + ':'') + (cur1*100).toFixed(1)+'%'
          }, '')
        }, (dmgParam.rate*100).toFixed(1)+'%'),
        elementType: dmgParam.elementBonusType,
        attackType: dmgParam.attackBonusType,
        resultProp: damageProp,
        results: dmgResult,
        times: times,
        tag: dmgParam.tag,
        isAbsoluteDmg: dmgParam.isAbsoluteDmg,
      })
    }
    badDmgInfoIndexs.reverse().forEach((value: number) => {
      this.infos[this.selectedIndex].dmgs.splice(value, 1);
    });
    this.calcDPS();
  }

  private calcDPS() {
    this.dps = (this.damageInfos.reduce((pre: number, cur: DamageInfo) => {
      let tempVal = cur.results[cur.resultProp] as number;
      if (isNaN(tempVal)) {
        tempVal = 0;
      }
      return pre + tempVal * cur.times;
    }, 0) / this.infos[this.selectedIndex].duration).toFixed(2);
    
    this.onExpandStatusChanged();
  }

}
