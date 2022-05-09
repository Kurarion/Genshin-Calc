import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from '../angular-material.module';
import { TranslateModule } from '@ngx-translate/core';

export const genshindb = require('genshin-db');

import { CaptureHtmlComponent } from './component/capture-html/capture-html.component';
import { PasteEventListenerComponent } from './component/paste-event-listener/paste-event-listener.component';
import { ArtifactListComponent } from './component/artifact-list/artifact-list.component';
import { Const } from './const/const';
import { LanguageService } from './service/language.service';
import { CharacterService } from './service/character.service';
export { ArtifactListComponent } from './component/artifact-list/artifact-list.component';

export { GlobalProgressService } from './service/global-progress.service';
export { OcrService } from './service/ocr.service';
export { CharacterService } from './service/character.service';
export { WeaponService } from './service/weapon.service';
export { StorageService } from './service/storage.service';
export { HttpService } from './service/http.service';
export { LanguageService } from './service/language.service';

export * from './const/const';
export * from './interface/interface';
export * from './class/character';

let shardList: any[] = [
  CaptureHtmlComponent,
  PasteEventListenerComponent,
  ArtifactListComponent,
];

@NgModule({
  declarations: [shardList],
  imports: [
    CommonModule,
    AngularMaterialModule,
    TranslateModule.forChild({
      extend: true,
    }),
  ],
  providers: [Const],
  exports: shardList.concat([TranslateModule]),
})
export class SharedModule { }
