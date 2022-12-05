import { Component, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ArtifactService, artifactSet, CalculatorService, character, CharacterService, CharaInfo, CharSkills, Const, MemberIndex, OtherService, OtherStorageInfo, SelfTeamBuff, TeamBuff, TeamService, TeamSetStorageInfo, TYPE_SYS_LANG, weapon, WeaponService } from 'src/app/shared/shared.module';

interface memberOption {
  index: string;
  names: Record<TYPE_SYS_LANG, string>;
}

interface MemberInfo {
  data?: character;
  weapon?: weapon;
  artifact?: artifactSet;
  buff?: SelfTeamBuff;
  iconBGColor?: string;
  hasBuff?: boolean;
}

interface TeamSetBuffInfo {
  "1"?: MemberInfo;
  "2"?: MemberInfo;
  "3"?: MemberInfo;
  "4"?: MemberInfo;
}

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit {

  //ループメンバーインデックス
  readonly listIndex: MemberIndex[] = [2,3,4];
  readonly skills: (keyof CharSkills)[] = [
    Const.NAME_SKILLS_NORMAL, 
    Const.NAME_SKILLS_SKILL, 
    Const.NAME_SKILLS_ELEMENTAL_BURST,
    Const.NAME_SKILLS_OTHER,
  ];
  readonly proudSkills: (keyof CharSkills)[] = [Const.NAME_SKILLS_PROUD];
  readonly constellation: (keyof SelfTeamBuff)[] = [Const.NAME_CONSTELLATION];
  readonly constellations: string[] = [
    Const.NAME_CONSTELLATION_1,
    Const.NAME_CONSTELLATION_2,
    Const.NAME_CONSTELLATION_3,
    Const.NAME_CONSTELLATION_4,
    Const.NAME_CONSTELLATION_5,
    Const.NAME_CONSTELLATION_6,
  ];
  readonly skillsBuff: (keyof SelfTeamBuff)[] = [
    Const.NAME_SKILLS_NORMAL, 
    Const.NAME_SKILLS_SKILL, 
    Const.NAME_SKILLS_ELEMENTAL_BURST,
    Const.NAME_SKILLS_OTHER,
  ];
  readonly weapon: (keyof SelfTeamBuff)[] = [
    Const.NAME_EFFECT,
  ];
  readonly artifact: (keyof SelfTeamBuff)[] = [
    Const.NAME_SET,
  ];

  readonly props_all_percent = Const.PROPS_ALL_DATA_PERCENT;

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

  //選択されたメンバーインデックス
  memberIndexes!: TeamSetStorageInfo;
  //メンバー
  memberInfos: TeamSetBuffInfo = {};
  //メンバーリスト
  memberList: memberOption[] = [];

  constructor(
    private teamService: TeamService, 
    private calculatorService: CalculatorService, 
    private translateService: TranslateService,
    private characterService: CharacterService,
    private weaponService: WeaponService,
    private artifactService: ArtifactService,
    ) { }

  ngOnInit(): void {
    //チーム初期化
    this.initTeam();
    this.updateTeamMemberFromStorage();
    //チームリスト初期化
    this.initializeMemberList();
    //更新
    this.updateDatas();
  }
  
  onSelectTeamMember(memberIndex: string, postion: MemberIndex) {
    let isDuplicate = false;
    //重複する場合
    if(memberIndex!=""){
      for(let i of this.listIndex){
        if(i != postion && memberIndex == this.memberIndexes[i]){
          this.teamService.addTeamMemberStorageInfo(this.data.id, i, this.memberIndexes[postion]);
          this.teamService.addTeamMemberStorageInfo(this.data.id, postion, memberIndex);
          isDuplicate = true;
        }
      }
    }
    if(!isDuplicate){
      this.teamService.addTeamMemberStorageInfo(this.data.id, postion, memberIndex);
    }
    this.updateTeamMemberFromStorage();
    //更新
    this.updateDatas();
  }

  @HostListener('window:unload')
  ngOnDestroy(): void {
    //データ保存
    this.teamService.saveData();
  }

  updateDirtyFlag(){
    //更新
    this.calculatorService.setDirtyFlag(this.data.id);
  }

  //ドラッグ開始
  onDrag(){
    this.draged.emit(this.name);
  }

  /**
   * メンバー選択リスト初期化
   */
  private initializeMemberList(lang?: TYPE_SYS_LANG) {
    this.memberList = [];
    let keys = this.characterService.getStorageMapKeys();
    for(let key of keys) {
      if(key == this.data.id.toString()){
        continue;
      }
      let temp: CharaInfo = this.characterService.getCharaInfo(key);
      this.memberList.push(temp);
    }
  }

  private initTeam(){
    this.teamService.addTeamMemberStorageInfo(this.data.id, 1, this.data.id);
  }

  private updateTeamMemberFromStorage() {
    this.memberIndexes = this.teamService.getTeamStorageInfo(this.data.id)!;
  }

  private updateMemberBuffAll(){
    for(let key of this.listIndex){
      this.updateMemberBuff(key);
    }
  }

  private updateMemberBuff(postion: MemberIndex) {
    let index = this.memberIndexes[postion];
    if(!this.memberInfos[postion]){
      this.memberInfos[postion] = {};
    }
    if(index){
      let data = this.characterService.get(index);
      let buff = this.calculatorService.getSelfTeamBuff(index);
      let hasBuff = false;
      this.memberInfos[postion]!.buff = buff;
      this.memberInfos[postion]!.data = data;
      this.memberInfos[postion]!.weapon = this.weaponService.get(this.weaponService.getIndex(data.id)!);
      this.memberInfos[postion]!.artifact = this.artifactService.get(this.artifactService.getStorageFullSetIndex(data.id)!);
      this.memberInfos[postion]!.iconBGColor = 
        Const.SKILL_ICON_GRADIENT[0] + 
        Const.ELEMENT_COLOR_MAP[Const.ELEMENT_TYPE_MAP.get(data.info.elementType)!] +
        Const.SKILL_ICON_GRADIENT[1];
      if(buff){
        for(let key of this.skillsBuff.concat(this.weapon).concat(this.artifact)){
          for(let i of buff[key as keyof SelfTeamBuff] as TeamBuff[]){
            if(i.val && i.val != 0){
              hasBuff = true;
              break;
            }
          }
        }
        for(let v of buff[Const.NAME_SKILLS_PROUD]){
          for(let i of v){
            if(i.val && i.val != 0){
              hasBuff = true;
              break;
            }
          }
        }
        for(let k of this.constellations){
          for(let i of buff[Const.NAME_CONSTELLATION][k]){
            if(i.val && i.val != 0){
              hasBuff = true;
              break;
            }
          }
        }
      }
      this.memberInfos[postion]!.hasBuff = hasBuff;
    }else{
      this.memberInfos[postion] = {};
    }
  }

  private updateDatas(){
    //更新
    this.calculatorService.initExtraTeamBuffData(this.data.id);
    this.updateMemberBuffAll();
    this.calculatorService.initExtraCharacterData(this.data.id);
    this.calculatorService.initExtraWeaponData(this.data.id);
    this.calculatorService.initExtraArtifactSetData(this.data.id);
  }
}
