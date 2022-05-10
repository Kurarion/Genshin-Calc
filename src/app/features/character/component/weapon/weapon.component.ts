import { Component, Input, OnInit } from '@angular/core';
import { weapon, CharStatus, Const, HttpService, LanguageService, TYPE_SYS_LANG, WeaponService, WeaponStatus } from 'src/app/shared/shared.module';

interface levelOption {
  level: number;
  isAscend?: boolean;
}

interface subProp {
  isPercent: boolean;
  value: any;
}

interface weaponOption {
  queryName: string;
  name: string;
  rarity: number;
  weaponType: string;
}

@Component({
  selector: 'app-weapon',
  templateUrl: './weapon.component.html',
  styleUrls: ['./weapon.component.css']
})
export class WeaponComponent implements OnInit {

  private readonly notExitLevel = -1;
  private readonly minLevel = 1;
  private readonly maxLevel = 90;
  private readonly ascendLevels = [20, 40, 50, 60, 70, 80, 90];
  private readonly ascendLevelsMap: Record<number, number> = {
    5: 6,
    4: 6,
    3: 6,
    2: 4,
    1: 4,
  }

  readonly props = ['LEVEL', 'ATTACK'];
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

  @Input('charWeaponType') charWeaponType!: string;
  weaponList: weaponOption[] = [];
  selectedWeaponKey!: string;
  selectedWeaponAbleMaxLevel!: number;

  data!: weapon;
  dataForCal!: weapon;
  avatarURL!: string;
  avatarLoadFlg!: boolean;

  levelOptions: levelOption[] = [];

  selectedLevel!: levelOption;
  selectedLevelProps!: Record<string, subProp>;

  constructor(private httpService: HttpService, private weaponService: WeaponService, private languageService: LanguageService) {
    this.languageService.getLang().subscribe((lang: TYPE_SYS_LANG) => {
      //武器リスト再設定
      this.initializeWeaponList();
      //選択された武器データ更新
      if (this.selectedWeaponKey) {
        this.data = this.weaponService.get(this.selectedWeaponKey, lang);
      }
    })
  }

  ngOnInit(): void {
    //武器リスト初期化
    this.initializeWeaponList();
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
    //武器初期選択
    for (let i = 1; i < this.weaponList.length; ++i) {
      if (this.weaponList[i].weaponType == this.charWeaponType && this.weaponList[i].rarity == 5) {
        this.selectedWeaponKey = this.weaponList[i].queryName;
        break;
      }
    }
    //レベル初期選択
    this.selectedLevel = this.levelOptions[this.levelOptions.length - 1];
    //初期データ更新
    this.onSelectWeapon(this.selectedWeaponKey);
  }

  onSelectWeapon(weaponKey: string) {
    let oldWeaponAbleMaxLevel = this.notExitLevel;
    if (this.data) {
      //旧武器最高レベル
      oldWeaponAbleMaxLevel = this.ascendLevels[this.ascendLevelsMap[this.data.rarity]];
    }
    //武器の切り替え
    this.data = this.weaponService.get(weaponKey);
    this.dataForCal = this.weaponService.get(weaponKey, Const.QUERY_LANG);
    //武器最高レベル
    this.selectedWeaponAbleMaxLevel = this.ascendLevels[this.ascendLevelsMap[this.data.rarity]];
    if (oldWeaponAbleMaxLevel == this.notExitLevel || oldWeaponAbleMaxLevel == this.selectedLevel.level || this.selectedLevel.level > this.selectedWeaponAbleMaxLevel) {
      this.selectedLevel = this.levelOptions[this.selectedWeaponAbleMaxLevel + this.ascendLevels.indexOf(this.selectedWeaponAbleMaxLevel) - 1];
    }
    //武器属性更新
    this.onChangeLevel(this.selectedLevel);
    //プロフィール画像初期化
    this.initializeBackGroundImage();
  }

  onChangeLevel(value: levelOption) {
    this.selectedLevelProps = {};
    let temp = this.dataForCal.stats(value.level, value.isAscend ? '+' : undefined);
    for (let propName of this.props) {
      this.selectedLevelProps[propName] = {
        isPercent: false,
        value: temp[propName.toLowerCase() as keyof WeaponStatus],
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
    this.avatarLoadFlg = false;
    this.httpService.get<Blob>(this.data.images.icon, 'blob').then((v: Blob | null) => {
      if (v) {
        this.avatarURL = window.URL.createObjectURL(v);
        setTimeout(() => {
          this.avatarLoadFlg = true;
        }, 100)
      }
    })
  }

  /**
   * 武器選択リスト初期化
   */
  private initializeWeaponList(lang?: TYPE_SYS_LANG) {
    this.weaponList = [];
    this.weaponService.getMap(lang).forEach((value: weapon, key: string) => {
      this.weaponList.push({
        queryName: key,
        name: value.name,
        rarity: value.rarity,
        weaponType: value.weapontype,
      })
    })
  }

}
