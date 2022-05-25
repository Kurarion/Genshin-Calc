import { Injectable } from '@angular/core';
import { weapon, WeaponCreateOption, WeaponListOption, Const, genshindb, TYPE_SYS_LANG } from 'src/app/shared/shared.module';

@Injectable({
  providedIn: 'root'
})
export class WeaponService {

  //武器マップ
  weaponMap = new Map<TYPE_SYS_LANG, Map<string, weapon>>();
  //現在の言語
  private currentWeaponLang!: TYPE_SYS_LANG;
  //検索言語(検索キー)
  private readonly queryLanguage = Const.QUERY_LANG as TYPE_SYS_LANG;
  //検索キャラリスト（検索きー）
  private weaponNames!: string[];

  constructor() {
    this.weaponNames = WeaponService.dbGetAllNames({ resultLanguage: this.queryLanguage });
    //初期化
    this.init(this.queryLanguage);
  }

  getMap(lang: TYPE_SYS_LANG = this.currentWeaponLang): Map<string, weapon>{
    return this.weaponMap.get(lang) as Map<string, weapon>;
  }

  get(name: string, lang: TYPE_SYS_LANG = this.currentWeaponLang): weapon {
    return this.getMap(lang).get(name) as weapon;
  }

  init(langCode: TYPE_SYS_LANG) {
    if(!this.weaponMap.has(langCode)){
      let temp = new Map<string, weapon>();
      this.weaponNames.forEach((name: string) => {
        temp.set(name, this.create(name, {
          resultLanguage: langCode,
        }));
      });
      this.weaponMap.set(langCode, temp);
    }
    this.setCurrentWeaponLang(langCode);
  }

  private static changeLang(option: any) {
    option.queryLanguages ? (option.queryLanguages = Const.MAP_GENSHINDB_LANG[option.queryLanguages as TYPE_SYS_LANG]) : '';
    option.resultLanguage ? (option.resultLanguage = Const.MAP_GENSHINDB_LANG[option.resultLanguage as TYPE_SYS_LANG]) : '';
    return option;
  }

  private static dbGetAllNames(option?: WeaponListOption){
    return WeaponService.dbListNames('names', option);
  }

  private static dbListNames(keyword: string, option?: WeaponListOption): string[] {
    let result = genshindb.weapons(keyword, this.changeLang({ ...option, matchCategories: true }))
    return result;
  }
  
  private create(keyword: string, option?: WeaponCreateOption): weapon {
    let result = new weapon(genshindb.weapons(keyword, WeaponService.changeLang({ ...option, queryLanguages: this.queryLanguage})));
    return result;
  }

  private setCurrentWeaponLang(lang: TYPE_SYS_LANG){
    this.currentWeaponLang = lang;
  }

}
