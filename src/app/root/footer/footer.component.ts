import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { GlobalProgressService } from 'src/app/shared/shared.module';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent implements OnInit {

  defalutMsg!: string;
  progressMsg!: Observable<string>;
  progressFlg!: Observable<boolean>;

  constructor(private globalProgressService: GlobalProgressService) {
    this.setDefaultMsg();
    this.progressMsg = this.globalProgressService.getProgressMessage();
    this.progressFlg = this.globalProgressService.getProgressStatus();
  }

  ngOnInit() { }

  private setDefaultMsg(){
    this.defalutMsg = environment.footerMsgs[0];
  }
}
