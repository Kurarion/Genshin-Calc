import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { GlobalProgressService } from 'src/app/shared/shared.module';
import { environment } from 'src/environments/environment';

const SHOW='1';
const DISAPPEAR='0';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  animations: [
    trigger('contentChange', [
      state(SHOW,  style({ opacity: '1' })),
      state(DISAPPEAR, style({ opacity: '0' })),
      transition(DISAPPEAR + ' <=> ' + SHOW, [
        animate('0.5s')
      ])
    ])
  ]
})
export class FooterComponent implements OnInit {

  defalutMsg!: string;
  progressMsg!: Observable<string>;
  progressFlg!: Observable<boolean>;
  animeState!: string;

  constructor(private globalProgressService: GlobalProgressService) {
    this.setDefaultMsg();
    this.setRandomDefaultMsg();
    this.progressMsg = this.globalProgressService.getProgressMessage();
    this.progressFlg = this.globalProgressService.getProgressStatus();
  }

  ngOnInit() { }

  private setDefaultMsg(){
    this.animeState = DISAPPEAR;
    setTimeout(()=>{
      this.defalutMsg = environment.footerMsgs[0];
      this.animeState = SHOW;
    },500)
  }

  setRandomDefaultMsg(){
    setInterval(()=>{
      this.animeState = DISAPPEAR;
      setTimeout(()=>{
        this.defalutMsg = environment.footerMsgs[Math.floor(Math.random() * (environment.footerMsgs.length - 1) + 1)];
        this.animeState = SHOW;
      },800)
    },5000)
  }
}
