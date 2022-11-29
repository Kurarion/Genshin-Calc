import { Directive, ElementRef, HostListener } from '@angular/core';
import { Const } from '../const/const';

@Directive({
  selector: 'img[appImgLoadAndErrorHandle]'
})
export class ImgLoadAndErrorHandleDirective {

  hasLoaded = false;

  constructor(private el: ElementRef) { }

  @HostListener("error")
  private onError() {
    this.el.nativeElement.src = Const.IMG_ON_ERROR;
  }

  @HostListener("load")
  private onLoad() {
    if(!this.hasLoaded &&
      (this.el.nativeElement as HTMLImageElement).naturalHeight == Const.IMG_RES_404_HEIGHT){
        this.hasLoaded = true;
        this.onError();
    }
  }

}
