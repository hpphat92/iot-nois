import { Routes, RouterModule } from '@angular/router';

import { ResetPasswordComponent } from './resetpassword.component';

const routes: Routes = [
  {
    path: '',
    component: ResetPasswordComponent,
  }
];

export const routing = RouterModule.forChild(routes);