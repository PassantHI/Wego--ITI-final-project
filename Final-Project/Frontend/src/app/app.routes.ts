import { Routes } from '@angular/router';
import { FlightsComponent } from './main/flights//flights-home/flights.component';
import { HotelsHomeComponent } from './main/rooms/hotels-home/hotels-home.component';
import { DashboardAccessGuard } from './_guards/dashboard-access.guard';
import { FlightsFilterComponent } from './main/flights/flights-filter/flights-filter.component';
import { HotelDetailsComponent } from './main/rooms/hotel-details/hotel-details.component';
import { HotelFilterComponent } from './main/rooms/hotel-filter/hotel-filter.component';
import { HotelsComponent } from './main/rooms/hotels/hotels.component';
import { CheckoutComponent } from './main/rooms/checkout/checkout.component';
import { EmailConfirmComponent } from './main/account/email-confirm/email-confirm.component';

export const routes: Routes = [
  {
    path: 'home',
    component: FlightsComponent,
  },
  {
    path: 'flights',
    component: FlightsComponent,
  },
  {
    path: 'flights/search',
    component: FlightsFilterComponent,
  },

  {
    path: 'hotels',
    component: HotelsHomeComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: HotelsComponent,
      },
      { path: 'rooms/:country', component: HotelFilterComponent },
    ],
  },
  { path: 'hotels/details/:id', component: HotelDetailsComponent },
  { path: 'checkout', component: CheckoutComponent },
  {
    path: 'account',
    loadChildren: () =>
      import('./main/account/account-routes').then((r) => r.accountRoutes),
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./dashboard/dashboard-routes').then((r) => r.dashboardRoutes),
    canActivate: [DashboardAccessGuard],
  },
  {
    path: 'emailconfirme',
    component: EmailConfirmComponent,
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
];
