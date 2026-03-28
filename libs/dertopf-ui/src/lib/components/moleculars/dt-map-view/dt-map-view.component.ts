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
  templateUrl: './dt-map-view.component.html',
  styleUrls: ['./dt-map-view.component.scss'],
})
export class DtMapViewComponent implements OnInit {
  @ViewChild('mapContainer', { static: true })
  private readonly mapContainer!: ElementRef;

  readonly mapService = inject(DtMapService);

  ngOnInit(): void {
    this.mapService.initViewer(this.mapContainer);
  }
}
