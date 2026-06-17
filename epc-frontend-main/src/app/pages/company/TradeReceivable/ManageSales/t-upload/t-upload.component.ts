import {
  Component,
  ViewChild,
  ElementRef,
  signal,
  inject,
  OnDestroy,
  WritableSignal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ToastService } from '../../../../../shared/services/componentServices/toast.service';
import { BreadcrumbsComponent } from '../../../../common/breadcrumbs/breadcrumbs.component';
import { TrManageSalesService } from '../../../../../shared/services/tradeReceivable/tr-manage-sales.service';
import {
  ProjectMarketStateWise,
  Summary,
} from '../../../../../shared/models/tradeReceivable-models/trManageSales';

@Component({
  selector: 'app-t-upload',
  standalone: true,
  imports: [CommonModule, FormsModule, BreadcrumbsComponent],
  templateUrl: './t-upload.component.html',
  styleUrl: './t-upload.component.scss',
})
export class TUploadComponent implements OnDestroy {
  breadCrumbItems = signal([{ label: 'Upload Center' }]);

  @ViewChild('projectsRRInput') projectsRRInput!: ElementRef<HTMLInputElement>;
  @ViewChild('groupingSaleInput') groupingSaleInput!: ElementRef<HTMLInputElement>;
  @ViewChild('salesFTMInput') salesFTMInput!: ElementRef<HTMLInputElement>;
  @ViewChild('salesFTMFinalInput') salesFTMFinalInput!: ElementRef<HTMLInputElement>;
  @ViewChild('projectInput') projectInput!: ElementRef<HTMLInputElement>;
  @ViewChild('creditNoteInput') creditNoteInput!: ElementRef<HTMLInputElement>;
  @ViewChild('missingDataInput') missingDataInput!: ElementRef<HTMLInputElement>;

  // Months and Years dropdowns
  months: string[] = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  years: number[] = this.generateYears();

  missingDataExporting = signal<boolean>(false);

  salesFTMExporting = signal<boolean>(false);

  // Selected files
  projectsRRFile = signal<File | null>(null);
  groupingSaleFile = signal<File | null>(null);
  salesFTMFile = signal<File | null>(null);
  salesFTMFinalFile = signal<File | null>(null);
  projectFile = signal<File | null>(null);
  CreditNoteFile = signal<File | null>(null);
  missingDataFile = signal<File | null>(null);

  // Error messages
  projectsRRError = signal<string>('');
  groupingSaleError = signal<string>('');
  salesFTMError = signal<string>('');
  salesFTMFinalError = signal<string>('');
  projectError = signal<string>('');
  creditNoteError = signal<string>('');
  missingDataError = signal<string>('');


  // Upload states
  projectsRRUploading = signal<boolean>(false);
  groupingSaleUploading = signal<boolean>(false);
  salesFTMUploading = signal<boolean>(false);
  salesFTMFinalUploading = signal<boolean>(false);
  projectsUploading = signal<boolean>(false);
  CreditNoteUploading = signal<boolean>(false);
  missingDataUploading = signal<boolean>(false);

  // Form fields for ProjectsRR
  projectsRRMonth = signal<string>('');
  projectsRRYear = signal<string>('');

  // Form fields for Grouping Sale
  groupingSaleMonth = signal<string>('');
  groupingSaleYear = signal<string>('');

  // Form fields for SalesFTM
  salesFTMMonth = signal<string>('');
  salesFTMYear = signal<string>('');
  salesFTMPortalStatusDate = signal<string>('');

  // Form fields for Missing Data
  missingDataMonth = signal<string>('');
  missingDataYear = signal<string>('');
  missingDataPortalStatusDate = signal<string>('');

  showMissingReportModal = signal<boolean>(false);
  missingReportData = signal<any>(null);
  missingSummaryData = signal<Summary[]>([]);
  missingStateWiseData = signal<ProjectMarketStateWise[]>([]);

  showProjectMarketDetails = signal<boolean>(false);

  showKarnatakaDetails = signal<boolean>(false);

  // Form fields for salesFTMFinal
  salesFTMFinalMonth = signal<string>('');
  salesFTMFinalYear = signal<string>('');

  // Form fields for projects
  projectMonth = signal<string>('');
  projectYear = signal<string>('');

  // Form fields for Credit Note
  creditNoteMonth = signal<string>('');
  creditNoteYear = signal<string>('');

  maxDate: string = new Date().toISOString().split('T')[0];

  trUploadSrv = inject(TrManageSalesService);
  toastSrv = inject(ToastService);

  private destroy$ = new Subject<void>();

  // ============ Month Year Validation ============

  generateYears(): number[] {
    const currentYear = new Date().getFullYear();
    const years: number[] = [];
    for (let year = 2020; year <= currentYear; year++) {
      years.push(year);
    }
    return years;
  }

  // Add: filters months to current month if selected year = current year
  getAvailableMonths(selectedYear: string | number): string[] {
    const currentYear = new Date().getFullYear();
    const currentMonthIndex = new Date().getMonth(); // 0-based
    if (Number(selectedYear) === currentYear) {
      return this.months.slice(0, currentMonthIndex + 1);
    }
    return this.months;
  }

  // Add: returns last day of next month based on selected month+year
  getPortalStatusMaxDate(month: string, year: string): string {
    if (!month || !year) return this.maxDate;
    const monthIndex = this.months.indexOf(month); // 0-based
    if (monthIndex === -1) return this.maxDate;

    let targetYear = Number(year);
    let targetMonth: number;

    if (monthIndex === 11) { // December → next month is January next year
      targetMonth = 0;
      targetYear += 1;
    } else {
      targetMonth = monthIndex + 1;
    }

    // new Date(year, month+1, 0) = last day of targetMonth
    const lastDay = new Date(targetYear, targetMonth + 1, 0);
    return lastDay.toISOString().split('T')[0];
  }

  // Add: clears month if it's no longer valid after year changes to current year
  private clearMonthIfInvalid(monthSignal: WritableSignal<string>, yearVal: string): void {
    const currentYear = new Date().getFullYear();
    const currentMonthIndex = new Date().getMonth();
    if (Number(yearVal) === currentYear) {
      if (this.months.indexOf(monthSignal()) > currentMonthIndex) {
        monthSignal.set('');
      }
    }
  }

  onProjectsRRYearChange(year: string): void { this.clearMonthIfInvalid(this.projectsRRMonth, year); }
  onGroupingSaleYearChange(year: string): void { this.clearMonthIfInvalid(this.groupingSaleMonth, year); }
  onSalesFTMYearChange(year: string): void { this.clearMonthIfInvalid(this.salesFTMMonth, year); }
  onSalesFTMFinalYearChange(year: string): void { this.clearMonthIfInvalid(this.salesFTMFinalMonth, year); }
  onProjectYearChange(year: string): void { this.clearMonthIfInvalid(this.projectMonth, year); }
  onCreditNoteYearChange(year: string): void { this.clearMonthIfInvalid(this.creditNoteMonth, year); }
  onMissingDataYearChange(year: string): void { this.clearMonthIfInvalid(this.missingDataMonth, year); }

  // ============ FILE SELECTION HANDLERS ============

  onProjectsRRSelect(event: Event): void {
    this.handleFileSelect(event, this.projectsRRFile, this.projectsRRError);
  }

  onGroupingSaleSelect(event: Event): void {
    this.handleFileSelect(event, this.groupingSaleFile, this.groupingSaleError);
  }

  onSalesFTMSelect(event: Event): void {
    this.handleFileSelect(event, this.salesFTMFile, this.salesFTMError);
  }

  onSalesFTMFinalSelect(event: Event): void {
    this.handleFileSelect(event, this.salesFTMFinalFile, this.salesFTMFinalError,);
  }

  onProjectSelect(event: Event): void {
    this.handleFileSelect(event, this.projectFile, this.projectError);
  }

  onCreditNoteSelect(event: Event): void {
    this.handleFileSelect(event, this.CreditNoteFile, this.creditNoteError);
  }

  onMissingDataSelect(event: Event): void {
    this.handleFileSelect(event, this.missingDataFile, this.missingDataError);
  }
  // Generic file selection handler
  private handleFileSelect(
    event: Event,
    fileSignal: any,
    errorSignal: any,
  ): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      fileSignal.set(null);
      errorSignal.set('');
      return;
    }

    // Validate file
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

  // ============ FILE VALIDATION ============

  validateFile(file: File): { isValid: boolean; message: string } {
    const maxSize = 50 * 1024 * 1024; // 50MB
    const allowedExtensions = ['.xls', '.xlsx', '.xlsb'];

    // Check file extension
    const fileName = file.name.toLowerCase();
    const hasValidExtension = allowedExtensions.some((ext) =>
      fileName.endsWith(ext),
    );

    if (!hasValidExtension) {
      return {
        isValid: false,
        message: 'Only Excel files (.xls, .xlsx, .xlsb) are allowed.',
      };
    }

    // Check file size
    if (file.size > maxSize) {
      return {
        isValid: false,
        message: 'File size must not exceed 50MB.',
      };
    }

    return { isValid: true, message: '' };
  }

  // ============ UPLOAD ALL SELECTED FILES ============

  uploadAllSelectedFiles(): void {
    // Upload each selected file independently
    if (
      this.projectsRRFile() &&
      !this.projectsRRUploading() &&
      this.isProjectsRRFormValid()
    ) {
      this.uploadProjectsRR();
    }
    if (
      this.groupingSaleFile() &&
      !this.groupingSaleUploading() &&
      this.isGroupingSaleFormValid()
    ) {
      this.uploadGroupingSale();
    }
    if (
      this.salesFTMFile() &&
      !this.salesFTMUploading() &&
      this.isSalesFTMFormValid()
    ) {
      this.uploadSalesFTM();
    }
    if (
      this.salesFTMFinalFile() &&
      !this.salesFTMFinalUploading() &&
      this.isSalesFTMFinalFormValid()
    ) {
      this.uploadSalesFTMFinal();
    }
    if (
      this.projectFile() &&
      !this.projectsUploading() &&
      this.isProjectFormValid()
    ) {
      this.uploadProject();
    }
    if (
      this.CreditNoteFile() &&
      !this.CreditNoteUploading() &&
      this.isCreditNoteFormValid()
    ) {
      this.uploadCreditNote();
    }
    if (
      this.missingDataFile() &&
      !this.missingDataUploading() &&
      this.isMissingDataFormValid()
    ) {
      this.uploadMissingData();
    }
  }

  // ============ INDIVIDUAL UPLOAD HANDLERS ============

  // Upload ProjectsRR
  uploadProjectsRR(): void {
    if (!this.projectsRRFile()) {
      this.projectsRRError.set('Please select a file first.');
      return;
    }

    if (!this.isProjectsRRFormValid()) {
      this.projectsRRError.set('Please select both Month and Year.');
      return;
    }

    this.projectsRRUploading.set(true);
    this.projectsRRError.set('');

    const formData = new FormData();
    formData.append('ExcelFile', this.projectsRRFile()!);
    formData.append('Month', this.projectsRRMonth());
    formData.append('Year', this.projectsRRYear());

    this.trUploadSrv
      ._uploadProjectsRRAttachment(formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          console.log('ProjectsRR upload successful', res);
          this.projectsRRUploading.set(false);
          this.toastSrv.showToast(
            res.message || 'ProjectsRR file uploaded successfully.',
            'success',
          );
          this.clearProjectsRR();
        },
        error: (error) => {
          console.error('ProjectsRR upload failed', error);
          this.projectsRRUploading.set(false);
          this.projectsRRError.set(
            error?.error?.message || 'Upload failed. Please try again.',
          );
          this.toastSrv.showToast('Error uploading ProjectsRR file', 'error');
        },
      });
  }

  // Upload Grouping Sale
  uploadGroupingSale(): void {
    if (!this.groupingSaleFile()) {
      this.groupingSaleError.set('Please select a file first.');
      return;
    }

    if (!this.isGroupingSaleFormValid()) {
      this.groupingSaleError.set('Please select both Month and Year.');
      return;
    }

    this.groupingSaleUploading.set(true);
    this.groupingSaleError.set('');

    const formData = new FormData();
    formData.append('ExcelFile', this.groupingSaleFile()!);
    formData.append('Month', this.groupingSaleMonth());
    formData.append('Year', this.groupingSaleYear());

    this.trUploadSrv
      ._uploadGroupingSaleAttachment(formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          console.log('Grouping Sale upload successful', res);
          this.groupingSaleUploading.set(false);
          this.toastSrv.showToast(
            res.message || 'Grouping Sale file uploaded successfully.',
            'success',
          );
          this.clearGroupingSale();
        },
        error: (error) => {
          console.error('Grouping Sale upload failed', error);
          this.groupingSaleUploading.set(false);
          this.groupingSaleError.set(
            error?.error?.message || 'Upload failed. Please try again.',
          );
          this.toastSrv.showToast(
            'Error uploading Grouping Sale file',
            'error',
          );
        },
      });
  }

  uploadSalesFTM(): void {
    if (!this.salesFTMFile()) {
      this.salesFTMError.set('Please select a file first.');
      return;
    }

    if (!this.isSalesFTMFormValid()) {
      this.salesFTMError.set('Please select Month, Year, and Portal Status Date.');
      return;
    }

    // Format date to DD-MM-YYYY
    const [year, month, day] = this.salesFTMPortalStatusDate().split('-');
    const formattedDate = `${day}-${month}-${year}`;

    // ✅ payload ni mundhe store cheyyi (clearSalesFTM() tarvatha values pothayi kabatti)
    const payload = {
      Month: this.salesFTMMonth(),
      Year: this.salesFTMYear(),
      PortalStatusDate: formattedDate
    };

    this.salesFTMUploading.set(true);
    this.salesFTMError.set('');

    const formData = new FormData();
    formData.append('ExcelFile', this.salesFTMFile()!);
    formData.append('Month', payload.Month);
    formData.append('Year', payload.Year);
    formData.append('PortalStatusDate', payload.PortalStatusDate);

    this.trUploadSrv._uploadSalesFTMAttachment(formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (blob: Blob) => {
          console.log("Sale FTM Excel response received");

          if (!blob || blob.size === 0) {
            this.toastSrv.showToast('File is empty or corrupt', 'error');
            this.salesFTMUploading.set(false);
            return;
          }

          // ✅ Download trigger
          const now = new Date();
          const date = now.toLocaleDateString('en-GB').replace(/\//g, '-');
          const time = now.toLocaleTimeString('en-GB', {
            hour: '2-digit', minute: '2-digit', second: '2-digit'
          }).replace(/:/g, '-');

          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `Sales_FTM_${payload.Month}_${payload.Year}_${date}_${time}.xlsx`;

          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);

          // ✅ Download ayyaka (trigger ayyaka) missing report call cheyyi
          this.trUploadSrv._getMissingDataReport(payload)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (res) => {
                this.missingReportData.set(res.data);
                this.missingSummaryData.set(res.data.Summary);
                this.missingStateWiseData.set(res.data.ProjectMarketStateWise);
                this.showMissingReportModal.set(true);

                this.toastSrv.showToast('Sale FTM downloaded successfully.', 'success');
                this.salesFTMUploading.set(false);
                this.clearSalesFTM();
              },
              error: () => {
                this.toastSrv.showToast('Failed to load missing data report', 'error');
                this.toastSrv.showToast('Sale FTM downloaded successfully.', 'success');
                this.salesFTMUploading.set(false);
                this.clearSalesFTM();
              }
            });
        },

        error: (error) => {
          console.error('Sales FTM upload failed', error);
          this.salesFTMUploading.set(false);
          this.salesFTMError.set(error?.error?.message || 'Upload failed. Please try again.');
          this.toastSrv.showToast('Error uploading Sales FTM file', 'error');
        }
      });
  }
  //--
  uploadMissingData(): void {
    if (!this.missingDataFile()) {
      this.missingDataError.set('Please select a file first.');
      return;
    }

    if (!this.isMissingDataFormValid()) {
      this.missingDataError.set('Please select Month, Year, and Portal Status Date.');
      return;
    }

    // Format date to DD-MM-YYYY
    const [year, month, day] = this.missingDataPortalStatusDate().split('-');
    const formattedDate = `${day}-${month}-${year}`;

    // ✅ payload ni mundhe store cheyyi (clearSalesFTM() tarvatha values pothayi kabatti)
    const payload = {
      Month: this.missingDataMonth(),
      Year: this.missingDataYear(),
      PortalStatusDate: formattedDate
    };

    this.missingDataUploading.set(true);
    this.missingDataError.set('');

    const formData = new FormData();
    formData.append('ExcelFile', this.missingDataFile()!);
    formData.append('Month', payload.Month);
    formData.append('Year', payload.Year);
    formData.append('PortalStatusDate', payload.PortalStatusDate);

    this.trUploadSrv._uploadMissingDataAttachment(formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (blob: Blob) => {
          console.log("Missing Data Excel response received");

          if (!blob || blob.size === 0) {
            this.toastSrv.showToast('File is empty or corrupt', 'error');
            this.missingDataUploading.set(false);
            return;
          }
          this.toastSrv.showToast('Missing Data downloaded successfully.', 'success');
          this.missingDataUploading.set(false);
          this.clearMissingData();

        },

        error: (error) => {
          console.error('Missing Data upload failed', error);
          this.missingDataUploading.set(false);
          this.missingDataError.set(error?.error?.message || 'Upload failed. Please try again.');
          this.toastSrv.showToast('Error uploading Missing Data file', 'error');
        }
      });
  }
  //-- 

  viewMissingReport(): void {
    if (!this.isMissingDataFormValid()) {
      this.missingDataError.set('Please select Month, Year, and Portal Status Date.');
      return;
    }

    this.missingDataError.set('');

    // YYYY-MM-DD -> DD-MM-YYYY
    const [yy, mm, dd] = this.missingDataPortalStatusDate().split('-');
    const formattedDate = `${dd}-${mm}-${yy}`;

    const payload = {
      Month: this.missingDataMonth(),
      Year: this.missingDataYear(),
      PortalStatusDate: formattedDate,
    };

    this.trUploadSrv
      ._getMissingDataReport(payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          // ✅ Sometimes response = { data: {...} } / sometimes direct {...}
          const data = res?.data ?? res ?? {};

          // ✅ null-safe sets (avoid crash)
          this.missingReportData.set(data);
          this.missingSummaryData.set(data?.Summary ?? []);
          this.missingStateWiseData.set(data?.ProjectMarketStateWise ?? []);

          // optional: reset expands
          this.showProjectMarketDetails.set(false);
          this.showKarnatakaDetails.set(false);

          // ✅ finally open modal
          this.showMissingReportModal.set(true);

          // optional: empty data info
          if (!(data?.Summary?.length)) {
            this.toastSrv.showToast('No missing data found for selected inputs', 'info');
          }
        },
        error: (err) => {
          console.error('Missing report error:', err);
          this.toastSrv.showToast(
            err?.error?.message || 'Failed to load missing data report',
            'error',
          );
        },
      });
  }
  //--

  exportMissingData(): void {
    if (!this.isMissingDataFormValid()) {
      this.missingDataError.set('Please select Month, Year, and Portal Status Date.');
      return;
    }

    this.missingDataError.set('');

    // YYYY-MM-DD -> DD-MM-YYYY
    const [yy, mm, dd] = this.missingDataPortalStatusDate().split('-');
    const formattedDate = `${dd}-${mm}-${yy}`;

    const payload = {
      Month: this.missingDataMonth(),
      Year: this.missingDataYear(),
      PortalStatusDate: formattedDate,
    };

    this.missingDataExporting.set(true);

    this.trUploadSrv._exportMissingPortalStatus(payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (blob: Blob) => {
          if (!blob || blob.size === 0) {
            this.toastSrv.showToast('File is empty or corrupt', 'error');
            this.missingDataExporting.set(false);
            return;
          }

          const now = new Date();
          const date = now.toLocaleDateString('en-GB').replace(/\//g, '-');
          const time = now.toLocaleTimeString('en-GB', {
            hour: '2-digit', minute: '2-digit', second: '2-digit'
          }).replace(/:/g, '-');

          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `Missing_Portal_Status_${payload.Month}_${payload.Year}_${date}_${time}.xlsx`;

          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);

          this.toastSrv.showToast('Missing Data exported successfully.', 'success');
          this.missingDataExporting.set(false);
        },
        error: (err) => {
          console.error('Export missing portal status error:', err);
          this.toastSrv.showToast(err?.error?.message || 'Export failed', 'error');
          this.missingDataExporting.set(false);
        }
      });
  }



  //--

  toggleProjectMarketDetails() {
    this.showProjectMarketDetails.update((v) => {
      const next = !v;
      if (!next) this.showKarnatakaDetails.set(false); // close state-wise => close karnataka also
      return next;
    });
  }

  toggleKarnatakaDetails() {
    this.showKarnatakaDetails.update((v) => !v);
  }

  // sales-FTM-Final File
  uploadSalesFTMFinal(): void {
    if (!this.salesFTMFinalFile()) {
      this.salesFTMFinalError.set('Please select a file first.');
      return;
    }

    if (!this.isSalesFTMFinalFormValid()) {
      this.salesFTMFinalError.set('Please select both Month and Year.');
      return;
    }

    this.salesFTMFinalUploading.set(true);
    this.salesFTMFinalError.set('');

    const formData = new FormData();
    formData.append('ExcelFile', this.salesFTMFinalFile()!);
    formData.append('Month', this.salesFTMFinalMonth());
    formData.append('Year', this.salesFTMFinalYear());

    this.trUploadSrv
      ._uploadSalesFTMFinalAttachment(formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          console.log(' Sales FTM Final uploadsuccessful', res);
          this.salesFTMFinalUploading.set(false);
          this.toastSrv.showToast(
            res.message || 'Sales FTM Final file uploaded successfully.',
            'success',
          );
          this.clearSalesFTMFinal();
        },
        error: (error) => {
          console.error('Sales FTM Final upload failed', error);
          this.salesFTMFinalUploading.set(false);
          this.salesFTMFinalError.set(
            error?.error?.message || 'Upload failed. Please try again.',
          );
          this.toastSrv.showToast(
            'Error uploading Sales FTM Final file',
            'error',
          );
        },
      });
  }

  // Upload Project
  uploadProject(): void {
    if (!this.projectFile()) {
      this.projectError.set('Please select a file first.');
      return;
    }

    if (!this.isProjectFormValid()) {
      this.projectError.set('Please select Month and Year.');
      return;
    }

    this.projectsUploading.set(true);
    this.projectError.set('');

    const formData = new FormData();
    formData.append('ExcelFile', this.projectFile()!);
    formData.append('Month', this.projectMonth());
    formData.append('Year', this.projectYear());

    this.trUploadSrv
      ._uploadProjectsAttachment(formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          console.log('Project upload successful', res);
          this.projectsUploading.set(false);
          this.toastSrv.showToast(
            res.message || 'Project file uploaded successfully.',
            'success',
          );
          this.clearProject();
        },
        error: (error) => {
          console.error('Project upload failed', error);
          this.projectsUploading.set(false);
          this.projectError.set(
            error?.error?.message || 'Upload failed. Please try again.',
          );
          // this.salesFTMUploading.set(false);
          // this.salesFTMError.set(error?.error?.message || 'Upload failed. Please try again.');
          this.toastSrv.showToast('Error uploading Project file', 'error');
        },
      });
  }


  // Upload Credit Note
  uploadCreditNote(): void {
    if (!this.CreditNoteFile()) {
      this.creditNoteError.set('Please select a file first.');
      return;
    }

    if (!this.isCreditNoteFormValid()) {
      this.creditNoteError.set('Please select Month and Year.');
      return;
    }

    this.CreditNoteUploading.set(true);
    this.creditNoteError.set('');

    const formData = new FormData();
    formData.append('ExcelFile', this.CreditNoteFile()!);
    formData.append('Month', this.creditNoteMonth());
    formData.append('Year', this.creditNoteYear());

    this.trUploadSrv
      ._uploadCreditNoteAttachment(formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          console.log('Credit Note upload successful', res);
          this.CreditNoteUploading.set(false);
          this.toastSrv.showToast(
            res.message || 'Credit Note file uploaded successfully.',
            'success',
          );
          this.clearCreditNote();
        },
        error: (error) => {
          console.error('Credit Note upload failed', error);
          this.CreditNoteUploading.set(false);
          this.creditNoteError.set(
            error?.error?.message || 'Upload failed. Please try again.',
          );
          // this.salesFTMUploading.set(false);
          // this.salesFTMError.set(error?.error?.message || 'Upload failed. Please try again.');
          this.toastSrv.showToast('Error uploading Credit Note file', 'error');
        },
      });
  }
  //--

  exportSalesFTM(): void {
    // ✅ Month/Year validate
    if (!this.salesFTMMonth() || !this.salesFTMYear()) {
      this.salesFTMError.set('Please select Month and Year to export.');
      return;
    }

    this.salesFTMError.set('');

    const payload = {
      Month: this.salesFTMMonth(),
      Year: String(this.salesFTMYear())
    };

    this.salesFTMExporting.set(true);

    this.trUploadSrv._exportSalesFTM(payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (blob: Blob) => {
          if (!blob || blob.size === 0) {
            this.toastSrv.showToast('Export file is empty or corrupt', 'error');
            this.salesFTMExporting.set(false);
            return;
          }

          // ✅ Download
          const now = new Date();
          const date = now.toLocaleDateString('en-GB').replace(/\//g, '-');
          const time = now.toLocaleTimeString('en-GB', {
            hour: '2-digit', minute: '2-digit', second: '2-digit'
          }).replace(/:/g, '-');

          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `Sales_FTM_Export_${payload.Month}_${payload.Year}_${date}_${time}.xlsx`;

          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);

          this.toastSrv.showToast('Sales FTM exported successfully.', 'success');
          this.salesFTMExporting.set(false);
        },
        error: (err) => {
          console.error('Sales FTM export failed', err);
          this.toastSrv.showToast(err?.error?.message || 'Export failed', 'error');
          this.salesFTMExporting.set(false);
        }
      });
  }
  // ============ FORM VALIDATION ============

  isProjectsRRFormValid(): boolean {
    return !!(this.projectsRRMonth() && this.projectsRRYear());
  }

  isGroupingSaleFormValid(): boolean {
    return !!(this.groupingSaleMonth() && this.groupingSaleYear());
  }

  isSalesFTMFormValid(): boolean {
    return !!(this.salesFTMMonth() && this.salesFTMYear() && this.salesFTMPortalStatusDate());
  }

  isSalesFTMFinalFormValid(): boolean {
    return !!(this.salesFTMFinalMonth() && this.salesFTMFinalYear());
  }

  isProjectFormValid(): boolean {
    return !!(this.projectMonth() && this.projectYear());
  }

  isCreditNoteFormValid(): boolean {
    return !!(this.creditNoteMonth() && this.creditNoteYear());
  }

  isMissingDataFormValid(): boolean {
    return !!(this.missingDataMonth() && this.missingDataYear() && this.missingDataPortalStatusDate());
  }

  // ============ CLEAR INDIVIDUAL FILES ============

  clearProjectsRR(): void {
    this.projectsRRFile.set(null);
    this.projectsRRError.set('');
    this.projectsRRMonth.set('');
    this.projectsRRYear.set('');
    if (this.projectsRRInput) this.projectsRRInput.nativeElement.value = '';
  }

  clearGroupingSale(): void {
    this.groupingSaleFile.set(null);
    this.groupingSaleError.set('');
    this.groupingSaleMonth.set('');
    this.groupingSaleYear.set('');
    if (this.groupingSaleInput) this.groupingSaleInput.nativeElement.value = '';
  }

  clearSalesFTM(): void {
    this.salesFTMFile.set(null);
    this.salesFTMError.set('');
    this.salesFTMMonth.set('');
    this.salesFTMYear.set('');
    this.salesFTMPortalStatusDate.set('');
    if (this.salesFTMInput) this.salesFTMInput.nativeElement.value = '';
  }

  clearSalesFTMFinal(): void {
    this.salesFTMFinalFile.set(null);
    this.salesFTMFinalError.set('');
    this.salesFTMFinalMonth.set('');
    this.salesFTMFinalYear.set('');
    if (this.salesFTMFinalInput)
      this.salesFTMFinalInput.nativeElement.value = '';
  }

  clearProject(): void {
    this.projectFile.set(null);
    this.projectError.set('');
    this.projectMonth.set('');
    this.projectYear.set('');
    if (this.projectInput) this.projectInput.nativeElement.value = '';
  }

  clearCreditNote(): void {
    this.CreditNoteFile.set(null);
    this.creditNoteError.set('');
    this.creditNoteMonth.set('');
    this.creditNoteYear.set('');
    if (this.creditNoteInput) this.creditNoteInput.nativeElement.value = '';
  }

  clearMissingData(): void {
    this.missingDataFile.set(null);
    this.missingDataError.set('');
    this.missingDataMonth.set('');
    this.missingDataYear.set('');
    this.missingDataPortalStatusDate.set('');
    if (this.missingDataInput) this.missingDataInput.nativeElement.value = '';
  }

  // ============ HELPER FUNCTIONS ============

  // Check if any file is selected
  hasAnyFileSelected(): boolean {
    return !!(
      this.projectsRRFile() ||
      this.groupingSaleFile() ||
      this.salesFTMFile() ||
      this.salesFTMFinalFile() ||
      this.projectFile() ||
      this.CreditNoteFile() ||
      this.missingDataFile()
    );
  }

  // Check if any upload is in progress
  isAnyUploading(): boolean {
    return (
      this.projectsRRUploading() ||
      this.groupingSaleUploading() ||
      this.salesFTMUploading() ||
      this.salesFTMFinalUploading() ||
      this.projectsUploading() ||
      this.CreditNoteUploading() ||
      this.missingDataUploading()
    );
  }

  // Get count of selected files
  getSelectedFilesCount(): number {
    let count = 0;
    if (this.projectsRRFile()) count++;
    if (this.groupingSaleFile()) count++;
    if (this.salesFTMFile()) count++;
    if (this.salesFTMFinalFile()) count++;
    if (this.projectFile()) count++;
    if (this.CreditNoteFile()) count++;
    return count;
  }

  // Get list of selected file names
  getSelectedFilesList(): string {
    const files: string[] = [];
    if (this.projectsRRFile()) files.push('ProjectsRR');
    if (this.groupingSaleFile()) files.push('Grouping Sale');
    if (this.salesFTMFile()) files.push('SalesFTM');
    if (this.salesFTMFinalFile()) files.push('SalesFTMFinal');
    if (this.projectFile()) files.push('Project');
    if (this.CreditNoteFile()) files.push('Credit Note');
    return files.join(', ');
  }

  // Get file size in MB
  getFileSize(file: File | null): string {
    if (!file) return '';
    return (file.size / 1024 / 1024).toFixed(2);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
