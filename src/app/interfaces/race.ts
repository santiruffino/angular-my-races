export interface Race {
  $key: string;
  name: string;
  distanceValue: number;
  distanceUnit: string;
  date: Date;
  time: string;
  type: string;
  pace: string;
  garminUrl?: string;
}
