import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RaceCardComponent } from './components/race-card/race-card.component';
import { LoginComponent } from './pages/login/login.component';
import { AuthService } from './services/auth.service';
import { GoogleAuthProvider, provideAuth, getAuth } from '@angular/fire/auth';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import {
  provideAnalytics,
  getAnalytics,
  ScreenTrackingService,
  UserTrackingService,
} from '@angular/fire/analytics';
import { provideDatabase, getDatabase } from '@angular/fire/database';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { AngularFireModule, FIREBASE_OPTIONS } from '@angular/fire/compat';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AddRaceComponent } from './pages/add-race/add-race.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { VerifyEmailComponentComponent } from './pages/verify-email-component/verify-email-component.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { EditRaceComponent } from './pages/edit-race/edit-race.component';
import { ForgotPasswordSuccessComponent } from './pages/forgot-password-success/forgot-password-success.component';

@NgModule({
  declarations: [
    AppComponent,
    RaceCardComponent,
    LoginComponent,
    DashboardComponent,
    AddRaceComponent,
    SignUpComponent,
    ForgotPasswordComponent,
    VerifyEmailComponentComponent,
    EditRaceComponent,
    ForgotPasswordSuccessComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    FontAwesomeModule,
  ],
  providers: [
    { provide: FIREBASE_OPTIONS, useValue: environment.firebase },
    AuthService,
    GoogleAuthProvider,
    ScreenTrackingService,
    UserTrackingService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
