import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MenuInfo, Const } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent implements OnInit {
  //メニューリスト
  menus: MenuInfo[] = Const.menus;
  //メニューボタン押下イベント
  @Output('menuClickEvent') menuClickEvent = new EventEmitter<MenuInfo>();

  constructor() {}

  ngOnInit() {}

  /**
   * メニューボタンクリック処理
   */
  onClick(menu: MenuInfo) {
    this.menuClickEvent.emit(menu);
  }
}
