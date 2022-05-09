import { Component, Input, OnInit } from '@angular/core';
import { character, HttpService } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-character',
  templateUrl: './character.component.html',
  styleUrls: ['./character.component.css']
})
export class CharacterComponent implements OnInit {

  @Input('data') data!: character;
  @Input('dataForCal') dataForCal!: character;
  avatarURL!: string;
  avatarLoadFlg!: boolean;

  constructor(private httpService: HttpService) { }

  ngOnInit(): void {
    this.initializeBackGroundImage();
  }

  /**
   * プロフィール画像初期化
   */
  private initializeBackGroundImage() {
    if (!this.avatarURL) {
      this.avatarLoadFlg = false;
      this.httpService.get<Blob>(this.data.images['hoyolab-avatar'] ?? this.data.images.icon, 'blob').then((v: Blob | null) => {
        if (v) {
          this.avatarURL = window.URL.createObjectURL(v);
          setTimeout(() => {
            this.avatarLoadFlg = true;
          }, 100)
        }
      })
    }
  }

}
