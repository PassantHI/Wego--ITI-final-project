import { Routes } from '@angular/router';

import { AllFlightsComponent } from './all-flights/all-flights.component';
import { DeleteFlightComponent } from './delete-flight/delete-flight.component';
import { UpdateFlightComponent } from './update-flight/update-flight.component';
import { NewFlightComponent } from './new-flight/new-flight.component';
import { FlightInfoComponent } from './flight-info/flight-info.component';

export const dashboardFlightRoutes: Routes = [
  {
    path: '',
     component: AllFlightsComponent,
    children: [
      {
        path: 'details/:id',
        component:FlightInfoComponent
      },
      {
        path: 'delete/:id',
        component: DeleteFlightComponent,
      },
      {
        path: 'update/:id',
        component: UpdateFlightComponent,
      },
      {
        path: 'add',
        component: NewFlightComponent,
      },
    ],
  },
];
