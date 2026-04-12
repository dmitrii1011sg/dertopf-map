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
  faMapMarkerAlt,
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
  templateUrl: './point-list-view.component.html',
  styleUrls: ['./point-list-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PointListComponent {
  private readonly store = inject(Store);

  readonly searchQuery = signal('');

  readonly points = this.store.selectSignal(mapFeature.selectAllPoints);

  readonly filteredPoints = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return this.points();

    return this.points().filter(
      (p) =>
        p.name?.toLowerCase().includes(query) ||
        p.id.toLowerCase().includes(query),
    );
  });

  readonly icons = {
    entity: faMapMarkerAlt,
    search: faSearch,
    clear: faTimes,
  };

  updateSearch(value: string): void {
    this.searchQuery.set(value);
  }
}
