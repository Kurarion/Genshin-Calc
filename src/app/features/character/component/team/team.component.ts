import { Component, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CalculatorService, character, CharacterService, Const, OtherService, OtherStorageInfo, TeamService, TYPE_SYS_LANG } from 'src/app/shared/shared.module';

interface enemyOption {
  index: string;
  names: Record<TYPE_SYS_LANG, string>;
}

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit {

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

  //選択された敵インデックス
  selectedEnemyIndex!: string;
  //敵リスト
  enemyList: enemyOption[] = [];

  constructor(
    private teamService: TeamService, 
    private calculatorService: CalculatorService, 
    private translateService: TranslateService,
    public characterService: CharacterService,) { }

  ngOnInit(): void {
    this.selectedEnemyIndex = this.teamService.getOtherMembers(this.data.id)[0];
    //更新
    this.calculatorService.initExtraTeamBuffData(this.data.id);
    //リスト初期化
    this.initializeEnemyList();

    this.updateNames();
    //情報初期化
    this.initInfos();

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['currentLanguage']) {
      this.updateNames();
    }
  }
  

  onSelectEnemy(enemyIndex: string) {
    this.selectedEnemyIndex = enemyIndex;

    this.teamService.addTeamMemberStorageInfo(this.data.id, 1, this.data.id);
    this.teamService.addTeamMemberStorageInfo(this.data.id, 2, enemyIndex);

    //更新
    this.calculatorService.initExtraTeamBuffData(this.data.id);
    //敵の切り替え
    // this.enemyData = this.enemyService.get(enemyIndex);
    // if(environment.outputLog){
    //   //DEBUG
    //   console.log(this.enemyData);
    // }
    // //初期化
    // this.calculatorService.initEnemyData(this.data.id, enemyIndex);
    // //敵設定
    // this.enemyService.setIndex(this.data.id, this.enemyData.id);
    // //敵属性更新
    // this.onChangeLevel(this.selectedLevel);
    //プロフィール画像初期化
    // this.initializeBackGroundImage();
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
   * 敵選択リスト初期化
   */
  private initializeEnemyList(lang?: TYPE_SYS_LANG) {
    this.enemyList = [];
    let tempMap = this.characterService.getMap();
    for (let key in tempMap) {
      this.enemyList.push({
        index: key,
        names: tempMap[key].name
      })
    }
  }

  private initInfos(){
    // this.infos = this.otherService.getStorageInfos(this.data.id);
  }

  private updateNames(){
    // this.propList?.forEach((v)=>{
    //   this.translateService.get('PROPS.' + v.value.toUpperCase()).subscribe((res: string) => {
    //     v.names[this.currentLanguage] = res;
    //   })
    // })
  }
}
