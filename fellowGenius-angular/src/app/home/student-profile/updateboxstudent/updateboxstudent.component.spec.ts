import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateboxstudentComponent } from './updateboxstudent.component';

describe('UpdateboxstudentComponent', () => {
  let component: UpdateboxstudentComponent;
  let fixture: ComponentFixture<UpdateboxstudentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateboxstudentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateboxstudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
