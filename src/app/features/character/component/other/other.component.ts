import { Component, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { CalculatorService, character, Const, OtherService, OtherStorageInfo, TYPE_SYS_LANG } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-other',
  templateUrl: './other.component.html',
  styleUrls: ['./other.component.css']
})
export class OtherComponent implements OnInit, OnDestroy {

  readonly props_all_percent = Const.PROPS_ALL_DATA_PERCENT;

  tabs: string[] = [];
  //選択されたインデックス
  selectedIndex!: number;
  //属性リスト
  propList!: string[];
  //全情報
  infos!: OtherStorageInfo[];

  //キャラデータ
  @Input('data') data!: character;
  //言語
  @Input('language') currentLanguage!: TYPE_SYS_LANG;
  //カード横幅
  @Input('cardWidth') cardWidth!: number;

  showValue!: number;

  constructor(private otherService: OtherService, private calculatorService: CalculatorService) { }

  ngOnInit(): void {
    //リスト初期化
    this.propList = Const.PROPS_OTHER;
    //タブリスト初期化
    let length = this.otherService.getStorageInfoLength(this.data.id);
    if(length == undefined || length == 0){
      length = 1;
    }
    this.tabs = Array.from({length: length}).map((_, i) => `${i}`);
    //選択中インデックス
    this.selectedIndex = this.otherService.getStorageSelectedIndex(this.data.id);
    //情報初期化
    this.initInfos();

    this.updateShowValue();
  }

  @HostListener('window:unload')
  ngOnDestroy(): void {
    //データ保存
    this.otherService.saveData();
  }

  addTab() {
    this.otherService.addStorageInfo(this.data.id);
    this.localAddTab();
    this.setSelectedIndex();
  }

  copyTab() {
    this.otherService.copyAndCreateStorageInfo(this.data.id, this.selectedIndex);
    this.localAddTab();
    this.setSelectedIndex();
    this.updateDirtyFlag();
  }

  removeTab(index: number) {
    this.tabs.splice(index, 1);
    this.otherService.deleteStorageInfo(this.data.id, index);
    if(this.selectedIndex >= index){
      let toSetIndex = this.tabs.length - 1
      this.selectedIndex = toSetIndex > 0?toSetIndex:0;
      this.setSelectedIndex();
    }else{
      this.selectedIndex = 0;
      this.setSelectedIndex();
    }
    this.updateDirtyFlag();
  }

  onTabChanged() {
    this.updateShowValue();
  }

  setSelectedIndex(){
    this.otherService.setStorageSelectedIndex(this.data.id, this.selectedIndex);
    this.updateShowValue();
  }

  onSelectProp(prop: string){
    this.infos[this.selectedIndex].value = 0;
    this.updateShowValue();
    this.updateDirtyFlag();
  }

  onValueKeyup(event: KeyboardEvent){
    let originValue = (event.target as HTMLInputElement).value;
    let value = parseFloat(originValue);
    if(isNaN(value)){
      value = 0;
    }
    if(this.props_all_percent.includes(this.infos[this.selectedIndex].name??'')){
      value /= 100; 
    }
    this.infos[this.selectedIndex].value = value;
    this.updateDirtyFlag();
  }

  updateDirtyFlag(){
    //更新
    this.calculatorService.setDirtyFlag(this.data.id);
  }

  private localAddTab(){
    this.tabs.push((this.tabs.length + 1).toString());
    this.selectedIndex = this.tabs.length - 1;
  }

  private initInfos(){
    this.infos = this.otherService.getStorageInfos(this.data.id);
  }

  private updateShowValue(){
    let value = this.infos[this.selectedIndex].value
    if(this.props_all_percent.includes(this.infos[this.selectedIndex].name??'')){
      value *= 100; 
    }
    this.showValue = value;
  }
}
