import { Component, Input, OnInit } from '@angular/core';
import { ArtifactService, character, Const, TYPE_SYS_LANG } from 'src/app/shared/shared.module';

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

  //キャラデータ
  @Input('data') data!: character;
  //言語
  @Input('language') currentLanguage!: TYPE_SYS_LANG;
  //選択されたパートインデックス
  partIndex: number = 0;

  constructor(private artifactService: ArtifactService) { }

  ngOnInit(): void {
    //タブリスト初期化
    let length = this.artifactService.getStorageInfoLength(this.data.id);
    if(length == undefined || length == 0){
      length = 1;
    }
    this.tabs = Array.from({length: length}).map((_, i) => `${i}`);
    //選択中インデックス
    this.selectedIndex = this.artifactService.getStorageActiveIndex(this.data.id);
  }

  addTab() {
    this.tabs.push((this.tabs.length + 1).toString());
    this.selectedIndex = this.tabs.length - 1;
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
    }
  }

  setActiveIndex(){
    this.artifactService.setStorageActiveIndex(this.data.id, this.selectedIndex);
  }

}
