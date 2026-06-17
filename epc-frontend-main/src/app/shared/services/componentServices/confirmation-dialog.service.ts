// confirmation-dialog.service.ts
import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';

export interface DialogData {
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'confirm';
  autoClose?: boolean;
  autoCloseDelay?: number;
}

@Injectable({
  providedIn: 'root',
})
export class ConfirmationDialogService {
  private dialogState = new ReplaySubject<DialogData | null>(1);
  public dialogState$ = this.dialogState.asObservable();
  private confirmResult: boolean = false;

  openDialog(data: DialogData) {
    this.dialogState.next(data);
  }

  closeDialog(result: boolean) {
    this.confirmResult = result;
    this.dialogState.next(null);
  }

  confirmDialog(): Promise<boolean> {
    return new Promise((resolve) => {
      const subscription = this.dialogState.subscribe((data) => {
        if (data === null) {
          resolve(this.confirmResult);
          subscription.unsubscribe();
        }
      });
    });
  }

  // Show success message
  showSuccess(message: string, title: string = 'Success', autoClose: boolean = true) {
    this.openDialog({
      title,
      message,
      type: 'success',
      autoClose,
      autoCloseDelay: 3000
    });
  }

  // Show error message
  showError(message: string, title: string = 'Error', autoClose: boolean = false) {
    this.openDialog({
      title,
      message,
      type: 'error',
      autoClose,
      autoCloseDelay: 5000
    });
  }

  // Show warning message
  showWarning(message: string, title: string = 'Warning', autoClose: boolean = true) {
    this.openDialog({
      title,
      message,
      type: 'warning',
      autoClose,
      autoCloseDelay: 4000
    });
  }

  // Show confirmation dialog
  async showConfirm(message: string, title: string = 'Confirm'): Promise<boolean> {
    this.openDialog({
      title,
      message,
      type: 'confirm',
      autoClose: false
    });
    return await this.confirmDialog();
  }
}