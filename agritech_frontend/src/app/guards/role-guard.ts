import { Injectable, inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  private auth = inject(AuthService);
  private router = inject(Router);

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const roles = route.data['roles'] as string[] | undefined;
    const userRole = this.auth.getRole();
    if (!userRole || (roles && !roles.includes(userRole))) {
      this.router.navigate(['/home']);
      return false;
    }
    return true;
  }
}
