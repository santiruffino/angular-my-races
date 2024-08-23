import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-new-login',
  templateUrl: './new-login.component.html',
  styleUrls: ['./new-login.component.css'],
})
export class NewLoginComponent implements OnInit {
  public bgImagesList = ['bg-1.jpg', 'bg-2.jpg'];
  backgroundUrlString!: string;
  bgImageSelected!: string;

  constructor(public authService: AuthService) {
    this.getRandomImage();
  }

  ngOnInit(): void {}

  getRandomImage() {
    this.bgImageSelected =
      this.bgImagesList[Math.floor(Math.random() * this.bgImagesList.length)];
    this.backgroundUrlString = `url("./assets/images/${this.bgImageSelected}")`;
  }
}
