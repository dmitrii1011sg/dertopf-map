import { createFeature, createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { MapActions } from './map.actions';
import { MapPoint, MapPolygon, MapPolyline, MapSettings } from './map.models';

export const pointsAdapter = createEntityAdapter<MapPoint>();
export const polylinesAdapter = createEntityAdapter<MapPolyline>();
export const polygonsAdapter = createEntityAdapter<MapPolygon>();

export interface MapState {
  points: EntityState<MapPoint>;
  polylines: EntityState<MapPolyline>;
  polygons: EntityState<MapPolygon>;

  settings: MapSettings;

  pending: boolean;

  // TODO: make stateactionresult {status: ..., result: {error?: ..., value?: ....}}
}

const initialState: MapState = {
  points: pointsAdapter.getInitialState(),
  polylines: polylinesAdapter.getInitialState(),
  polygons: polygonsAdapter.getInitialState(),
  settings: { center: [0, 0], zoom: 3, homeLocation: [56.9972, 40.9714] },
  pending: false,
};

export const mapFeature = createFeature({
  name: 'map',
  reducer: createReducer(
    initialState,

    on(MapActions.createPolygon, (state, { polygon }) => ({
      ...state,
      polygons: polygonsAdapter.addOne(polygon, state.polygons),
    })),
    on(MapActions.updatePolygon, (state, { update }) => ({
      ...state,
      polygons: polygonsAdapter.updateOne(update, state.polygons),
    })),
    on(MapActions.deletePolygon, (state, { id }) => ({
      ...state,
      polygons: polygonsAdapter.removeOne(id, state.polygons),
    })),

    on(MapActions.createPolyline, (state, { polyline }) => ({
      ...state,
      polylines: polylinesAdapter.addOne(polyline, state.polylines),
    })),
    on(MapActions.updatePolyline, (state, { update }) => ({
      ...state,
      polylines: polylinesAdapter.updateOne(update, state.polylines),
    })),
    on(MapActions.deletePolyline, (state, { id }) => ({
      ...state,
      polylines: polylinesAdapter.removeOne(id, state.polylines),
    })),

    on(MapActions.createPoint, (state, { point }) => ({
      ...state,
      points: pointsAdapter.addOne(point, state.points),
    })),
    on(MapActions.updatePolygon, (state, { update }) => ({
      ...state,
      points: pointsAdapter.updateOne(update, state.points),
    })),
    on(MapActions.deletePolygon, (state, { id }) => ({
      ...state,
      points: pointsAdapter.removeOne(id, state.points),
    })),

    on(MapActions.retrieveOne, (state) => ({
      ...state,
      loading: true,
      error: null,
    })),
    on(MapActions.retrieveOneSuccess, (state, { entity, entityType }) => {
      const newState = { ...state, loading: false };

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
    on(MapActions.retrieveOneFailure, (state) => ({
      ...state,
      loading: false,
    })),
  ),
});
