import { Component, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CalculatorService, character, CharacterService, CharaInfo, Const, MemberIndex, OtherService, OtherStorageInfo, TeamService, TeamSetStorageInfo, TYPE_SYS_LANG } from 'src/app/shared/shared.module';

interface memberOption {
  index: string;
  names: Record<TYPE_SYS_LANG, string>;
}

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit {

  //ループメンバーインデックス
  readonly listIndex: MemberIndex[] = [2,3,4];

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
  //メンバーリスト
  memberList: memberOption[] = [];

  constructor(
    private teamService: TeamService, 
    private calculatorService: CalculatorService, 
    private translateService: TranslateService,
    public characterService: CharacterService,) { }

  ngOnInit(): void {
    //チーム初期化
    this.initTeam();
    this.updateTeamMemberFromStorage();
    //チームリスト初期化
    this.initializeMemberList();
    //更新
    this.calculatorService.initExtraTeamBuffData(this.data.id);
  }
  
  onSelectTeamMember(memberIndex: string, postion: MemberIndex) {
    let isDuplicate = false;
    //重複する場合
    for(let i of this.listIndex){
      if(i != postion && memberIndex == this.memberIndexes[i]){
        this.teamService.addTeamMemberStorageInfo(this.data.id, i, this.memberIndexes[postion]);
        this.teamService.addTeamMemberStorageInfo(this.data.id, postion, memberIndex);
        isDuplicate = true;
      }
    }
    if(!isDuplicate){
      this.teamService.addTeamMemberStorageInfo(this.data.id, postion, memberIndex);
    }
    this.updateTeamMemberFromStorage();
    //更新
    this.calculatorService.initExtraTeamBuffData(this.data.id);
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
}
