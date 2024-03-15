import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { artifactSet, character, ChipData, Const, enemy, ExtraData, weapon } from 'src/app/shared/shared.module';

@Injectable({
  providedIn: 'root'
})
export class GenshinDataService {

  static dataCharacter: Record<string, character>;
  static dataWeapon: Record<string, weapon>;
  static dataMonster: Record<string, enemy>;
  static dataReliquarySet: Record<string, artifactSet>;
  static dataReliquaryMain: Record<string, number>;
  static dataReliquaryAffix: Record<string, number[]>;
  static dataOptimalReliquaryAffixStep: Record<string, number>;
  static dataChip: Record<string, ChipData[]>;
  static dataExtra: ExtraData;

  private updateSubject: Subject<void> = new Subject<void>();
  private updateSubject$: Observable<void> = this.updateSubject.asObservable();
  private jsonDownloadStatus: Map<string, number> = new Map();

  constructor() { }

  status() {
    return this.updateSubject$;
  }

  update() {
    this.updateSubject.next();
  }

  getJsonDownloadStatus(fileName: string){
    if(!this.jsonDownloadStatus.has(fileName)){
      this.jsonDownloadStatus.set(fileName, 0);
    }
    return this.jsonDownloadStatus.get(fileName);
  }

  getAllJsonDownloadStatus() {
    return this.jsonDownloadStatus;
  }
  
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
    const originLength = 4;
    const maxUpTimes = 6;
    for(let key in data){
      let originList = data[key];
      let resultList: number[] = [0];
      for(let t = 1; t <= maxUpTimes; ++t){
        let max = originLength * 1 + (t - 1) * (originLength - 1);
        for(let x = 0; x < max; ++x){
          let result = 0;
          for(let i = 0; i < t; ++i){
            let index = x - 3*i < 0 ?0:(x - 3*i);
            result += originList[index>(originLength-1)?(originLength-1):index];
          }
          resultList.push(result);
        }
      }
      result[Const.MAP_ARTIFACE_PROP[key]] = resultList.sort(function(a,b){
        return a - b
      });
    }
    this.dataReliquaryAffix = result;
  }
  static initOptimalReliquaryAffixStep(data: any){
    let result: Record<string, number> = {};
    const stepDivider = 10;
    for(let key in data){
      let originValues = data[key];
      let targetValue = originValues[originValues.length - 1];
      result[Const.MAP_ARTIFACE_PROP[key]] = targetValue / stepDivider;
    }
    //補足
    result[Const.PROP_HEALING_BONUS] = result[Const.PROP_ATTACK_UP] * this.dataReliquaryMain[Const.PROP_HEALING_BONUS] / this.dataReliquaryMain[Const.PROP_ATTACK_UP];
    result[Const.PROP_DMG_BONUS_ALL] = result[Const.PROP_ATTACK_UP];
    result[Const.PROP_DMG_ENEMY_DEFENSE_DOWN] = result[Const.PROP_ATTACK_UP];
    result[Const.PROP_DMG_ANTI_ALL_MINUS] = result[Const.PROP_ATTACK_UP];
    this.dataOptimalReliquaryAffixStep = result;
  }
  static initChipData(data: any){
    this.dataChip = data;
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
  getOptimalReliquaryAffixStep(index: string){
    return GenshinDataService.dataOptimalReliquaryAffixStep[index];
  }
  getChip(index: string){
    return GenshinDataService.dataChip[index];
  }
  getExtraCharacterData(index: string){
    return GenshinDataService.dataExtra.characters[index];
  }
  getExtraWeaponData(index: string){
    return GenshinDataService.dataExtra.weapons[index];
  }
  getExtraArtifactData(index: string){
    return GenshinDataService.dataExtra.artifact[index];
  }

}
