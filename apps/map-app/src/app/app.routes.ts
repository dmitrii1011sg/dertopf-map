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
      {
        path: 'points',
        loadComponent: () =>
          import(
            './components/map-entities/points/point-list-view/point-list-view.component'
          ).then((m) => m.PointListComponent),
      },
      {
        path: 'polygons',
        loadComponent: () =>
          import(
            './components/map-entities/polygons/polygon-list-view/polygon-list-view.component'
          ).then((m) => m.PolygonListComponent),
      },
      {
        path: 'polylines',
        loadComponent: () =>
          import(
            './components/map-entities/polylines/polyline-list-view/polyline-list-view.component'
          ).then((m) => m.PolylineListComponent),
      },
    ],
  },
];
