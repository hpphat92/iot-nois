import { Routes, RouterModule } from '@angular/router';

import { ViewAreaComponent } from './view-area.component';
import { ModuleWithProviders } from '@angular/core';

// noinspection TypeScriptValidateTypes
export const routes: Routes = [
  {
    path: '',
    component: ViewAreaComponent,
    children: [
    ],
  },
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
