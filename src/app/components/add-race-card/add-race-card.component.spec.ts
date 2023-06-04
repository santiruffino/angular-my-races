import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRaceCardComponent } from './add-race-card.component';

describe('AddRaceCardComponent', () => {
  let component: AddRaceCardComponent;
  let fixture: ComponentFixture<AddRaceCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddRaceCardComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRaceCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
