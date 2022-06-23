import { Component, Input, OnInit } from '@angular/core';
import { character, Const, TYPE_SYS_LANG } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-other',
  templateUrl: './other.component.html',
  styleUrls: ['./other.component.css']
})
export class OtherComponent implements OnInit {

  tabs = ['1', '2', '3'];
  selectedIndex = 0;

  propList!: string[];

  //キャラデータ
  @Input('data') data!: character;
  //言語
  @Input('language') currentLanguage!: TYPE_SYS_LANG;

  constructor() { }

  ngOnInit(): void { 
    this.propList = Const.PROPS_OTHER;
  }

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
