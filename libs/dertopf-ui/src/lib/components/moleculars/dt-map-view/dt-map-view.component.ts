import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { DtMapService } from '../../../services/dt-map.service';
import { DtMapEntitiesLayerComponent } from '../dt-map-entities-layer/dt-map-entities-layer.component';

@Component({
  selector: 'dt-map-view',
  standalone: true,
  imports: [DtMapEntitiesLayerComponent],
  template: `
    <div #mapContainer class="map-container"></div>
    <dt-map-entities-layer
      [viewer]="mapService.getViewer()"
    ></dt-map-entities-layer>
  `,
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
  mapService = inject(DtMapService);

  ngOnInit(): void {
    this.mapService.initViewer(this.mapContainer);
  }
}
