import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  setItem(key: string, data: any) {
    //ローカルストレージに保存
    localStorage.setItem(key, data);
  }

  getItem(key: string) {
    //ローカルストレージから取得
    return localStorage.getItem(key);
  }

  setJSONItem(key: string, data: any) {
    //ローカルストレージに保存
    localStorage.setItem(key, JSON.stringify(data));
  }

  getJSONItem(key: string) {
    //ローカルストレージから取得
    let temp = localStorage.getItem(key);
    if(temp){
      return JSON.parse(temp);
    }
    return undefined;
  }
}
