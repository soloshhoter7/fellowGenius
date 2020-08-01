import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignUpStudentComponent } from './sign-up-student.component';

describe('SignUpStudentComponent', () => {
  let component: SignUpStudentComponent;
  let fixture: ComponentFixture<SignUpStudentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignUpStudentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignUpStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
