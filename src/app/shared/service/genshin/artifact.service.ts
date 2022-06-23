import { Injectable } from '@angular/core';
import { retry } from 'rxjs';
import { Const, StorageService } from 'src/app/shared/shared.module';

export interface ArtifactStorageItemData {
  name?: string;
  value?: number;
}

export interface ArtifactStoragePartData {
  // main?: ArtifactStorageItemData;
  // sub1?: ArtifactStorageItemData;
  // sub2?: ArtifactStorageItemData;
  // sub3?: ArtifactStorageItemData;
  // sub4?: ArtifactStorageItemData;
  [key: string]: ArtifactStorageItemData;
}

export interface ArtifactStorageInfo {
  setIndexs?: number[];
  flower?: ArtifactStoragePartData;
  plume?: ArtifactStoragePartData;
  sands?: ArtifactStoragePartData;
  goblet?: ArtifactStoragePartData;
  circlet?: ArtifactStoragePartData;
}

export interface ArtifactStorageData {
  activeIndex: number;
  info: ArtifactStorageInfo[];
}

@Injectable({
  providedIn: 'root'
})
export class ArtifactService {

  //データマップ
  dataMap!: Record<string, ArtifactStorageData>;

  constructor(private storageService: StorageService) {
    let temp = this.storageService.getJSONItem(Const.SAVE_ARTIFACT)
    if(temp){
      this.dataMap = temp;
    }else{
      this.dataMap = {};
    }
  }

  //適用中インデックス設定
  getStorageActiveIndex(charIndex: string | number){
    let keyStr = charIndex.toString();
    this.initDefaultData(keyStr);
    return this.dataMap[keyStr].activeIndex;
  }

  //適用中インデックス設定
  setStorageActiveIndex(charIndex: string | number, index: number){
    let keyStr = charIndex.toString();
    this.initDefaultData(keyStr);
    this.dataMap[keyStr].activeIndex = index;
  }

  //設定長さ取得
  getStorageInfoLength(charIndex: string | number){
    let keyStr = charIndex.toString();
    this.initDefaultData(keyStr);
    return this.dataMap[keyStr].info.length;
  }

  //聖遺物セット削除
  deleteStorageInfo(charIndex: string | number, index: number){
    let keyStr = charIndex.toString();
    this.dataMap[keyStr].info.splice(index, 1);
  }

  //聖遺物情報コピー
  copyAndCreateStorageInfo(charIndex: string | number, sourceIndex: number){
    let keyStr = charIndex.toString();
    this.dataMap[keyStr].info.push(JSON.parse(JSON.stringify(this.dataMap[keyStr].info[sourceIndex])));
  }

  //設定取得
  getStorageInfo(charIndex: string | number, index: number, part: string){
    let keyStr = charIndex.toString();
    this.initDefaultData(keyStr);
    if(!(index in this.dataMap[keyStr].info)){
      this.dataMap[keyStr].info[index] = {};
    }
    if(this.dataMap[keyStr].info[index][part as keyof ArtifactStorageInfo] == undefined){
      this.dataMap[keyStr].info[index].setIndexs = [];
      this.dataMap[keyStr].info[index].flower = {
        "main":{},
        "sub1":{},
        "sub2":{},
        "sub3":{},
        "sub4":{},
      };
      this.dataMap[keyStr].info[index].plume = {
        "main":{},
        "sub1":{},
        "sub2":{},
        "sub3":{},
        "sub4":{},
      };
      this.dataMap[keyStr].info[index].sands = {
        "main":{},
        "sub1":{},
        "sub2":{},
        "sub3":{},
        "sub4":{},
      };
      this.dataMap[keyStr].info[index].goblet = {
        "main":{},
        "sub1":{},
        "sub2":{},
        "sub3":{},
        "sub4":{},
      };
      this.dataMap[keyStr].info[index].circlet = {
        "main":{},
        "sub1":{},
        "sub2":{},
        "sub3":{},
        "sub4":{},
      };
    }
    return this.dataMap[keyStr].info[index][part as keyof ArtifactStorageInfo] as ArtifactStoragePartData;
  }

  //ストレージに保存
  saveData(){
    this.storageService.setJSONItem(Const.SAVE_ARTIFACT, this.dataMap);
  }

  private initDefaultData(keyStr: string){
    if(this.dataMap[keyStr] == undefined){
      this.dataMap[keyStr] = {
        activeIndex: 0,
        info: [],
      };
    }
  }
}
