import { AfterViewInit, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { mapFeature } from '@data-access';
import { DtMapService } from '../../../services';
import { DtMapEditorComponent, DtMapViewComponent } from '../../moleculars';
import { DtMapButtonComponent } from '../../atoms';
import { faHome } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'dt-map',
  standalone: true,
  imports: [
    CommonModule,
    DtMapViewComponent,
    DtMapEditorComponent,
    DtMapButtonComponent,
  ],
  templateUrl: './dt-map.component.html',
  styleUrls: ['./dt-map.component.scss'],
})
export class DtMapComponent implements AfterViewInit {
  mapService = inject(DtMapService);
  private store = inject(Store);

  readonly icons = {
    home: faHome,
  };

  setting = this.store.selectSignal(mapFeature.selectSettings);

  ngAfterViewInit(): void {
    this.flyToHome();
  }

  flyToHome(): void {
    const currentSettings = this.setting();
    this.mapService.flyTo(...currentSettings.homeLocation, 5000);
  }
}
