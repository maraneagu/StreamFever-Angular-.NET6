import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadCreatedGroupsComponent } from './read-created-groups.component';

describe('ReadCreatedGroupsComponent', () => {
  let component: ReadCreatedGroupsComponent;
  let fixture: ComponentFixture<ReadCreatedGroupsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReadCreatedGroupsComponent]
    });
    fixture = TestBed.createComponent(ReadCreatedGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
