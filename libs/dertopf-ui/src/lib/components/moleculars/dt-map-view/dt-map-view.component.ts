import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { DtMapService } from '../../../services/dt-map.service';

@Component({
  selector: 'dt-map-view',
  standalone: true,
  template: `<div #mapContainer class="map-container"></div>`,
  styles: [
    `
      .map-container {
        height: 100vh;
        width: 100%;
      }
    `,
  ],
})
export class DtMapViewComponent implements OnInit {
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;
  private mapService = inject(DtMapService);

  ngOnInit(): void {
    this.mapService.initViewer(this.mapContainer);
  }
}
