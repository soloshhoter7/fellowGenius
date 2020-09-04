import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionNotesComponent } from './session-notes.component';

describe('SessionNotesComponent', () => {
  let component: SessionNotesComponent;
  let fixture: ComponentFixture<SessionNotesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SessionNotesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
