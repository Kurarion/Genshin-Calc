import { Directive, ElementRef, HostListener } from '@angular/core';
import { Const } from '../const/const';

@Directive({
  selector: 'img[appImgErrorHandle]'
})
export class ImgErrorHandleDirective {

  // hasLoaded = false;

  constructor(private el: ElementRef) { }

  @HostListener("error")
  private onError() {
    this.el.nativeElement.src = Const.IMG_ON_ERROR;
  }

  // @HostListener("load")
  // private onLoad() {
  //   if(
  //     !this.hasLoaded &&
  //     (this.el.nativeElement as HTMLImageElement).naturalHeight == Const.IMG_RES_404_HEIGHT &&
  //     (this.el.nativeElement as HTMLImageElement).naturalWidth == Const.IMG_RES_404_WIDTH){
  //     this.hasLoaded = true;
  //     console.log("AAAA")
  //     this.onError();
  //   }
  // }

}
