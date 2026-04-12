import { Component, computed, inject } from '@angular/core';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterModule,
} from '@angular/router';
import { DtMapComponent } from '@dertopf-ui';
import { SplitAreaComponent, SplitComponent } from 'angular-split';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faDrawPolygon,
  faMapMarkerAlt,
  faRoute,
} from '@fortawesome/free-solid-svg-icons';
import { DtLayoutService } from '../../services/dt-layout.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { DragDropModule, CdkDragEnd } from '@angular/cdk/drag-drop';

export type SidebarTab = 'points' | 'lines' | 'polygons' | 'settings' | null;

@Component({
  imports: [
    RouterModule,
    RouterLink,
    RouterLinkActive,
    FontAwesomeModule,
    SplitAreaComponent,
    SplitComponent,
    DtMapComponent,
    DragDropModule,
  ],
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrl: './workspace.component.scss',
})
export class WorkspaceComponent {
  private readonly router = inject(Router);
  readonly layout = inject(DtLayoutService);

  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((e) => e.urlAfterRedirects),
    ),
    { initialValue: this.router.url },
  );

  readonly isContentVisible = computed(() => {
    const url = this.currentUrl();
    const segments = url.split('/').filter((s) => s.length > 0);

    return segments.length > 1;
  });

  readonly icons = {
    polygon: faDrawPolygon,
    polyline: faRoute,
    point: faMapMarkerAlt,
  };

  toggleTab(route: string): void {
    const url = this.router.url;

    if (url.includes(route)) {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/dashboard', route]);
    }
  }

  onDragEnd(event: CdkDragEnd): void {
    const offset = event.distance.y;

    if (offset > 200) {
      this.closeSheet();
    }
    event.source._dragRef.reset();
  }

  closeSheet(): void {
    this.router.navigate(['/dashboard']);
  }
}
