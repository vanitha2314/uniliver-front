import { TestBed } from '@angular/core/testing';

import { SavedQueryService } from './saved-query.service';

describe('SavedQueryService', () => {
  let service: SavedQueryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SavedQueryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
