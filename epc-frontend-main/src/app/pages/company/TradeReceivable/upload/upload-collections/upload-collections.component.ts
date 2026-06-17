import { Component, ViewChild, ElementRef, signal, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { TrUploadCenterService } from '../../../../../shared/services/tradeReceivable/tr-upload-center.service';
import { ToastService } from '../../../../../shared/services/componentServices/toast.service';
import { BreadcrumbsComponent } from '../../../../common/breadcrumbs/breadcrumbs.component';


@Component({
  selector: 'app-upload-collections',
  standalone: true,
  imports: [CommonModule, FormsModule, BreadcrumbsComponent],
  templateUrl: './upload-collections.component.html',
  styleUrl: './upload-collections.component.scss'
})
export class UploadCollectionsComponent implements OnDestroy {

  breadCrumbItems = signal([
    { label: 'Upload Center' },
    { label: 'Upload Collections' }
  ]);

  @ViewChild('collectionsInput') collectionsInput!: ElementRef<HTMLInputElement>;

  // Month - Years dropdown
  months: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  years: number[] = this.generateYears();

  // Selected file
  collectionsFile = signal<File | null>(null);

  // Error message
  collectionsError = signal<string>('');

  // Upload state
  collectionsUploading = signal<boolean>(false);

  // Form field
  collectionsUploadMonth = signal<string>('');
  collectionsUploadYear = signal<string>('');

  trUploadSrv = inject(TrUploadCenterService);
  toastSrv = inject(ToastService);

  private destroy$ = new Subject<void>();

  // ============ GENERATE Month - Years ============

  getAvailableMonths(selectedYear: string | number): string[] {
    const currentYear = new Date().getFullYear();
    const currentMonthIndex = new Date().getMonth();
    if (Number(selectedYear) === currentYear) {
      return this.months.slice(0, currentMonthIndex + 1);
    }
    return this.months;
  }

  onCollectionsYearChange(year: string): void {
    const currentYear = new Date().getFullYear();
    const currentMonthIndex = new Date().getMonth();
    if (Number(year) === currentYear && this.months.indexOf(this.collectionsUploadMonth()) > currentMonthIndex) {
      this.collectionsUploadMonth.set('');
    }
  }

  generateYears(): number[] {
    const currentYear = new Date().getFullYear();
    const years: number[] = [];
    const startYear = 2020;
    for (let year = startYear; year <= currentYear + 1; year++) {
      years.push(year);
    }
    return years;
  }

  // ============ FILE SELECTION HANDLER ============

  onCollectionsSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      this.collectionsFile.set(null);
      this.collectionsError.set('');
      return;
    }

    const validation = this.validateFile(file);
    if (!validation.isValid) {
      this.collectionsError.set(validation.message);
      this.collectionsFile.set(null);
      input.value = '';
      return;
    }

    this.collectionsFile.set(file);
    this.collectionsError.set('');
  }

  // ============ FILE VALIDATION ============

  validateFile(file: File): { isValid: boolean; message: string } {
    const maxSize = 50 * 1024 * 1024; // 50MB
    const allowedExtensions = ['.xls', '.xlsx', '.xlsb'];

    const fileName = file.name.toLowerCase();
    const hasValidExtension = allowedExtensions.some(ext => fileName.endsWith(ext));

    if (!hasValidExtension) {
      return {
        isValid: false,
        message: 'Only Excel files (.xls, .xlsx, .xlsb) are allowed.'
      };
    }

    if (file.size > maxSize) {
      return {
        isValid: false,
        message: 'File size must not exceed 50MB.'
      };
    }

    return { isValid: true, message: '' };
  }

  // ============ FORM VALIDATION ============

  isCollectionsFormValid(): boolean {
    return !!(this.collectionsUploadMonth() && this.collectionsUploadYear());
  }

  // ============ UPLOAD ============

  uploadCollections(): void {
    if (!this.collectionsFile()) {
      this.collectionsError.set('Please select a file first.');
      return;
    }

    if (!this.isCollectionsFormValid()) {
      this.collectionsError.set('Please select a Month and Year.');
      return;
    }

    this.collectionsUploading.set(true);
    this.collectionsError.set('');

    const formData = new FormData();
    formData.append('file', this.collectionsFile()!);
    formData.append('Month', this.collectionsUploadMonth());
    formData.append('Year', this.collectionsUploadYear());

    this.trUploadSrv._uploadCollections(formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          console.log('✅ Collections upload successful', res);
          this.collectionsUploading.set(false);
          this.toastSrv.showToast(
            `Collections file uploaded successfully. Inserted ${res.Inserted} rows.`,
            'success'
          );
          this.clearCollections();
        },
        error: (error) => {
          console.error('❌ Collections upload failed', error);
          this.collectionsUploading.set(false);
          this.collectionsError.set(error?.error?.message || 'Upload failed. Please try again.');
          this.toastSrv.showToast('Error uploading Collections file', 'error');
        }
      });
  }

  // ============ CLEAR ============

  clearCollections(): void {
    this.collectionsFile.set(null);
    this.collectionsError.set('');
    this.collectionsUploadMonth.set('');
    this.collectionsUploadYear.set('');
    if (this.collectionsInput) this.collectionsInput.nativeElement.value = '';
  }

  // ============ HELPER ============

  getFileSize(file: File | null): string {
    if (!file) return '';
    return (file.size / 1024 / 1024).toFixed(2);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
