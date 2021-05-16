import { Injectable } from '@angular/core'
import { UserService } from 'src/app/home/services/user';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: "root",
})
export class SocketService {
    
    public socket: any = null;
    public readonly socketUrl: string = `${environment.socketUrl}`;

    constructor(private userService: UserService) {}

    connect() {
        this.socket = require('socket.io-client')(this.socketUrl, {
            transports: ["websocket"],
            upgrade: false,
            auth: {
              token: this.userService.getAuthenticated().token
            },
            query: {
              protocol: 'artemisia',
            }
        })
        
        return this.socket;
    }
}
