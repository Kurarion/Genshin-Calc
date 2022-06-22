import { Injectable } from '@angular/core';
import { character, Const, enemy, ExtraData, weapon } from 'src/app/shared/shared.module';

@Injectable({
  providedIn: 'root'
})
export class GenshinDataService {

  static dataCharacter: Record<string, character>;
  static dataWeapon: Record<string, weapon>;
  static dataMonster: Record<string, enemy>;
  static dataReliquarySet: any;
  static dataReliquaryMain: Record<string, number>;
  static dataReliquaryAffix: Record<string, number[]>;
  static dataExtra: ExtraData;

  constructor() { }
  
  static initCharacterData(data: any){
    this.dataCharacter = data;
  }
  static initWeaponData(data: any){
    this.dataWeapon = data;
  }
  static initMonsterData(data: any){
    this.dataMonster = data;
  }
  static initReliquarySetData(data: any){
    this.dataReliquarySet = data;
  }
  static initReliquaryMainData(data: any){
    let result: Record<string, number> = {};
    for(let key in data){
      result[Const.MAP_ARTIFACE_PROP[key]] = data[key];
    }
    this.dataReliquaryMain = result;
  }
  static initReliquaryAffixData(data: any){
    let result: Record<string, number[]> = {};
    for(let key in data){
      result[Const.MAP_ARTIFACE_PROP[key]] = data[key];
    }
    this.dataReliquaryAffix = result;
  }
  static initExtraData(data: any){
    this.dataExtra = data;
  }

  getCharacter(index: string){
    return GenshinDataService.dataCharacter[index];
  }
  getWeapon(index: string){
    return GenshinDataService.dataWeapon[index];
  }
  getMonster(index: string){
    return GenshinDataService.dataMonster[index];
  }
  getReliquarySet(index: string){
    return GenshinDataService.dataReliquarySet[index];
  }
  getReliquaryMain(index: string){
    return GenshinDataService.dataReliquaryMain[index];
  }
  getReliquaryAffix(index: string){
    return GenshinDataService.dataReliquaryAffix[index];
  }
  getExtraCharacterData(index: string){
    return GenshinDataService.dataExtra.characters[index];
  }
  getExtraWeaponData(index: string){
    return GenshinDataService.dataExtra.weapons[index];
  }

}
