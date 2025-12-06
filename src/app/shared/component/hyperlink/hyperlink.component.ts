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
    // Load tooltip content when component initializes
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
    }, 300); // 300ms delay
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

    // Default position: below the element
    let top = hostRect.bottom + window.scrollY + 5;
    let left = hostRect.left + window.scrollX;

    // Check if tooltip would go beyond the right edge of the viewport
    if (left + 300 > window.innerWidth) { // 300 is estimated max width
      left = hostRect.right + window.scrollX - 300;
    }

    // Check if tooltip would go beyond the bottom of the viewport
    if (top + 200 > window.innerHeight + window.scrollY) { // 200 is estimated max height
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