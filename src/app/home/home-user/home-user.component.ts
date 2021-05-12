import { Component, OnInit } from '@angular/core';
import { SocketService } from 'src/app/shared/services/socket.service';
import { UserService } from '../services/user';

@Component({
  selector: 'app-root',
  templateUrl: './home-user.component.html',
  styleUrls: ['./home-user.component.css'],
})
export class HomeUserComponent implements OnInit {
  
  public username: string = '';

  constructor(private userService: UserService, private socketService: SocketService) {}

  ngOnInit() {
    this.username = this.userService.authenticated.username;
    this.socketService.connect();
  }
}
