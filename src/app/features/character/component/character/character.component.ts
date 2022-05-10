import { Component, Input, OnInit } from '@angular/core';
import { character, CharStatus, Const, HttpService } from 'src/app/shared/shared.module';

interface levelOption {
  level: number;
  isAscend?: boolean;
}

interface subProp {
  isPercent: boolean;
  value: any;
}

@Component({
  selector: 'app-character',
  templateUrl: './character.component.html',
  styleUrls: ['./character.component.css']
})
export class CharacterComponent implements OnInit {

  private readonly minLevel = 1;
  private readonly maxLevel = 90;
  private readonly ascendLevels = [20, 40, 50, 60, 70, 80, 90];

  readonly props = ['LEVEL', 'HP', 'ATTACK', 'DEFENSE'];
  readonly props_sub = [
    'HP_UP', 'ATTACK_UP', 'DEFENSE_UP',
    'CRIT_RATE', 'CRIT_DMG', 'ENERGY_RECHARGE',
    'HEALING_BONUS', 'REVERSE_HEALING_BONUS',
    'ELEMENTAL_MASTERY', 'DMG_BONUS_CRYO', 'DMG_BONUS_ANEMO',
    'DMG_BONUS_PHYSICAL', 'DMG_BONUS_ELECTRO', 'DMG_BONUS_GEO',
    'DMG_BONUS_PYRO', 'DMG_BONUS_HYDRO', 'DMG_BONUS_DENDRO',
    'DMG_BONUS_ALL', 'DMG_BONUS_NORMAL', 'DMG_BONUS_CHARGED',
    'DMG_BONUS_PLUNGING', 'DMG_BONUS_SKILL', 'DMG_BONUS_ELEMENTAL_BURST',
  ];
  readonly percent_props = [
    'HP_UP', 'ATTACK_UP', 'DEFENSE_UP',
    'CRIT_RATE', 'CRIT_DMG', 'ENERGY_RECHARGE',
    'HEALING_BONUS', 'REVERSE_HEALING_BONUS', 'DMG_BONUS_CRYO',
    'DMG_BONUS_ANEMO', 'DMG_BONUS_PHYSICAL', 'DMG_BONUS_ELECTRO',
    'DMG_BONUS_GEO', 'DMG_BONUS_PYRO', 'DMG_BONUS_HYDRO',
    'DMG_BONUS_DENDRO', 'DMG_BONUS_ALL', 'DMG_BONUS_NORMAL',
    'DMG_BONUS_CHARGED', 'DMG_BONUS_PLUNGING', 'DMG_BONUS_SKILL',
    'DMG_BONUS_ELEMENTAL_BURST',
  ]

  @Input('data') data!: character;
  @Input('dataForCal') dataForCal!: character;
  avatarURL!: string;
  avatarLoadFlg!: boolean;

  levelOptions: levelOption[] = [];

  selectedLevel!: levelOption;
  selectedLevelProps!: Record<string, subProp>;

  constructor(private httpService: HttpService) { }

  ngOnInit(): void {
    //プロフィール画像初期化
    this.initializeBackGroundImage();
    //その他
    for (let i = this.minLevel; i <= this.maxLevel; ++i) {
      this.levelOptions.push({
        level: i,
      });
      if (this.ascendLevels.includes(i) && i != this.maxLevel) {
        this.levelOptions.push({
          level: i,
          isAscend: true,
        });
      }
    }
    //初期選択
    this.selectedLevel = this.levelOptions[this.levelOptions.length - 1];
    this.onChangeLevel(this.selectedLevel);
  }

  onChangeLevel(value: levelOption) {
    this.selectedLevelProps = {};
    let temp = this.dataForCal.stats(value.level, value.isAscend ? '+' : undefined);
    for (let propName of this.props) {
      this.selectedLevelProps[propName] = {
        isPercent: false,
        value: temp[propName.toLowerCase() as keyof CharStatus],
      }
    }
    //スペシャル
    if (this.dataForCal.substat) {
      const key = Const.MAP_PROPS_SPECIALIZED[this.dataForCal.substat];
      this.selectedLevelProps[key] = {
        isPercent: this.percent_props.includes(key),
        value: temp.specialized,
      }
    }
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
