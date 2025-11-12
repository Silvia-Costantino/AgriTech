import { TestBed } from '@angular/core/testing';

import { Contabilita } from './contabilita';

describe('Contabilita', () => {
  let service: Contabilita;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Contabilita);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
