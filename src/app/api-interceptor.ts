import { HttpErrorResponse, HttpInterceptorFn, HttpStatusCode } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

import { environment } from '../environments/environment';
import { AuthService } from './auth-service';

export const isApiRequest = (url: string) => {
  return url.startsWith(`${environment.apiUrl}/`);
};

export const apiInterceptor: HttpInterceptorFn = (request, next) => {
  if (!isApiRequest(request.url)) {
    return next(request);
  }

  const authService = inject(AuthService);

  return next(request.clone({ withCredentials: true })).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse) {
        switch (error.status) {
          case HttpStatusCode.Unauthorized: {
            authService.redirectToLogin();
            break;
          }

          case HttpStatusCode.Forbidden: {
            authService.redirectToSite();
            break;
          }

          default: {
            break;
          }
        }
      }

      return throwError(() => {
        return error;
      });
    }),
  );
};
