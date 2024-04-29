import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogPostsComponent } from './dialog-posts.component';

describe('DialogsPostsComponent', () => {
  let component: DialogPostsComponent;
  let fixture: ComponentFixture<DialogPostsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogPostsComponent]
    });
    fixture = TestBed.createComponent(DialogPostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
