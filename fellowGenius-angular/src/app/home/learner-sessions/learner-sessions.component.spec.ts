import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LearnerSessionsComponent } from './learner-sessions.component';

describe('LearnerSessionsComponent', () => {
  let component: LearnerSessionsComponent;
  let fixture: ComponentFixture<LearnerSessionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LearnerSessionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LearnerSessionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
