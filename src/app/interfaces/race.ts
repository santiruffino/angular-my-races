import { IconProp } from '@fortawesome/fontawesome-svg-core';

export interface Race {
  $key: string;
  name: string;
  distanceValue: number;
  distanceUnit: string;
  date: Date;
  time: string;
  type: string;
  pace: string;
  externalActivityUrl?: string;
  surface: string;
  surfaceIcon: IconProp;
}
