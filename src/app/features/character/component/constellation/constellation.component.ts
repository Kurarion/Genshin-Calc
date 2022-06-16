import { PercentPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { character, Const, TYPE_SYS_LANG } from 'src/app/shared/shared.module';


@Component({
  selector: 'app-constellation',
  templateUrl: './constellation.component.html',
  styleUrls: ['./constellation.component.css']
})
export class ConstellationComponent implements OnInit {

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

  constructor() { }

  ngOnInit(): void { }

}
