import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Const, DamageResult, ExtraDataService, GenshinDataService, StorageService } from 'src/app/shared/shared.module';

export interface DPSStorageInfo {
  dmgs: DmgInfo[];
  duration: number;
}

export interface DmgInfo {
  skill: string;
  valueIndexs: number[];
  resultIndex: number;
  skillIndex?: number;
  damageProp: keyof DamageResult;
  times?: number;
}

export interface DPSStorageData {
  selectedIndex: number;
  info: DPSStorageInfo[];
}

@Injectable({
  providedIn: 'root'
})
export class DPSService {

  //データマップ
  dataMap!: Record<string, DPSStorageData>;
  private changedSubject: Subject<void> = new Subject<void>();
  private changedSubject$: Observable<void> = this.changedSubject.asObservable();

  constructor(private storageService: StorageService) {
    let temp = this.storageService.getJSONItem(Const.SAVE_DPS)
    if(temp){
      this.dataMap = temp;
    }else{
      this.dataMap = {};
    }
  }

  changed() {
    return this.changedSubject$;
  }

  next() {
    this.changedSubject.next();
  }

  //クリア
  clearStorageInfo(index: string | number){
    let indexStr = index.toString();
    delete this.dataMap[indexStr];
  }

  //ストレージに保存
  saveData(){
    this.storageService.setJSONItem(Const.SAVE_DPS, this.dataMap);
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

  //DPS組合せ削除
  deleteStorageInfo(charIndex: string | number, index: number){
    let keyStr = charIndex.toString();
    this.dataMap[keyStr].info.splice(index, 1);
  }

  //DPS組合せ追加
  addStorageInfo(charIndex: string | number){
    let keyStr = charIndex.toString();
    this.dataMap[keyStr].info.push({
      dmgs: [],
      duration: 1,
    });
  }

  //DPSリストに追加
  appendDmg(charIndex: string | number, info: DmgInfo){
    const keyStr = charIndex.toString();
    const currentIndex = this.dataMap[charIndex].selectedIndex;
    if(this.dataMap[keyStr].info.length > currentIndex) {
      const list = this.dataMap[keyStr].info[currentIndex].dmgs;
      list.push(info);
      this.next()
    }
  }

  //DPS組合せコピー
  copyAndCreateStorageInfo(charIndex: string | number, sourceIndex: number){
    let keyStr = charIndex.toString();
    if(Object.keys(this.dataMap[keyStr].info[sourceIndex]).length === 0){
      this.addStorageInfo(keyStr);
    }else{
      this.dataMap[keyStr].info.push(JSON.parse(JSON.stringify(this.dataMap[keyStr].info[sourceIndex])));
    }
  }

  //DPS組合せ数取得
  getStorageInfoLength(charIndex: string | number){
    let keyStr = charIndex.toString();
    this.initDefaultData(keyStr);
    return this.dataMap[keyStr].info.length;
  }

  //全組合せ情報取得
  getStorageInfos(charIndex: string | number, index?: number){
    //初期化無しの場合対応（チームメンバー）
    if(this.dataMap[charIndex] === undefined){
      return [];
    }
    let keyStr = charIndex.toString();
    if(index == undefined){
      index = this.dataMap[charIndex].selectedIndex;
    }
    this.initDefaultData(keyStr);
    return this.dataMap[keyStr].info;
  }

  //DPS組合せ取得
  getStorageInfo(charIndex: string | number, index?: number){
    let keyStr = charIndex.toString();
    if(index == undefined){
      index = this.dataMap[charIndex].selectedIndex;
    }
    this.initDefaultData(keyStr);
    if(!(index in this.dataMap[keyStr].info)){
      this.dataMap[keyStr].info[index] = {
        dmgs: [],
        duration: 1,
      }
    }
    return this.dataMap[keyStr].info[index];
  }
  
  private initDefaultData(keyStr: string){
    if(this.dataMap[keyStr] == undefined){
      this.dataMap[keyStr] = {
        selectedIndex: 0,
        info: [
          {
            dmgs: [],
            duration: 1,
          }
        ],
      };
    }
  }

}
