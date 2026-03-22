import { createActionGroup, props } from '@ngrx/store';
import { MapSettings } from './map.models';
import { Update } from '@ngrx/entity';
import { EntityType, MapEntity } from '../../models/entity.model';

export const MapActions = createActionGroup({
  source: 'Map Editor',
  events: {
    'Retrieve One': props<{
      id: string;
      entityType: 'point' | 'polyline' | 'polygon';
    }>(),
    'Retrieve One Success': props<{ entity: any; entityType: string }>(),
    'Retrieve One Failure': props<{ error: string }>(),

    'Create Entity': props<{ entity: MapEntity; typeEntity: EntityType }>(),
    'Create Entity Success': props<{ entity: MapEntity }>(),
    'Create Entity Failure': props<{ error: any }>(),

    'Update Entity': props<{
      update: Update<MapEntity>;
      typeEntity: EntityType;
    }>(),
    'Update Entity Success': props<{ entity: MapEntity }>(),
    'Update Entity Failure': props<{ error: any }>(),

    'Delete Entity': props<{ id: string; typeEntity: EntityType }>(),
    'Delete Entity Success': props<{ id: string }>(),
    'Delete Entity Failure': props<{ error: any }>(),

    'Toggle Entity Visibility': props<{ id: string; typeEntity: EntityType }>(),

    'Update Map Settings': props<{ settings: Partial<MapSettings> }>(),
  },
});
