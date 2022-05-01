import { Injectable } from '@angular/core';
import { createScheduler, createWorker } from 'tesseract.js';
import { GlobalProgressService } from 'src/app/shared/shared.module';

@Injectable({
  providedIn: 'root',
})
export class OcrService {
  private scheduler = createScheduler();
  private worker1 = createWorker({
    logger: (m) => this.progress(m),
  });
  private worker1ready: Promise<any>;
  private worker2 = createWorker({
    logger: (m) => this.progress(m),
  });
  private worker2ready: Promise<any>;

  constructor(private globalProgressService: GlobalProgressService) {
    this.worker1ready = this.worker1.load();
    this.worker2ready = this.worker2.load();

    Promise.all([this.worker1ready, this.worker2ready]).then(() => {
      this.scheduler.addWorker(this.worker1);
      this.scheduler.addWorker(this.worker2);
    });
  }

  async setLanguage(language: string) {
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
    const {
      data: { text },
    } = await this.scheduler.addJob('recognize', image);
    console.log(text);
  }

  private progress(log: any) {
    this.globalProgressService.setProgressMessage(log.status);
    this.globalProgressService.setValue(log.progress * 100);
  }
}
