import { Injectable } from '@angular/core';
import { character, enemy, weapon } from 'src/app/shared/shared.module';

@Injectable({
  providedIn: 'root'
})
export class GenshinDataService {

  static dataCharacter: Record<string, character>;
  static dataWeapon: Record<string, weapon>;
  static dataMonster: Record<string, enemy>;
  static dataReliquarySet: any;
  static dataReliquaryMain: any;
  static dataReliquaryAffix: any;

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
    this.dataReliquaryMain = data;
  }
  static initReliquaryAffixData(data: any){
    this.dataReliquaryAffix = data;
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

}
