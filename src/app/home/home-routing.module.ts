import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { ActivateComponent } from './activate/activate.component';
import { HomeUserComponent } from './home-user/home-user.component';
import { HomeComponent } from './home.component';
import { MarketComponent } from './market/market.component';

const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'user/activate', component: ActivateComponent },
    { path: 'market', component: MarketComponent },
    { path: 'home', component: HomeUserComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }