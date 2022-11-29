import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { TYPE_HTTP_RESPONSE_TYPE, GlobalProgressService, Const } from 'src/app/shared/shared.module';
import { lastValueFrom, map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  private cache!: Map<string,any>;
  tempPicBody!: any;

  constructor(private httpClient: HttpClient,
    private globalProgressService: GlobalProgressService) { 
      this.cache = new Map<string,any>();
      this.get<Blob>(Const.IMG_ON_ERROR, 'blob', true).then((content)=>{
        this.tempPicBody = content;
      })
    }

  get<T>(url: string, responseType: TYPE_HTTP_RESPONSE_TYPE = 'json', useCahe: boolean = false): Promise<T | null> {

    //チェックキャッシュ
    if(this.cache.has(url) && useCahe){
      return new Promise((resolve)=>{
        resolve(this.cache.get(url) as T | null);
      })
    }

    let httpCallBack = this.getCallBackFunc<T>(this.cache, url);

    let option: any = {
      observe: 'events',
      responseType: responseType,
      reportProgress: true,
    }

    return lastValueFrom(this.httpClient.get<T>(url, option)
      .pipe(
        map(httpCallBack)
      )
    ).catch((error)=>{
      if(responseType == 'blob'){
        return this.tempPicBody;
      }
    });
  }

  /**
   * コールバック
   * @returns 
   */
  private getCallBackFunc<T>(cache: Map<string,any>, originUrl: string) {
    let toLoad: number;
    let service = this;
    let is404Redirect: boolean;
    return function (event: HttpEvent<T>) {
      switch (event.type) {
        case HttpEventType.Sent:
          service.globalProgressService.setValue(0);
          break;
        case HttpEventType.ResponseHeader:
          if(event.url == null || Const.IMG_RES_404_REG.test(event.url) || !event.ok){
            throw new Error('404');
          }
          toLoad = parseInt(event.headers.get("content-length") as string);
          break;
        case HttpEventType.DownloadProgress:
          const percent = Math.round(event.loaded * 100 / toLoad);
          service.globalProgressService.setValue(percent);
          break;
        case HttpEventType.Response:
          cache.set(originUrl, event.body);
          return event.body as T | null;
      }
      return null;
    }
  }
}
