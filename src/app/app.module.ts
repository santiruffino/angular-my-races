import { APP_INITIALIZER, ErrorHandler, NgModule } from '@angular/core';
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
import { AuthActionsComponent } from './pages/auth-actions/auth-actions.component';
import * as Sentry from '@sentry/angular-ivy';
import { Router } from '@angular/router';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
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
    AuthActionsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    FontAwesomeModule,
    HttpClientModule,
    TranslateModule.forRoot({
      defaultLanguage: 'es',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [
    { provide: FIREBASE_OPTIONS, useValue: environment.firebase },
    AuthService,
    GoogleAuthProvider,
    ScreenTrackingService,
    UserTrackingService,
    {
      provide: ErrorHandler,
      useValue: Sentry.createErrorHandler({
        showDialog: true,
      }),
    },
    {
      provide: Sentry.TraceService,
      deps: [Router],
    },
    {
      provide: APP_INITIALIZER,
      useFactory: () => () => {},
      deps: [Sentry.TraceService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
