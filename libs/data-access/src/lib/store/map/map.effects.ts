import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, delay, map, of, switchMap } from 'rxjs';
import { MapActions } from './map.actions';

export const retrieveFeatureEffect = createEffect(
  (actions$ = inject(Actions)) => {
    return actions$.pipe(
      ofType(MapActions.retrieveOne),
      switchMap(({ id, entityType }) => {
        return of({
          id,
          name: 'Mocked Polygon',
          positions: [
            [35, 55, 0],
            [36, 55, 0],
            [35, 56, 0],
          ],
        }).pipe(
          delay(1000),
          map((mockData) =>
            MapActions.retrieveOneSuccess({
              entity: mockData,
              entityType,
            }),
          ),
          catchError((error) =>
            of(MapActions.retrieveOneFailure({ error: error.message })),
          ),
        );
      }),
    );
  },
  { functional: true },
);
