import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserStatisticsComponent } from './user-statistics.component';

describe('UserStatisticsComponent', () => {
  let component: UserStatisticsComponent;
  let fixture: ComponentFixture<UserStatisticsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserStatisticsComponent]
    });
    fixture = TestBed.createComponent(UserStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
