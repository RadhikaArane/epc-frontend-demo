import { Component, inject, signal, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { BreadcrumbsComponent } from '../../../../common/breadcrumbs/breadcrumbs.component';
import { breadCrumbItems } from '../../../../../shared/models/models';
import { ToastService } from '../../../../../shared/services/componentServices/toast.service';
import { PbFtmEntriesService } from '../../../../../shared/services/projectBusiness/pb-ftm-entries.service';
import { PbUploadService } from '../../../../../shared/services/projectBusiness/pb-upload.service';

@Component({
  selector: 'app-pb-uploads',
  standalone: true,
  imports: [CommonModule, BreadcrumbsComponent],
  templateUrl: './pb-uploads.component.html',
  styleUrl: './pb-uploads.component.scss'
})
export class PbUploadsComponent implements OnDestroy {

  private toastSrv = inject(ToastService);
  private ftmSrv = inject(PbFtmEntriesService);
  private uploadsSrv = inject(PbUploadService);
  private destroy$ = new Subject<void>();

  breadCrumbItems = signal<breadCrumbItems[]>([
    { label: 'Project Management' },
    { label: 'Uploads' }
  ]);

  // ==================== FTM UPLOAD ====================

  @ViewChild('ftmFileInput') ftmFileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('provisionFileInput') provisionFileInput!: ElementRef<HTMLInputElement>;

  ftmFile = signal<File | null>(null);
  provisionFile = signal<File | null>(null);
  ftmProvisionError = signal<string>('');
  isFtmProvisionUploading = signal(false);

  onFtmFileSelect(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0] ?? null;
    if (!file) { this.ftmFile.set(null); return; }
    const v = this.validateExcelFile(file);
    if (!v.isValid) {
      this.ftmProvisionError.set(v.message);
      this.ftmFile.set(null);
      (event.target as HTMLInputElement).value = '';
      return;
    }
    this.ftmFile.set(file);
    this.ftmProvisionError.set('');
  }

  onProvisionFileSelect(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0] ?? null;
    if (!file) { this.provisionFile.set(null); return; }
    const v = this.validateExcelFile(file);
    if (!v.isValid) {
      this.ftmProvisionError.set(v.message);
      this.provisionFile.set(null);
      (event.target as HTMLInputElement).value = '';
      return;
    }
    this.provisionFile.set(file);
    this.ftmProvisionError.set('');
  }

  uploadFtmWithProvision(): void {
    if (!this.ftmFile()) {
      this.ftmProvisionError.set('FTM file is required.');
      return;
    }
    this.isFtmProvisionUploading.set(true);
    this.ftmProvisionError.set('');

    const formData = new FormData();
    formData.append('file', this.ftmFile()!);
    if (this.provisionFile()) {
      formData.append('provisionFile', this.provisionFile()!);
    }

    this.ftmSrv._uploadFTMAttachment(formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.isFtmProvisionUploading.set(false);
          const msg = this.provisionFile()
            ? 'FTM and Provision uploaded successfully'
            : 'FTM uploaded successfully';
          this.toastSrv.showToast(msg, 'success');
          this.resetFtmProvisionForm();
        },
        error: (err) => {
          this.isFtmProvisionUploading.set(false);
          this.ftmProvisionError.set(err?.error?.message || 'Upload failed. Please try again.');
          this.toastSrv.showToast('Upload failed', 'error');
        }
      });
  }

  resetFtmProvisionForm(): void {
    this.ftmFile.set(null);
    this.provisionFile.set(null);
    this.ftmProvisionError.set('');
    if (this.ftmFileInput) this.ftmFileInput.nativeElement.value = '';
    if (this.provisionFileInput) this.provisionFileInput.nativeElement.value = '';
  }

  // ==================== COLLECTION UPLOAD ====================

  @ViewChild('collectionFileInput') collectionFileInput!: ElementRef<HTMLInputElement>;

  collectionFile = signal<File | null>(null);
  collectionError = signal<string>('');
  isCollectionUploading = signal(false);

  onCollectionFileSelect(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0] ?? null;
    if (!file) { this.collectionFile.set(null); return; }
    const v = this.validateExcelFile(file);
    if (!v.isValid) {
      this.collectionError.set(v.message);
      this.collectionFile.set(null);
      (event.target as HTMLInputElement).value = '';
      return;
    }
    this.collectionFile.set(file);
    this.collectionError.set('');
  }

  uploadCollection(): void {
    if (!this.collectionFile()) {
      this.collectionError.set('Please select a file to upload.');
      return;
    }
    this.isCollectionUploading.set(true);
    this.collectionError.set('');

    const formData = new FormData();
    formData.append('File', this.collectionFile()!);

    this.uploadsSrv._uploadCollectionData(formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.isCollectionUploading.set(false);
          this.toastSrv.showToast('Collection data uploaded successfully', 'success');
          this.resetCollectionForm();
        },
        error: (err) => {
          this.isCollectionUploading.set(false);
          this.collectionError.set(err?.error?.message || 'Upload failed. Please try again.');
          this.toastSrv.showToast('Collection upload failed', 'error');
        }
      });
  }

  resetCollectionForm(): void {
    this.collectionFile.set(null);
    this.collectionError.set('');
    if (this.collectionFileInput) this.collectionFileInput.nativeElement.value = '';
  }

  // ==================== SALES UPLOAD ====================

  @ViewChild('salesFileInput') salesFileInput!: ElementRef<HTMLInputElement>;

  salesFile = signal<File | null>(null);
  salesError = signal<string>('');
  isSalesUploading = signal(false);

  onSalesFileSelect(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0] ?? null;
    if (!file) { this.salesFile.set(null); return; }
    const v = this.validateExcelFile(file);
    if (!v.isValid) {
      this.salesError.set(v.message);
      this.salesFile.set(null);
      (event.target as HTMLInputElement).value = '';
      return;
    }
    this.salesFile.set(file);
    this.salesError.set('');
  }

  uploadSales(): void {
    if (!this.salesFile()) {
      this.salesError.set('Please select a file to upload.');
      return;
    }
    this.isSalesUploading.set(true);
    this.salesError.set('');

    const formData = new FormData();
    formData.append('File', this.salesFile()!);

    this.uploadsSrv._uploadSalesData(formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.isSalesUploading.set(false);
          this.toastSrv.showToast('Sales data uploaded successfully', 'success');
          this.resetSalesForm();
        },
        error: (err) => {
          this.isSalesUploading.set(false);
          this.salesError.set(err?.error?.message || 'Upload failed. Please try again.');
          this.toastSrv.showToast('Sales upload failed', 'error');
        }
      });
  }

  resetSalesForm(): void {
    this.salesFile.set(null);
    this.salesError.set('');
    if (this.salesFileInput) this.salesFileInput.nativeElement.value = '';
  }

  // ==================== SHARED VALIDATION ====================

  validateExcelFile(file: File): { isValid: boolean; message: string } {
    const maxSize = 5 * 1024 * 1024;
    const allowedExtensions = ['.xls', '.xlsx'];
    const fileName = file.name.toLowerCase();

    if (!allowedExtensions.some(ext => fileName.endsWith(ext))) {
      return { isValid: false, message: 'Only Excel files (.xls, .xlsx) are allowed.' };
    }
    if (file.size > maxSize) {
      return { isValid: false, message: 'File size must not exceed 5MB.' };
    }
    return { isValid: true, message: '' };
  }

  formatFileSize(bytes: number): string {
    return (bytes / 1024 / 1024).toFixed(2);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}