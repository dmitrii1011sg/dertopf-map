import { Component, computed, DestroyRef, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import {
  ENTITY_TYPES,
  EntityType,
  MapActions,
  MapEntity,
  mapFeature,
  MapPoint,
  MapPolygon,
  MapPolyline,
} from '@data-access';
import { CommonModule } from '@angular/common';
import { DtSidebarLayoutSectionsModule } from '../../layouts/sidebar-layout';
import { DtConfirmDialogComponent, DtPageTitleComponent } from '@dertopf-ui';
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
import { Dialog } from '@angular/cdk/dialog';

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
  private readonly route = inject(ActivatedRoute);
  private readonly store = inject(Store);
  private readonly dialog = inject(Dialog);
  private readonly destroyRef = inject(DestroyRef);

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
    const selectAll = <T>(state: {
      ids: string[] | number[];
      entities: Record<string, T>;
    }): T[] => state?.ids?.map((id) => state.entities[id]) || [];

    switch (type) {
      case 'point':
        return selectAll(this.points()) as MapPoint[];
      case 'polyline':
        return selectAll(this.polylines()) as MapPolyline[];
      case 'polygon':
        return selectAll(this.polygons()) as MapPolygon[];
      default:
        return [];
    }
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

  confirmDelete(entity: MapEntity): void {
    const dialogRef = this.dialog.open<boolean>(DtConfirmDialogComponent, {
      data: {
        title: 'Delete',
        message: `Are you sure you want to delete ${entity.name || 'this object'}?`,
      },
    });

    dialogRef.closed
      .pipe(filter(Boolean), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.onDelete(entity.id);
      });
  }

  onDelete(id: string): void {
    const type = this.currentType();
    if (type) {
      this.store.dispatch(
        MapActions.deleteEntity({
          id,
          typeEntity: type,
        }),
      );
    }
  }
}
