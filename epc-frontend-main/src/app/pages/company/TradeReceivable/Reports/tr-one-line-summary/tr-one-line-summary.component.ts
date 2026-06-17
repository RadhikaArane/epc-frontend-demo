import { Component, inject, signal, OnDestroy } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { TrOneLineSummaryService } from '../../../../../shared/services/tradeReceivable/tr-one-line-summary.service';
import { ToastService } from '../../../../../shared/services/componentServices/toast.service';
import { BreadcrumbsComponent } from '../../../../common/breadcrumbs/breadcrumbs.component';
import { breadCrumbItems } from '../../../../../shared/models/models';
import { OneLineSummaryDashboard, OLSPagedResponse, OLSDetailItem } from '../../../../../shared/models/tradeReceivable-models/trOneLineSummary';

interface OLSAccordionData {
  state: string;
  isOpen: boolean;
  isLoading: boolean;
  currentPage: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  items: OLSDetailItem[];
}

@Component({
  selector: 'app-tr-one-line-summary',
  standalone: true,
  imports: [CommonModule, FormsModule, BreadcrumbsComponent, CurrencyPipe],
  templateUrl: './tr-one-line-summary.component.html',
  styleUrl: './tr-one-line-summary.component.scss'
})
export class TrOneLineSummaryComponent implements OnDestroy {

  olsSrv = inject(TrOneLineSummaryService);
  toastSrv = inject(ToastService);
  private destroy$ = new Subject<void>();

  breadCrumbItems = signal<breadCrumbItems[]>([
    { label: 'Working Files' },
    { label: 'One Line Summary' }
  ]);

   currencyUnit = signal<'Lakhs' | 'Crores'>('Lakhs');

  selectedMonth = signal('');
  selectedYear = signal('');
  months = signal([
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]);
  years = signal<string[]>([]);

  isLoadingSummary = signal(false);
  dashboardData = signal<OneLineSummaryDashboard[]>([]);
  stateAccordions = signal<Map<string, OLSAccordionData>>(new Map());

  // Dynamic columns from API response
  detailColumns = signal<string[]>([]);

  // Text-only columns (no currency formatting)
  private readonly textKeys = new Set(['State', 'Customer', 'Name']);

  constructor() {
    this.initializeYears();
    this.setCurrentMonthYear();
  }

  ngOnInit() {
    if (this.selectedMonth() && this.selectedYear()) {
      this.getOneLineSummaryDashbord();
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
    const years = [];
    for (let i = currentYear; i >= currentYear - 5; i--) years.push(i.toString());
    this.years.set(years);
  }

  setCurrentMonthYear() {
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    this.selectedMonth.set(this.months()[lastMonth.getMonth()]);
    this.selectedYear.set(lastMonth.getFullYear().toString());
  }

  onFilterChange() {
    if (this.selectedMonth() && this.selectedYear()) {
      this.getOneLineSummaryDashbord();
      this.stateAccordions.set(new Map());
      this.detailColumns.set([]);
    }
  }

  getOneLineSummaryDashbord() {
    if (!this.selectedMonth() || !this.selectedYear()) return;
    this.isLoadingSummary.set(true);

    this.olsSrv._getOneLineSummary(this.selectedMonth(), this.selectedYear())
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.dashboardData.set(res || []);
          this.isLoadingSummary.set(false);
        },
        error: (err: any) => {
          this.toastSrv.showToast(err?.message || 'Error loading one line summary', 'error');
          this.isLoadingSummary.set(false);
          this.dashboardData.set([]);
        }
      });
  }

  // ─── Accordion ──────────────────────────────────────────

  toggleStateDetails(state: string) {
    const accordions = this.stateAccordions();
    const existing = accordions.get(state);

    if (existing?.isOpen) {
      existing.isOpen = false;
      this.stateAccordions.set(new Map(accordions));
    } else if (existing) {
      existing.isOpen = true;
      this.stateAccordions.set(new Map(accordions));
      if (!existing.items || existing.items.length === 0) {
        this.loadStateData(state);
      }
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

  loadStateData(state: string) {
    const accordions = this.stateAccordions();
    const data = accordions.get(state);
    if (!data) return;

    data.isLoading = true;
    this.stateAccordions.set(new Map(accordions));

    this.olsSrv._getOLSByStatePaged(state, this.selectedMonth(), this.selectedYear(), data.currentPage, data.pageSize)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: OLSPagedResponse) => {
          const items = res.Items || [];
          data.items = items;
          data.totalRecords = res.TotalCount || 0;
          data.totalPages = res.TotalPages || 0;
          data.currentPage = res.PageNumber || 1;
          data.pageSize = res.PageSize || 10;
          data.isLoading = false;

          // Build columns from first item (only once per filter change)
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

  // ─── Cell Formatting ────────────────────────────────────

  isCurrencyCol(key: string): boolean {
    return !this.textKeys.has(key);
  }

  getCellValue(item: Record<string, any>, key: string): string {
    const val = item[key];
    if (val === null || val === undefined || val === '') return '-';
    return String(val);
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

  getAccordionData(state: string): OLSAccordionData | undefined {
    return this.stateAccordions().get(state);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}