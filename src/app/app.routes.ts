import { Routes } from '@angular/router';
import { AuthComponent } from './pages/auth/auth/auth.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { ProviderRegisterComponent } from './pages/auth/provider-register/provider-register.component';
import { PatientRegisterComponent } from './pages/auth/patient-register/patient-register.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/Login',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    component: AuthComponent,
    children: [
      {
        path: 'Login',
        component: LoginComponent,
        title: 'Login Page',
      },
      {
        path: 'Register/Provider',
        component: ProviderRegisterComponent,
        title: 'Provider Register Page',
      },
      {
        path: 'Register/Patient',
        component: PatientRegisterComponent,
        title: 'Patient Register Page',
      },
    ],
  },
];
