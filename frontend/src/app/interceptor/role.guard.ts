import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';

import { AuthServiceService } from '../infrastructure/auth/register/auth-service.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthServiceService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const requiredRole = route.data['roles'] as string;
    if (!requiredRole.includes(this.authService.getUserRole())) return false;
    return true;
  }
}
