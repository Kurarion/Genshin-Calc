import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { AngularMaterialModule } from '../angular-material.module';
import { TranslateModule } from '@ngx-translate/core';

import { ExtraDataComponent } from './component/extra-data/extra-data.component';
import { EnkaComponent } from './component/enka/enka.component';
import { MatFilteringSelectorComponent } from './component/mat-filtering-selector/mat-filtering-selector.component';
import { CharaOptionComponent } from './component/chara-option/chara-option.component';
import { Const } from './const/const';
import { NoCommaPipe } from './pipe/no-comma.pipe';
import { NoStrongPipe } from './pipe/no-strong.pipe';
import { RatePipe } from './pipe/rate.pipe';
import { TruncatePipe } from './pipe/truncate.pipe';
import { ImgErrorHandleDirective } from './directive/img-error-handle.directive';
import { ImgLoadAndErrorHandleDirective } from './directive/img-load-and-error-handle.directive';
export { NoCommaPipe } from './pipe/no-comma.pipe';
export { NoStrongPipe } from './pipe/no-strong.pipe';
export { RatePipe } from './pipe/rate.pipe';
export { TruncatePipe } from './pipe/truncate.pipe';

export { GlobalProgressService } from './service/global-progress.service';
export { CharacterStorageInfo, CharacterService } from './service/genshin/character.service';
export { WeaponStorageInfo, WeaponService } from './service/genshin/weapon.service';
export { EnemyStorageInfo, EnemyService } from './service/genshin/enemy.service';
export { OtherStorageInfo, OtherStorageData, OtherService } from './service/genshin/other.service';
export { TeamSetStorageInfo, MemberIndex, TeamService } from './service/genshin/team.service';
export { ArtifactStoragePartData, ArtifactStorageItemData, ArtifactStorageInfo, ArtifactService, ChipData } from './service/genshin/artifact.service';
export { StorageService } from './service/storage.service';
export { HttpService } from './service/http.service';
export { LanguageService } from './service/language.service';
export { ExtraArtifactSetData, ExtraCharacterSkillsData, ExtraStatus, ExtraCharacterData, ExtraWeaponData, ExtraDataStorageInfo, ExtraDataService } from './service/genshin/extra-data.service';
export { GenshinDataService } from './service/genshin/genshin-data.service';
export { BuffResult, DamageParam, DamageResult, HealingResult, ShieldResult, ProductResult, CalculatorService } from './service/genshin/calculator.service';
export { RelayoutMsgService } from './service/relayout-msg.service';

export { EnkaStorageData, EnkaService } from './service/other/enka.service';

export * from './const/const';
export * from './interface/interface';
export * from './class/character';
export * from './class/weapon';
export * from './class/enemy';
export * from './class/artifact';
export * from './class/type';
export * from './class/enka';
export * from './class/expansionPanelCommon';

let shardList: any[] = [
  ExtraDataComponent,
  EnkaComponent,
  MatFilteringSelectorComponent,
  CharaOptionComponent,
  NoCommaPipe,
  NoStrongPipe,
  RatePipe,
  TruncatePipe,
  ImgErrorHandleDirective,
  ImgLoadAndErrorHandleDirective,
];

@NgModule({
  declarations: shardList,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ScrollingModule,
    AngularMaterialModule,
    TranslateModule.forChild({
      extend: true,
    }),
  ],
  providers: [Const],
  exports: shardList.concat([TranslateModule, FormsModule]),
})
export class SharedModule { }
