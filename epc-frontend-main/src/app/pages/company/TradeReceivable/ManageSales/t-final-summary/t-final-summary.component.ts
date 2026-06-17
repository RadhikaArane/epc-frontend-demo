import { Component, ElementRef, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { TrManageSalesService } from '../../../../../shared/services/tradeReceivable/tr-manage-sales.service';
import { AuthService } from '../../../../../shared/services/common/auth.service';
import { ToastService } from '../../../../../shared/services/componentServices/toast.service';
import { Subject, takeUntil } from 'rxjs';
import {
  ConsideredRow, ConsideredTotal, CreditNote, Discounts,
  FreightRecoverynotconsideredasSale, GrossSale, NetSaleAfterAdj,
  NetSaleBeforeAdj, NotConsideredRow, NotConsideredTotal, InstitutionalSale,
  SaleReversalRow, SaleReversalTotal, SecondaryDiscountsGetData,
} from '../../../../../shared/models/tradeReceivable-models/trManageSales';
import { FormsModule } from '@angular/forms';
import { BreadcrumbsComponent } from '../../../../common/breadcrumbs/breadcrumbs.component';
import { breadCrumbItems } from '../../../../../shared/models/models';
import { DecimalPipe } from '@angular/common';

declare var bootstrap: any;

@Component({
  selector: 'app-t-final-summary',
  standalone: true,
  imports: [FormsModule, BreadcrumbsComponent, DecimalPipe],
  templateUrl: './t-final-summary.component.html',
  styleUrl: './t-final-summary.component.scss',
})
export class TFinalSummaryComponent implements OnInit, OnDestroy {
  manageSaleSrv = inject(TrManageSalesService);
  authSrv = inject(AuthService);
  toastSrv = inject(ToastService);
  private destroy$ = new Subject<void>();

  breadCrumbItems = signal<breadCrumbItems[]>([
    { label: 'Working Files' },
    { label: 'Final Summary' },
  ]);

  // Filter signals
  selectedDate = signal<string>(''); 
  selectedMonth = signal<string>(''); 
  selectedYear = signal<number>(0);
  isLoading = signal(false);

  // Left table signals
  ConsideredRow = signal<ConsideredRow[]>([]);
  ConsideredTotal = signal<ConsideredTotal | null>(null);
  SaleReversalRow = signal<SaleReversalRow[]>([]);
  SaleReversalTotal = signal<SaleReversalTotal | null>(null);
  NetSaleBeforeAdj = signal<NetSaleBeforeAdj | null>(null);
  InstitutionalSale = signal<InstitutionalSale | null>(null);
  Discounts = signal<Discounts | null>(null);
  CreditNote = signal<CreditNote | null>(null);
  FreightRecoverynotconsideredasSale = signal<FreightRecoverynotconsideredasSale | null>(null);
  NetSaleAfterAdj = signal<NetSaleAfterAdj | null>(null);
  NotConsideredRow = signal<NotConsideredRow[]>([]);
  NotConsideredTotal = signal<NotConsideredTotal | null>(null);
  GrossSale = signal<GrossSale | null>(null);
  
  // ---> NEW SIGNALS ADDED HERE <---
  NetSale = signal<number | null>(null);
  NetSaleDifference = signal<number | null>(null);

  // Right table signals
  secondaryRows = signal<SecondaryDiscountsGetData[]>([]);
  secondaryTotal = signal<any>(null); 

  // Upload modal
  @ViewChild('secondaryDiscountModel') secondaryDiscountModel!: ElementRef;
  selectedFileBulkUpload = signal<File | null>(null);
  isDownloadingBulkUpload = signal(false);
  isUploadingBulkUpload = signal(false);

  ngOnInit() {
    this.initializeDefaultMonthYear();
    this.loadFinalSummary();
    this.loadSecondaryDiscounts();
  }

  /// ─── INITIALIZE DEFAULT MONTH-YEAR ───────────────────────

  initializeDefaultMonthYear(): void {
    const today = new Date();
    // Go to 1st of current month, subtract 1 month to land safely in last month
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    
    const year = lastMonth.getFullYear();
    const monthNum = String(lastMonth.getMonth() + 1).padStart(2, '0');
    const monthName = lastMonth.toLocaleString('en-US', { month: 'long' });

    this.selectedDate.set(`${year}-${monthNum}`);
    this.selectedMonth.set(monthName);
    this.selectedYear.set(year);
  }

  // ─── FILTER CHANGE ───────────────────────────────────────

  onDateChange(value: string): void {
    if (!value) return;
    
    this.selectedDate.set(value);

    // Update the extracted month and year for the API and UI
    const [yearStr, monthStr] = value.split('-');
    const year = parseInt(yearStr, 10);
    const monthIndex = parseInt(monthStr, 10) - 1;
    const monthName = new Date(year, monthIndex).toLocaleString('en-US', { month: 'long' });
    
    this.selectedMonth.set(monthName);
    this.selectedYear.set(year);

    // Call the correct load methods for this component
    this.loadFinalSummary();
    this.loadSecondaryDiscounts();
  }


  // ─── Load Left Table ────────────────────────────────────

  loadFinalSummary() {
    this.isLoading.set(true);
    const month = this.selectedMonth();
    const year = this.selectedYear();

    this.manageSaleSrv._getManageSalesFinalSummary(month, year)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.ConsideredRow.set(res.Considered.Rows || []);
          this.ConsideredTotal.set(res.Considered.Total);
          this.SaleReversalRow.set(res.SaleReversal.Rows || []);
          this.SaleReversalTotal.set(res.SaleReversal.Total);
          this.NetSaleBeforeAdj.set(res.NetSaleBeforeADJ);
          this.InstitutionalSale.set(res.InstitutionalSale);
          this.Discounts.set(res.Discounts);
          this.CreditNote.set(res.CreditNote);
          this.FreightRecoverynotconsideredasSale.set(res.FreightRecoverynotconsideredasSale);
          this.NetSaleAfterAdj.set(res.NetSaleAfterADJ);
          this.NotConsideredRow.set(res.NotConsidered.Rows || []);
          this.NotConsideredTotal.set(res.NotConsidered.Total);
          this.GrossSale.set(res.GrossSale);
          
          // ---> BINDING NEW VARIABLES HERE <---
          this.NetSale.set(res.NetSale);
          this.NetSaleDifference.set(res.NetSaleDifference);
          
          this.isLoading.set(false);
        },
        error: () => {
          this.toastSrv.showToast('Error loading final summary', 'error');
          this.isLoading.set(false);
        },
      });
    }

  // ─── Load Right Table ───────────────────────────────────

  loadSecondaryDiscounts() {
    const month = this.selectedMonth();
    const year = this.selectedYear();

    this.manageSaleSrv._getSecondaryDiscounts(month, year)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.secondaryRows.set(res?.Data?.length ? res.Data : []);
          this.secondaryTotal.set(res?.Total || null);
        },
        error: () => {
          this.secondaryRows.set([]);
          this.secondaryTotal.set(null);
        },
      });
    }

  // ─── Upload Modal ───────────────────────────────────────

  openBulkCostBasisUpload(): void {
    if (this.secondaryDiscountModel) {
      new bootstrap.Modal(this.secondaryDiscountModel.nativeElement).show();
    }
  }

  closeSecondaryDiscountUpload(): void {
    if (this.secondaryDiscountModel) {
      bootstrap.Modal.getInstance(this.secondaryDiscountModel.nativeElement)?.hide();
    }
    this.selectedFileBulkUpload.set(null);
  }

  downloadBulkCostBasisExcel(): void {
    const month = this.selectedMonth();
    const year = this.selectedYear();
    this.isDownloadingBulkUpload.set(true);

    this.manageSaleSrv._exportSecondaryDiscount(month, year)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (blob: Blob) => {
          this.isDownloadingBulkUpload.set(false);
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `Secondary_Discount_${month}_${year}.xlsx`;
          link.click();
          window.URL.revokeObjectURL(url);
        },
        error: () => {
          this.isDownloadingBulkUpload.set(false);
          this.toastSrv.showToast('Failed to download Excel', 'error');
        },
      });
  }

  onFileSelectedBulkUpload(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file && (file.name.endsWith('.xlsx') || file.name.endsWith('.xls'))) {
      this.selectedFileBulkUpload.set(file);
    } else {
      this.toastSrv.showToast('Please upload a valid Excel file', 'error');
    }
  }

  onFileDrop(event: DragEvent): void {
    event.preventDefault();
    const file = event.dataTransfer?.files?.[0];
    if (file && (file.name.endsWith('.xlsx') || file.name.endsWith('.xls'))) {
      this.selectedFileBulkUpload.set(file);
    } else {
      this.toastSrv.showToast('Please upload a valid Excel file', 'error');
    }
  }

  clearSelectedFileBulkUpload(): void {
    this.selectedFileBulkUpload.set(null);
  }

  uploadBulkCostBasisExcel(): void {
    const file = this.selectedFileBulkUpload();
    if (!file) return;

    const month = this.selectedMonth();
    const year = this.selectedYear();
    
    const formData = new FormData();
    formData.append('ExcelFile', file);
    formData.append('Month', month);
    formData.append('Year', year.toString());

    this.isUploadingBulkUpload.set(true);

    this.manageSaleSrv._uploadSecondaryDiscountExcel(formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.isUploadingBulkUpload.set(false);
          this.toastSrv.showToast(res?.message || 'Upload successful', 'success');
          this.closeSecondaryDiscountUpload();
          this.loadSecondaryDiscounts();
        },
        error: () => {
          this.isUploadingBulkUpload.set(false);
          this.toastSrv.showToast('Failed to upload Excel file', 'error');
        },
      });
  }

  removeDecimal(value: number | null | undefined): number {
    if (!value) return 0;
    return Math.trunc(value); // Math.trunc cuts off decimals (0.57 becomes 0)
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}