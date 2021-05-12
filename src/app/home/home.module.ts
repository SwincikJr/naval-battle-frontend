import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module'
import { LoginComponent } from './login/login.component'
import { RegisterComponent } from './register/register.component'
import { RecoveryComponent } from './recovery/recovery.component'
import { UserService } from './services/user'
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { NotificationService } from '../shared/services/notification.service';
import { ActivateComponent } from './activate/activate.component';
import { HomeUserComponent } from './home-user/home-user.component';
import { SocketService } from '../shared/services/socket.service'

@NgModule({
  declarations: [
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    RecoveryComponent,
    ActivateComponent,
    HomeUserComponent,
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ],
  providers: [
    UserService,
    NotificationService,
    SocketService
  ]
})
export class HomeModule { }
