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
    public router: Router
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
    // LA DATA ESTA MOCKEADA!!!!
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
    const newData = {
      name: this.raceForm.controls['name'].value,
      distance: this.raceForm.controls['distance'].value,
      time: this.raceForm.controls['time'].value,
      date: this.raceForm.controls['date'].value,
      garminUrl: this.raceForm.controls['garminUrl'].value || '',
    };

    if (this.raceKey) {
      this.crudApi
        .updateRace(this.raceKey, newData)
        .then(() => {
          this.router.navigate(['races']);
        })
        .catch((err) => console.log(err));
    }
  }
}
