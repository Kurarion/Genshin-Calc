import { Injectable } from '@angular/core';
import { GenshinDataService, weapon } from 'src/app/shared/shared.module';

@Injectable({
  providedIn: 'root'
})
export class WeaponService {

  constructor(private genshinDataService: GenshinDataService) { }

  getMap(): Record<string, weapon> {
    return GenshinDataService.dataWeapon;
  }

  get(index: string | number): weapon {
    return this.genshinDataService.getWeapon(index.toString())!;
  }

}
