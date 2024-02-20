import {
  debounceTime,
  distinctUntilChanged,
  filter,
  fromEvent,
  map,
  switchMap,
} from 'rxjs';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Login } from 'src/app/interfaces/login';
import { Race } from 'src/app/interfaces/race';
import { AuthService } from 'src/app/services/auth.service';
import { CrudService } from 'src/app/services/crud.service';
import { AngularFireAnalytics } from '@angular/fire/compat/analytics';
import { ActivatedRoute, Router } from '@angular/router';
import {
  faBars,
  faMagnifyingGlass,
  faRightFromBracket,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  @ViewChild('input', { static: true }) input!: ElementRef;

  allRaces: Race[] = [];
  originalAllRaces: Race[] = [];
  hideWhenNoRace: boolean = false;
  noData: boolean = true;
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
  yearsArray: number[] = [];
  faRightFromBracket = faRightFromBracket;
  faBars = faBars;
  faMagnifyingGlass = faMagnifyingGlass;
  filteredRaces!: Race[];
  searchSubscription: any;
  searchSubject: any;
  raceCreated = false;

  constructor(
    public crudApi: CrudService,
    public authService: AuthService,
    private analytics: AngularFireAnalytics,
    public router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.showCreationToast();
    this.userData = this.authService.userData;
    this.dataState();
    let s = this.crudApi.getRacesList();
    s.snapshotChanges().subscribe((data) => {
      this.allRaces = [];
      data.forEach((item) => {
        let a: any = item.payload.toJSON();
        a['$key'] = item.key;
        this.allRaces.push(a as Race);
        this.originalAllRaces.push(a as Race);
      });
      this.groupRacesByYear();
      this.orderRaces();
      this.generateYearsArray();
      this.loading = false;
    });
  }

  showCreationToast() {
    this.raceCreated =
      this.route.snapshot.queryParamMap.get('status') === 'success';
  }

  addRace() {
    this.analytics.logEvent('Dashboard - Add Race Button Click');
    this.router.navigate(['add-race']);
    this.creatingNewRace = true;
  }

  deleteRace(raceKey: string) {
    this.analytics.logEvent('Dashboard - Delete Race Start');
    this.crudApi.deleteRace(raceKey);
    try {
      this.crudApi
        .deleteRace(raceKey)
        .then((result): any => {
          this.analytics.logEvent('Dashboard - Delete Race Success');
        })
        .catch((error: any) => {
          console.error('Error: ', error.message);
          this.analytics.logEvent('Dashboard - Delete Race Error');
        });
    } catch (error: any) {
      console.error('Error', error.message);
      this.analytics.logEvent('Dashboard - Delete Race Error');
    }
  }

  generateYearsArray() {
    this.allRacesByYear.map((year: any) => {
      this.yearsArray.push(year.date);
    });
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

  searchRace(data: string, isMobile: boolean) {
    this.analytics.logEvent('Dashboard - Search race Button Click');
    if (isMobile) this.hideDrawerMobile();
    if (!data) {
      this.analytics.logEvent('Dashboard - Search race empty');
      this.filteredRaces = this.originalAllRaces;
    } else {
      this.analytics.logEvent('Dashboard - Search race with value');
      this.filteredRaces = this.allRaces.filter((race) =>
        race?.name.toLowerCase().includes(data.toLowerCase())
      );
    }
    this.allRaces = this.filteredRaces;
    this.groupRacesByYear();
    this.orderRaces();
  }

  scrollToYear(id: number, isMobile: boolean) {
    this.analytics.logEvent('Dashboard - Go to year Click');
    const el: HTMLElement | null = document.getElementById(id.toString());
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (isMobile) this.hideDrawerMobile();
  }

  hideDrawerMobile() {
    const checkbox: HTMLElement | null = document.getElementById('my-drawer-3');
    checkbox?.click();
  }

  logout() {
    this.analytics.logEvent('Dashboard - Logout Button Click');
    this.authService.signOut();
  }
}
