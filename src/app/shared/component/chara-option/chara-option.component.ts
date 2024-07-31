import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {CharacterService, CharaInfo, Const, TYPE_SYS_LANG} from 'src/app/shared/shared.module';

@Component({
  selector: 'app-chara-option',
  templateUrl: './chara-option.component.html',
  styleUrls: ['./chara-option.component.css'],
})
export class CharaOptionComponent implements OnInit, OnChanges {
  readonly tempPicUrl = Const.IMG_ON_ERROR;
  readonly tempQualityBG = Const.QUALITY_TEMP_BG;

  @Input('charaInfo') charaInfo!: CharaInfo | undefined;
  @Input('currentLanguage') currentLanguage!: TYPE_SYS_LANG;
  @Input('charaIndex') charaIndex!: string;
  @Input('useIndex') useIndex: boolean = false;
  @Input('onlyPic') onlyPic: boolean = false;

  constructor(private characterService: CharacterService) {}

  ngOnInit(): void {
    if (this.useIndex) {
      if (this.charaIndex && this.charaIndex != '') {
        this.charaInfo = this.getCharaInfo(this.charaIndex);
      } else {
        this.charaInfo = undefined;
      }
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['charaIndex']) {
      this.ngOnInit();
    }
  }

  getCharaInfo(index: string | number): CharaInfo {
    let temp = this.characterService.getCharaInfo(index);
    return temp;
  }
}
