import { Injectable } from '@angular/core';
import { Const, GenshinDataService, StorageService, weapon } from 'src/app/shared/shared.module';

export interface WeaponStorageInfo {
  weapon?: string;
  level?: string;
  smeltingLevel?: string;
}

@Injectable({
  providedIn: 'root'
})
export class WeaponService {

  //データマップ
  dataMap!: Record<string, WeaponStorageInfo>;

  constructor(private genshinDataService: GenshinDataService, private storageService: StorageService) { 
    let temp = this.storageService.getJSONItem(Const.SAVE_CHARACTER_WEAPON)
    if(temp){
      this.dataMap = temp;
    }else{
      this.dataMap = {};;
    }
  }

  getMap(): Record<string, weapon> {
    return GenshinDataService.dataWeapon;
  }

  get(index: string | number): weapon {
    return this.genshinDataService.getWeapon(index.toString())!;
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

  //ストレージに保存
  saveData(){
    this.storageService.setJSONItem(Const.SAVE_CHARACTER_WEAPON, this.dataMap)
  }
}
