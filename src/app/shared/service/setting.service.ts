import { Injectable } from '@angular/core';
import { Const, ElementType, StorageService, WeaponType } from 'src/app/shared/shared.module';

//メニュー設定
export interface MenuSetting {
  filterEnka: boolean;
  filterData: boolean;
  filterElementType: Record<ElementType, boolean>;
  filterWeaponType: Record<WeaponType, boolean>;
  filterContent: string;
}

//システム設定
export interface SysSetting {
  menu?: MenuSetting
}

@Injectable({
  providedIn: 'root'
})
export class SettingService {

  //データ
  setting!: SysSetting;

  constructor(private storageService: StorageService) {
    let temp = this.storageService.getJSONItem(Const.SAVE_SYS_SETTING)
    if(temp){
      this.setting = temp;
    }else{
      this.setting = {
        menu: this.initMenuSetting(),
      };
    }
  }

  //ストレージに保存
  saveData(){
    this.storageService.setJSONItem(Const.SAVE_SYS_SETTING, this.setting);
  }

  //メニューデータ取得
  getMenuSetting(){
    this.checkMenuSetting();
    return this.setting.menu!;
  }
  getMenuFilterEnka(){
    return this.getMenuSetting().filterEnka;
  }
  getMenuFilterData(){
    return this.getMenuSetting().filterData;
  }
  getMenuFilterElementType(){
    return this.getMenuSetting().filterElementType;
  }
  getMenuFilterWeaponType(){
    return this.getMenuSetting().filterWeaponType;
  }
  getMenuFilterContent(){
    return this.getMenuSetting().filterContent;
  }

  private checkMenuSetting() {
    if(!this.setting?.menu) {
      this.setting.menu = this.initMenuSetting();
    }
  }

  private initMenuSetting() {
    const result: MenuSetting = {
      filterEnka: false,
      filterData: false,
      filterElementType: {
        2: true,
        3: true,
        4: true,
        5: true,
        6: true,
        7: true,
        8: true,
      },
      filterWeaponType: {
        "WEAPON_SWORD_ONE_HAND": true,
        "WEAPON_CATALYST": true,
        "WEAPON_CLAYMORE": true,
        "WEAPON_BOW": true,
        "WEAPON_POLE": true,
      },
      filterContent: "",
    }
    return result;
  }
}
