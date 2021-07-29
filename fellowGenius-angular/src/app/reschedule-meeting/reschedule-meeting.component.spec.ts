import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RescheduleMeetingComponent } from './reschedule-meeting.component';

describe('RescheduleMeetingComponent', () => {
  let component: RescheduleMeetingComponent;
  let fixture: ComponentFixture<RescheduleMeetingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RescheduleMeetingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RescheduleMeetingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
