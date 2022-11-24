import { PercentPipe } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { ArtifactService, ArtifactStorageInfo, ArtifactStoragePartData, CalculatorService, Const, DamageParam, DamageResult, GenshinDataService } from 'src/app/shared/shared.module';

interface InputItem {
  name: string,
  title: string,
  isInput?: boolean,
  isSelect?: boolean,
  hasEmpty?: boolean,
  isRequire: boolean,
  selectListName?: string,
  useNameMap?: boolean,
  optionNameMap?: Record<string, string>,
  optionTranslationTag?: string,
  model: string,
  onChange: any,
}

@Component({
  selector: 'app-artifact-auto',
  templateUrl: './artifact-auto.component.html',
  styleUrls: ['./artifact-auto.component.css']
})
export class ArtifactAutoComponent implements OnInit {
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
  ]
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

  readonly subs = Const.PROPS_OPTIMAL_ARTIFACT_SUB;
  readonly subsMap: Map<string, number> = new Map([
    [Const.PROP_CRIT_RATE, 1],
    [Const.PROP_CRIT_DMG, 2],
    [Const.PROP_ATTACK_UP, 3],
    [Const.PROP_HP_UP, 4],
    [Const.PROP_DEFENSE_UP, 5],
    [Const.PROP_ELEMENTAL_MASTERY, 6],
    [Const.PROP_ENERGY_RECHARGE, 7],
  ]);
  readonly subsSlotMap: Map<string, string[]> = new Map([
    [Const.PROP_CRIT_RATE, [Const.ARTIFACT_FLOWER.toLowerCase(), Const.ARTIFACT_SUB1.toLowerCase(),]],
    [Const.PROP_CRIT_DMG, [Const.ARTIFACT_FLOWER.toLowerCase(), Const.ARTIFACT_SUB2.toLowerCase(),]],
    [Const.PROP_ATTACK_UP, [Const.ARTIFACT_FLOWER.toLowerCase(), Const.ARTIFACT_SUB3.toLowerCase(),]],
    [Const.PROP_HP_UP, [Const.ARTIFACT_FLOWER.toLowerCase(), Const.ARTIFACT_SUB4.toLowerCase(),]],
    [Const.PROP_DEFENSE_UP, [Const.ARTIFACT_PLUME.toLowerCase(), Const.ARTIFACT_SUB1.toLowerCase(),]],
    [Const.PROP_ELEMENTAL_MASTERY, [Const.ARTIFACT_PLUME.toLowerCase(), Const.ARTIFACT_SUB2.toLowerCase(),]],
    [Const.PROP_ENERGY_RECHARGE, [Const.ARTIFACT_PLUME.toLowerCase(), Const.ARTIFACT_SUB3.toLowerCase(),]],
  ]);
  readonly defaultPoint: number = 250;

  readonly inputItemsMix: InputItem[] = [
    {
      name: "DAMAGE_RATE",
      title: "DAMAGE_RATE",
      isInput: true,
      isRequire: true,
      model: "damageRate",
      onChange: this.setDamageRate.bind(this),
    },
    {
      name: "DAMAGE_BASE",
      title: "DAMAGE_BASE",
      isSelect: true,
      isRequire: true,
      hasEmpty: true,
      selectListName: "damageBaseList",
      optionTranslationTag: "PROPS.",
      model: "damageBase",
      onChange: this.setDamageBase.bind(this),
    },
    {
      name: "DAMAGE_RATE_ATTACH",
      title: "DAMAGE_RATE_ATTACH",
      isInput: true,
      isRequire: false,
      model: "damageRateAttach",
      onChange: this.setDamageRateAttach.bind(this),
    },
    {
      name: "DAMAGE_BASE_ATTACH",
      title: "DAMAGE_BASE_ATTACH",
      isSelect: true,
      isRequire: false,
      hasEmpty: true,
      selectListName: "damageBaseList",
      optionTranslationTag: "PROPS.",
      model: "damageBaseAttach",
      onChange: this.setDamageBaseAttach.bind(this),
    },
    {
      name: "ELEMENT_TYPE",
      title: "ELEMENT_TYPE",
      isSelect: true,
      isRequire: true,
      hasEmpty: true,
      selectListName: "elementTypeList",
      optionTranslationTag: "PROPS.",
      model: "elementType",
      onChange: this.setElementType.bind(this),
    },
    {
      name: "ATTACK_TYPE",
      title: "ATTACK_TYPE",
      isSelect: true,
      isRequire: true,
      hasEmpty: true,
      selectListName: "attackTypeList",
      optionTranslationTag: "PROPS.",
      model: "attackType",
      onChange: this.setAttackType.bind(this),
    },
    {
      name: "DAMAGE_TYPE",
      title: "DAMAGE_TYPE",
      isSelect: true,
      isRequire: true,
      hasEmpty: false,
      selectListName: "damageTypeList",
      optionTranslationTag: "GENSHIN.DMG.",
      useNameMap: true,
      optionNameMap: this.damageTypeNameMap,
      model: "damageType",
      onChange: this.setDamageType.bind(this),
    },
    {
      name: "DAMAGE_TAG",
      title: "DAMAGE_TAG",
      isSelect: true,
      isRequire: false,
      hasEmpty: true,
      selectListName: "damageTagList",
      optionTranslationTag: "TAG.",
      model: "damageTag",
      onChange: this.setDamageTag.bind(this),
    },
    {
      name: "MAX_CRIT_RATE",
      title: "MAX_CRIT_RATE",
      isInput: true,
      isRequire: true,
      model: "maxCritRate",
      onChange: this.setMaxCritRate.bind(this),
    },
  ]

  readonly inputItems: InputItem[] = this.inputItemsMix.concat();

  readonly maxCritRate: number = 101;
  readonly minCritRate: number = 5;
  readonly initDamageRate: number = 50;
  subsReverseMap: Map<string, string> = new Map();

  //キャラインデックス
  @Input('characterIndex') characterIndex!: number;
  //聖遺物セットインデックス
  @Input('index') index!: number;
  //チップ変更通知
  @Output('chipChanged') chipChangedForParent = new EventEmitter<void>();
  //データ
  data!: ArtifactStorageInfo;
  //ミクスタイプ
  isMixRate: boolean = false;

  userInput = new UntypedFormGroup({
    damageRate: new UntypedFormControl(0, [Validators.min(0.01), Validators.required]),//ダメージ倍率
    damageBase: new UntypedFormControl('', Validators.required),//ダメージベース
    damageRateAttach: new UntypedFormControl(0, [Validators.min(0)]),//ダメージ倍率(追加)
    damageBaseAttach: new UntypedFormControl(''),//ダメージベース(追加)
    elementType: new UntypedFormControl('', Validators.required),//元素タイプ
    attackType: new UntypedFormControl('', Validators.required),//攻撃タイプ
    damageType: new UntypedFormControl('', Validators.required),//ダメージタイプ
    damageTag: new UntypedFormControl(''),//タグ
    maxCritRate: new UntypedFormControl(0, [Validators.min(this.minCritRate)]),//最大会心率
  })

  userInputList: Record<string, string[]> = {
    damageBaseList: [],
    elementTypeList: [],
    attackTypeList: [],
    damageTypeList: [],
    damageTagList: [],
  }

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
  currentPoint = new UntypedFormControl({value:0, disabled:true});
  //現在のポイント/10
  currentPointInput = new UntypedFormControl({value:0, disabled:true});
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

  constructor(private artifactService: ArtifactService,
    private genshinDataService: GenshinDataService,
    private calculatorService: CalculatorService,
    private percentPipe: PercentPipe,
    private matSnackBar: MatSnackBar, 
    private translateService: TranslateService) { 
      this.subsMap.forEach((v, k)=>{
        this.subsReverseMap.set(v.toString(), k);
      })
      this.effectNum = 1;
      this.setDisplayWith();
    }

  setDisplayWith(){
    this.displayWith = (value: number) => {
      return this.percentPipe.transform(value / this.maxValidArray[this.effectNum - 1], '1.0-0') as string;
    }
  }

  ngOnInit(): void {
    this.inputItems.splice(2,2);
    //チェックミクス
    this.isMixRate = Const.PROPS_HAS_MIX_RATE.has(this.characterIndex.toString());
    this.initList();
    this.initData();
  }

  @HostListener('window:unload')
  ngOnDestroy(): void {
    //データ保存
    this.artifactService.saveData();
  }

  initData() {
    this.data = this.artifactService.getAllStorageInfo(this.characterIndex, this.index);
    this.userInput.get('damageRate')?.setValue((this.data.autoDamageRate ?? this.initDamageRate));
    this.userInput.get('damageBase')?.setValue(this.data.autoDamageBase ?? '');
    this.userInput.get('damageRateAttach')?.setValue((this.data.autoDamageRateAttach ?? 0));
    this.userInput.get('damageBaseAttach')?.setValue(this.data.autoDamageBaseAttach ?? '');
    this.userInput.get('elementType')?.setValue(this.data.autoElementType ?? '');
    this.userInput.get('attackType')?.setValue(this.data.autoAttackType ?? '');
    this.userInput.get('damageType')?.setValue(this.data.autoDamageType ?? '');
    this.userInput.get('damageTag')?.setValue(this.data.autoDamageTag ?? '');
    this.userInput.get('maxCritRate')?.setValue((this.data.autoMaxCritRate ?? this.maxCritRate));
    this.needUpdate = this.data.autoNeedUpdate ?? true;
    this.effectNum = this.data.autoEffectNum ?? 0;
    this.currentPoint.setValue(this.data.autoPropCurrentPoint ?? 0);
    this.currentPointInput.setValue(this.currentPoint.value / 10);
    this.resultCurve = this.data.autoPropCurve ?? '';
    if(this.resultCurve.length > 0){
      this.currentPoint.enable();
      this.currentPointInput.enable();
    }
    this.setElementType(this.userInput.get('elementType')?.value);
    this.calcActualProp();
  }

  initList(){
    this.userInputList['damageBaseList'] = Const.PROPS_OPTIMAL_DAMAGE_BASE_LIST;
    this.userInputList['damageBaseListAttach'] = Const.PROPS_OPTIMAL_DAMAGE_BASE_LIST;
    this.userInputList['elementTypeList'] = Const.PROPS_OPTIMAL_ELEMENT_TYPE_LIST;
    this.userInputList['attackTypeList'] = Const.PROPS_OPTIMAL_ATTACK_TYPE_LIST;
    this.userInputList['damageTypeList'] = [];
    this.userInputList['damageTagList'] = Const.PROPS_TAG_MAP.get(this.characterIndex.toString()) ?? [];
    this.resultForCalc = new Uint8Array(this.maxValid);
  }

  setDamageRate(value: number){
    if(value != this.data.autoDamageRate){
      this.willNeedUpdate();
    }
    this.data.autoDamageRate = value;
  }

  setDamageBase(value: string){
    if(value != this.data.autoDamageBase){
      this.willNeedUpdate();
    }
    this.data.autoDamageBase = value;
  }

  setDamageRateAttach(value: number){
    if(value != this.data.autoDamageRateAttach){
      this.willNeedUpdate();
    }
    this.data.autoDamageRateAttach = value;
  }

  setDamageBaseAttach(value: string){
    if(value != this.data.autoDamageBaseAttach){
      this.willNeedUpdate();
    }
    this.data.autoDamageBaseAttach = value;
  }

  setElementType(value: string){
    if(value != this.data.autoElementType){
      this.willNeedUpdate();
    }
    this.data.autoElementType = value;
    if(this.userInput.get('elementType')!.value != undefined && (this.userInput.get('elementType')!.value).length > 0){
      this.userInputList['damageTypeList'] = Const.PROPS_OPTIMAL_DAMAGE_TYPE_LIST_MAP.get(this.userInput.get('elementType')!.value as string) as (keyof DamageResult)[];
    }else{
      this.userInputList['damageTypeList'] = [];
    }
  }

  setAttackType(value: string){
    if(value != this.data.autoAttackType){
      this.willNeedUpdate();
    }
    this.data.autoAttackType = value;
  }

  setDamageType(value: string){
    if(value != this.data.autoDamageType){
      this.willNeedUpdate();
    }
    this.data.autoDamageType = value;
  }

  setDamageTag(value: string){
    if(value != this.data.autoDamageTag){
      this.willNeedUpdate();
    }
    this.data.autoDamageTag = value;
  }

  setMaxCritRate(value: number){
    if(value != this.data.autoMaxCritRate){
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

  setNeedUpdate(value = true){
    this.data.autoNeedUpdate = value;
  }

  willNeedUpdate(value = true){
    this.needUpdate = value;
    this.setNeedUpdate();
  }

  setPropCurve(value: string){
    this.data.autoPropCurve = value;
  }

  setPropEffectNum(value: number){
    this.data.autoEffectNum = value;
  }

  setPropCurrentPoint(value: number){
    this.data.autoPropCurrentPoint = value;
    this.calcActualProp();
  }

  resetActualProp(){
    this.subsSlotMap.forEach((v,k)=>{
      (this.data[v[0] as keyof ArtifactStorageInfo] as ArtifactStoragePartData)[v[1]].name = k;
      (this.data[v[0] as keyof ArtifactStorageInfo] as ArtifactStoragePartData)[v[1]].value = 0;
    })
  }

  calcActualProp(){
    if(this.currentPoint.value <= this.resultCurve.length){
      this.resetActualProp();
      for(let i=0; i < this.currentPoint.value; ++i){
        let prop = this.subsReverseMap.get(this.resultCurve[i])!;
        let slot = this.subsSlotMap.get(prop)!;
        (this.data[slot[0] as keyof ArtifactStorageInfo] as ArtifactStoragePartData)[slot[1]].value! += this.genshinDataService.getOptimalReliquaryAffixStep(prop);
      }
    }
    //更新
    this.calculatorService.setDirtyFlag(this.characterIndex);
    this.updateChips();
    this.setDisplayWith();
  }

  onChangeCurrentPointSlider(){
    if(this.currentPoint.value > this.maxValidArray[this.effectNum - 1]){
      this.currentPoint.setValue(this.maxValidArray[this.effectNum - 1]);
    }
    if(this.currentPoint.value < this.minValid){
      this.currentPoint.setValue(0);
    }
    this.currentPointInput.setValue(this.getDisplayValue(this.currentPoint.value));
    this.setPropCurrentPoint(this.currentPoint.value);
  }

  onChangeCurrentPointInput(){
    this.currentPointInput.setValue(parseFloat((Math.floor(this.currentPointInput.value*10)/10).toFixed(1)));
    this.currentPoint.setValue(this.getRowValue(this.currentPointInput.value));
    this.onChangeCurrentPointSlider()
  }

  updateChips(){
    this.chipChangedForParent.emit();
  }

  async optimize(){
    let result = new Promise<void>((resolve) => {
      //チェック
      let hasError = false;
      for(let key in this.userInput.controls){
        this.userInput.get(key)!.markAsDirty();
        this.userInput.get(key)!.markAsTouched();
        const controlErrors: ValidationErrors|undefined|null = this.userInput!.get(key)?.errors;
        if (controlErrors != null && controlErrors != undefined) {
          hasError = true;
        }
      }
      if(hasError){
        return;
      }
      
      setTimeout(()=>{

        //リセット
        this.currentPoint.setValue(0);
        this.currentPointInput.setValue(this.getDisplayValue(this.currentPoint.value));
        this.setPropCurrentPoint(this.currentPoint.value);

        let param: DamageParam = {
          rate: this.userInput.get('damageRate')!.value as number / 100,
          base: this.userInput.get('damageBase')!.value as string,
          rateAttach: [],
          baseAttach: [],
          elementBonusType: this.userInput.get('elementType')!.value as string,
          attackBonusType: this.userInput.get('attackType')!.value as string,
          tag: this.userInput.get('damageTag')!.value as string ?? undefined,
        }
        if(this.isMixRate){
          if(this.userInput.get('damageRateAttach')!.value !== 0 && this.userInput.get('damageBase')!.value !== ''){
            param.rateAttach = [[this.userInput.get('damageRateAttach')!.value as number / 100]];
            param.baseAttach = [this.userInput.get('damageBaseAttach')!.value as string];
          }
        }
        let calcResult: DamageResult;
        let actualEffectSet = new Set();
        let actualEffectNum: number = 0;
        let maxCritRate: number = this.userInput.get('maxCritRate')!.value as number / 100;
        let extraData: Record<string, number>={};
        for(let key of this.subs){
          extraData[key] = 0;
        }

        for(let i = this.minValid; i <= this.maxValid; ++i){
          let tempExtraData = {...extraData};
          let currentLoopMaxProp = "";
          let currentLoopMaxValue = 0;
          for(let key of this.subs){
            let oldValue = tempExtraData[key];
            tempExtraData[key] += this.genshinDataService.getOptimalReliquaryAffixStep(key);
            calcResult = this.calculatorService.getDamage(this.characterIndex, param, tempExtraData);
            if(key == Const.PROP_CRIT_RATE && calcResult.finalCritRate > maxCritRate){
              tempExtraData[key] = oldValue;
              continue;
            }
            if(currentLoopMaxValue < (calcResult[this.userInput.get('damageType')!.value as keyof DamageResult] as number)){
              currentLoopMaxProp = key;
              this.resultForCalc[i] = this.subsMap.get(currentLoopMaxProp)!;
              currentLoopMaxValue = calcResult[this.userInput.get('damageType')!.value as keyof DamageResult] as number;
            }
            tempExtraData[key] = oldValue;
          }
          actualEffectSet.add(currentLoopMaxProp);
          extraData[currentLoopMaxProp] += this.genshinDataService.getOptimalReliquaryAffixStep(currentLoopMaxProp);;
        }

        actualEffectNum = actualEffectSet.size;

        this.resultCurve = this.resultForCalc.join('');
        this.currentPoint.setValue(this.defaultPoint);
        this.currentPoint.enable();
        this.currentPointInput.setValue(this.defaultPoint / 10);
        this.currentPointInput.enable();
        this.effectNum = (actualEffectNum > this.maxValidArray.length - 1)?this.maxValidArray.length - 1:actualEffectNum;
        this.setPropEffectNum(this.effectNum);
        this.setPropCurve(this.resultCurve);
        this.setPropCurrentPoint(this.currentPoint.value);
        this.willNeedUpdate(false);
        resolve();
      })
    });

    return result.then(()=>{
      //完了
      this.translateService.get('AUTO.DONE').subscribe((res: string) => {
        this.matSnackBar.open(res, undefined, {
          duration: 1000
        })
      });
    }).catch(()=>{
      //失敗
      this.translateService.get('AUTO.FAILED').subscribe((res: string) => {
        this.matSnackBar.open(res, undefined, {
          duration: 1000
        })
      });
    })
  }

  getRowValue(v: number, base = 10){
    return parseInt((v * base).toFixed(0));
  }
  getDisplayValue(v: number, base = 10){
    return parseFloat((v / base).toFixed(1));
  }
}
