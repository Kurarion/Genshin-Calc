import { Directive, ElementRef, Renderer2, Input, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Const } from '../shared.module';
import { HyperlinkService } from '../service/hyperlink.service';

@Directive({
  selector: '[appHyperlink]'
})
export class HyperlinkDirective implements OnInit, OnDestroy {
  @Input('appHyperlink') linkId: string = '';
  
  private destroy$ = new Subject<void>();
  private tooltipElement: HTMLElement | null = null;
  private contentSubscription: Subscription | null = null;
  
  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private hyperlinkService: HyperlinkService
  ) {}
  
  ngOnInit() {
    // ハイパーリンクスタイルを追加
    this.renderer.addClass(this.elementRef.nativeElement, Const.HYPERLINK_CSS_CLASS);

    // データ属性を設定
    this.renderer.setAttribute(
      this.elementRef.nativeElement,
      Const.HYPERLINK_DATA_ATTR,
      this.linkId
    );

    // 基本スタイルを追加
    this.renderer.setStyle(this.elementRef.nativeElement, 'cursor', 'pointer');
    this.renderer.setStyle(this.elementRef.nativeElement, 'color', '#ff9800');
    this.renderer.setStyle(this.elementRef.nativeElement, 'text-decoration', 'underline');
  }
  
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    
    if (this.contentSubscription) {
      this.contentSubscription.unsubscribe();
    }
    
    this.removeTooltip();
  }
  
  @HostListener('mouseenter')
  onMouseEnter() {
    // ツールチップの表示を遅延させる
    setTimeout(() => {
      this.showTooltip();
    }, Const.HYPERLINK_HOVER_DELAY);
  }
  
  @HostListener('mouseleave')
  onMouseLeave() {
    this.removeTooltip();
  }
  
  @HostListener('click')
  onClick() {
    // デフォルトの動作を阻止
    event?.preventDefault();

    // 詳細コンテンツを表示（モーダルや他の方法に拡張可能）
    this.showDetailedContent();
  }
  
  private showTooltip() {
    if (!this.linkId || this.tooltipElement) return;

    // ツールチップ要素を作成
    this.tooltipElement = this.renderer.createElement('div');
    this.renderer.addClass(this.tooltipElement, 'hyperlink-tooltip');

    // ツールチップスタイルを設定
    this.renderer.setStyle(this.tooltipElement, 'position', 'absolute');
    this.renderer.setStyle(this.tooltipElement, 'z-index', '1000');
    this.renderer.setStyle(this.tooltipElement, 'background-color', 'rgba(0, 0, 0, 0.9)');
    this.renderer.setStyle(this.tooltipElement, 'color', 'white');
    this.renderer.setStyle(this.tooltipElement, 'padding', '8px 12px');
    this.renderer.setStyle(this.tooltipElement, 'border-radius', '4px');
    this.renderer.setStyle(this.tooltipElement, 'box-shadow', '0 2px 8px rgba(0, 0, 0, 0.3)');
    this.renderer.setStyle(this.tooltipElement, 'font-size', '14px');
    this.renderer.setStyle(this.tooltipElement, 'line-height', '1.4');
    this.renderer.setStyle(this.tooltipElement, 'max-width', `${Const.HYPERLINK_TOOLTIP_MAX_WIDTH}px`);
    this.renderer.setStyle(this.tooltipElement, 'max-height', `${Const.HYPERLINK_TOOLTIP_MAX_HEIGHT}px`);
    this.renderer.setStyle(this.tooltipElement, 'overflow-y', 'auto');
    this.renderer.setStyle(this.tooltipElement, 'word-wrap', 'break-word');
    this.renderer.setStyle(this.tooltipElement, 'pointer-events', 'none');

    // コンテンツを取得
    this.contentSubscription = this.hyperlinkService.getHyperlinkContentById(this.linkId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((content: string) => {
        if (this.tooltipElement) {
          this.tooltipElement.innerHTML = content;
          this.positionTooltip();

          // DOMに追加
          this.renderer.appendChild(document.body, this.tooltipElement);
        }
      });
  }
  
  private removeTooltip() {
    if (this.tooltipElement) {
      this.renderer.removeChild(document.body, this.tooltipElement);
      this.tooltipElement = null;
    }
  }
  
  private showDetailedContent() {
    // ここでより詳細なコンテンツ表示方法を実装できます（例：モーダル）
    // 現在は簡単にconsole.logを使用
    if (this.linkId) {
      this.hyperlinkService.getHyperlinkContentById(this.linkId)
        .pipe(takeUntil(this.destroy$))
        .subscribe((content: string) => {
          // 実際のアプリケーションでは、より良いUIコンポーネントを使用してコンテンツを表示できます
          console.log('Hyperlink content:', content);
        });
    }
  }
  
  private positionTooltip() {
    if (!this.tooltipElement) return;

    const hostElement = this.elementRef.nativeElement as HTMLElement;
    const hostRect = hostElement.getBoundingClientRect();

    // 位置を計算
    let top = hostRect.bottom + window.scrollY + 5;
    let left = hostRect.left + window.scrollX;

    // ツールチップの推定サイズを取得
    const tooltipWidth = Math.min(Const.HYPERLINK_TOOLTIP_MAX_WIDTH, 200);
    const tooltipHeight = Math.min(Const.HYPERLINK_TOOLTIP_MAX_HEIGHT, 100);

    // ビューポートの右端を超えるかチェック
    if (left + tooltipWidth > window.innerWidth) {
      left = hostRect.right + window.scrollX - tooltipWidth;
    }

    // ビューポートの下端を超えるかチェック
    if (top + tooltipHeight > window.innerHeight + window.scrollY) {
      top = hostRect.top + window.scrollY - tooltipHeight - 5;
    }

    // 位置を設定
    this.renderer.setStyle(this.tooltipElement, 'top', `${top}px`);
    this.renderer.setStyle(this.tooltipElement, 'left', `${left}px`);
  }
}