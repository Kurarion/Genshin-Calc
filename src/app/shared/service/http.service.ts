import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { TYPE_HTTP_RESPONSE_TYPE, GlobalProgressService } from 'src/app/shared/shared.module';
import { lastValueFrom, map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private httpClient: HttpClient,
    private globalProgressService: GlobalProgressService) { }

  get<T>(url: string, responseType: TYPE_HTTP_RESPONSE_TYPE = 'json'): Promise<T | null> {

    let httpCallBack = this.getCallBackFunc<T>()

    let option: any = {
      observe: 'events',
      responseType: responseType,
      reportProgress: true,
    }

    return lastValueFrom(this.httpClient.get<T>(url, option)
      .pipe(
        map(httpCallBack)
      )
    );
  }

  /**
   * コールバック
   * @returns 
   */
  private getCallBackFunc<T>() {
    let toLoad: number;
    let service = this;
    return function (event: HttpEvent<T>) {
      switch (event.type) {
        case HttpEventType.Sent:
          service.globalProgressService.setValue(0);
          break;
        case HttpEventType.ResponseHeader:
          toLoad = parseInt(event.headers.get("content-length") as string);
          break;
        case HttpEventType.DownloadProgress:
          const percent = Math.round(event.loaded * 100 / toLoad);
          service.globalProgressService.setValue(percent);
          break;
        case HttpEventType.Response:
          return event.body as T | null;
      }
      return null;
    }
  }
}
