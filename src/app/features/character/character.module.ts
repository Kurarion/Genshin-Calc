import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from 'src/app/angular-material.module';

import { CharacterRoutingModule } from './character-routing.module';
import { MainComponent } from './component/main/main.component';
import { CharacterComponent } from './component/character/character.component';
import { WeaponComponent } from './component/weapon/weapon.component';


@NgModule({
  declarations: [
    MainComponent,
    CharacterComponent,
    WeaponComponent
  ],
  imports: [
    CommonModule,
    AngularMaterialModule,
    CharacterRoutingModule,
  ]
})
export class CharacterModule { }
