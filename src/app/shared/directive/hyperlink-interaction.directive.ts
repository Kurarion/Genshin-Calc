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
  private currentAllLanguageContent: any = null; // 全言語のコンテンツを保存
  private currentLinkId: string = ''; // 現在キャッシュされているlinkId
  private destroy$ = new Subject<void>();

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private hyperlinkService: HyperlinkService,
    private languageService: LanguageService
  ) {}

  ngOnInit() {
    // ツールチップ要素を作成
    this.createTooltipElement();
    // 初期状態でリスナーを追加
    this.addListenersToHyperlinks(this.elementRef.nativeElement);

    // DOMの変化を監視
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
        // 言語切り替えにより内容全体が再レンダリングされる場合に備え、要素全体の変化もチェック
        if (mutation.type === 'childList' && mutation.target === this.elementRef.nativeElement) {
          // DOMが完全に更新されたことを確認するために遅延して再スキャン
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

    // 言語の変化を監視
    this.languageService.getLang()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        // 位置ずれを防ぐために現在のツールチップを非表示
        if (this.isTooltipVisible) {
          this.hideTooltip();
        }

        // 言語切り替え後に再スキャンしてイベントリスナーを追加
        setTimeout(() => {
          this.addListenersToHyperlinks(this.elementRef.nativeElement);
        }, 200); // DOM更新のために少し時間を与える
      });
  }

  ngOnDestroy() {
    this.clearHoverTimer();
    this.removeTooltip();

    // 言語監視を停止
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

    // ハイパーリンクが見つからない場合は、生HTMLをチェック
    if (hyperlinks.length === 0) {
      const innerHTML = element.innerHTML;
      if (innerHTML.includes('{LINK#')) {
        // 処理されていないLINK#タグがある場合、データ処理に問題があることを示す
        // （静默処理し、コンソール汚染を防ぐ）
      }
      return;
    }

    hyperlinks.forEach((hyperlink) => {
      const hyperlinkElement = hyperlink as HTMLElement;

      // リスナーが既に追加されているかチェック
      if (hyperlinkElement.hasAttribute('data-hyperlink-listener')) {
        return;
      }

      hyperlinkElement.setAttribute('data-hyperlink-listener', 'true');

      // linkIdを取得
      let linkId = hyperlinkElement.getAttribute(Const.HYPERLINK_DATA_ATTR);

      // 見つからない場合はtitle属性から取得を試みる（互換性）
      if (!linkId) {
        linkId = hyperlinkElement.getAttribute('title');
        // 衝突を避けるためにネイティブtitleを削除
        this.renderer.removeAttribute(hyperlinkElement, 'title');
      }

      if (!linkId) {
        return;
      }

      // 基本スタイルを追加
      this.renderer.setStyle(hyperlinkElement, 'cursor', 'pointer');
      this.renderer.setStyle(hyperlinkElement, 'color', '#ff9800');
      this.renderer.setStyle(hyperlinkElement, 'text-decoration', 'underline');

      // マウスイベントリスナーを追加
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

    // linkIdを取得（addListenersToHyperlinksと同じロジックを使用）
    let linkId = hyperlinkElement.getAttribute(Const.HYPERLINK_DATA_ATTR);

    // 見つからない場合はtitle属性から取得を試みる（互換性）
    if (!linkId) {
      linkId = hyperlinkElement.getAttribute('title');
    }

    if (!linkId) {
      return;
    }

    // この時点でlinkIdはnullではないので、安全に代入できる
    const linkIdStr = linkId;

    // ツールチップ状態を記録
    this.isTooltipVisible = true;

    // 既にキャッシュされたコンテンツがあり、同じlinkIdの場合は直接表示
    if (this.currentAllLanguageContent && Object.keys(this.currentAllLanguageContent).length > 0 && this.currentLinkId === linkIdStr) {
      this.displayCurrentLanguageContent();
      this.positionTooltip(hyperlinkElement);
      return;
    }

    // 全言語のコンテンツを取得（プリロード）
    this.hyperlinkService.getHyperlinkContentById(linkIdStr).subscribe(allLanguageContent => {
      if (!this.tooltipElement || !this.isTooltipVisible) {
        return;
      }

      if (!allLanguageContent || Object.keys(allLanguageContent).length === 0) {
        // コンテンツがない場合はツールチップを非表示
        this.hideTooltip();
        return;
      }

      // 言語切り替え用に全言語のコンテンツを保存
      this.currentAllLanguageContent = allLanguageContent;
      this.currentLinkId = linkIdStr;

      // 現在の言語のコンテンツを取得して表示
      this.displayCurrentLanguageContent();
      this.positionTooltip(hyperlinkElement);
    });
  }

  /**
   * 現在の言語のコンテンツを表示する
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

    // ビューポートサイズを取得
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // ツールチップのサイズを計算
    const tooltipWidth = tooltipRect.width || 300;
    const tooltipHeight = tooltipRect.height || 100;

    // シンプルなスマート配置：優先的に下部に表示、スペース不足なら上部に表示
    let top = hostRect.bottom + 10;
    let left = hostRect.left;

    // 下部に十分なスペースがあるかチェック
    if (hostRect.bottom + tooltipHeight + 10 > viewportHeight) {
      // 下部のスペースが不足しているため、上部に表示
      top = hostRect.top - tooltipHeight - 10;
    }

    // 右側に十分なスペースがあるかチェック、なければ左に調整
    if (hostRect.left + tooltipWidth > viewportWidth) {
      left = viewportWidth - tooltipWidth - 10;
    }

    // 左境界を超えないようにする
    if (left < 10) {
      left = 10;
    }

    // 位置を設定（fixed配置を使用）
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