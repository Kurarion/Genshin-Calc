import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { map, Observable, Subject, switchMap, tap } from 'rxjs';
import { Const, LangInfo, OcrService, StorageService, TYPE_SYS_LANG } from 'src/app/shared/shared.module';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  //言語リスト
  static langs: LangInfo[] = Const.LIST_LANG;
  static langCodes: TYPE_SYS_LANG[] = LanguageService.langs.map((l) => l.code);
  private currentLang!: TYPE_SYS_LANG;

  //使用中の言語
  private currentLangCode: Subject<TYPE_SYS_LANG> = new Subject<TYPE_SYS_LANG>();
  private currentLangCode$: Observable<TYPE_SYS_LANG> = this.currentLangCode.asObservable();
  private currentLangCodeAfterPreProcess: Observable<TYPE_SYS_LANG>;

  constructor(private translateService: TranslateService,
    private storageService: StorageService,
    //private ocrService: OcrService,
    private titleService: Title) {
    //言語設定
    this.translateService.addLangs(LanguageService.langCodes);
    //言語変更監視
    this.currentLangCodeAfterPreProcess = this.currentLangCode$.pipe(
      switchMap((nextLang: TYPE_SYS_LANG, index: number) => {
        return this.setLang(nextLang).pipe(
          tap(() => {
            this.currentLang = nextLang;
          })
        );
      })
    );
    //初期化
    // this.initLang();
  }

  nextLang(lang: TYPE_SYS_LANG) {
    //言語設定
    this.currentLangCode.next(lang);
  }

  getLang() {
    return this.currentLangCodeAfterPreProcess;
  }

  getCurrentLang() {
    return this.currentLang;
  }

  setStorageLang(lang: TYPE_SYS_LANG){
    this.storageService.setItem(Const.STORAGE_LANG, lang);
  }

  getStorageLang(){
    return this.storageService.getItem(Const.STORAGE_LANG);
  }

  /**
   * 言語設定
   */
  private setLang(langCode: TYPE_SYS_LANG): Observable<TYPE_SYS_LANG> {
    //UI言語切り替え
    return this.translateService
      .use(
        langCode?.match(new RegExp(LanguageService.langs.join('|')))
          ? langCode
          : environment.defaultLang
      ).pipe(
        map(() => {
          //タブタイトル初期化
          this.updateTabTitleName();
          //OCR言語設定
          // this.ocrService.setLanguage(
          //   Const.MAP_TESSERACT_LANG[langCode]
          // );
          //ストレージに保存
          this.setStorageLang(langCode);

          return langCode;
        })
      );
  }

  /**
   * タブタイトル言語更新
   */
  private updateTabTitleName() {
    this.translateService.get('TITLE').subscribe((res: string) => {
      this.titleService.setTitle(res);
    });
  }

  /**
   * 言語初期化
   */
  private initLang() {
    //ストレージから復元
    const lang =
      this.getStorageLang() ??
      this.translateService.getDefaultLang();
    //言語設定
    this.currentLang = lang as TYPE_SYS_LANG;
    this.nextLang(lang as TYPE_SYS_LANG);
  }
}
