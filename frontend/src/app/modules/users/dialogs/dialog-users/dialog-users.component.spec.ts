import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogUsersComponent } from './dialog-users.component';

describe('EditUsersComponent', () => {
  let component: DialogUsersComponent;
  let fixture: ComponentFixture<DialogUsersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogUsersComponent]
    });
    fixture = TestBed.createComponent(DialogUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
