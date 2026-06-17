import { Component, ViewChild, ElementRef, signal, inject, OnDestroy, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { firstValueFrom, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TrUploadCenterService } from '../../../../../shared/services/tradeReceivable/tr-upload-center.service';
import { ToastService } from '../../../../../shared/services/componentServices/toast.service';
import { BreadcrumbsComponent } from '../../../../common/breadcrumbs/breadcrumbs.component';
import { FormsModule } from '@angular/forms';
declare var bootstrap: any;

@Component({
  selector: 'app-tr-upload-sap-files',
  standalone: true,
  imports: [CommonModule, FormsModule, BreadcrumbsComponent],
  templateUrl: './tr-upload-sap-files.component.html',
  styleUrl: './tr-upload-sap-files.component.scss'
})
export class TrUploadSapFilesComponent implements OnDestroy {

  breadCrumbItems = signal([{ label: 'Upload Center' }]);

  // ===== ViewChildren =====
  @ViewChild('fbl5nInput') fbl5nInput!: ElementRef<HTMLInputElement>;
  @ViewChild('assignmentInput') assignmentInput!: ElementRef<HTMLInputElement>;
  @ViewChild('salesInput') salesInput!: ElementRef<HTMLInputElement>;
  @ViewChild('customerInput') customerInput!: ElementRef<HTMLInputElement>;
  @ViewChild('instandInput') instandInput!: ElementRef<HTMLInputElement>;
  @ViewChild('downloadModal') downloadModal!: ElementRef;

  // New ViewChildren
  @ViewChild('projectBusinessInput') projectBusinessInput!: ElementRef<HTMLInputElement>;
  @ViewChild('debitInput') debitInput!: ElementRef<HTMLInputElement>;
  @ViewChild('unbookedInput') unbookedInput!: ElementRef<HTMLInputElement>;
  @ViewChild('pddInput') pddInput!: ElementRef<HTMLInputElement>;
  @ViewChild('missingInput') missingInput!: ElementRef<HTMLInputElement>;
  @ViewChild('pddRemovalInput') pddRemovalInput!: ElementRef<HTMLInputElement>;
  @ViewChild('allSheetsInput') allSheetsInput!: ElementRef<HTMLInputElement>;

  months: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  years: number[] = this.generateYears();

  // ===== Selected Files =====
  fbl5nFile = signal<File | null>(null);
  assignmentFile = signal<File | null>(null);
  salesFile = signal<File | null>(null);
  customerFile = signal<File | null>(null);
  instandFile = signal<File | null>(null);
  projectBusinessFile = signal<File | null>(null);
  debitFile = signal<File | null>(null);
  unbookedFile = signal<File | null>(null);
  pddFile = signal<File | null>(null);
  missingFile = signal<File | null>(null);
  pddRemovalFile = signal<File | null>(null);
  pddRemovalError = signal<string>('');
  PddRemovalMonth = signal<string>('');
  PddRemovalYear = signal<string>('');


  // ===== Error Messages =====
  fbl5nError = signal<string>('');
  assignmentError = signal<string>('');
  salesError = signal<string>('');
  customerError = signal<string>('');
  instandError = signal<string>('');
  projectBusinessError = signal<string>('');
  debitError = signal<string>('');
  unbookedError = signal<string>('');
  pddError = signal<string>('');
  missingError = signal<string>('');
  missingCountError = signal<string>('');

  // ===== Upload States =====
  fbl5nUploading = signal<boolean>(false);
  assignmentUploading = signal<boolean>(false);
  salesUploading = signal<boolean>(false);
  customerUploading = signal<boolean>(false);
  instandUploading = signal<boolean>(false);
  projectBusinessUploading = signal<boolean>(false);
  debitUploading = signal<boolean>(false);
  unbookedUploading = signal<boolean>(false);
  pddUploading = signal<boolean>(false);
  missingUploading = signal<boolean>(false);
  pddRemovalUploading = signal<boolean>(false);

  // ===== Download & Fetch States =====
  debitDownloading = signal<boolean>(false);
  missingFetchingCount = signal<boolean>(false);
  missingDownloading = signal<boolean>(false);
  missingCount = signal<number | null>(null);

  // ===== Form Fields =====
  FBL5NUploadMonth = signal<string>('');
  FBL5NUploadYear = signal<string>('');
  AssignmentUploadMonth = signal<string>('');
  AssignmentUploadYear = signal<string>('');
  DebitMonth = signal<string>('');
  DebitYear = signal<string>('');
  UnbookedMonth = signal<string>('');
  UnbookedYear = signal<string>('');
  PddMonth = signal<string>('');
  PddYear = signal<string>('');
  MissingMonth = signal<string>('');
  MissingYear = signal<string>('');

  // Receivable Download state
  selectedAsOfDate = signal<string>('');
  selectedMonth = signal<string>('');
  selectedYear = signal<string>('');
  maxDate: string = new Date().toISOString().split('T')[0];
  isDownloading = signal<boolean>(false);
  downloadError = signal<string>('');

  // ===== All Sheets Download =====
  allSheetsDownloading = signal<boolean>(false);
  allSheetsError = signal<string>('');
  AllSheetsExportMonth = signal<string>('');
  AllSheetsExportYear = signal<string>('');
  allSheetsExportError = signal<string>('');

  // ===== All Sheet Upload =====
  AllSheetsUploadMonth = signal<string>('');
  AllSheetsUploadYear = signal<string>('');
  allSheetsUploading = signal<boolean>(false);
  allSheetsFile = signal<File | null>(null);
  allSheetsUploadError = signal<string>('');

  trUploadSrv = inject(TrUploadCenterService);
  toastSrv = inject(ToastService);
  private destroy$ = new Subject<void>();

  // ============ INITIALIZATION ============
  generateYears(): number[] {
    const currentYear = new Date().getFullYear();
    const years: number[] = [];
    for (let year = 2020; year <= currentYear + 1; year++) {
      years.push(year);
    }
    return years;
  }

  getAvailableMonths(selectedYear: string | number): string[] {
    const currentYear = new Date().getFullYear();
    const currentMonthIndex = new Date().getMonth();
    if (Number(selectedYear) === currentYear) {
      return this.months.slice(0, currentMonthIndex + 1);
    }
    return this.months;
  }

  private clearMonthIfInvalid(monthSignal: WritableSignal<string>, yearVal: string): void {
    const currentYear = new Date().getFullYear();
    const currentMonthIndex = new Date().getMonth();
    if (Number(yearVal) === currentYear && this.months.indexOf(monthSignal()) > currentMonthIndex) {
      monthSignal.set('');
    }
  }

  onFBL5NYearChange(year: string): void { this.clearMonthIfInvalid(this.FBL5NUploadMonth, year); }
  onAssignmentYearChange(year: string): void { this.clearMonthIfInvalid(this.AssignmentUploadMonth, year); }
  onDebitYearChange(year: string): void { this.clearMonthIfInvalid(this.DebitMonth, year); }
  onUnbookedYearChange(year: string): void { this.clearMonthIfInvalid(this.UnbookedMonth, year); }
  onPddYearChange(year: string): void { this.clearMonthIfInvalid(this.PddMonth, year); }
  onPddRemovalYearChange(year: string): void { this.clearMonthIfInvalid(this.PddRemovalMonth, year); }
  onPddRemovalSelect(event: Event): void { this.handleFileSelect(event, this.pddRemovalFile, this.pddRemovalError, this.PddRemovalMonth, this.PddRemovalYear); }
  onAllSheetsExportYearChange(year: string): void { this.clearMonthIfInvalid(this.AllSheetsExportMonth, year); }
  onAllSheetsUploadYearChange(year: string): void { this.clearMonthIfInvalid(this.AllSheetsUploadMonth, year); }
  onAllSheetsSelect(event: Event): void { this.handleFileSelect(event, this.allSheetsFile, this.allSheetsUploadError, this.AllSheetsUploadMonth, this.AllSheetsUploadYear); }
  
  onMissingYearChange(year: string): void { 
    this.clearMonthIfInvalid(this.MissingMonth, year); 
    this.onMissingDateChange();
  }

  onMissingDateChange(): void {
    this.missingCount.set(null);
    this.missingCountError.set('');
  }

  // ============ RECEIVABLE SHEET LOGIC ============
  onDownloadMonthOrYearChange(): void {
    const month = this.selectedMonth();
    const year = this.selectedYear();
    if (!month || !year) return;

    const monthIndex = this.months.indexOf(month);
    if (monthIndex === -1) return;

    const targetMonth = monthIndex === 11 ? 0 : monthIndex + 1;
    const targetYear = monthIndex === 11 ? Number(year) + 1 : Number(year);
    const m = String(targetMonth + 1).padStart(2, '0');
    this.selectedAsOfDate.set(`${targetYear}-${m}-01`);
  }

  getDownloadAsOfDateMax(): string {
    const month = this.selectedMonth();
    const year = this.selectedYear();
    if (!month || !year) return this.maxDate;

    const monthIndex = this.months.indexOf(month);
    if (monthIndex === -1) return this.maxDate;

    const targetMonth = monthIndex === 11 ? 0 : monthIndex + 1;
    const targetYear = monthIndex === 11 ? Number(year) + 1 : Number(year);
    const lastDay = new Date(targetYear, targetMonth + 1, 0);
    const y = lastDay.getFullYear();
    const m = String(lastDay.getMonth() + 1).padStart(2, '0');
    const d = String(lastDay.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  // ============ FILE SELECTION HANDLERS ============
  onFbl5nSelect(event: Event): void { this.handleFileSelect(event, this.fbl5nFile, this.fbl5nError, this.FBL5NUploadMonth, this.FBL5NUploadYear); }
  onAssignmentSelect(event: Event): void { this.handleFileSelect(event, this.assignmentFile, this.assignmentError, this.AssignmentUploadMonth, this.AssignmentUploadYear); }
  onSalesSelect(event: Event): void { this.handleFileSelect(event, this.salesFile, this.salesError); } 
  onCustomerSelect(event: Event): void { this.handleFileSelect(event, this.customerFile, this.customerError); } 
  onInstandSelect(event: Event): void { this.handleFileSelect(event, this.instandFile, this.instandError); } 
  onProjectBusinessSelect(event: Event): void { this.handleFileSelect(event, this.projectBusinessFile, this.projectBusinessError); } 
  onDebitSelect(event: Event): void { this.handleFileSelect(event, this.debitFile, this.debitError, this.DebitMonth, this.DebitYear); }
  onUnbookedSelect(event: Event): void { this.handleFileSelect(event, this.unbookedFile, this.unbookedError, this.UnbookedMonth, this.UnbookedYear); }
  onPddSelect(event: Event): void { this.handleFileSelect(event, this.pddFile, this.pddError, this.PddMonth, this.PddYear); }
  onMissingSelect(event: Event): void { this.handleFileSelect(event, this.missingFile, this.missingError, this.MissingMonth, this.MissingYear); }

  private handleFileSelect(
    event: Event, 
    fileSignal: WritableSignal<File | null>, 
    errorSignal: WritableSignal<string>,
    monthSignal?: WritableSignal<string>, 
    yearSignal?: WritableSignal<string>
  ): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      fileSignal.set(null);
      errorSignal.set('');
      return;
    }

    if (monthSignal && yearSignal) {
      if (!monthSignal() || !yearSignal()) {
        errorSignal.set('Please select Month and Year before choosing a file.');
        fileSignal.set(null);
        input.value = '';
        return;
      }
    }

    const validation = this.validateFile(file);
    if (!validation.isValid) {
      errorSignal.set(validation.message);
      fileSignal.set(null);
      input.value = '';
      return;
    }

    fileSignal.set(file);
    errorSignal.set('');
  }

  validateFile(file: File): { isValid: boolean; message: string } {
    const maxSize = 50 * 1024 * 1024; // 50MB
    const allowedExtensions = ['.xls', '.xlsx', '.xlsb'];
    const fileName = file.name.toLowerCase();

    if (!allowedExtensions.some(ext => fileName.endsWith(ext))) {
      return { isValid: false, message: 'Only Excel files (.xls, .xlsx, .xlsb) are allowed.' };
    }
    if (file.size > maxSize) {
      return { isValid: false, message: 'File size must not exceed 50MB.' };
    }
    return { isValid: true, message: '' };
  }

  // ============ MASTER UPLOAD LOGIC ============
  uploadAllSelectedFiles(): void {
    if (this.fbl5nFile() && !this.fbl5nUploading()) this.uploadFbl5n();
    if (this.assignmentFile() && !this.assignmentUploading()) this.uploadAssignment();
    if (this.salesFile() && !this.salesUploading()) this.uploadSales();
    if (this.customerFile() && !this.customerUploading()) this.uploadCustomer();
    if (this.instandFile() && !this.instandUploading()) this.uploadInstand();
    if (this.projectBusinessFile() && !this.projectBusinessUploading()) this.uploadProjectBusiness();
    if (this.debitFile() && !this.debitUploading() && this.isDebitFormValid()) this.uploadDebit();
    if (this.unbookedFile() && !this.unbookedUploading() && this.isUnbookedFormValid()) this.uploadUnbooked();
    if (this.pddFile() && !this.pddUploading() && this.isPddFormValid()) this.uploadPdd();
    if (this.missingFile() && !this.missingUploading() && this.isMissingFormValid()) this.uploadMissing();
    if (this.pddRemovalFile() && !this.pddRemovalUploading() && this.isPddRemovalFormValid()) this.uploadPddRemoval();
    if (this.allSheetsFile() && !this.allSheetsUploading() && this.isAllSheetsUploadFormValid()) this.uploadAllSheets();
  }

  // ============ INDIVIDUAL UPLOADS ============
  uploadFbl5n(): void {
    if (!this.isFBL5NFormValid()) { this.fbl5nError.set('Please select Month and Year.'); return; }
    this.fbl5nUploading.set(true);
    const formData = new FormData();
    formData.append('file', this.fbl5nFile()!);
    formData.append('Month', this.FBL5NUploadMonth());
    formData.append('Year', this.FBL5NUploadYear());

    this.trUploadSrv._uploadFbl5nAttachment(formData).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        this.fbl5nUploading.set(false);
        this.toastSrv.showToast(`FBL5N uploaded. Inserted ${res.Inserted} rows.`, 'success');
        this.clearFbl5n();
      },
      error: (error) => {
        this.fbl5nUploading.set(false);
        this.fbl5nError.set(error?.error?.message || 'Upload failed.');
        this.toastSrv.showToast('Error uploading FBL5N', 'error');
      }
    });
  }

  uploadAssignment(): void {
    if (!this.isAssignmentFormValid()) { this.assignmentError.set('Please select Month and Year.'); return; }
    this.assignmentUploading.set(true);
    const formData = new FormData();
    formData.append('file', this.assignmentFile()!);
    formData.append('Month', this.AssignmentUploadMonth());
    formData.append('Year', this.AssignmentUploadYear());

    this.trUploadSrv._uploadAssignmentAttachment(formData).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        this.assignmentUploading.set(false);
        this.toastSrv.showToast(`Assignment uploaded. Inserted ${res.Inserted} rows.`, 'success');
        this.clearAssignment();
      },
      error: (error) => {
        this.assignmentUploading.set(false);
        this.assignmentError.set(error?.error?.message || 'Upload failed.');
        this.toastSrv.showToast('Error uploading Assignment', 'error');
      }
    });
  }

  uploadSales(): void {
    this.salesUploading.set(true);
    const formData = new FormData();
    formData.append('file', this.salesFile()!);
    this.trUploadSrv._uploadSalesFy25Attachment(formData).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        this.salesUploading.set(false);
        this.toastSrv.showToast(`Sale Register uploaded. ${res.Inserted} rows.`, 'success');
        this.clearSales();
      },
      error: (error) => {
        this.salesUploading.set(false);
        this.salesError.set(error?.error?.message || 'Upload failed.');
        this.toastSrv.showToast('Error uploading Sale Register', 'error');
      }
    });
  }

  uploadAllSheets(): void {
    this.allSheetsUploading.set(true); 
    const formData = new FormData();
    formData.append('File', this.allSheetsFile()!);
    formData.append('Month', this.AllSheetsUploadMonth());
    formData.append('Year', this.AllSheetsUploadYear());

    this.trUploadSrv._uploadAllSheets(formData).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        this.allSheetsUploading.set(false); 
        if (res.success) {
          this.toastSrv.showToast(res.message || 'All sheets uploaded successfully.', 'success');
          this.clearAllSheetsUpload();
        } else {
          this.allSheetsUploadError.set(res.message || 'Upload failed.');
        }
      },
      error: (error) => {
        this.allSheetsUploading.set(false); 
        this.allSheetsUploadError.set(error?.error?.message || 'Upload failed.');
        this.toastSrv.showToast('Error uploading All Sheets Data', 'error');
      }
    });
  }

  uploadCustomer(): void {
    this.customerUploading.set(true);
    const formData = new FormData();
    formData.append('file', this.customerFile()!);
    this.trUploadSrv._uploadCustomerMasterAttachment(formData).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        this.customerUploading.set(false);
        this.toastSrv.showToast(`Customer Master uploaded. ${res.Inserted} rows.`, 'success');
        this.clearCustomer();
      },
      error: (error) => {
        this.customerUploading.set(false);
        this.customerError.set(error?.error?.message || 'Upload failed.');
        this.toastSrv.showToast('Error uploading Customer', 'error');
      }
    });
  }

  uploadInstand(): void {
    this.instandUploading.set(true);
    const formData = new FormData();
    formData.append('file', this.instandFile()!);
    this.trUploadSrv._uploadInstandProjectAttachment(formData).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        this.instandUploading.set(false);
        this.toastSrv.showToast('Institutional & Projects Working uploaded successfully.', 'success');
        this.clearInstand();
      },
      error: (error) => {
        this.instandUploading.set(false);
        this.instandError.set(error?.error?.message || 'Upload failed.');
        this.toastSrv.showToast('Error uploading Institutional data', 'error');
      }
    });
  }

  uploadProjectBusiness(): void {
    this.projectBusinessUploading.set(true);
    const formData = new FormData();
    formData.append('file', this.projectBusinessFile()!);

    this.trUploadSrv._uploadProjectBusiness(formData).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        this.projectBusinessUploading.set(false);
        this.toastSrv.showToast(res.Message || 'Project Business uploaded successfully.', 'success');
        this.clearProjectBusiness();
      },
      error: (error) => {
        this.projectBusinessUploading.set(false);
        this.projectBusinessError.set(error?.error?.message || 'Upload failed.');
        this.toastSrv.showToast('Error uploading Project Business', 'error');
      }
    });
  }

  uploadDebit(): void {
    this.debitUploading.set(true);
    const formData = new FormData();
    formData.append('File', this.debitFile()!);
    formData.append('Month', this.DebitMonth());
    formData.append('Year', this.DebitYear());

    this.trUploadSrv._uploadDebitSheet(formData).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        this.debitUploading.set(false);
        this.toastSrv.showToast(res.message || 'Debit file uploaded successfully.', 'success');
        this.clearDebit();
      },
      error: (error) => {
        this.debitUploading.set(false);
        this.debitError.set(error?.error?.message || 'Upload failed.');
        this.toastSrv.showToast('Error uploading Debit file', 'error');
      }
    });
  }

  uploadUnbooked(): void {
    this.unbookedUploading.set(true);
    const formData = new FormData();
    formData.append('File', this.unbookedFile()!);
    formData.append('Month', this.UnbookedMonth());
    formData.append('Year', this.UnbookedYear());

    this.trUploadSrv._uploadUnbookedCollection(formData).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        this.unbookedUploading.set(false);
        if (res.success) {
          this.toastSrv.showToast(res.message || 'Unbooked Collections uploaded successfully.', 'success');
          this.clearUnbooked();
        } else {
          this.unbookedError.set(res.message || 'Upload failed.');
        }
      },
      error: (error) => {
        this.unbookedUploading.set(false);
        this.unbookedError.set(error?.error?.message || 'Upload failed.');
        this.toastSrv.showToast('Error uploading Unbooked Collections', 'error');
      }
    });
  }

  uploadPdd(): void {
    this.pddUploading.set(true);
    const formData = new FormData();
    formData.append('File', this.pddFile()!);
    formData.append('Month', this.PddMonth());
    formData.append('Year', this.PddYear());

    this.trUploadSrv._uploadPddData(formData).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        this.pddUploading.set(false);
        if (res.success) {
          this.toastSrv.showToast(res.message || 'PDD data uploaded successfully.', 'success');
          this.clearPdd();
        } else {
          this.pddError.set(res.message || 'Upload failed.');
        }
      },
      error: (error) => {
        this.pddUploading.set(false);
        this.pddError.set(error?.error?.message || 'Upload failed.');
        this.toastSrv.showToast('Error uploading PDD Data', 'error');
      }
    });
  }

  uploadPddRemoval(): void {
    this.pddRemovalUploading.set(true); 
    const formData = new FormData();
    formData.append('File', this.pddRemovalFile()!);
    formData.append('Month', this.PddRemovalMonth());
    formData.append('Year', this.PddRemovalYear());

    this.trUploadSrv._uploadPddRemoval(formData).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        this.pddRemovalUploading.set(false); 
        if (res.success) {
          this.toastSrv.showToast(res.message || 'PDD removal data uploaded successfully.', 'success');
          this.clearPddRemoval();
        } else {
          this.pddError.set(res.message || 'Upload failed.');
        }
      },
      error: (error) => {
        this.pddRemovalUploading.set(false); 
        this.pddError.set(error?.error?.message || 'Upload failed.');
        this.toastSrv.showToast('Error uploading PDD Removal Data', 'error');
      }
    });
  }


  uploadMissing(): void {
    this.missingUploading.set(true);
    const formData = new FormData();
    formData.append('File', this.missingFile()!);
    formData.append('Month', this.MissingMonth());
    formData.append('Year', this.MissingYear());

    this.trUploadSrv._uploadCorrectedRegistration(formData).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        this.missingUploading.set(false);
        if (res.success) {
          this.toastSrv.showToast(res.message || 'Corrected data uploaded successfully.', 'success');
          this.clearMissing();
          this.fetchMissingCount(); 
        } else {
          this.missingError.set(res.message || 'Upload failed.');
        }
      },
      error: (error) => {
        this.missingUploading.set(false);
        this.missingError.set(error?.error?.message || 'Upload failed.');
        this.toastSrv.showToast('Error uploading corrected data', 'error');
      }
    });
  }

  // ============ NEW FETCH & DOWNLOAD LOGIC ============
  async downloadDebitSheetFile(): Promise<void> {
    if (!this.DebitMonth() || !this.DebitYear()) {
      this.debitError.set('Please select Month and Year to download.');
      return;
    }
    this.debitDownloading.set(true);
    this.debitError.set('');
    try {
      const blob: Blob = await firstValueFrom(this.trUploadSrv._downloadDebitSheet(this.DebitMonth(), this.DebitYear()).pipe(takeUntil(this.destroy$)));
      this.triggerFileDownload(blob, `Debit_Sheet_${this.DebitMonth()}_${this.DebitYear()}.xlsx`);
      this.toastSrv.showToast('Debit sheet downloaded successfully.', 'success');
    } catch (err: any) {
      this.debitError.set(err?.error?.message || 'Error occurred while downloading the file.');
      this.toastSrv.showToast('Error downloading debit sheet', 'error');
    } finally {
      this.debitDownloading.set(false);
    }
  }

  fetchMissingCount(): void {
    if (!this.MissingMonth() || !this.MissingYear()) {
      this.missingCountError.set('Please select Month and Year.');
      return;
    }
    this.missingFetchingCount.set(true);
    this.missingCountError.set('');
    this.missingCount.set(null);

    this.trUploadSrv._getMissingFinalCategoryCount(this.MissingMonth(), this.MissingYear()).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        this.missingFetchingCount.set(false);
        if (res && typeof res.count === 'number') {
          this.missingCount.set(res.count);
        } else {
          this.missingCountError.set('Invalid response from server.');
        }
      },
      error: (err) => {
        this.missingFetchingCount.set(false);
        this.missingCountError.set(err?.error?.message || 'Failed to fetch missing count.');
        this.toastSrv.showToast('Error fetching count', 'error');
      }
    });
  }

  async downloadMissingData(): Promise<void> {
    if (!this.MissingMonth() || !this.MissingYear()) {
      this.missingCountError.set('Please select Month and Year to download.');
      return;
    }
    this.missingDownloading.set(true);
    this.missingCountError.set('');
    try {
      const blob: Blob = await firstValueFrom(this.trUploadSrv._downloadMissingFinalCategory(this.MissingMonth(), this.MissingYear()).pipe(takeUntil(this.destroy$)));
      this.triggerFileDownload(blob, `Missing_Final_Category_${this.MissingMonth()}_${this.MissingYear()}.xlsx`);
      this.toastSrv.showToast('Missing data downloaded successfully.', 'success');
    } catch (err: any) {
      this.missingCountError.set(err?.error?.message || 'Failed to download missing data.');
      this.toastSrv.showToast('Error downloading file', 'error');
    } finally {
      this.missingDownloading.set(false);
    }
  }

  private triggerFileDownload(blob: Blob, filename: string): void {
    if (!blob || blob.size === 0) {
      this.toastSrv.showToast('File is empty or corrupt', 'warning');
      return;
    }
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  // ============ ALL SHEETS DOWNLOAD ============
  // ============ ALL SHEETS DOWNLOAD ============
  async onDownloadAllSheetsClick(): Promise<void> {
    if (!this.AllSheetsExportMonth() || !this.AllSheetsExportYear()) {
      this.allSheetsExportError.set('Please select Month and Year to download.');
      return;
    }
    
    this.allSheetsDownloading.set(true);
    this.allSheetsExportError.set('');
    
    try {
      const blob: Blob = await firstValueFrom(this.trUploadSrv._downloadAllSheets(this.AllSheetsExportMonth(), this.AllSheetsExportYear()).pipe(takeUntil(this.destroy$)));
      
      this.triggerFileDownload(blob, `All_Sheets_${this.AllSheetsExportMonth()}_${this.AllSheetsExportYear()}.xlsx`);
      
      this.toastSrv.showToast('All sheets downloaded successfully.', 'success');
    } catch (err: any) {
      this.allSheetsExportError.set(err?.error?.message || 'Error occurred while downloading the file.');
      this.toastSrv.showToast('Error downloading all sheets', 'error');
    } finally {
      this.allSheetsDownloading.set(false);
    }
  }

  // ============ FORM VALIDATION ============
  isFBL5NFormValid(): boolean { return !!(this.FBL5NUploadMonth() && this.FBL5NUploadYear()); }
  isAssignmentFormValid(): boolean { return !!(this.AssignmentUploadMonth() && this.AssignmentUploadYear()); }
  isDebitFormValid(): boolean { return !!(this.DebitMonth() && this.DebitYear()); }
  isUnbookedFormValid(): boolean { return !!(this.UnbookedMonth() && this.UnbookedYear()); }
  isPddFormValid(): boolean { return !!(this.PddMonth() && this.PddYear()); }
  isMissingFormValid(): boolean { return !!(this.MissingMonth() && this.MissingYear()); }
  isPddRemovalFormValid(): boolean { return !!(this.PddRemovalMonth() && this.PddRemovalYear()); }
  isAllSheetsUploadFormValid(): boolean { return !!(this.AllSheetsUploadMonth() && this.AllSheetsUploadYear()); }

  // ============ CLEAR FILES ============
  clearFbl5n(): void { this.fbl5nFile.set(null); this.fbl5nError.set(''); if (this.fbl5nInput) this.fbl5nInput.nativeElement.value = ''; }
  clearAssignment(): void { this.assignmentFile.set(null); this.assignmentError.set(''); if (this.assignmentInput) this.assignmentInput.nativeElement.value = ''; }
  clearSales(): void { this.salesFile.set(null); this.salesError.set(''); if (this.salesInput) this.salesInput.nativeElement.value = ''; }
  clearCustomer(): void { this.customerFile.set(null); this.customerError.set(''); if (this.customerInput) this.customerInput.nativeElement.value = ''; }
  clearInstand(): void { this.instandFile.set(null); this.instandError.set(''); if (this.instandInput) this.instandInput.nativeElement.value = ''; }
  clearProjectBusiness(): void { this.projectBusinessFile.set(null); this.projectBusinessError.set(''); if (this.projectBusinessInput) this.projectBusinessInput.nativeElement.value = ''; }
  clearDebit(): void { this.debitFile.set(null); this.debitError.set(''); if (this.debitInput) this.debitInput.nativeElement.value = ''; }
  clearUnbooked(): void { this.unbookedFile.set(null); this.unbookedError.set(''); if (this.unbookedInput) this.unbookedInput.nativeElement.value = ''; }
  clearPdd(): void { this.pddFile.set(null); this.pddError.set(''); if (this.pddInput) this.pddInput.nativeElement.value = ''; }
  clearMissing(): void { this.missingFile.set(null); this.missingError.set(''); if (this.missingInput) this.missingInput.nativeElement.value = ''; }
  clearPddRemoval(): void { this.pddRemovalFile.set(null); this.pddRemovalError.set(''); if (this.pddRemovalInput) this.pddRemovalInput.nativeElement.value = ''; }
  clearAllSheetsUpload(): void { this.allSheetsFile.set(null); this.allSheetsUploadError.set(''); if (this.allSheetsInput) this.allSheetsInput.nativeElement.value = ''; }


  // ============ HELPER FUNCTIONS ============
  hasAnyFileSelected(): boolean {
    return !!(this.fbl5nFile() || this.assignmentFile() || this.salesFile() || this.customerFile() || this.instandFile() || 
              this.projectBusinessFile() || this.debitFile() || this.unbookedFile() || this.pddFile() || this.missingFile() || this.pddRemovalFile()|| this.allSheetsFile());
  }

  isAnyUploading(): boolean {
    return this.fbl5nUploading() || this.assignmentUploading() || this.salesUploading() || this.customerUploading() || this.instandUploading() ||
           this.projectBusinessUploading() || this.debitUploading() || this.unbookedUploading() || this.pddUploading() || this.missingUploading() || this.pddRemovalUploading()|| this.allSheetsUploading();
  }

  getSelectedFilesCount(): number {
    let count = 0;
    if (this.fbl5nFile()) count++;
    if (this.assignmentFile()) count++;
    if (this.salesFile()) count++;
    if (this.customerFile()) count++;
    if (this.instandFile()) count++;
    if (this.projectBusinessFile()) count++;
    if (this.debitFile()) count++;
    if (this.unbookedFile()) count++;
    if (this.pddFile()) count++;
    if (this.missingFile()) count++;
    if (this.pddRemovalFile()) count++;
    if (this.allSheetsFile()) count++;
    return count;
  }

  getSelectedFilesList(): string {
    const files: string[] = [];
    if (this.fbl5nFile()) files.push('FBL5N');
    if (this.assignmentFile()) files.push('Assignment');
    if (this.salesFile()) files.push('Sale Register');
    if (this.customerFile()) files.push('Customer Master');
    if (this.instandFile()) files.push('Institutional');
    if (this.projectBusinessFile()) files.push('Project Business');
    if (this.debitFile()) files.push('Debit Sheet');
    if (this.unbookedFile()) files.push('Unbooked Collections');
    if (this.pddFile()) files.push('PDD Data');
    if (this.missingFile()) files.push('Missing Category');
    if (this.pddRemovalFile()) files.push('PDD Removal');
    if (this.allSheetsFile()) files.push('All Sheets');
    return files.join(', ');
  }

  getFileSize(file: File | null): string {
    if (!file) return '';
    return (file.size / 1024 / 1024).toFixed(2);
  }

  // ============ DOWNLOAD SAP FILES MODAL ============
  openDownloadModal(): void {
    this.selectedAsOfDate.set(''); this.selectedMonth.set(''); this.selectedYear.set(''); this.downloadError.set('');
    if (this.downloadModal) { const modal = new bootstrap.Modal(this.downloadModal.nativeElement); modal.show(); }
  }

  closeDownloadModal(): void {
    if (this.downloadModal) {
      const modalElement = this.downloadModal.nativeElement;
      const activeElement = document.activeElement as HTMLElement;
      if (modalElement.contains(activeElement)) activeElement.blur();
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) modal.hide();
    }
  }

  onDateChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedAsOfDate.set(input.value);
    this.downloadError.set(''); 
  }

  async downloadReceivableSheet(): Promise<void> {
    if (!this.selectedAsOfDate() || !this.selectedMonth() || !this.selectedYear()) { this.downloadError.set('Please select Date, Month and Year.'); return; }
    this.isDownloading.set(true);
    this.downloadError.set('');
    try {
      const [year, month, day] = this.selectedAsOfDate().split('-');
      const formattedDate = `${day}-${month}-${year}`;
      const blob: Blob = await firstValueFrom(this.trUploadSrv._downloadReceivableSheet({ asOf: formattedDate, month: this.selectedMonth(), year: this.selectedYear() }).pipe(takeUntil(this.destroy$)));
      
      const now = new Date();
      const dateStr = now.toLocaleDateString('en-GB').replace(/\//g, '-');
      const timeStr = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' }).replace(/:/g, '-');
      
      this.triggerFileDownload(blob, `Trade_Receivable_Sheet_${dateStr}_${timeStr}.xlsx`);
      this.toastSrv.showToast('Receivable sheet downloaded successfully.', 'success');
      this.closeDownloadModal();
    } catch (err: any) {
      this.downloadError.set(err?.error?.message || 'Error occurred while downloading file.');
      this.toastSrv.showToast('Error downloading receivable sheet', 'error');
    } finally {
      this.isDownloading.set(false);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}