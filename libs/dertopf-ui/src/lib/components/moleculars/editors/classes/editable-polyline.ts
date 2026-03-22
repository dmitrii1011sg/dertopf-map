import * as Cesium from 'cesium';
import { BaseEditableEntity } from './base-editable-entity';
import { MAP_ENTITY_DEFAULT_COLORS } from '../../../../configs';

export class DtEditablePolyline extends BaseEditableEntity {
  constructor(viewer: Cesium.Viewer, id: string) {
    super(viewer, id, MAP_ENTITY_DEFAULT_COLORS.POLYLINE.stroke);
    this.entity = this.viewer.entities.add({
      id: `polyline-${this.id}`,
      polyline: {
        positions: new Cesium.CallbackProperty(() => this.positions, false),
        width: 4,
        material: Cesium.Color.fromCssColorString(this.color),
        clampToGround: true,
      },
    });
  }
}
