import { CommonModule } from '@angular/common';
import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { BreadcrumbsComponent } from '../../../../common/breadcrumbs/breadcrumbs.component';
import { UrUploadCenterService } from '../../../../../shared/services/unrecognisedInvoice/ur-upload-center.service';
import { AuthService } from '../../../../../shared/services/common/auth.service';
import { ToastService } from '../../../../../shared/services/componentServices/toast.service';

@Component({
  selector: 'app-missing-record',
  standalone: true,
  imports: [CommonModule, FormsModule, BreadcrumbsComponent],
  templateUrl: './missing-record.component.html',
  styleUrl: './missing-record.component.scss'
})
export class MissingRecordComponent implements OnInit, OnDestroy {

  private urUploadSrv = inject(UrUploadCenterService);
  private authSrv = inject(AuthService);
  private toastSrv = inject(ToastService);
  private destroy$ = new Subject<void>();

  breadCrumbItems = signal([
    { label: 'Upload Center' },
    { label: 'Missing Records' },
  ]);

  private getCurrentDate(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // ---- State ----
  selectedMissingDate = signal<string>(this.getCurrentDate());
  isDownloadingMissing = signal<boolean>(false);

  selectedFile = signal<File | null>(null);
  isUploading = signal<boolean>(false);

  ngOnInit(): void {}

  onDateChange(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.selectedMissingDate.set(val);
  }

  downloadMissingRecord() {
    const dt = this.selectedMissingDate();
    const empId = String(this.authSrv.userDetails?.employeeId || '');

    if (!dt) return;
    this.isDownloadingMissing.set(true);

    this.urUploadSrv
      .exportMissingRecords(dt, empId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (blob: Blob) => {
          this.isDownloadingMissing.set(false);
          this.downloadBlob(blob, `MissingRecords_${this.safeFile(dt)}.xlsx`);
          this.toastSrv.showToast('Missing Records downloaded', 'success');
        },
        error: (err) => {
          console.error('❌ Download Error:', err);
          this.isDownloadingMissing.set(false);
          this.toastSrv.showToast('Missing Records download failed', 'error');
        },
      });
  }

  onFileChange(event: any) {
    const file = event.target?.files?.[0];
    
    if (file && file.name) {
      const ext = file.name.split('.').pop()?.toLowerCase();
      
      if (ext !== 'xlsx' && ext !== 'xls') {
        this.toastSrv.showToast('Please upload a valid Excel file (.xlsx or .xls)', 'error');
        event.target.value = ''; 
        this.selectedFile.set(null);
        return;
      }
      
      this.selectedFile.set(file);
    } else {
      this.selectedFile.set(null);
    }
  }

  removeFile() {
    this.selectedFile.set(null);
  }

  formatFileSize(bytes?: number): string {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  uploadMissingRecordFile(fileInputElement: HTMLInputElement) {
    const file = this.selectedFile() || (fileInputElement.files ? fileInputElement.files[0] : null);
    const empId = String(this.authSrv.userDetails?.employeeId || '');

    if (!file) {
      console.warn('⚠️ No file detected in HTML or Signal.');
      this.toastSrv.showToast('Please select a file first.', 'warning');
      return;
    }

    console.log('🚀 Starting upload for:', file.name);
    this.isUploading.set(true); 

    const formData = new FormData();
    formData.append('file', file); 
    formData.append('employeeId', empId); 

    this.urUploadSrv
      .uploadMissingRecords(formData) 
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          console.log('✅ Upload Success:', res);
          this.isUploading.set(false); 
          this.toastSrv.showToast('Missing records uploaded successfully!', 'success');
          
          this.removeFile();
          fileInputElement.value = ''; 
        },
        error: (err: any) => {
          console.error('❌ Upload Error:', err);
          this.isUploading.set(false); 
          this.toastSrv.showToast('Failed to upload the file', 'error');
        },
      });
  }

  // --- Utility Methods ---
  private downloadBlob(blob: Blob, fileName: string) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  private safeFile(name: string) {
    return String(name).replace(/[\/\\:*?"<>|]/g, '_');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}