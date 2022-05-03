import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Const } from 'src/app/shared/shared.module';

const routes: Routes = 
[
  {
    path: Const.menu_1,
    loadChildren: () =>
      import('./features/character/character.module').then((m) => m.CharacterModule),
  },
  // {
  //   path: Const.menu_2,
  //   loadChildren: () =>
  //     import('./feature/test2/test2.module').then((m) => m.Test2Module),
  // },
  // {
  //   path: Const.menu_3,
  //   loadChildren: () =>
  //     import('./feature/test3/test3.module').then((m) => m.Test3Module),
  // },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
