import { TestBed } from '@angular/core/testing';

import { SubSinkService } from './sub-sink.service';

describe('SubSinkService', () => {
  let service: SubSinkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubSinkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
