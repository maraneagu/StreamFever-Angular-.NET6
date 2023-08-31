import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadJoinedGroupsComponent } from './read-joined-groups.component';

describe('ReadJoinedGroupsComponent', () => {
  let component: ReadJoinedGroupsComponent;
  let fixture: ComponentFixture<ReadJoinedGroupsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReadJoinedGroupsComponent]
    });
    fixture = TestBed.createComponent(ReadJoinedGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
