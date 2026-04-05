import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DtMapEditorService } from '../../services/dt-map-editor.service';
import { EditMode } from '../../models/map-editor-enum.model';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faDrawPolygon,
  faMapMarkerAlt,
  faPenRuler,
  faRoute,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'dt-map-editor',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule,
    MatButtonModule,
    MatMenuModule,
    MatTooltipModule,
  ],
  templateUrl: './dt-map-editor.component.html',
  styleUrls: ['./dt-map-editor.component.scss'],
})
export class DtMapEditorComponent {
  readonly editor = inject(DtMapEditorService);

  readonly modes = EditMode;
  readonly icons = {
    draw: faPenRuler,
    cancel: faXmark,
    polygon: faDrawPolygon,
    polyline: faRoute,
    point: faMapMarkerAlt,
  };
}
