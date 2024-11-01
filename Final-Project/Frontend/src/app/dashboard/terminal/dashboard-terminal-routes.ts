import { Routes } from '@angular/router';
import { AllTerminalsComponent } from './all-terminals/all-terminals.component';
import { TerminalDetailsComponent } from './terminal-details/terminal-details.component';
import { DeleteTerminalComponent } from './delete-terminal/delete-terminal.component';
import { UpdateTerminalComponent } from './update-terminal/update-terminal.component';
import { NewTerminalComponent } from './new-terminal/new-terminal.component';

export const dashboardTerminalRoutes: Routes = [
  {
    path: '',
    component: AllTerminalsComponent,
    children: [
      {
        path: 'details/:id',
        component: TerminalDetailsComponent,
      },
      {
        path: 'delete/:id',
        component: DeleteTerminalComponent,
      },
      {
        path: 'update/:id',
        component: UpdateTerminalComponent,
      },
      {
        path: 'add',
        component: NewTerminalComponent,
      },
    ],
  },
];
