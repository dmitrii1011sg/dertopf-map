import { Point } from '@data-access';
import * as Cesium from 'cesium';

export const cartesianToDegrees = (
  cartesian: Cesium.Cartesian3 | undefined,
): Point | null => {
  if (!cartesian) return null;

  const cartographic = Cesium.Cartographic.fromCartesian(cartesian);

  return {
    lat: Cesium.Math.toDegrees(cartographic.latitude),
    lng: Cesium.Math.toDegrees(cartographic.longitude),
    height: cartographic.height,
  };
};

export const formatDegrees = (coords: Point, precision = 6): string => {
  return `${coords.lat.toFixed(precision)},${coords.lng.toFixed(precision)}`;
};
