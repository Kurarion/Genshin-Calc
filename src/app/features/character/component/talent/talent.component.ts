import { PercentPipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NoCommaPipe } from 'src/app/shared/pipe/no-comma.pipe';
import { CalculatorService, character, CharacterService, CharSkill, CharSkillDescObject, CharSkills, Const, ExpansionPanelCommon, RelayoutMsgService, TYPE_SYS_LANG } from 'src/app/shared/shared.module';

interface levelOption {
  level: string;
  levelNum: number;
}

@Component({
  selector: 'app-talent',
  templateUrl: './talent.component.html',
  styleUrls: ['./talent.component.css']
})
export class TalentComponent extends ExpansionPanelCommon implements OnInit {

  private readonly minLevel = 1;
  private readonly maxLevel = 15;
  private readonly defaultLevel = 10;

  readonly skills: (keyof CharSkills)[] = [
    Const.NAME_SKILLS_NORMAL, 
    Const.NAME_SKILLS_SKILL, 
    Const.NAME_SKILLS_ELEMENTAL_BURST,
  ];
  readonly otherSkills: (keyof CharSkills)[] = [Const.NAME_SKILLS_OTHER];
  readonly proudSkills: (keyof CharSkills)[] = [Const.NAME_SKILLS_PROUD];
  readonly levelPadNum = 2;
  
  readonly talentDefaultLevel = Const.NAME_TALENT_DEFAULT_LEVEL;

  readonly props = Const.PROPS_CHARA_ENEMY_BASE;
  readonly props_sub = Const.PROPS_CHARA_WEAPON_SUB;
  readonly percent_props = Const.PROPS_CHARA_WEAPON_PERCENT;

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
  //レベルオプションリスト
  levelOptions: levelOption[] = [];
  //選択されたレベルリスト
  selectedLevels: Record<string, levelOption> = {};
  //アイコンBGカラー
  iconBGColor!: string;

  constructor(
    private characterService: CharacterService,
    private calculatorService: CalculatorService,
    private relayoutMsgService: RelayoutMsgService,) { 
      super(relayoutMsgService);
    }

  ngOnInit(): void {
    //BGカラー設定
    this.iconBGColor = 
    Const.SKILL_ICON_GRADIENT[0] + 
    Const.ELEMENT_COLOR_MAP[Const.ELEMENT_TYPE_MAP.get(this.data.info.elementType)!] +
    Const.SKILL_ICON_GRADIENT[1];
    //レベル初期設定
    for (let i = this.minLevel; i <= this.maxLevel; ++i) {
      this.levelOptions.push({
        level: i.toString().padStart(this.levelPadNum, '0'),
        levelNum: i,
      });
    }
    for (let key of this.skills) {
      //初期選択
      let temp: levelOption;
      switch (key) {
        case Const.NAME_SKILLS_NORMAL:
          temp = this.getLevelFromString(this.characterService.getNormalLevel(this.data.id)) ?? this.levelOptions[this.defaultLevel - 1];
          break;
        case Const.NAME_SKILLS_SKILL:
          temp = this.getLevelFromString(this.characterService.getSkillLevel(this.data.id)) ?? this.levelOptions[this.defaultLevel - 1];
          break;
        case Const.NAME_SKILLS_ELEMENTAL_BURST:
          temp = this.getLevelFromString(this.characterService.getElementalBurstLevel(this.data.id)) ?? this.levelOptions[this.defaultLevel - 1];
          break;
      }
      this.selectedLevels[key] = temp!;
      //初期データ更新
      this.onChangeLevel(key, this.selectedLevels[key], true);
    }
    //スキルレベル初期化
    this.calculatorService.initExtraCharacterData(this.data.id);
  }

  onChangeLevel(propName: string, value: levelOption, withoutInitExtra: boolean = false) {
    switch (propName) {
      case Const.NAME_SKILLS_NORMAL:
        this.characterService.setNormalLevel(this.data.id, value.level);
        break;
      case Const.NAME_SKILLS_SKILL:
        this.characterService.setSkillLevel(this.data.id, value.level);
        break;
      case Const.NAME_SKILLS_ELEMENTAL_BURST:
        this.characterService.setElementalBurstLevel(this.data.id, value.level);
        break;
    }
    if(!withoutInitExtra){
      //更新
      this.calculatorService.initExtraCharacterData(this.data.id);
    }
  }

  //ドラッグ開始
  onDrag(){
    this.draged.emit(this.name);
  }

  private getLevelFromString(level: string | undefined) {
    if (!level) {
      return undefined;
    }

    return this.levelOptions[parseInt(level) - 1];
  }
}
