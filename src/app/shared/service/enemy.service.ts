import { Injectable } from '@angular/core';
import { GenshinDataService, enemy } from 'src/app/shared/shared.module';

@Injectable({
  providedIn: 'root'
})
export class EnemyService {

  constructor(private genshinDataService: GenshinDataService) { }

  getMap(): Record<string, enemy> {
    return GenshinDataService.dataMonster;
  }

  get(index: string | number): enemy {
    return this.genshinDataService.getMonster(index.toString())!;
  }

}
