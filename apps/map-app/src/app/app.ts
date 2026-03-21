import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DtMapComponent } from '@dertopf-ui';

@Component({
  imports: [RouterModule, DtMapComponent],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'map-app';
}
