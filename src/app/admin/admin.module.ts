import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module'
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { AdminLoginComponent } from './login/admin-login.component';
import { AdminService } from './services/admin.service'
import { HttpService } from '../shared/services/http.service';
import { BrowserModule } from '@angular/platform-browser';
import { AdminHomeComponent } from './home/admin-home.component';
import { AdminGameComponent } from './game/admin-game.component';
import { NotificationService } from '../shared/services/notification.service';

@NgModule({
  declarations: [
    AdminLoginComponent,
    AdminHomeComponent,
    AdminGameComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ],
  providers: [AdminService, HttpService, NotificationService]
})
export class AdminModule { }
