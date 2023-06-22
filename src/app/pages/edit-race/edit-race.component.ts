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
    time: [, Validators.required],
  });
  invalidControls: string[] = [];
  externalActivity!: boolean;
  races: any;
  raceKey: string = this.route.snapshot.paramMap.get('key') || '';
  isLoading: boolean = true;
  faBars = faBars;
  faHouse = faHouse;
  faRightFromBracket = faRightFromBracket;
  faCircleExclamation = faCircleExclamation;
  formatedTime!: string;
  isCreatingRace: boolean = false;
  editRaceError: boolean = false;

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
    this.raceForm.controls['distanceValue'].setValue(raceInfo.distanceValue);
    this.raceForm.controls['distanceUnit'].setValue(raceInfo.distanceUnit);
    this.raceForm.controls['date'].setValue(raceInfo.date);
    this.raceForm.controls['time'].setValue(raceInfo.time);
    if (raceInfo.externalActivityUrl) {
      this.raceForm.controls['externalActivityUrl'].setValue(raceInfo.externalActivityUrl);
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
    const testNumber = value.target.value;
    var foo = testNumber.split(':').join('');
    if (foo && foo.length > 0 && foo.length <= 6) {
      this.formatedTime = foo.match(new RegExp('.{1,2}', 'g'))!.join(':');
    }
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
      time: this.raceForm.controls['time'].value,
      date: this.raceForm.controls['date'].value,
      externalActivityUrl: this.raceForm.controls['externalActivityUrl'].value || '',
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
