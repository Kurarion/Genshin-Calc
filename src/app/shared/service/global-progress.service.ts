import { Injectable } from '@angular/core';
import { ProgressBarMode } from '@angular/material/progress-bar';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GlobalProgressService {
  private readonly DEFAULT_DELAY = 150;

  private progressMode: Subject<ProgressBarMode> =
    new Subject<ProgressBarMode>();
  private progressMode$ = this.progressMode.asObservable();
  private progressValue: Subject<number> = new Subject<number>();
  private progressValue$ = this.progressValue.asObservable();
  private progressBufferValue: Subject<number> = new Subject<number>();
  private progressBufferValue$ = this.progressBufferValue.asObservable();

  private isOnProgress: boolean = false;

  constructor() {
    this.progressMode$.subscribe((v) => {
      console.log(v);
    });

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

  setMode(mode: ProgressBarMode) {
    this.progressMode.next(mode);
  }

  getMode(): Observable<ProgressBarMode> {
    return this.progressMode$;
  }

  setValue(value: number) {
    let delay = 0;
    if (value > 0) {
      delay = this.DEFAULT_DELAY;
    }
    setTimeout(() => {
      this.progressValue.next(value);
    }, delay);
  }

  getValue(): Observable<number> {
    return this.progressValue$;
  }

  setBufferValue(value: number) {
    let delay = 0;
    if (value > 0) {
      delay = this.DEFAULT_DELAY;
    }
    setTimeout(() => {
      this.progressBufferValue.next(value);
    }, delay);
  }

  getBufferValue(): Observable<number> {
    return this.progressBufferValue$;
  }

  getProgressStatus() {
    return this.isOnProgress;
  }

  private start() {
    this.isOnProgress = true;
  }

  private end() {
    this.isOnProgress = false;
  }
}
