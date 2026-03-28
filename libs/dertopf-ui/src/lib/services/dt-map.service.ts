import { Injectable, ElementRef } from '@angular/core';
import * as Cesium from 'cesium';
import { Observable, Subject } from 'rxjs';

export interface MouseCoords {
  lat: number;
  lng: number;
  height: number;
}

export interface MouseRightClickEvent {
  x: number;
  y: number;
  worldPosition: Cesium.Cartesian3 | null;
  entity: Cesium.Entity | null;
}

const defaultViewerOptions = {
  terrain: Cesium.Terrain.fromWorldTerrain(),
  homeButton: false,
  infoBox: false,
  baseLayerPicker: false,
  animation: false,
  timeline: false,
  fullscreenButton: false,
  geocoder: false,
  sceneModePicker: false,
  navigationHelpButton: false,
  selectionIndicator: false,
};

@Injectable({ providedIn: 'root' })
export class DtMapService {
  private viewer!: Cesium.Viewer;
  private handler!: Cesium.ScreenSpaceEventHandler;

  private _mouseMoveListener = new Subject<MouseCoords>();
  private _mouseRightClickListener = new Subject<MouseRightClickEvent>();

  initViewer(container: ElementRef): Cesium.Viewer {
    const token = (import.meta as any).env.NG_APP_CESIUM_TOKEN;
    if (token) {
      Cesium.Ion.defaultAccessToken = token;
    } else {
      console.warn('Cesium Token is missing');
    }

    this.viewer = new Cesium.Viewer(
      container.nativeElement,
      defaultViewerOptions,
    );

    this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.canvas);

    this.mouseMoveListener();
    this.mouseRightClickListener();

    return this.viewer;
  }

  get mouseMove$(): Observable<any> {
    return this._mouseMoveListener;
  }

  get mouseRightClick$(): Observable<MouseRightClickEvent> {
    return this._mouseRightClickListener.asObservable();
  }

  getViewer(): Cesium.Viewer {
    return this.viewer;
  }
  getHandler(): Cesium.ScreenSpaceEventHandler {
    return this.handler;
  }

  pickPosition(
    windowPosition: Cesium.Cartesian2,
  ): Cesium.Cartesian3 | undefined {
    const ray = this.viewer.camera.getPickRay(windowPosition);
    if (!ray) return undefined;

    return this.viewer.scene.globe.pick(ray, this.viewer.scene);
  }

  flyTo(lat: number, lng: number, height = 15000): void {
    this.viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(lng, lat, height),
    });
  }

  private mouseMoveListener(): void {
    this.handler.setInputAction((event: { endPosition: Cesium.Cartesian2 }) => {
      const position = this.pickPosition(event.endPosition);

      if (position) {
        const cartographic = Cesium.Cartographic.fromCartesian(position);
        this._mouseMoveListener.next({
          lat: Cesium.Math.toDegrees(cartographic.latitude),
          lng: Cesium.Math.toDegrees(cartographic.longitude),
          height: cartographic.height,
        });
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  }

  private mouseRightClickListener(): void {
    this.handler.setInputAction((movement: any) => {
      const windowPosition = movement.position;

      const pickedObject = this.viewer.scene.pick(windowPosition);
      const entity =
        Cesium.defined(pickedObject) && pickedObject.id instanceof Cesium.Entity
          ? pickedObject.id
          : undefined;

      const worldPosition = this.pickPosition(windowPosition);

      this._mouseRightClickListener.next({
        x: windowPosition.x,
        y: windowPosition.y,
        worldPosition: worldPosition || null,
        entity,
      });
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
  }
}
