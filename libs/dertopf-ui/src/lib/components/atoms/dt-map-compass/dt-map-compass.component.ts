import { Component, inject, signal, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCompass } from '@fortawesome/free-solid-svg-icons';
import * as Cesium from 'cesium';
import { DtMapService } from '../../../services';
import DtCompassSvg from './dt-compass.svg';

@Component({
  selector: 'dt-map-compass',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './dt-map-compass.component.html',
  styleUrls: ['./dt-map-compass.component.scss'],
})
export class DtMapCompassComponent implements OnInit, OnDestroy {
  private readonly mapService = inject(DtMapService);

  readonly faCompass = faCompass;
  readonly svgPath = DtCompassSvg.SVG_COMPASS;

  readonly direction = signal(0);

  private lastDirection = 0;
  private internalRotation = 0;
  private removeListener?: () => void;

  ngOnInit(): void {
    this.setupCameraListener();
  }

  ngOnDestroy(): void {
    if (this.removeListener) this.removeListener();
  }

  get rotateStyle(): string {
    return `rotate(${-this.direction()}deg)`;
  }

  private setupCameraListener(): void {
    const viewer = this.mapService.getViewer();

    this.removeListener = viewer.scene.postRender.addEventListener(() => {
      this.updateCompass(viewer.camera.heading);
    });
  }

  private updateCompass(headingRadians: number): void {
    const rawDirection = Cesium.Math.toDegrees(headingRadians);
    if (Math.abs(this.lastDirection - rawDirection) > 0.1) {
      let diff = rawDirection - this.lastDirection;

      if (diff > 180) {
        diff -= 360;
      } else if (diff < -180) {
        diff += 360;
      }

      this.internalRotation += diff;
      this.lastDirection = rawDirection;

      this.direction.set(this.internalRotation);
    }
  }

  resetNorth(): void {
    const viewer = this.mapService.getViewer();
    if (!viewer) return;

    viewer.camera.flyTo({
      destination: viewer.camera.position.clone(),
      orientation: {
        heading: Cesium.Math.toRadians(0),
        pitch: viewer.camera.pitch,
        roll: viewer.camera.roll,
      },
      duration: 1.5,
    });
  }
}
