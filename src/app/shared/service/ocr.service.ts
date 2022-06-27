import { Injectable } from '@angular/core';
import { createScheduler, createWorker } from 'tesseract.js';
import { GlobalProgressService } from 'src/app/shared/shared.module';
const { Image } = require('image-js');

@Injectable({
  providedIn: 'root',
})
export class OcrService {
  private scheduler = createScheduler();
  private worker1 = createWorker({
    logger: (m) => this.progress(m),
  });
  private worker1ready!: Promise<any>;
  private worker2 = createWorker({
    logger: (m) => this.progress(m),
  });
  private worker2ready!: Promise<any>;

  constructor(private globalProgressService: GlobalProgressService) {
    //TODO
    return;
    this.worker1ready = this.worker1.load();
    this.worker2ready = this.worker2.load();

    Promise.all([this.worker1ready, this.worker2ready]).then(() => {
      this.scheduler.addWorker(this.worker1);
      this.scheduler.addWorker(this.worker2);
    });
  }

  async setLanguage(language: string) {
    //TODO
    return;
    await Promise.all([
      this.worker1ready.then(async () => {
        await this.worker1.loadLanguage(language);
        await this.worker1.initialize(language);
      }),
      this.worker2ready.then(async () => {
        await this.worker2.loadLanguage(language);
        await this.worker2.initialize(language);
      }),
    ]);
  }

  async ocr(image: Blob) {
    //TODO
    return;
    //結果リスト[キャラ画面のアーティファクト, アーティファクト（サブ）, アーティファクト（メイン）]
    let texts: string[];
    //結果Promise
    let textPromises: Promise<string>[] = [];
    //元画像
    let temp = await Image.load(await image.arrayBuffer())

    //キャラ画面のアーティファクト
    textPromises.push(temp
    .gaussianFilter({
      radius: '1',
      sigma: '0.59'
    })
    .grey({
      algorithm: 'lightness'
    })
    .mask({
      algorithm: 'minimum'
    }).toBlob().then(async (image: any) => {
      return this.scheduler.addJob('recognize', await image.arrayBuffer());
    }).then((data: any) => {
      return data.data.text;
    }));

    //アーティファクト（サブ）
    textPromises.push(temp
    .gaussianFilter({
      radius: '1',
    })
    .grey({
      algorithm: 'red'
    }).toBlob().then(async (image: any) => {
      return this.scheduler.addJob('recognize', await image.arrayBuffer());
    }).then((data: any) => {
      return data.data.text;
    }))
    //アーティファクト（メイン）
    textPromises.push(temp
    .gaussianFilter({
      radius: '1',
    })
    .grey({
      algorithm: 'magenta'
    }).toBlob().then(async (image: any) => {
      return this.scheduler.addJob('recognize', await image.arrayBuffer());
    }).then((data: any) => {
      return data.data.text;
    }));

    // //test
    // //aタグを作る
    // let link = document.createElement('a');
    // //ブラウザで表示、新タブでファイルを開く
    // link.target = '_blank';
    // //BlobのURLを作る
    // const url = window.URL.createObjectURL(thresholdImage);
    // //BolbのURLをaタグのURLに設定
    // link.href = url;
    // //ファイルをダウンロード
    // link.click();

    //ocr
    texts = await Promise.all(textPromises);

    //TODO
    console.log(texts);
  }

  private progress(log: any) {
    //TODO
    return;
    this.globalProgressService.setProgressMessage(log.status);
    this.globalProgressService.setValue(log.progress * 100);
  }
}
