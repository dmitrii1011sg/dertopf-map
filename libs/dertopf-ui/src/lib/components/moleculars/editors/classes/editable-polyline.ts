import * as Cesium from 'cesium';
import { EditorEntity, EditPointData } from '../models/map-editor-enum.model';

export class DtEditablePolyline {
  positions: Cesium.Cartesian3[] = [];
  private pointEntities: EditorEntity[] = [];
  private lineEntity: Cesium.Entity;

  constructor(
    private viewer: Cesium.Viewer,
    public id: string,
  ) {
    this.lineEntity = this.viewer.entities.add({
      id: `line-${this.id}`,
      polyline: {
        positions: new Cesium.CallbackProperty(() => this.positions, false),
        width: 4,
        material: Cesium.Color.fromCssColorString('#007BFF'),
        clampToGround: true,
      },
    });
  }

  addPoint(position: Cesium.Cartesian3): void {
    this.positions.push(position);
    const index = this.positions.length - 1;
    this.renderPoint(index);
  }

  updatePointPosition(index: number, position: Cesium.Cartesian3): void {
    if (this.positions[index]) {
      this.positions[index] = position;
    }
  }

  dispose(): void {
    this.viewer.entities.remove(this.lineEntity);
    this.pointEntities.forEach((p) => this.viewer.entities.remove(p));
    this.positions = [];
    this.pointEntities = [];
  }

  private renderPoint(index: number): void {
    const editData: EditPointData = {
      index,
      isVirtual: false,
      entityId: this.id,
    };

    const pointEntity: EditorEntity = this.viewer.entities.add({
      id: `point-${this.id}-${index}-${Date.now()}`,
      position: new Cesium.CallbackProperty(
        () => this.positions[index],
        false,
      ) as any,
      point: {
        pixelSize: 12,
        color: Cesium.Color.WHITE,
        outlineColor: Cesium.Color.fromCssColorString('#007BFF'),
        outlineWidth: 3,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
      },
    });

    pointEntity._editData = editData;
    this.pointEntities.push(pointEntity);
  }
}
