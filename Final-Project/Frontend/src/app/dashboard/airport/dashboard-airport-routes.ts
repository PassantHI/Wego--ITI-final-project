import { Routes } from '@angular/router';
import { AirportDetailsComponent } from './airport-details/airport-details.component';
import { AllAirportsComponent } from './all-airports/all-airports.component';
import { DeleteAirportComponent } from './delete-airport/delete-airport.component';
import { NewAirportComponent } from './new-airport/new-airport.component';
import { UpdateAirportComponent } from './update-airport/update-airport.component';

export const dashboardAirportRoutes: Routes = [
  {
    path: '',
    component: AllAirportsComponent,
    children: [
      {
        path: 'details/:id',
        component: AirportDetailsComponent,
      },
      {
        path: 'delete/:id',
        component: DeleteAirportComponent,
      },
      {
        path: 'update/:id',
        component: UpdateAirportComponent,
      },
      {
        path: 'add',
        component: NewAirportComponent,
      },
    ],
  },
];
