import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { CharaInfo, Const, CharacterService, character, TYPE_SYS_LANG, LanguageService, EnkaService, SettingService, MenuSetting, ElementType, WeaponType } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent implements OnInit {

  readonly elementList = Const.ELEMENT_LIST
  readonly elementSvgPath = Const.ELEMENT_SVG_PATH
  readonly weaponTypeList = Const.WEAPON_TYPE_LIST
  readonly weaponTypeSvgPath = Const.WEAPON_TYPE_SVG_PATH

  //キャラリスト
  characterMap!: Map<string, character>;
  //メニューリスト
  menuList: CharaInfo[] = [];
  //メニュー設定データ
  menuSetting!: MenuSetting;
  //フィルタリングメニューリスト
  filteringMenuList: CharaInfo[] = [];
  //メニューボタン押下イベント
  @Output('menuClickEvent') menuClickEvent = new EventEmitter<CharaInfo>();
  //言語
  currentLanguage!: TYPE_SYS_LANG;
  //マウス押下状態
  mouseDownState: boolean = false;

  constructor(private characterService: CharacterService,
    private router: Router,
    private languageService: LanguageService,
    private settingService: SettingService,
    private enkaService: EnkaService) {
    //設定データ取得
    this.menuSetting = this.settingService.getMenuSetting();
    //初期言語設定
    this.currentLanguage = this.languageService.getCurrentLang();
    //言語変更検知
    this.languageService.getLang().subscribe((lang: TYPE_SYS_LANG)=>{
      this.currentLanguage = lang;
      //表示用メニューを更新
      this.filterMenuList();
    })
    //enkaデータ変更検知
    this.enkaService.getEnkaUpdate().subscribe(()=>{
      //Enkaキャラリスト
      let enkaList = this.enkaService.getAvatarList() ?? [];
      for(let i = 0; i < this.menuList.length; ++ i){
        this.menuList[i].isEnkaData = enkaList.includes(this.menuList[i].queryParams.index as string);
      };
      //表示用メニューを更新
      this.filterMenuList();
    })
  }

  ngOnInit() { 
    //メニュー初期化
    let tempMap = this.characterService.getMap();
    //Enkaキャラリスト
    let enkaList = this.enkaService.getAvatarList() ?? [];
    for(let key in tempMap) {
      let temp: CharaInfo = this.characterService.getCharaInfo(key);
      temp.isEnkaData = enkaList.includes(key);
      this.menuList.push(temp);
    }
    //表示用メニューを更新
    this.filterMenuList();
  }

  @HostListener('window:unload')
  ngOnDestroy(): void {
    //データ保存
    this.settingService.saveData();
  }

  //メニューリストをフィルター
  filterMenuList() {
    let filterTargetLowercase = this.menuSetting.filterContent.toLowerCase();
    this.filteringMenuList = this.menuList.filter((info: CharaInfo)=>{
      return (this.settingService.getMenuFilterEnka()?info.isEnkaData:true) &&
      (this.settingService.getMenuFilterData()?(this.characterService.getStorageInfo(info.index) != undefined?true:false):true) &&
      (this.settingService.getMenuFilterContent()?info.names[this.currentLanguage].toLowerCase().includes(filterTargetLowercase):true) &&
      (this.settingService.getMenuFilterElementType()[info.elementTypeNumber!]) &&
      (this.settingService.getMenuFilterWeaponType()[info.weaponType!]);
    })
  }

  clickElement(element: ElementType, focus: boolean = false) {
    if(!this.mouseDownState && !focus){
      return
    }
    this.menuSetting.filterElementType[element] = !this.menuSetting.filterElementType[element];
    this.filterMenuList();
  }

  clickWeapon(weaponType: WeaponType, focus: boolean = false) {
    if(!this.mouseDownState && !focus){
      return
    }
    this.menuSetting.filterWeaponType[weaponType] = !this.menuSetting.filterWeaponType[weaponType];
    this.filterMenuList();
  }

  clickEnka(focus: boolean = false) {
    if(!this.mouseDownState && !focus){
      return
    }
    this.menuSetting.filterEnka = !this.menuSetting.filterEnka;
    this.filterMenuList();
  }

  clickData(focus: boolean = false) {
    if(!this.mouseDownState && !focus){
      return
    }
    this.menuSetting.filterData = !this.menuSetting.filterData;
    this.filterMenuList();
  }

  mouseDown() {
    this.mouseDownState = true
  }

  mouseUp() {
    this.mouseDownState = false
  }

  /**
   * メニューボタンクリック処理
   */
  onClick(menu: CharaInfo) {
    this.menuClickEvent.emit(menu);
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
    this.router.navigate([menu.routerLink], {queryParams: menu.queryParams, skipLocationChange: true}));
  }
}
