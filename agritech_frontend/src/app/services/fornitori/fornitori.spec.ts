import { TestBed } from '@angular/core/testing';

import { Fornitori } from './fornitori';

describe('Fornitori', () => {
  let service: Fornitori;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Fornitori);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
