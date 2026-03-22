import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { EntityType, MapActions, mapFeature } from '@data-access';
import { CommonModule } from '@angular/common';
import { DtSidebarLayoutSectionsModule } from '../../layouts/sidebar-layout';
import { DtPageTitleComponent } from '@dertopf-ui';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {
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
  ],
  templateUrl: './entity-list.component.html',
  styleUrls: ['./entity-list.component.scss'],
})
export class EntityListComponent {
  private route = inject(ActivatedRoute);
  private store = inject(Store);

  readonly currentType = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('type'))),
    { initialValue: 'points' },
  );

  readonly icons = {
    edit: faPenToSquare,
    delete: faTrash,
    show: faEye,
    hide: faEyeSlash,
  };

  private points = this.store.selectSignal(mapFeature.selectPoints);
  private polylines = this.store.selectSignal(mapFeature.selectPolylines);
  private polygons = this.store.selectSignal(mapFeature.selectPolygons);

  readonly currentEntities = computed(() => {
    const type = this.currentType();
    let state: any;

    switch (type) {
      case 'points':
        state = this.points();
        break;
      case 'polylines':
        state = this.polylines();
        break;
      case 'polygons':
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
          typeEntity: type.slice(0, -1) as EntityType, // TODO: fix this
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
          typeEntity: type.slice(0, -1) as EntityType, // TODO: fix this
        }),
      );
    }
  }
}
