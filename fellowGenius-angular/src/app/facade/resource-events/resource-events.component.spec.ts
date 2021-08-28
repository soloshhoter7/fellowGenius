import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceEventsComponent } from './resource-events.component';

describe('ResourceEventsComponent', () => {
  let component: ResourceEventsComponent;
  let fixture: ComponentFixture<ResourceEventsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResourceEventsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
