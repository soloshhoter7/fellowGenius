import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpertSessionsComponent } from './expert-sessions.component';

describe('ExpertSessionsComponent', () => {
  let component: ExpertSessionsComponent;
  let fixture: ComponentFixture<ExpertSessionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpertSessionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpertSessionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
