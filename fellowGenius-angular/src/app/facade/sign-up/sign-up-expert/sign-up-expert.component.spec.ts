import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignUpExpertComponent } from './sign-up-expert.component';

describe('SignUpExpertComponent', () => {
  let component: SignUpExpertComponent;
  let fixture: ComponentFixture<SignUpExpertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignUpExpertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignUpExpertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
