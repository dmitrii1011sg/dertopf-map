import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/dashboard' },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./components/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent,
      ),
    // children: [
    //   { path: '', loadComponent: () => import('').then((m) => m.) },
    //   { path: 'points', loadComponent: () => import('').then((m) => m.) },
    //   { path: 'polylines', loadComponent: () => import('').then((m) => m.) },
    //   { path: 'polygons', loadComponent: () => import('').then((m) => m.) },
    //   { path: 'create', loadComponent: () => import('').then((m) => m.) },
    //   { path: 'edit', loadComponent: () => import('').then((m) => m.) },
    // ]
  },
];
