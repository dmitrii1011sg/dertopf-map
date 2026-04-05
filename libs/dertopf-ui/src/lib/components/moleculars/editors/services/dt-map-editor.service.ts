import { Injectable, inject } from '@angular/core';
import * as Cesium from 'cesium';
import { Observable, BehaviorSubject } from 'rxjs';
import { DtEditablePolyline } from '../classes/editable-polyline';
import { DtMapService } from '../../../../services/';
import { EditMode, EditorEntity } from '../models/map-editor-enum.model';
import { DtEditablePolygon } from '../classes/editable-polygon';
import { DtEditablePoint } from '../classes/editable-point';
import { BaseEditableEntity } from '../classes/base-editable-entity';
import { EntityType } from '@data-access';

export interface DtEditorState {
  mode: EditMode;
  pointsCount: number;
  type: EntityType;
  positions: Cesium.Cartesian3[];
}

@Injectable({ providedIn: 'root' })
export class DtMapEditorService {
  private mapService = inject(DtMapService);

  private currentMode: EditMode = EditMode.DEFAULT;
  private activeEntity: BaseEditableEntity | null = null;
  private handler: Cesium.ScreenSpaceEventHandler | null = null;

  private draggedPointData: {
    entity: BaseEditableEntity;
    index: number;
  } | null = null;

  private stateSubject = new BehaviorSubject<DtEditorState>({
    mode: EditMode.DEFAULT,
    pointsCount: 0,
    positions: [],
    type: 'point',
  });
  state$: Observable<DtEditorState> = this.stateSubject.asObservable();

  private setupHandlers(viewer: Cesium.Viewer): void {
    if (this.handler) this.handler.destroy();
    this.handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);

    if (this.currentMode === EditMode.CREATE) {
      this.handler.setInputAction((event: { position: Cesium.Cartesian2 }) => {
        const position = this.mapService.pickPosition(event.position);
        if (position && this.activeEntity) {
          this.activeEntity.addPoint(position);
          this.emitState();
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

      this.handler.setInputAction((event: { position: Cesium.Cartesian2 }) => {
        const pickedObject = viewer.scene.pick(event.position);
        if (this.activeEntity && this.activeEntity.positions.length > 0) {
          const index =
            pickedObject?.id?._editData.index ||
            this.activeEntity.positions.length - 1;
          this.activeEntity.removePoint(index);
          this.emitState();
        }
      }, Cesium.ScreenSpaceEventType.MIDDLE_CLICK);

      this.handler.setInputAction(() => {
        this.startEditing();
      }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    }

    if (this.currentMode === EditMode.EDIT) {
      this.handler.setInputAction((event: { position: Cesium.Cartesian2 }) => {
        const pickedObject = viewer.scene.pick(event.position);

        if (pickedObject?.id?._editData) {
          const entity = pickedObject.id as EditorEntity;
          viewer.scene.screenSpaceCameraController.enableRotate = false;
          this.draggedPointData = {
            entity: this.activeEntity!,
            index: entity._editData!.index,
          };
        }
      }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

      this.handler.setInputAction(() => {
        this.startCreating();
      }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

      this.handler.setInputAction(
        (event: { endPosition: Cesium.Cartesian2 }) => {
          if (this.draggedPointData) {
            const newPosition = this.mapService.pickPosition(event.endPosition);
            if (newPosition) {
              this.draggedPointData.entity.updatePointPosition(
                this.draggedPointData.index,
                newPosition,
              );
            }
          }
        },
        Cesium.ScreenSpaceEventType.MOUSE_MOVE,
      );

      this.handler.setInputAction(() => {
        if (this.draggedPointData) {
          this.draggedPointData = null;
          viewer.scene.screenSpaceCameraController.enableRotate = true;
          this.emitState();
        }
      }, Cesium.ScreenSpaceEventType.LEFT_UP);
    }
  }

  startCreating(type?: 'polyline' | 'polygon' | 'point'): void {
    const viewer = this.mapService.getViewer();

    if (type) {
      this.clearAll();
    }

    if (!this.activeEntity && type) {
      this.activeEntity = this.getNewEntityByType(viewer, type);
    }

    this.currentMode = EditMode.CREATE;
    this.setupHandlers(viewer);
    this.emitState();
  }

  startEditing(): void {
    if (!this.activeEntity) return;
    this.currentMode = EditMode.EDIT;

    this.setupHandlers(this.mapService.getViewer());
    this.emitState();
  }

  addPoint(position: Cesium.Cartesian3): void {
    if (this.activeEntity) {
      this.activeEntity.addPoint(position);
      this.emitState();
    }
  }

  removePoint(index: number): void {
    if (this.activeEntity) {
      this.activeEntity.removePoint(index);
      this.emitState();
    }
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

  private getNewEntityByType(
    viewer: Cesium.Viewer,
    type: 'polyline' | 'polygon' | 'point',
  ): BaseEditableEntity | null {
    switch (type) {
      case 'point':
        return new DtEditablePoint(viewer, `point-${Date.now()}`);
      case 'polygon':
        return new DtEditablePolygon(viewer, `polygon-${Date.now()}`);
      case 'polyline':
        return (this.activeEntity = new DtEditablePolyline(
          viewer,
          `polyline-${Date.now()}`,
        ));
      default:
        return null;
    }
  }

  private emitState(): void {
    this.stateSubject.next({
      mode: this.currentMode,
      pointsCount: this.activeEntity?.positions.length || 0,
      positions: this.activeEntity?.positions || [],
      type: this.activeEntity?.id.substring(
        0,
        this.activeEntity?.id.indexOf('-'),
      ) as EntityType,
    });
  }

  getState(): DtEditorState {
    return this.stateSubject.getValue();
  }
}
