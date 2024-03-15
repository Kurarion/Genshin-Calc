import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Const } from 'src/app/shared/shared.module';
import { MainComponent } from './features/homePage/homePage.module';
import { PreloadAllModules } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';

const routes: Routes = 
[
  {
    path: '',
    component:  MainComponent,
    data: { animation: 'homePage' },
  },
  {
    path: Const.MENU_CHARACTER,
    loadChildren: () =>
      import('./features/character/character.module').then((m) => m.CharacterModule),
  },
  {
    path: '**',
    redirectTo: '',
  }
];

@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot(
      routes,
      {
        preloadingStrategy: PreloadAllModules
      }
    )
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
