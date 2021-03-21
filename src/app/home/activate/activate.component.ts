import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { UserService } from '../services/user';

@Component({
  selector: 'activate-component',
  templateUrl: './activate.component.html',
  styleUrls: ['./activate.component.css']
})
export class ActivateComponent implements OnInit {

  constructor(private route: ActivatedRoute, private router: Router, private notification: NotificationService, private user: UserService) { 
    this.route.queryParams.subscribe(params => {
        const email = params['e']
        const activation_key = params['k']
        this.user.activate(email, activation_key).subscribe(resp => {
            console.log(resp),
            this.router.navigateByUrl("/")
            this.notification.success(`E-mail confirmado com sucesso!`)
        }, error => {
            console.error(error)
            this.router.navigateByUrl("/")
            if (!error.status) {
                return this.notification.danger('Não foi possível se comunicar com o servidor! Por favor, tente novamente mais tarde.')
            }
            return this.notification.danger(error.error.errors[0].message)
        })
    })
  }

  ngOnInit(): void { }
}
