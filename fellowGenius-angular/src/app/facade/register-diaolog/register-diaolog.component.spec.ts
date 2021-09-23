import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterDiaologComponent } from './register-diaolog.component';

describe('RegisterDiaologComponent', () => {
  let component: RegisterDiaologComponent;
  let fixture: ComponentFixture<RegisterDiaologComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterDiaologComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterDiaologComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
