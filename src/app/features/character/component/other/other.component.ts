import { Component, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CalculatorService, character, Const, OtherService, OtherStorageInfo, TYPE_SYS_LANG } from 'src/app/shared/shared.module';

interface propObj {
  value: any,
  names: Record<string, string>
}

@Component({
  selector: 'app-other',
  templateUrl: './other.component.html',
  styleUrls: ['./other.component.css']
})
export class OtherComponent implements OnInit, OnDestroy {

  readonly props_all_percent = Const.PROPS_ALL_DATA_PERCENT;
  readonly pyroIconUrl = Const.ELEMENT_SVG_PATH.get(2);
  readonly hydroIconUrl = Const.ELEMENT_SVG_PATH.get(3);
  readonly anemoIconUrl = Const.ELEMENT_SVG_PATH.get(4);
  readonly cryoIconUrl = Const.ELEMENT_SVG_PATH.get(5);
  readonly geoIconUrl = Const.ELEMENT_SVG_PATH.get(6);
  readonly electroIconUrl = Const.ELEMENT_SVG_PATH.get(7);
  readonly dendroIconUrl = Const.ELEMENT_SVG_PATH.get(8);

  readonly elementMap = {
    'pyro': this.pyroIconUrl,
    'hydro': this.hydroIconUrl,
    'anemo': this.anemoIconUrl,
    'cryo': this.cryoIconUrl,
    'geo': this.geoIconUrl,
    'electro': this.electroIconUrl,
    'dendro': this.dendroIconUrl,
  }

  readonly loopElemnt = [
    'pyro',
    'hydro',
    'cryo',
    'geo',
    'dendro',
  ]

  tabs: string[] = [];
  //選択されたインデックス
  selectedIndex!: number;
  //属性リスト
  propList: propObj[] = [];
  //全情報
  infos!: OtherStorageInfo[];

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

  showValue!: number;

  constructor(
    private otherService: OtherService, 
    private calculatorService: CalculatorService, 
    private translateService: TranslateService) { }

  ngOnInit(): void {
    //リスト初期化
    this.propList = Array.from(Const.PROPS_OTHER, (v,i)=>{
      let initNames: Record<string, string> = {};
      for(let lang of Const.LIST_LANG){
        initNames[lang.code] = "";
      }
      return {
        value: v,
        names: initNames
      }
    });
    this.updateNames();
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

  ngOnChanges(changes: SimpleChanges) {
    if (changes['currentLanguage']) {
      this.updateNames();
    }
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
    }else{
      this.selectedIndex = 0;
    }
    this.setSelectedIndex();
    this.updateDirtyFlag();
  }

  onTabChanged() {
    this.updateShowValue();
  }

  setSelectedIndex(){
    this.otherService.setStorageSelectedIndex(this.data.id, this.selectedIndex);
    this.updateShowValue();
  }

  onSelectProp(prop: string, index: number){
    this.infos[index].name = prop;
    this.infos[this.selectedIndex].value = 0;
    if(prop == Const.PROP_HP_UP){
      this.infos[this.selectedIndex].canSecondaryTrans = true;
    }
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
    if(this.infos[this.selectedIndex].enable){
      this.updateDirtyFlag();
    }
  }

  updateDirtyFlag(){
    //更新
    this.calculatorService.setDirtyFlag(this.data.id);
  }

  //ドラッグ開始
  onDrag(){
    this.draged.emit(this.name);
  }

  onClickElementTemplate(elementType: string){
    switch(elementType){
      case 'pyro':
        this.addTab();
        this.infos[this.selectedIndex].name = Const.PROP_ATTACK_UP;
        this.infos[this.selectedIndex].value = 0.25;
        this.infos[this.selectedIndex].enable = true;
        this.updateShowValue();
        this.updateDirtyFlag();
        break;
      case 'hydro':
        this.addTab();
        this.infos[this.selectedIndex].name = Const.PROP_HP_UP;
        this.infos[this.selectedIndex].value = 0.25;
        this.infos[this.selectedIndex].enable = true;
        this.infos[this.selectedIndex].canSecondaryTrans = true;
        this.updateShowValue();
        this.updateDirtyFlag();
        break;
      case 'cryo':
        this.addTab();
        this.infos[this.selectedIndex].name = Const.PROP_CRIT_RATE;
        this.infos[this.selectedIndex].value = 0.15;
        this.infos[this.selectedIndex].enable = true;
        this.updateShowValue();
        this.updateDirtyFlag();
        break;
      case 'geo':
        this.addTab();
        this.infos[this.selectedIndex].name = Const.PROP_DMG_BONUS_ALL;
        this.infos[this.selectedIndex].value = 0.15;
        this.infos[this.selectedIndex].enable = true;
        this.addTab();
        this.infos[this.selectedIndex].name = Const.PROP_DMG_ANTI_GEO_MINUS;
        this.infos[this.selectedIndex].value = 0.20;
        this.infos[this.selectedIndex].enable = true;
        this.updateShowValue();
        this.updateDirtyFlag();
        break;
      case 'dendro':
        this.addTab();
        this.infos[this.selectedIndex].name = Const.PROP_ELEMENTAL_MASTERY;
        this.infos[this.selectedIndex].value = 50;
        this.infos[this.selectedIndex].enable = true;
        this.infos[this.selectedIndex].canSecondaryTrans = true;
        this.addTab();
        this.infos[this.selectedIndex].name = Const.PROP_ELEMENTAL_MASTERY;
        this.infos[this.selectedIndex].value = 30;
        this.infos[this.selectedIndex].enable = true;
        this.infos[this.selectedIndex].canSecondaryTrans = true;
        this.addTab();
        this.infos[this.selectedIndex].name = Const.PROP_ELEMENTAL_MASTERY;
        this.infos[this.selectedIndex].value = 20;
        this.infos[this.selectedIndex].enable = true;
        this.infos[this.selectedIndex].canSecondaryTrans = true;
        this.updateShowValue();
        this.updateDirtyFlag();
        break;
    }
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
    this.showValue = parseFloat(value.toFixed(8));
  }

  private updateNames(){
    this.propList?.forEach((v)=>{
      this.translateService.get('PROPS.' + v.value.toUpperCase()).subscribe((res: string) => {
        v.names[this.currentLanguage] = res;
      })
    })
  }
}
