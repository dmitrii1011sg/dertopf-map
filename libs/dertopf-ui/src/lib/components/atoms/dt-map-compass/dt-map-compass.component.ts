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
  private mapService = inject(DtMapService);

  faCompass = faCompass;
  direction = signal(0);
  private lastDirection = 0;
  private internalRotation = 0;

  readonly svgPath = DtCompassSvg.SVG_COMPASS;

  private removeListener?: () => void;

  ngOnInit(): void {
    const viewer = this.mapService.getViewer();

    this.removeListener = viewer.scene.postRender.addEventListener(() => {
      const rawDirection = Cesium.Math.toDegrees(viewer.camera.heading);

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
    });
  }

  ngOnDestroy(): void {
    if (this.removeListener) this.removeListener();
  }

  get rotateStyle(): string {
    return `rotate(${-this.direction()}deg)`;
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
