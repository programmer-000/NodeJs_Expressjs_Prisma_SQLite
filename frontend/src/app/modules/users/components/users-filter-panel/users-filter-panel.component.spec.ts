import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersFilterPanelComponent } from './users-filter-panel.component';

describe('FilterPanelComponent', () => {
  let component: UsersFilterPanelComponent;
  let fixture: ComponentFixture<UsersFilterPanelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UsersFilterPanelComponent]
    });
    fixture = TestBed.createComponent(UsersFilterPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
