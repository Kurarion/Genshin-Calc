import { Injectable } from '@angular/core';
import { Const, ExtraDataService, GenshinDataService, StorageService } from 'src/app/shared/shared.module';

export interface OtherStorageInfo {
  name?: string;
  value: number;
  enable?: boolean;
}

export interface OtherStorageData {
  selectedIndex: number;
  info: OtherStorageInfo[];
}

@Injectable({
  providedIn: 'root'
})
export class OtherService {

  //データマップ
  dataMap!: Record<string, OtherStorageData>;

  constructor(private storageService: StorageService, private extraDataService: ExtraDataService) {
    let temp = this.storageService.getJSONItem(Const.SAVE_OTHER)
    if(temp){
      this.dataMap = temp;
    }else{
      this.dataMap = {};
    }
  }

  //ストレージに保存
  saveData(){
    this.storageService.setJSONItem(Const.SAVE_OTHER, this.dataMap);
  }

  //適用中インデックス取得
  getStorageSelectedIndex(charIndex: string | number){
    let keyStr = charIndex.toString();
    this.initDefaultData(keyStr);
    return this.dataMap[keyStr].selectedIndex;
  }

  //適用中インデックス設定
  setStorageSelectedIndex(charIndex: string | number, index: number){
    let keyStr = charIndex.toString();
    this.initDefaultData(keyStr);
    this.dataMap[keyStr].selectedIndex = index;
  }

  //その他バフ削除
  deleteStorageInfo(charIndex: string | number, index: number){
    let keyStr = charIndex.toString();
    this.dataMap[keyStr].info.splice(index, 1);
  }

  //その他バフ追加
  addStorageInfo(charIndex: string | number){
    let keyStr = charIndex.toString();
    this.dataMap[keyStr].info.push({
      value: 0,
    });
  }

  //その他バフコピー
  copyAndCreateStorageInfo(charIndex: string | number, sourceIndex: number){
    let keyStr = charIndex.toString();
    if(Object.keys(this.dataMap[keyStr].info[sourceIndex]).length === 0){
      this.addStorageInfo(keyStr);
    }else{
      this.dataMap[keyStr].info.push(JSON.parse(JSON.stringify(this.dataMap[keyStr].info[sourceIndex])));
    }
  }

  //設定長さ取得
  getStorageInfoLength(charIndex: string | number){
    let keyStr = charIndex.toString();
    this.initDefaultData(keyStr);
    return this.dataMap[keyStr].info.length;
  }

  //全設定情報取得
  getStorageInfos(charIndex: string | number, index?: number){
    let keyStr = charIndex.toString();
    if(index == undefined){
      index = this.dataMap[charIndex].selectedIndex;
    }
    this.initDefaultData(keyStr);
    return this.dataMap[keyStr].info;
  }

  //設定情報取得
  getStorageInfo(charIndex: string | number, index?: number){
    let keyStr = charIndex.toString();
    if(index == undefined){
      index = this.dataMap[charIndex].selectedIndex;
    }
    this.initDefaultData(keyStr);
    if(!(index in this.dataMap[keyStr].info)){
      this.dataMap[keyStr].info[index] = {
        value: 0,
      };
    }
    return this.dataMap[keyStr].info[index];
  }
  
  private initDefaultData(keyStr: string){
    if(this.dataMap[keyStr] == undefined){
      this.dataMap[keyStr] = {
        selectedIndex: 0,
        info: [
          {
            value: 0,
          }
        ],
      };
    }
  }

}
