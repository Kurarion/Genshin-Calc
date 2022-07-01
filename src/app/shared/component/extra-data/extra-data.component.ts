import { ChangeDetectionStrategy, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatSliderChange } from '@angular/material/slider';
import { Subscription } from 'rxjs';
import { CalculatorService, DamageResult, HealingResult, character, Const, CharacterService, CharacterStorageInfo, enemy, EnemyService, EnemyStorageInfo, ExtraCharacter, ExtraData, ExtraDataService, ExtraDataStorageInfo, ExtraWeapon, weapon, WeaponService, WeaponStorageInfo, ShieldResult, ProductResult, BuffResult } from 'src/app/shared/shared.module';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-extra-data',
  templateUrl: './extra-data.component.html',
  styleUrls: ['./extra-data.component.css']
})
export class ExtraDataComponent implements OnInit, OnDestroy, OnChanges {

  private readonly colorMap: Record<string, string> = {
    "CRYO": "#cce7f3" + environment.elementColorAlpha,
    "ANEMO": "#afe9d8" + environment.elementColorAlpha,
    "PHYSICAL": "#fafafa" + environment.elementColorAlpha,
    "ELECTRO": "#f2d4f3" + environment.elementColorAlpha,
    "GEO": "#ffefc4" + environment.elementColorAlpha,
    "PYRO": "#f3a5a5" + environment.elementColorAlpha,
    "HYDRO": "#c9e4ff" + environment.elementColorAlpha,
    "DENDRO": "#7cde8c" + environment.elementColorAlpha,
  }

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
    'overloadedDmg',
    'burningDmg',
    'electroChargedDmg',
    'superconductDmg',
    'swirlCryoDmg',
    'swirlElectroDmg',
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
    'overloadedDmg': 'OVERLOADED',
    'burningDmg': 'BURNING',
    'electroChargedDmg': 'ELECTROCHARGED',
    'superconductDmg': 'SUPERCONDUCT',
    'swirlCryoDmg': 'SWIRL_CRYO',
    'swirlElectroDmg': 'SWIRL_ELECTRO',
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
    'swirlPyroDmg': this.colorMap["PYRO"],
    'swirlHydroDmg': this.colorMap["HYDRO"],
    'shieldHp': this.colorMap["GEO"],
    'destructionDmg': this.colorMap["PHYSICAL"],

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

  //ダメージデータ
  dmgDatas!: DamageResult[];
  //治療データ
  healingDatas!: HealingResult[];
  //バリアデータ
  shieldDatas!: ShieldResult[];
  //生成物生命値データ
  productDatas!: ProductResult[];
  //バフデータ
  buffDatas!: BuffResult[];
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

  constructor(private calculatorService: CalculatorService, 
    private characterService: CharacterService) { }

  ngOnInit(): void {
    this.initDamageDatas();
    this.initHealingDatas();
    this.initShieldDatas();
    this.initProducDatas();
    this.initBuffDatas();
    //変更検知
    this.subscription = this.calculatorService.changed().subscribe((v: boolean)=>{
      if(v){
        this.initDamageDatas();
        this.initHealingDatas();
        this.initShieldDatas();
        this.initProducDatas();
        this.initBuffDatas();
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes['overrideElement']){
      this.initDamageDatas();
    }
    if(changes['valueIndexs']){
      this.initDamageDatas();
      this.initHealingDatas();
      this.initShieldDatas();
      this.initProducDatas();
      this.initBuffDatas();
    }
  }

  ngOnDestroy(): void {
    if(this.subscription && !this.subscription.closed){
      this.subscription.unsubscribe();
    }
  }

  initDamageDatas(){
    this.dmgDatas = this.getDmgInfos();
    this.dmgColors = [];
    for(let data of this.dmgDatas){
      this.dmgColors.push(this.getElementColor(data.elementBonusType));
    }
  }
  initHealingDatas(){
    this.healingDatas = this.getHealingInfos();
  }

  initShieldDatas(){
    this.shieldDatas = this.getShieldInfos();
  }

  initProducDatas(){
    this.productDatas = this.getProductInfos();
  }

  initBuffDatas(){
    this.buffDatas = this.getBuffInfos();
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

}
