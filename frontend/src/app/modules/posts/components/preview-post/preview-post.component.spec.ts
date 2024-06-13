import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewPostComponent } from './preview-post.component';

describe('PostComponent', () => {
  let component: PreviewPostComponent;
  let fixture: ComponentFixture<PreviewPostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PreviewPostComponent]
    });
    fixture = TestBed.createComponent(PreviewPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
