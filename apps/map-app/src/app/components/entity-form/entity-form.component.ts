import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DtSidebarLayoutSectionsModule } from '../../layouts/sidebar-layout';
import { DtMapEditorService, DtPageTitleComponent } from '@dertopf-ui';
import { Store } from '@ngrx/store';
import { MapActions, MapEntity } from '@data-access';
import { Cartesian3, Cartographic, Math as CesiumMath } from 'cesium';
import { Router } from '@angular/router';
import * as turf from '@turf/turf';

enum EntityFormFields {
  name = 'name',
  description = 'description',
}

interface EntityForm {
  [EntityFormFields.name]: FormControl<string>;
  [EntityFormFields.description]: FormControl<string>;
}

const cartesianToLngLat = (
  cartesian: Cartesian3,
): { lng: number; lat: number; height: number } => {
  const cartographic = Cartographic.fromCartesian(cartesian);

  return {
    lng: CesiumMath.toDegrees(cartographic.longitude),
    lat: CesiumMath.toDegrees(cartographic.latitude),
    height: cartographic.height,
  };
};

const getCentroid = (
  positions: Cartesian3[],
): { lng: number; lat: number; height?: number } => {
  const coords = positions.map((p) => {
    const pos = cartesianToLngLat(p);

    return [pos.lat, pos.lng];
  });

  const feature = turf.polygon([coords.concat([coords[0]])]);

  const centerPoint = turf.center(feature);

  return {
    lat: centerPoint.geometry.coordinates[0],
    lng: centerPoint.geometry.coordinates[1],
  };
};

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    FontAwesomeModule,
    MatInputModule,
    MatLabel,
    DtSidebarLayoutSectionsModule,
    DtPageTitleComponent,
  ],
  selector: 'app-entity-form',
  templateUrl: 'entity-form.component.html',
  styleUrls: ['entity-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntityFormComponent {
  private mapEditorService = inject(DtMapEditorService);
  private store = inject(Store);
  readonly router = inject(Router);

  entity: any;

  formGroup = new FormGroup<EntityForm>({
    [EntityFormFields.name]: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(32)],
    }),
    [EntityFormFields.description]: new FormControl<string>('', {
      nonNullable: true,
    }),
  });

  readonly formFields = EntityFormFields;

  get isUpdate(): boolean {
    return !!this.entity?.id;
  }

  onSubmit(): void {
    if (this.formGroup.valid) {
      const payload = this.formGroup.getRawValue();

      this.createEntity(payload);

      this.formGroup.reset();
    }
  }

  private createEntity(payload: { name: string; description: string }): void {
    const state = this.mapEditorService.getState();

    const type = state.type;
    const positions = state.positions;

    const newEntity: MapEntity =
      type === 'point'
        ? {
            id: crypto.randomUUID(),
            name: payload.name,
            description: payload.description,
            type: 'point',
            isVisible: true,
            position: cartesianToLngLat(positions[0]),
            centroid: cartesianToLngLat(positions[0]),
          }
        : {
            id: crypto.randomUUID(),
            name: payload.name,
            description: payload.description,
            type: type as 'polyline' | 'polygon',
            isVisible: true,
            positions: positions.map((p) => cartesianToLngLat(p)),
            centroid: getCentroid(positions),
          };

    this.store.dispatch(
      MapActions.createEntity({ entity: newEntity, typeEntity: state.type }),
    );

    this.mapEditorService.clearAll();
    this.router.navigate(['dashboard']);
  }
}
