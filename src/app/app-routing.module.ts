import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Const } from 'src/app/shared/shared.module';

const routes: Routes = 
[
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
