import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthActionsComponent } from './auth-actions.component';

describe('AuthActionsComponent', () => {
  let component: AuthActionsComponent;
  let fixture: ComponentFixture<AuthActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuthActionsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
