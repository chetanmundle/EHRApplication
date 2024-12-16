import { TestBed } from '@angular/core/testing';

import { SOAPNoteService } from './soapnote.service';

describe('SOAPNoteService', () => {
  let service: SOAPNoteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SOAPNoteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
