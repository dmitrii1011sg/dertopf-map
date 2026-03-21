import { Injectable, ElementRef } from '@angular/core';
import * as Cesium from 'cesium';

@Injectable({ providedIn: 'root' })
export class DtMapService {
  private viewer!: Cesium.Viewer;
  private handler!: Cesium.ScreenSpaceEventHandler;

  private readonly IVANOVO_COORDS = {
    lat: 56.9972,
    lng: 40.9714,
    height: 15000,
  };

  initViewer(container: ElementRef): Cesium.Viewer {
    Cesium.Ion.defaultAccessToken = (
      import.meta as any
    ).env.NG_APP_CESIUM_TOKEN;

    this.viewer = new Cesium.Viewer(container.nativeElement, {
      terrain: Cesium.Terrain.fromWorldTerrain(),
      baseLayerPicker: false,
      animation: false,
      timeline: false,
    });

    this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.canvas);

    this.viewer.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(
        this.IVANOVO_COORDS.lng,
        this.IVANOVO_COORDS.lat,
        this.IVANOVO_COORDS.height,
      ),
    });

    return this.viewer;
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
}
