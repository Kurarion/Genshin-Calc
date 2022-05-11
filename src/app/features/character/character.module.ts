import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AngularMaterialModule } from 'src/app/angular-material.module';

import { CharacterRoutingModule } from './character-routing.module';
import { MainComponent } from './component/main/main.component';
import { CharacterComponent } from './component/character/character.component';
import { WeaponComponent } from './component/weapon/weapon.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { TalentComponent } from './component/talent/talent.component';
import { PercentPipe } from '@angular/common';
import { ConstellationComponent } from './component/constellation/constellation.component';


@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    AngularMaterialModule,
    CharacterRoutingModule,
    SharedModule,
  ],
  declarations: [
    MainComponent,
    CharacterComponent,
    WeaponComponent,
    TalentComponent,
    ConstellationComponent
  ],
  providers: [
    PercentPipe,
  ]
})
export class CharacterModule { }
