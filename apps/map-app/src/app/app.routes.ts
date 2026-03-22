import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/dashboard' },
  {
    path: 'dashboard',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./components/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent,
          ),
      },
      //   { path: 'points', loadComponent: () => import('').then((m) => m.) },
      //   { path: 'polylines', loadComponent: () => import('').then((m) => m.) },
      //   { path: 'polygons', loadComponent: () => import('').then((m) => m.) },
      {
        path: 'create',
        loadComponent: () =>
          import('./components/entity-form/entity-form.component').then(
            (m) => m.EntityFormComponent,
          ),
      },
      {
        path: 'edit',
        loadComponent: () =>
          import('./components/entity-form/entity-form.component').then(
            (m) => m.EntityFormComponent,
          ),
      },
    ],
  },
];
