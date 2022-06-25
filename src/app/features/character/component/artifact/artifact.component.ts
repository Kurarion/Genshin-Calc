import { Component, Input, OnInit } from '@angular/core';
import { ArtifactService, ArtifactSetAffixs, CalculatorService, character, Const, TYPE_SYS_LANG } from 'src/app/shared/shared.module';

interface artifactSetOption {
  setId: string;
  setName: Record<TYPE_SYS_LANG, string>;
  setAffixs: ArtifactSetAffixs[];
}

@Component({
  selector: 'app-artifact',
  templateUrl: './artifact.component.html',
  styleUrls: ['./artifact.component.css']
})
export class ArtifactComponent implements OnInit {
  tabs: string[] = [];
  artifactList = [
    Const.ARTIFACT_FLOWER,
    Const.ARTIFACT_PLUME,
    Const.ARTIFACT_SANDS,
    Const.ARTIFACT_GOBLET,
    Const.ARTIFACT_CIRCLET,
  ];
  selectedIndex!: number;
  //聖遺物セットリスト
  artifactSetList: artifactSetOption[] = [];
  //選択された聖遺物セットインデックス
  selectedArtifactSetIndexs!: string[];

  //キャラデータ
  @Input('data') data!: character;
  //言語
  @Input('language') currentLanguage!: TYPE_SYS_LANG;
  //選択されたパートインデックス
  partIndex: number = 0;

  constructor(private artifactService: ArtifactService,
    private calculatorService: CalculatorService,) { }

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
    //選択された聖遺物セット初期化
    this.initSelectedArtifactSetIndexs();
  }

  addTab() {
    this.tabs.push((this.tabs.length + 1).toString());
    this.selectedIndex = this.tabs.length - 1;
    this.setActiveIndex();
  }

  copyTab() {
    this.artifactService.copyAndCreateStorageInfo(this.data.id, this.selectedIndex);
    this.addTab();
  }

  removeTab(index: number) {
    this.tabs.splice(index, 1);
    this.artifactService.deleteStorageInfo(this.data.id, index);
    if(this.selectedIndex >= this.tabs.length){
      let toSetIndex = this.tabs.length - 1
      this.selectedIndex = toSetIndex > 0?toSetIndex:0;
      this.setActiveIndex();
    }
  }

  setActiveIndex(){
    this.artifactService.setStorageActiveIndex(this.data.id, this.selectedIndex);
    //選択された聖遺物セット初期化
    this.initSelectedArtifactSetIndexs();
    //更新
    this.calculatorService.setDirtyFlag(this.data.id);
  }

  /**
   * 聖遺物セット変更処理
   * @param artifactSetIndex 
   */
  onSelectArtifactSet(artifactSetIndex: string, index: number) {
    //TODO
  }

  /**
   * 聖遺物セットリスト初期化
   */
  private initializeArtifactSetList() {
    this.artifactSetList = [];
    let tempMap = this.artifactService.getSetMap();
    for (let key in tempMap) {
      this.artifactSetList.push({
        setId: key,
        setName: tempMap[key].setName,
        setAffixs: tempMap[key].setAffixs,
      })
    }
  }

  private initSelectedArtifactSetIndexs() {
    //TODO
    this.selectedArtifactSetIndexs = ['', ''];
  }
}
