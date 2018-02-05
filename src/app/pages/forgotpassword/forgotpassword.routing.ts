import { Routes, RouterModule } from '@angular/router';

import { ForgotPasswordComponent } from './forgotpassword.component';

const routes: Routes = [
  {
    path: '',
    component: ForgotPasswordComponent
  }
];

export const routing = RouterModule.forChild(routes);