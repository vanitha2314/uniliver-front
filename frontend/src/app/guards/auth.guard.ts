import { Injectable, OnInit } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { tr } from 'date-fns/locale';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, OnInit {
  userData: any;
  constructor(private authService: AuthService, private router: Router) {}
  ngOnInit() {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const userDetails = this.authService.getUserDetails();
    if (userDetails && userDetails.token) {
      return true
    };
    this.router.navigate(['/auth/login'])
    return false;
  }
}
