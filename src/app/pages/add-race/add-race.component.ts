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
  faBars,
  faCircleExclamation,
  faCircleInfo,
  faHouse,
  faRightFromBracket,
} from '@fortawesome/free-solid-svg-icons';
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
    distanceValue: [, Validators.required],
    distanceUnit: ['Km', Validators.required],
    date: [, Validators.required],
    time: [
      '',
      [
        Validators.required,
        Validators.maxLength(8),
        Validators.pattern('[0-9]{2}:[0-9]{2}:[0-9]{2}(.[0-9]{1,3})?'),
      ],
    ],
    surface: [null, Validators.required],
  });
  surfacesValues: string[] = ['Calle', 'Trail', 'Cross', 'Otros'];
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

  constructor(
    public fb: FormBuilder,
    public crudApi: CrudService,
    public authService: AuthService,
    public router: Router,
    private analytics: AngularFireAnalytics
  ) {}

  ngOnInit(): void {
    initTE({ Datepicker, Input });
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
    console.log(this.raceForm.value);
    if (!this.raceForm.valid) {
      this.analytics.logEvent('Add Race - Create Race Error - Form Invalid');
      this.invalidControls = this.findInvalidControls();
      return;
    }
    try {
      this.isCreatingRace = true;
      this.analytics.logEvent('Add Race- Create Race Start');
      this.crudApi
        .addRace(this.raceForm.value)
        .then((result): any => {
          this.analytics.logEvent('Add Race - Create Race Success');
          this.resetForm();
          this.router.navigate(['races']);
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

  formatRaceTime(value: any) {
    const number = value.target.value;
    var foo = number.split(':').join('');
    let newNumber = '';
    for (let i = 0; i < foo.length; i += 2) {
      if (i + 1 < foo.length - 1) {
        newNumber += foo.substring(i, i + 2) + ':';
      } else {
        newNumber += foo.substring(i);
      }
    }
    console.log(newNumber);
    this.formatedTime = newNumber;
  }
}
