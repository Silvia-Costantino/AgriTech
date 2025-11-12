import { TestBed } from '@angular/core/testing';

import { Ordini } from './ordini';

describe('Ordini', () => {
  let service: Ordini;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Ordini);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
