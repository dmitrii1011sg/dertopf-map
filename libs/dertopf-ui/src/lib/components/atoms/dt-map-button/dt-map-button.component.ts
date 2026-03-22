import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faMap } from '@fortawesome/free-solid-svg-icons';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'dt-map-button',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, MatButtonModule, MatTooltipModule],
  templateUrl: './dt-map-button.component.html',
  styleUrls: ['./dt-map-button.component.scss'],
})
export class DtMapButtonComponent {
  @Input() icon = faMap;
  @Input() tooltip = '';
  @Input() isActive = false;

  @Output() mapClick = new EventEmitter<void>();
}
