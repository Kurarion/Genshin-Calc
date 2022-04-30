import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Const } from './shared/shared.module';

const routes: Routes = [
  // {
  //   path: Const.menu_1,
  //   loadChildren: () =>
  //     import('./feature/test1/test1.module').then((m) => m.Test1Module),
  // },
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
