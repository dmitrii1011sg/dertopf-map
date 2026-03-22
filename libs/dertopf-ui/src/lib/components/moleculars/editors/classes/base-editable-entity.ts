import * as Cesium from 'cesium';
import { EditorEntity, EditPointData } from '../models/map-editor-enum.model';
import { getCesiumColor, MAP_ENTITY_DEFAULT_COLORS } from '../../../../configs';

export abstract class BaseEditableEntity {
  positions: Cesium.Cartesian3[] = [];
  protected pointEntities: EditorEntity[] = [];
  protected entity: Cesium.Entity | null = null;

  protected anchorConfig = MAP_ENTITY_DEFAULT_COLORS.ANCHOR_POINT;

  constructor(
    protected viewer: Cesium.Viewer,
    public id: string,
    protected color = '#000',
  ) {}

  addPoint(position: Cesium.Cartesian3): void {
    this.positions.push(position);
    this.renderPoint(this.positions.length - 1);
  }

  updatePointPosition(index: number, position: Cesium.Cartesian3): void {
    if (this.positions[index]) {
      this.positions[index] = position;
    }
  }

  removePoint(index: number): void {
    if (index < 0 || index >= this.positions.length) return;
    this.positions.splice(index, 1);
    this.refreshPoints();
  }

  dispose(): void {
    if (this.entity) this.viewer.entities.remove(this.entity);
    this.clearPoints();
    this.positions = [];
  }

  protected clearPoints(): void {
    this.pointEntities.forEach((p) => this.viewer.entities.remove(p));
    this.pointEntities = [];
  }

  protected refreshPoints(): void {
    this.clearPoints();
    this.positions.forEach((_, i) => this.renderPoint(i));
  }

  protected renderPoint(index: number): void {
    const editData: EditPointData = {
      index,
      isVirtual: false,
      entityId: this.id,
    };

    const point = this.viewer.entities.add({
      id: `point-${this.id}-${index}-${Date.now()}`,
      position: new Cesium.CallbackProperty(
        () => this.positions[index],
        false,
      ) as any,
      point: {
        pixelSize: this.anchorConfig.pixelSize,
        color: getCesiumColor(this.anchorConfig.fill),
        outlineColor: getCesiumColor(this.anchorConfig.outline),
        outlineWidth: this.anchorConfig.outlineWidth,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
      },
    }) as EditorEntity;

    point._editData = editData;
    this.pointEntities.push(point);
  }
}
