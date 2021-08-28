import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceVideosComponent } from './resource-videos.component';

describe('ResourceVideosComponent', () => {
  let component: ResourceVideosComponent;
  let fixture: ComponentFixture<ResourceVideosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResourceVideosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceVideosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
