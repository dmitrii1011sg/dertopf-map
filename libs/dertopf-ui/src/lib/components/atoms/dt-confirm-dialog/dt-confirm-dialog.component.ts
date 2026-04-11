import { Component, inject } from '@angular/core';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDanger?: boolean;
}

@Component({
  selector: 'dt-confirm-dialog',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './dt-confirm-dialog.component.html',
  styleUrls: ['./dt-confirm-dialog.component.scss'],
})
export class DtConfirmDialogComponent {
  readonly dialogRef = inject(DialogRef<boolean>);
  readonly data: ConfirmDialogData = inject(DIALOG_DATA);

  readonly icons = {
    warning: faExclamationTriangle,
  };

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
