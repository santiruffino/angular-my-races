import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef,
} from '@angular/core';
import { RaceFirebase } from 'src/app/interfaces/race';
import {
  faExternalLinkAlt,
  faMountain,
  faPen,
  faPersonRunning,
  faRoad,
  faTrash,
  faTree,
  faImage,
} from '@fortawesome/free-solid-svg-icons';
import { Modal, Ripple, initTE } from 'tw-elements';
import { AngularFireAnalytics } from '@angular/fire/compat/analytics';
import * as htmlToImage from 'html-to-image';

@Component({
  selector: 'app-race-card',
  templateUrl: './race-card.component.html',
  styleUrls: ['./race-card.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RaceCardComponent implements OnInit {
  @Input() race!: RaceFirebase;
  @Output() deleteRaceEvent = new EventEmitter<string>();

  faExternalLinkAlt = faExternalLinkAlt;
  faPen = faPen;
  faTrash = faTrash;
  faImage = faImage;

  raceSelected!: RaceFirebase;
  generatingImage = false;
  enableGenerateImage: boolean = false;

  constructor(
    private analytics: AngularFireAnalytics,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    initTE({ Modal, Ripple });
    this.calculatePace(this.race.distanceValue, this.race.time);
    this.calculateRaceIcon(this.race.surface);
  }

  cancelDeleteRace() {
    this.analytics.logEvent('Race Card - Cancel Delete Race Button Click');
  }

  deleteRaceModal(race: RaceFirebase) {
    this.raceSelected = race;
    this.analytics.logEvent('Race Card - Delete Race Button Click');
  }

  calculateRaceIcon(surface: string) {
    switch (surface) {
      case 'calle':
        this.race.surfaceIcon = faRoad;
        break;
      case 'trail':
        this.race.surfaceIcon = faMountain;
        break;
      case 'cross':
        this.race.surfaceIcon = faTree;
        break;
      default:
        this.race.surfaceIcon = faPersonRunning;
        break;
    }
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

  filter = (node: HTMLElement) => {
    const exclusionClasses = ['card-actions', 'secret-div'];
    return !exclusionClasses.some((classname) =>
      node.classList?.contains(classname)
    );
  };

  generateImage(raceKey: string) {
    this.generatingImage = true;
    setTimeout(() => {
      var node: any = document.getElementById(`full-card${raceKey}`);
      htmlToImage
        .toPng(node, { filter: this.filter })
        .then((dataUrl) => {
          window.open(dataUrl, '_blank');
          this.generatingImage = false;
          this.cd.detectChanges();
        })
        .catch(function (error) {
          console.error('oops, something went wrong!', error);
        });
    }, 1000);
  }
}
