// confirmation-dialog.component.ts
import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription, timer } from 'rxjs';
import { ConfirmationDialogService, DialogData } from '../../../shared/services/componentServices/confirmation-dialog.service';

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.scss',
})
export class ConfirmationDialogComponent implements OnInit, OnDestroy {
  private confirmationDialogSrv = inject(ConfirmationDialogService);

  dialogData = signal<DialogData | null>(null);
  subscription?: Subscription;
  timerSubscription?: Subscription;
  countdown = signal<number>(0);

  ngOnInit(): void {
    this.subscription = this.confirmationDialogSrv.dialogState$.subscribe(
      (data: DialogData | null) => {
        this.dialogData.set(data);
        
        // Clear existing timer
        if (this.timerSubscription) {
          this.timerSubscription.unsubscribe();
        }

        // Start auto-close timer if enabled
        if (data?.autoClose && data.autoCloseDelay) {
          const delay = data.autoCloseDelay / 1000; // Convert to seconds
          this.countdown.set(delay);
          
          this.timerSubscription = timer(0, 1000).subscribe((elapsed) => {
            const remaining = delay - elapsed;
            this.countdown.set(remaining);
            
            if (remaining <= 0) {
              this.onNoClick();
            }
          });
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.timerSubscription?.unsubscribe();
  }

  onNoClick() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
    this.confirmationDialogSrv.closeDialog(false);
  }

  onYesClick() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
    this.confirmationDialogSrv.closeDialog(true);
  }

  getMessageClass() {
    if (this.dialogData() && this.dialogData()!.type) {
      switch (this.dialogData()!.type) {
        case 'success':
          return 'success';
        case 'error':
          return 'error';
        case 'warning':
          return 'warning';
        case 'confirm':
          return 'confirm';
        default:
          return '';
      }
    }
    return '';
  }

  getIcon() {
    if (this.dialogData() && this.dialogData()!.type) {
      switch (this.dialogData()!.type) {
        case 'success':
          return 'bi bi-check-circle-fill';
        case 'error':
          return 'bi bi-x-circle-fill';
        case 'warning':
          return 'bi bi-exclamation-triangle-fill';
        case 'confirm':
          return 'bi bi-question-circle-fill';
        default:
          return 'bi bi-info-circle-fill';
      }
    }
    return 'bi bi-info-circle-fill';
  }
}