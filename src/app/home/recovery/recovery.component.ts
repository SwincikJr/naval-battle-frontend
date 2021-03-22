import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { UserService } from '../services/user';

@Component({
  selector: 'recovery-component',
  templateUrl: './recovery.component.html',
  styleUrls: ['./recovery.component.css']
})
export class RecoveryComponent implements OnInit {

  recoveryForm = new FormGroup({
    login: new FormControl('', [Validators.required, Validators.pattern(/^(?!\s*$).+/)])
  })

  loading = false

  constructor(private user: UserService, private notification: NotificationService) { }

  ngOnInit(): void {
  }

  onSubmit() {
    this.loading = true
    const login = this.recoveryForm.get('login').value
    this.user.recovery(login).subscribe(resp => {
      this.loading = false
      this.notification.success('E-mail para redefinição da senha enviado!')
    }, error => {
      this.loading = false
      if (!error.status) {
        return this.notification.danger('Não foi possível se comunicar com o servidor! Por favor, tente novamente mais tarde.')    
      }
      return this.notification.danger(error.error.errors[0].message)
    })
  }

}
