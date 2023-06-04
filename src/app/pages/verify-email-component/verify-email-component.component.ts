import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  templateUrl: './verify-email-component.component.html',
  styleUrls: ['./verify-email-component.component.css'],
})
export class VerifyEmailComponentComponent implements OnInit {
  constructor(public authService: AuthService) {}

  ngOnInit(): void {}
}
