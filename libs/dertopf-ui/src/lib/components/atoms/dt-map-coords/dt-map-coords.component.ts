import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { DtMapService } from '../../../services';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'dt-map-coords',
  templateUrl: './dt-map-coords.component.html',
  styleUrls: ['./dt-map-coords.component.scss'],
})
export class DtMapCoordsComponent {
  coords$ = inject(DtMapService).mouseMove$;
}
