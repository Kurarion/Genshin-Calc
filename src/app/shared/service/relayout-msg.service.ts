import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RelayoutMsgService {

  //使用中の言語
  private relayoutMsg: Subject<string> = new Subject<string>();
  private relayoutMsg$: Observable<string> = this.relayoutMsg.asObservable();

  constructor() { }

  update(str: string){
    this.relayoutMsg.next(str);
  }

  status(){
    return this.relayoutMsg$;
  }
}
