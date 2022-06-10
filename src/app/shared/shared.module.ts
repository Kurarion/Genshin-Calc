import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../angular-material.module';
import { TranslateModule } from '@ngx-translate/core';

import { CaptureHtmlComponent } from './component/capture-html/capture-html.component';
import { PasteEventListenerComponent } from './component/paste-event-listener/paste-event-listener.component';
import { ArtifactListComponent } from './component/artifact-list/artifact-list.component';
import { Const } from './const/const';
import { NoCommaPipe } from './pipe/no-comma.pipe';
import { NoStrongPipe } from './pipe/no-strong.pipe';
import { RatePipe } from './pipe/rate.pipe';
import { ExtraDataComponent } from './component/extra-data/extra-data.component';
export { NoCommaPipe } from './pipe/no-comma.pipe';
export { NoStrongPipe } from './pipe/no-strong.pipe';
export { RatePipe } from './pipe/rate.pipe';
export { ArtifactListComponent } from './component/artifact-list/artifact-list.component';

export { GlobalProgressService } from './service/global-progress.service';
export { OcrService } from './service/ocr.service';
export { CharacterStorageInfo, CharacterService } from './service/genshin/character.service';
export { WeaponStorageInfo, WeaponService } from './service/genshin/weapon.service';
export { EnemyStorageInfo, EnemyService } from './service/genshin/enemy.service';
export { StorageService } from './service/storage.service';
export { HttpService } from './service/http.service';
export { LanguageService } from './service/language.service';
export { ExtraCharacterSkillsData, ExtraStatus, ExtraCharacterData, ExtraWeaponData, ExtraDataStorageInfo, ExtraDataService } from './service/genshin/extra-data.service';
export { GenshinDataService } from './service/genshin/genshin-data.service';
export { CalculatorService } from './service/genshin/calculator.service';

export * from './const/const';
export * from './interface/interface';
export * from './class/character';
export * from './class/weapon';
export * from './class/enemy';

let shardList: any[] = [
  CaptureHtmlComponent,
  PasteEventListenerComponent,
  ArtifactListComponent,
  ExtraDataComponent,
  NoCommaPipe,
  NoStrongPipe,
  RatePipe,
];

@NgModule({
  declarations: shardList,
  imports: [
    CommonModule,
    AngularMaterialModule,
    TranslateModule.forChild({
      extend: true,
    }),
  ],
  providers: [Const],
  exports: shardList.concat([TranslateModule, FormsModule]),
})
export class SharedModule { }
