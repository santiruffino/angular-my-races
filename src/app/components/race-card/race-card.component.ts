import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { Race } from 'src/app/interfaces/race';
import {
  faExternalLinkAlt,
  faPen,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { Modal, Ripple, initTE } from 'tw-elements';
import { AngularFireAnalytics } from '@angular/fire/compat/analytics';

@Component({
  selector: 'app-race-card',
  templateUrl: './race-card.component.html',
  styleUrls: ['./race-card.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RaceCardComponent implements OnInit {
  @Input() race!: Race;
  @Output() deleteRaceEvent = new EventEmitter<string>();

  faExternalLinkAlt = faExternalLinkAlt;
  faPen = faPen;
  faTrash = faTrash;
  raceSelected!: Race;

  constructor(private analytics: AngularFireAnalytics) {}

  ngOnInit(): void {
    initTE({ Modal, Ripple });
    this.calculatePace(this.race.distanceValue, this.race.time);
  }

  cancelDeleteRace() {
    this.analytics.logEvent('Race Card - Cancel Delete Race Button Click');
  }

  deleteRaceModal(race: Race) {
    this.raceSelected = race;
    this.analytics.logEvent('Race Card - Delete Race Button Click');
  }

  deleteRace(raceKey: string) {
    this.deleteRaceEvent.emit(raceKey);
  }

  calculatePace(raceDistance: number, raceTime: string) {
    const timeParts = raceTime.split(':');

    const hoursInMinutes = parseInt(timeParts[0]) * 60;
    const secondsInMinutes = parseInt(timeParts[2]) / 60;
    const minutes = parseInt(timeParts[1]);

    const totalMinutes = hoursInMinutes + minutes + secondsInMinutes;
    const pace = totalMinutes / raceDistance;
    const paceMinutes = Math.floor(pace);
    const paceSeconds = Math.round((pace - paceMinutes) * 60);
    var newPaceMinutes = '';
    var newPaceSeconds = '';

    if (paceSeconds < 10) {
      newPaceMinutes = Math.floor(pace).toString();
      newPaceSeconds = '0' + paceSeconds;
    } else {
      newPaceMinutes = Math.floor(pace).toString();
      newPaceSeconds = paceSeconds.toString();
    }
    this.race.pace = newPaceMinutes.concat(':', newPaceSeconds);
  }
}
