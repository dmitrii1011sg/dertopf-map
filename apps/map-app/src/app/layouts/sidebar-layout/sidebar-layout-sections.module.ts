import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DtSidebarLayoutSectionsComponent } from './sidebar-layout-sections.component';
import { DtSidebarLayoutSectionHeaderComponent } from './sidebar-layout-section-header/sidebar-layout-section-header.component';
import { DtSidebarLayoutSectionContentComponent } from './sidebar-layout-section-content/sidebar-layout-section-content.component';
import { DtSidebarLayoutSectionFooterComponent } from './sidebar-layout-section-footer/sidebar-layout-section-footer.component';

@NgModule({
  imports: [
    CommonModule,
    DtSidebarLayoutSectionsComponent,
    DtSidebarLayoutSectionHeaderComponent,
    DtSidebarLayoutSectionContentComponent,
    DtSidebarLayoutSectionFooterComponent,
  ],
  exports: [
    DtSidebarLayoutSectionsComponent,
    DtSidebarLayoutSectionHeaderComponent,
    DtSidebarLayoutSectionContentComponent,
    DtSidebarLayoutSectionFooterComponent,
  ],
})
export class DtSidebarLayoutSectionsModule {}
