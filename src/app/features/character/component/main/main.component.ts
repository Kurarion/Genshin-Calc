import { Component, ElementRef, HostListener, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { RelayoutMsgService, CalculatorService, character, CharacterQueryParam, CharacterService, HttpService, LanguageService, TYPE_SYS_LANG, ConfirmDialogData, ConfirmDialogComponent, Const, WeaponService, EnemyService, ArtifactService, OtherService, TeamService, ManualDialogComponent, ManualDialogData, DPSService, ExtraInfoService } from 'src/app/shared/shared.module';
import { characterMainImgLoadAnimation, characterMainOtherLoadAnimation, CSS_STATUS_BEFORE, CSS_STATUS_FIN, buttonShowHideAnimation, SHOW, DISAPPEAR } from 'src/animation';
import { ActivatedRoute, Router } from '@angular/router';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { map, takeUntil, Observable, Subject, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import MagicGrid from "magic-grid";

const WIDTH_DECREASE = 65;

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  animations: [
    characterMainImgLoadAnimation,
    characterMainOtherLoadAnimation,
    buttonShowHideAnimation,
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
  readonly name_team = 'team';
  readonly name_dps = 'dps';

  readonly childNameMap: Record<string,string> = {
    'character': '0',
    'enemy': '1',
    'weapon': '2',
    'artifact': '3',
    'talent': '4',
    'constellation': '5',
    'other': '6',
    'team': '7',
    'dps': '8',
  };

  readonly childNames = [
    '0',//'character',
    '1',//'enemy',
    '2',//'weapon',
    '3',//'artifact',
    '4',//'talent',
    '5',//'constellation',
    '6',//'other',
    '7',//'team',
    '8',//'dps',
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
  //z-indexes
  childZIndexes!: Record<string, number>;
  //レイアウトマネジャー
  magicGrid!: MagicGrid|null;
  //subscription
  subscriptions!: Subscription[];
  //z-index
  private zIndexes!: string[];
  //コンテンツ
  @ViewChild('main') main!: ElementRef;
  //ToTopボタン表示状態
  showToTop: boolean = false;
  //スクロール処理メソッド
  scrollMethod: (this: HTMLElement, ev: Event) => any = this.onWindowScroll.bind(this);
  constructor(private httpService: HttpService,
    private route: ActivatedRoute, 
    private characterService: CharacterService,
    private calculatorService: CalculatorService,
    private languageService: LanguageService,
    private breakpointObserver: BreakpointObserver,
    private relayoutMsgService: RelayoutMsgService,
    private router: Router,
    private translateService: TranslateService,
    private weaponService: WeaponService,
    private enemyService: EnemyService,
    private artifactService: ArtifactService,
    private otherService: OtherService,
    private teamService: TeamService,
    private DPSService: DPSService,
    private extraInfoService: ExtraInfoService,
    private matDialog: MatDialog,
    private matSnackBar: MatSnackBar,) {
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
    this.zIndexes = [];
    this.childZIndexes = {};
    this.refreshChildZIndexes();
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
      this.scrollBarWidth = 9;
    });
    //初期言語設定
    this.currentLanguage = this.languageService.getCurrentLang();
    //言語変更検知
    this.languageService.getLang().subscribe((lang: TYPE_SYS_LANG) => {
      this.currentLanguage = lang;
    })
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
            maxColumns: 10,
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

  ngAfterViewInit(): void {
    //スクロール監視
    this.registerWindowScroll();
    setTimeout(() => {
      this.otherState = CSS_STATUS_FIN;
    })
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
    //subscriptions監視取り消し
    for(let sub of this.subscriptions){
      if(sub && !(sub?.closed)){
        sub.unsubscribe();
      }
    }
    //スクロール監視取り消し
    this.unregisterWindowScroll();
  }

  //トップへスクロール
  scrollToTop() {
    const parent = this.main.nativeElement.parentElement.parentElement.parentElement;
    parent.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    })
  }

  //キャッシュ削除
  removeCurrentCache() {
    const currentName = this.data.name[this.currentLanguage];
    const contentVal = {'NAME': currentName};
    const data: ConfirmDialogData = {
      title: 'MENU.DELETE_CACHE.TITLE',
      content: 'MENU.DELETE_CACHE.WANRING',
      contentVal: contentVal,
      cancel: 'MENU.DELETE_CACHE.CANCEL',
      ok: 'MENU.DELETE_CACHE.OK',
    }
    const dialogRef = this.matDialog.open(ConfirmDialogComponent, {data})
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if(result){
        //削除
        const indexStr = this.data.id.toString();
        this.characterService.clearStorageInfo(indexStr);
        this.weaponService.clearStorageInfo(indexStr);
        this.enemyService.clearStorageInfo(indexStr);
        this.artifactService.clearStorageInfo(indexStr);
        this.otherService.clearStorageInfo(indexStr);
        this.teamService.clearStorageInfo(indexStr);
        this.DPSService.clearStorageInfo(indexStr);
        this.extraInfoService.clearStorageInfo(indexStr);
        //成功
        this.translateService.get('MENU.DELETE_CACHE.SUCCESS', contentVal).subscribe((res: string) => {
          this.matSnackBar.open(res, undefined, {
            duration: 1500
          })
        });
        //リフレッシュ
        this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
        this.router.navigate([Const.MENU_CHARACTER], {queryParams: {index: this.data.id}, skipLocationChange: true}));
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
      // this.backgroundLoadFlg = false;
      let url = this.data.images.background;
      if (url) {
        this.httpService.get<Blob>(url, 'blob', true, false).then((v: Blob | null) => {
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

  onWindowScroll() {
    const parent = this.main.nativeElement.parentElement.parentElement.parentElement as HTMLElement;
    if (parent.scrollTop > 20) {
      this.showToTop = true;
    } else {
      this.showToTop = false;
    }
  }

  registerWindowScroll() {
    const parent = this.main.nativeElement.parentElement.parentElement.parentElement as HTMLElement;
    parent.addEventListener('scroll', this.scrollMethod);
  }

  unregisterWindowScroll() {
    const parent = this.main.nativeElement.parentElement.parentElement.parentElement as HTMLElement;
    parent.removeEventListener('scroll', this.scrollMethod);
  }

  onChildStartDrag(name: string){
    if(this.childNameMap[name] != this.zIndexes[this.zIndexes.length-1]){
      this.zIndexes.push(this.childNameMap[name]);
      this.refreshChildZIndexes();
    }
  }

  refreshChildZIndexes(){
    for(let key of this.childNames){
      this.childZIndexes[key] = (this.zIndexes.lastIndexOf(key) + 1);
    }
  }

  reLayout(){
    if(this.magicGrid?.ready()){
      this.magicGrid.positionItems();
    }
  }
}
