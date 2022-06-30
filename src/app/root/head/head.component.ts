import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { ProgressBarMode } from '@angular/material/progress-bar';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { GlobalProgressService, LangInfo } from 'src/app/shared/shared.module';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-head',
  templateUrl: './head.component.html',
  styleUrls: ['./head.component.css'],
})
export class HeadComponent implements OnInit {
  readonly githubRepository = environment.githubRepository;

  //言語リスト
  @Input('langs') langs!: LangInfo[];
  //キャプチャーするエレメント
  @Input('captureElement') captureElement!: ElementRef;
  //言語選択イベント
  @Output('langSelectEvent') langSelectEvent = new EventEmitter<LangInfo>();
  //メニューボタン押下イベント
  @Output('menuButtonClickEvent') menuButtonClickEvent =
    new EventEmitter<void>();

  progressMode!: Observable<ProgressBarMode>;
  progressValue!: Observable<number>;
  progressBufferValue!: Observable<number>;

  constructor(
    private translate: TranslateService,
    private globalProgressService: GlobalProgressService,
    private router: Router,
  ) {
    this.progressMode = this.globalProgressService.getMode();
    this.progressValue = this.globalProgressService.getValue();
    this.progressBufferValue = this.globalProgressService.getBufferValue();
  }

  ngOnInit() {}

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
   * ホームページに戻す
   */
  onClickTitle(){
    this.router.navigate(['']);
  }
}
