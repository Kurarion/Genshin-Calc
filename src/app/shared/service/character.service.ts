import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { character, CharCreateOption, CharListOption, Const, genshindb, LanguageService, StorageService, TYPE_SYS_LANG } from 'src/app/shared/shared.module';

@Injectable({
  providedIn: 'root'
})
export class CharacterService {

  //キャラデータマップ
  characterMap = new Map<TYPE_SYS_LANG, Map<string, character>>();
  //現在の言語
  private currentCharaLang!: TYPE_SYS_LANG;
  //検索言語(検索キー)
  private readonly queryLanguage = 'cn_sim' as TYPE_SYS_LANG;
  //検索キャラリスト（検索きー）
  private characterNames!: string[];

  constructor(private storageService: StorageService, private translateService: TranslateService) {
    this.characterNames = CharacterService.dbGetAllNames({ resultLanguage: this.queryLanguage });
    //初期化
    this.init(this.queryLanguage);
    // //ストレージから復元
    // const lang =
    // this.storageService.getLang() ??
    // this.translateService.getDefaultLang();
    // //初期化
    // this.init(lang as TYPE_SYS_LANG);
  }

  getMap(lang: TYPE_SYS_LANG = this.currentCharaLang): Map<string, character>{
    return this.characterMap.get(lang) as Map<string, character>;
  }

  get(name: string, lang: TYPE_SYS_LANG = this.currentCharaLang) {
    return this.getMap(lang).get(name);
  }

  init(langCode: TYPE_SYS_LANG) {
    if(!this.characterMap.has(langCode)){
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

  private static dbGetAllNames(option?: CharListOption){
    return CharacterService.dbListNames('names', option);
  }

  private static changeLang(option: any) {
    option.queryLanguages ? (option.queryLanguages = Const.MAP_GENSHINDB_LANG[option.queryLanguages as TYPE_SYS_LANG]) : '';
    option.resultLanguage ? (option.resultLanguage = Const.MAP_GENSHINDB_LANG[option.resultLanguage as TYPE_SYS_LANG]) : '';
    return option;
  }

  private static dbListNames(keyword: string, option?: CharListOption): string[] {
    let result = genshindb.characters(keyword, this.changeLang({ ...option, matchCategories: true }))
    return result;
  }
  
  private create(keyword: string, option?: CharCreateOption): character {
    let result = new character(genshindb.characters(keyword, CharacterService.changeLang({ ...option, queryLanguages: this.queryLanguage})));
    return result;
  }

  private setCurrentCharaLang(lang: TYPE_SYS_LANG){
    this.currentCharaLang = lang;
  }

}
