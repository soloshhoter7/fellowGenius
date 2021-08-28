import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyExpertsComponent } from './verify-experts.component';

describe('VerifyExpertsComponent', () => {
  let component: VerifyExpertsComponent;
  let fixture: ComponentFixture<VerifyExpertsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerifyExpertsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyExpertsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
