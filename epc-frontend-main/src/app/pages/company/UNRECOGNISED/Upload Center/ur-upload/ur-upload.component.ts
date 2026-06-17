
import { Component, ViewChild, ElementRef, signal, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BreadcrumbsComponent } from '../../../../common/breadcrumbs/breadcrumbs.component';
import { UrUploadCenterService } from '../../../../../shared/services/unrecognisedInvoice/ur-upload-center.service';
import { ToastService } from '../../../../../shared/services/componentServices/toast.service';
import { AuthService } from '../../../../../shared/services/common/auth.service';

@Component({
  selector: 'app-ur-upload',
  standalone: true,
  imports: [CommonModule, BreadcrumbsComponent],
  templateUrl: './ur-upload.component.html',
  styleUrl: './ur-upload.component.scss'
})

export class UrUploadComponent implements OnDestroy {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('salesFileInput') salesFileInput!: ElementRef<HTMLInputElement>;

  private urUploadSrv = inject(UrUploadCenterService);
  private toastSrv = inject(ToastService);
  private authSrv = inject(AuthService);
  private destroy$ = new Subject<void>();

  breadCrumbItems = signal([{ label: 'Upload Center' }]);
  selectedFile = signal<File | null>(null);
  selectedSalesFiles = signal<File[]>([]);
  uploading = signal(false);
  uploadingSales = signal(false);
  isUploading = signal(false);
  uploadProgress = signal(0);
  errorMessage = signal('');
  salesErrorMessage = signal('');

  get employeeId(): string | null {
    return this.authSrv.userDetails?.employeeId?.toString() || null;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onFileSelect(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedFile.set(file);
      this.errorMessage.set('');
    }
  }

  uploadFile() {
    const file = this.selectedFile();
    const empId = this.employeeId;
    if (!file || !empId) return;

    const formData = new FormData();
    formData.append('file', file); 
    formData.append('employeeId', empId); 

    this.executeUpload(this.urUploadSrv._uploadSAPUnrecognised(formData), 'SAP');
  }

  onSalesFileSelect(event: Event) {
    const files = Array.from((event.target as HTMLInputElement).files || []);
    this.selectedSalesFiles.set(files);
  }

  uploadSalesFiles() {
    const files = this.selectedSalesFiles();
    const empId = this.employeeId;
    if (files.length === 0 || !empId) return;

    const formData = new FormData();
    files.forEach(f => formData.append('file', f)); 
    formData.append('employeeId', empId); 

    this.executeUpload(this.urUploadSrv.uploadSalesFTM(formData), 'SalesFTM');
  }

  private executeUpload(obs$: Observable<any>, type: string) {
    this.isUploading.set(true);
    this.uploadProgress.set(0);
    if (type === 'SAP') this.uploading.set(true); else this.uploadingSales.set(true);

    const interval = setInterval(() => {
      const curr = this.uploadProgress();
      if (curr < 90) this.uploadProgress.set(curr + 10);
    }, 200);

    obs$.pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        clearInterval(interval);
        this.uploadProgress.set(100);
        setTimeout(() => {
          this.toastSrv.showToast(`${type} uploaded successfully`, 'success');
          this.resetAll();
        }, 500);
      },
      error: (err) => {
        clearInterval(interval);
        this.isUploading.set(false);
        this.uploading.set(false);
        this.uploadingSales.set(false);
        this.toastSrv.showToast(err?.error?.message || 'Upload failed.', 'error');
      }
    });
  }

  resetAll() {
    this.selectedFile.set(null);
    this.selectedSalesFiles.set([]);
    this.isUploading.set(false);
    this.uploading.set(false);
    this.uploadingSales.set(false);
    if (this.fileInput) this.fileInput.nativeElement.value = '';
    if (this.salesFileInput) this.salesFileInput.nativeElement.value = '';
  }

  getFileSizeDisplay(file: File | null): string {
    if (!file) return '';
    return (file.size / (1024 * 1024)).toFixed(2) + ' MB';
  }
}