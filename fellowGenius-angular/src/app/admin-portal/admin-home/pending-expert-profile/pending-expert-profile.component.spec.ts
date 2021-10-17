import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingExpertProfileComponent } from './pending-expert-profile.component';

describe('PendingExpertProfileComponent', () => {
  let component: PendingExpertProfileComponent;
  let fixture: ComponentFixture<PendingExpertProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PendingExpertProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingExpertProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
