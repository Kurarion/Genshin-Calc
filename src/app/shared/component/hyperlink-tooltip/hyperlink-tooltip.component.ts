import { Component, Input, HostListener, ElementRef, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Const } from '../../shared.module';
import { HyperlinkService } from '../../service/hyperlink.service';

@Component({
  selector: 'app-hyperlink-tooltip',
  templateUrl: './hyperlink-tooltip.component.html',
  styleUrls: ['./hyperlink-tooltip.component.css']
})
export class HyperlinkTooltipComponent implements OnInit, OnDestroy {
  @Input() linkId: string = '';
  @Input() tooltipMaxWidth: number = Const.HYPERLINK_TOOLTIP_MAX_WIDTH;
  @Input() tooltipMaxHeight: number = Const.HYPERLINK_TOOLTIP_MAX_HEIGHT;
  
  content: string = '';
  isVisible: boolean = false;
  
  private destroy$ = new Subject<void>();
  private hoverTimer: any = null;
  private contentSubscription: Subscription | null = null;
  
  constructor(
    private elementRef: ElementRef,
    private hyperlinkService: HyperlinkService,
    private cdr: ChangeDetectorRef
  ) {}
  
  ngOnInit() {
    // 初期化時にはコンテンツを表示せず、必要時にのみ読み込む
  }
  
  ngOnDestroy() {
    this.clearHoverTimer();
    this.destroy$.next();
    this.destroy$.complete();
    
    if (this.contentSubscription) {
      this.contentSubscription.unsubscribe();
    }
  }
  
  @HostListener('mouseenter')
  onMouseEnter() {
    this.clearHoverTimer();
    this.hoverTimer = setTimeout(() => {
      this.showTooltip();
    }, Const.HYPERLINK_HOVER_DELAY);
  }
  
  @HostListener('mouseleave')
  onMouseLeave() {
    this.clearHoverTimer();
    this.hideTooltip();
  }
  
  private showTooltip() {
    if (!this.linkId) return;

    // 既にコンテンツがある場合は直接表示
    if (this.content) {
      this.isVisible = true;
      // setTimeoutを使用してDOMが更新されたことを確認
      setTimeout(() => {
        this.positionTooltip();
        this.cdr.detectChanges();
      }, 0);
      return;
    }

    // コンテンツを読み込む
    this.contentSubscription = this.hyperlinkService.getHyperlinkContentById(this.linkId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((content: string) => {
        this.content = content;
        this.isVisible = true;
        // setTimeoutを使用してDOMが更新されたことを確認
        setTimeout(() => {
          this.positionTooltip();
          this.cdr.detectChanges();
        }, 0);
      });
  }
  
  private hideTooltip() {
    this.isVisible = false;
    this.cdr.detectChanges();
  }
  
  private positionTooltip() {
    if (!this.isVisible) return;

    // トリガー要素の位置を取得（最も近いハイパーリンク要素を使用）
    const hyperlinkElements = document.querySelectorAll(`.${Const.HYPERLINK_CSS_CLASS}[${Const.HYPERLINK_DATA_ATTR}="${this.linkId}"]`);
    if (hyperlinkElements.length === 0) return;

    const hyperlinkElement = hyperlinkElements[hyperlinkElements.length - 1] as HTMLElement; // 最後にマッチした要素を使用
    const rect = hyperlinkElement.getBoundingClientRect();

    // ツールチップコンテナを取得
    const tooltipContainer = this.elementRef.nativeElement.querySelector('.hyperlink-tooltip-container') as HTMLElement;
    if (!tooltipContainer) return;

    // 正確なサイズを取得するためにコンテナを一時的に表示
    tooltipContainer.style.visibility = 'hidden';
    tooltipContainer.style.display = 'block';

    // ツールチップの実際のサイズを取得
    const tooltipRect = tooltipContainer.getBoundingClientRect();
    const tooltipWidth = tooltipRect.width || Math.min(this.tooltipMaxWidth, 300);
    const tooltipHeight = tooltipRect.height || Math.min(this.tooltipMaxHeight, 200);

    // 位置を計算
    let top = rect.bottom + window.scrollY + 5;
    let left = rect.left + window.scrollX;

    // ビューポートの右端を超えるかチェック
    if (left + tooltipWidth > window.innerWidth) {
      left = rect.right + window.scrollX - tooltipWidth;
    }

    // ビューポートの下端を超えるかチェック
    if (top + tooltipHeight > window.innerHeight + window.scrollY) {
      top = rect.top + window.scrollY - tooltipHeight - 5;
    }

    // 位置を設定
    tooltipContainer.style.position = 'absolute';
    tooltipContainer.style.top = `${top}px`;
    tooltipContainer.style.left = `${left}px`;
    tooltipContainer.style.zIndex = '1000';
    tooltipContainer.style.visibility = 'visible';
  }
  
  private clearHoverTimer() {
    if (this.hoverTimer) {
      clearTimeout(this.hoverTimer);
      this.hoverTimer = null;
    }
  }
}