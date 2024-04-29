import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCategoriesPostComponent } from './dialog-categories-post.component';

describe('DialogCategoriesPostComponent', () => {
  let component: DialogCategoriesPostComponent;
  let fixture: ComponentFixture<DialogCategoriesPostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogCategoriesPostComponent]
    });
    fixture = TestBed.createComponent(DialogCategoriesPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
