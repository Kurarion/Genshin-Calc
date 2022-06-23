import { Component, HostListener, Input, OnInit, SimpleChanges } from '@angular/core';
import { ArtifactService, ArtifactStorageInfo, ArtifactStoragePartData, Const, GenshinDataService } from 'src/app/shared/shared.module';

interface prop {
  name: string;
  value: number;
  isPercent?: boolean;
}

@Component({
  selector: 'app-artifact-sub',
  templateUrl: './artifact-sub.component.html',
  styleUrls: ['./artifact-sub.component.css']
})
export class ArtifactSubComponent implements OnInit {

  readonly percent_props = Const.PROPS_CHARA_WEAPON_PERCENT;
  readonly mains = [Const.ARTIFACT_MAIN];
  readonly subs = [
    Const.ARTIFACT_SUB1,
    Const.ARTIFACT_SUB2,
    Const.ARTIFACT_SUB3,
    Const.ARTIFACT_SUB4,
  ];

  //キャラインデックス
  @Input('characterIndex') characterIndex!: number;
  //聖遺物セットインデックス
  @Input('index') index!: number;
  //聖遺物パートタイプ
  @Input('artifactType') artifactType!: string;

  data!: ArtifactStoragePartData;

  //メインリスト
  mainList!: prop[];
  //サブリスト
  subList!: string[];

  constructor(private genshinDataService: GenshinDataService,
    private artifactService: ArtifactService) { }

  ngOnInit(): void {
    this.initList();
    this.initData();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['index']) {
      this.initData();
    }
  }

  @HostListener('window:unload')
  ngOnDestroy(): void {
    //データ保存
    this.artifactService.saveData();
  }

  initList() {
    //メイン初期化
    this.mainList = [];
    let temp = GenshinDataService.dataReliquaryMain;
    let targetType!: string[];
    switch (this.artifactType) {
      case Const.ARTIFACT_FLOWER:
        targetType = Const.PROPS_ARTIFACT_FLOWER;
        break;
      case Const.ARTIFACT_PLUME:
        targetType = Const.PROPS_ARTIFACT_PLUME;
        break;
      case Const.ARTIFACT_SANDS:
        targetType = Const.PROPS_ARTIFACT_SANDS;
        break;
      case Const.ARTIFACT_GOBLET:
        targetType = Const.PROPS_ARTIFACT_GOBLET;
        break;
      case Const.ARTIFACT_CIRCLET:
        targetType = Const.PROPS_ARTIFACT_CIRCLET;
        break;
    }
    for (let key of targetType) {
      if (temp.hasOwnProperty(key)) {
        let isPercent = this.percent_props.includes(key);
        this.mainList.push({
          name: key,
          value: temp[key],
          isPercent: isPercent,
        })
      }
    }
    //サブ初期化
    this.subList = [];
    for (let key of Const.PROPS_ARTIFACT_SUB) {
      this.subList.push(key);
    }
  }

  initData() {
    this.data = this.artifactService.getStorageInfo(this.characterIndex, this.index, this.artifactType.toLowerCase());
  }

  isDuplicate(value: string): boolean {
    return false;
  }

  onSelect(key: string, value: string){
    if(this.data[key.toLowerCase()] == undefined){
      this.data[key.toLowerCase()] = {};
    }
    this.data[key.toLowerCase()].name = value;
  }

}
