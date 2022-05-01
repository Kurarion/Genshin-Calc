import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from 'src/app/angular-material.module';

import { CharacterRoutingModule } from './character-routing.module';
import { MainComponent } from './component/main/main.component';


@NgModule({
  declarations: [
    MainComponent
  ],
  imports: [
    CommonModule,
    AngularMaterialModule,
    CharacterRoutingModule,
  ]
})
export class CharacterModule { }
