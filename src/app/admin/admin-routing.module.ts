import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminHomeComponent } from './home/admin-home.component'
import { AdminLoginComponent } from './login/admin-login.component'
import { AdminGuard } from '../auth/admin.guard'
import { AdminGameComponent } from './game/admin-game.component'

const routes: Routes = [
  { path: '', component: AdminHomeComponent, canActivate: [AdminGuard] },
  { path: 'login', component: AdminLoginComponent },
  { path: 'game/:id', component: AdminGameComponent, canActivate: [AdminGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }