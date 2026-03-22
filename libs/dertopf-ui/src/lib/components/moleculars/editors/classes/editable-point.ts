import * as Cesium from 'cesium';
import { BaseEditableEntity } from './base-editable-entity';

export class DtEditablePoint extends BaseEditableEntity {
  constructor(viewer: Cesium.Viewer, id: string) {
    super(viewer, id);
  }

  override addPoint(position: Cesium.Cartesian3): void {
    if (this.positions.length > 0) {
      this.updatePointPosition(0, position);

      return;
    }
    super.addPoint(position);
  }
}
