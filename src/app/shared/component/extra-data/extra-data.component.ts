import { ChangeDetectionStrategy, Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { CalculatorService, DamageResult, character, Const, CharacterService, CharacterStorageInfo, enemy, EnemyService, EnemyStorageInfo, ExtraCharacter, ExtraData, ExtraDataService, ExtraDataStorageInfo, ExtraWeapon, weapon, WeaponService, WeaponStorageInfo } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-extra-data',
  templateUrl: './extra-data.component.html',
  styleUrls: ['./extra-data.component.css']
})
export class ExtraDataComponent implements OnInit {

  private readonly colorMap: Record<string, string> = {
    "CRYO": "#B2DFEE",
    "ANEMO": "	#C1FFC1",
    "PHYSICAL": "#FAFAFA",
    "ELECTRO": "#EEAEEE",
    "GEO": "#EEE685",
    "PYRO": "#FFE4E1",
    "HYDRO": "#C6E2FF",
    "DENDRO": "	#9BCD9B",
  }

  readonly propList: (keyof DamageResult)[] = [
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
  };
  readonly specialColorMap: Record<string, string|undefined> = {
    'overloadedDmg': '#FFE4E1',
    'burningDmg': '#FFE4E1',
    'electroChargedDmg': '#EEAEEE',
    'superconductDmg': '#B2DFEE',
    'swirlCryoDmg': '#B2DFEE',
    'swirlElectroDmg': '#EEAEEE',
    'swirlPyroDmg': '#FFE4E1',
    'swirlHydroDmg': '#C6E2FF',
    'shieldHp': '#EEE685',
    'destructionDmg': '#FAFAFA',
  };

  //キャラ
  @Input('characterIndex') characterIndex!: number | string;
  //スキル
  @Input('skill') skill!: string;
  //インデックス値
  @Input('valueIndexs') valueIndexs!: number[];
  //強制元素オーバライド
  @Input('overrideElement') overrideElement!: string;

  //ダメージデータ
  dmgDatas!: DamageResult[];
  //カラー
  colors!: string[];

  constructor(private calculatorService: CalculatorService) { 
    this.calculatorService.changed().subscribe((v: boolean)=>{
      if(v){
        console.log("!!!!!!")
        this.initDatas();
      }
    })
  }

  ngOnInit(): void { 
    this.initDatas();
  }

  // ngOnChanges(changes: SimpleChanges) {
  //   if (changes['skillLevelIndex'] || changes['overrideElement']) {
  //     this.initDatas();
  //   }
  // }

  initDatas(){
    this.dmgDatas = this.getInfos();
    this.colors = [];
    for(let data of this.dmgDatas){
      this.colors.push(this.getElementColor(data.elementBonusType));
    }
  }

  private getInfos(){
    let temp = this.calculatorService.getSkillDmgValue(this.characterIndex, this.skill, this.valueIndexs, this.overrideElement);
    return temp;
  }

  private getElementFromBonus(element: string){
    return Const.MAP_ELEMENT_REVERSE.get(element)!;
  }

  private getElementColor(element: string){
    return this.colorMap[this.getElementFromBonus(element)];
  }

}
