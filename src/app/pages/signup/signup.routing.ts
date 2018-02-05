import { Routes, RouterModule }  from '@angular/router';

import { Signup } from './signup.component';
import { ModuleWithProviders } from '@angular/core';

// noinspection TypeScriptValidateTypes
export const routes: Routes = [
  {
    path: '',
    component: Signup
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
