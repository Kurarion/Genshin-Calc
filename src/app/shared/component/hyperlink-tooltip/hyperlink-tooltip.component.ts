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
    // 初始化时不显示内容，只在需要时加载
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
    
    // 如果已经有内容，直接显示
    if (this.content) {
      this.isVisible = true;
      // 使用setTimeout确保DOM已更新
      setTimeout(() => {
        this.positionTooltip();
        this.cdr.detectChanges();
      }, 0);
      return;
    }
    
    // 加载内容
    this.contentSubscription = this.hyperlinkService.getHyperlinkContentById(this.linkId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((content: string) => {
        this.content = content;
        this.isVisible = true;
        // 使用setTimeout确保DOM已更新
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

    // 获取触发元素的位置（使用最近的超链接元素）
    const hyperlinkElements = document.querySelectorAll(`.${Const.HYPERLINK_CSS_CLASS}[${Const.HYPERLINK_DATA_ATTR}="${this.linkId}"]`);
    if (hyperlinkElements.length === 0) return;

    const hyperlinkElement = hyperlinkElements[hyperlinkElements.length - 1] as HTMLElement; // 使用最后一个匹配的元素
    const rect = hyperlinkElement.getBoundingClientRect();

    // 获取工具提示容器
    const tooltipContainer = this.elementRef.nativeElement.querySelector('.hyperlink-tooltip-container') as HTMLElement;
    if (!tooltipContainer) return;

    // 先让容器可见以获取准确的尺寸
    tooltipContainer.style.visibility = 'hidden';
    tooltipContainer.style.display = 'block';

    // 获取工具提示的实际尺寸
    const tooltipRect = tooltipContainer.getBoundingClientRect();
    const tooltipWidth = tooltipRect.width || Math.min(this.tooltipMaxWidth, 300);
    const tooltipHeight = tooltipRect.height || Math.min(this.tooltipMaxHeight, 200);

    // 计算位置
    let top = rect.bottom + window.scrollY + 5;
    let left = rect.left + window.scrollX;

    // 检查是否超出视口右边
    if (left + tooltipWidth > window.innerWidth) {
      left = rect.right + window.scrollX - tooltipWidth;
    }

    // 检查是否超出视口底部
    if (top + tooltipHeight > window.innerHeight + window.scrollY) {
      top = rect.top + window.scrollY - tooltipHeight - 5;
    }

    // 设置位置
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