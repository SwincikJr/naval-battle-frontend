import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { BattleComponent } from './battle/battle.component';
import { PreparationComponent } from './preparation/preparation.component'

const routes: Routes = [
  {
    path: 'preparation/:id', component: PreparationComponent, canActivate: [AuthGuard]
  },
  {
    path: 'battle/:id', component: BattleComponent, canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GameRoutingModule { }