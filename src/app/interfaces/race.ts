export interface Race {
  $key: string;
  name: string;
  distance: number;
  date: Date;
  time: string;
  type: string;
  pace: string;
  garminUrl?: string;
}
