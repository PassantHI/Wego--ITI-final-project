import { Routes } from '@angular/router';
import { AirlineDetailsComponent } from './airline-detials/airline-details.component';
import { AllAirlinesComponent } from './all-airlines/all-airlines.component';
import { DeleteAirlineComponent } from './delete-airline/delete-airline.component';
import { NewAirlineComponent } from './new-airline/new-airline.component';
import { UpdateAirlineComponent } from './update-airline/update-airline.component';

export const dashboardAirlineRoutes: Routes = [
  {
    path: '',
    component: AllAirlinesComponent,
    children: [
      {
        path: 'details/:id',
        component: AirlineDetailsComponent,
      },
      {
        path: 'delete/:id',
        component: DeleteAirlineComponent,
      },
      {
        path: 'update/:id',
        component: UpdateAirlineComponent,
      },
      {
        path: 'add',
        component: NewAirlineComponent,
      },
    ],
  },
];
