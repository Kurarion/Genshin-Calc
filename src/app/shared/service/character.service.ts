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
  //検索言語(検索キー)
  private readonly queryLanguage = Const.QUERY_LANG;
  //検索キャラリスト（検索きー）
  private characterNames!: string[];

  constructor() {
    this.characterNames = CharacterService.dbGetAllNames({ resultLanguage: this.queryLanguage });
    //初期化
    this.init(this.queryLanguage);
  }

  getMap(lang: TYPE_SYS_LANG = this.currentCharaLang): Map<string, character> {
    return this.characterMap.get(lang) as Map<string, character>;
  }

  get(name: string, lang: TYPE_SYS_LANG = this.currentCharaLang): character {
    return this.getMap(lang).get(name) as character;
  }

  init(langCode: TYPE_SYS_LANG) {
    if (!this.characterMap.has(langCode)) {
      let temp = new Map<string, character>();
      this.characterNames.forEach((name: string) => {
        temp.set(name, this.create(name, {
          resultLanguage: langCode,
        }));
      });
      this.characterMap.set(langCode, temp);
    }
    this.setCurrentCharaLang(langCode);
  }

  private static changeLang(option: any) {
    option.queryLanguages ? (option.queryLanguages = Const.MAP_GENSHINDB_LANG[option.queryLanguages as TYPE_SYS_LANG]) : '';
    option.resultLanguage ? (option.resultLanguage = Const.MAP_GENSHINDB_LANG[option.resultLanguage as TYPE_SYS_LANG]) : '';
    return option;
  }

  private static dbGetAllNames(option?: CharListOption) {
    return CharacterService.dbListNames('names', option);
  }

  private static dbListNames(keyword: string, option?: CharListOption): string[] {
    let result = genshindb.characters(keyword, this.changeLang({ ...option, matchCategories: true }))
    return result;
  }

  private create(keyword: string, option?: CharCreateOption): character {
    let result = new character(
      genshindb.characters(keyword, CharacterService.changeLang({ ...option, queryLanguages: this.queryLanguage })),
      genshindb.talents(keyword, CharacterService.changeLang({ ...option, queryLanguages: this.queryLanguage })),
      genshindb.constellations(keyword, CharacterService.changeLang({ ...option, queryLanguages: this.queryLanguage })),
    );
    return result;
  }

  private setCurrentCharaLang(lang: TYPE_SYS_LANG) {
    this.currentCharaLang = lang;
  }

}
