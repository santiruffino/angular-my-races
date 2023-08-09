import { AuthActionsComponent } from './pages/auth-actions/auth-actions.component';
import { ForgotPasswordSuccessComponent } from './pages/forgot-password-success/forgot-password-success.component';
import { EditRaceComponent } from './pages/edit-race/edit-race.component';
import { VerifyEmailComponentComponent } from './pages/verify-email-component/verify-email-component.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { AddRaceComponent } from './pages/add-race/add-race.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './pages/login/login.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/races', pathMatch: 'full' },
  {
    path: 'login',
    component: LoginComponent,
    data: { title: 'Iniciar Sesion' },
  },
  {
    path: 'sign-up',
    component: SignUpComponent,
    data: { title: 'Crear Cuenta' },
  },
  {
    path: 'verify-email-address',
    component: VerifyEmailComponentComponent,
    data: { title: 'Crear Cuenta' },
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
    data: { title: 'Crear Cuenta' },
  },
  {
    path: 'forgot-password-success',
    component: ForgotPasswordSuccessComponent,
    data: { title: 'Crear Cuenta' },
  },
  {
    path: 'races',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    data: { title: 'Mis Carreras' },
  },
  {
    path: 'add-race',
    component: AddRaceComponent,
    data: { title: 'Crear carrera' },
  },
  {
    path: 'edit-race/:key',
    component: EditRaceComponent,
    data: { title: 'Editar carrera' },
  },
  {
    path: 'auth-action/:action',
    component: AuthActionsComponent,
    data: { title: 'Auth Exitoso' },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
