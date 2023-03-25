import { Injectable } from '@angular/core';
import { keysEqual } from 'src/app/shared/class/util';
import { Const, ExtraDataService, ExtraStatus, ExtraWeaponData, GenshinDataService, StorageService, weapon } from 'src/app/shared/shared.module';

export interface WeaponStorageInfo {
  weapon?: string;
  level?: string;
  smeltingLevel?: string;
  extra?: ExtraWeaponData;
}

@Injectable({
  providedIn: 'root'
})
export class WeaponService {

  //データマップ
  dataMap!: Record<string, WeaponStorageInfo>;

  constructor(private genshinDataService: GenshinDataService, private storageService: StorageService, private extraDataService: ExtraDataService) { 
    let temp = this.storageService.getJSONItem(Const.SAVE_CHARACTER_WEAPON)
    if(temp){
      this.dataMap = temp;
    }else{
      this.dataMap = {};
    }
  }

  //クリア
  clearStorageInfo(index: string | number){
    let indexStr = index.toString();
    delete this.dataMap[indexStr];
  }

  getMap(): Record<string, weapon> {
    return GenshinDataService.dataWeapon;
  }

  get(index: string | number): weapon {
    return this.genshinDataService.getWeapon(index.toString())!;
  }

  //設定取得
  getStorageInfo(charIndex: string | number){
    let keyStr = charIndex.toString();
    return this.dataMap[keyStr];
  }

  //デフォルト武器取得
  getIndex(charIndex: string | number): string|undefined {
    let keyStr = charIndex.toString();
    if(keyStr in this.dataMap && this.dataMap[keyStr]){
      return this.dataMap[keyStr].weapon;
    }
    return undefined;
  }

  //武器設定
  setIndex(charIndex: string | number, index: string | number) {
    let charKeyStr = charIndex.toString();
    let weaponKeyStr = index.toString();
    if(!this.dataMap[charKeyStr]){
      this.dataMap[charKeyStr] = {};
    }
    this.dataMap[charKeyStr].weapon = weaponKeyStr;
  }

  //デフォルトレベル取得
  getLevel(charIndex: string | number): string|undefined {
    let keyStr = charIndex.toString();
    if(keyStr in this.dataMap && this.dataMap[keyStr]){
      return this.dataMap[keyStr].level;
    }
    return undefined;
  }

  //レベル設定
  setLevel(charIndex: string | number, level: string) {
    let charKeyStr = charIndex.toString();
    if(!this.dataMap[charKeyStr]){
      this.dataMap[charKeyStr] = {};
    }
    this.dataMap[charKeyStr].level = level;
  }

  //突破レベル取得
  getSmeltingLevel(charIndex: string | number): string|undefined {
    let keyStr = charIndex.toString();
    if(keyStr in this.dataMap && this.dataMap[keyStr]){
      return this.dataMap[keyStr].smeltingLevel;
    }
    return undefined;
  }

  //突破レベル設定
  setSmeltingLevel(charIndex: string | number, smeltingLevel: string) {
    let charKeyStr = charIndex.toString();
    if(!this.dataMap[charKeyStr]){
      this.dataMap[charKeyStr] = {};
    }
    this.dataMap[charKeyStr].smeltingLevel = smeltingLevel;
  }

  //デフォールト追加データ設定
  setDefaultExtraData(charIndex: string | number, index: string | number, force: boolean = false){
    let charKeyStr = charIndex.toString();
    let weaponKeyStr = index.toString();
    if(!this.dataMap[charKeyStr]){
      this.dataMap[charKeyStr] = {};
    }
    if(force){
      this.dataMap[charKeyStr].extra = this.extraDataService.getWeaponDefaultSetting(weaponKeyStr);
    }else{
      this.checkExtraData(charKeyStr, weaponKeyStr);
    }
  }
  
  //追加データクリア
  clearExtraData(index: string | number){
    delete this.getExtraData(index)?.effect;
  }

  //追加データ取得
  getExtraData(index: string | number){
    let charKeyStr = index.toString();
    if(charKeyStr in this.dataMap && this.dataMap[charKeyStr]){
      return this.dataMap[charKeyStr].extra;
    }
    return undefined;
  }

  setExtraSwitch(index: string | number, skill: string, buffIndex: number, enable: boolean, skillIndex?: number | string){
    let skillStatus = this.getExtraSkillData(index, skill, skillIndex);
    if(skillStatus['switchOnSet'] == undefined){
      skillStatus['switchOnSet'] = {};
    }
    skillStatus['switchOnSet'][buffIndex.toString()] = enable;
  }

  setExtraSlider(index: string | number, skill: string, buffIndex: number, setValue: number, skillIndex?: number | string){
    let skillStatus = this.getExtraSkillData(index, skill, skillIndex);
    if(skillStatus['sliderNumMap'] == undefined){
      skillStatus['sliderNumMap'] = {};
    }
    skillStatus['sliderNumMap'][buffIndex.toString()] = setValue;
  }

  getExtraSwitch(index: string | number, skill: string, buffIndex: number, skillIndex?: number | string){
    let skillStatus = this.getExtraSkillData(index, skill, skillIndex);
    if(skillStatus['switchOnSet'] != undefined){
      return skillStatus['switchOnSet'][buffIndex.toString()];
    }
    return false;
  }

  getExtraSlider(index: string | number, skill: string, buffIndex: number, skillIndex?: number | string){
    let skillStatus = this.getExtraSkillData(index, skill, skillIndex);
    if(skillStatus['sliderNumMap'] != undefined){
      return skillStatus['sliderNumMap'][buffIndex.toString()];
    }
    return 0;
  }

  //ストレージに保存
  saveData(){
    this.storageService.setJSONItem(Const.SAVE_CHARACTER_WEAPON, this.dataMap)
  }

  private getExtraSkillData(index: string | number, skill: string, skillIndex?: number | string){
    let keyStr = index.toString();
    let skillStatus!: ExtraStatus;
    let extraData = this.dataMap[keyStr].extra;
    switch(skill){
      case Const.NAME_EFFECT:
        skillStatus = extraData!.effect!;
        break;
    }
    return skillStatus!;
  }
  
  private checkExtraData(index: string, weaponIndex: string){
    let target = this.extraDataService.getWeaponDefaultSetting(weaponIndex);
    if(Object.keys(this.getExtraData(index)??{}).length === 0){
      this.dataMap[index].extra = target;
    }else{
      let origin = this.dataMap[index].extra;
      if(!keysEqual(origin?.effect, target.effect)){
        this.dataMap[index].extra = target;
      } 
    }
  }
}
