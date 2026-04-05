import {
  Component,
  computed,
  effect,
  inject,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  MapEntity,
  mapFeature,
  MapPoint,
  MapPolygon,
  MapPolyline,
} from '@data-access';
import { Store } from '@ngrx/store';
import { Viewer, CustomDataSource, Cartesian3, Color, Entity } from 'cesium';

@Component({
  selector: 'dt-map-entities-layer',
  standalone: true,
  template: '',
})
export class DtMapEntitiesLayerComponent implements OnInit, OnDestroy {
  @Input({ required: true }) viewer!: Viewer;

  private readonly store = inject(Store);

  private readonly dataSource = new CustomDataSource('user-entities-layer');

  private readonly points = this.store.selectSignal(mapFeature.selectAllPoints);
  private readonly polylines = this.store.selectSignal(
    mapFeature.selectAllPolylines,
  );
  private readonly polygons = this.store.selectSignal(
    mapFeature.selectAllPolygons,
  );

  private readonly visibleEntities = computed<MapEntity[]>(() => [
    ...this.points().filter((p) => p.isVisible),
    ...this.polylines().filter((p) => p.isVisible),
    ...this.polygons().filter((p) => p.isVisible),
  ]);

  constructor() {
    effect(() => this.syncEntitiesWithMap(this.visibleEntities()));
  }

  ngOnInit(): void {
    this.viewer.dataSources.add(this.dataSource);
  }

  ngOnDestroy(): void {
    this.dataSource.entities.removeAll();
    this.viewer.dataSources.remove(this.dataSource);
  }

  private syncEntitiesWithMap(entities: MapEntity[]): void {
    this.dataSource.entities.removeAll();

    for (const data of entities) {
      const cesiumEntity = new Entity({
        id: data.id,
        name: data.name,
        description: data.description,
        properties: {
          type: data.type,
        },
      });

      this.applyGraphics(cesiumEntity, data);
      this.dataSource.entities.add(cesiumEntity);
    }
  }

  private applyGraphics(cesiumEntity: Entity, data: MapEntity): void {
    switch (data.type) {
      case 'point':
        this.drawPoint(cesiumEntity, data as MapPoint);
        break;
      case 'polyline':
        this.drawPolyline(cesiumEntity, data as MapPolyline);
        break;
      case 'polygon':
        this.drawPolygon(cesiumEntity, data as MapPolygon);
        break;
      default:
        break;
    }
  }

  private drawPoint(cesiumEntity: Entity, data: MapPoint): void {
    cesiumEntity.position = Cartesian3.fromDegrees(
      data.position.lng,
      data.position.lat,
      data.position.height || 0,
    ) as any;

    cesiumEntity.point = {
      pixelSize: 12,
      color: Color.fromCssColorString('#ef4444'),
      outlineColor: Color.WHITE,
      outlineWidth: 2,
    } as any;
  }

  private drawPolyline(cesiumEntity: Entity, data: MapPolyline): void {
    const coords = data.positions.flatMap((p) => [p.lng, p.lat, p.height || 0]);

    cesiumEntity.polyline = {
      positions: Cartesian3.fromDegreesArrayHeights(coords),
      width: 4,
      material: Color.fromCssColorString('#3b82f6'),
    } as any;
  }

  private drawPolygon(cesiumEntity: Entity, data: MapPolygon): void {
    const coords = data.positions.flatMap((p) => [p.lng, p.lat, p.height || 0]);

    cesiumEntity.polygon = {
      hierarchy: Cartesian3.fromDegreesArrayHeights(coords) as any,
      material: Color.fromCssColorString('#10b981').withAlpha(0.5),
      outline: true,
      outlineColor: Color.BLACK,
    } as any;
  }
}
