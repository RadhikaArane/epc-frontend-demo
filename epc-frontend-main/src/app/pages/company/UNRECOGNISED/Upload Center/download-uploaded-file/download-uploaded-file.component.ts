import { Component, inject, signal, computed, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { BreadcrumbsComponent } from '../../../../common/breadcrumbs/breadcrumbs.component';
import { UrUploadCenterService } from '../../../../../shared/services/unrecognisedInvoice/ur-upload-center.service';
import { ToastService } from '../../../../../shared/services/componentServices/toast.service';
import { AuthService } from '../../../../../shared/services/common/auth.service';

@Component({
  selector: 'app-download-uploaded-file',
  standalone: true,
  imports: [CommonModule, FormsModule, BreadcrumbsComponent],
  templateUrl: './download-uploaded-file.component.html',
  styleUrl: './download-uploaded-file.component.scss',
})
export class DownloadUploadedFileComponent implements OnInit, OnDestroy {
  private urUploadSrv = inject(UrUploadCenterService);
  private authSrv = inject(AuthService);
  private toastSrv = inject(ToastService);
  private destroy$ = new Subject<void>();

  breadCrumbItems = signal([
    { label: 'Upload Center' },
    { label: 'Upload Files' },
  ]);

  private getCurrentMonthYear(): string {
    const now = new Date();
    return `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`;
  }

  // ---- SalesFTM ----
  salesDates = signal<string[]>([]);
  selectedSalesMonth = signal<string>(this.getCurrentMonthYear()); 
  selectedSalesDate = signal<string>('');
  isLoadingSalesDates = signal<boolean>(false);
  isDownloadingSales = signal<boolean>(false);

  filteredSalesDates = computed(() => {
    return this.filterByMonthYear(this.salesDates(), this.selectedSalesMonth());
  });

  // ---- Consignment ----
  consDates = signal<string[]>([]);
  selectedConsMonth = signal<string>(this.getCurrentMonthYear()); 
  selectedConsDate = signal<string>('');
  isLoadingConsDates = signal<boolean>(false);
  isDownloadingCons = signal<boolean>(false);

  filteredConsDates = computed(() => {
    return this.filterByMonthYear(this.consDates(), this.selectedConsMonth());
  });

  // ---- Latest Not Considered ----
  notConsideredDates = signal<string[]>([]);
  isLoadingNotConsideredDates = signal<boolean>(false);
  selectedNotConsideredDate = signal<string>('');
  isDownloadingNotConsidered = signal<boolean>(false);

  ngOnInit(): void {
    this.loadSalesDates();
    this.loadConsignmentDates();
  }

  onSalesMonthChange(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.selectedSalesMonth.set(val);

    const filtered = this.filteredSalesDates();
    this.selectedSalesDate.set(filtered.length > 0 ? filtered[0] : '');
  }

  onConsMonthChange(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.selectedConsMonth.set(val);

    const filtered = this.filteredConsDates();
    this.selectedConsDate.set(filtered.length > 0 ? filtered[0] : '');
  }

  private filterByMonthYear(dates: string[], monthVal: string): string[] {
    if (!monthVal) return dates; 
    
    const [year, month] = monthVal.split('-'); 

    return dates.filter((d) => {
      const dt = new Date(d);
      if (!isNaN(dt.getTime())) {
        const dYear = dt.getFullYear().toString();
        const dMonth = (dt.getMonth() + 1).toString().padStart(2, '0');
        return dYear === year && dMonth === month;
      }
      
      return d.includes(monthVal); 
    });
  }

  // SalesFTM
  loadSalesDates() {
    this.isLoadingSalesDates.set(true);

    this.urUploadSrv
      .getUploadDates('SalesFTM')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          const list = this.normalizeDateList(res);
          this.salesDates.set(list);
          const filtered = this.filteredSalesDates();
          this.selectedSalesDate.set(filtered.length > 0 ? filtered[0] : '');
          this.isLoadingSalesDates.set(false);
        },
        error: (err) => {
          this.salesDates.set([]);
          this.selectedSalesDate.set('');
          this.isLoadingSalesDates.set(false);
          this.toastSrv.showToast('Failed to load SalesFTM dates', 'error');
        },
      });
  }

  // Consignment
  loadConsignmentDates() {
    this.isLoadingConsDates.set(true);

    this.urUploadSrv
      .getUploadDates('Consignment')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          const list = this.normalizeDateList(res);
          this.consDates.set(list);
          const filtered = this.filteredConsDates();
          this.selectedConsDate.set(filtered.length > 0 ? filtered[0] : '');
          this.isLoadingConsDates.set(false);
        },
        error: (err) => {
          this.consDates.set([]);
          this.selectedConsDate.set('');
          this.isLoadingConsDates.set(false);
          this.toastSrv.showToast('Failed to load Consignment dates', 'error');
        },
      });
  }

  // Load Latest Not Considered Dates
  loadNotConsideredDates() {
    this.isLoadingNotConsideredDates.set(true);
    this.urUploadSrv
      .getUploadDates('DebitBelowRecognised') 
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          const list = this.normalizeDateList(res);
          this.notConsideredDates.set(list);
          this.selectedNotConsideredDate.set(list[0] ?? '');
          this.isLoadingNotConsideredDates.set(false);
        },
        error: (err) => {
          this.notConsideredDates.set([]);
          this.selectedNotConsideredDate.set('');
          this.isLoadingNotConsideredDates.set(false);
          this.toastSrv.showToast('Failed to load Latest Not Considered dates', 'error');
        },
      });
  }

  downloadSalesFTM() {
    const dt = this.selectedSalesDate();
    if (!dt) return;
    this.isDownloadingSales.set(true);

    this.urUploadSrv
      .exportSalesFTMByUploadDate(dt)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (blob: Blob) => {
          this.isDownloadingSales.set(false);
          this.downloadBlob(blob, `SalesFTM_${this.safeFile(dt)}.xlsx`);
          this.toastSrv.showToast('SalesFTM downloaded', 'success');
        },
        error: (err) => {
          this.isDownloadingSales.set(false);
          this.toastSrv.showToast('SalesFTM download failed', 'error');
        },
      });
  }

  downloadConsignment() {
    const dt = this.selectedConsDate();
    if (!dt) return;
    this.isDownloadingCons.set(true);

    this.urUploadSrv
      .exportConsignmentByUploadDate(dt)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (blob: Blob) => {
          this.isDownloadingCons.set(false);
          this.downloadBlob(blob, `Consignment_${this.safeFile(dt)}.xlsx`);
          this.toastSrv.showToast('Consignment downloaded', 'success');
        },
        error: (err) => {
          this.isDownloadingCons.set(false);
          this.toastSrv.showToast('Consignment download failed', 'error');
        },
      });
  }

  downloadNotConsidered() {
    const dt = this.selectedNotConsideredDate();
    const empId = String(this.authSrv.userDetails?.employeeId || '');
    if (!dt) return;
    this.isDownloadingNotConsidered.set(true);

    this.urUploadSrv
      .exportLatestNotConsidered(dt, empId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (blob: Blob) => {
          this.isDownloadingNotConsidered.set(false);
          this.downloadBlob(blob, `LatestNotConsidered_${this.safeFile(dt)}.xlsx`);
          this.toastSrv.showToast('Latest Not Considered downloaded', 'success');
        },
        error: (err) => {
          this.isDownloadingNotConsidered.set(false);
          this.toastSrv.showToast('Latest Not Considered download failed', 'error');
        },
      });
  }

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

  private normalizeDateList(res: any): string[] {
    if (Array.isArray(res)) return res.map(x => String(x));
    if (Array.isArray(res?.UploadedDates)) {
      return res.UploadedDates.map((x: any) => String(x));
    }
    const arr =
      (Array.isArray(res?.Data) && res.Data) ||
      (Array.isArray(res?.data) && res.data) ||
      (Array.isArray(res?.Items) && res.Items) ||
      (Array.isArray(res?.items) && res.items) ||
      (Array.isArray(res?.Result) && res.Result) ||
      (Array.isArray(res?.uploadedDates) && res.uploadedDates) ||
      (Array.isArray(res?.uploaded_dates) && res.uploaded_dates) ||
      [];
    return arr.map((x: any) =>
      typeof x === 'string'
        ? x
        : String(x?.UploadDate ?? x?.Date ?? x?.date ?? x)
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}