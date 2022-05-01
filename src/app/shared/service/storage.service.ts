import { Injectable } from '@angular/core';
import { Const, TYPE_SYS_LANG } from 'src/app/shared/shared.module';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  setLang(lang: TYPE_SYS_LANG){
    this.setItem(Const.STORAGE_LANG, lang);
  }

  getLang(){
    return this.getItem(Const.STORAGE_LANG);
  }

  private setItem(key: string, data: any) {
    //ローカルストレージに保存
    localStorage.setItem(key, data);
  }

  private getItem(key: string) {
    //ローカルストレージから取得
    return localStorage.getItem(key);
  }
}
