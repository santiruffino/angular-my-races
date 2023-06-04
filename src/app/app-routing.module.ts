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
  { path: 'login', component: LoginComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'verify-email-address', component: VerifyEmailComponentComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  {
    path: 'forgot-password-success',
    component: ForgotPasswordSuccessComponent,
  },
  { path: 'races', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'add-race', component: AddRaceComponent },
  { path: 'edit-race/:key', component: EditRaceComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
