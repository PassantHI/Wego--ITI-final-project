import { Routes } from '@angular/router';
import { DashboardBaseComponent } from './base/dashboard-base.component';
import { HomeComponent } from './home/home.component';
import { AllRoomsComponent } from './Room/all-rooms/all-rooms.component';
import { DeleteRoomComponent } from './Room/delete-room/delete-room.component';
import { NewRoomComponent } from './Room/new-room/new-room.component';
import { RoomDetailsComponent } from './Room/room-details/room-details.component';
import { UpdateRoomComponent } from './Room/update-room/update-room.component';

export const dashboardRoutes: Routes = [
  {
    path: '',
    component: DashboardBaseComponent,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        component: HomeComponent,
      },
      {
        path: 'airlines',
        loadChildren: () =>
          import('./Airline/dashboard-airline-routes').then(
            (r) => r.dashboardAirlineRoutes
          ),
      },
      {
        path: 'airplanes',
        loadChildren: () =>
          import('./Airplane/dashboard-airplane-routes').then(
            (r) => r.dashboardAirplaneRoutes
          ),
      },
      {
        path: 'airports',
        loadChildren: () =>
          import('./airport/dashboard-airport-routes').then(
            (r) => r.dashboardAirportRoutes
          ),
      },
      {
        path: 'flights',
        loadChildren: () =>
          import('./flight/dashboard-flight-routes').then(
            (r) => r.dashboardFlightRoutes
          ),
      },
      {
        path: 'terminals',
        loadChildren: () =>
          import('./terminal/dashboard-terminal-routes').then(
            (r) => r.dashboardTerminalRoutes
          ),
      },
      {
        path: 'categories',
        loadChildren: () =>
          import('./Category/dashboard-category-routes').then(
            (r) => r.dashboardCategoryRoutes
          ),
      },
      {
        path: 'locations',
        loadChildren: () =>
          import('./location/dashboard-location-routes').then(
            (r) => r.dashboardLocationRoutes
          ),
      },
      {
        path: 'rooms',
        component: AllRoomsComponent,
      },
      {
        path: 'rooms/details/:id',
        component: RoomDetailsComponent,
      },
      {
        path: 'rooms/delete/:id',
        component: DeleteRoomComponent,
      },
      {
        path: 'rooms/update/:id',
        component: UpdateRoomComponent,
      },
      {
        path: 'rooms/add',
        component: NewRoomComponent,
      },
    ],
  },
];
