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
    // 如果值没有变化，返回缓存的结果
    if (value === this.lastValue) {
      return this.lastResult;
    }

    this.lastValue = value;

    // 如果没有超链接标记，直接返回原值
    if (!value || !this.hyperlinkService.hasHyperlinks(value)) {
      this.lastResult = value;
      return value;
    }
    
    // 创建新的可观察对象来处理超链接
    this.processedValue$ = this.hyperlinkService.processHyperlinks(value)
      .pipe(
        takeUntil(this.destroy$),
        startWith(value) // 立即返回原值，避免空值
      );
    
    // 订阅处理结果
    this.processedValue$.subscribe(processedText => {
      // 只有当值真正变化时才更新
      if (processedText !== this.lastResult) {
        this.lastResult = processedText;
        // 使用 setTimeout 确保在下一个变更检测周期中更新视图
        setTimeout(() => {
          this.cdr.markForCheck();
        }, 0);
      }
    });
    
    // 返回当前结果
    return this.lastResult || value;
  }
  
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}