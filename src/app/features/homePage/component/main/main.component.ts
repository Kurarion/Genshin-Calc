import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {
  CharacterQueryParam,
  CharacterService,
  ConfirmDialogComponent,
  ConfirmDialogData,
  Const,
  EnkaService,
  HttpService,
  LanguageService,
  MainQueryParam,
  ManualDialogComponent,
  ManualDialogData,
  SettingService,
  TYPE_SYS_LANG,
  TextInputDialogComponent,
  OverlayService,
  GenshinDataService,
} from 'src/app/shared/shared.module';
import {
  homePageImgLoadAnimation,
  homePageOtherLoadAnimation,
  CSS_STATUS_BEFORE,
  CSS_STATUS_FIN,
} from 'src/animation';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {environment} from 'src/environments/environment';
import {Subscription} from 'rxjs';

const HOMEPAGE_BG = 'assets/init/homePageBG-compress.png';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  animations: [homePageImgLoadAnimation, homePageOtherLoadAnimation],
})
export class MainComponent implements OnInit, OnDestroy, AfterViewInit {
  //背景画像URL
  backgroundURL!: string;
  //背景画像ローディングフラグ
  backgroundLoadFlg!: boolean;
  //背景CSS動画ステータス
  imgState = CSS_STATUS_BEFORE;
  //CSS動画ステータス
  otherState = CSS_STATUS_BEFORE;
  //言語
  currentLanguage!: TYPE_SYS_LANG;
  //システムデータダウンロード状態
  jsonDownloadStatus!: Map<string, number>;
  //初期ロードフラグ
  showLoadStatus: boolean = false;
  //subscription
  subscriptions!: Subscription[];

  constructor(
    private httpService: HttpService,
    private languageService: LanguageService,
    private route: ActivatedRoute,
    private router: Router,
    private characterService: CharacterService,
    private enkaService: EnkaService,
    private settingService: SettingService,
    private translateService: TranslateService,
    private matDialog: MatDialog,
    private matSnackBar: MatSnackBar,
    private overlayService: OverlayService,
    private genshinDataService: GenshinDataService,
  ) {
    //初期言語設定
    this.currentLanguage = this.languageService.getCurrentLang();
    //言語変更検知
    this.languageService.getLang().subscribe((lang: TYPE_SYS_LANG) => {
      this.currentLanguage = lang;
    });
    //ダウンロード状態初期化
    this.jsonDownloadStatus = this.genshinDataService.getAllJsonDownloadStatus();
    //初期ロードフラグ
    if (this.jsonDownloadStatus.size < 1) {
      this.showLoadStatus = true;
    } else {
      this.jsonDownloadStatus.forEach((v) => {
        if (v < 100) {
          this.showLoadStatus = true;
        }
      });
    }
    //データ変更検知
    this.subscriptions = [];
    this.subscriptions.push(
      this.genshinDataService.status().subscribe(() => {
        setTimeout(() => {
          this.showLoadStatus = false;
          this.otherState = CSS_STATUS_FIN;
        }, 1000);
      }),
    );
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: MainQueryParam) => {
      //戻る防止
      history.pushState(null, '', '');
      window.addEventListener('popstate', () => {
        history.pushState(null, '', '');
      });
      //パラメータ処理
      new Promise<void>((resolve, reject) => {
        if (params && Object.keys(params).length > 0) {
          this.overlayService.showLoading();
        }
        setTimeout(async () => {
          try {
            //Enka絞り込み
            if (params.filterEnka && params.filterEnka === '1') {
              this.settingService.resetSetting();
              const setting = this.settingService.getMenuSetting();
              setting.filterEnka = true;
            }
            //Enka UID
            if (params.uid) {
              this.enkaService.updateEnkaUID(params.uid);
              await this.enkaService
                .initEnkaData(params.uid)
                .then((addedNum: number) => {
                  //完了
                  let messageId = 'ENKA.DONE';
                  if (addedNum === 0) {
                    messageId = 'ENKA.DONE_ZERO';
                  }
                  this.translateService.get(messageId).subscribe((res: string) => {
                    this.matSnackBar.open(res, undefined, {
                      duration: 2000,
                    });
                  });
                })
                .catch(() => {
                  //失敗
                  this.translateService.get('ENKA.FAILED').subscribe((res: string) => {
                    this.matSnackBar.open(res, undefined, {
                      duration: 2000,
                    });
                  });
                  reject();
                });
            }
            //キャラページに遷移
            if (
              params.character &&
              Object.keys(this.characterService.getMap()).includes(params.character)
            ) {
              const characterQueryParam: CharacterQueryParam = {
                index: params.character,
              };
              this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
                this.router.navigate([Const.MENU_CHARACTER], {
                  queryParams: characterQueryParam,
                  skipLocationChange: true,
                }),
              );
            }
            resolve();
          } catch (error) {
            reject();
          }
        });
      }).finally(() => {
        this.overlayService.hideLoading();
      });
    });
    this.initializeBackGroundImage();
  }

  ngOnDestroy(): void {
    //CSS動画リセット
    this.backgroundLoadFlg = false;
    this.otherState = CSS_STATUS_BEFORE;
    this.imgState = CSS_STATUS_BEFORE;
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.otherState = CSS_STATUS_FIN;
    });
  }

  //キャッシュ削除
  removeCurrentCache() {
    const data: ConfirmDialogData = {
      title: 'MENU.DELETE_CACHE.ALL_TITLE',
      content: 'MENU.DELETE_CACHE.ALL_WANRING',
      cancel: 'MENU.DELETE_CACHE.CANCEL',
      ok: 'MENU.DELETE_CACHE.OK',
    };
    const dialogRef = this.matDialog.open(ConfirmDialogComponent, {data});
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        //削除
        localStorage.clear();
        //成功
        this.translateService.get('MENU.DELETE_CACHE.ALL_SUCCESS').subscribe((res: string) => {
          this.matSnackBar.open(res, undefined, {
            duration: 1500,
          });
        });
        //リフレッシュ
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    });
  }

  //マニュアル
  openManual() {
    const currentFile = Const.MAP_MANUAL_FILE[this.currentLanguage];
    const data: ManualDialogData = {
      file: currentFile,
    };
    const dialogRef = this.matDialog.open(ManualDialogComponent, {data});
    window.umami?.track('Manual');
  }

  //分析サイト
  openAnalytics() {
    const url = environment.analyticsUrl;
    window.umami?.track('Analytics');
    window.open(url, '_blank');
  }

  /**
   * 背景初期化
   */
  private initializeBackGroundImage() {
    if (!this.backgroundURL) {
      let url = HOMEPAGE_BG;
      if (url) {
        this.httpService
          .get<Blob>(url, 'blob')
          .then((v: Blob | null) => {
            if (v) {
              this.backgroundURL = window.URL.createObjectURL(v);
              setTimeout(() => {
                this.imgState = CSS_STATUS_FIN;
              }, 100);
            }
          })
          .catch(() => {});
      }
    }
  }
}
