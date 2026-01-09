import { Pipe, PipeTransform, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Observable, Subject, of } from 'rxjs';
import { takeUntil, startWith } from 'rxjs/operators';
import { HyperlinkService } from '../service/hyperlink.service';

@Pipe({
  name: 'hyperlink',
  pure: false
})
export class HyperlinkPipe implements PipeTransform, OnDestroy {
  private destroy$ = new Subject<void>();
  private lastValue: any = null;
  private lastResult: string = '';
  private processedValue$: Observable<string> = of('');
  
  constructor(
    private hyperlinkService: HyperlinkService,
    private cdr: ChangeDetectorRef
  ) {}
  
  transform(value: string): string {
    // 値が変更されていない場合は、キャッシュされた結果を返す
    if (value === this.lastValue) {
      return this.lastResult;
    }

    this.lastValue = value;

    // ハイパーリンクタグがない場合は、元の値をそのまま返す
    if (!value || !this.hyperlinkService.hasHyperlinks(value)) {
      this.lastResult = value;
      return value;
    }

    // ハイパーリンクを処理するための新しいObservableを作成
    this.processedValue$ = this.hyperlinkService.processHyperlinks(value)
      .pipe(
        takeUntil(this.destroy$),
        startWith(value) // 空値を避けるために即座に元の値を返す
      );

    // 処理結果をサブスクライブ
    this.processedValue$.subscribe(processedText => {
      // 値が実際に変更された場合のみ更新
      if (processedText !== this.lastResult) {
        this.lastResult = processedText;
        // setTimeoutを使用して次の変更検出サイクルでビューを更新
        setTimeout(() => {
          this.cdr.markForCheck();
        }, 0);
      }
    });

    // 現在の結果を返す
    return this.lastResult || value;
  }
  
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}