import { Routes } from '@angular/router';
import { SignupComponent } from './pages/signup/signup.component';
import { OtpvalidationComponent } from './pages/otpvalidation/otpvalidation.component';
import { SetpasswordComponent } from './pages/setpassword/setpassword.component';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
    { path: '', redirectTo: '/signup', pathMatch: 'full' },
  {
  path: 'signup',
  title:'Signup',
  loadComponent: () =>
    import('./pages/signup/signup.component').then(m => m.SignupComponent), 
},
{
  path: 'otp-validation',
  loadComponent: () =>
    import('./pages/otpvalidation/otpvalidation.component').then(m => m.OtpvalidationComponent)
},
{
  path: 'set-password',
  loadComponent: () =>
    import('./pages/setpassword/setpassword.component').then(m => m.SetpasswordComponent)
},
  {path: 'login',
        title: 'login',
        loadComponent: () =>
          import('./pages/login/login.component').then((m) => m.LoginComponent)},
  {
        path: 'home',
        title: 'home',
        loadComponent: () =>
          import('./pages/home/home.component').then((m) => m.HomeComponent),
      },
  { path: '**', redirectTo: '/signup' }
];
