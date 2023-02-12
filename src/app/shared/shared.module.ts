import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { AngularMaterialModule } from '../angular-material.module';
import { TranslateModule } from '@ngx-translate/core';
import { NgxEchartsModule } from 'ngx-echarts';

import { ExtraDataComponent } from './component/extra-data/extra-data.component';
import { EnkaComponent } from './component/enka/enka.component';
import { MatFilteringSelectorComponent } from './component/mat-filtering-selector/mat-filtering-selector.component';
import { CharaOptionComponent } from './component/chara-option/chara-option.component';
import { ConfirmDialogComponent } from './component/confirm-dialog/confirm-dialog.component';
import { ManualDialogComponent } from './component/manual-dialog/manual-dialog.component';
import { Const } from './const/const';
import { NoCommaPipe } from './pipe/no-comma.pipe';
import { NoStrongPipe } from './pipe/no-strong.pipe';
import { RatePipe } from './pipe/rate.pipe';
import { TruncatePipe } from './pipe/truncate.pipe';
import { RemoveZeroSuffixPipe } from './pipe/remove-zero-suffix.pipe';
import { ImgErrorHandleDirective } from './directive/img-error-handle.directive';
import { ImgLoadAndErrorHandleDirective } from './directive/img-load-and-error-handle.directive';

export { ConfirmDialogComponent, ConfirmDialogData } from './component/confirm-dialog/confirm-dialog.component'
export { ManualDialogComponent, ManualDialogData } from './component/manual-dialog/manual-dialog.component'

export { NoCommaPipe } from './pipe/no-comma.pipe';
export { NoStrongPipe } from './pipe/no-strong.pipe';
export { RatePipe } from './pipe/rate.pipe';
export { TruncatePipe } from './pipe/truncate.pipe';
export { RemoveZeroSuffixPipe } from './pipe/remove-zero-suffix.pipe';

export { GlobalProgressService } from './service/global-progress.service';
export { CharacterStorageInfo, CharacterService } from './service/genshin/character.service';
export { WeaponStorageInfo, WeaponService } from './service/genshin/weapon.service';
export { EnemyStorageInfo, EnemyService } from './service/genshin/enemy.service';
export { OtherStorageInfo, OtherStorageData, OtherService } from './service/genshin/other.service';
export { TeamSetStorageInfo, MemberIndex, TeamService } from './service/genshin/team.service';
export { ArtifactStoragePartData, ArtifactStorageItemData, ArtifactStorageInfo, ArtifactService, ChipData } from './service/genshin/artifact.service';
export { StorageService } from './service/storage.service';
export { SettingService, MenuSetting, SysSetting } from './service/setting.service';
export { HttpService } from './service/http.service';
export { LanguageService } from './service/language.service';
export { ExtraArtifactSetData, ExtraCharacterSkillsData, ExtraStatus, ExtraCharacterData, ExtraWeaponData, ExtraDataStorageInfo, ExtraDataService } from './service/genshin/extra-data.service';
export { GenshinDataService } from './service/genshin/genshin-data.service';
export { TeamBuff, SelfTeamBuff, BuffResult, DamageParam, DamageResult, HealingResult, ShieldResult, ProductResult, CalculatorService } from './service/genshin/calculator.service';
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
  ConfirmDialogComponent,
  ManualDialogComponent,
  NoCommaPipe,
  NoStrongPipe,
  RatePipe,
  TruncatePipe,
  RemoveZeroSuffixPipe,
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
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    }),
  ],
  providers: [Const],
  exports: shardList.concat([TranslateModule, FormsModule, NgxEchartsModule]),
})
export class SharedModule { }
