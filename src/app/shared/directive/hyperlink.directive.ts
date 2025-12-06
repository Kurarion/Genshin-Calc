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
    // 添加超链接样式
    this.renderer.addClass(this.elementRef.nativeElement, Const.HYPERLINK_CSS_CLASS);
    
    // 设置数据属性
    this.renderer.setAttribute(
      this.elementRef.nativeElement, 
      Const.HYPERLINK_DATA_ATTR, 
      this.linkId
    );
    
    // 添加基本样式
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
    // 延迟显示工具提示
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
    // 阻止默认行为
    event?.preventDefault();
    
    // 显示详细内容（可以扩展为模态框或其他方式）
    this.showDetailedContent();
  }
  
  private showTooltip() {
    if (!this.linkId || this.tooltipElement) return;
    
    // 创建工具提示元素
    this.tooltipElement = this.renderer.createElement('div');
    this.renderer.addClass(this.tooltipElement, 'hyperlink-tooltip');
    
    // 设置工具提示样式
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
    
    // 获取内容
    this.contentSubscription = this.hyperlinkService.getHyperlinkContentById(this.linkId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((content: string) => {
        if (this.tooltipElement) {
          this.tooltipElement.innerHTML = content;
          this.positionTooltip();
          
          // 添加到DOM
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
    // 这里可以实现更详细的内容显示方式，例如模态框
    // 目前简单地使用alert作为示例
    if (this.linkId) {
      this.hyperlinkService.getHyperlinkContentById(this.linkId)
        .pipe(takeUntil(this.destroy$))
        .subscribe((content: string) => {
          // 在实际应用中，可以使用更好的UI组件显示内容
          console.log('Hyperlink content:', content);
        });
    }
  }
  
  private positionTooltip() {
    if (!this.tooltipElement) return;
    
    const hostElement = this.elementRef.nativeElement as HTMLElement;
    const hostRect = hostElement.getBoundingClientRect();
    
    // 计算位置
    let top = hostRect.bottom + window.scrollY + 5;
    let left = hostRect.left + window.scrollX;
    
    // 获取工具提示的预估尺寸
    const tooltipWidth = Math.min(Const.HYPERLINK_TOOLTIP_MAX_WIDTH, 200);
    const tooltipHeight = Math.min(Const.HYPERLINK_TOOLTIP_MAX_HEIGHT, 100);
    
    // 检查是否超出视口右边
    if (left + tooltipWidth > window.innerWidth) {
      left = hostRect.right + window.scrollX - tooltipWidth;
    }
    
    // 检查是否超出视口底部
    if (top + tooltipHeight > window.innerHeight + window.scrollY) {
      top = hostRect.top + window.scrollY - tooltipHeight - 5;
    }
    
    // 设置位置
    this.renderer.setStyle(this.tooltipElement, 'top', `${top}px`);
    this.renderer.setStyle(this.tooltipElement, 'left', `${left}px`);
  }
}