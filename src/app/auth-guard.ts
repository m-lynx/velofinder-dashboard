import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { map } from 'rxjs';

import { AuthService } from './auth-service';

export const authGuard: CanActivateFn = () => {
  return inject(AuthService)
    .loadSession()
    .pipe(
      map((session) => {
        return session !== null;
      }),
    );
};
