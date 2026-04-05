import {
  AfterViewInit,
  Component,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { MapActions, mapFeature } from '@data-access';
import { DtMapService } from '../../../services';
import {
  DtMapEditorComponent,
  DtMapEditorService,
  DtMapViewComponent,
} from '../../moleculars';
import {
  DtMapButtonComponent,
  DtMapCompassComponent,
  DtMapCoordsComponent,
} from '../../atoms';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import {
  ContextMenuState,
  DtMapContextMenuComponent,
} from '../../atoms/dt-map-context-menu/dt-map-context-menu.component';
import * as Cesium from 'cesium';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'dt-map',
  standalone: true,
  imports: [
    CommonModule,
    DtMapViewComponent,
    DtMapEditorComponent,
    DtMapButtonComponent,
    DtMapCoordsComponent,
    DtMapCompassComponent,
    DtMapContextMenuComponent,
  ],
  templateUrl: './dt-map.component.html',
  styleUrls: ['./dt-map.component.scss'],
})
export class DtMapComponent implements AfterViewInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly store = inject(Store);

  readonly mapService = inject(DtMapService);
  readonly mapEditor = inject(DtMapEditorService);

  readonly contextMenuState = signal<ContextMenuState | null>(null);
  readonly setting = this.store.selectSignal(mapFeature.selectSettings);

  readonly icons = {
    home: faHome,
  };

  ngAfterViewInit(): void {
    this.flyToHome();
    this.setupContextMenu();
  }

  flyToHome(): void {
    const currentSettings = this.setting();
    this.mapService.flyTo(...currentSettings.homeLocation, 5000);
  }

  private setupContextMenu(): void {
    this.mapService.mouseRightClick$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((event) => {
        this.contextMenuState.set(event);
      });

    const handler = this.mapService.getHandler();
    handler.setInputAction(
      () => this.closeContextMenu(),
      Cesium.ScreenSpaceEventType.LEFT_CLICK,
    );
    handler.setInputAction(
      () => this.closeContextMenu(),
      Cesium.ScreenSpaceEventType.WHEEL,
    );

    this.mapService
      .getViewer()
      .camera.moveStart.addEventListener(() => this.closeContextMenu());
  }

  closeContextMenu(): void {
    if (this.contextMenuState()) {
      this.contextMenuState.set(null);
    }
  }

  createPoint(position: Cesium.Cartesian3): void {
    this.mapEditor.startCreating('point');
    this.mapEditor.addPoint(position);
    this.closeContextMenu();
  }

  hideEntity(entity: Cesium.Entity): void {
    this.store.dispatch(
      MapActions.toggleEntityVisibility({
        id: entity.id,
        typeEntity: entity.properties?.getValue().type,
      }),
    );

    this.closeContextMenu();
  }
}
