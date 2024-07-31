import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AngularMaterialModule} from 'src/app/angular-material.module';
import {TranslateModule} from '@ngx-translate/core';

import {MainComponent} from './component/main/main.component';
export {MainComponent} from './component/main/main.component';

@NgModule({
  declarations: [MainComponent],
  imports: [CommonModule, AngularMaterialModule, TranslateModule],
})
export class HomePageModule {}
