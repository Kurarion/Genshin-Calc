import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { MenuInfo, Const, CharacterService, character, TYPE_SYS_LANG, LanguageService } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent implements OnInit {
  //キャラリスト
  characterMap!: Map<string, character>;
  //メニューリスト
  menuList: MenuInfo[] = [];
  //メニューボタン押下イベント
  @Output('menuClickEvent') menuClickEvent = new EventEmitter<MenuInfo>();
  //言語
  currentLanguage!: TYPE_SYS_LANG;

  constructor(private characterService: CharacterService, private router: Router, private languageService: LanguageService) {
    //初期言語設定
    this.currentLanguage = this.languageService.getCurrentLang();
    //戻る防止
    history.pushState(null, '', '');
    window.addEventListener('popstate', ()=>{
      history.pushState(null, '', '');
    })
    //言語変更検知
    this.languageService.getLang().subscribe((lang: TYPE_SYS_LANG)=>{
      this.currentLanguage = lang;
    })
  }

  ngOnInit() { 
    //メニュー初期化
    let tempMap = this.characterService.getMap();
    for(let key in tempMap) {
      let temp: MenuInfo = {
        names: tempMap[key].name,
        routerLink: Const.MENU_CHARACTER,
        queryParams: {
          index: key,
        }
      };
      this.menuList.push(temp);
    }
  }

  /**
   * メニューボタンクリック処理
   */
  onClick(menu: MenuInfo) {
    this.menuClickEvent.emit(menu);
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
    this.router.navigate([menu.routerLink], {queryParams: menu.queryParams, skipLocationChange: true}));
  }
}
