import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { ArtifactService, ArtifactSetAffixs, CalculatorService, character, Const, ExpansionPanelCommon, RelayoutMsgService, TYPE_SYS_LANG } from 'src/app/shared/shared.module';
import { environment } from 'src/environments/environment';

interface artifactSetOption {
  index: string;
  setId: string;
  setName: Record<TYPE_SYS_LANG, string>;
  setAffixs: ArtifactSetAffixs[];
}

@Component({
  selector: 'app-artifact',
  templateUrl: './artifact.component.html',
  styleUrls: ['./artifact.component.css'],
})
export class ArtifactComponent extends ExpansionPanelCommon implements OnInit {
  private readonly no_desc: Record<TYPE_SYS_LANG, string> = {
    cn_sim: '',
    cn_tra: '',
    en: '',
    jp: ''
  };
  readonly name_set = Const.NAME_SET;
  readonly artifactList = [
    Const.ARTIFACT_FLOWER,
    Const.ARTIFACT_PLUME,
    Const.ARTIFACT_SANDS,
    Const.ARTIFACT_GOBLET,
    Const.ARTIFACT_CIRCLET,
  ];

  tabs!: string[];
  //選択されたインデックス
  selectedIndex!: number;
  //ラスト選択されたインデックス
  lastSelectedIndex!: number;
  //選択された聖遺物Autoフラグ
  isSelectedIndexAuto!: boolean;
  //聖遺物セットリスト
  artifactSetList!: artifactSetOption[];
  //選択された聖遺物セットインデックス
  selectedArtifactSetIndexs!: string[];
  selectedFullArtifactSetIndex!: string;

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
  //選択されたパートインデックス
  partIndex!: number;
  //効果記述
  effectContent1!: string;
  effectContent2!: string;

  //表示用
  effectValidIndexs!: number[];

  //子コンポーネント変更フラグ
  subChanged!: number;
  //セットバフ更新
  setBuffRefreshFlg!: number;

  constructor(
    public artifactService: ArtifactService,
    private calculatorService: CalculatorService,
    private relayoutMsgService: RelayoutMsgService,) { 
      super(relayoutMsgService);
      this.tabs = [];
      this.artifactSetList = [];
      this.isSelectedIndexAuto = false;
      this.lastSelectedIndex = -1;
      this.selectedFullArtifactSetIndex = '';
      this.effectContent1 = '';
      this.effectContent2 = '';
      this.partIndex = 0;
      this.subChanged = 0;
      this.setBuffRefreshFlg = 0;
    }

  ngOnInit(): void {
    //聖遺物セットリスト初期化
    this.initializeArtifactSetList();
    //タブリスト初期化
    let length = this.artifactService.getStorageInfoLength(this.data.id);
    if(length == undefined || length == 0){
      length = 1;
    }
    this.tabs = Array.from({length: length}).map((_, i) => `${i}`);
    //選択中インデックス
    this.selectedIndex = this.artifactService.getStorageActiveIndex(this.data.id);
    this.resetLastSelectedIndex();
    //Autoフラグ
    this.isSelectedIndexAuto = this.artifactService.getStorageActiveIndexAutoFlag(this.data.id);
    //選択された聖遺物セット初期化
    this.initSelectedArtifactSetIndexs(true);
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes['currentLanguage']) {
      if(this.selectedArtifactSetIndexs && this.selectedArtifactSetIndexs.length > 0){
        this.initEffectContents();
      }
    }
  }

  updateRecords(){
    this.effectValidIndexs = this.getEffectValidIndexs();
  }

  addTab() {
    this.tabs.push((this.tabs.length + 1).toString());
    this.selectedIndex = this.tabs.length - 1;
  }

  addAutoTab() {
    this.tabs.push((this.tabs.length + 1).toString());
    this.selectedIndex = this.tabs.length - 1;
    this.artifactService.pushStorageInfo(this.data.id, {isAuto: true})
  }

  copyTab() {
    this.artifactService.copyAndCreateStorageInfo(this.data.id, this.selectedIndex);
    this.addTab();
  }

  removeTab(index: number) {
    this.tabs.splice(index, 1);
    this.artifactService.deleteStorageInfo(this.data.id, index);
    if(this.selectedIndex >= index){
      let toSetIndex = this.tabs.length - 1
      this.selectedIndex = toSetIndex > 0?toSetIndex:0;
    }else{
      this.selectedIndex = 0;
    }
    this.setActiveIndex();
  }

  rollback(index: number) {
    this.artifactService.recoverData(this.data.id, index);
    this.subChanged += 1;
    //選択された聖遺物セット初期化
    this.initSelectedArtifactSetIndexs(true);
    //更新
    this.calculatorService.setDirtyFlag(this.data.id);
    this.artifactService.next();
  }

  setActiveIndex(){
    this.artifactService.setStorageActiveIndex(this.data.id, this.selectedIndex);
    //選択された聖遺物セット初期化
    this.initSelectedArtifactSetIndexs();
    this.resetLastSelectedIndex();
    //更新
    this.calculatorService.setDirtyFlag(this.data.id);
    //Autoフラグ
    this.isSelectedIndexAuto = this.artifactService.getStorageActiveIndexAutoFlag(this.data.id);
    //レイアウト更新
    super.onExpandStatusChanged();
  }

  /**
   * 聖遺物セット変更処理
   * @param artifactSetIndex 
   */
  onSelectArtifactSet(artifactSetIndex: string, index: number) {
    this.selectedArtifactSetIndexs[index] = artifactSetIndex;
    if(environment.outputLog){
      //DEBUG
      console.log(this.artifactService.getSetData(artifactSetIndex));
    }
    this.initSelectedFullArtifactSetIndex();
    this.initEffectContents();
    this.setDefaultExtraData();
    //更新
    this.calculatorService.initExtraArtifactSetData(this.data.id);
  }

  getEffectValidIndexs(){
    if(this.selectedFullArtifactSetIndex != ""){
      return this.artifactService.getSetData(this.selectedFullArtifactSetIndex).setAffixs[1].paramValidIndexs;
    }
    return [];
  }

  initEffectContents(){
    this.effectContent1 = this.getEffectContent(1)[this.currentLanguage].length > 0?(environment.artifactEffectContentPreffix + this.getEffectContent(1)[this.currentLanguage]):'';
    this.effectContent2 = this.getEffectContent(2)[this.currentLanguage].length > 0?(environment.artifactEffectContentPreffix + this.getEffectContent(2)[this.currentLanguage]):'';
  }

  getEffectContent(index: number): Record<TYPE_SYS_LANG, string> {
    let artifactIndex = this.selectedArtifactSetIndexs[index -1];
    if(artifactIndex == undefined){
      return this.no_desc;
    }
    let setAffixIndex = 0;
    if(index == 2 && artifactIndex == this.selectedFullArtifactSetIndex){
      setAffixIndex = 1;
    }
    return this.artifactService.getSetData(artifactIndex)?.setAffixs[setAffixIndex].desc ?? this.no_desc;
  }

  //ドラッグ開始
  onDrag(){
    this.draged.emit(this.name);
  }  

  /**
   * 聖遺物セットリスト初期化
   */
  private initializeArtifactSetList() {
    this.artifactSetList = [];
    let tempMap = this.artifactService.getSetMap();
    for (let key in tempMap) {
      this.artifactSetList.push({
        index: key,
        setId: key,
        setName: tempMap[key].setName,
        setAffixs: tempMap[key].setAffixs,
      })
    }
  }

  private initSelectedArtifactSetIndexs(isInit?: boolean) {
    this.selectedArtifactSetIndexs = this.artifactService.getStorageSetIndexs(this.data.id, this.selectedIndex);
    this.initSelectedFullArtifactSetIndex(isInit);
    this.initEffectContents();
    this.artifactService.checkAndFixExtraData(this.data.id, this.selectedIndex);
    if(!isInit){
      this.artifactService.setStorageSetIndexsAll(this.data.id, this.selectedArtifactSetIndexs, undefined, this.lastSelectedIndex)
    }
    //更新
    this.calculatorService.initExtraArtifactSetData(this.data.id);
    ++this.setBuffRefreshFlg;
  }

  private initSelectedFullArtifactSetIndex(isInit?: boolean) {
    if(this.selectedArtifactSetIndexs[0] == this.selectedArtifactSetIndexs[1] && this.selectedArtifactSetIndexs[0] != "" && this.selectedArtifactSetIndexs[0]){
      this.selectedFullArtifactSetIndex = this.selectedArtifactSetIndexs[0];
      this.artifactService.setStorageFullSetIndex(this.data.id, this.selectedIndex, this.selectedFullArtifactSetIndex);
    }else{
      this.selectedFullArtifactSetIndex = '';
      this.artifactService.setStorageFullSetIndex(this.data.id, this.selectedIndex, '', isInit);
    }
    //レコード更新
    this.updateRecords()
  }

  private setDefaultExtraData(){
    //追加データ更新
    this.artifactService.setDefaultExtraData(this.data.id, this.selectedArtifactSetIndexs, this.selectedFullArtifactSetIndex);
  }

  private resetLastSelectedIndex() {
    this.lastSelectedIndex = this.selectedIndex
  }
}
