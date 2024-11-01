import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { jwtDecode } from 'jwt-decode';

export const DashboardAccessGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (!authService.isLoggedIn) {
    router.navigateByUrl('/account/login');
    return false;
  }
  const token = localStorage.getItem('token');
  if (!token) {
    router.navigateByUrl('/account/login');
    return false;
  }
  const data: any = jwtDecode(token);
  const role = data['role'];
  if (role === 'admin' || role === 'employee') return true;
  router.navigateByUrl('/');

  return false;
};
