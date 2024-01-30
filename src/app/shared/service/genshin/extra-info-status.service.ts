import { Injectable } from '@angular/core';
import { Const, StorageService } from 'src/app/shared/shared.module';

export interface ExtraInfo {
  normal?: ExtraInfoStatus;
  skill?: ExtraInfoStatus;
  other?: ExtraInfoStatus;
  elementalBurst?: ExtraInfoStatus;
  proudSkills?: ExtraInfoStatus[];
}
export interface ExtraInfoStatus {
  hidden?: number[];
}

@Injectable({
  providedIn: 'root'
})
export class ExtraInfoService {

  //データマップ
  dataMap!: Record<string, ExtraInfo>;

  constructor(private storageService: StorageService) {
    let temp = this.storageService.getJSONItem(Const.SAVE_EXTRA_INFO_STATUS)
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
    if (tempData?.hidden?.includes(index)) {
      return true;
    }
    return false;
  }

  private setExtraDataIndexHidden(type: 'add' | 'del', charIndex: string | number, skillType: string, index: number, prodIndex?: number){
    const tempData = this.getCharExtraInfoStatus(charIndex, skillType, prodIndex);
    if (tempData !== undefined) {
      if (type == 'del') {
        tempData.hidden = tempData.hidden?.filter((item) => item !== index) ?? [];
      } else if (type == 'add'){
        if (!tempData.hidden?.includes(index)) {
          tempData.hidden = tempData.hidden ?? [];
          tempData.hidden.push(index);
        }
      }
    }
  }

  private getCharExtraInfoStatus(charIndex: string | number, skillType: string, prodIndex?: number){
    const keyStr = charIndex.toString();
    if(!this.dataMap.hasOwnProperty(keyStr)){
      this.initDefaultData(keyStr);
    }
    const extraDataInfo = this.dataMap[keyStr];
    let tempData: undefined | ExtraInfoStatus = undefined;
    switch(skillType){
      case Const.NAME_SKILLS_NORMAL:
        tempData = extraDataInfo?.normal ?? {};
        break;
      case Const.NAME_SKILLS_SKILL:
        tempData = extraDataInfo?.skill ?? {};
        break;
      case Const.NAME_SKILLS_ELEMENTAL_BURST:
        tempData = extraDataInfo?.elementalBurst ?? {};
        break;
      case Const.NAME_SKILLS_OTHER:
        tempData = extraDataInfo?.other ?? {};
        break;
      case Const.NAME_SKILLS_PROUD:
        tempData = (extraDataInfo?.proudSkills ?? [{}, {}, {}, {}])[prodIndex!];
        break;
    }
    return tempData;
  }
  
  private initDefaultData(keyStr: string){
    if(this.dataMap[keyStr] == undefined){
      this.dataMap[keyStr] = {};
    }
  }
}
