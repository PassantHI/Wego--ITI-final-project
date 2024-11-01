import { Routes } from '@angular/router';
import { AirplaneDetailsComponent } from './airplane-details/airplane-details.component';
import { AllAirplanesComponent } from './all-airplanes/all-airplanes.component';
import { DeleteAirplaneComponent } from './delete-airplane/delete-airplane.component';
import { NewAirplaneComponent } from './new-airplane/new-airplane.component';
import { UpdateAirplaneComponent } from './update-airplane/update-airplane.component';

export const dashboardAirplaneRoutes: Routes = [
  {
    path: '',
    component: AllAirplanesComponent,
    children: [
      {
        path: 'details/:id',
        component: AirplaneDetailsComponent,
      },
      {
        path: 'delete/:id',
        component: DeleteAirplaneComponent,
      },
      {
        path: 'update/:id',
        component: UpdateAirplaneComponent,
      },
      {
        path: 'add',
        component: NewAirplaneComponent,
      },
    ],
  },
];
