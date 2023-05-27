import { Component, OnDestroy, OnInit } from '@angular/core';
import { CharacterQueryParam, CharacterService, ConfirmDialogComponent, ConfirmDialogData, Const, EnkaService, HttpService, LanguageService, MainQueryParam, ManualDialogComponent, ManualDialogData, SettingService, TYPE_SYS_LANG, TextInputDialogComponent, OverlayService } from 'src/app/shared/shared.module';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';


const CSS_STATUS_BEFORE = "beforeLoad";
const CSS_STATUS_FIN = "loaded";
const HOMEPAGE_BG = "assets/init/homePageBG-compress.png";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  animations: [
    trigger('imgLoad', [
      state(CSS_STATUS_BEFORE, style({
        opacity: 0.01,
      })),
      state(CSS_STATUS_FIN, style({
        opacity: 0.4,
      })),
      transition(CSS_STATUS_BEFORE + '=>' + CSS_STATUS_FIN, [
        animate('1s')
      ]),
      transition(CSS_STATUS_FIN + '=>' + CSS_STATUS_BEFORE, [
        animate('0.2s')
      ])
    ]),
    trigger('otherLoad', [
      state(CSS_STATUS_BEFORE, style({
        opacity: 0.01,
      })),
      state(CSS_STATUS_FIN, style({
        opacity: 1,
      })),
      transition(CSS_STATUS_BEFORE + '=>' + CSS_STATUS_FIN, [
        animate('0.5s')
      ]),
      transition(CSS_STATUS_FIN + '=>' + CSS_STATUS_BEFORE, [
        animate('0.2s')
      ])
    ])
  ]
})
export class MainComponent implements OnInit, OnDestroy {

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

  constructor(private httpService: HttpService,
    private languageService: LanguageService,
    private route: ActivatedRoute,
    private router: Router,
    private characterService: CharacterService,
    private enkaService: EnkaService,
    private settingService: SettingService,
    private translateService: TranslateService,
    private matDialog: MatDialog,
    private matSnackBar: MatSnackBar,
    private overlayService: OverlayService,) {
    //初期言語設定
    this.currentLanguage = this.languageService.getCurrentLang();
    //言語変更検知
    this.languageService.getLang().subscribe((lang: TYPE_SYS_LANG) => {
      this.currentLanguage = lang;
    })
    //遅延CSSステータス変更
    setTimeout(() => {
      this.otherState = CSS_STATUS_FIN;
    }, 100)
  }

  ngOnInit(): void {
    this.route.queryParams
      .subscribe((params: MainQueryParam) => {
        //戻る防止
        history.pushState(null, '', '');
        window.addEventListener('popstate', ()=>{
          history.pushState(null, '', '');
        })
        //パラメータ処理
        new Promise<void>((resolve, reject) => {
          this.overlayService.showLoading();
          setTimeout(async () => {
            try {
              //Enka絞り込み
              if(params.filterEnka && params.filterEnka === '1') {
                this.settingService.resetSetting();
                const setting = this.settingService.getMenuSetting();
                setting.filterEnka = true;
              }
              //Enka UID
              if(params.uid) {
                this.enkaService.updateEnkaUID(params.uid);
                await this.enkaService.initEnkaData(params.uid).then((addedNum: number)=>{
                  //完了
                  let messageId = 'ENKA.DONE'
                  if (addedNum === 0) {
                    messageId = 'ENKA.DONE_ZERO'
                  }
                  this.translateService.get(messageId).subscribe((res: string) => {
                    this.matSnackBar.open(res, undefined, {
                      duration: 2000
                    })
                  });
                }).catch(()=>{
                  //失敗
                  this.translateService.get('ENKA.FAILED').subscribe((res: string) => {
                    this.matSnackBar.open(res, undefined, {
                      duration: 2000
                    })
                  });
                  reject();
                })
              }
              //キャラページに遷移
              if(params.character &&
                Object.keys(this.characterService.getMap()).includes(params.character)) {
                  const characterQueryParam: CharacterQueryParam = {
                    index: params.character,
                  }
                  this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
                  this.router.navigate([Const.MENU_CHARACTER], {queryParams: characterQueryParam, skipLocationChange: true}));
              }
              resolve();
            } catch (error) {
              reject();
            }
          })
        }).finally(() => {
          this.overlayService.hideLoading();
        })
      }
    );
    this.initializeBackGroundImage();
  }

  ngOnDestroy(): void {
    //CSS動画リセット
    this.backgroundLoadFlg = false;
    this.otherState = CSS_STATUS_BEFORE;
    this.imgState = CSS_STATUS_BEFORE;
  }

  //キャッシュ削除
  removeCurrentCache() {
    const data: ConfirmDialogData = {
      title: 'MENU.DELETE_CACHE.ALL_TITLE',
      content: 'MENU.DELETE_CACHE.ALL_WANRING',
      cancel: 'MENU.DELETE_CACHE.CANCEL',
      ok: 'MENU.DELETE_CACHE.OK',
    }
    const dialogRef = this.matDialog.open(ConfirmDialogComponent, {data})
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if(result){
        //削除
        localStorage.clear()
        //成功
        this.translateService.get('MENU.DELETE_CACHE.ALL_SUCCESS').subscribe((res: string) => {
          this.matSnackBar.open(res, undefined, {
            duration: 1500
          })
        });
        //リフレッシュ
        setTimeout(()=>{
          window.location.reload();
        }, 1000)
      }
    })
  }

  //マニュアル
  openManual() {
    const currentFile = Const.MAP_MANUAL_FILE[this.currentLanguage];
    const data: ManualDialogData = {
      file: currentFile,
    }
    const dialogRef = this.matDialog.open(ManualDialogComponent, {data})
  }

  /**
   * 背景初期化
   */
  private initializeBackGroundImage() {
    if (!this.backgroundURL) {
      let url = HOMEPAGE_BG;
      if (url) {
        this.httpService.get<Blob>(url, 'blob').then((v: Blob | null) => {
          if (v) {
            this.backgroundURL = window.URL.createObjectURL(v);
            setTimeout(() => {
              this.imgState = CSS_STATUS_FIN;
            }, 100)
          }
        }).catch(() => { });
      }
    }
  }

}
