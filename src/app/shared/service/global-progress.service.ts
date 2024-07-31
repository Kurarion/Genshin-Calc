import {Injectable} from '@angular/core';
import {ProgressBarMode} from '@angular/material/progress-bar';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GlobalProgressService {
  private readonly DEFAULT_DELAY = 150;

  //プログレスモード
  private progressMode: Subject<ProgressBarMode> = new Subject<ProgressBarMode>();
  private progressMode$ = this.progressMode.asObservable();
  //プログレス値
  private progressValue: Subject<number> = new Subject<number>();
  private progressValue$ = this.progressValue.asObservable();
  //プログレスバッファ値
  private progressBufferValue: Subject<number> = new Subject<number>();
  private progressBufferValue$ = this.progressBufferValue.asObservable();
  //処理中フラグ
  private isOnProgress: Subject<boolean> = new Subject<boolean>();
  private isOnProgress$ = this.isOnProgress.asObservable();
  //処理事件
  private progessMessage: Subject<string> = new Subject<string>();
  private progessMessage$ = this.progessMessage.asObservable();

  constructor() {
    let handler = (value: number) => {
      if (value == 100) {
        this.end();
      } else {
        this.start();
      }
    };
    this.progressValue$.subscribe(handler);
    this.progressBufferValue$.subscribe(handler);
  }

  //モード設定
  setMode(mode: ProgressBarMode) {
    this.progressMode.next(mode);
  }

  //モード取得
  getMode(): Observable<ProgressBarMode> {
    return this.progressMode$;
  }

  //値設定
  setValue(value: number) {
    let delay = 0;
    if (value > 0) {
      delay = this.DEFAULT_DELAY;
    }
    setTimeout(() => {
      this.progressValue.next(value);
    }, delay);
  }

  //値取得
  getValue(): Observable<number> {
    return this.progressValue$;
  }

  //バッファ設定
  setBufferValue(value: number) {
    let delay = 0;
    if (value > 0) {
      delay = this.DEFAULT_DELAY;
    }
    setTimeout(() => {
      this.progressBufferValue.next(value);
    }, delay);
  }

  //バッファ取得
  getBufferValue(): Observable<number> {
    return this.progressBufferValue$;
  }

  //プログレス内容設定
  setProgressMessage(value: string) {
    this.progessMessage.next(value);
  }

  //プログレス内容取得
  getProgressMessage(): Observable<string> {
    return this.progessMessage$;
  }

  //プログレスフラグ取得
  getProgressStatus(): Observable<boolean> {
    return this.isOnProgress$;
  }

  //処理開始
  private start() {
    this.isOnProgress.next(true);
  }

  //処理終了
  private end() {
    this.isOnProgress.next(false);
    this.progessMessage.next('');
  }
}
