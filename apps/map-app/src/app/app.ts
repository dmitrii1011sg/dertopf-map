import { AfterViewInit, Component, inject, OnDestroy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { DtMapComponent, DtMapEditorService, EditMode } from '@dertopf-ui';
import { SplitAreaComponent, SplitComponent } from 'angular-split';
import { Subject, takeUntil, tap } from 'rxjs';

@Component({
  imports: [RouterModule, SplitAreaComponent, SplitComponent, DtMapComponent],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements AfterViewInit, OnDestroy {
  private router = inject(Router);
  private mapEditorService = inject(DtMapEditorService);
  protected title = 'map-app';

  destroy$ = new Subject<void>();

  ngAfterViewInit(): void {
    this.editorModeListener();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private editorModeListener(): void {
    this.mapEditorService.state$
      .pipe(
        tap(({ mode }) =>
          mode === EditMode.DEFAULT
            ? this.router.navigate(['dashboard'])
            : this.router.navigate(['dashboard', 'create']),
        ),
        takeUntil(this.destroy$),
      )
      .subscribe();
  }
}
