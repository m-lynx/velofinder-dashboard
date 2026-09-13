import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { aUTHGuard } from './auth-guard';

describe('aUTHGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => aUTHGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
