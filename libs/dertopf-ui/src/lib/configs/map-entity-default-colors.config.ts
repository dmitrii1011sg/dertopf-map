import * as Cesium from 'cesium';

export const MAP_ENTITY_DEFAULT_COLORS = {
  POLYLINE: {
    stroke: '#007BFF',
    outline: '#FFFFFF',
  },
  POLYGON: {
    fill: '#007BFF33',
    stroke: '#007BFF',
  },
  POINT: {
    fill: '#FFFFFF',
    outline: '#28A745',
  },

  ANCHOR_POINT: {
    fill: '#FFFFFF',
    outline: '#007BFF',
    pixelSize: 12,
    outlineWidth: 3,
  },
};

export const getCesiumColor = (hex: string, alpha = 1): Cesium.Color => {
  const color = Cesium.Color.fromCssColorString(hex);
  if (alpha !== 1) {
    return color.withAlpha(alpha);
  }

  return color;
};
