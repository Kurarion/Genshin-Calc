import { Injectable } from '@angular/core';
import { Const, ExtraSkillInfo, GenshinDataService, StorageService } from 'src/app/shared/shared.module';

//
export interface ExtraDataStorageInfo {
  character?: ExtraCharacterData;
  weapon?: ExtraWeaponData;
}

//
export interface ExtraCharacterData {
  skills?: ExtraCharacterSkillsData;
  constellation?: Record<string, ExtraStatus>;
}

export interface ExtraCharacterSkillsData {
  // normal?: ExtraNormal;
  skill?: ExtraStatus;
  elemental_burst?: ExtraStatus;
  proudSkills?: ExtraStatus[];
}

export interface ExtraWeaponData {
  effect?: ExtraStatus;
}

//
// export interface ExtraNormal {
//   elementType?: string;
// }

export interface ExtraStatus {
  switchOnSet?: Record<string, any>;
  sliderNumMap?: Record<string, number>;
}

@Injectable({
  providedIn: 'root'
})
export class ExtraDataService {

  //データマップ
  dataMap!: Record<string, ExtraDataStorageInfo>;

  constructor(private genshinDataService: GenshinDataService, private storageService: StorageService) { 
    // let temp = this.storageService.getJSONItem(Const.SAVE_EXTRA)
    // if(temp){
    //   this.dataMap = temp;
    // }else{
    //   this.dataMap = {};
    // }
  }
  
  getCharacter(index: string | number){
    return this.genshinDataService.getExtraCharacterData(index.toString());
  }

  getWeapon(index: string | number){
    return this.genshinDataService.getExtraWeaponData(index.toString());
  }

  // //設定取得
  // getStorageInfo(charIndex: string | number){
  //   let keyStr = charIndex.toString();
  //   return this.dataMap[keyStr];
  // }

  getCharacterDefaultSetting(index: string | number){

    let temp = this.getCharacter(index);
    let result: ExtraCharacterData = {}
    if(!temp){
      return result;
    }

    result.skills = {};
    result.skills.skill = this.getDefaultConfig(temp?.skills?.skill);
    result.skills.elemental_burst = this.getDefaultConfig(temp?.skills?.elemental_burst);
    for(let obj of temp?.skills?.proudSkills ?? []){
      if(!(result.skills.proudSkills)){
        result.skills.proudSkills = [];
      }
      result.skills.proudSkills.push(this.getDefaultConfig(obj));
    }
    for(let key in temp?.constellation){
      if(!(result.constellation)){
        result.constellation = {};
      }
      result.constellation[key] = this.getDefaultConfig(temp?.constellation[key]);
    }

    return result;

  }

  getWeaponDefaultSetting(index: string | number){
    let temp = this.getWeapon(index);
    let result: ExtraWeaponData = {}
    if(!temp){
      return result;
    }

    result.effect = this.getDefaultConfig(temp?.effect);

    return result;
  }

  private getDefaultConfig(skills: ExtraSkillInfo[] | undefined){
    let result: ExtraStatus = {}
    
    for(let obj of skills ?? []){
      switch(obj?.buff?.settingType){
        case 'switch-value':
        case 'switch':
          for(let j of obj.buff?.index ?? obj.buff?.constIndex ?? []){
            if(obj.buff.defaultEnable){
              if(!result.switchOnSet){
                result.switchOnSet = {};
              }
              result.switchOnSet![j.toString()] = obj.buff.defaultEnable;
            }
          }
          break;
        case 'slider':
          for(let j of obj.buff?.index ?? obj.buff?.constIndex ?? []){
            if(obj.buff.sliderInitialValue){
              if(!result.sliderNumMap){
                result.sliderNumMap = {};
              }
              result.sliderNumMap![j.toString()] = obj.buff.sliderInitialValue;
            }
          }
          break;
        case 'resident':
          for(let j of obj.buff?.index ?? obj.buff?.constIndex ?? []){
            if(!result.switchOnSet){
              result.switchOnSet = {};
            }
            result.switchOnSet![j.toString()] = true;
          }
          break;
      }
    }

    return result;
  }
}
