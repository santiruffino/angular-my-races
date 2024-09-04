import { IconProp } from '@fortawesome/fontawesome-svg-core';

export interface RaceForm {
  name: string;
  distanceValue: number;
  distanceUnit: string;
  elevationGain: number;
  date: Date;
  time: string;
  externalActivityUrl?: string;
  surface: string;
}

export interface RaceFirebase {
  $key: string;
  name: string;
  distanceValue: number;
  distanceUnit: string;
  elevationGain: number;
  date: Date;
  time: string;
  type: string;
  pace: string;
  externalActivityUrl?: string;
  surface: string;
  surfaceIcon: IconProp;
}
