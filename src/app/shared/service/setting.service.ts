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

  readonly defaultBool: boolean = false;
  readonly defaultElementType: Record<ElementType, boolean> = {
    2: true,
    3: true,
    4: true,
    5: true,
    6: true,
    7: true,
    8: true,
  };
  readonly defaultWeaponType: Record<WeaponType, boolean> = {
    "WEAPON_SWORD_ONE_HAND": true,
    "WEAPON_CATALYST": true,
    "WEAPON_CLAYMORE": true,
    "WEAPON_BOW": true,
    "WEAPON_POLE": true,
  };
  readonly defaultContent: string = "";

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
  
  resetSetting(){
    const setting = this.getMenuSetting();
    setting.filterEnka = this.defaultBool
    setting.filterData = this.defaultBool
    setting.filterElementType = {...this.defaultElementType}
    setting.filterWeaponType = {...this.defaultWeaponType}
    setting.filterContent = this.defaultContent
  }

  private checkMenuSetting() {
    if(!this.setting?.menu) {
      this.setting.menu = this.initMenuSetting();
    }
  }

  private initMenuSetting() {
    const result: MenuSetting = {
      filterEnka: this.defaultBool,
      filterData: this.defaultBool,
      filterElementType: {...this.defaultElementType},
      filterWeaponType: {...this.defaultWeaponType},
      filterContent: this.defaultContent,
    }
    
    return result;
  }
}
