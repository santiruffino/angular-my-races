import { Component, OnInit } from '@angular/core';
import { AngularFireAnalytics } from '@angular/fire/compat/analytics';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import {
  faArrowLeft,
  faBars,
  faCircleExclamation,
  faCircleInfo,
  faHouse,
  faRightFromBracket,
} from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'src/app/services/auth.service';
import { CrudService } from 'src/app/services/crud.service';
import { Datepicker, initTE, Input } from 'tw-elements';
import { RaceForm } from '../../interfaces/race';

@Component({
  selector: 'app-add-race',
  templateUrl: './add-race.component.html',
  styleUrls: ['./add-race.component.css'],
})
export class AddRaceComponent implements OnInit {
  public raceForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    distanceValue: [null, Validators.required],
    distanceUnit: ['Km', Validators.required],
    elevationGain: [0],
    date: [null, Validators.required],
    hoursTime: [null, Validators.required],
    minutesTime: [null, Validators.required],
    secondsTime: [null, Validators.required],
    surface: [null, Validators.required],
  });
  surfacesValues: string[] = ['calle', 'trail', 'cross', 'otros'];
  nameInvalid: boolean = false;
  externalActivity: boolean = false;
  invalidControls: string[] = [];
  createRaceError: boolean = false;
  isCreatingRace: boolean = false;
  formatedTime!: string;
  faRightFromBracket = faRightFromBracket;
  faHouse = faHouse;
  faCircleExclamation = faCircleExclamation;
  faBars = faBars;
  faCircleInfo = faCircleInfo;
  faArrowLeft = faArrowLeft;
  raceCreated = false;

  constructor(
    public fb: FormBuilder,
    public crudApi: CrudService,
    public authService: AuthService,
    public router: Router,
    private analytics: AngularFireAnalytics
  ) {}

  ngOnInit(): void {
    initTE({ Datepicker, Input });
    this.raceForm.controls['distanceUnit'].setValue('km');
  }

  toggleExternalActivityLink(event: any) {
    this.externalActivity = event.target.checked;
    this.analytics.logEvent(
      `Add Race - External Activity Toggle - ${this.externalActivity}`
    );
    this.externalActivity
      ? this.raceForm.addControl(
          'externalActivityUrl',
          new FormControl('', Validators.required)
        )
      : this.raceForm.removeControl('externalActivityUrl');
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
    this.analytics.logEvent('Add Race - Create Race Button Click');
    const finalForm: RaceForm = {
      name: this.raceForm.value.name,
      distanceValue: this.raceForm.value.distanceValue,
      distanceUnit: this.raceForm.value.distanceUnit,
      elevationGain: this.raceForm.value.elevationGain,
      date: this.raceForm.value.date,
      time: `${this.raceForm.value.hoursTime}:${this.raceForm.value.minutesTime}:${this.raceForm.value.secondsTime}`,
      surface: this.raceForm.value.surface,
      externalActivityUrl: this.raceForm.value.externalActivityUrl
        ? this.raceForm.value.externalActivityUrl
        : null,
    };
    if (!this.raceForm.valid) {
      this.analytics.logEvent('Add Race - Create Race Error - Form Invalid');
      this.invalidControls = this.findInvalidControls();
      return;
    }
    try {
      this.isCreatingRace = true;
      this.analytics.logEvent('Add Race- Create Race Start');
      this.crudApi
        .addRace(finalForm)
        .then((result): any => {
          this.raceCreated = true;
          this.analytics.logEvent('Add Race - Create Race Success');
          this.resetForm();
          setTimeout(() => {
            this.router.navigate(['races']);
          }, 1000);
        })
        .catch((error: any) => {
          console.error('Error: ', error.message);
          this.analytics.logEvent('Add Race - Create Race Error');
          this.createRaceError = true;
          this.isCreatingRace = false;
        });
    } catch (error: any) {
      console.error('Error', error.message);
      this.analytics.logEvent('Add Race - Create Race Error');
      this.createRaceError = true;
      this.isCreatingRace = false;
    }
  }

  resetForm() {
    this.raceForm.reset();
  }

  hideErrorAlert() {
    this.createRaceError = false;
  }
}
