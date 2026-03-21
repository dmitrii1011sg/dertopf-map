import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DtMapService } from '../../../services';
import { DtMapEditorComponent, DtMapViewComponent } from '../../moleculars';

@Component({
  selector: 'dt-map',
  standalone: true,
  imports: [CommonModule, DtMapViewComponent, DtMapEditorComponent],
  templateUrl: './dt-map.component.html',
  styleUrls: ['./dt-map.component.scss'],
})
export class DtMapComponent {
  editor = inject(DtMapService);
}
