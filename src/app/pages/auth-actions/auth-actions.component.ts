import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  templateUrl: './auth-actions.component.html',
  styleUrls: ['./auth-actions.component.css'],
})
export class AuthActionsComponent implements OnInit {
  actionName: string = this.route.snapshot.paramMap.get('action') || '';
  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    console.log(this.actionName);
  }
}
