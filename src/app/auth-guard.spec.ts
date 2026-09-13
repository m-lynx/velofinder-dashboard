import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { firstValueFrom, isObservable, Observable, of } from 'rxjs';

import { authGuard } from './auth-guard';
import { AdminSession, AuthService } from './auth-service';

const adminSession: AdminSession = {
  email: 'anna@example.com',
  firstName: 'Anna',
  id: 'user-1',
  lastName: 'Nowak',
  role: 'ADMIN',
};

const runGuard = (session: AdminSession | null) => {
  TestBed.configureTestingModule({
    providers: [{ provide: AuthService, useValue: { loadSession: () => of(session) } }],
  });

  const result = TestBed.runInInjectionContext(() => {
    return authGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot);
  });

  if (!isObservable(result)) {
    throw new Error('authGuard is expected to return an Observable');
  }

  return firstValueFrom(result as Observable<unknown>);
};

describe('authGuard', () => {
  it('allows navigation for a signed-in admin', async () => {
    expect(await runGuard(adminSession)).toBe(true);
  });

  it('blocks navigation when there is no admin session', async () => {
    expect(await runGuard(null)).toBe(false);
  });
});
