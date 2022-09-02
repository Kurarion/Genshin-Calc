import { Component, HostListener, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { RelayoutMsgService, CalculatorService, character, CharacterQueryParam, CharacterService, Const, GenshinDataService, HttpService, LanguageService, TYPE_SYS_LANG, WeaponService } from 'src/app/shared/shared.module';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ActivatedRoute } from '@angular/router';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { map, takeUntil, Observable, Subject, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import MagicGrid from "magic-grid"

const CSS_STATUS_BEFORE = "beforeLoad";
const CSS_STATUS_FIN = "loaded";
const WIDTH_DECREASE = 65;

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
  readonly name_character = 'character';
  readonly name_enemy = 'enemy';
  readonly name_weapon = 'weapon';
  readonly name_artifact = 'artifact';
  readonly name_talent = 'talent';
  readonly name_constellation = 'constellation';
  readonly name_other = 'other';

  readonly childNameMap: Record<string,string> = {
    'character': '0',
    'enemy': '1',
    'weapon': '2',
    'artifact': '3',
    'talent': '4',
    'constellation': '5',
    'other': '6',
  };

  readonly childNames = [
    '0',//'character',
    '1',//'enemy',
    '2',//'weapon',
    '3',//'artifact',
    '4',//'talent',
    '5',//'constellation',
    '6',//'other',
  ];

  //背景画像URL
  backgroundURL!: string;
  //背景画像ローディングフラグ
  backgroundLoadFlg!: boolean;
  //キャラインデックス
  currentCharacterIndex!: string;
  //キャラデータ
  data!: character;
  //背景CSS動画ステータス
  imgState = CSS_STATUS_BEFORE;
  //CSS動画ステータス
  otherState = CSS_STATUS_BEFORE;
  //言語
  currentLanguage!: TYPE_SYS_LANG;
  //画面横幅
  screenWidth!: number;
  setCardWidth!: number;
  //スクロールバー幅
  scrollBarWidth!: number;
  //幅の広いフラグ
  isLarge!: Observable<boolean>;
  isLargeFlg: boolean = true;
  //破棄状態
  destroyed = new Subject<void>();
  //z-indexs
  childZIndexs!: Record<string, number>;
  //レイアウトマネジャー
  magicGrid!: MagicGrid|null;
  //subscription
  subscriptions!: Subscription[];
  //z-index
  private zIndexs!: string[];

  constructor(private httpService: HttpService,
    private route: ActivatedRoute, 
    private characterService: CharacterService,
    private calculatorService: CalculatorService,
    private languageService: LanguageService,
    private breakpointObserver: BreakpointObserver,
    private relayoutMsgService: RelayoutMsgService,) {
    this.subscriptions = [];
    this.subscriptions.push(this.relayoutMsgService.status().subscribe(()=>{
      setTimeout(()=>{
        this.reLayout();
      })
    }));
    this.subscriptions.push(this.calculatorService.changed().subscribe(()=>{
      setTimeout(()=>{
        this.reLayout();
      })
    }));
    //z-index初期化
    this.zIndexs = [];
    this.childZIndexs = {};
    this.refreshChildZIndexs();
    //レイアウトフラグ
    this.isLarge = this.breakpointObserver.observe(['(min-width: 700px)']).pipe(
      takeUntil(this.destroyed),
      map((state: BreakpointState) => {
        return state.matches;
      })
    );
    //ブラウザのレイアウトイベント
    this.isLarge.subscribe((isLarge: boolean) => {
      //レイアウトフラグ設定（メニューモードに影響する）
      if(isLarge){
        this.scrollBarWidth = 9;
      }else{
        this.scrollBarWidth = 9;
      }
    });
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
        this.calculatorService.initCharacterData(params.index!);
        if(environment.outputLog){
          //DEBUG
          console.log(this.data)
        }
        //レイアウト
        setTimeout(()=>{
          this.magicGrid = new MagicGrid({
            container: ".content",
            items: 7,
            gutter: 8,
            maxColumns: 4,
            animate: true,
            useMin: true,
          });
          this.magicGrid.listen();
        })
      }
    );
    //画面横幅取得
    this.screenWidth = window.innerWidth;
    this.setCardWidth = this.screenWidth - WIDTH_DECREASE;
  }

  ngOnDestroy(): void {
    //CSS動画リセット
    this.backgroundLoadFlg = false;
    this.otherState = CSS_STATUS_BEFORE;
    this.imgState = CSS_STATUS_BEFORE;
    //レイアウト監視を終了
    this.destroyed.next();
    this.destroyed.complete();
    this.magicGrid = null;
    //
    for(let sub of this.subscriptions){
      if(sub && !(sub?.closed)){
        sub.unsubscribe();
      }
    }
  }

  /**
   * 背景初期化
   */
  private initializeBackGroundImage() {
    if (!this.backgroundURL) {
      // this.backgroundLoadFlg = false;
      let url = this.data.images.background;
      if (url) {
        this.httpService.get<Blob>(url, 'blob').then((v: Blob | null) => {
          if (v) {
            this.backgroundURL = window.URL.createObjectURL(v);
            setTimeout(() => {
              // this.backgroundLoadFlg = true;
              this.imgState = CSS_STATUS_FIN;
            }, 100)
          }
        }).catch(() => { });
      }
    }
  }

  
  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.screenWidth = window.innerWidth;
    this.setCardWidth = this.screenWidth - WIDTH_DECREASE;
  }

  onChildStartDrag(name: string){
    if(this.childNameMap[name] != this.zIndexs[this.zIndexs.length-1]){
      this.zIndexs.push(this.childNameMap[name]);
      this.refreshChildZIndexs();
    }
  }

  refreshChildZIndexs(){
    for(let key of this.childNames){
      this.childZIndexs[key] = (this.zIndexs.lastIndexOf(key) + 1);
    }
  }

  ngAfterViewChecked(){
    // this.reLayout();

  }

  reLayout(){
    if(this.magicGrid?.ready()){
      this.magicGrid.positionItems();
    }
  }
}
