import { Injectable, inject } from '@angular/core';
import * as Cesium from 'cesium';
import { Subject, Observable } from 'rxjs';
import { DtEditablePolyline } from '../classes/editable-polyline';
import { DtMapService } from '../../../../services/';
import { EditMode, EditorEntity } from '../models/map-editor-enum.model';
import { DtEditablePolygon } from '../classes/editable-polygon';

@Injectable({ providedIn: 'root' })
export class DtMapEditorService {
  private mapService = inject(DtMapService);

  private currentMode: EditMode = EditMode.DEFAULT;
  private activeEntity: DtEditablePolyline | DtEditablePolygon | null = null;
  private handler: Cesium.ScreenSpaceEventHandler | null = null;

  private draggedPointData: {
    entity: DtEditablePolyline | DtEditablePolygon;
    index: number;
  } | null = null;

  private stateSubject = new Subject<{ mode: EditMode; pointsCount: number }>();
  state$: Observable<any> = this.stateSubject.asObservable();

  startCreating(type: 'polyline' | 'polygon'): void {
    this.stop();
    this.currentMode = EditMode.CREATE;

    const viewer = this.mapService.getViewer();
    this.activeEntity =
      type === 'polygon'
        ? new DtEditablePolygon(viewer, `polygon-${Date.now()}`)
        : new DtEditablePolyline(viewer, `polyline-${Date.now()}`);

    this.handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);

    this.handler.setInputAction((event: { position: Cesium.Cartesian2 }) => {
      const position = this.mapService.pickPosition(event.position);
      if (position && this.activeEntity) {
        this.activeEntity.addPoint(position);
        this.emitState();
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    this.handler.setInputAction(() => {
      this.startEditing();
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

    this.emitState();
  }

  startEditing(): void {
    if (!this.activeEntity) return;

    this.currentMode = EditMode.EDIT;
    const viewer = this.mapService.getViewer();

    if (this.handler) this.handler.destroy();
    this.handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);

    this.handler.setInputAction((event: { position: Cesium.Cartesian2 }) => {
      const pickedObject = viewer.scene.pick(event.position);

      if (
        Cesium.defined(pickedObject) &&
        pickedObject.id &&
        pickedObject.id._editData
      ) {
        const entity = pickedObject.id as EditorEntity;
        const editData = entity._editData!;

        viewer.scene.screenSpaceCameraController.enableRotate = false;

        this.draggedPointData = {
          entity: this.activeEntity!,
          index: editData.index,
        };
      }
    }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

    this.handler.setInputAction((event: { endPosition: Cesium.Cartesian2 }) => {
      if (this.draggedPointData) {
        const newPosition = this.mapService.pickPosition(event.endPosition);
        if (newPosition) {
          this.draggedPointData.entity.updatePointPosition(
            this.draggedPointData.index,
            newPosition,
          );
        }
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    this.handler.setInputAction(() => {
      if (this.draggedPointData) {
        this.draggedPointData = null;
        viewer.scene.screenSpaceCameraController.enableRotate = true;
      }
    }, Cesium.ScreenSpaceEventType.LEFT_UP);

    this.emitState();
  }

  stop(): void {
    if (this.handler) {
      this.handler.destroy();
      this.handler = null;
    }
    this.currentMode = EditMode.DEFAULT;
    if (this.mapService.getViewer()) {
      this.mapService.getViewer().scene.screenSpaceCameraController.enableRotate = true;
    }
    this.emitState();
  }

  clearAll(): void {
    this.stop();
    if (this.activeEntity) {
      this.activeEntity.dispose();
      this.activeEntity = null;
    }
  }

  private emitState(): void {
    this.stateSubject.next({
      mode: this.currentMode,
      pointsCount: this.activeEntity?.positions.length || 0,
    });
  }
}
