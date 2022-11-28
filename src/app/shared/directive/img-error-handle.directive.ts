import { Directive, ElementRef, HostListener } from '@angular/core';
import { Const } from '../const/const';

@Directive({
  selector: 'img[appImgErrorHandle]'
})
export class ImgErrorHandleDirective {

  constructor(private el: ElementRef) { }

  @HostListener("error")
  private onError() {
    this.el.nativeElement.src = Const.IMG_ON_ERROR;
  }

}
