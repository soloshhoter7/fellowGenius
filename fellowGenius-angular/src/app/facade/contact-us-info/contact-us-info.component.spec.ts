import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactUsInfoComponent } from './contact-us-info.component';

describe('ContactUsInfoComponent', () => {
  let component: ContactUsInfoComponent;
  let fixture: ComponentFixture<ContactUsInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactUsInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactUsInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
