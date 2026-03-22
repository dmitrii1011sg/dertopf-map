import { Component, ContentChild } from '@angular/core';
import { DtSidebarLayoutSectionHeaderComponent } from './sidebar-layout-section-header/sidebar-layout-section-header.component';
import { DtSidebarLayoutSectionContentComponent } from './sidebar-layout-section-content/sidebar-layout-section-content.component';
import { DtSidebarLayoutSectionFooterComponent } from './sidebar-layout-section-footer/sidebar-layout-section-footer.component';

@Component({
  selector: 'app-sidebar-layout-sections',
  template: `
    <div class="sidebar-layout-container">
      <div class="header-wrapper">
        <ng-content select="app-sidebar-layout-section-header"></ng-content>
      </div>

      <div class="content-wrapper">
        <ng-content select="app-sidebar-layout-section-content"></ng-content>
      </div>

      <div class="footer-wrapper">
        <ng-content select="app-sidebar-layout-section-footer"></ng-content>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        height: 100%;
        width: 100%;
      }

      .sidebar-layout-container {
        display: flex;
        flex-direction: column;
        height: 100%;
        width: 100%;
      }

      .header-wrapper,
      .footer-wrapper {
        flex-shrink: 0;
      }

      .content-wrapper {
        flex: 1;
        min-height: 0;
      }
    `,
  ],
})
export class DtSidebarLayoutSectionsComponent {
  @ContentChild(DtSidebarLayoutSectionHeaderComponent)
  header?: DtSidebarLayoutSectionHeaderComponent;
  @ContentChild(DtSidebarLayoutSectionContentComponent)
  content?: DtSidebarLayoutSectionContentComponent;
  @ContentChild(DtSidebarLayoutSectionFooterComponent)
  footer?: DtSidebarLayoutSectionFooterComponent;
}
