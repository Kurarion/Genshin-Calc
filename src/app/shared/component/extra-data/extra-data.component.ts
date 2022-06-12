import { Component, Input, OnInit } from '@angular/core';
import { character, CharacterService, CharacterStorageInfo, enemy, EnemyService, EnemyStorageInfo, ExtraCharacter, ExtraData, ExtraDataService, ExtraDataStorageInfo, ExtraWeapon, weapon, WeaponService, WeaponStorageInfo } from 'src/app/shared/shared.module';
import { CalculatorService } from '../../service/genshin/calculator.service';

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

  constructor(private calculatorService: CalculatorService) { }

  ngOnInit(): void { }

  getInfos(){
    let temp = this.calculatorService.getSkillDmgValue(this.characterIndex, this.skill, this.valueIndexs);
    return temp;
  }

  private valueChange(){
    // this.storageWeaponData
  }

}
