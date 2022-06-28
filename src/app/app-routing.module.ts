import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Const } from 'src/app/shared/shared.module';
import { MainComponent } from './features/homePage/homePage.module';

const routes: Routes = 
[
  {
    path: '',
    component:  MainComponent
  },
  {
    path: Const.MENU_CHARACTER,
    loadChildren: () =>
      import('./features/character/character.module').then((m) => m.CharacterModule),
    data: { animation: 'characterPage' },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
