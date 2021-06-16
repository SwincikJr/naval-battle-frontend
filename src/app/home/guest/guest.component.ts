import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { UserService } from '../services/user';

@Component({
  selector: 'guest-component',
  templateUrl: './guest.component.html',
  styleUrls: ['./guest.component.css']
})
export class GuestComponent implements OnInit {

  guestForm = new FormGroup({
    guest: new FormControl('', [Validators.required, Validators.pattern(/^(?!\s*$).+/)])
  })

  loading = false
  guestError = false
  guestErrorLabel = ''

  constructor(
    private userService: UserService, 
    private notification: NotificationService, 
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  onSubmit() {
    this.loading = true
    const username = this.guestForm.get('guest').value
    this.userService.guest(username).subscribe(resp => {
      this.loading = false
      localStorage.setItem('artemisia_user', JSON.stringify(resp))
      this.router.navigateByUrl('/home')
    }, error => {
      this.loading = false
      if (!error.status) {
        return this.notification.danger('Não foi possível se comunicar com o servidor! Por favor, tente novamente mais tarde.')    
      }
      if (error.status === 500) {
        return this.notification.danger(error.error.errors[0].message)
      }
      this.guestError = true,
      this.guestErrorLabel = error.error.errors[0].message
    })
  }

}
