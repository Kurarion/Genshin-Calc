import { Component, OnInit } from '@angular/core';
import { CharacterService, DBCharacter, HttpService } from 'src/app/shared/shared.module';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  animations: [
    trigger('imgLoad', [
      state('beforeLoad', style({
        opacity: 0.01,
      })),
      state('loaded', style({
        opacity: 0.16,
      })),
      transition('beforeLoad=>loaded, loaded=>beforeLoad', [
        animate('1s')
      ])
    ])
  ]
})
export class MainComponent implements OnInit {

  backgroundURL!: string;
  backgroundLoadFlg!: boolean;
  data!: any;

  constructor(private httpService: HttpService, private router: ActivatedRoute, private characterService: CharacterService) { }

  ngOnInit(): void {
    this.router.queryParamMap

    this.data = this.characterService.get("胡桃");
    console.log(this.data)
    // this.data = DBCharacter.create("hutao", { resultLanguage: 'cn_sim' });
    // console.log(DBCharacter.listNames("liyue", { resultLanguage: 'cn_sim' }))
    // console.log(this.data)
    // console.log(this.data.stats("80"))
    //背景初期化
    this.initializeBackGroundImage();
  }

  /**
   * 背景初期化
   */
  private initializeBackGroundImage() {
    if (!this.backgroundURL) {
      this.backgroundLoadFlg = false;
      this.httpService.get<Blob>(this.data.images.cover1, 'blob').then((v: Blob | null) => {
        if (v) {
          this.backgroundURL = window.URL.createObjectURL(v);
          setTimeout(() => {
            this.backgroundLoadFlg = true;
          }, 100)
        }
      })
    }
  }

}
