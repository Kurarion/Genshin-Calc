import { Injectable } from '@angular/core';
import { character, CharCreateOption, CharListOption, Const, genshindb, TYPE_SYS_LANG } from 'src/app/shared/shared.module';

@Injectable({
  providedIn: 'root'
})
export class CharacterService {

  //キャラデータマップ
  characterMap = new Map<TYPE_SYS_LANG, Map<string, character>>();
  //現在の言語
  private currentCharaLang!: TYPE_SYS_LANG;

  constructor() { }

  static listNames(keyword: string, option?: CharListOption): string[] {
    let result = genshindb.characters(keyword, { ...this.changeLang(option), matchCategories: true })
    return result;
  }

  static getAllNames(option?: CharListOption){
    return CharacterService.listNames('names', option);
  }

  create(keyword: string, option?: CharCreateOption): character {
    let result = new character(genshindb.characters(keyword, CharacterService.changeLang(option)));
    return result;
  }


  get(name: string) {
    return this.characterMap.get(this.currentCharaLang)?.get(name);
  }

  initCharacters(lang: TYPE_SYS_LANG) {
    this.currentCharaLang = lang;
    if (!this.characterMap.has(lang)) {
      let temp = new Map<string, character>();
      CharacterService.getAllNames({ resultLanguage: lang }).forEach((name: string) => {
        temp.set(name, this.create(name, {
          queryLanguages: lang,
          resultLanguage: lang,
        }))
      });
      this.characterMap.set(lang, temp);
    }
  }

  private static changeLang(option: any) {
    option.queryLanguages ? (option.queryLanguages = Const.MAP_GENSHINDB_LANG[option.queryLanguages as TYPE_SYS_LANG]) : '';
    option.resultLanguage ? (option.resultLanguage = Const.MAP_GENSHINDB_LANG[option.resultLanguage as TYPE_SYS_LANG]) : '';
    return option;
  }
}
