import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadSessionsComponent } from './read-sessions.component';

describe('ReadSessionsComponent', () => {
  let component: ReadSessionsComponent;
  let fixture: ComponentFixture<ReadSessionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReadSessionsComponent]
    });
    fixture = TestBed.createComponent(ReadSessionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
