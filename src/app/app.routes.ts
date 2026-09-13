import { Routes } from '@angular/router';
import { Login } from './features/login/login';
import { authGuard } from './auth-guard';

export const routes: Routes = [
  {
    path: '',
    component: Login,
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard').then((m) => m.Dashboard),
  },
  {
    path: 'dashboard/users',
    loadComponent: () => import('./features/users/users').then((m) => m.Users),
  },
  {
    path: 'dashboard/users/pending',
    loadComponent: () =>
      import('./features/pending-users/pending-users').then((m) => m.PendingUsers),
  },
  {
    path: 'dashboard/events',
    loadComponent: () => import('./features/events/events').then((m) => m.Events),
  },
];
