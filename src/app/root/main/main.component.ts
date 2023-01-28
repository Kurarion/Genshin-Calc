import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { MatDrawerMode } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { routerAnimation } from 'src/animation';
import {
  LangInfo,
  CharaInfo,
  Const,
  LanguageService,
  StorageService,
  TYPE_SYS_LANG,
  RelayoutMsgService,
} from 'src/app/shared/shared.module';
import { SwUpdate } from '@angular/service-worker';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  animations: [
    routerAnimation
  ],
})
export class MainComponent implements OnInit, OnDestroy {

  //キャプチャーするエレメントID
  captureElementID: string = Const.ID_CAPTURE_ELEMENT;
  //破棄状態
  destroyed = new Subject<void>();
  //メニューオープン状態
  menuOpenStatus!: boolean;
  //幅の広いフラグ
  isLarge!: Observable<boolean>;
  isLargeFlg: boolean = true;
  //言語リスト
  langs!: LangInfo[];
  //モード
  menuMode!: MatDrawerMode;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private languageService: LanguageService,
    private translateService: TranslateService,
    private storageService: StorageService,
    private relayoutMsgService: RelayoutMsgService,
    private swUpdate: SwUpdate,
    private matSnackBar: MatSnackBar,
  ) {
    this.menuMode = 'side';
    //言語リスト初期化
    this.langs = LanguageService.langs;
    //レイアウトフラグ
    this.isLarge = this.breakpointObserver.observe(['(min-width: 700px)']).pipe(
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
        this.menuMode = isLarge?'side':'over';
      }, flgDelay);
    });
    //SW更新通知
    this.swUpdate.versionUpdates.subscribe((event)=>{
      switch (event.type) {
        case 'VERSION_READY':
          this.translateService.get('SW.READY').subscribe((res: string) => {
            let infos = res.split(';;');
            this.matSnackBar.open(infos[0], infos[1]).onAction().subscribe(()=>{
              window.location.reload();
            })
          });
        break;
      }
    })
  }

  ngOnInit() {
    //言語初期化
    this.initLang();
  }

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
  closeMenu(event: CharaInfo) {
    // if (!this.isLargeFlg) {
    //   this.menuOpenStatus = false;
    // }
  }

  /**
   * 言語切り替え
   */
  changeLang(selectLang: LangInfo) {
    //言語設定
    this.languageService.nextLang(selectLang.code);
  }

  /**
   * 貼り付けた画像をリストに追加
   */
  addPastedImage(image: Blob) {
    //TODO
  }

  /**
   * ルーター動画状態取得
   * @param outlet 
   * @returns 
   */
  prepareRoute(outlet: RouterOutlet) {
    return outlet?.activatedRouteData?.['animation'];
  }

  openedChange(){
    this.relayoutMsgService.update("sidenav");
  }

  /**
   * 言語初期化
   */
  private initLang() {
    //ストレージから復元
    const lang =
      this.languageService.getStorageLang() ??
      Const.CULTURELANG_MAP.get(this.translateService.getBrowserCultureLang()??"") ??
      Const.CULTURELANG_MAP.get(this.translateService.getBrowserLang()??"") ??
      this.translateService.getDefaultLang();
    setTimeout(()=>{
      //言語設定
      this.languageService.nextLang(lang as TYPE_SYS_LANG);
    })
  }

}
