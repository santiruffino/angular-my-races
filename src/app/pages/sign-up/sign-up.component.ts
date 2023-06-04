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

  constructor(public authService: AuthService, private fb: FormBuilder) {}

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
    if (!this.signUpForm.valid) {
      this.invalidControls = this.findInvalidControls();
      return;
    }
    this.authService.signUp(
      this.signUpForm.controls['email'].value,
      this.signUpForm.controls['password'].value
    );
  }
}
