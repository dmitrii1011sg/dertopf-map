import * as Cesium from 'cesium';

import {
  Component,
  input,
  output,
  inject,
  ElementRef,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Clipboard } from '@angular/cdk/clipboard';
import {
  faCopy,
  faTrash,
  faPlus,
  faG,
  faEyeSlash,
} from '@fortawesome/free-solid-svg-icons';
import { cartesianToDegrees, formatDegrees } from '../../../utils';

export interface ContextMenuState {
  x: number;
  y: number;
  worldPosition: Cesium.Cartesian3 | null;
  entity: Cesium.Entity | null;
}

@Component({
  selector: 'dt-map-context-menu',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './dt-map-context-menu.component.html',
  styleUrls: ['./dt-map-context-menu.component.scss'],
})
export class DtMapContextMenuComponent {
  private readonly el = inject(ElementRef);
  private readonly clipboard = inject(Clipboard);

  readonly state = input<ContextMenuState | null>(null);

  readonly closeMenu = output<void>();
  readonly remove = output<Cesium.Entity>();
  readonly hide = output<Cesium.Entity>();
  readonly addPoint = output<Cesium.Cartesian3>();

  readonly icons = {
    copy: faCopy,
    remove: faTrash,
    add: faPlus,
    google: faG,
    hide: faEyeSlash,
  };

  readonly shouldInvertX = computed(() => {
    const coords = this.state();
    const parent = this.el.nativeElement.parentElement;
    const menuWidth = this.el.nativeElement.firstElementChild.clientWidth;
    if (!coords || !parent) return false;

    return parent.offsetWidth - coords.x < menuWidth;
  });

  readonly shouldInvertY = computed(() => {
    const coords = this.state();
    const parent = this.el.nativeElement.parentElement;
    const menuHeight = this.el.nativeElement.firstElementChild.clientHeight;
    if (!coords || !parent) return false;

    return parent.offsetHeight - coords.y < menuHeight;
  });

  copyCoordinates(cartesian: Cesium.Cartesian3): void {
    const point = cartesianToDegrees(cartesian);
    if (!point) return;

    this.clipboard.copy(formatDegrees(point));

    this.closeMenu.emit();
  }

  openInGoogleMaps(cartesian: Cesium.Cartesian3): void {
    const point = cartesianToDegrees(cartesian);
    if (!point) return;

    const url = `https://www.google.com/maps/place/${formatDegrees(point)}`;

    window.open(url, '_blank');

    this.closeMenu.emit();
  }
}
