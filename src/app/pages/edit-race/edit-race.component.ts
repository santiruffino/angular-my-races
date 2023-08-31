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
import {
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
    console.log(raceInfo);
    this.raceForm.controls['key'].setValue(this.raceKey);
    this.raceForm.controls['name'].setValue(raceInfo.name);
    this.raceForm.controls['distanceValue'].setValue(raceInfo.distanceValue);
    this.raceForm.controls['distanceUnit'].setValue(raceInfo.distanceUnit);
    this.raceForm.controls['date'].setValue(raceInfo.date);
    this.raceForm.controls['time'].setValue(raceInfo.time);
    this.raceForm.controls['surface'].setValue(raceInfo.surface);
    if (raceInfo.externalActivityUrl) {
      this.externalActivity = true;
      this.raceForm.addControl(
        'externalActivityUrl',
        new FormControl('', Validators.required)
      );
      this.raceForm.controls['externalActivityUrl'].setValue(
        raceInfo.externalActivityUrl
      );
      console.log(this.externalActivity);
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
    console.log(newNumber);
    this.formatedTime = newNumber;
  }

  hideErrorAlert() {
    this.editRaceError = false;
  }

  saveRaceChanges() {
    console.log(this.raceForm.value);
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
      time: this.raceForm.controls['time'].value,
      date: this.raceForm.controls['date'].value,
      surface: this.raceForm.controls['surface'].value,
      externalActivityUrl:
        this.raceForm.controls['externalActivityUrl'].value || '',
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
          console.error(err);
        });
    }
  }
}
