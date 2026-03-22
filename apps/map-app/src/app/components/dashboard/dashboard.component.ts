import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { DtSidebarLayoutSectionsModule } from '../../layouts/sidebar-layout';
import { DashboardCardComponent } from './dashboard-card/dashboard-card.component';
import {
  faDrawPolygon,
  faMapMarkerAlt,
  faRoute,
} from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { DtPageTitleComponent } from '@dertopf-ui';
import { Store } from '@ngrx/store';
import { mapFeature } from '@data-access';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    DtSidebarLayoutSectionsModule,
    DashboardCardComponent,
    DtPageTitleComponent,
  ],
  selector: 'app-dashboard',
  templateUrl: 'dashboard.component.html',
})
export class DashboardComponent {
  private store = inject(Store);

  readonly router = inject(Router);
  readonly icons = {
    polygon: faDrawPolygon,
    polyline: faRoute,
    point: faMapMarkerAlt,
  };

  polygons = this.store.selectSignal(mapFeature.selectPolygons);
  polylines = this.store.selectSignal(mapFeature.selectPolylines);
  points = this.store.selectSignal(mapFeature.selectPoints);
}
