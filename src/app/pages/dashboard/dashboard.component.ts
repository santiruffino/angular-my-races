import { Component, OnInit } from '@angular/core';
import { Login } from 'src/app/interfaces/login';
import { Race } from 'src/app/interfaces/race';
import { AuthService } from 'src/app/services/auth.service';
import { CrudService } from 'src/app/services/crud.service';

@Component({
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  allRaces: Race[] = [];
  hideWhenNoRace: boolean = false;
  noData: boolean = false;
  preLoader: boolean = true;
  userData: Login = {
    uid: '',
    email: '',
    emailVerified: false,
    displayName: '',
    photoURL: '',
  };
  localstorageJSON = JSON.parse(localStorage.getItem('user') || '{}');
  loading: boolean = true;
  allRacesByYear: any;
  panelOpenState = false;
  allComplete: boolean = true;
  allRacesMock: any;
  allRacesByYearMock: any;
  creatingNewRace: boolean = false;

  constructor(public crudApi: CrudService, public authService: AuthService) {}

  ngOnInit(): void {
    this.userData = this.authService.userData;
    this.dataState();
    let s = this.crudApi.getRacesList();
    s.snapshotChanges().subscribe((data) => {
      this.allRaces = [];
      data.forEach((item) => {
        let a: any = item.payload.toJSON();
        a['$key'] = item.key;
        this.allRaces.push(a as Race);
      });
      this.groupRacesByYear();
      this.orderRaces();
      this.loading = false;
    });
  }

  addRace() {
    this.creatingNewRace = true;
  }

  deleteRace(raceKey: string) {
    console.log(raceKey);
    // this.crudApi.deleteRace(raceKey);
  }

  scrollToYear(id: string, isMobile: boolean) {
    const el: HTMLElement | null = document.getElementById(id);
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    const checkbox: HTMLElement | null = document.getElementById('my-drawer-3');
    if (isMobile) {
      checkbox?.click();
    }
    const documentHtml = document.getElementById('dashboard');
    documentHtml?.blur();
  }

  dataState() {
    this.crudApi
      .getRacesList()
      .valueChanges()
      .subscribe((data) => {
        this.preLoader = false;
        if (data.length <= 0) {
          this.hideWhenNoRace = false;
          this.noData = true;
        } else {
          this.hideWhenNoRace = true;
          this.noData = false;
        }
      });
  }

  groupRacesByYear() {
    const groups = this.allRaces.reduce((groups: any, race) => {
      const date = new Date(race.date).getFullYear();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(race);
      return groups;
    }, {});

    // Edit: to add it in the array format instead
    const groupArrays = Object.keys(groups).map((date) => {
      return {
        date,
        races: groups[date],
      };
    });
    groupArrays.sort((a: any, b: any) => {
      if (a.date < b.date) return 1;
      if (a.date > b.date) return -1;
      return 0;
    });
    this.allRacesByYear = groupArrays;
  }

  orderRaces() {
    this.allRacesByYear.forEach((a: any) => {
      a.races.sort((a: any, b: any) => {
        if (a.date < b.date) return 1;
        if (a.date > b.date) return -1;
        return 0;
      });
    });
  }

  buildRacesByYearMock() {
    this.allRacesByYearMock = [
      {
        date: '2023',
        races: [
          {
            date: '2023-11-02T03:00:00.000Z',
            distance: '25',
            name: 'Aconcagua Ultra Trail',
            time: '03:27:17',
            $key: '-N3vyeaHvkEqj-7Pc-fi',
          },
        ],
      },
      {
        date: '2022',
        races: [
          {
            color: 'red',
            date: '2022-11-12T03:00:00.000Z',
            distance: 21,
            name: 'Valtellina Wine Trail',
            time: '02:27:27',
            type: 'trail',
            $key: '-NN-6ZuxhRJ3kXBlwqIk',
          },
          {
            color: 'orange',
            date: '2022-10-02T03:00:00.000Z',
            distance: 13,
            name: 'Black Rock El Durazno',
            time: '01:24:38',
            type: 'trail',
            $key: '-NDTQ1tPqEXw5e5sKsT5',
          },
          {
            color: 'red',
            date: '2022-07-09T03:00:00.000Z',
            distance: '26',
            name: 'Utacch',
            time: '02:56:50',
            type: 'trail',
            $key: '-N87Fktq9JAjUAvPH1J9',
          },
          {
            color: 'red',
            date: '2022-04-09T03:00:00.000Z',
            distance: 42,
            name: 'Patagonia Run',
            time: '06:56:39',
            type: 'trail',
            $key: '-N8akINY_zf3QjcOXY1p',
          },
          {
            color: 'red',
            date: '2022-03-06T03:00:00.000Z',
            distance: '22',
            name: 'Champa Ultra Race',
            time: '02:39:56',
            type: 'trail',
            $key: '-N1ktbdBZ6L13WkzMqZ8',
          },
        ],
      },
      {
        date: '2021',
        races: [
          {
            color: 'red',
            date: '2021-12-11T03:00:00.000Z',
            distance: '24',
            name: 'Black Rock Night Trail',
            time: '03:52:00',
            type: 'trail',
            $key: '-N3vx2hXxbtT9CvLGatA',
          },
          {
            color: 'orange',
            date: '2021-10-31T03:00:00.000Z',
            distance: '13',
            name: 'Black Rock El Durazno',
            time: '01:18:29',
            type: 'trail',
            $key: '-N3vxZZM_XXRePUAZTHt',
          },
          {
            color: 'red',
            date: '2021-10-02T03:00:00.000Z',
            distance: '26',
            name: 'Utacch',
            time: '03:08:00',
            type: 'trail',
            $key: '-N3vxhqf062DfduciVms',
          },
          {
            color: 'blue',
            date: '2021-09-05T03:00:00.000Z',
            distance: '10',
            name: 'Valholl',
            time: '01:40:45',
            type: 'trail',
            $key: '-N3vxsAp58M1R0dqK2zG',
          },
          {
            color: 'orange',
            date: '2021-03-07T03:00:00.000Z',
            distance: '11',
            name: 'Champa Ultra Race',
            time: '01:43:42',
            type: 'trail',
            $key: '-N3vy-m7Me84qDBMT239',
          },
          {
            color: 'red',
            date: '2021-02-07T03:00:00.000Z',
            distance: '22',
            name: 'Black Rock Night Trail',
            time: '03:10:20',
            type: 'trail',
            $key: '-N3vy75OgYhbqdGtejX5',
          },
        ],
      },
      {
        date: '2019',
        races: [
          {
            color: 'blue',
            date: '2019-11-17T03:00:00.000Z',
            distance: '10',
            name: '21K CBA',
            time: '00:51:00',
            type: 'street',
            $key: '-N3vyeaHvkEqj-7Pc-fi',
          },
        ],
      },
      {
        date: '2018',
        races: [
          {
            color: 'blue',
            date: '2018-04-22T03:00:00.000Z',
            distance: '10',
            name: 'Nat Geo Run',
            time: '00:53:16',
            type: 'street',
            $key: '-N3vyr_7GuxYdkR9nFSi',
          },
        ],
      },
      {
        date: '2017',
        races: [
          {
            color: 'blue',
            date: '2017-11-19T03:00:00.000Z',
            distance: '10',
            name: '21K CBA',
            time: '00:52:18',
            type: 'street',
            $key: '-N3vzRIek_UHScOtGs8n',
          },
        ],
      },
      {
        date: '2016',
        races: [
          {
            color: 'blue',
            date: '2016-12-10T03:00:00.000Z',
            distance: '8',
            name: 'Black Rock Night Trail',
            time: '01:03:43',
            type: 'trail',
            $key: '-N1kWzooXAnY3szFq5if',
          },
        ],
      },
    ];
  }

  buildRacesMock() {
    this.allRacesMock = [
      {
        color: 'blue',
        date: '2016-12-10T03:00:00.000Z',
        distance: '8',
        name: 'Black Rock Night Trail',
        time: '01:03:43',
        type: 'trail',
        $key: '-N1kWzooXAnY3szFq5if',
      },
      {
        color: 'red',
        date: '2022-03-06T03:00:00.000Z',
        distance: '22',
        name: 'Champa Ultra Race',
        time: '02:39:56',
        type: 'trail',
        $key: '-N1ktbdBZ6L13WkzMqZ8',
      },
      {
        color: 'red',
        date: '2021-12-11T03:00:00.000Z',
        distance: '24',
        name: 'Black Rock Night Trail',
        time: '03:52:00',
        type: 'trail',
        $key: '-N3vx2hXxbtT9CvLGatA',
      },
      {
        color: 'orange',
        date: '2021-10-31T03:00:00.000Z',
        distance: '13',
        name: 'Black Rock El Durazno',
        time: '01:18:29',
        type: 'trail',
        $key: '-N3vxZZM_XXRePUAZTHt',
      },
      {
        color: 'red',
        date: '2021-10-02T03:00:00.000Z',
        distance: '26',
        name: 'Utacch',
        time: '03:08:00',
        type: 'trail',
        $key: '-N3vxhqf062DfduciVms',
      },
      {
        color: 'blue',
        date: '2021-09-05T03:00:00.000Z',
        distance: '10',
        name: 'Valholl',
        time: '01:40:45',
        type: 'trail',
        $key: '-N3vxsAp58M1R0dqK2zG',
      },
      {
        color: 'orange',
        date: '2021-03-07T03:00:00.000Z',
        distance: '11',
        name: 'Champa Ultra Race',
        time: '01:43:42',
        type: 'trail',
        $key: '-N3vy-m7Me84qDBMT239',
      },
      {
        color: 'red',
        date: '2021-02-07T03:00:00.000Z',
        distance: '22',
        name: 'Black Rock Night Trail',
        time: '03:10:20',
        type: 'trail',
        $key: '-N3vy75OgYhbqdGtejX5',
      },
      {
        color: 'blue',
        date: '2019-11-17T03:00:00.000Z',
        distance: '10',
        name: '21K CBA',
        time: '00:51:00',
        type: 'street',
        $key: '-N3vyeaHvkEqj-7Pc-fi',
      },
      {
        color: 'blue',
        date: '2018-04-22T03:00:00.000Z',
        distance: '10',
        name: 'Nat Geo Run',
        time: '00:53:16',
        type: 'street',
        $key: '-N3vyr_7GuxYdkR9nFSi',
      },
      {
        color: 'blue',
        date: '2017-11-19T03:00:00.000Z',
        distance: '10',
        name: '21K CBA',
        time: '00:52:18',
        type: 'street',
        $key: '-N3vzRIek_UHScOtGs8n',
      },
      {
        color: 'red',
        date: '2022-07-09T03:00:00.000Z',
        distance: '26',
        name: 'Utacch',
        time: '02:56:50',
        type: 'trail',
        $key: '-N87Fktq9JAjUAvPH1J9',
      },
      {
        color: 'red',
        date: '2022-04-09T03:00:00.000Z',
        distance: 42,
        name: 'Patagonia Run',
        time: '06:56:39',
        type: 'trail',
        $key: '-N8akINY_zf3QjcOXY1p',
      },
      {
        color: 'orange',
        date: '2022-10-02T03:00:00.000Z',
        distance: 13,
        name: 'Black Rock El Durazno',
        time: '01:24:38',
        type: 'trail',
        $key: '-NDTQ1tPqEXw5e5sKsT5',
      },
      {
        color: 'red',
        date: '2022-11-12T03:00:00.000Z',
        distance: 21,
        name: 'Valtellina Wine Trail',
        time: '02:27:27',
        type: 'trail',
        $key: '-NN-6ZuxhRJ3kXBlwqIk',
      },
    ];
  }
}
