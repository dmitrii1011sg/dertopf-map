export const ENTITY_TYPES = ['point', 'polyline', 'polygon'] as const;
export type EntityType = (typeof ENTITY_TYPES)[number];

export interface BaseEntity {
  id: string;
  name: string;
  description: string;
  type: EntityType;
  isVisible: boolean;
  centroid: { lng: number; lat: number; height?: number };
}

export interface MapPoint extends BaseEntity {
  type: 'point';
  position: { lng: number; lat: number; height?: number };
}

export interface MapPolyline extends BaseEntity {
  type: 'polyline';
  positions: { lng: number; lat: number; height?: number }[];
}

export interface MapPolygon extends BaseEntity {
  type: 'polygon';
  positions: { lng: number; lat: number; height?: number }[];
}

export type MapEntity = MapPoint | MapPolyline | MapPolygon;
