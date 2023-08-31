import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadCreatedSessionsComponent } from './read-created-sessions.component';

describe('ReadCreatedSessionsComponent', () => {
  let component: ReadCreatedSessionsComponent;
  let fixture: ComponentFixture<ReadCreatedSessionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReadCreatedSessionsComponent]
    });
    fixture = TestBed.createComponent(ReadCreatedSessionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
