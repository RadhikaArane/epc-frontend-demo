import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TrManageSalesService } from '../../../../../shared/services/tradeReceivable/tr-manage-sales.service';
import { ToastService } from '../../../../../shared/services/componentServices/toast.service';
import { BreadcrumbsComponent } from '../../../../common/breadcrumbs/breadcrumbs.component';
import {
  SalesFTMFinalResponse,
  SalesFTMFinalRow,
  ColumnMapping,
  FormattedSalesFTMFinalRow
} from '../../../../../shared/models/tradeReceivable-models/trManageSales';

@Component({
  selector: 'app-t-sales-nov2025',
  standalone: true,
  imports: [CommonModule, FormsModule, BreadcrumbsComponent],
  templateUrl: './t-sales-nov2025.component.html',
  styleUrl: './t-sales-nov2025.component.scss'
})
export class TSalesNov2025Component implements OnInit, OnDestroy {

  breadCrumbItems = signal([
    { label: 'Manage Sales' },
    { label: 'Sales FTM Final' }
  ]);

  // Services
  manageSalesSrv = inject(TrManageSalesService);
  toastSrv = inject(ToastService);

  // State
  loading = signal<boolean>(false);
  columns = signal<ColumnMapping[]>([]);
  rows = signal<FormattedSalesFTMFinalRow[]>([]);
  totalRecords = signal<number>(0);
  selectedMonth = signal<string>('');
  selectedYear = signal<number>(0);
  selectedMonthYear = signal<string>('');

  // Pagination
  currentPage = signal<number>(1);
  pageSize = signal<number>(25);
  totalPages = signal<number>(0);

  // Math for template
  Math = Math;

  // --- Frozen Columns Logic ---
  frozenColumnsList = [
    'Bill Document No.',
    'Bill Date',
    'Registration No.',
    'Billing Type',
    'Plant',
    'Region Desc. Of STP'
  ];

  // Store dynamically calculated left positions for frozen columns
  frozenLeftPositions = signal<Map<string, number>>(new Map());

  isColumnFrozen(fieldName: string): boolean {
    return this.frozenColumnsList.includes(fieldName);
  }

  getFrozenLeftPosition(fieldName: string): number {
    return this.frozenLeftPositions().get(fieldName) || 0;
  }

  calculateDynamicFrozenPositions(): void {
    const table = document.querySelector('.table-ultra-compact');
    if (!table) return;

    const headerCells = table.querySelectorAll('thead th');
    const positions = new Map<string, number>();

    let currentLeft = 0;

    this.columns().forEach((col, index) => {
      if (this.isColumnFrozen(col.field) && headerCells[index]) {
        positions.set(col.field, currentLeft);
        const actualWidth = (headerCells[index] as HTMLElement).offsetWidth;
        currentLeft += actualWidth;
      }
    });

    this.frozenLeftPositions.set(positions);
  }
  // ----------------------------

  // Amount field names for formatting
  private amountFields = new Set<string>([
    'Quantity',
    'Basic Cost',
    'Discount',
    'Net Cost',
    'Total Before Tax',
    'CGST Amt',
    'SGST Amt',
    'UGSTAmt',
    'IGST Amt',
    'Rounding Off',
    'Grand Total'
  ]);

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.initializeDefaultMonthYear();
    this.loadSalesFTMFinalData();
  }

  initializeDefaultMonthYear(): void {
    const today = new Date();
    // Go to 1st of current month, subtract 1 month -> lands in last month safely
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);

    // Extract the pieces we need
    const year = lastMonth.getFullYear();
    const monthNum = String(lastMonth.getMonth() + 1).padStart(2, '0');
    const monthName = lastMonth.toLocaleString('en-US', { month: 'long' });

    // Sync all three signals at once
    this.selectedMonthYear.set(`${year}-${monthNum}`);
    this.selectedMonth.set(monthName);
    this.selectedYear.set(year);
  }

  onMonthYearChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    if (!value) return;

    this.selectedMonthYear.set(value);

    const [year, monthNum] = value.split('-');
    const monthIndex = parseInt(monthNum, 10) - 1;
    const monthName = new Date(parseInt(year), monthIndex).toLocaleString('en-US', { month: 'long' });

    this.selectedMonth.set(monthName);
    this.selectedYear.set(parseInt(year, 10));

    this.currentPage.set(1);
    this.loadSalesFTMFinalData();
  }

  public formatDate(value: string): string {
    const date = value.split(' ')[0];
    return date;
  }

  loadSalesFTMFinalData(): void {
    if (!this.selectedMonth() || !this.selectedYear()) {
      this.toastSrv.showToast('Please select month and year', 'error');
      return;
    }

    this.loading.set(true);

    this.manageSalesSrv._getManageSalesFTMFinal(
      this.selectedMonth(),
      this.selectedYear(),
      this.currentPage(),
      this.pageSize()
    )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: SalesFTMFinalResponse) => {
          const mappedColumns: ColumnMapping[] = res.Columns.map((col) => ({
            field: col,
            header: col,
            frozen: this.isColumnFrozen(col)
          }));

          const formattedRows: FormattedSalesFTMFinalRow[] = res.Rows.map(row => this.formatRow(row));

          this.columns.set(mappedColumns);
          this.rows.set(formattedRows);
          this.totalRecords.set(res.TotalRows);
          this.totalPages.set(res.TotalPages);
          this.currentPage.set(res.PageNumber);

          this.loading.set(false);

          // Give Angular a split second to render the DOM, then calculate positions
          setTimeout(() => this.calculateDynamicFrozenPositions(), 100);

          if (res.Rows.length === 0) {
            this.toastSrv.showToast('No data found for selected month and year', 'info');
          }
        },
        error: (err: any) => {
          this.loading.set(false);
          this.toastSrv.showToast('Error loading Sales FTM Final data', 'error');
          this.rows.set([]);
          this.totalRecords.set(0);
          this.totalPages.set(0);
        }
      });
  }

  onPageChange(newPage: number): void {
    if (newPage < 1 || newPage > this.totalPages()) return;
    if (newPage === this.currentPage()) return;

    this.currentPage.set(newPage);
    this.loadSalesFTMFinalData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onPageSizeChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.pageSize.set(parseInt(target.value, 10));
    this.currentPage.set(1);
    this.loadSalesFTMFinalData();
  }

  getVisiblePages(): number[] {
    const current = this.currentPage();
    const total = this.totalPages();
    const pages: number[] = [];

    if (total === 0) return pages;

    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i);
      return pages;
    }

    pages.push(1);
    let rangeStart = Math.max(2, current - 1);
    let rangeEnd = Math.min(total - 1, current + 1);

    if (rangeStart > 2) pages.push(-1);
    for (let i = rangeStart; i <= rangeEnd; i++) pages.push(i);
    if (rangeEnd < total - 1) pages.push(-2);
    pages.push(total);

    return pages;
  }

  getStartRecord(): number {
    if (this.totalRecords() === 0) return 0;
    return (this.currentPage() - 1) * this.pageSize() + 1;
  }

  getEndRecord(): number {
    return Math.min(this.currentPage() * this.pageSize(), this.totalRecords());
  }

  private formatRow(row: SalesFTMFinalRow): FormattedSalesFTMFinalRow {
    const formattedRow: FormattedSalesFTMFinalRow = {};

    Object.keys(row).forEach(key => {
      const value = row[key];

      if (value === null || value === undefined || value === '') {
        formattedRow[key] = '-';
        return;
      }

      if (this.amountFields.has(key)) {
        formattedRow[key] = this.formatAmount(value);
      } else {
        formattedRow[key] = value.toString();
      }
    });

    return formattedRow;
  }

  private formatAmount(value: string | number | null): string {
    if (value === null || value === undefined || value === '') return '-';

    const numValue = parseFloat(value.toString());
    if (isNaN(numValue)) return value.toString();

    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    }).format(numValue);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}