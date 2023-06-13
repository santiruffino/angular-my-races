import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CrudService } from 'src/app/services/crud.service';
import { Datepicker, Input, initTE } from 'tw-elements';
import { Race } from 'src/app/interfaces/race';
import { AngularFireAnalytics } from '@angular/fire/compat/analytics';

@Component({
  templateUrl: './edit-race.component.html',
  styleUrls: ['./edit-race.component.css'],
})
export class EditRaceComponent implements OnInit {
  key: string = '';
  public raceForm: FormGroup = this.fb.group({
    key: [],
    name: ['', Validators.required],
    distance: [, Validators.required],
    date: [, Validators.required],
    time: [, Validators.required],
  });
  invalidControls: string[] = [];
  garminActivity!: boolean;
  races: any;
  raceKey: string = this.route.snapshot.paramMap.get('key') || '';
  isLoading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    public fb: FormBuilder,
    public crudApi: CrudService,
    public router: Router,
    public authService: AuthService,
    private analytics: AngularFireAnalytics
  ) {}

  ngOnInit(): void {
    initTE({ Datepicker, Input });
    this.crudApi
      .getRace(this.raceKey)
      .valueChanges()
      .subscribe((data) => {
        this.fillRaceForm(data);
        this.isLoading = false;
      });
  }

  fillRaceForm(raceInfo: Race) {
    this.raceForm.controls['key'].setValue(this.raceKey);
    this.raceForm.controls['name'].setValue(raceInfo.name);
    this.raceForm.controls['distance'].setValue(raceInfo.distance);
    this.raceForm.controls['date'].setValue(raceInfo.date);
    this.raceForm.controls['time'].setValue(raceInfo.time);
    if (raceInfo.garminUrl) {
      this.raceForm.controls['garminUrl'].setValue(raceInfo.garminUrl);
    }
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

  toggleGarminLink(event: any) {
    this.garminActivity = event.target.checked;
    this.garminActivity
      ? this.raceForm.addControl(
          'garminUrl',
          new FormControl('', Validators.required)
        )
      : this.raceForm.removeControl('garminUrl');
  }

  saveRaceChanges() {
    this.analytics.logEvent('Edit Race - Edit Race Button Click');
    if (!this.raceForm.valid) {
      this.analytics.logEvent('Edit Race - Edit Race Error - Form Invalid');
      this.invalidControls = this.findInvalidControls();
      return;
    }
    const newData = {
      name: this.raceForm.controls['name'].value,
      distance: this.raceForm.controls['distance'].value,
      time: this.raceForm.controls['time'].value,
      date: this.raceForm.controls['date'].value,
      garminUrl: this.raceForm.controls['garminUrl'].value || '',
    };

    if (this.raceKey) {
      this.analytics.logEvent('Edit Race - Edit Race Start');
      this.crudApi
        .updateRace(this.raceKey, newData)
        .then(() => {
          this.analytics.logEvent('Edit Race - Edit Race Success');
          this.router.navigate(['races']);
        })
        .catch((err) => {
          this.analytics.logEvent('Edit Race - Edit Race Error');
          console.log(err);
        });
    }
  }
}
