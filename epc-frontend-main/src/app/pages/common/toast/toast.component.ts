import { Component, OnInit, OnDestroy } from '@angular/core'; 
import { ToastMessage, ToastService } from '../../../shared/services/componentServices/toast.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { Toast } from '../../../shared/models/common-models/common';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss'
})
export class ToastComponent implements OnInit, OnDestroy {
   toasts: ToastMessage[] = [];
  subscription?: Subscription;

  constructor(private toastService: ToastService) { }

  ngOnInit(): void {
    this.subscription = this.toastService.toast$.subscribe((toast) => {
      // Add new toast to the array
      this.toasts.push(toast);
      
      // Auto remove after 3 seconds
      setTimeout(() => {
        this.removeToast(toast.id);
      }, 4000);
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  removeToast(id: string): void {
    this.toasts = this.toasts.filter(t => t.id !== id);
  }

  // Get Bootstrap alert class based on type
  
  getAlertClass(type: string): string { 
    switch (type) {
      case 'success':
        return 'alert-success';
      case 'error':
        return 'alert-danger';
      case 'warning':
        return 'alert-warning';
      case 'info':
        return 'alert-info';
      default:
        return 'alert-primary';
    }
  }

  // Get icon class based on type
   getIconClass(type: string): string {
    switch (type) {
      case 'success':
        return 'bi-check-circle-fill';
      case 'error':
        return 'bi-x-circle-fill';
      case 'warning':
        return 'bi-exclamation-triangle-fill';
      case 'info':
        return 'bi-info-circle-fill';
      default:
        return 'bi-info-circle';
    }
  }
}