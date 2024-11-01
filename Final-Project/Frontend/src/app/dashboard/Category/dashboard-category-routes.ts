import { Routes } from '@angular/router';
import { AllCategoriesComponent } from './all-categories/all-categories.component';
import { CategoryDetailsComponent } from './category-detials/category-details.component';
import { DeleteCategoryComponent } from './delete-category/delete-category.component';
import { UpdateCategoryComponent } from './update-category/update-category.component';
import { NewCategoryComponent } from './new-category/new-categorycomponent';

export const dashboardCategoryRoutes: Routes = [
  {
    path: '',
    component: AllCategoriesComponent,
    children: [
      {
        path: 'details/:id',
        component: CategoryDetailsComponent,
      },
      {
        path: 'delete/:id',
        component: DeleteCategoryComponent,
      },
      {
        path: 'update/:id',
        component: UpdateCategoryComponent,
      },
      {
        path: 'add',
        component: NewCategoryComponent,
      },
    ],
  },
];
