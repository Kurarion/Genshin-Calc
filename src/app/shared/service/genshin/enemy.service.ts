import { Injectable } from '@angular/core';
import { GenshinDataService, enemy, StorageService, Const } from 'src/app/shared/shared.module';

export interface EnemyStorageInfo {
  enemy?: string;
  level?: string;
  playerNum?: number;
}

@Injectable({
  providedIn: 'root'
})
export class EnemyService {

  //データマップ
  dataMap!: Record<string, EnemyStorageInfo>;

  constructor(private genshinDataService: GenshinDataService, private storageService: StorageService) { 
    let temp = this.storageService.getJSONItem(Const.SAVE_MONSTER)
    if(temp){
      this.dataMap = temp;
    }else{
      this.dataMap = {};;
    }
  }

  getMap(): Record<string, enemy> {
    return GenshinDataService.dataMonster;
  }

  get(index: string | number): enemy {
    return this.genshinDataService.getMonster(index.toString())!;
  }

  //デフォルト敵取得
  getIndex(charIndex: string | number): string|undefined {
    let keyStr = charIndex.toString();
    if(keyStr in this.dataMap && this.dataMap[keyStr]){
      return this.dataMap[keyStr].enemy;
    }
    return undefined;
  }

  //敵設定
  setIndex(charIndex: string | number, index: string | number) {
    let charKeyStr = charIndex.toString();
    let enemyKeyStr = index.toString();
    if(!this.dataMap[charKeyStr]){
      this.dataMap[charKeyStr] = {};
    }
    this.dataMap[charKeyStr].enemy = enemyKeyStr;
  }

  //デフォルトレベル取得
  getLevel(charIndex: string | number): string|undefined {
    let keyStr = charIndex.toString();
    if(keyStr in this.dataMap && this.dataMap[keyStr]){
      return this.dataMap[keyStr].level;
    }
    return undefined;
  }

  //レベル設定
  setLevel(charIndex: string | number, level: string) {
    let charKeyStr = charIndex.toString();
    if(!this.dataMap[charKeyStr]){
      this.dataMap[charKeyStr] = {};
    }
    this.dataMap[charKeyStr].level = level;
  }

  //プレイヤー数取得
  getPlayerNum(charIndex: string | number): number|undefined {
    let keyStr = charIndex.toString();
    if(keyStr in this.dataMap && this.dataMap[keyStr]){
      return this.dataMap[keyStr].playerNum;
    }
    return undefined;
  }

  //プレイヤー数設定
  setPlayerNum(charIndex: string | number, playerNum: number) {
    let charKeyStr = charIndex.toString();
    if(!this.dataMap[charKeyStr]){
      this.dataMap[charKeyStr] = {};
    }
    this.dataMap[charKeyStr].playerNum = playerNum;
  }

  //ストレージに保存
  saveData(){
    this.storageService.setJSONItem(Const.SAVE_MONSTER, this.dataMap)
  }
}
