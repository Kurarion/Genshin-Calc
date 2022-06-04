import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ExtraDataService {

  static data: any;

  constructor() { }
  
  static initData(data: any){
    this.data = data;
  }

  getCharacter(name: string){
    return ExtraDataService.data.characters[name];
  }

  getWeapon(name: string){
    return ExtraDataService.data.weapons[name];
  }
}
