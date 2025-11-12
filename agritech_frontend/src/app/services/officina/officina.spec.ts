import { TestBed } from '@angular/core/testing';

import { Officina } from './officina';

describe('Officina', () => {
  let service: Officina;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Officina);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
