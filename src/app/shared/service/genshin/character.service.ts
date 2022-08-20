import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { character, Const, GenshinDataService, ExtraCharacterData, StorageService, ExtraDataService, ExtraStatus } from 'src/app/shared/shared.module';

export interface CharacterStorageInfo {
  level?: string;
  normalLevel?: string;
  skillLevel?: string;
  elementalBurstLevel?: string;
  extra?: ExtraCharacterData;
  overrideElement?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CharacterService {

  //データマップ
  dataMap!: Record<string, CharacterStorageInfo>;
  //元素付与変更
  private overrideElementChanged: Subject<void> = new Subject<void>();
  private overrideElementChanged$ = this.overrideElementChanged.asObservable();

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

  //元素付与取得
  getOverrideElement(index: string | number): string {
    let keyStr = index.toString();
    if(keyStr in this.dataMap && this.dataMap[keyStr]){
      return this.dataMap[keyStr].overrideElement ?? "";
    }
    return "";
  }

  //元素付与設定
  setOverrideElement(index: string | number, overrideElement: string | undefined) {
    let keyStr = index.toString();
    let toSetElement = overrideElement ?? "";
    if(!this.dataMap[keyStr]){
      this.dataMap[keyStr] = {};
    }
    this.dataMap[keyStr].overrideElement = toSetElement;
    this.overrideElementChanged.next();
  }

  getOverrideElementChanged(){
    return this.overrideElementChanged$;
  }

  //デフォールト追加データ設定
  setDefaultExtraData(index: string | number, force: boolean = false){
    let keyStr = index.toString();
    if(!this.dataMap[keyStr]){
      this.dataMap[keyStr] = {};
    }
    if(force){
      this.dataMap[keyStr].extra = this.extraDataService.getCharacterDefaultSetting(index);
    }else{
      this.checkExtraData(keyStr);
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
      case Const.NAME_SKILLS_OTHER:
        skillStatus = extraData!.skills!.other!;
        break;
      case Const.NAME_CONSTELLATION:
        skillStatus = extraData!.constellation![skillIndex as string]!;
        break;
    }
    return skillStatus!;
  }

  private checkExtraData(index: string){
    let target = this.extraDataService.getCharacterDefaultSetting(index);
    if(Object.keys(this.getExtraData(index)??{}).length === 0){
      this.dataMap[index].extra = target;
    }else{
      let origin = this.dataMap[index].extra;
      if(!this.keysEqual(origin?.skills?.proudSkills?origin?.skills?.proudSkills[0]:undefined, target.skills?.proudSkills?target.skills?.proudSkills[0]:undefined)
        ||!this.keysEqual(origin?.skills?.proudSkills?origin?.skills?.proudSkills[1]:undefined, target.skills?.proudSkills?target.skills?.proudSkills[1]:undefined)
        ||!this.keysEqual(origin?.skills?.proudSkills?origin?.skills?.proudSkills[2]:undefined, target.skills?.proudSkills?target.skills?.proudSkills[3]:undefined)
        ||!this.keysEqual(origin?.skills?.proudSkills?origin?.skills?.proudSkills[4]:undefined, target.skills?.proudSkills?target.skills?.proudSkills[4]:undefined)
        ||!this.keysEqual(origin?.constellation?origin?.constellation[0]:undefined, target?.constellation?target?.constellation[0]:undefined)
        ||!this.keysEqual(origin?.constellation?origin?.constellation[1]:undefined, target?.constellation?target?.constellation[1]:undefined)
        ||!this.keysEqual(origin?.constellation?origin?.constellation[2]:undefined, target?.constellation?target?.constellation[2]:undefined)
        ||!this.keysEqual(origin?.constellation?origin?.constellation[3]:undefined, target?.constellation?target?.constellation[3]:undefined)
        ||!this.keysEqual(origin?.constellation?origin?.constellation[4]:undefined, target?.constellation?target?.constellation[4]:undefined)
        ||!this.keysEqual(origin?.constellation?origin?.constellation[5]:undefined, target?.constellation?target?.constellation[5]:undefined)
        ||!this.keysEqual(origin?.skills?.skill, target.skills?.skill)
        ||!this.keysEqual(origin?.skills?.other, target.skills?.other)
        ||!this.keysEqual(origin?.skills?.elementalBurst, target.skills?.elementalBurst)
      ){
        this.dataMap[index].extra = target;
      } 
    }
  }

  private keysEqual(origin: any, target: any){
    if(origin == undefined && target != undefined || origin != undefined && target == undefined){
      return false;
    }
    if(origin == undefined && target == undefined){
      return true;
    }
    let result = true;
    for(let i of ['switchOnSet', 'sliderNumMap']){
      if(origin[i] == undefined && target[i] != undefined || origin[i] != undefined && target[i] == undefined){
        result = false;
        continue;
      }
      if(origin[i] == undefined && target[i] == undefined){
        continue;
      }
      const keys1 = Object.keys(origin[i]), keys2 = Object.keys(target[i]);
      if(result && keys1.length != keys2.length){
        result = false;
      }
      if(result && keys1.every(key => !keys2.includes(key))){
        result = false;
      }
      if(i == 'switchOnSet' && result && keys2.every(key => {
        if(target[i][key] === true && origin[i][key] === false){
          return true;
        }
        return false;
      })){
        result = false;
      }
    }
    
    return result;
  }
}
