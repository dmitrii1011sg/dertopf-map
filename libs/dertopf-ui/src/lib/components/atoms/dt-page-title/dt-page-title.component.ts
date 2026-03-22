import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'dt-page-title',
  templateUrl: 'dt-page-title.component.html',
  styleUrls: ['dt-page-title.component.scss'],
})
export class DtPageTitleComponent {
  title = input.required<string>();
}
