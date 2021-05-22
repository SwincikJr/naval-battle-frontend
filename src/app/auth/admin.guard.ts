import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AdminService } from '../admin/services/admin.service';
import { UserService } from '../home/services/user';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor (private router: Router, public adminService: AdminService) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if (!this.adminService.isAuthenticated()) {
        this.router.navigateByUrl('/admin/login')
        return false

      }
      return true
  }
  
}
