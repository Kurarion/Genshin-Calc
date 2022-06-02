import { Injectable } from '@angular/core';
import { character, GenshinDataService } from 'src/app/shared/shared.module';

@Injectable({
  providedIn: 'root'
})
export class CharacterService {

  constructor(private genshinDataService: GenshinDataService) { }

  getMap(): Record<string, character> {
    return GenshinDataService.dataCharacter;
  }

  get(index: string | number): character {
    return this.genshinDataService.getCharacter(index.toString())!;
  }

}
