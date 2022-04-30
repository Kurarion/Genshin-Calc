import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import {
  ArtifactListComponent,
  GlobalProgressService,
  LangInfo,
  MenuInfo,
  OcrService,
} from '../../shared/shared.module';
import { environment } from '../../../environments/environment';
import { Const } from '../../shared/const/const';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit, OnDestroy {
  @ViewChild('artifactList') artifactList!: ArtifactListComponent;

  //キャプチャーするエレメントID
  captureElementID: string = Const.ID_CAPTURE_ELEMENT;
  //破棄状態
  destroyed = new Subject<void>();
  //メニューオープン状態
  menuOpenStatus: boolean = false;
  //幅の広いフラグ
  isLarge!: Observable<boolean>;
  isLargeFlg: boolean = true;
  //言語リスト
  langs: LangInfo[] = Const.LIST_LANG;
  langCodes: string[] = this.langs.map((l) => l.code);
  currentLangCode: string = "";

  constructor(
    private breakpointObserver: BreakpointObserver,
    private translateService: TranslateService,
    private titleService: Title,
    private globalProgressService: GlobalProgressService,
    private ocrService: OcrService
  ) {
    //言語設定
    translateService.addLangs(this.langCodes);
    //言語初期化
    this.initLang();
    //レイアウトフラグ
    this.isLarge = breakpointObserver.observe(['(min-width: 700px)']).pipe(
      takeUntil(this.destroyed),
      map((state: BreakpointState) => {
        return state.matches;
      })
    );
    //ブラウザのレイアウトイベント
    this.isLarge.subscribe((isLarge: boolean) => {
      let openDelay = 0;
      let flgDelay = 0;
      //遅延処理（フラグで実行順番を調整）
      if (isLarge) {
        openDelay = 100;
      } else {
        flgDelay = 100;
      }
      setTimeout(() => {
        //メニュー表示制御
        this.menuOpenStatus = isLarge;
      }, openDelay);
      setTimeout(() => {
        //レイアウトフラグ設定（メニューモードに影響する）
        this.isLargeFlg = isLarge;
      }, flgDelay);
    });
  }

  ngOnInit() { }

  ngOnDestroy() {
    //レイアウト監視を終了
    this.destroyed.next();
    this.destroyed.complete();
  }

  /**
   * メニューオープン状態切り替え
   */
  toggleMenu() {
    this.menuOpenStatus = !this.menuOpenStatus;
  }

  /**
   * メニューを閉じる（幅の狭いのみ）
   */
  closeMenu(event: MenuInfo) {
    if (!this.isLargeFlg) {
      this.menuOpenStatus = false;
    }
  }

  /**
   * 言語切り替え
   */
  changeLang(selectLang: LangInfo) {
    //言語設定
    this.setLang(selectLang.code);
  }

  /**
   * 貼り付けた画像をリストに追加
   */
  addPastedImage(image: Blob) {
    //TODO
    this.artifactList.addArtifactList(image);
  }

  /**
   * 言語初期化
   */
  private initLang() {
    //ローカルストレージから復元
    const lang =
      localStorage.getItem(Const.STORAGE_LANG) ??
      this.translateService.getDefaultLang();
    //言語設定
    this.setLang(lang);
  }

  /**
   * 言語設定
   */
  private setLang(langCode: string) {
    //UI言語切り替え
    this.translateService
      .use(
        langCode?.match(new RegExp(this.langs.join('|')))
          ? langCode
          : environment.defaultLang
      )
      .subscribe(() => {
        //デフォルト言語に設定
        this.currentLangCode = langCode;
        //OCR言語設定
        this.ocrService.setLanguage(
          Const.MAP_TESSERACT_LANG[this.currentLangCode]
        );
        //タブタイトル初期化
        this.updateTabTitleName();
        //ローカルストレージに保存
        localStorage.setItem(Const.STORAGE_LANG, this.currentLangCode);
      });
  }

  /**
   * タブタイトル言語更新
   */
  private updateTabTitleName() {
    this.translateService.get('TITLE').subscribe((res: string) => {
      console.log("to set: ", res)
      this.titleService.setTitle(res);
    });
  }
}
