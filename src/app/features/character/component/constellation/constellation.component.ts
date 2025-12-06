import {PercentPipe} from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  character,
  CharSkill,
  Const,
  ExpansionPanelCommon,
  RelayoutMsgService,
  TYPE_SYS_LANG,
} from 'src/app/shared/shared.module';

@Component({
  selector: 'app-constellation',
  templateUrl: './constellation.component.html',
  styleUrls: ['./constellation.component.css'],
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
  @Output() draged = new EventEmitter<string>();
  //アイコンBGカラー
  iconBGColor!: string;

  constructor(private relayoutMsgService: RelayoutMsgService) {
    super(relayoutMsgService, 10);
  }

  ngOnInit(): void {
    //BGカラー設定
    this.iconBGColor =
      Const.SKILL_ICON_GRADIENT[0] +
      Const.ELEMENT_COLOR_MAP[Const.ELEMENT_TYPE_MAP.get(this.data.info.elementType)!] +
      Const.SKILL_ICON_GRADIENT[1];
  }

  //ドラッグ開始
  onDrag() {
    this.draged.emit(this.name);
  }

  /**
   * 获取技能描述，优先使用SpecialDesc，回退到Desc
   * @param skill 技能对象
   * @returns 技能描述文本
   */
  getSkillDescription(skill: any): string {
    const skillObj = skill as CharSkill;
    const currentLang = this.currentLanguage;

    // 优先使用SpecialDesc，如果为空则回退到Desc
    if (skillObj.specialDesc && skillObj.specialDesc[currentLang] && skillObj.specialDesc[currentLang].trim() !== '') {
      return skillObj.specialDesc[currentLang];
    }

    // 回退到原始Desc
    return skillObj.desc && skillObj.desc[currentLang] ? skillObj.desc[currentLang] : '';
  }
}
