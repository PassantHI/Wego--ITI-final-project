import { Routes } from '@angular/router';
import { AllLocationsComponent } from './all-locations/all-locations.component';
import { LocationDetailsComponent } from './location-details/location-details.component';
import { DeleteLocationComponent } from './delete-location/delete-location.component';
import { UpdateLocationComponent } from './update-location/update-location.component';
import { NewLocationComponent } from './new-location/new-location.component';

export const dashboardLocationRoutes: Routes = [
  {
    path: '',
    component: AllLocationsComponent,
    children: [
      {
        path: 'details/:id',
        component: LocationDetailsComponent,
      },
      {
        path: 'delete/:id',
        component: DeleteLocationComponent,
      },
      {
        path: 'update/:id',
        component: UpdateLocationComponent,
      },
      {
        path: 'add',
        component: NewLocationComponent,
      },
    ],
  },
];
