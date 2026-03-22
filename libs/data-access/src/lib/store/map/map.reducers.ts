import { createFeature, createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityState, Update } from '@ngrx/entity';
import { MapActions } from './map.actions';
import { MapSettings } from './map.models';
import {
  StateActionMessage,
  StateActionMessageStatus,
} from '../../models/state-action-result.model';
import { MapPoint, MapPolygon, MapPolyline } from '../../models/entity.model';

export const pointsAdapter = createEntityAdapter<MapPoint>();
export const polylinesAdapter = createEntityAdapter<MapPolyline>();
export const polygonsAdapter = createEntityAdapter<MapPolygon>();

export interface MapState {
  points: EntityState<MapPoint>;
  polylines: EntityState<MapPolyline>;
  polygons: EntityState<MapPolygon>;

  settings: MapSettings;

  pending: boolean;
  message: StateActionMessage | null;
}

const initialState: MapState = {
  points: pointsAdapter.getInitialState(),
  polylines: polylinesAdapter.getInitialState(),
  polygons: polygonsAdapter.getInitialState(),
  settings: { center: [0, 0], zoom: 3, homeLocation: [56.9972, 40.9714] },
  pending: false,
  message: null,
};

export const mapFeature = createFeature({
  name: 'map',
  reducer: createReducer(
    initialState,

    on(MapActions.createEntity, (state, { entity }) => {
      switch (entity.type) {
        case 'point':
          return {
            ...state,
            points: pointsAdapter.addOne(entity, state.points),
          };
        case 'polyline':
          return {
            ...state,
            polylines: polylinesAdapter.addOne(entity, state.polylines),
          };
        case 'polygon':
          return {
            ...state,
            polygons: polygonsAdapter.addOne(entity, state.polygons),
          };
        default:
          return state;
      }
    }),

    on(MapActions.updateEntity, (state, { update, typeEntity }) => {
      switch (typeEntity) {
        case 'point':
          return {
            ...state,
            points: pointsAdapter.updateOne(
              update as Update<MapPoint>,
              state.points,
            ),
          };
        case 'polyline':
          return {
            ...state,
            polylines: polylinesAdapter.updateOne(
              update as Update<MapPolyline>,
              state.polylines,
            ),
          };
        case 'polygon':
          return {
            ...state,
            polygons: polygonsAdapter.updateOne(
              update as Update<MapPolygon>,
              state.polygons,
            ),
          };
        default:
          return state;
      }
    }),

    on(MapActions.deleteEntity, (state, { id, typeEntity }) => {
      switch (typeEntity) {
        case 'point':
          return {
            ...state,
            points: pointsAdapter.removeOne(id, state.points),
          };
        case 'polyline':
          return {
            ...state,
            polylines: polylinesAdapter.removeOne(id, state.polylines),
          };
        case 'polygon':
          return {
            ...state,
            polygons: polygonsAdapter.removeOne(id, state.polygons),
          };
        default:
          return state;
      }
    }),

    on(MapActions.toggleEntityVisibility, (state, { id, typeEntity }) => {
      switch (typeEntity) {
        case 'point': {
          const entity = state.points.entities[id];
          if (!entity) return state;

          return {
            ...state,
            points: pointsAdapter.updateOne(
              { id, changes: { isVisible: !entity.isVisible } },
              state.points,
            ),
          };
        }
        case 'polyline': {
          const entity = state.polylines.entities[id];
          if (!entity) return state;

          return {
            ...state,
            polylines: polylinesAdapter.updateOne(
              { id, changes: { isVisible: !entity.isVisible } },
              state.polylines,
            ),
          };
        }
        case 'polygon': {
          const entity = state.polygons.entities[id];
          if (!entity) return state;

          return {
            ...state,
            polygons: polygonsAdapter.updateOne(
              { id, changes: { isVisible: !entity.isVisible } },
              state.polygons,
            ),
          };
        }
        default:
          return state;
      }
    }),

    on(MapActions.retrieveOne, (state) => ({
      ...state,
      loading: true,
      error: null,
    })),
    on(MapActions.retrieveOneSuccess, (state, { entity, entityType }) => {
      const newState = {
        ...state,
        message: {
          status: StateActionMessageStatus.success,
          result: { value: entity },
        },
        loading: false,
      };

      switch (entityType) {
        case 'polygon':
          newState.polygons = polygonsAdapter.upsertOne(entity, state.polygons);
          break;
        case 'polyline':
          newState.polylines = polylinesAdapter.upsertOne(
            entity,
            state.polylines,
          );
          break;
        case 'point':
          newState.points = pointsAdapter.upsertOne(entity, state.points);
          break;
        default:
          break;
      }

      return newState;
    }),
    on(MapActions.retrieveOneFailure, (state, { error }) => ({
      ...state,
      loading: false,
      message: { status: StateActionMessageStatus.failure, result: { error } },
    })),
  ),
});
