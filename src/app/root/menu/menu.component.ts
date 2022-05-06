import { Component, EventEmitter, OnInit, Output } from '@angular/core';
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
  //検索言語(検索キー)
  private readonly queryLanguage = 'cn_sim' as TYPE_SYS_LANG;

  constructor(private characterService: CharacterService, private router: Router, private languageService: LanguageService) {
    this.languageService.getLang().subscribe((lang: TYPE_SYS_LANG)=>{
      let temp = this.characterService.getMap(lang);
      for(let i = 0; i < this.menuList.length; ++i){
        this.menuList[i].name = temp.get(this.menuList[i].queryParams.name!)!.fullname;
      }
    })
  }

  ngOnInit() { 
    this.characterMap = this.characterService.getMap(this.queryLanguage);
    this.characterMap.forEach((value: character, key: string) => {
      let temp: MenuInfo = {
        name: value.fullname,
        routerLink: Const.MENU_CHARACTER,
        queryParams: {
          name: value.fullname,
        }
      };
      this.menuList.push(temp);
    })
  }

  /**
   * メニューボタンクリック処理
   */
  onClick(menu: MenuInfo) {
    this.menuClickEvent.emit(menu);
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
    this.router.navigate([menu.routerLink], {queryParams: menu.queryParams}));
  }
}
