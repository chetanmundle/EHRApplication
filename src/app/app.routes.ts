import { Routes } from '@angular/router';
import { AuthComponent } from './pages/auth/auth/auth.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { ProviderRegisterComponent } from './pages/auth/provider-register/provider-register.component';
import { PatientRegisterComponent } from './pages/auth/patient-register/patient-register.component';

import { authGuard } from './core/Guards/auth.guard';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { HomePatientComponent } from './pages/org/Patient/home-patient/home-patient.component';
import { HomeProviderComponent } from './pages/org/Provider/home-provider/home-provider.component';
import { OrgComponent } from './pages/org/org/org.component';
import { ForgotPasswordComponent } from './pages/auth/forgot-password/forgot-password.component';
import { BookAppointmentComponent } from './pages/org/Patient/book-appointment/book-appointment.component';
import { ProviderBookAppointmentComponent } from './pages/org/Provider/provider-book-appointment/provider-book-appointment.component';
import { ViewAppoinmentComponent } from './pages/org/Provider/view-appoinment/view-appoinment.component';
import { ProfileComponent } from './pages/org/profile/profile.component';
import { ChatListComponent } from './pages/Chat/chat-list/chat-list.component';
import { ChatDetailComponent } from './pages/Chat/chat-detail/chat-detail.component';
import { TestComponent } from './pages/test/test.component';

// const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);

export const routes: Routes = [
  // {
  //   path: 'signup',
  //   component: SignupComponent,
  // },
  // {
  //   path: 'login',
  //   component: LoginComponentT,
  // },
  // {
  //   path: 'chat',
  //   component: ChatListComponent,
  //   ...canActivate(redirectUnauthorizedToLogin),
  // },
  // {
  //   path: 'chat/:chatId',
  //   component: ChatDetailComponent,
  //   ...canActivate(redirectUnauthorizedToLogin),
  // },
  // {
  //   path: 'new-chat',
  //   component: NewChatComponent,
  //   ...canActivate(redirectUnauthorizedToLogin),
  // },
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
      {
        path: 'Forgot-Password',
        component: ForgotPasswordComponent,
      },
    ],
  },
  {
    path: 'org',
    component: OrgComponent,
    children: [
      {
        path: 'Provider/Home',
        component: HomeProviderComponent,
        title: 'Home Page',
        canActivate: [authGuard],
        data: { roles: ['Provider'] },
      },
      {
        path: 'Patient/Home',
        component: HomePatientComponent,
        title: 'Home Page',
        canActivate: [authGuard],
        data: { roles: ['Patient'] },
      },
      {
        path: 'Patient/BookAppointment',
        component: BookAppointmentComponent,
        canActivate: [authGuard],
        data: { roles: ['Patient'] },
      },
      {
        path: 'Provider/BookAppointment',
        component: ProviderBookAppointmentComponent,
        canActivate: [authGuard],
        data: { roles: ['Provider'] },
      },
      {
        path: 'Provider/ViewAppointment/:appointmentId',
        component: ViewAppoinmentComponent,
        canActivate: [authGuard],
        data: { roles: ['Provider', 'Patient'] },
      },

      {
        path: 'Profile',
        component: ProfileComponent,
        canActivate: [authGuard],
        data: { roles: ['Provider', 'Patient'] },
      },
      {
        path: 'Chat',
        component: ChatListComponent,
        canActivate: [authGuard],
        data: { roles: ['Provider', 'Patient'] },
      },
      {
        path: 'chat/:chatId',
        component: ChatDetailComponent,
        canActivate: [authGuard],
        data: { roles: ['Provider', 'Patient'] },
      },
    ],
  },
  {
    path: 'test',
    component: TestComponent,
  },
  {
    path: '**',
    component: PageNotFoundComponent,
  },
];
