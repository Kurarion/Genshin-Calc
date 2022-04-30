import {
  Component,
  OnInit,
  Input,
  ElementRef,
  HostListener,
} from '@angular/core';
import html2canvas from 'html2canvas';
import { Const } from '../../const/const';
import {
  copyBlobToClipboard,
  canCopyImagesToClipboard,
} from 'copy-image-clipboard';

@Component({
  selector: 'app-capture-html',
  templateUrl: './capture-html.component.html',
  styleUrls: ['./capture-html.component.css'],
})
export class CaptureHtmlComponent implements OnInit {
  constructor() {}

  ngOnInit() {}

  onClick() {
    //エレメント取得
    let HTMLElement: HTMLElement = document.getElementById(
      Const.ID_CAPTURE_ELEMENT
    )!;
    //画像生成する
    html2canvas(HTMLElement).then((canvas: HTMLCanvasElement) => {
      canvas.toBlob((blob: Blob | null) => {
        // //aタグを作る
        // let link = document.createElement('a');
        // //ブラウザで表示、新タブでファイルを開く
        // link.target = '_blank';
        // //BlobのURLを作る
        // const url = window.URL.createObjectURL(blob);
        // //BolbのURLをaタグのURLに設定
        // link.href = url;
        // //ファイルをダウンロード
        // link.click();
        const canCopy = canCopyImagesToClipboard();
        if (canCopy) {
          copyBlobToClipboard(blob!);
        }
      });
    });
  }
}
