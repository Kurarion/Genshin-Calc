import { PercentPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { character, Const, ExpansionPanelCommon, RelayoutMsgService, TYPE_SYS_LANG } from 'src/app/shared/shared.module';


@Component({
  selector: 'app-constellation',
  templateUrl: './constellation.component.html',
  styleUrls: ['./constellation.component.css']
})
export class ConstellationComponent extends ExpansionPanelCommon implements OnInit {

  readonly constellationPrefix: string = 'c';
  readonly constellationNum: number[] = [1, 2, 3, 4, 5, 6];

  readonly props = Const.PROPS_CHARA_ENEMY_BASE;
  readonly props_sub = Const.PROPS_CHARA_WEAPON_SUB;
  readonly percent_props = Const.PROPS_CHARA_WEAPON_PERCENT;
  readonly name_constellation = Const.NAME_CONSTELLATION;

  //キャラデータ
  @Input('data') data!: character;
  //言語
  @Input('language') currentLanguage!: TYPE_SYS_LANG;
  //カード横幅
  @Input('cardWidth') cardWidth!: number;
  //Z-index
  @Input('zIndex') zIndex!: number;
  //命名
  @Input('name') name!: string;
  //ドラッグイベント
  @Output('draged') draged = new EventEmitter<string>();
  //アイコンBGカラー
  iconBGColor!: string;

  constructor(private relayoutMsgService: RelayoutMsgService,) { 
    super(relayoutMsgService);
  }

  ngOnInit(): void { 
    //BGカラー設定
    this.iconBGColor = 
    Const.SKILL_ICON_GRADIENT[0] + 
    Const.ELEMENT_COLOR_MAP[Const.ELEMENT_TYPE_MAP.get(this.data.info.elementType)!] +
    Const.SKILL_ICON_GRADIENT[1];
  }

  //ドラッグ開始
  onDrag(){
    this.draged.emit(this.name);
  }
  

}
