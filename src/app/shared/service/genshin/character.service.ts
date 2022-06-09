import { Injectable } from '@angular/core';
import { character, Const, GenshinDataService, ExtraCharacterData, StorageService, ExtraDataService } from 'src/app/shared/shared.module';

export interface CharacterStorageInfo {
  level?: string;
  normalLevel?: string;
  skillLevel?: string;
  elementalBurstLevel?: string;
  extra?: ExtraCharacterData;
}

@Injectable({
  providedIn: 'root'
})
export class CharacterService {

  //データマップ
  dataMap!: Record<string, CharacterStorageInfo>;

  constructor(private genshinDataService: GenshinDataService, private storageService: StorageService, private extraDataService: ExtraDataService) {
    let temp = this.storageService.getJSONItem(Const.SAVE_CHARACTER)
    if(temp){
      this.dataMap = temp;
    }else{
      this.dataMap = {};
    }
  }

  getMap(): Record<string, character> {
    return GenshinDataService.dataCharacter;
  }

  get(index: string | number): character {
    return this.genshinDataService.getCharacter(index.toString());
  }

  //設定取得
  getStorageInfo(charIndex: string | number){
    let keyStr = charIndex.toString();
    return this.dataMap[keyStr];
  }

  getNormalLevel(index: string | number): string|undefined {
    let keyStr = index.toString();
    if(keyStr in this.dataMap && this.dataMap[keyStr]){
      return this.dataMap[keyStr].normalLevel;
    }
    return undefined;
  }
  
  setNormalLevel(index: string | number, normalLevel: string) {
    let keyStr = index.toString();
    if(!this.dataMap[keyStr]){
      this.dataMap[keyStr] = {};
    }
    this.dataMap[keyStr].normalLevel = normalLevel;
  }

  getSkillLevel(index: string | number): string|undefined {
    let keyStr = index.toString();
    if(keyStr in this.dataMap && this.dataMap[keyStr]){
      return this.dataMap[keyStr].skillLevel;
    }
    return undefined;
  }
  
  setSkillLevel(index: string | number, skillLevel: string) {
    let keyStr = index.toString();
    if(!this.dataMap[keyStr]){
      this.dataMap[keyStr] = {};
    }
    this.dataMap[keyStr].skillLevel = skillLevel;
  }

  getElementalBurstLevel(index: string | number): string|undefined {
    let keyStr = index.toString();
    if(keyStr in this.dataMap && this.dataMap[keyStr]){
      return this.dataMap[keyStr].elementalBurstLevel;
    }
    return undefined;
  }
  
  setElementalBurstLevel(index: string | number, elementalBurstLevel: string) {
    let keyStr = index.toString();
    if(!this.dataMap[keyStr]){
      this.dataMap[keyStr] = {};
    }
    this.dataMap[keyStr].elementalBurstLevel = elementalBurstLevel;
  }

  //デフォルトレベル取得
  getLevel(index: string | number): string|undefined {
    let keyStr = index.toString();
    if(keyStr in this.dataMap && this.dataMap[keyStr]){
      return this.dataMap[keyStr].level;
    }
    return undefined;
  }

  //レベル設定
  setLevel(index: string | number, level: string) {
    let keyStr = index.toString();
    if(!this.dataMap[keyStr]){
      this.dataMap[keyStr] = {};
    }
    this.dataMap[keyStr].level = level;
  }

  //デフォールト追加データ設定
  setDefaultExtraData(index: string | number){
    let keyStr = index.toString();
    if(!this.dataMap[keyStr]){
      this.dataMap[keyStr] = {};
    }
    if(Object.keys(this.getExtraData(keyStr)??{}).length === 0){
      this.dataMap[keyStr].extra = this.extraDataService.getCharacterDefaultSetting(index);
    }
  }

  //追加データ取得
  getExtraData(index: string | number){
    let keyStr = index.toString();
    if(keyStr in this.dataMap && this.dataMap[keyStr]){
      return this.dataMap[keyStr].extra;
    }
    return undefined;
  }

  //ストレージに保存
  saveData(){
    this.storageService.setJSONItem(Const.SAVE_CHARACTER, this.dataMap)
  }
}
