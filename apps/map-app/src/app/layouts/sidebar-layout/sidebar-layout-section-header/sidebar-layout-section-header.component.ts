import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-sidebar-layout-section-header',
  template: `
    <header class="section-header" [class.hidden]="hidden">
      <ng-content></ng-content>
    </header>
  `,
  styles: `
    .section-header {
      flex-shrink: 0;
      border-bottom: 1px solid #e5e7eb;

      &.hidden {
        display: none;
      }
    }
  `,
  standalone: true,
  imports: [CommonModule],
})
export class DtSidebarLayoutSectionHeaderComponent {
  @Input() hidden = false;
}
