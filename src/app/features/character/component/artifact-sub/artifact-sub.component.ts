import { Component, Input, OnInit } from '@angular/core';
import { Const, GenshinDataService } from 'src/app/shared/shared.module';

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
  readonly subs = [
    Const.ARTIFACT_SUB1,
    Const.ARTIFACT_SUB2,
    Const.ARTIFACT_SUB3,
    Const.ARTIFACT_SUB4,
  ]

  //聖遺物セットインデックス
  @Input('index') index!: number;
  //聖遺物パートタイプ
  @Input('artifactType') artifactType!: string;

  //メインリスト
  mainList!: prop[];
  //サブリスト
  subList!: string[];

  constructor(private genshinDataService: GenshinDataService) { }

  ngOnInit(): void {
    //メイン初期化
    this.mainList = [];
    let temp = GenshinDataService.dataReliquaryMain;
    let targetType!: string[];
    switch(this.artifactType){
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
    for(let key of targetType){
      if(temp.hasOwnProperty(key)){
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
    for(let key of Const.PROPS_ARTIFACT_SUB){
      this.subList.push(key);
    }
  }

}
