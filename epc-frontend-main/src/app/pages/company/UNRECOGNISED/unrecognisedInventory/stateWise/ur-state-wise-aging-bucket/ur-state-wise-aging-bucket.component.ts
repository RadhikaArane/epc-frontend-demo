import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, signal, computed, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { FormsModule } from '@angular/forms';

// Services
import { UrUnrecognisedInventoryService } from '../../../../../../shared/services/unrecognisedInvoice/ur-unrecognised-inventory.service';
import { ToastService } from '../../../../../../shared/services/componentServices/toast.service';
import { JwtService } from '../../../../../../shared/services/common/jwt.service';
import { DateRangeService } from '../../../../../../shared/services/componentServices/date-range.service';

// Models
import { StateWiseAgingBucketItem, StateWiseAgingBucketResponse } from '../../../../../../shared/models/unrecognisedInvoice-models/Inventory';
import { breadCrumbItems } from '../../../../../../shared/models/models';

// Components
import { BreadcrumbsComponent } from '../../../../../common/breadcrumbs/breadcrumbs.component';
import { DaterangepickerComponent } from '../../../../../common/daterangepicker/daterangepicker.component';
import { AddRemarksComponent } from '../../../AddRemarks/add-remarks/add-remarks.component';

interface ColumnConfig {
  key: string;
  label: string;
  type: 'text' | 'currency' | 'date';
  sticky: boolean;
  collapsible: boolean;

  minWidth?: number;
  maxWidth?: number;
  wrap?: boolean;
}
@Component({
  selector: 'app-ur-state-wise-aging-bucket',
  standalone: true,
  imports: [CommonModule, BreadcrumbsComponent, FormsModule, AddRemarksComponent],
  // DaterangepickerComponent
  providers: [DatePipe],
  templateUrl: './ur-state-wise-aging-bucket.component.html',
  styleUrl: './ur-state-wise-aging-bucket.component.scss'
})
export class UrStateWiseAgingBucketComponent implements OnInit, OnDestroy {
  @ViewChild(AddRemarksComponent) addRemarksModal!: AddRemarksComponent;

  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private urInventorySrv = inject(UrUnrecognisedInventoryService);
  private toastSrv = inject(ToastService);
  private jwtSrv = inject(JwtService);
  private dateRangeSrv = inject(DateRangeService);
  private destroy$ = new Subject<void>();

  // Page state
  selectedState = signal('');
  selectedStatus = signal('');
  selectedAgeing = signal('');
  isShowingAllAgeing = signal(false);
  sourceTab = signal('state');
  searchTerm = signal('');
  isLoading = signal(true);
  isDownloading = signal(false);
  breadCrumbItems = signal<breadCrumbItems[]>([{ label: 'Unrecognised Inventory' }]);

  // Data
  items = signal<Record<string, any>[]>([]);
  grandTotalAmt = signal(0);

  // Pagination
  currentPage = signal(1);
  pageSize = signal(10);
  totalRecords = signal(0);
  totalPages = signal(0);

  // Table config — built dynamically from API
  columns = signal<ColumnConfig[]>([]);
  collapsedColumns = signal<Set<string>>(new Set());

  // Selection
  selectedRowIds = signal<Set<string>>(new Set());
  selectedRowObjects = signal<any[]>([]);

  selectedDate = signal<string>('');

  onBucketDateChange(event: any): void {
  const selectedDate = event.target.value;
  this.selectedDate.set(selectedDate);  // Save selected date for Bucket
  this.loadData(selectedDate);  // Reload bucket data with the selected date
}

  // Known column type overrides
  private readonly columnTypeMap: Record<string, {
  type: 'text' | 'currency' | 'date';
  sticky?: boolean;
  minWidth?: number;
  maxWidth?: number;
  wrap?: boolean;
}> = {
  'Registration No.': { type: 'text', sticky: true },
  'Sold To Party': { type: 'text', sticky: true },
  'Sales Value': { type: 'currency' },
  'Bill Date': { type: 'date' },

  // ✅ required
  'Sold To Party Name': { type: 'text', minWidth: 140, maxWidth: 180, wrap: true },
  'Portal Status': { type: 'text', minWidth: 110, maxWidth: 140, wrap: true },
};

  private readonly skipColumns = new Set<string>([]);

  ageingDropdownOptions = [
    { label: 'All Aging', value: '' },
    { label: '< 30 days', value: '< 30 days' },
    { label: '30 - 60 days', value: '30 - 60 days' },
    { label: '60 - 90 days', value: '60 - 90 days' },
    { label: '90 - 150 days', value: '90 - 150 days' },
    { label: '150 - 180 days', value: '150 - 180 days' },
    { label: '180 - 365 days', value: '180 - 365 days' },
    { label: '365 - 730 days', value: '365 - 730 days' },
    { label: '730 - 1095 days', value: '730 - 1095 days' },
  ];

  // Computed: sticky vs scrollable columns
  stickyColumns = computed(() => this.columns().filter(c => c.sticky));
  scrollableColumns = computed(() => this.columns().filter(c => !c.sticky));

  ngOnInit(): void {
    this.activatedRoute.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const token = params['token'];
      if (!token) return;

      try {
        const data = this.jwtSrv.decrypt(decodeURIComponent(token));
        this.selectedState.set(data.state);
        this.selectedDate.set(data.date); // Ensure selected date is set here
        const ageing = data.ageing || '';
        this.selectedAgeing.set(ageing);
        this.isShowingAllAgeing.set(ageing === '');
        this.selectedStatus.set(data.status || '');
        this.loadData(this.selectedDate()); // Load data with the selected date
      } catch {
        this.navigateBack();
      }
    });
  }

  // ─── Data Loading ────────────────────────────────────────

  loadData(selectedDate?: string): void {
    this.isLoading.set(true);
    const dateRange = this.dateRangeSrv.getFormattedDateRange();

    const params = {
      Ageing: this.selectedAgeing(),
      Stage: this.selectedStatus(),
      State: this.selectedState(),
      date: this.selectedDate(),
      page: this.currentPage(),
      pageSize: this.pageSize(),
      searchTerm: this.searchTerm().trim(),
      // ...(dateRange.startDate && { startDate: dateRange.startDate, endDate: dateRange.endDate }),
    };

    this.urInventorySrv._getInventoryStateWiseBucketSummary(params)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          const items = res.Items || [];
          this.items.set(items);
          this.grandTotalAmt.set(res.GrandTotalAmt || 0);
          this.totalRecords.set(res.TotalCount || 0);
          this.totalPages.set(res.TotalPages || 0);

          // Build columns from first item (only once)
          if (items.length > 0 && this.columns().length === 0) {
            this.buildColumnsFromData(items[0]);
          }

          this.isLoading.set(false);
        },
        error: () => {
          this.toastSrv.showToast('Failed to load data', 'error');
          this.isLoading.set(false);
        },
      });
  }

  /**
   * Build column config from API response keys
   */
  private buildColumnsFromData(sampleItem: Record<string, any>): void {
  const keys = Object.keys(sampleItem);
  const cols: ColumnConfig[] = [];

  const salesValueIndex = keys.indexOf('Sales Value');

  for (let idx = 0; idx < keys.length; idx++) {
    const key = keys[idx];
    if (this.skipColumns.has(key)) continue;

    const typeInfo = this.columnTypeMap[key];

    // ✅ Sales Value tarvatha columns (excluding Portal Status & Sold To Party Name)
    const isAfterSalesValue = salesValueIndex >= 0 && idx > salesValueIndex;
    const force150Wrap =
      isAfterSalesValue && key !== 'Sold To Party Name' && key !== 'Portal Status';

    cols.push({
      key,
      label: key,
      type: typeInfo?.type || 'text',
      sticky: typeInfo?.sticky || false,
      collapsible: !(typeInfo?.sticky),

      minWidth: typeInfo?.minWidth ?? (force150Wrap ? 150 : undefined),
      maxWidth: typeInfo?.maxWidth,
      wrap: typeInfo?.wrap ?? (force150Wrap ? true : false),
    });
  }

  cols.sort((a, b) => (a.sticky === b.sticky ? 0 : a.sticky ? -1 : 1));
  this.columns.set(cols);
}

  // ─── Cell Value Formatting ──────────────────────────────

  getCellValue(item: Record<string, any>, col: ColumnConfig): string {
    const val = item[col.key];
    if (val === null || val === undefined || val === '') return '-';

    switch (col.type) {
      case 'date':
        return String(val).split('T')[0];
      case 'currency':
        return Number(val).toFixed(2);
      default:
        const strVal = String(val);
        // Automatically detect ISO date strings (YYYY-MM-DDThh:mm:ss) and strip the time
        if (/^\d{4}-\d{2}-\d{2}T/.test(strVal)) {
          return strVal.split('T')[0];
        }
        return strVal;
    }
  }

  isCurrencyColumn(col: ColumnConfig): boolean {
    return col.type === 'currency';
  }

  // ─── Column Collapse ────────────────────────────────────

  isColumnCollapsed(key: string): boolean {
    return this.collapsedColumns().has(key);
  }

  toggleColumn(key: string): void {
    const set = new Set(this.collapsedColumns());
    set.has(key) ? set.delete(key) : set.add(key);
    this.collapsedColumns.set(set);
  }

  getTotalVisibleColumns(): number {
    return 1 + this.columns().filter(c => !this.isColumnCollapsed(c.key)).length;
  }

  // ─── Row Selection ──────────────────────────────────────

  getRowId(item: Record<string, any>): string {
    return String(item['Registration No.'] || item['Inv. Ref.'] || '');
  }

  isRowSelected(item: Record<string, any>): boolean {
    return this.selectedRowIds().has(this.getRowId(item));
  }

  toggleRowSelection(item: Record<string, any>, event: any): void {
    const id = this.getRowId(item);
    const ids = new Set(this.selectedRowIds());
    const objects = [...this.selectedRowObjects()];

    if (event.target.checked) {
      ids.add(id);
      objects.push(item);
    } else {
      ids.delete(id);
      const idx = objects.findIndex(x => this.getRowId(x) === id);
      if (idx > -1) objects.splice(idx, 1);
    }

    this.selectedRowIds.set(ids);
    this.selectedRowObjects.set(objects);
  }

  toggleSelectAll(event: any): void {
    if (event.target.checked) {
      const ids = new Set(this.items().map(i => this.getRowId(i)));
      this.selectedRowIds.set(ids);
      this.selectedRowObjects.set([...this.items()]);
    } else {
      this.selectedRowIds.set(new Set());
      this.selectedRowObjects.set([]);
    }
  }

  // ─── Filters & Pagination ──────────────────────────────

  onAgeingFilterChange(event: Event): void {
    this.selectedAgeing.set((event.target as HTMLSelectElement).value);
    this.currentPage.set(1);
    this.loadData();
  }

  onPageSizeChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const newPageSize = parseInt(target.value, 10);

    console.log(`Changing page size from ${this.pageSize()} to ${newPageSize}`);

    this.pageSize.set(newPageSize);
    this.currentPage.set(1);
    this.loadData();
  }

  onPageChange(newPage: number): void {
    if (newPage < 1 || newPage > this.totalPages()) {
      return;
    }

    if (newPage === this.currentPage()) {
      return;
    }

    console.log(`Changing page from ${this.currentPage()} to ${newPage}`);

    this.currentPage.set(newPage);
    this.loadData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onSearch(): void { this.currentPage.set(1); this.loadData(); }
  clearSearch(): void { this.searchTerm.set(''); this.onSearch(); }
  onSearchKeyPress(e: KeyboardEvent): void { if (e.key === 'Enter') this.onSearch(); }
  onDateRangeApplied(): void { this.onSearch(); }
  onDateRangeCleared(): void { this.onSearch(); }

  // ─── Pagination Helpers ─────────────────────────────────

  getStartRecord(): number {
    return this.totalRecords() === 0 ? 0 : (this.currentPage() - 1) * this.pageSize() + 1;
  }

  getEndRecord(): number {
    return Math.min(this.currentPage() * this.pageSize(), this.totalRecords());
  }

  getVisiblePages(): number[] {
    const current = this.currentPage();
    const total = this.totalPages();
    const pages: number[] = [];

    if (total === 0) {
      return pages;
    }

    if (total <= 7) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
      return pages;
    }

    pages.push(1);

    let rangeStart = Math.max(2, current - 1);
    let rangeEnd = Math.min(total - 1, current + 1);

    if (rangeStart > 2) {
      pages.push(-1);
    }

    for (let i = rangeStart; i <= rangeEnd; i++) {
      pages.push(i);
    }

    if (rangeEnd < total - 1) {
      pages.push(-2);
    }

    pages.push(total);

    return pages;
  }

  // ─── Actions ────────────────────────────────────────────

  navigateBack(): void {
    this.router.navigate(['/unrecogmisedInventoryComponent'], { queryParams: { tab: 'state' } });
  }

  openAddRemarkModal(): void {
    if (!this.addRemarksModal) return;
    const selections = this.selectedRowObjects();
    selections.length > 0
      ? this.addRemarksModal.openWithSelections(selections)
      : this.addRemarksModal.openModal();
  }

  onRemarkSaved(): void {
    this.currentPage.set(1);
    this.loadData();
    this.selectedRowIds.set(new Set());
    this.selectedRowObjects.set([]);
  }

  downloadExcel(): void {
    this.isDownloading.set(true);
    
    this.urInventorySrv._excelInventoryStateWiseBucketSummary({
      State: this.selectedState(),
      Ageing: this.selectedAgeing(),
      StageName: this.selectedStatus(), 
      SelectedDate: this.selectedDate(), 
      searchTerm: this.searchTerm() || '' 
    }).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Inventory_State_${this.selectedState() || 'All'}.xlsx`;
        a.click();
        window.URL.revokeObjectURL(url);
        this.isDownloading.set(false);
      },
      error: () => {
        this.toastSrv.showToast('Download failed', 'error');
        this.isDownloading.set(false);
      },
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}