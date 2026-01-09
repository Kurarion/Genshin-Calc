import { Component, Input, HostListener, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { HyperlinkService } from '../../service/hyperlink.service';

@Component({
  selector: 'app-hyperlink',
  templateUrl: './hyperlink.component.html',
  styleUrls: ['./hyperlink.component.css']
})
export class HyperlinkComponent implements AfterViewInit, OnDestroy {
  @Input() linkId: string = '';
  @Input() content: string = '';

  @ViewChild('tooltipElement') tooltipElement!: ElementRef<HTMLDivElement>;

  tooltipContent: string = '';
  showTooltip: boolean = false;
  tooltipPosition: { top: number; left: number } = { top: 0, left: 0 };

  private destroy$ = new Subject<void>();
  private hoverTimer: any = null;

  constructor(
    private elementRef: ElementRef,
    private hyperlinkService: HyperlinkService
  ) {}

  ngAfterViewInit() {
    // コンポーネント初期化時にツールチップコンテンツを読み込む
    this.loadTooltipContent();
  }

  ngOnDestroy() {
    this.clearHoverTimer();
    this.destroy$.next();
    this.destroy$.complete();
  }

  @HostListener('mouseenter')
  onMouseEnter() {
    this.clearHoverTimer();
    this.hoverTimer = setTimeout(() => {
      this.showTooltipNow();
    }, 300); // 300ms遅延
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.clearHoverTimer();
    this.hideTooltip();
  }

  private loadTooltipContent() {
    if (!this.linkId) return;

    this.hyperlinkService.getHyperlinkContentById(this.linkId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(content => {
        this.tooltipContent = content;
      });
  }

  private showTooltipNow() {
    if (!this.tooltipContent) return;

    this.showTooltip = true;
    this.calculatePosition();
  }

  private hideTooltip() {
    this.showTooltip = false;
  }

  private calculatePosition() {
    if (!this.tooltipElement || !this.elementRef) return;

    const hostRect = this.elementRef.nativeElement.getBoundingClientRect();
    const tooltipRect = this.tooltipElement.nativeElement.getBoundingClientRect();

    // デフォルト位置: 要素の下
    let top = hostRect.bottom + window.scrollY + 5;
    let left = hostRect.left + window.scrollX;

    // ツールチップがビューポートの右端を超えるかチェック
    if (left + 300 > window.innerWidth) { // 300は推定最大幅
      left = hostRect.right + window.scrollX - 300;
    }

    // ツールチップがビューポートの下端を超えるかチェック
    if (top + 200 > window.innerHeight + window.scrollY) { // 200は推定最大高さ
      top = hostRect.top + window.scrollY - 200 - 5;
    }

    this.tooltipPosition = { top, left };
  }

  private clearHoverTimer() {
    if (this.hoverTimer) {
      clearTimeout(this.hoverTimer);
      this.hoverTimer = null;
    }
  }
}