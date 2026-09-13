import { DOCUMENT, inject, InjectionToken } from '@angular/core';

export type WindowLocation = Pick<Location, 'assign' | 'href'>;

export const WINDOW_LOCATION = new InjectionToken<WindowLocation>('WINDOW_LOCATION', {
  factory: () => {
    return inject(DOCUMENT).location;
  },
});
