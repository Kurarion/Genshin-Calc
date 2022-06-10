import { Component, Input, OnInit } from '@angular/core';
import { character, CharacterService, CharacterStorageInfo, enemy, EnemyService, EnemyStorageInfo, ExtraCharacter, ExtraData, ExtraDataService, ExtraDataStorageInfo, ExtraWeapon, weapon, WeaponService, WeaponStorageInfo } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-extra-data',
  templateUrl: './extra-data.component.html',
  styleUrls: ['./extra-data.component.css']
})
export class ExtraDataComponent implements OnInit {

  //キャラ
  @Input('characterIndex') characterIndex!: number | string;
  //スキル
  @Input('skill') skill!: string;
  //インデックス値
  @Input('valueIndexs') valueIndexs!: number[];
  //キャラデータ
  storageCharacterData!: CharacterStorageInfo;
  //武器データ
  storageWeaponData!: WeaponStorageInfo;
  //敵データ
  storageEnemyData!: EnemyStorageInfo;

  constructor(private characterService: CharacterService, 
    private weaponService: WeaponService, 
    private enemyService: EnemyService, 
    private extraDataService: ExtraDataService) { }

  ngOnInit(): void {
    //キャラデータ初期化
    this.storageCharacterData = this.characterService.getStorageInfo(this.characterIndex);
    //武器データ初期化
    this.storageWeaponData = this.weaponService.getStorageInfo(this.characterIndex);
    //敵データ初期化
    this.storageEnemyData = this.enemyService.getStorageInfo(this.characterIndex);
  }

  private valueChange(){
    this.storageWeaponData
  }

}
