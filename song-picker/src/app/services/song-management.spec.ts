import { TestBed } from '@angular/core/testing';

import { SongManagement } from './song-management';

describe('SongManagement', () => {
  let service: SongManagement;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SongManagement);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
