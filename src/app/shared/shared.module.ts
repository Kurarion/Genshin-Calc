import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../angular-material.module';
import { TranslateModule } from '@ngx-translate/core';

export const genshindb = require('genshin-db');

import { CaptureHtmlComponent } from './component/capture-html/capture-html.component';
import { PasteEventListenerComponent } from './component/paste-event-listener/paste-event-listener.component';
import { ArtifactListComponent } from './component/artifact-list/artifact-list.component';
import { Const } from './const/const';
import { NoCommaPipe } from './pipe/no-comma.pipe';
import { NoStrongPipe } from './pipe/no-strong.pipe';
import { RatePipe } from './pipe/rate.pipe';
export { NoCommaPipe } from './pipe/no-comma.pipe';
export { NoStrongPipe } from './pipe/no-strong.pipe';
export { RatePipe } from './pipe/rate.pipe';
export { ArtifactListComponent } from './component/artifact-list/artifact-list.component';

export { GlobalProgressService } from './service/global-progress.service';
export { OcrService } from './service/ocr.service';
export { CharacterService } from './service/character.service';
export { WeaponService } from './service/weapon.service';
export { EnemyService } from './service/enemy.service';
export { StorageService } from './service/storage.service';
export { HttpService } from './service/http.service';
export { LanguageService } from './service/language.service';
export { ExtraDataService } from './service/extra-data.service';

export * from './const/const';
export * from './interface/interface';
export * from './class/character';
export * from './class/weapon';
export * from './class/enemy';

let shardList: any[] = [
  CaptureHtmlComponent,
  PasteEventListenerComponent,
  ArtifactListComponent,
  NoCommaPipe,
  NoStrongPipe,
  RatePipe,
];

@NgModule({
  declarations: [shardList, RatePipe],
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
