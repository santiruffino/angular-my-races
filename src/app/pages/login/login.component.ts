import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

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

  constructor(public authService: AuthService, private fb: FormBuilder) {}

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
    if (!this.loginForm.valid) {
      this.invalidControls = this.findInvalidControls();
      return;
    }
    this.authService.signIn(
      this.loginForm.controls['email'].value,
      this.loginForm.controls['password'].value
    );
  }
}
