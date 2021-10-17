import { TestBed } from '@angular/core/testing';

import { SearchExpertProfileService } from '../search-expert-profile.service';

describe('SearchExpertProfileService', () => {
  let service: SearchExpertProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SearchExpertProfileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
