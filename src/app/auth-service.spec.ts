import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

import { environment } from '../environments/environment';
import {
  ADMIN_SESSION_URL,
  AdminSession,
  AuthService,
  NON_ADMIN_LANDING_URL,
} from './auth-service';
import { WINDOW_LOCATION } from './window-location';

const CURRENT_ADMIN_URL = 'http://localhost:4200/dashboard/users?tab=pending';

const adminSession: AdminSession = {
  email: 'anna@example.com',
  firstName: 'Anna',
  id: 'user-1',
  lastName: 'Nowak',
  role: 'ADMIN',
};

const setup = () => {
  const location = { assign: vi.fn(), href: CURRENT_ADMIN_URL };

  TestBed.configureTestingModule({
    providers: [
      provideHttpClient(),
      provideHttpClientTesting(),
      { provide: WINDOW_LOCATION, useValue: location },
    ],
  });

  return {
    httpTesting: TestBed.inject(HttpTestingController),
    location,
    service: TestBed.inject(AuthService),
  };
};

describe('AuthService', () => {
  it('stores the admin session returned by the API', async () => {
    const { httpTesting, service } = setup();

    const sessionPromise = firstValueFrom(service.loadSession());

    httpTesting.expectOne(ADMIN_SESSION_URL).flush(adminSession);

    expect(await sessionPromise).toEqual(adminSession);
    expect(service.session()).toEqual(adminSession);
    httpTesting.verify();
  });

  it('reuses the loaded session instead of asking the API again', async () => {
    const { httpTesting, service } = setup();

    const firstLoad = firstValueFrom(service.loadSession());

    httpTesting.expectOne(ADMIN_SESSION_URL).flush(adminSession);

    await firstLoad;

    expect(await firstValueFrom(service.loadSession())).toEqual(adminSession);
    httpTesting.verify();
  });

  it.each([
    { status: 401, statusText: 'Unauthorized' },
    { status: 403, statusText: 'Forbidden' },
  ])('resolves to no session on $status and retries on the next load', async (response) => {
    const { httpTesting, service } = setup();

    const sessionPromise = firstValueFrom(service.loadSession());

    httpTesting.expectOne(ADMIN_SESSION_URL).flush(null, response);

    expect(await sessionPromise).toBeNull();
    expect(service.session()).toBeNull();

    void firstValueFrom(service.loadSession());

    httpTesting.expectOne(ADMIN_SESSION_URL);
  });

  it('sends the user to login with the current admin URL to come back to', () => {
    const { location, service } = setup();

    service.redirectToLogin();

    expect(location.assign).toHaveBeenCalledWith(
      `${environment.siteUrl}/login?from=${encodeURIComponent(CURRENT_ADMIN_URL)}`,
    );
  });

  it('sends a signed-in non-admin back to the public site', () => {
    const { location, service } = setup();

    service.redirectToSite();

    expect(location.assign).toHaveBeenCalledWith(NON_ADMIN_LANDING_URL);
  });

  it('ends the session through the API before leaving the admin app', async () => {
    const { httpTesting, location, service } = setup();

    const loadPromise = firstValueFrom(service.loadSession());

    httpTesting.expectOne(ADMIN_SESSION_URL).flush(adminSession);

    await loadPromise;

    const signOutPromise = firstValueFrom(service.signOut(), { defaultValue: undefined });
    const request = httpTesting.expectOne(ADMIN_SESSION_URL);

    expect(request.request.method).toBe('DELETE');
    expect(location.assign).not.toHaveBeenCalled();

    request.flush(null, { status: 204, statusText: 'No Content' });

    await signOutPromise;

    expect(service.session()).toBeNull();
    expect(location.assign).toHaveBeenCalledWith(environment.siteUrl);
  });
});
