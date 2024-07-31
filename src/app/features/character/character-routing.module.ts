import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MainComponent} from './component/main/main.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    data: {animation: 'characterPage'},
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CharacterRoutingModule {}
