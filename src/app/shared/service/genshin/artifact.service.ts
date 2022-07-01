import { Injectable } from '@angular/core';
import { artifactSet, Const, ExtraArtifactSetData, ExtraDataService, ExtraStatus, GenshinDataService, StorageService } from 'src/app/shared/shared.module';

export interface ArtifactStorageItemData {
  name?: string;
  value?: number;
}

export interface ArtifactStoragePartData {
  [key: string]: ArtifactStorageItemData;
}

export interface ArtifactStorageInfo {
  setIndexs?: string[];
  setFullIndex?: string;
  extra?: ExtraArtifactSetData;
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

const MAX_ARTIFACE_PUSH_LENGTH = 10;

@Injectable({
  providedIn: 'root'
})
export class ArtifactService {

  //データマップ
  dataMap!: Record<string, ArtifactStorageData>;

  constructor(private genshinDataService: GenshinDataService, private storageService: StorageService, private extraDataService: ExtraDataService) {
    let temp = this.storageService.getJSONItem(Const.SAVE_ARTIFACT)
    if(temp){
      this.dataMap = temp;
    }else{
      this.dataMap = {};
    }
  }

  getSetMap(): Record<string, artifactSet> {
    return GenshinDataService.dataReliquarySet;
  }

  getSetData(index: string | number){
    let indexStr = index.toString();
    return GenshinDataService.dataReliquarySet[indexStr];
  }

  getSet(index: string | number): artifactSet {
    return this.genshinDataService.getReliquarySet(index.toString());
  }

  //適用中インデックス取得
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
    this.initDefaultData(keyStr);
    this.dataMap[keyStr].info.splice(index, 1);
  }

  //聖遺物プッシュ
  pushStorageInfo(charIndex: string | number, info: ArtifactStorageInfo){
    let keyStr = charIndex.toString();
    this.initDefaultData(keyStr);
    if(this.dataMap[keyStr].info.length >= MAX_ARTIFACE_PUSH_LENGTH){
      this.dataMap[keyStr].info.pop();
    }
    this.dataMap[keyStr].info.push(info);
    this.setStorageActiveIndex(keyStr, this.dataMap[keyStr].info.length - 1);
  }

  //聖遺物セット設定
  setStorageSetIndexsAll(charIndex: string | number, setIndexs: string[], index?: number){
    let keyStr = charIndex.toString();
    let infoIndex = this.dataMap[keyStr].activeIndex;
    if(index != undefined){
      infoIndex = index;
    }
    this.initDefaultData(keyStr);
    let info = this.dataMap[keyStr].info[infoIndex];
    info.setIndexs = setIndexs;
    if(setIndexs[0] == setIndexs[1] && setIndexs[0] != "" && setIndexs[0]){
      info.setFullIndex = setIndexs[0];
    }else{
      info.setFullIndex = '';
    }
    this.setDefaultExtraData(keyStr, info.setIndexs, info.setFullIndex);
  }

  //聖遺物情報コピー
  copyAndCreateStorageInfo(charIndex: string | number, sourceIndex: number){
    let keyStr = charIndex.toString();
    this.initDefaultData(keyStr);
    this.dataMap[keyStr].info.push(JSON.parse(JSON.stringify(this.dataMap[keyStr].info[sourceIndex])));
  }

  //ストレージ適用中聖遺物データ取得
  getStorageActiveArtifactInfo(charIndex: string){
    let keyStr = charIndex.toString();
    this.initDefaultData(keyStr);
    return this.dataMap[keyStr].info[this.dataMap[keyStr].activeIndex];
  }

  //聖遺物セット情報取得
  getStorageSetIndexs(charIndex: string | number, index?: number){
    let keyStr = charIndex.toString();
    if(index == undefined){
      index = this.dataMap[charIndex].activeIndex;
    }
    this.initDefaultData(keyStr);
    if(!(index in this.dataMap[keyStr].info)){
      this.dataMap[keyStr].info[index] = {};
    }
    if(this.dataMap[keyStr].info[index].setIndexs == undefined){
      this.dataMap[keyStr].info[index].setIndexs = ['', ''];
    }
    return this.dataMap[keyStr].info[index].setIndexs!;
  }

  setStorageFullSetIndex(charIndex: string | number, index?: number, value?: string, isInit?: boolean){
    let keyStr = charIndex.toString();
    if(index == undefined){
      index = this.dataMap[charIndex].activeIndex;
    }
    this.initDefaultData(keyStr);
    if(!(index in this.dataMap[keyStr].info)){
      this.dataMap[keyStr].info[index] = {};
    }
    this.dataMap[keyStr].info[index].setFullIndex = value;
    if(value == '' && !isInit){
      this.clearExtraData(keyStr);
    }
  }

  //聖遺物セットフル情報取得
  getStorageFullSetIndex(charIndex: string | number, index?: number){
    let keyStr = charIndex.toString();
    if(index == undefined){
      index = this.dataMap[charIndex].activeIndex;
    }
    this.initDefaultData(keyStr);
    if(!(index in this.dataMap[keyStr].info)){
      this.dataMap[keyStr].info[index] = {};
    }
    if(this.dataMap[keyStr].info[index].setFullIndex == undefined){
      this.dataMap[keyStr].info[index].setFullIndex = '';
    }
    return this.dataMap[keyStr].info[index].setFullIndex!;
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
      this.dataMap[keyStr].info[index].setFullIndex = '';
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

  //デフォールト追加データ設定
  setDefaultExtraData(charIndex: string | number, index: string[], fullIndex: string){
    let charKeyStr = charIndex.toString();
    this.initDefaultData(charKeyStr);
    this.dataMap[charKeyStr].info[this.dataMap[charKeyStr].activeIndex].extra = 
    {...this.dataMap[charKeyStr].info[this.dataMap[charKeyStr].activeIndex].extra, ...this.extraDataService.getArtifactSetDefaultSetting(index, fullIndex)};
  }
  
  //追加データクリア
  clearExtraData(index: string | number){
    let temp = this.getExtraData(index);
    delete temp?.set1;
    delete temp?.set2;
  }

  //追加データ取得
  getExtraData(index: string | number){
    let charKeyStr = index.toString();
    if(charKeyStr in this.dataMap && this.dataMap[charKeyStr]){
      return this.dataMap[charKeyStr].info[this.dataMap[charKeyStr].activeIndex].extra;
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

  private getExtraSkillData(index: string | number, skill: string, skillIndex?: number | string){
    let keyStr = index.toString();
    let skillStatus!: ExtraStatus;
    let extraData = this.dataMap[keyStr].info[this.dataMap[keyStr].activeIndex].extra;
    switch(skill){
      case Const.NAME_SET:
        skillStatus = extraData![Const.NAME_SET + skillIndex!.toString() as keyof ExtraArtifactSetData]!;
        break;
    }
    return skillStatus!;
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
