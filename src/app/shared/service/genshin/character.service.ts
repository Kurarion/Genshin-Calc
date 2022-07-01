import { Injectable } from '@angular/core';
import { character, Const, GenshinDataService, ExtraCharacterData, StorageService, ExtraDataService, ExtraStatus } from 'src/app/shared/shared.module';

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
  setDefaultExtraData(index: string | number, force: boolean = false){
    let keyStr = index.toString();
    if(!this.dataMap[keyStr]){
      this.dataMap[keyStr] = {};
    }
    if(Object.keys(this.getExtraData(keyStr)??{}).length === 0 || force){
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
    this.storageService.setJSONItem(Const.SAVE_CHARACTER, this.dataMap)
  }

  private getExtraSkillData(index: string | number, skill: string, skillIndex?: number | string){
    let keyStr = index.toString();
    let skillStatus!: ExtraStatus;
    let extraData = this.dataMap[keyStr].extra;
    switch(skill){
      case Const.NAME_SKILLS_SKILL:
        skillStatus = extraData!.skills!.skill!;
        break;
      case Const.NAME_SKILLS_ELEMENTAL_BURST:
        skillStatus = extraData!.skills!.elementalBurst!;
        break;
      case Const.NAME_SKILLS_PROUD:
        skillStatus = extraData!.skills!.proudSkills![skillIndex as number]!;
        break;
      case Const.NAME_CONSTELLATION:
        skillStatus = extraData!.constellation![skillIndex as string]!;
        break;
    }
    return skillStatus!;
  }
}
