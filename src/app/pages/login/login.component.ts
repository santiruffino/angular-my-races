import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { AngularFireAnalytics } from '@angular/fire/compat/analytics';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup = this.fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  });
  invalidControls: string[] = [];
  showPassword: boolean = false;
  faEye = faEye;
  faEyeSlash = faEyeSlash;

  constructor(
    public authService: AuthService,
    private fb: FormBuilder,
    private analytics: AngularFireAnalytics
  ) {}

  ngOnInit(): void {}

  public findInvalidControls() {
    const invalid = [];
    const controls = this.loginForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }

  login() {
    this.analytics.logEvent('Login - Login Button Click');
    if (!this.loginForm.valid) {
      this.invalidControls = this.findInvalidControls();
      this.analytics.logEvent('Login - Login Error - Form Invalid');
      return;
    }
    this.analytics.logEvent('Login - Login Error Sucess');
    this.authService.signIn(
      this.loginForm.controls['email'].value,
      this.loginForm.controls['password'].value
    );
  }

  showPasswordToggle() {
    this.showPassword = !this.showPassword;
  }
}
