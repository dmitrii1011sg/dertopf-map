import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-sidebar-layout-section-content',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  template: `
    <section class="content-section">
      @if (isLoading && loaderType === 'fullscreen') {
        <div class="loader-overlay" [class.hidden-loader]="!isLoading">
          <div class="loader-body">
            <mat-spinner diameter="48" class="mx-auto"></mat-spinner>
            @if (loadingText) {
              <p class="loading-text">{{ loadingText }}</p>
            }
            @if (loadingSubtext) {
              <p class="loading-subtext">{{ loadingSubtext }}</p>
            }
          </div>
        </div>
      }

      <div class="scroll-container" [class.opacity-loading]="isLoading">
        <div class="min-w-container">
          <div class="fit-content-container">
            <ng-content></ng-content>
          </div>
        </div>
      </div>

      @if (isLoading && loaderType === 'inline') {
        <div class="inline-loader">
          <div class="inline-loader-card">
            <mat-spinner diameter="20"></mat-spinner>
            <span class="inline-text">{{ loadingText }}</span>
          </div>
        </div>
      }
    </section>
  `,
  styles: `
    :host {
      display: block;
      height: 100%;
      width: 100%;
      min-width: 0;
      position: relative;
    }

    .content-section {
      height: 100%;
      overflow: hidden;
      position: relative;
    }

    /* Fullscreen Loader */
    .loader-overlay {
      position: absolute;
      inset: 0;
      z-index: 50;
      background-color: rgba(255, 255, 255, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: opacity 300ms ease;

      &.hidden-loader {
        opacity: 0;
        pointer-events: none;
      }
    }

    .loader-body {
      text-align: center;

      .loading-text {
        margin-top: 1rem;
        color: #4b5563;
      }

      .loading-subtext {
        margin-top: 0.5rem;
        font-size: 0.875rem;
        color: #6b7280;
      }
    }

    /* Main Content Area */
    .scroll-container {
      height: 100%;
      overflow: auto;
      transition: opacity 300ms ease;

      &.opacity-loading {
        opacity: 0.3;
        pointer-events: none;
      }
    }

    .min-w-container,
    .fit-content-container {
      height: 100%;
    }

    .min-w-container {
      min-width: 0;
    }
    .fit-content-container {
      min-width: fit-content;
    }

    /* Inline Loader */
    .inline-loader {
      position: absolute;
      bottom: 1rem;
      right: 1rem;
      z-index: 40;
    }

    .inline-loader-card {
      background-color: white;
      border-radius: 0.5rem;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      padding: 0.75rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;

      .inline-text {
        font-size: 0.875rem;
        color: #4b5563;
      }
    }
  `,
})
export class DtSidebarLayoutSectionContentComponent {
  @Input() isLoading = false;
  @Input() loadingText = '';
  @Input() loadingSubtext = '';
  @Input() loaderType: 'fullscreen' | 'inline' = 'fullscreen';
}
