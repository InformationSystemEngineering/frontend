import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';

import { AuthServiceService } from '../infrastructure/auth/register/auth-service.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthServiceService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.authService.isLogged()) return true;

    this.router.navigate(['auth/login'], {
      queryParams: { returnUrl: state.url },
    });
    return false;
  }
}
