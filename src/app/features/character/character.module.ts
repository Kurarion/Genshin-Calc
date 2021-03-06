import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AngularMaterialModule } from 'src/app/angular-material.module';

import { CharacterRoutingModule } from './character-routing.module';
import { MainComponent } from './component/main/main.component';
import { CharacterComponent } from './component/character/character.component';
import { WeaponComponent } from './component/weapon/weapon.component';
import { NoCommaPipe, RatePipe, TruncatePipe, SharedModule } from 'src/app/shared/shared.module';
import { TalentComponent } from './component/talent/talent.component';
import { PercentPipe, DecimalPipe } from '@angular/common';
import { ConstellationComponent } from './component/constellation/constellation.component';
import { EnemyComponent } from './component/enemy/enemy.component';
import { ExtraInfoComponent } from './component/extra-info/extra-info.component';
import { ArtifactComponent } from './component/artifact/artifact.component';
import { OtherComponent } from './component/other/other.component';
import { ArtifactSubComponent } from './component/artifact-sub/artifact-sub.component';


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
    ConstellationComponent,
    EnemyComponent,
    ExtraInfoComponent,
    ArtifactComponent,
    OtherComponent,
    ArtifactSubComponent,
  ],
  providers: [
    PercentPipe,
    DecimalPipe,
    NoCommaPipe,
    RatePipe,
    TruncatePipe,
  ]
})
export class CharacterModule { }
