import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-artifact',
  templateUrl: './artifact.component.html',
  styleUrls: ['./artifact.component.css']
})
export class ArtifactComponent implements OnInit {
  tabs = ['1', '2', '3'];
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
