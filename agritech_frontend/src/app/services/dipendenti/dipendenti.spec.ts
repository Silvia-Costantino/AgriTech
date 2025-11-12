import { TestBed } from '@angular/core/testing';

import { Dipendenti } from './dipendenti';

describe('Dipendenti', () => {
  let service: Dipendenti;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Dipendenti);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
