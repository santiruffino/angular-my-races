import { AuthService } from '../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CrudService } from 'src/app/services/crud.service';
import { Datepicker, initTE, Input } from 'tw-elements';
import { RaceFirebase } from 'src/app/interfaces/race';
import { AngularFireAnalytics } from '@angular/fire/compat/analytics';
import {
  faArrowLeft,
  faBars,
  faCircleExclamation,
  faCircleInfo,
  faHouse,
  faRightFromBracket,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  templateUrl: './edit-race.component.html',
  styleUrls: ['./edit-race.component.css'],
})
export class EditRaceComponent implements OnInit {
  key: string = '';
  public raceForm: FormGroup = this.fb.group({
    key: [],
    name: ['', Validators.required],
    distanceValue: [Validators.required],
    distanceUnit: [Validators.required],
    elevationGain: [0],
    date: [Validators.required],
    hoursTime: [null, Validators.required],
    minutesTime: [null, Validators.required],
    secondsTime: [null, Validators.required],
    surface: [null, Validators.required],
  });
  invalidControls: string[] = [];
  externalActivity = false;
  races: any;
  raceKey: string = this.route.snapshot.paramMap.get('key') || '';
  isLoading: boolean = true;
  faBars = faBars;
  faHouse = faHouse;
  faRightFromBracket = faRightFromBracket;
  faCircleExclamation = faCircleExclamation;
  faCircleInfo = faCircleInfo;
  formatedTime!: string;
  isCreatingRace: boolean = false;
  editRaceError: boolean = false;
  surfacesValues: string[] = ['calle', 'trail', 'cross', 'otros'];
  faArrowLeft = faArrowLeft;
  raceCreated = false;

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

  fillRaceForm(raceInfo: RaceFirebase) {
    const timeArray = raceInfo.time.split(':');
    this.raceForm.controls['key'].setValue(this.raceKey);
    this.raceForm.controls['name'].setValue(raceInfo.name);
    this.raceForm.controls['distanceValue'].setValue(raceInfo.distanceValue);
    this.raceForm.controls['distanceUnit'].setValue(raceInfo.distanceUnit);
    this.raceForm.controls['elevationGain'].setValue(
      raceInfo.elevationGain ? raceInfo.elevationGain : 0
    );
    this.raceForm.controls['date'].setValue(raceInfo.date);
    this.raceForm.controls['hoursTime'].setValue(timeArray[0]);
    this.raceForm.controls['minutesTime'].setValue(timeArray[1]);
    this.raceForm.controls['secondsTime'].setValue(timeArray[2]);
    this.raceForm.controls['surface'].setValue(raceInfo.surface);
    if (raceInfo.externalActivityUrl && raceInfo.externalActivityUrl !== '') {
      this.externalActivity = true;
      this.raceForm.addControl(
        'externalActivityUrl',
        new FormControl('', Validators.required)
      );
      this.raceForm.controls['externalActivityUrl'].setValue(
        raceInfo.externalActivityUrl
      );
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
    this.formatedTime = newNumber;
  }

  hideErrorAlert() {
    this.editRaceError = false;
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
      distanceValue: this.raceForm.controls['distanceValue'].value,
      distanceUnit: this.raceForm.controls['distanceUnit'].value,
      elevationGain: this.raceForm.controls['elevationGain'].value,
      time: `${this.raceForm.value.hoursTime}:${this.raceForm.value.minutesTime}:${this.raceForm.value.secondsTime}`,
      date: this.raceForm.controls['date'].value,
      surface: this.raceForm.controls['surface'].value,
      externalActivityUrl:
        this.raceForm.controls['externalActivityUrl']?.value || '',
    };

    if (this.raceKey) {
      this.analytics.logEvent('Edit Race - Edit Race Start');
      this.crudApi
        .updateRace(this.raceKey, newData)
        .then(() => {
          this.raceCreated = true;
          this.analytics.logEvent('Edit Race - Edit Race Success');
          this.resetForm();
          setTimeout(() => {
            this.router.navigate(['races']);
          }, 1000);
        })
        .catch((err) => {
          this.analytics.logEvent('Edit Race - Edit Race Error');
          console.error(err);
        });
    }
  }

  resetForm() {
    this.raceForm.reset();
  }
}
