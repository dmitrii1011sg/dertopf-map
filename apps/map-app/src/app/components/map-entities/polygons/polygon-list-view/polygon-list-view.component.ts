import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { mapFeature } from '@data-access';
import { DtEntityListComponent, DtPageTitleComponent } from '@dertopf-ui';
import { Store } from '@ngrx/store';
import { DtSidebarLayoutSectionsModule } from '../../../../layouts/sidebar-layout';
import {
  faDrawPolygon,
  faSearch,
  faTimes,
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
  templateUrl: './polygon-list-view.component.html',
  styleUrls: ['./polygon-list-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PolygonListComponent {
  private readonly store = inject(Store);

  readonly searchQuery = signal('');

  readonly polygons = this.store.selectSignal(mapFeature.selectAllPolygons);

  readonly filteredPoints = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return this.polygons();

    return this.polygons().filter(
      (p) =>
        p.name?.toLowerCase().includes(query) ||
        p.id.toLowerCase().includes(query),
    );
  });

  readonly icons = {
    entity: faDrawPolygon,
    search: faSearch,
    clear: faTimes,
  };

  updateSearch(value: string): void {
    this.searchQuery.set(value);
  }
}
