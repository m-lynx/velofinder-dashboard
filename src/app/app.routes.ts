import { Routes } from '@angular/router';

import { authGuard } from './auth-guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard',
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./components/dashboard-layout/dashboard-layout').then((m) => m.DashboardLayout),
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./features/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'users',
        loadComponent: () => import('./features/users/users').then((m) => m.Users),
      },
      {
        path: 'users/pending',
        loadComponent: () =>
          import('./features/pending-users/pending-users').then((m) => m.PendingUsers),
      },
      {
        path: 'events',
        loadComponent: () => import('./features/events/events').then((m) => m.Events),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
