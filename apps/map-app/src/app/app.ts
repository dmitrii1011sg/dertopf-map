import { AfterViewInit, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterModule } from '@angular/router';
import { DtMapEditorService, EditMode } from '@dertopf-ui';
import { tap } from 'rxjs';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { WorkspaceComponent } from './components/workspace/workspace.component';

export type SidebarTab = 'points' | 'lines' | 'polygons' | 'settings' | null;

@Component({
  imports: [RouterModule, FontAwesomeModule, WorkspaceComponent],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements AfterViewInit {
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  private mapEditorService = inject(DtMapEditorService);
  protected title = 'map-app';

  ngAfterViewInit(): void {
    this.editorModeListener();
  }

  private editorModeListener(): void {
    this.mapEditorService.state$
      .pipe(
        tap(({ mode }) =>
          mode === EditMode.DEFAULT
            ? this.router.navigate(['dashboard'])
            : this.router.navigate(['dashboard', 'create']),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }
}
