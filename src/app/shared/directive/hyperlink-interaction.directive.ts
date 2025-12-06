import { Directive, ElementRef, Renderer2, OnDestroy, OnInit } from '@angular/core';
import { HyperlinkService, LanguageService } from '../shared.module';
import { Const } from '../shared.module';
import { Subject, takeUntil } from 'rxjs';

@Directive({
  selector: '[appHyperlinkInteraction]'
})
export class HyperlinkInteractionDirective implements OnInit, OnDestroy {
  private tooltipElement: HTMLElement | null = null;
  private hoverTimer: any = null;
  private mutationObserver: MutationObserver | null = null;
  private isTooltipVisible: boolean = false;
  private currentAllLanguageContent: any = null; // 存储所有语言内容
  private currentLinkId: string = ''; // 当前缓存的linkId
  private destroy$ = new Subject<void>();

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private hyperlinkService: HyperlinkService,
    private languageService: LanguageService
  ) {}

  ngOnInit() {
    // 创建工具提示元素
    this.createTooltipElement();
    // 初始添加监听器
    this.addListenersToHyperlinks(this.elementRef.nativeElement);

    // 监听DOM变化
    this.mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes) {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as HTMLElement;
              this.addListenersToHyperlinks(element);
            }
          });
        }
        // 同时检查整个元素的变化，以防语言切换导致整个内容重新渲染
        if (mutation.type === 'childList' && mutation.target === this.elementRef.nativeElement) {
          // 延迟重新扫描，确保DOM完全更新
          setTimeout(() => {
            this.addListenersToHyperlinks(this.elementRef.nativeElement);
          }, 100);
        }
      });
    });

    this.mutationObserver.observe(this.elementRef.nativeElement, {
      childList: true,
      subtree: true
    });

    // 监听语言变化
    this.languageService.getLang()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        // 隐藏当前tooltip，避免位置错乱
        if (this.isTooltipVisible) {
          this.hideTooltip();
        }

        // 语言切换后重新扫描并添加事件监听器
        setTimeout(() => {
          this.addListenersToHyperlinks(this.elementRef.nativeElement);
        }, 200); // 给DOM更新一些时间
      });
  }

  ngOnDestroy() {
    this.clearHoverTimer();
    this.removeTooltip();

    // 停止语言监听
    this.destroy$.next();
    this.destroy$.complete();

    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
    }
  }

  private createTooltipElement() {
    this.tooltipElement = this.renderer.createElement('div') as HTMLElement;
    this.renderer.addClass(this.tooltipElement, 'hyperlink-tooltip');
    this.renderer.setStyle(this.tooltipElement, 'position', 'fixed');
    this.renderer.setStyle(this.tooltipElement, 'z-index', '99999');
    this.renderer.setStyle(this.tooltipElement, 'display', 'none');
    this.renderer.setStyle(this.tooltipElement, 'background', 'rgba(0, 0, 0, 0.9)');
    this.renderer.setStyle(this.tooltipElement, 'color', 'white');
    this.renderer.setStyle(this.tooltipElement, 'padding', '8px 12px');
    this.renderer.setStyle(this.tooltipElement, 'border-radius', '4px');
    this.renderer.setStyle(this.tooltipElement, 'box-shadow', '0 2px 8px rgba(0, 0, 0, 0.3)');
    this.renderer.setStyle(this.tooltipElement, 'font-size', '14px');
    this.renderer.setStyle(this.tooltipElement, 'max-width', '300px');
    this.renderer.setStyle(this.tooltipElement, 'word-wrap', 'break-word');

    document.body.appendChild(this.tooltipElement);
  }

  private addListenersToHyperlinks(element: HTMLElement) {
    const hyperlinks = element.querySelectorAll(`.${Const.HYPERLINK_CSS_CLASS}`);

    // 如果没有找到超链接，检查原始HTML
    if (hyperlinks.length === 0) {
      const innerHTML = element.innerHTML;
      if (innerHTML.includes('{LINK#')) {
        // 有未处理的LINK#标记，这表示数据处理有问题
        // (静默处理，避免控制台污染)
      }
      return;
    }

    hyperlinks.forEach((hyperlink) => {
      const hyperlinkElement = hyperlink as HTMLElement;

      // 检查是否已经添加了监听器
      if (hyperlinkElement.hasAttribute('data-hyperlink-listener')) {
        return;
      }

      hyperlinkElement.setAttribute('data-hyperlink-listener', 'true');

      // 获取linkId
      let linkId = hyperlinkElement.getAttribute(Const.HYPERLINK_DATA_ATTR);

      // 如果没有找到，尝试从title属性获取（兼容性）
      if (!linkId) {
        linkId = hyperlinkElement.getAttribute('title');
        // 移除原生title以避免冲突
        this.renderer.removeAttribute(hyperlinkElement, 'title');
      }

      if (!linkId) {
        return;
      }

      // 添加基本样式
      this.renderer.setStyle(hyperlinkElement, 'cursor', 'pointer');
      this.renderer.setStyle(hyperlinkElement, 'color', '#ff9800');
      this.renderer.setStyle(hyperlinkElement, 'text-decoration', 'underline');

      // 添加鼠标事件监听
      this.renderer.listen(hyperlinkElement, 'mouseenter', (_event: MouseEvent) => {
        this.clearHoverTimer();
        this.hoverTimer = setTimeout(() => {
          this.showTooltip(hyperlinkElement);
        }, Const.HYPERLINK_HOVER_DELAY);
      });

      this.renderer.listen(hyperlinkElement, 'mouseleave', () => {
        this.clearHoverTimer();
        this.hideTooltip();
      });
    });
  }

  private showTooltip(hyperlinkElement: HTMLElement) {
    if (!this.tooltipElement) {
      return;
    }

    // 获取linkId（使用与addListenersToHyperlinks相同的逻辑）
    let linkId = hyperlinkElement.getAttribute(Const.HYPERLINK_DATA_ATTR);

    // 如果没有找到，尝试从title属性获取（兼容性）
    if (!linkId) {
      linkId = hyperlinkElement.getAttribute('title');
    }

    if (!linkId) {
      return;
    }

    // 此时linkId肯定不是null，所以可以安全赋值
    const linkIdStr = linkId;

    // 记录tooltip状态
    this.isTooltipVisible = true;

    // 如果已经有缓存的内容且是同一个linkId，直接显示
    if (this.currentAllLanguageContent && Object.keys(this.currentAllLanguageContent).length > 0 && this.currentLinkId === linkIdStr) {
      this.displayCurrentLanguageContent();
      this.positionTooltip(hyperlinkElement);
      return;
    }

    // 获取所有语言内容（预加载）
    this.hyperlinkService.getHyperlinkContentById(linkIdStr).subscribe(allLanguageContent => {
      if (!this.tooltipElement || !this.isTooltipVisible) {
        return;
      }

      if (!allLanguageContent || Object.keys(allLanguageContent).length === 0) {
        // 如果没有内容，隐藏tooltip
        this.hideTooltip();
        return;
      }

      // 存储所有语言内容，用于语言切换
      this.currentAllLanguageContent = allLanguageContent;
      this.currentLinkId = linkIdStr;

      // 获取当前语言的内容并显示
      this.displayCurrentLanguageContent();
      this.positionTooltip(hyperlinkElement);
    });
  }

  /**
   * 显示当前语言的内容
   */
  private displayCurrentLanguageContent() {
    if (!this.currentAllLanguageContent || !this.tooltipElement) {
      return;
    }

    const currentContent = this.hyperlinkService.getContentForCurrentLanguage(this.currentAllLanguageContent);

    if (currentContent) {
      this.tooltipElement.innerHTML = `<div style="color: white;">${currentContent}</div>`;
      this.renderer.setStyle(this.tooltipElement, 'display', 'block');
    } else {
      this.hideTooltip();
    }
  }

  private hideTooltip() {
    if (this.tooltipElement) {
      this.renderer.setStyle(this.tooltipElement, 'display', 'none');
      this.isTooltipVisible = false;
    }
  }

  private positionTooltip(hyperlinkElement: HTMLElement) {
    if (!this.tooltipElement) return;

    const hostRect = hyperlinkElement.getBoundingClientRect();
    const tooltipRect = this.tooltipElement.getBoundingClientRect();

    // 获取视口尺寸
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // 计算tooltip的尺寸
    const tooltipWidth = tooltipRect.width || 300;
    const tooltipHeight = tooltipRect.height || 100;

    // 简单的智能定位：优先显示在下方，如果空间不足则显示在上方
    let top = hostRect.bottom + 10;
    let left = hostRect.left;

    // 检查底部是否有足够空间
    if (hostRect.bottom + tooltipHeight + 10 > viewportHeight) {
      // 底部空间不足，显示在上方
      top = hostRect.top - tooltipHeight - 10;
    }

    // 检查右侧是否有足够空间，如果没有则向左调整
    if (hostRect.left + tooltipWidth > viewportWidth) {
      left = viewportWidth - tooltipWidth - 10;
    }

    // 确保不会超出左边界
    if (left < 10) {
      left = 10;
    }

    // 设置位置（使用fixed定位）
    this.renderer.setStyle(this.tooltipElement, 'top', `${top}px`);
    this.renderer.setStyle(this.tooltipElement, 'left', `${left}px`);
  }

  private removeTooltip() {
    if (this.tooltipElement && this.tooltipElement.parentNode) {
      this.tooltipElement.parentNode.removeChild(this.tooltipElement);
      this.tooltipElement = null;
    }
  }

  private clearHoverTimer() {
    if (this.hoverTimer) {
      clearTimeout(this.hoverTimer);
      this.hoverTimer = null;
    }
  }

  }