import { Injectable } from '@angular/core';
import { Const, ExtraArtifact, ExtraSkillInfo, GenshinDataService, StorageService } from 'src/app/shared/shared.module';

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
  skill?: ExtraStatus;
  elementalBurst?: ExtraStatus;
  proudSkills?: ExtraStatus[];
}

export interface ExtraWeaponData {
  effect?: ExtraStatus;
}

export interface ExtraArtifactSetData {
  set1?: ExtraStatus;
  set2?: ExtraStatus;
}

export interface ExtraStatus {
  switchOnSet?: Record<string, boolean>;
  sliderNumMap?: Record<string, number>;
}

@Injectable({
  providedIn: 'root'
})
export class ExtraDataService {

  //データマップ
  dataMap!: Record<string, ExtraDataStorageInfo>;

  constructor(private genshinDataService: GenshinDataService, private storageService: StorageService) { }
  
  getCharacter(index: string | number){
    return this.genshinDataService.getExtraCharacterData(index.toString());
  }

  getWeapon(index: string | number){
    return this.genshinDataService.getExtraWeaponData(index.toString());
  }

  getArtifactSet(index: string | number){
    return this.genshinDataService.getExtraArtifactData(index.toString());
  }

  getCharacterDefaultSetting(index: string | number){

    let temp = this.getCharacter(index);
    let result: ExtraCharacterData = {}
    if(!temp){
      return result;
    }

    result.skills = {};
    result.skills.skill = this.getDefaultConfig(temp?.skills?.skill);
    result.skills.elementalBurst = this.getDefaultConfig(temp?.skills?.elementalBurst);
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

  getArtifactSetDefaultSetting(indexs: string[], fullIndex: string){
    let result: ExtraArtifactSetData = {}
    if(fullIndex != ''){
      let temp = this.getArtifactSet(fullIndex);
      result.set1 = this.getDefaultConfig(temp?.set1);
      result.set2 = this.getDefaultConfig(temp?.set2);
    }else{
      for(let [index, value] of indexs.entries()){
        let key = Const.NAME_SET + (index + 1).toString();
        if(value && value != ''){
          let temp = this.getArtifactSet(value);
          result[key as keyof ExtraArtifactSetData] = this.getDefaultConfig(temp?temp.set1:undefined);
        }else{
          result[key as keyof ExtraArtifactSetData] = {};
        }
      }
    }

    return result;
  }

  private getDefaultConfig(skills: ExtraSkillInfo[] | undefined){
    let result: ExtraStatus = {}
    
    for(let [index,obj] of skills?.entries() ?? []){
      switch(obj?.buff?.settingType){
        case 'switch-value':
        case 'switch':
          {
            if(!result.switchOnSet){
              result.switchOnSet = {};
            }
            result.switchOnSet![index.toString()] = obj.buff.defaultEnable ?? false;
          }
          break;
        case 'slider':
          {
            if(!result.sliderNumMap){
              result.sliderNumMap = {};
            }
            result.sliderNumMap![index.toString()] = obj.buff.sliderInitialValue ?? 0;
          }
          break;
        case 'resident':
          {
            if(!result.switchOnSet){
              result.switchOnSet = {};
            }
            result.switchOnSet![index.toString()] = true;
          }
          break;
      }
    }

    return result;
  }
}
