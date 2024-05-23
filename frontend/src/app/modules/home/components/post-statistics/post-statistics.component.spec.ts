import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostStatisticsComponent } from './post-statistics.component';

describe('PostStatisticsComponent', () => {
  let component: PostStatisticsComponent;
  let fixture: ComponentFixture<PostStatisticsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PostStatisticsComponent]
    });
    fixture = TestBed.createComponent(PostStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
