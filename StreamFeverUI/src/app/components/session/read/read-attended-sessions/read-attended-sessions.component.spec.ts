import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadAttendedSessionsComponent } from './read-attended-sessions.component';

describe('ReadAttendedSessionsComponent', () => {
  let component: ReadAttendedSessionsComponent;
  let fixture: ComponentFixture<ReadAttendedSessionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReadAttendedSessionsComponent]
    });
    fixture = TestBed.createComponent(ReadAttendedSessionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
