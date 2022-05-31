import { Component, OnDestroy, OnInit } from '@angular/core';
import { character, CharacterQueryParam, CharacterService, Const, HttpService, LanguageService, TYPE_SYS_LANG } from 'src/app/shared/shared.module';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';

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
      transition('beforeLoad=>loaded', [
        animate('1s')
      ]),
      transition('loaded=>beforeLoad', [
        animate('0.2s')
      ])
    ]),
    trigger('otherLoad', [
      state('beforeLoad', style({
        opacity: 0.01,
      })),
      state('loaded', style({
        opacity: 1,
      })),
      transition('beforeLoad=>loaded', [
        animate('0.5s')
      ]),
      transition('loaded=>beforeLoad', [
        animate('0.2s')
      ])
    ])
  ]
})
export class MainComponent implements OnInit, OnDestroy {

  backgroundURL!: string;
  backgroundLoadFlg!: boolean;
  currentCharacterName!: string;
  data!: character;
  dataForCal!: character;

  otherState = 'beforeLoad';

  constructor(private httpService: HttpService, private route: ActivatedRoute, private characterService: CharacterService, private languageService: LanguageService) {
    this.languageService.getLang().subscribe((lang: TYPE_SYS_LANG) => {
      this.data = this.characterService.get(this.currentCharacterName, lang);
      console.log(this.data)
    })

    setTimeout(()=>{
      this.otherState = 'loaded';
    }, 100)
  }

  ngOnInit(): void {
    //test
    let x: Record<string, any> = {} 
    this.characterService.getMap("cn_sim").forEach((v,k,m) =>{
      x[v.name] = {
        background: v.images.cover1 ?? v.images.portrait,
        avatar: v.images['hoyolab-avatar'] ?? v.images.icon
      }
    })
    console.log(x)
    this.route.queryParams
      .subscribe((params: CharacterQueryParam) => {
        //計算用
        this.dataForCal = this.characterService.get(params.name!, Const.QUERY_LANG);
        //表示用
        this.data = this.characterService.get(params.name!);
        //チャラ名固定
        this.currentCharacterName = this.dataForCal.fullname;
        //背景初期化
        this.initializeBackGroundImage();
        console.log(this.data)
      }
      );
  }

  ngOnDestroy(): void {
    this.backgroundLoadFlg = false;
    this.otherState = 'beforeLoad';
  }

  /**
   * 背景初期化
   */
  private initializeBackGroundImage() {
    if (!this.backgroundURL) {
      this.backgroundLoadFlg = false;
      let url = this.data.images.cover1 ?? this.data.images.portrait
      // if (environment.useThirdPartyAPI) {
      //   if (this.data.images.namegachasplash) {
      //     url = environment.thirdPartyAPIHost + this.data.images.namegachasplash + environment.thirdPartyAPIPicType;
      //   } else {
      //     url = '';
      //   }
      // }
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
