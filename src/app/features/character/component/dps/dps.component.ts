import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {TranslateService} from '@ngx-translate/core';
import {Subscription} from 'rxjs';
import {
  ArtifactService,
  CalculatorService,
  character,
  CharacterService,
  CharSkill,
  CharSkills,
  Const,
  DamageResult,
  DmgInfo,
  DPSService,
  DPSStorageInfo,
  ExpansionPanelCommon,
  RelayoutMsgService,
  TextInputDialogComponent,
  TextInputDialogData,
  TextInputDialogResult,
  TYPE_SPECIAL_DAMAGE_TYPE,
  TYPE_SYS_LANG,
  WeaponService,
} from 'src/app/shared/shared.module';
import {environment} from 'src/environments/environment';

interface DamageInfo {
  name: string;
  skillIndex?: number;
  index: number;
  rate: string;
  elementType: string;
  attackType: string;
  resultProp: keyof DamageResult;
  results: DamageResult;
  times: number;
  tag?: string;
  isAbsoluteDmg?: boolean;
  specialDamageType?: TYPE_SPECIAL_DAMAGE_TYPE;
  iconSrc: string;
  iconBGColor: string;
}
@Component({
  selector: 'app-dps',
  templateUrl: './dps.component.html',
  styleUrls: ['./dps.component.css'],
})
export class DpsComponent extends ExpansionPanelCommon implements OnInit, OnDestroy {
  readonly elementColorMap: Record<string, string> = {
    [Const.PROP_DMG_BONUS_CRYO]: Const.ELEMENT_COLOR_MAP['CRYO'] + environment.elementColorAlpha,
    [Const.PROP_DMG_BONUS_ANEMO]: Const.ELEMENT_COLOR_MAP['ANEMO'] + environment.elementColorAlpha,
    [Const.PROP_DMG_BONUS_PHYSICAL]:
      Const.ELEMENT_COLOR_MAP['PHYSICAL'] + environment.elementColorAlpha,
    [Const.PROP_DMG_BONUS_ELECTRO]:
      Const.ELEMENT_COLOR_MAP['ELECTRO'] + environment.elementColorAlpha,
    [Const.PROP_DMG_BONUS_GEO]: Const.ELEMENT_COLOR_MAP['GEO'] + environment.elementColorAlpha,
    [Const.PROP_DMG_BONUS_PYRO]: Const.ELEMENT_COLOR_MAP['PYRO'] + environment.elementColorAlpha,
    [Const.PROP_DMG_BONUS_HYDRO]: Const.ELEMENT_COLOR_MAP['HYDRO'] + environment.elementColorAlpha,
    [Const.PROP_DMG_BONUS_DENDRO]:
      Const.ELEMENT_COLOR_MAP['DENDRO'] + environment.elementColorAlpha,
  };

  readonly specialColorMap: Record<string, string | undefined> = {
    'overloadedDmg': this.elementColorMap[Const.PROP_DMG_BONUS_PYRO],
    'burningDmg': this.elementColorMap[Const.PROP_DMG_BONUS_PYRO],
    'electroChargedDmg': this.elementColorMap[Const.PROP_DMG_BONUS_ELECTRO],
    'superconductDmg': this.elementColorMap[Const.PROP_DMG_BONUS_CRYO],
    'swirlCryoDmg': this.elementColorMap[Const.PROP_DMG_BONUS_CRYO],
    'swirlElectroDmg': this.elementColorMap[Const.PROP_DMG_BONUS_ELECTRO],
    'swirlElectroAggravateDmg': this.elementColorMap[Const.PROP_DMG_BONUS_ELECTRO],
    'swirlPyroDmg': this.elementColorMap[Const.PROP_DMG_BONUS_PYRO],
    'swirlHydroDmg': this.elementColorMap[Const.PROP_DMG_BONUS_HYDRO],
    'shieldHp': this.elementColorMap[Const.PROP_DMG_BONUS_GEO],
    'destructionDmg': this.elementColorMap[Const.PROP_DMG_BONUS_PHYSICAL],
    'ruptureDmg': this.elementColorMap[Const.PROP_DMG_BONUS_DENDRO],
    'burgeonDmg': this.elementColorMap[Const.PROP_DMG_BONUS_DENDRO],
    'hyperbloomDmg': this.elementColorMap[Const.PROP_DMG_BONUS_DENDRO],

    'healing': '#91ffa3' + environment.elementColorAlpha,
    'product': '#91ffa3' + environment.elementColorAlpha,
    'shield': this.elementColorMap[Const.PROP_DMG_BONUS_GEO],

    'originMoonElectroChargedDirectlyDmg': this.elementColorMap[Const.ELEMENT_MOON_ELECTROCHARGED],
    'cirtMoonElectroChargedDirectlyDmg': this.elementColorMap[Const.ELEMENT_MOON_ELECTROCHARGED],
    'expectMoonElectroChargedDirectlyDmg': this.elementColorMap[Const.ELEMENT_MOON_ELECTROCHARGED],
    'originMoonElectroChargedReactionalDmg':
      this.elementColorMap[Const.ELEMENT_MOON_ELECTROCHARGED],
    'cirtMoonElectroChargedReactionalDmg': this.elementColorMap[Const.ELEMENT_MOON_ELECTROCHARGED],
    'expectMoonElectroChargedReactionalDmg':
      this.elementColorMap[Const.ELEMENT_MOON_ELECTROCHARGED],
  };

  readonly damageTypeMap: Map<string, string[]> = Const.PROPS_OPTIMAL_DAMAGE_TYPE_LIST_MAP;
  readonly damageTypeAbsMap: Map<string, string[]> = Const.PROPS_OPTIMAL_DAMAGE_TYPE_LIST_ABS_MAP;

  readonly damageTypeNameMap: Record<string, string> = {
    'originDmg': 'ORIGIN',
    'critDmg': 'CRIT',
    'expectDmg': 'EXPECT',
    'originVaporizeDmg': 'ORIGIN_VAPORIZE',
    'cirtVaporizeDmg': 'CRIT_VAPORIZE',
    'expectVaporizeDmg': 'EXPECT_VAPORIZE',
    'originMeltDmg': 'ORIGIN_MELT',
    'cirtMeltDmg': 'CRIT_MELT',
    'expectMeltDmg': 'EXPECT_MELT',
    'originAggravateDmg': 'ORIGIN_AGGRAVATE',
    'cirtAggravateDmg': 'CRIT_AGGRAVATE',
    'expectAggravateDmg': 'EXPECT_AGGRAVATE',
    'originSpreadDmg': 'ORIGIN_SPREAD',
    'cirtSpreadDmg': 'CRIT_SPREAD',
    'expectSpreadDmg': 'EXPECT_SPREAD',
    'overloadedDmg': 'OVERLOADED',
    'burningDmg': 'BURNING',
    'electroChargedDmg': 'ELECTROCHARGED',
    'superconductDmg': 'SUPERCONDUCT',
    'ruptureDmg': 'RUPTURE',
    'burgeonDmg': 'BURGEON',
    'hyperbloomDmg': 'HYPERBLOOM',
    'swirlCryoDmg': 'SWIRL_CRYO',
    'swirlElectroDmg': 'SWIRL_ELECTRO',
    'swirlElectroAggravateDmg': 'SWIRL_ELECTRO_AGGRAVATE',
    'swirlPyroDmg': 'SWIRL_PYRO',
    'swirlHydroDmg': 'SWIRL_HYDRO',
    'shieldHp': 'SHIELD',
    'destructionDmg': 'DESTRUCTION',

    'healing': 'HEALING',
    'product': 'PRODUCT',
    'shield': 'SHIELD',

    'originMoonElectroChargedDirectlyDmg': 'ORIGIN_MOON_ELECTROCHARGED_DIRECTLY',
    'cirtMoonElectroChargedDirectlyDmg': 'CRIT_MOON_ELECTROCHARGED_DIRECTLY',
    'expectMoonElectroChargedDirectlyDmg': 'EXPECT_MOON_ELECTROCHARGED_DIRECTLY',
    'originMoonElectroChargedReactionalDmg': 'ORIGIN_MOON_ELECTROCHARGED_REACTIONAL',
    'cirtMoonElectroChargedReactionalDmg': 'CRIT_MOON_ELECTROCHARGED_REACTIONAL',
    'expectMoonElectroChargedReactionalDmg': 'EXPECT_MOON_ELECTROCHARGED_REACTIONAL',
  };

  readonly dmgFromName: Record<string, string> = {
    [Const.NAME_SKILLS_NORMAL]: 'SKILL_A_NAME',
    [Const.NAME_SKILLS_SKILL]: 'SKILL_E_NAME',
    [Const.NAME_SKILLS_ELEMENTAL_BURST]: 'SKILL_Q_NAME',
    [Const.NAME_SKILLS_OTHER]: 'SKILL_X_NAME',
    [Const.NAME_SKILLS_PROUD + '0']: 'PROUND_1_NAME',
    [Const.NAME_SKILLS_PROUD + '1']: 'PROUND_2_NAME',
    [Const.NAME_SKILLS_PROUD + '2']: 'PROUND_3_NAME',
    [Const.NAME_CONSTELLATION + '0']: 'CONSTELLATION_1_NAME',
    [Const.NAME_CONSTELLATION + '1']: 'CONSTELLATION_2_NAME',
    [Const.NAME_CONSTELLATION + '2']: 'CONSTELLATION_3_NAME',
    [Const.NAME_CONSTELLATION + '3']: 'CONSTELLATION_4_NAME',
    [Const.NAME_CONSTELLATION + '4']: 'CONSTELLATION_5_NAME',
    [Const.NAME_CONSTELLATION + '5']: 'CONSTELLATION_6_NAME',
    [Const.NAME_EFFECT]: 'WEAPON_NAME',
    [Const.NAME_SET + '1']: 'ARTIFACT_NAME',
    [Const.NAME_SET + '2']: 'ARTIFACT_NAME',
  };

  readonly skillCodeKeyMap: Map<string, string> = new Map([
    [Const.NAME_SKILLS_NORMAL, 'A'],
    [Const.NAME_SKILLS_SKILL, 'E'],
    [Const.NAME_SKILLS_ELEMENTAL_BURST, 'Q'],
    [Const.NAME_SKILLS_OTHER, 'X'],
    [Const.NAME_SKILLS_PROUD, 'T'],
    [Const.NAME_CONSTELLATION, 'C'],
    [Const.NAME_EFFECT, 'W'],
    [Const.NAME_SET, 'S'],
  ]);

  readonly skillCodeKeyReverseMap: Map<string, string> = (() => {
    const tempMap = new Map<string, string>();
    this.skillCodeKeyMap.forEach((v: string, k: string) => {
      tempMap.set(v, k);
    });
    return tempMap;
  })();

  readonly areaSplitChar = '|';
  readonly listSplit = '>';
  readonly skillInfoSplit = '#';
  readonly valusSplit = ',';

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

  //タブ
  tabs: string[] = [];
  //選択されたインデックス
  selectedIndex!: number;
  //全情報
  infos!: DPSStorageInfo[];
  //元素付与変更検知
  elementChangedSub!: Subscription;
  //データ変更検知
  dataChangedSub!: Subscription;
  //データ追加検知
  dataAppendChangedSub!: Subscription;
  //DPSタイム
  showDurationValue!: number;
  //DPSタグ
  showOutlineValue!: string;
  //DPSコード
  showDPSCodeValue!: string;
  //元素付与
  overrideElement!: string;
  //DPS
  dps!: string;
  //DPSカラー
  dpsBGColor!: string;

  //画面表示するダメージ情報リスト
  damageInfos!: DamageInfo[];

  constructor(
    private DPSService: DPSService,
    private calculatorService: CalculatorService,
    private translateService: TranslateService,
    private characterService: CharacterService,
    private weaponService: WeaponService,
    private artifactService: ArtifactService,
    private relayoutMsgService: RelayoutMsgService,
    private matSnackBar: MatSnackBar,
    private matDialog: MatDialog,
  ) {
    super(relayoutMsgService);
  }

  ngOnInit(): void {
    //DPSカラー設定
    this.dpsBGColor =
      Const.ELEMENT_COLOR_MAP[Const.ELEMENT_TYPE_MAP.get(this.data.info.elementType)!] +
      environment.elementColorAlpha;
    //タブリスト初期化
    let length = this.DPSService.getStorageInfoLength(this.data.id);
    if (length == undefined || length == 0) {
      length = 1;
    }
    this.tabs = Array.from({length: length}).map((_, i) => `${i}`);
    //選択中インデックス
    this.selectedIndex = this.DPSService.getStorageSelectedIndex(this.data.id);
    //元素付与初期化
    this.overrideElement = this.characterService.getOverrideElement(this.data.id);
    //情報初期化
    this.initInfos();
    this.updateDatas();
    this.updateShowValue();
    //元素付与更新
    this.elementChangedSub = this.characterService.getOverrideElementChanged().subscribe(() => {
      //元素付与更新
      this.overrideElement = this.characterService.getOverrideElement(this.data.id);
      setTimeout(() => {
        //再計算
        this.updateDatas();
        this.calcCode();
      });
    });
    //データ更新
    this.dataChangedSub = this.calculatorService.changed().subscribe((v: boolean) => {
      if (v) {
        //再計算
        this.updateDatas();
        this.calcCode();
      }
    });
    //データ追加
    this.dataAppendChangedSub = this.DPSService.changed().subscribe(() => {
      //再計算
      this.updateDatas();
      this.calcCode();
    });
  }

  @HostListener('window:unload')
  ngOnDestroy(): void {
    //データ保存
    this.DPSService.saveData();
    //検知停止
    this.elementChangedSub.unsubscribe();
    this.dataChangedSub.unsubscribe();
    this.dataAppendChangedSub.unsubscribe();
  }

  addTab() {
    this.DPSService.addStorageInfo(this.data.id);
    this.localAddTab();
    this.setSelectedIndex();
  }

  copyTab() {
    this.DPSService.copyAndCreateStorageInfo(this.data.id, this.selectedIndex);
    this.localAddTab();
    this.setSelectedIndex();
  }

  addCodeTab() {
    const characterIndex = this.data.id.toString();
    const contentVal = {'CHAR_ID': characterIndex};
    const data: TextInputDialogData = {
      title: 'DPS.IMPORT_DIALOG.TITLE',
      content: 'DPS.IMPORT_DIALOG.CONTENT',
      contentVal: contentVal,
      inputLabel: 'DPS.CODE',
      cancel: 'DPS.IMPORT_DIALOG.CANCEL',
      ok: 'DPS.IMPORT_DIALOG.OK',
    };
    const dialogRef = this.matDialog.open(TextInputDialogComponent, {data});
    dialogRef.afterClosed().subscribe((result: TextInputDialogResult) => {
      if (result.isOk) {
        const code = result.value;
        const [info, ok] = this.importCode(code);
        if (!ok || info === null) {
          //失敗
          this.translateService.get('DPS.IMPORT_DIALOG.FAILED').subscribe((res: string) => {
            this.matSnackBar.open(res, undefined, {
              duration: 500,
            });
          });
        } else {
          this.DPSService.addStorageInfo(this.data.id);
          const currentStorageIndex = this.infos.length - 1;
          this.infos[currentStorageIndex].dmgs = info.dmgs;
          this.infos[currentStorageIndex].duration = info.duration;
          this.infos[currentStorageIndex].outline = info.outline;
          this.localAddTab();
          this.setSelectedIndex();
          //成功
          this.translateService.get('DPS.IMPORT_DIALOG.SUCCESS').subscribe((res: string) => {
            this.matSnackBar.open(res, undefined, {
              duration: 500,
            });
          });
        }
      }
    });
  }

  removeTab(index: number) {
    this.tabs.splice(index, 1);
    this.DPSService.deleteStorageInfo(this.data.id, index);
    if (this.selectedIndex >= index) {
      let toSetIndex = this.tabs.length - 1;
      this.selectedIndex = toSetIndex > 0 ? toSetIndex : 0;
    } else {
      this.selectedIndex = 0;
    }
    this.setSelectedIndex();
  }

  removeItem(index: number) {
    this.infos[this.selectedIndex].dmgs.splice(index, 1);
    this.damageInfos.splice(index, 1);
    this.calcDPS();
    this.calcCode();
  }

  changeProp(index: number, prop: keyof DamageResult) {
    this.infos[this.selectedIndex].dmgs[index].damageProp = prop;
    this.damageInfos[index].resultProp = prop;
    this.calcDPS();
    this.calcCode();
  }

  onTabChanged() {
    this.setSelectedIndex();
  }

  setSelectedIndex() {
    this.DPSService.setStorageSelectedIndex(this.data.id, this.selectedIndex);
    this.updateShowValue();
    this.updateDatas();
  }

  //ドラッグ開始
  onDrag() {
    this.draged.emit(this.name);
  }

  onDurationValueKeyup(event: KeyboardEvent) {
    let originValue = (event.target as HTMLInputElement).value;
    let value = parseFloat(originValue);
    if (isNaN(value)) {
      value = 1;
    }
    this.infos[this.selectedIndex].duration = value;
    this.calcDPS();
    this.calcCode();
  }

  onOutlineValueKeyup(event: KeyboardEvent) {
    let originValue = (event.target as HTMLInputElement).value;
    this.infos[this.selectedIndex].outline = originValue;
    this.calcCode();
  }

  onTimesValueKeyup(index: number, event: KeyboardEvent) {
    let originValue = (event.target as HTMLInputElement).value;
    let value = parseFloat(originValue);
    if (isNaN(value) || value < 0) {
      value = 0;
    }
    this.infos[this.selectedIndex].dmgs[index].times = value;
    this.calcDPS();
    this.calcCode();
  }

  copyCode() {
    navigator.clipboard.writeText(this.showDPSCodeValue).then(() => {
      this.translateService.get('DPS.COPIED').subscribe((res: string) => {
        this.matSnackBar.open(res, undefined, {
          duration: 500,
        });
      });
    });
  }

  private localAddTab() {
    this.tabs.push((this.tabs.length + 1).toString());
    this.selectedIndex = this.tabs.length - 1;
  }

  private updateShowValue() {
    let durationValue = this.infos[this.selectedIndex].duration;
    this.showDurationValue = parseFloat(durationValue.toFixed(8));
    this.showOutlineValue = this.infos[this.selectedIndex].outline ?? '';
    this.calcCode();
  }

  private initInfos() {
    this.infos = this.DPSService.getStorageInfos(this.data.id);
  }

  private updateDatas() {
    this.damageInfos = [];
    const badDmgInfoIndexes = [];
    for (let [i, dmg] of this.infos[this.selectedIndex].dmgs.entries()) {
      const skill = dmg.skill;
      const valueIndexes = dmg.valueIndexes;
      const resultIndex = dmg.resultIndex;
      const skillIndex = dmg.skillIndex;
      const times = dmg.times ?? 1;
      let overrideElement = '';
      if (skill === Const.NAME_SKILLS_NORMAL) {
        overrideElement = this.overrideElement;
      }
      const dmgValues = this.calculatorService.getSkillDmgValue(
        this.data.id,
        skill,
        valueIndexes,
        overrideElement,
        skillIndex,
      );
      const dmgResult = dmgValues[0][resultIndex];
      const dmgParam = dmgValues[1][resultIndex];
      const hasHiddenResult = dmgValues[0].length > 1;
      const damageProp = dmg.damageProp;
      if (dmgResult === undefined || dmgParam === undefined) {
        badDmgInfoIndexes.push(i);
        continue;
      }
      let iconSrc = '';
      let iconBGColor =
        Const.SKILL_ICON_GRADIENT[0] +
        Const.ELEMENT_COLOR_MAP[Const.ELEMENT_BONUS_TYPE_MAP.get(dmgParam.elementBonusType)!] +
        Const.SKILL_ICON_GRADIENT[1];
      switch (skill) {
        case Const.NAME_SKILLS_NORMAL:
        case Const.NAME_SKILLS_SKILL:
        case Const.NAME_SKILLS_ELEMENTAL_BURST:
        case Const.NAME_SKILLS_OTHER:
          iconSrc = (this.data.skills![skill as keyof CharSkills] as CharSkill).images.icon;
          break;
        case Const.NAME_SKILLS_PROUD:
          iconSrc = (this.data.skills![skill as keyof CharSkills] as CharSkill[])[skillIndex!]
            .images.icon;
          break;
        case Const.NAME_CONSTELLATION:
          iconSrc = this.data.skills!.talents[skillIndex!].images.icon;
          break;
        case Const.NAME_EFFECT: {
          const weapon = this.weaponService.get(this.weaponService.getIndex(this.data.id)!);
          iconSrc = weapon.images.icon;
          iconBGColor = '';
          break;
        }
        case Const.NAME_SET: {
          const set = this.artifactService.get(
            this.artifactService.getStorageFullSetIndex(this.data.id)!,
          );
          iconSrc = set.images.icon;
          iconBGColor = '';
          break;
        }
      }
      this.damageInfos.push({
        name: skill,
        skillIndex: skillIndex,
        index: hasHiddenResult ? resultIndex + 1 : valueIndexes[resultIndex] + 1,
        rate: dmgParam.rateAttach.reduce(
          (pre: string, cur: number[]) => {
            return (
              pre +
              ' + ' +
              cur.reduce((pre1: string, cur1: number) => {
                return pre1 + (pre1.length > 0 ? ' + ' : '') + (cur1 * 100).toFixed(1) + '%';
              }, '')
            );
          },
          (dmgParam.rate * 100).toFixed(1) + '%',
        ),
        elementType: dmgParam.elementBonusType,
        attackType: dmgParam.attackBonusType,
        resultProp: damageProp,
        results: dmgResult,
        times: times,
        tag: dmgParam.tag,
        isAbsoluteDmg: dmgParam.isAbsoluteDmg,
        specialDamageType: dmgParam.specialDamageType,
        iconSrc: iconSrc,
        iconBGColor: iconBGColor,
      });
    }
    badDmgInfoIndexes.reverse().forEach((value: number) => {
      this.infos[this.selectedIndex].dmgs.splice(value, 1);
    });
    this.calcDPS();
  }

  private calcDPS() {
    this.dps = (
      this.damageInfos.reduce((pre: number, cur: DamageInfo) => {
        let tempVal = cur.results[cur.resultProp] as number;
        if (isNaN(tempVal)) {
          tempVal = 0;
        }
        return pre + tempVal * cur.times;
      }, 0) / this.infos[this.selectedIndex].duration
    ).toFixed(2);

    this.onExpandStatusChanged();
  }

  private calcCode() {
    const areaSplitChar = this.areaSplitChar;
    const listSplit = this.listSplit;
    const skillInfoSplit = this.skillInfoSplit;
    const valusSplit = this.valusSplit;

    const characterId = this.data.id.toString();
    const outline = encodeURI(this.showOutlineValue ?? '');
    const duration = this.showDurationValue.toString();
    const data = this.infos[this.selectedIndex].dmgs.reduce(
      (previousValue: string, info: DmgInfo) => {
        const skillIndex = info.skillIndex?.toString() ?? '';
        const indexOffset = this.getIndexOffset(info.skill);
        const hasSkillIndex = skillIndex.length > 0;
        const skillCode =
          this.skillCodeKeyMap.get(info.skill)! +
          (hasSkillIndex ? info.skillIndex! + indexOffset : '');
        const valueIndexes = info.valueIndexes.join(valusSplit);
        const resultIndex = info.resultIndex.toString();
        const damageProp = info.damageProp.toString();
        const times = info.times?.toString() ?? '1';
        const temp = [skillCode, valueIndexes, resultIndex, damageProp, times].join(skillInfoSplit);

        return previousValue + listSplit + temp;
      },
      '',
    );

    this.showDPSCodeValue = [characterId, outline, duration, data].join(areaSplitChar);
  }

  private importCode(code: string): [DPSStorageInfo | null, boolean] {
    const areaSplitChar = this.areaSplitChar;
    const listSplit = this.listSplit;
    const skillInfoSplit = this.skillInfoSplit;
    const valusSplit = this.valusSplit;

    try {
      switch (true) {
        default: {
          if (!code) {
            break;
          }
          const vals = code
            .trim()
            .replace(/[\n\s]/g, '')
            .split(areaSplitChar);
          if (vals.length !== 4) {
            break;
          }
          const characterId = vals[0];
          const outline = decodeURI(vals[1]);
          const duration = parseFloat(vals[2]) || 1;
          const infos = vals[3];
          if (characterId !== this.data.id.toString()) {
            break;
          }

          const skillInfo = infos.split(listSplit);
          const skillRes = [];
          for (let i = 1; i < skillInfo.length; ++i) {
            const tempParts = skillInfo[i].split(skillInfoSplit);
            if (tempParts.length === 5) {
              const originSkillCode = tempParts[0];
              const tempSkillCode = originSkillCode.substring(0, 1);
              const tempSkill = this.skillCodeKeyReverseMap.get(tempSkillCode);
              if (!tempSkill) {
                continue;
              }
              let tempSkillIndex: number | undefined =
                parseInt(originSkillCode.substring(1)) - this.getIndexOffset(tempSkill);
              if (isNaN(tempSkillIndex)) {
                tempSkillIndex = undefined;
              }
              const tempValueIndexesStr = tempParts[1];
              const tempValueIndexes = tempValueIndexesStr.split(valusSplit).map((v: string) => {
                return parseInt(v) || 0;
              });
              let tempResultIndex = parseInt(tempParts[2]);
              if (isNaN(tempResultIndex)) {
                tempResultIndex = 0;
              }
              const tempDamageProp = tempParts[3] as keyof DamageResult;
              let tempTimes = parseFloat(tempParts[4]);
              if (isNaN(tempTimes)) {
                tempTimes = 1;
              }

              const tempDmgInfo = {
                skill: tempSkill,
                valueIndexes: tempValueIndexes,
                resultIndex: tempResultIndex,
                skillIndex: tempSkillIndex,
                damageProp: tempDamageProp,
                times: tempTimes,
              } as DmgInfo;

              skillRes.push(tempDmgInfo);
            }
          }

          return [
            {
              dmgs: skillRes,
              duration,
              outline,
            } as DPSStorageInfo,
            true,
          ];
        }
      }
      //失敗
      return [null, false];
    } catch {
      //失敗
      return [null, false];
    }
  }

  private getIndexOffset(skillName: string) {
    let indexOffset = 1;
    if (Const.NAME_SET === skillName) {
      indexOffset = 0;
    }
    return indexOffset;
  }
}
