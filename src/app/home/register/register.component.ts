import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user';
import { isEqual } from '../directives/is-equal.directive'
import { NotificationService } from 'src/app/shared/services/notification.service';

@Component({
  selector: 'register-component',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.pattern(/^(?!\s*$).+/)]),
    email: new FormControl('', [Validators.required, Validators.pattern(/\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)]),
    password: new FormControl('', [Validators.required, Validators.pattern(/^(?!\s*$).+/), isEqual('confirmPassword')]),
    confirmPassword: new FormControl('', [Validators.required, Validators.pattern(/^(?!\s*$).+/), isEqual('password')])
  })

  usernameExists = false
  emailExists = false
  loading = false

  errors = {
    username: [],
    email: [],
    password: [],
    confirmPassword: []
  }

  constructor(private userService: UserService, private notification: NotificationService) { }

  ngOnInit(): void { }

  onSubmit() {
    this.loading = true
    const user = {
        username: this.registerForm.get('username').value,
        email: this.registerForm.get('email').value,
        password:  this.registerForm.get('password').value
    }
    this.userService.create(user).subscribe(resp => {
        this.loading = false
        this.registerForm.reset({
            username: '',
            email: '',
            password:  '',
            confirmPassword: ''
        })
        this.notification.success('e-mail de validação do cadastro enviado!')
    }, error => {
        this.loading = false
        if (!error.status) {
            return this.notification.danger('Não foi possível se comunicar com o servidor! Por favor, tente novamente mais tarde.')    
        }
        return this.notification.danger(error.error.errors[0].message)
    })
  }

  checkEmail() {
    this.emailExists = true
    const email = this.registerForm.get('email').value
    if (email.trim()) {
        this.userService.exists('email', email).subscribe(resp => {
            this.emailExists = resp.exists
            if (resp.exists) this.errors.email.push('endereço de e-mail em uso')
        }, error => {
            if (!error.status) {
                return this.notification.danger('Não foi possível se comunicar com o servidor! Por favor, tente novamente mais tarde.')    
            }
            return this.notification.danger(error.error.errors[0].message)
        })
    }
  }

  checkUsername() {
    this.usernameExists = true
    const username = this.registerForm.get('username').value
    if (username.trim()) {
        this.userService.exists('username', username).subscribe(resp => {
            this.usernameExists = resp.exists
            if (resp.exists) this.errors.username.push('nome de usuário em uso')
        }, error => {
            if (!error.status) {
                return this.notification.danger('Não foi possível se comunicar com o servidor! Por favor, tente novamente mais tarde.')    
            }
            return this.notification.danger(error.error.errors[0].message)
        })
    }
  }

  checkErrors(field) {
    this.errors[field] = []
    const { errors } = this.registerForm.get(field)
    if (errors) {
        if (errors.required) this.errors[field].push('Este campo é obrigatório!')
        if (errors.pattern) this.errors[field].push('Valor inválido!')
    }
  }

  checkPasswords(triggerField, goalField) {
    this.registerForm.get(goalField).updateValueAndValidity()
    const triggerErrors = this.registerForm.get(triggerField).errors
    const goalErrors = this.registerForm.get(goalField).errors
    if (triggerErrors?.isEqualValidationFailed || goalErrors?.isEqualValidationFailed)
      this.errors.confirmPassword.push('As senhas não conferem!')
    else
      this.errors[goalField] = []
  }
}
