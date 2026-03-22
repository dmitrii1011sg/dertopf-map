import * as Cesium from 'cesium';
import { BaseEditableEntity } from './base-editable-entity';
import { getCesiumColor, MAP_ENTITY_DEFAULT_COLORS } from '../../../../configs';

export class DtEditablePolygon extends BaseEditableEntity {
  constructor(viewer: Cesium.Viewer, id: string) {
    super(viewer, id, MAP_ENTITY_DEFAULT_COLORS.POLYGON.stroke);
    this.entity = this.viewer.entities.add({
      id: `polygon-${this.id}`,
      polygon: {
        hierarchy: new Cesium.CallbackProperty(
          () => new Cesium.PolygonHierarchy(this.positions),
          false,
        ),
        material: getCesiumColor(MAP_ENTITY_DEFAULT_COLORS.POLYGON.fill),
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
      },
    });
  }
}
