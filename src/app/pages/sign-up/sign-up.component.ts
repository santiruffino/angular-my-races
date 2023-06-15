import { AngularFireAnalytics } from '@angular/fire/compat/analytics';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent implements OnInit {
  public signUpForm: FormGroup = this.fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  });
  invalidControls: string[] = [];

  constructor(
    public authService: AuthService,
    private fb: FormBuilder,
    private analytics: AngularFireAnalytics
  ) {}

  ngOnInit(): void {}

  public findInvalidControls() {
    const invalid = [];
    const controls = this.signUpForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }

  signUp() {
    this.analytics.logEvent('Sign Up - Sign Up Button Click');
    if (!this.signUpForm.valid) {
      this.analytics.logEvent('Sign Up - Sign Up - Form Invalid');
      this.invalidControls = this.findInvalidControls();
      return;
    }
    this.analytics.logEvent('Sign Up - Sign Up Success');
    this.authService.signUp(
      this.signUpForm.controls['email'].value,
      this.signUpForm.controls['password'].value
    );
  }
}
