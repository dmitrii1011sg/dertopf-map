import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { ENTITY_TYPES, EntityType, MapActions, mapFeature } from '@data-access';
import { CommonModule } from '@angular/common';
import { DtSidebarLayoutSectionsModule } from '../../layouts/sidebar-layout';
import { DtPageTitleComponent } from '@dertopf-ui';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {
  faChevronLeft,
  faEye,
  faEyeSlash,
  faPenToSquare,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-entity-list',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule,
    DtSidebarLayoutSectionsModule,
    DtPageTitleComponent,
    MatExpansionModule,
    MatIconModule,
    MatButtonModule,
    RouterLink,
  ],
  templateUrl: './entity-list.component.html',
  styleUrls: ['./entity-list.component.scss'],
})
export class EntityListComponent {
  private route = inject(ActivatedRoute);
  private store = inject(Store);

  readonly currentType = toSignal<EntityType>(
    this.route.paramMap.pipe(
      map((params) => {
        const type = params.get('type');

        return this.isEntityType(type) ? type : 'point';
      }),
    ),
  );

  readonly icons = {
    edit: faPenToSquare,
    delete: faTrash,
    show: faEye,
    hide: faEyeSlash,
    back: faChevronLeft,
  };

  private points = this.store.selectSignal(mapFeature.selectPoints);
  private polylines = this.store.selectSignal(mapFeature.selectPolylines);
  private polygons = this.store.selectSignal(mapFeature.selectPolygons);

  private isEntityType(value: string | null): value is EntityType {
    return ENTITY_TYPES.includes(value as EntityType);
  }

  readonly currentEntities = computed(() => {
    const type = this.currentType();
    let state: any;

    switch (type) {
      case 'point':
        state = this.points();
        break;
      case 'polyline':
        state = this.polylines();
        break;
      case 'polygon':
        state = this.polygons();
        break;
      default:
        return [];
    }

    return state?.ids?.map((id: string) => state.entities[id]) || [];
  });

  onToggleVisibility(id: string, event: Event): void {
    const type = this.currentType();
    event.stopPropagation();
    if (type) {
      this.store.dispatch(
        MapActions.toggleEntityVisibility({
          id,
          typeEntity: type,
        }),
      );
    }
  }

  onDelete(id: string): void {
    const type = this.currentType();
    if (confirm('Delete this entity?') && type) {
      this.store.dispatch(
        MapActions.deleteEntity({
          id,
          typeEntity: type,
        }),
      );
    }
  }
}
