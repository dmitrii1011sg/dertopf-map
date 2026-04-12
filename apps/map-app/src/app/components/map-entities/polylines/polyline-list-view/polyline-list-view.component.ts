import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { MapActions, mapFeature, MapPolygon } from '@data-access';
import {
  DtEntityListComponent,
  DtMapService,
  DtPageTitleComponent,
} from '@dertopf-ui';
import { Store } from '@ngrx/store';
import { DtSidebarLayoutSectionsModule } from '../../../../layouts/sidebar-layout';
import {
  faEye,
  faEyeSlash,
  faLocationArrow,
  faRoute,
  faSearch,
  faTimes,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule,
    DtSidebarLayoutSectionsModule,
    DtPageTitleComponent,
    DtEntityListComponent,
  ],
  templateUrl: './polyline-list-view.component.html',
  styleUrls: ['./polyline-list-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PolylineListComponent {
  private readonly mapService = inject(DtMapService);
  private readonly store = inject(Store);

  readonly searchQuery = signal('');

  private readonly polylines = this.store.selectSignal(
    mapFeature.selectAllPolylines,
  );

  readonly filteredPoints = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return this.polylines();

    return this.polylines().filter(
      (p) =>
        p.name?.toLowerCase().includes(query) ||
        p.id.toLowerCase().includes(query),
    );
  });

  readonly icons = {
    entity: faRoute,
    search: faSearch,
    clear: faTimes,
  };

  readonly actionIcons = {
    delete: faTrash,
    show: faEye,
    hide: faEyeSlash,
    flyTo: faLocationArrow,
  };

  updateSearch(value: string): void {
    this.searchQuery.set(value);
  }

  toggleVisibility(entity: MapPolygon): void {
    this.store.dispatch(
      MapActions.toggleEntityVisibility({
        id: entity.id,
        typeEntity: 'polyline',
      }),
    );
  }

  flyTo(entity: MapPolygon): void {
    this.mapService.flyTo(entity.centroid.lat, entity.centroid.lng, 1000);
  }
}
