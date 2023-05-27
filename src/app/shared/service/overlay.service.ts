import { Injectable } from '@angular/core';
import { GlobalPositionStrategy, Overlay, OverlayRef } from "@angular/cdk/overlay";
import { ComponentPortal } from "@angular/cdk/portal";
import { LoadingOverlayComponent } from '../shared.module';

@Injectable({
  providedIn: 'root'
})
export class OverlayService {

  overlayRef!: OverlayRef;
  loadingEle!: ComponentPortal<LoadingOverlayComponent>;

  constructor(private overlay: Overlay) {
    const positionStrategy: GlobalPositionStrategy = this.overlay.position().global().centerHorizontally().centerVertically();
    this.overlayRef = this.overlay.create({
      hasBackdrop: true,
      disposeOnNavigation: true,
      positionStrategy
    });
    this.loadingEle = new ComponentPortal(LoadingOverlayComponent);
  }

  showLoading() {
    this.overlayRef.attach(this.loadingEle);
  }

  hideLoading() {
    setTimeout(()=>{
      this.overlayRef.detach();
    }, 250)
  }
}
