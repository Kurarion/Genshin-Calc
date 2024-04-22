import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { keysEqual } from 'src/app/shared/class/util';
import { character, Const, GenshinDataService, ExtraCharacterData, StorageService, ExtraDataService, ExtraStatus, CharaInfo } from 'src/app/shared/shared.module';

export interface CharacterStorageInfo {
  level?: string;
  normalLevel?: string;
  skillLevel?: string;
  elementalBurstLevel?: string;
  extra?: ExtraCharacterData;
  overrideElement?: string;
  other?: Record<string, CharacterOtherData>;
}

export interface CharacterOtherData {
  flag?: Record<string, boolean>
  data: any;
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

  //クリア
  clearStorageInfo(index: string | number){
    let indexStr = index.toString();
    delete this.dataMap[indexStr];
  }

  getMap(): Record<string, character> {
    return GenshinDataService.dataCharacter;
  }

  get(index: string | number): character {
    return this.genshinDataService.getCharacter(index.toString());
  }

  getCharaInfo(index: string | number): CharaInfo {
    let indexStr = index.toString();
    let temp: CharaInfo = {
      index: indexStr,
      names: GenshinDataService.dataCharacter[indexStr].name,
      routerLink: Const.MENU_CHARACTER,
      queryParams: {
        index: indexStr,
      },
      iconImg: GenshinDataService.dataCharacter[indexStr].images.icon,
      weaponType: GenshinDataService.dataCharacter[indexStr].weaponType,
      elementTypeNumber: GenshinDataService.dataCharacter[indexStr].info.elementType,
      elementType: Const.ELEMENT_TYPE_MAP.get(GenshinDataService.dataCharacter[indexStr].info.elementType),
      elementSvg: Const.ELEMENT_SVG_PATH.get(GenshinDataService.dataCharacter[indexStr].info.elementType),
      bgImg: Const[GenshinDataService.dataCharacter[indexStr].qualityType+Const.QUALITY_BG_SUFFIX as keyof Const],
    };
    return temp;
  }

  //設定取得
  getStorageInfo(charIndex: string | number){
    let keyStr = charIndex.toString();
    return this.dataMap[keyStr];
  }

  getStorageMapKeys(){
    return Object.keys(this.dataMap);
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
  setOverrideElement(index: string | number, overrideElement: string | undefined, notOverWrite: boolean = false) {
    let keyStr = index.toString();
    const originElement = this.dataMap[keyStr].overrideElement;
    if(notOverWrite && originElement !== "" && originElement !== undefined){
      return;
    }
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

  getOtherData(index: string | number, key?: string){
    let keyStr = index.toString();
    if(keyStr in this.dataMap && this.dataMap[keyStr]){
      let tempData = this.dataMap[keyStr]?.other ?? undefined;
      if (key) {
        tempData = tempData?.[key]?.data;
      }
      return tempData;
    }
    return undefined;
  }

  setOtherData(index: string | number, key: string, value: any){
    let keyStr = index.toString();
    if(!this.dataMap[keyStr]){
      this.dataMap[keyStr] = {};
    }
    if(this.dataMap[keyStr].other == undefined){
      this.dataMap[keyStr].other = {} as Record<string, CharacterOtherData>;
    }
    this.dataMap[keyStr].other![key] = {
      data: value
    };
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
      case Const.NAME_SKILLS_NORMAL:
        skillStatus = extraData!.skills!.normal!;
        break;
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
      if(!keysEqual(origin?.skills?.proudSkills?origin?.skills?.proudSkills?.[0]:undefined, target.skills?.proudSkills?target.skills?.proudSkills?.[0]:undefined)
        ||!keysEqual(origin?.skills?.proudSkills?origin?.skills?.proudSkills?.[1]:undefined, target.skills?.proudSkills?target.skills?.proudSkills?.[1]:undefined)
        ||!keysEqual(origin?.skills?.proudSkills?origin?.skills?.proudSkills?.[2]:undefined, target.skills?.proudSkills?target.skills?.proudSkills?.[2]:undefined)
        ||!keysEqual(origin?.skills?.proudSkills?origin?.skills?.proudSkills?.[3]:undefined, target.skills?.proudSkills?target.skills?.proudSkills?.[3]:undefined)
        ||!keysEqual(origin?.constellation?origin?.constellation?.[0]:undefined, target?.constellation?target?.constellation?.[0]:undefined)
        ||!keysEqual(origin?.constellation?origin?.constellation?.[1]:undefined, target?.constellation?target?.constellation?.[1]:undefined)
        ||!keysEqual(origin?.constellation?origin?.constellation?.[2]:undefined, target?.constellation?target?.constellation?.[2]:undefined)
        ||!keysEqual(origin?.constellation?origin?.constellation?.[3]:undefined, target?.constellation?target?.constellation?.[3]:undefined)
        ||!keysEqual(origin?.constellation?origin?.constellation?.[4]:undefined, target?.constellation?target?.constellation?.[4]:undefined)
        ||!keysEqual(origin?.constellation?origin?.constellation?.[5]:undefined, target?.constellation?target?.constellation?.[5]:undefined)
        ||!keysEqual(origin?.skills?.normal, target.skills?.normal)
        ||!keysEqual(origin?.skills?.skill, target.skills?.skill)
        ||!keysEqual(origin?.skills?.other, target.skills?.other)
        ||!keysEqual(origin?.skills?.elementalBurst, target.skills?.elementalBurst)
      ){
        this.dataMap[index].extra = target;
      } 
    }
  }
}
