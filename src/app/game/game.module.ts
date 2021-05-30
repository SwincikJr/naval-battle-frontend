import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameRoutingModule } from './game-routing.module'
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { PreparationComponent } from './preparation/preparation.component';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { BattleComponent } from './battle/battle.component'
import { SocketService } from '../shared/services/socket.service';

@NgModule({
  declarations: [PreparationComponent, BattleComponent],
  imports: [
    CommonModule,
    GameRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ],
  providers: [NgbModal, NgbModalConfig, SocketService]
})
export class GameModule { }
