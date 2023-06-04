import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { CrudService } from 'src/app/services/crud.service';
import { Datepicker, Input, initTE } from 'tw-elements';

@Component({
  selector: 'app-add-race',
  templateUrl: './add-race.component.html',
  styleUrls: ['./add-race.component.css'],
})
export class AddRaceComponent implements OnInit {
  public raceForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    distance: [, Validators.required],
    date: [, Validators.required],
    time: [, Validators.required],
  });
  nameInvalid: boolean = false;
  garminActivity: boolean = false;
  invalidControls: string[] = [];

  constructor(
    public fb: FormBuilder,
    public crudApi: CrudService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    initTE({ Datepicker, Input });
  }

  toggleGarminLink(event: any) {
    this.garminActivity = event.target.checked;
    this.garminActivity
      ? this.raceForm.addControl(
          'garminUrl',
          new FormControl('', Validators.required)
        )
      : this.raceForm.removeControl('garminUrl');
  }

  public findInvalidControls() {
    const invalid = [];
    const controls = this.raceForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }

  addRace() {
    if (!this.raceForm.valid) {
      this.invalidControls = this.findInvalidControls();
      return;
    }
    this.crudApi.addRace(this.raceForm.value);
    this.resetForm();
  }

  resetForm() {
    this.raceForm.reset();
  }
}
