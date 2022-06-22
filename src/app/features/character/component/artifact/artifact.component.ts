import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Const } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-artifact',
  templateUrl: './artifact.component.html',
  styleUrls: ['./artifact.component.css']
})
export class ArtifactComponent implements OnInit {
  tabs = ['1', '2', '3'];
  artifactList = [
    Const.ARTIFACT_FLOWER,
    Const.ARTIFACT_PLUME,
    Const.ARTIFACT_SANDS,
    Const.ARTIFACT_GOBLET,
    Const.ARTIFACT_CIRCLET,
  ];
  selectedIndex = 0;

  constructor() { }

  ngOnInit(): void { }

  addTab() {
    this.tabs.push((this.tabs.length + 1).toString());
    this.selectedIndex = this.tabs.length - 1;
  }

  removeTab(index: number) {
    this.tabs.splice(index, 1);
    if(this.selectedIndex >= this.tabs.length){
      let toSetIndex = this.tabs.length - 1
      this.selectedIndex = toSetIndex > 0?toSetIndex:0;
    }
  }

}
