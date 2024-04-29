import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogNewPasswordComponent } from './dialog-new-password.component';

describe('DialogNewPasswordComponent', () => {
  let component: DialogNewPasswordComponent;
  let fixture: ComponentFixture<DialogNewPasswordComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogNewPasswordComponent]
    });
    fixture = TestBed.createComponent(DialogNewPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
