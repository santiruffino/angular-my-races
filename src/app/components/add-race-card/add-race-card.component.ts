import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Datepicker, Input, initTE } from 'tw-elements';

@Component({
  selector: 'app-add-race-card',
  templateUrl: './add-race-card.component.html',
  styleUrls: ['./add-race-card.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddRaceCardComponent implements OnInit {
  public raceForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    distance: ['', Validators.required],
    date: ['', Validators.required],
    time: ['', Validators.required],
  });

  constructor(public fb: FormBuilder) {}

  ngOnInit(): void {
    initTE({ Datepicker, Input });
  }
}
