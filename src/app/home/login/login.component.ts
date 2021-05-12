import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { UserService } from '../services/user';

@Component({
  selector: 'login-component',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm = new FormGroup({
    login: new FormControl('', [Validators.required, Validators.pattern(/^(?!\s*$).+/)]),
    password: new FormControl('', [Validators.required, Validators.pattern(/^(?!\s*$).+/)])
  })

  loading = false
  loginError = false
  loginErrorLabel = ''

  constructor(
    private userService: UserService, 
    private notification: NotificationService, 
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  onSubmit() {
    this.loading = true
    const login = this.loginForm.get('login').value
    const password = this.loginForm.get('password').value
    this.userService.authenticate(login, password).subscribe(resp => {
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
      this.loginError = true,
      this.loginErrorLabel = error.error.errors[0].message
    })
  }
}
