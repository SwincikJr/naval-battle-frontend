import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/shared/services/http.service';
import { AdminService } from '../services/admin.service';

@Component({
  selector: 'admin-login-component',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit { 

  public loading = false

  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  })

  constructor(
    public adminService: AdminService, 
    private httpService: HttpService,
    private router: Router
  ) { }

  ngOnInit() { }

  onSubmit() {
    this.loading = true
    const username = this.loginForm.get('username').value
    const password = this.loginForm.get('password').value
    this.adminService.authenticate(username, password).subscribe((resp: any) => {
      this.loading = false
      this.adminService.setAuthenticated(resp)
      this.router.navigateByUrl('/admin')
    }, error => { 
      this.loading = false
      this.httpService.HttpErrorHandler(error)
    })
  }
}
