import { createActionGroup, props } from '@ngrx/store';
import { MapPoint, MapPolygon, MapPolyline, MapSettings } from './map.models';
import { Update } from '@ngrx/entity';

export const MapActions = createActionGroup({
  source: 'Map Editor',
  events: {
    'Retrieve One': props<{
      id: string;
      entityType: 'point' | 'polyline' | 'polygon';
    }>(),
    'Retrieve One Success': props<{ entity: any; entityType: string }>(),
    'Retrieve One Failure': props<{ error: string }>(),

    // polygon
    'Create Polygon': props<{ polygon: MapPolygon }>(),
    'Create Polygon Success': props<{ polygon: MapPolygon }>(),
    'Create Polygon Failure': props<{ error: any }>(),

    'Update Polygon': props<{ update: Update<MapPolygon> }>(),
    'Update Polygon Success': props<{ polygon: MapPolygon }>(),
    'Update Polygon Failure': props<{ error: any }>(),

    'Delete Polygon': props<{ id: string }>(),
    'Delete Polygon Success': props<{ id: string }>(),
    'Delete Polygon Failure': props<{ error: any }>(),

    // polyline
    'Create Polyline': props<{ polyline: MapPolyline }>(),
    'Create Polyline Success': props<{ polyline: MapPolyline }>(),
    'Create Polyline Failure': props<{ error: any }>(),

    'Update Polyline': props<{ update: Update<MapPolyline> }>(),
    'Update Polyline Success': props<{ polyline: MapPolyline }>(),
    'Update Polyline Failure': props<{ error: any }>(),

    'Delete Polyline': props<{ id: string }>(),
    'Delete Polyline Success': props<{ id: string }>(),
    'Delete Polyline Failure': props<{ error: any }>(),

    // point
    'Create Point': props<{ point: MapPoint }>(),
    'Create Point Success': props<{ point: MapPoint }>(),
    'Create Point Failure': props<{ error: any }>(),

    'Update Point': props<{ update: Update<MapPoint> }>(),
    'Update Point Success': props<{ point: MapPoint }>(),
    'Update Point Failure': props<{ error: any }>(),

    'Delete Point': props<{ id: string }>(),
    'Delete Point Success': props<{ id: string }>(),
    'Delete Point Failure': props<{ error: any }>(),

    'Update Map Settings': props<{ settings: Partial<MapSettings> }>(),
  },
});
