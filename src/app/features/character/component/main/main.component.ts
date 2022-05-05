import { Component, OnInit } from '@angular/core';
import { CharacterQueryParam, CharacterService, HttpService } from 'src/app/shared/shared.module';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ActivatedRoute } from '@angular/router';

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

  constructor(private httpService: HttpService, private route: ActivatedRoute, private characterService: CharacterService) { }

  ngOnInit(): void {
    this.route.queryParams
      .subscribe((params: CharacterQueryParam) => {
        this.data = this.characterService.get(params.name!);
        //背景初期化
        this.initializeBackGroundImage();
      }
    );
    console.log(this.data)
  }

  /**
   * 背景初期化
   */
  private initializeBackGroundImage() {
    if (!this.backgroundURL) {
      this.backgroundLoadFlg = false;
      this.httpService.get<Blob>(this.data.images.cover1 ?? this.data.images.portrait, 'blob').then((v: Blob | null) => {
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
