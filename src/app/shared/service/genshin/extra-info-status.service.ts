import { Injectable } from '@angular/core';
import { Const, StorageService, ExtraInfo, ExtraInfoStatus, ExtraDataService } from 'src/app/shared/shared.module';
import { keysEqual } from 'src/app/shared/class/util';
@Injectable({
  providedIn: 'root'
})
export class ExtraInfoService {

  //データマップ
  dataMap!: Record<string, ExtraInfo>;

  constructor(private storageService: StorageService, private extraDataService: ExtraDataService) {
    let temp = this.storageService.getJSONItem(Const.SAVE_EXTRA_INFO_STATUS)
    if(temp){
      this.dataMap = temp;
    }else{
      this.dataMap = {};
    }
  }

  //取得
  getStorageInfo(index: string | number){
    let indexStr = index.toString();
    return this.dataMap[indexStr];
  }

  //クリア
  clearStorageInfo(index: string | number){
    let indexStr = index.toString();
    delete this.dataMap[indexStr];
  }

  //ストレージに保存
  saveData(){
    this.storageService.setJSONItem(Const.SAVE_EXTRA_INFO_STATUS, this.dataMap);
  }

  //非表示処理
  hideExtraDataIndex(charIndex: string | number, skillType: string, index: number, prodIndex?: number){
    this.setExtraDataIndexHidden('del', charIndex, skillType, index, prodIndex);
  }

  //表示処理
  showExtraDataIndex(charIndex: string | number, skillType: string, index: number, prodIndex?: number){
    this.setExtraDataIndexHidden('add', charIndex, skillType, index, prodIndex);
  }

  //表示状態取得
  getExtraDataHiddenStatus(charIndex: string | number, skillType: string, index: number, prodIndex?: number){
    const tempData = this.getCharExtraInfoStatus(charIndex, skillType, prodIndex);
    if (tempData !== undefined && index in tempData) {
      return tempData[index];
    }
    return false;
  }

  //デフォールト追加データ設定
  setDefaultExtraData(index: string | number, force: boolean = false){
    let keyStr = index.toString();
    if(!this.dataMap[keyStr]){
      this.dataMap[keyStr] = {};
    }
    if(force){
      this.dataMap[keyStr] = this.extraDataService.getCharacterExtraInfoDefaultSetting(index);
    }else{
      this.checkExtraData(keyStr);
    }
  }

  getCharExtraInfoStatus(charIndex: string | number, skillType: string, prodIndex?: number){
    const keyStr = charIndex.toString();
    if(!this.dataMap.hasOwnProperty(keyStr)){
      this.initDefaultData(keyStr);
    }
    const extraDataInfo = this.dataMap[keyStr];
    let tempData: undefined | ExtraInfoStatus = undefined;
    switch(skillType){
      case Const.NAME_SKILLS_NORMAL:
        tempData = extraDataInfo?.skills?.normal ?? {};
        break;
      case Const.NAME_SKILLS_SKILL:
        tempData = extraDataInfo?.skills?.skill ?? {};
        break;
      case Const.NAME_SKILLS_ELEMENTAL_BURST:
        tempData = extraDataInfo?.skills?.elementalBurst ?? {};
        break;
      case Const.NAME_SKILLS_OTHER:
        tempData = extraDataInfo?.skills?.other ?? {};
        break;
      case Const.NAME_SKILLS_PROUD:
        if (extraDataInfo?.skills?.proudSkills) {
          tempData = extraDataInfo.skills.proudSkills[prodIndex!];
        } else {
          tempData = {};
        }
        break;
      case Const.NAME_CONSTELLATION:
        if (extraDataInfo?.constellation) {
          tempData = extraDataInfo.constellation[prodIndex!];
        } else {
          tempData = {};
        }
        break;
    }
    return tempData;
  }

  private setExtraDataIndexHidden(type: 'add' | 'del', charIndex: string | number, skillType: string, index: number, prodIndex?: number){
    const tempData = this.getCharExtraInfoStatus(charIndex, skillType, prodIndex);
    if (tempData !== undefined && index in tempData) {
      if (type == 'del') {
        tempData[index] = false;
      } else if (type == 'add'){
        tempData[index] = true;
      }
    }
  }
  
  private initDefaultData(keyStr: string){
    if(this.dataMap[keyStr] == undefined){
      this.dataMap[keyStr] = this.extraDataService.getCharacterExtraInfoDefaultSetting(keyStr);
    }
  }

  private checkExtraData(index: string){
    let target = this.extraDataService.getCharacterExtraInfoDefaultSetting(index);
    if(Object.keys(this.dataMap[index]??{}).length === 0){
      this.dataMap[index] = target;
    }else{
      let origin = this.dataMap[index];
      if(!keysEqual(origin?.skills?.proudSkills?origin?.skills?.proudSkills[0]:undefined, target.skills?.proudSkills?target.skills?.proudSkills[0]:undefined)
        ||!keysEqual(origin?.skills?.proudSkills?origin?.skills?.proudSkills[1]:undefined, target.skills?.proudSkills?target.skills?.proudSkills[1]:undefined)
        ||!keysEqual(origin?.skills?.proudSkills?origin?.skills?.proudSkills[2]:undefined, target.skills?.proudSkills?target.skills?.proudSkills[3]:undefined)
        ||!keysEqual(origin?.skills?.proudSkills?origin?.skills?.proudSkills[4]:undefined, target.skills?.proudSkills?target.skills?.proudSkills[4]:undefined)
        ||!keysEqual(origin?.constellation?origin?.constellation[0]:undefined, target?.constellation?target?.constellation[0]:undefined)
        ||!keysEqual(origin?.constellation?origin?.constellation[1]:undefined, target?.constellation?target?.constellation[1]:undefined)
        ||!keysEqual(origin?.constellation?origin?.constellation[2]:undefined, target?.constellation?target?.constellation[2]:undefined)
        ||!keysEqual(origin?.constellation?origin?.constellation[3]:undefined, target?.constellation?target?.constellation[3]:undefined)
        ||!keysEqual(origin?.constellation?origin?.constellation[4]:undefined, target?.constellation?target?.constellation[4]:undefined)
        ||!keysEqual(origin?.constellation?origin?.constellation[5]:undefined, target?.constellation?target?.constellation[5]:undefined)
        ||!keysEqual(origin?.skills?.normal, target.skills?.normal)
        ||!keysEqual(origin?.skills?.skill, target.skills?.skill)
        ||!keysEqual(origin?.skills?.other, target.skills?.other)
        ||!keysEqual(origin?.skills?.elementalBurst, target.skills?.elementalBurst)
      ){
        this.dataMap[index] = target;
      } 
    }
  }
}
