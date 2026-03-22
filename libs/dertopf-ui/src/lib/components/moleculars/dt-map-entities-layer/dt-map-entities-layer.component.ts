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

  private store = inject(Store);

  private dataSource = new CustomDataSource('user-entities-layer');

  private points = this.store.selectSignal(mapFeature.selectAllPoints);
  private polylines = this.store.selectSignal(mapFeature.selectAllPolylines);
  private polygons = this.store.selectSignal(mapFeature.selectAllPolygons);

  readonly visibleEntities = computed<MapEntity[]>(() => {
    return [
      ...this.points().filter((p) => p.isVisible),
      ...this.polylines().filter((p) => p.isVisible),
      ...this.polygons().filter((p) => p.isVisible),
    ];
  });

  constructor() {
    effect(() => {
      const entities = this.visibleEntities();
      this.syncEntitiesWithMap(entities);
    });
  }

  ngOnInit(): void {
    this.viewer.dataSources.add(this.dataSource);
  }

  ngOnDestroy(): void {
    this.viewer.dataSources.remove(this.dataSource);
  }

  private syncEntitiesWithMap(entities: MapEntity[]): void {
    this.dataSource.entities.removeAll();

    for (const entity of entities) {
      const mapEntity = new Entity({
        id: entity.id,
        name: entity.name,
        description: entity.description,
      });

      switch (entity.type) {
        case 'point':
          this.drawPoint(mapEntity, entity as MapPoint);
          break;
        case 'polyline':
          this.drawPolyline(mapEntity, entity as MapPolyline);
          break;
        case 'polygon':
          this.drawPolygon(mapEntity, entity as MapPolygon);
          break;
        default:
          break;
      }

      this.dataSource.entities.add(mapEntity);
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
