import { HttpClient, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, Observable, of, shareReplay, tap } from 'rxjs';

import { environment } from '../environments/environment';
import { WINDOW_LOCATION } from './window-location';

export interface AdminSession {
  email: string;
  firstName: string;
  id: string;
  lastName: string;
  role: 'ADMIN';
}

export const ADMIN_SESSION_URL = `${environment.apiUrl}/admin/session`;

export const NON_ADMIN_LANDING_URL = `${environment.siteUrl}/map`;

export const isAuthFailure = (error: unknown): error is HttpErrorResponse => {
  return (
    error instanceof HttpErrorResponse &&
    (error.status === HttpStatusCode.Unauthorized || error.status === HttpStatusCode.Forbidden)
  );
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly location = inject(WINDOW_LOCATION);
  private readonly sessionState = signal<AdminSession | null>(null);
  private sessionRequest: Observable<AdminSession | null> | null = null;

  readonly session = this.sessionState.asReadonly();

  loadSession(): Observable<AdminSession | null> {
    this.sessionRequest ??= this.http.get<AdminSession>(ADMIN_SESSION_URL).pipe(
      tap((session) => {
        this.sessionState.set(session);
      }),
      catchError((error: unknown) => {
        this.sessionRequest = null;

        if (isAuthFailure(error)) {
          return of(null);
        }

        throw error;
      }),
      shareReplay(1),
    );

    return this.sessionRequest;
  }

  signOut(): Observable<void> {
    return this.http.delete<void>(ADMIN_SESSION_URL).pipe(
      tap(() => {
        this.clearSession();
        this.location.assign(environment.siteUrl);
      }),
    );
  }

  redirectToLogin(): void {
    this.clearSession();

    const from = encodeURIComponent(this.location.href);

    this.location.assign(`${environment.siteUrl}/login?from=${from}`);
  }

  redirectToSite(): void {
    this.clearSession();
    this.location.assign(NON_ADMIN_LANDING_URL);
  }

  private clearSession(): void {
    this.sessionState.set(null);
    this.sessionRequest = null;
  }
}
