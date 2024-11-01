import { Routes } from '@angular/router';
import { UserDashboardComponent } from './dashboard/dashboard.component';
import { loggedInGuard } from '../../_guards/logged-in.guard';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { LogoutComponent } from './logout/logout.component';
import { NotloggedGuard } from '../../_guards/not-logged.guard';
import { UserFlgihtBookingsComponent } from './user-flight-bookings/user-flight-bookings.component';
import { UserRoomsBookingComponent } from './user-rooms-booking/user-rooms-booking.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ResetComponent } from './forget-password/reset/reset.component';
import { ForgetComponent } from './forget-password/forget/forget.component';

export const accountRoutes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    component: UserDashboardComponent,
    children: [
      {
        path: '',
        redirectTo: 'flights',
        pathMatch: 'full',
      },
      {
        path: 'flights',
        component: UserFlgihtBookingsComponent,
      },
      {
        path: 'rooms',
        component: UserRoomsBookingComponent,
      },
      {
        path: 'change-password',
        component: ChangePasswordComponent,
      },
    ],
    canActivate: [NotloggedGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [loggedInGuard],
  },
  {
    path: 'signup',
    component: RegisterComponent,
    canActivate: [loggedInGuard],
  },
  {
    path: 'forget-password',
    component: ForgetComponent,
    canActivate: [loggedInGuard],
  },
  {
    path: 'reset-password',
    component: ResetComponent,
    canActivate: [loggedInGuard],
  },
  {
    path: 'logout',
    component: LogoutComponent,
  },
];
