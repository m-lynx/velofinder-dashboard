import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

import { environment } from '../environments/environment';
import { apiInterceptor } from './api-interceptor';
import { AuthService } from './auth-service';

const API_USERS_URL = `${environment.apiUrl}/admin/users`;

const setup = () => {
  const authService = { redirectToLogin: vi.fn(), redirectToSite: vi.fn() };

  TestBed.configureTestingModule({
    providers: [
      provideHttpClient(withInterceptors([apiInterceptor])),
      provideHttpClientTesting(),
      { provide: AuthService, useValue: authService },
    ],
  });

  return {
    authService,
    http: TestBed.inject(HttpClient),
    httpTesting: TestBed.inject(HttpTestingController),
  };
};

describe('apiInterceptor', () => {
  it('sends the session cookie with API requests', () => {
    const { http, httpTesting } = setup();

    void firstValueFrom(http.get(API_USERS_URL));

    expect(httpTesting.expectOne(API_USERS_URL).request.withCredentials).toBe(true);
  });

  it.each(['https://cdn.example.com/data.json', `${environment.apiUrl}.evil.example/steal`])(
    'leaves credentials off for %s',
    (url) => {
      const { http, httpTesting } = setup();

      void firstValueFrom(http.get(url));

      expect(httpTesting.expectOne(url).request.withCredentials).toBe(false);
    },
  );

  it('redirects to login when the API reports no session', async () => {
    const { authService, http, httpTesting } = setup();

    const requestPromise = firstValueFrom(http.get(API_USERS_URL));

    httpTesting.expectOne(API_USERS_URL).flush(null, { status: 401, statusText: 'Unauthorized' });

    await expect(requestPromise).rejects.toMatchObject({ status: 401 });
    expect(authService.redirectToLogin).toHaveBeenCalledOnce();
    expect(authService.redirectToSite).not.toHaveBeenCalled();
  });

  it('sends a non-admin back to the public site', async () => {
    const { authService, http, httpTesting } = setup();

    const requestPromise = firstValueFrom(http.get(API_USERS_URL));

    httpTesting.expectOne(API_USERS_URL).flush(null, { status: 403, statusText: 'Forbidden' });

    await expect(requestPromise).rejects.toMatchObject({ status: 403 });
    expect(authService.redirectToSite).toHaveBeenCalledOnce();
    expect(authService.redirectToLogin).not.toHaveBeenCalled();
  });

  it('does not redirect on other API errors', async () => {
    const { authService, http, httpTesting } = setup();

    const requestPromise = firstValueFrom(http.get(API_USERS_URL));

    httpTesting.expectOne(API_USERS_URL).flush(null, { status: 500, statusText: 'Server Error' });

    await expect(requestPromise).rejects.toMatchObject({ status: 500 });
    expect(authService.redirectToLogin).not.toHaveBeenCalled();
    expect(authService.redirectToSite).not.toHaveBeenCalled();
  });
});
