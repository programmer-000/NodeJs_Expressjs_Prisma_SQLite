import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostsFilterPanelComponent } from './posts-filter-panel.component';

describe('PostsFilterPanelComponent', () => {
  let component: PostsFilterPanelComponent;
  let fixture: ComponentFixture<PostsFilterPanelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PostsFilterPanelComponent]
    });
    fixture = TestBed.createComponent(PostsFilterPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
