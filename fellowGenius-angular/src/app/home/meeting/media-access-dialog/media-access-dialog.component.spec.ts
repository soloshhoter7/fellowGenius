import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaAccessDialogComponent } from './media-access-dialog.component';

describe('MediaAccessDialogComponent', () => {
  let component: MediaAccessDialogComponent;
  let fixture: ComponentFixture<MediaAccessDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MediaAccessDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MediaAccessDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
