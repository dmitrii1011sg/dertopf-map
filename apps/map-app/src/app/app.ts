import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DtMapComponent } from '@dertopf-ui';
import { SplitAreaComponent, SplitComponent } from 'angular-split';

@Component({
  imports: [RouterModule, SplitAreaComponent, SplitComponent, DtMapComponent],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'map-app';
}
