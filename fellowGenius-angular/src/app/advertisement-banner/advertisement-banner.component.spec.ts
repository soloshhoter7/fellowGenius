import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvertisementBannerComponent } from './advertisement-banner.component';

describe('AdvertisementBannerComponent', () => {
  let component: AdvertisementBannerComponent;
  let fixture: ComponentFixture<AdvertisementBannerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvertisementBannerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvertisementBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
