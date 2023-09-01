import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadPostsComponent } from './read-posts.component';

describe('ReadPostsComponent', () => {
  let component: ReadPostsComponent;
  let fixture: ComponentFixture<ReadPostsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReadPostsComponent]
    });
    fixture = TestBed.createComponent(ReadPostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
