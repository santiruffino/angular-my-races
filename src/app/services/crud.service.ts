import { Injectable } from '@angular/core';
import {
  AngularFireDatabase,
  AngularFireList,
  AngularFireObject,
} from '@angular/fire/compat/database';
import { Race } from '../interfaces/race';

@Injectable({
  providedIn: 'root',
})
export class CrudService {
  racesRef: AngularFireList<any> = this.db.list('races-list');
  raceRef: AngularFireObject<any> = this.db.object('races-list');
  newRacesRef: AngularFireList<any> = this.db.list('races-list');
  localstorageJSON = JSON.parse(localStorage.getItem('user') || '{}');
  userUid: string | null = this.localstorageJSON.uid;

  constructor(private db: AngularFireDatabase) {}

  addRace(race: Race) {
    this.racesRef = this.db.list(`${this.userUid}`);
    return this.racesRef.push({
      name: race.name,
      date: race.date,
      time: race.time,
      distance: race.distance,
      garminUrl: race.garminUrl || '',
    });
  }

  getRace(id: string) {
    this.raceRef = this.db.object(`${this.userUid}/${id}`);
    return this.raceRef;
  }

  getRacesList() {
    this.racesRef = this.db.list(`${this.userUid}`);
    return this.racesRef;
  }

  updateRace(key: string, value: any) {
    this.newRacesRef = this.db.list(`${this.userUid}`);
    return this.newRacesRef.update(key, value);
  }

  deleteRace(id: string) {
    this.raceRef = this.db.object(`${this.userUid}/${id}`);
    this.raceRef.remove();
  }
}
