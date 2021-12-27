import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferralsInfoComponent } from './referrals-info.component';

describe('ReferralsInfoComponent', () => {
  let component: ReferralsInfoComponent;
  let fixture: ComponentFixture<ReferralsInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferralsInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferralsInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
