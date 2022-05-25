import { Injectable } from '@angular/core';
import { enemy, EnemyCreateOption, EnemyListOption, Const, genshindb, TYPE_SYS_LANG } from 'src/app/shared/shared.module';

@Injectable({
  providedIn: 'root'
})
export class EnemyService {

  //武器マップ
  enemyMap = new Map<TYPE_SYS_LANG, Map<string, enemy>>();
  //現在の言語
  private currentEnemyLang!: TYPE_SYS_LANG;
  //検索言語(検索キー)
  private readonly queryLanguage = Const.QUERY_LANG as TYPE_SYS_LANG;
  //検索キャラリスト（検索きー）
  private enemyNames!: string[];

  constructor() {
    this.enemyNames = EnemyService.dbGetAllNames({ resultLanguage: this.queryLanguage });
    //初期化
    this.init(this.queryLanguage);
  }

  getMap(lang: TYPE_SYS_LANG = this.currentEnemyLang): Map<string, enemy>{
    return this.enemyMap.get(lang) as Map<string, enemy>;
  }

  get(name: string, lang: TYPE_SYS_LANG = this.currentEnemyLang): enemy {
    return this.getMap(lang).get(name) as enemy;
  }

  init(langCode: TYPE_SYS_LANG) {
    if(!this.enemyMap.has(langCode)){
      let temp = new Map<string, enemy>();
      this.enemyNames.forEach((name: string) => {
        temp.set(name, this.create(name, {
          resultLanguage: langCode,
        }));
      });
      this.enemyMap.set(langCode, temp);
    }
    this.setCurrentEnemyLang(langCode);
  }

  private static changeLang(option: any) {
    option.queryLanguages ? (option.queryLanguages = Const.MAP_GENSHINDB_LANG[option.queryLanguages as TYPE_SYS_LANG]) : '';
    option.resultLanguage ? (option.resultLanguage = Const.MAP_GENSHINDB_LANG[option.resultLanguage as TYPE_SYS_LANG]) : '';
    return option;
  }

  private static dbGetAllNames(option?: EnemyListOption){
    return EnemyService.dbListNames('names', option);
  }

  private static dbListNames(keyword: string, option?: EnemyListOption): string[] {
    let result = genshindb.enemies(keyword, this.changeLang({ ...option, matchCategories: true }))
    return result;
  }
  
  private create(keyword: string, option?: EnemyCreateOption): enemy {
    let result = new enemy(genshindb.enemies(keyword, EnemyService.changeLang({ ...option, queryLanguages: this.queryLanguage})));
    return result;
  }

  private setCurrentEnemyLang(lang: TYPE_SYS_LANG){
    this.currentEnemyLang = lang;
  }
}
