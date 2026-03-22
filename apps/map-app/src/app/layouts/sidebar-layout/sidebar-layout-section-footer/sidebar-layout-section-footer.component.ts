import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-sidebar-layout-section-footer',
  template: `
    @if (!hidden) {
      <footer class="section-footer">
        <ng-content></ng-content>
      </footer>
    }
  `,
  styles: `
    .section-footer {
      flex-shrink: 0;
      border-top: 1px solid #e5e7eb;
    }
  `,
  standalone: true,
  imports: [CommonModule],
})
export class DtSidebarLayoutSectionFooterComponent {
  @Input() hidden = false;
}
