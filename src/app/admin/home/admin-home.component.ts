import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/shared/services/http.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { AdminService } from '../services/admin.service';

@Component({
  selector: 'admin-home-component',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css']
})
export class AdminHomeComponent implements OnInit {

  constructor(
    public adminService: AdminService, 
    private httpService: HttpService,
    private router: Router,
    private notification: NotificationService
  ) { }

  ngOnInit() {
    this.adminService.listGames().subscribe((resp: Array<any>) => {
      this.adminService.games = resp.map(r => {
        r.totalVessels = r.playableVessels.reduce((acc, curr) => {
          return curr.amountPerPlayer + acc
        }, 0)
        return r
      })
    }, error => {
      this.httpService.HttpErrorHandler(error)
    })
  }

  deleteGame(id) {
    this.adminService.deleteGame(id).subscribe(() => {
      this.notification.success('Modalidade excluída com sucesso!')
      const deleted = this.adminService.games.find(g => g._id === id)
      const index = this.adminService.games.indexOf(deleted)
      this.adminService.games.splice(index, 1)
    }, error => {
      this.httpService.HttpErrorHandler(error)
    })
  }

  newGame() {
    this.router.navigateByUrl('/admin/game/new')
  }

  logoff() {
    this.adminService.logoff()
    this.router.navigateByUrl('/admin/login')
  }
}
