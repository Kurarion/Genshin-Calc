import {headerDownloadAnimation, STATE_SHOW, STATE_HIDDEN} from 'src/animation';
import {Component, ElementRef, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ProgressBarMode} from '@angular/material/progress-bar';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {Observable} from 'rxjs';
import {GlobalProgressService, LangInfo} from 'src/app/shared/shared.module';
import {environment} from 'src/environments/environment';

@Component({
  selector: 'app-head',
  templateUrl: './head.component.html',
  styleUrls: ['./head.component.css'],
  animations: [headerDownloadAnimation],
})
export class HeadComponent implements OnInit {
  readonly githubRepository = environment.githubRepository;
  readonly analyticsUrl = environment.analyticsUrl;
  readonly stateShow = STATE_SHOW;
  readonly stateHidden = STATE_HIDDEN;

  //言語リスト
  @Input('langs') langs!: LangInfo[];
  //キャプチャーするエレメント
  @Input('captureElement') captureElement!: ElementRef;
  //タイトル表示フラグ
  @Input('hideTitle') hideTitle!: boolean;
  //言語選択イベント
  @Output() langSelectEvent = new EventEmitter<LangInfo>();
  //メニューボタン押下イベント
  @Output() menuButtonClickEvent = new EventEmitter<void>();

  progressMode!: Observable<ProgressBarMode>;
  progressValue!: Observable<number>;
  progressBufferValue!: Observable<number>;

  showDownload!: boolean;
  private getInstallPop = () => {
    // @ts-ignore
    return window.installPop;
  };

  constructor(
    private translate: TranslateService,
    private globalProgressService: GlobalProgressService,
    private router: Router,
  ) {
    this.progressMode = this.globalProgressService.getMode();
    this.progressValue = this.globalProgressService.getValue();
    this.progressBufferValue = this.globalProgressService.getBufferValue();

    // @ts-ignore
    window.installPopCallBack = () => {
      this.setShowDownload();
    };
  }

  ngOnInit() {
    this.setShowDownload();
  }

  setShowDownload() {
    this.showDownload = this.getInstallPop() !== null && this.getInstallPop() !== undefined;
  }

  /**
   * メニューボタンクリックイベント
   */
  onClickMenu() {
    this.menuButtonClickEvent.emit();
  }

  /**
   * 言語選択イベント
   */
  onClickLang(selected: LangInfo) {
    this.langSelectEvent.emit(selected);
  }

  /**
   * PWAインストール
   */
  async install() {
    if (this.getInstallPop() !== null && this.showDownload !== false) {
      this.getInstallPop().prompt();
      const {outcome} = await this.getInstallPop().userChoice;
      if (outcome === 'accepted') {
        this.showDownload = false;
        window.umami?.track('Download');
      }
    }
  }
}
