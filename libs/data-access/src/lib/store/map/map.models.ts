export interface BaseFeature {
  id: string;
  name?: string;
}

export interface MapPoint extends BaseFeature {
  coordinates: [number, number, number];
}

export interface MapPolyline extends BaseFeature {
  positions: [number, number, number][];
}

export interface MapPolygon extends BaseFeature {
  positions: [number, number, number][];
}

export interface MapSettings {
  center: [number, number];
  zoom: number;
  homeLocation: [number, number];
}
