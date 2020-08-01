import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentBookingComponent } from './student-booking.component';

describe('StudentBookingComponent', () => {
  let component: StudentBookingComponent;
  let fixture: ComponentFixture<StudentBookingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentBookingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
