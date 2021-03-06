import { Routes, RouterModule } from '@angular/router';
import { Pages } from './pages.component';
import { AuthGuard } from '../services/AuthGuard';
import { ModuleWithProviders } from '@angular/core';
// noinspection TypeScriptValidateTypes

// export function loadChildren(path) { return System.import(path); };

export const routes: Routes = [
  {
    path: 'login',
    loadChildren: 'app/pages/login/login.module#LoginModule',
  },
  {
    path: 'signup',
    loadChildren: 'app/pages/signup/signup.module#SignupModule',
  },
  {
    path: 'forgotpassword',
    loadChildren: 'app/pages/forgotpassword/forgotpassword.module#ForgotPasswordModule',
  },
  {
    path: 'resetpassword/:token',
    loadChildren: 'app/pages/resetpassword/resetpassword.module#ResetPasswordModule',
  },
  {
    path: 'pages',
    component: Pages,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full', canActivate: [AuthGuard] },
      { path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardModule', canActivate: [AuthGuard] },
      { path: 'users', loadChildren: './users/user.module#UserModule', canActivate: [AuthGuard] },
      { path: 'farms', loadChildren: './farms/farm.module#FarmModule', canActivate: [AuthGuard] },
      { path: 'areas', loadChildren: './areas/area.module#AreaModule', canActivate: [AuthGuard] },
      { path: 'sensors', loadChildren: './sensors/sensor.module#SensorModule', canActivate: [AuthGuard] },
      { path: 'profile', loadChildren: './profile/profile.module#ProfileModule', canActivate: [AuthGuard] },
      { path: 'change-password', loadChildren: './change-password/change-password.module#ChangePasswordModule', canActivate: [AuthGuard] },
      { path: 'view-area/:id', loadChildren: './view-area/view-area.module#ViewAreaModule', canActivate: [AuthGuard] },
      { path: 'area-detail/:id', loadChildren: './area-detail/area-detail.module#AreaDetailModule', canActivate: [AuthGuard] },
    ],
  },
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
