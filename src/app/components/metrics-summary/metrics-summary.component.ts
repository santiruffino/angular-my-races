import {Component, Input, OnInit} from '@angular/core';
import {faClock, faLocationPin, faFlagCheckered} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-metrics-summary',
  templateUrl: './metrics-summary.component.html',
  styleUrls: ['./metrics-summary.component.css'],
})
export class MetricsSummaryComponent implements OnInit {
  @Input() races: any;
  kilometersCounter = 0;
  totalTime!: string;
  faClock = faClock;
  faLocationPin = faLocationPin;
  faFlagCheckered = faFlagCheckered;

  constructor() {}

  ngOnInit(): void {
    this.getTotalKilometers();
    this.getTotalTime();
  }

  getTotalKilometers() {
    this.kilometersCounter = this.races.reduce(
      (partialSum: any, a: any) => partialSum + a.distanceValue,
      0
    );
  }

  getTotalTime() {
    const totalSeconds = this.races.reduce(
      (partialSum: any, a: any) => partialSum + this.timestrToSec(a.time),
      0
    );
    this.totalTime = this.formatTime(totalSeconds);
  }

  timestrToSec(timestr: string) {
    var parts = timestr.split(':');
    return (
      parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2])
    );
  }

  pad(num: number) {
    if (num < 10) {
      return '0' + num;
    } else {
      return '' + num;
    }
  }

  formatTime(seconds: number) {
    return [
      this.pad(Math.floor(seconds / 3600)),
      this.pad(Math.floor(seconds / 60) % 60),
      this.pad(seconds % 60),
    ].join(':');
  }
}
