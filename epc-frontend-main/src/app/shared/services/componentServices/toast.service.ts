import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Toast } from '../../models/common-models/common'; 

export interface ToastMessage extends Toast {
  id: string;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastSubject = new Subject<ToastMessage>();
  toast$: Observable<ToastMessage> = this.toastSubject.asObservable();

  showToast(message: string, type: 'success' | 'error' | 'warning' | 'info'): void {
    const toast: ToastMessage = { 
      id: this.generateId(),
      message, 
      type 
    };
    this.toastSubject.next(toast);
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}