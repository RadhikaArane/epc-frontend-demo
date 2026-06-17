import { Component, inject, signal } from '@angular/core';
import { TrWorkingFilesService } from '../../../../../shared/services/tradeReceivable/tr-working-files.service';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ToastService } from '../../../../../shared/services/componentServices/toast.service';
import { BreadcrumbsComponent } from '../../../../common/breadcrumbs/breadcrumbs.component';
import { breadCrumbItems } from '../../../../../shared/models/models';
import { DebitSummary, StateAccordionData, DebitDetailResponse } from '../../../../../shared/models/tradeReceivable-models/workingFiles';

@Component({
  selector: 'app-debit-report',
  standalone: true,
  imports: [CommonModule, FormsModule, BreadcrumbsComponent],
  templateUrl: './debit-report.component.html',
  styleUrl: './debit-report.component.scss'
})
export class DebitReportComponent {

  srv = inject(TrWorkingFilesService);
  toastSrv = inject(ToastService);
  private destroy$ = new Subject<void>();

  breadCrumbItems = signal<breadCrumbItems[]>([
    { label: 'Working Files' },
    { label: 'Debit Report' }
  ]);

  selectedMonth = signal('');
  selectedYear = signal('');
  currencyUnit = signal<'Lakhs' | 'Crores'>('Lakhs');
  months = signal([
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]);
  years = signal<string[]>([]);

  isLoadingSummary = signal(false);
  summaryData = signal<DebitSummary[]>([]);
  stateAccordions = signal<Map<string, StateAccordionData>>(new Map());

  // Dynamic detail columns — built from first API response
  detailColumns = signal<string[]>([]);

  // Currency columns — values that should show ₹ formatting
  private readonly currencyKeys = new Set([
    'Total', 'Gross Inv Value', 'Pending O/S %'
  ]);

  // Date columns
  private readonly dateKeys = new Set(['Date', 'Due Date', 'Installation Date']);

  constructor() {
    this.initializeYears();
    this.setCurrentMonthYear();
  }

  ngOnInit() {
    if (this.selectedMonth() && this.selectedYear()) {
      this.loadSummary();
    }
  }

  formatAmount(value: number | null | undefined): string {
    if (value === null || value === undefined) return '-';
    const divisor = this.currencyUnit() === 'Crores' ? 10000000 : 100000;
    return (value / divisor).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  initializeYears() {
    const currentYear = new Date().getFullYear();
    const yearsList = [];
    for (let i = currentYear; i >= currentYear - 5; i--) yearsList.push(i.toString());
    this.years.set(yearsList);
  }

  setCurrentMonthYear() {
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    this.selectedMonth.set(this.months()[lastMonth.getMonth()]);
    this.selectedYear.set(lastMonth.getFullYear().toString());
  }

  onFilterChange() {
    if (this.selectedMonth() && this.selectedYear()) {
      this.loadSummary();
      this.stateAccordions.set(new Map());
      this.detailColumns.set([]);
    }
  }

  loadSummary() {
    if (!this.selectedMonth() || !this.selectedYear()) return;
    this.isLoadingSummary.set(true);

    this.srv._getDebitSummary(this.selectedMonth(), this.selectedYear())
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: DebitSummary[]) => {
          this.summaryData.set(res || []);
          this.isLoadingSummary.set(false);
        },
        error: (err: any) => {
          this.toastSrv.showToast(err?.message || 'Error loading debit summary', 'error');
          this.isLoadingSummary.set(false);
          this.summaryData.set([]);
        }
      });
  }

  // ─── Accordion Toggle ───────────────────────────────────

  toggleStateDetails(state: string) {
    const accordions = this.stateAccordions();
    const existing = accordions.get(state);

    if (existing?.isOpen) {
      existing.isOpen = false;
      this.stateAccordions.set(new Map(accordions));
    } else if (existing) {
      existing.isOpen = true;
      this.stateAccordions.set(new Map(accordions));
    } else {
      accordions.set(state, {
        state, isOpen: true, isLoading: true,
        currentPage: 1, pageSize: 10,
        totalRecords: 0, totalPages: 0, items: []
      });
      this.stateAccordions.set(new Map(accordions));
      this.loadStateData(state);
    }
  }

  // ─── Load Detail Data + Build Columns ───────────────────

  loadStateData(state: string) {
    const accordions = this.stateAccordions();
    const data = accordions.get(state);
    if (!data) return;

    data.isLoading = true;
    this.stateAccordions.set(new Map(accordions));

    this.srv._getDebitByStatePaged(state, this.selectedMonth(), this.selectedYear(), data.currentPage, data.pageSize)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: DebitDetailResponse) => {
          const items = res.Items || [];
          data.items = items;
          data.totalRecords = res.TotalCount || 0;
          data.totalPages = res.TotalPages || 0;
          data.currentPage = res.PageNumber || 1;
          data.pageSize = res.PageSize || 10;
          data.isLoading = false;

          // Build columns from first item (only once)
          if (items.length > 0 && this.detailColumns().length === 0) {
            this.detailColumns.set(Object.keys(items[0]));
          }

          this.stateAccordions.set(new Map(accordions));
        },
        error: (err: any) => {
          this.toastSrv.showToast(err?.message || `Error loading data for ${state}`, 'error');
          data.isLoading = false;
          data.items = [];
          this.stateAccordions.set(new Map(accordions));
        }
      });
  }

  // ─── Cell Value Formatting ──────────────────────────────

  isCurrencyCol(key: string): boolean {
    return this.currencyKeys.has(key);
  }

  isDateCol(key: string): boolean {
    return this.dateKeys.has(key);
  }

  getCellValue(item: Record<string, any>, key: string): string {
    const val = item[key];
    if (val === null || val === undefined || val === '') return '-';

    if (this.isDateCol(key)) {
      return this.formatDate(val);
    }

    return String(val);
  }

  private formatDate(val: any): string {
    if (!val) return '-';
    const s = String(val).trim();
    const dt = new Date(s);
    if (isNaN(dt.getTime())) return s;
    const d = String(dt.getDate()).padStart(2, '0');
    const m = String(dt.getMonth() + 1).padStart(2, '0');
    return `${d}/${m}/${dt.getFullYear()}`;
  }

  // ─── Pagination ─────────────────────────────────────────

  onPageChange(state: string, newPage: number) {
    const data = this.stateAccordions().get(state);
    if (!data || newPage < 1 || newPage > data.totalPages || newPage === data.currentPage) return;
    data.currentPage = newPage;
    this.stateAccordions.set(new Map(this.stateAccordions()));
    this.loadStateData(state);
  }

  onPageSizeChange(state: string, event: Event) {
    const data = this.stateAccordions().get(state);
    if (!data) return;
    data.pageSize = parseInt((event.target as HTMLSelectElement).value, 10);
    data.currentPage = 1;
    this.stateAccordions.set(new Map(this.stateAccordions()));
    this.loadStateData(state);
  }

  getVisiblePages(state: string): number[] {
    const data = this.stateAccordions().get(state);
    if (!data || data.totalPages === 0) return [];
    const total = data.totalPages, current = data.currentPage;
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

    const pages: number[] = [1];
    if (current > 3) pages.push(-1);
    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) pages.push(i);
    if (current < total - 2) pages.push(-2);
    pages.push(total);
    return pages;
  }

  getStartRecord(state: string): number {
    const d = this.stateAccordions().get(state);
    return !d || d.totalRecords === 0 ? 0 : (d.currentPage - 1) * d.pageSize + 1;
  }

  getEndRecord(state: string): number {
    const d = this.stateAccordions().get(state);
    return d ? Math.min(d.currentPage * d.pageSize, d.totalRecords) : 0;
  }

  isStateOpen(state: string): boolean {
    return this.stateAccordions().get(state)?.isOpen || false;
  }

  getStateData(state: string): StateAccordionData | undefined {
    return this.stateAccordions().get(state);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}