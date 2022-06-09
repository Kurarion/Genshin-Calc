import { Component, OnDestroy, OnInit } from '@angular/core';
import { character, CharacterQueryParam, CharacterService, Const, GenshinDataService, HttpService, LanguageService, TYPE_SYS_LANG } from 'src/app/shared/shared.module';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ActivatedRoute } from '@angular/router';

const CSS_STATUS_BEFORE = "beforeLoad";
const CSS_STATUS_FIN = "loaded";

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
        opacity: 0.16,
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
  //キャラインデックス
  currentCharacterIndex!: string;
  //キャラデータ
  data!: character;
  //CSS動画ステータス
  otherState = CSS_STATUS_BEFORE;
  //言語
  currentLanguage!: TYPE_SYS_LANG;

  constructor(private httpService: HttpService,
    private route: ActivatedRoute, 
    private characterService: CharacterService, 
    private languageService: LanguageService) {
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
      .subscribe((params: CharacterQueryParam) => {
        //キャラデータ
        this.data = this.characterService.get(params.index!);
        //チャラインデックス
        this.currentCharacterIndex = params.index!.toString();
        //背景初期化
        this.initializeBackGroundImage();
        //追加データ初期化
        this.characterService.setDefaultExtraData(params.index!);
        //DEBUG
        console.log(this.data)
        console.log(this.characterService.getExtraData(params.index!));
      }
    );
  }

  ngOnDestroy(): void {
    //CSS動画リセット
    this.backgroundLoadFlg = false;
    this.otherState = CSS_STATUS_BEFORE;
  }

  /**
   * 背景初期化
   */
  private initializeBackGroundImage() {
    if (!this.backgroundURL) {
      this.backgroundLoadFlg = false;
      let url = this.data.images.background;
      if (url) {
        this.httpService.get<Blob>(url, 'blob').then((v: Blob | null) => {
          if (v) {
            this.backgroundURL = window.URL.createObjectURL(v);
            setTimeout(() => {
              this.backgroundLoadFlg = true;
            }, 100)
          }
        }).catch(() => { });
      }
    }
  }

}
