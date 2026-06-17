import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, signal, computed, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { FormsModule } from '@angular/forms';

import { UrUnrecognisedCOGSService } from '../../../../../../shared/services/unrecognisedInvoice/ur-unrecognised-cogs.service';
import { ToastService } from '../../../../../../shared/services/componentServices/toast.service';
import { JwtService } from '../../../../../../shared/services/common/jwt.service';
import { DateRangeService } from '../../../../../../shared/services/componentServices/date-range.service';
import { breadCrumbItems } from '../../../../../../shared/models/models';
import { DaterangepickerComponent } from '../../../../../common/daterangepicker/daterangepicker.component';
import { BreadcrumbsComponent } from '../../../../../common/breadcrumbs/breadcrumbs.component';
import { AddRemarksComponent } from '../../../AddRemarks/add-remarks/add-remarks.component';

interface ColumnConfig {
  key: string;
  label: string;
  type: 'text' | 'currency' | 'date';
  sticky: boolean;
  collapsible: boolean;
  width: number;
}

@Component({
  selector: 'app-ur-cogs-state-wise-bucket',
  standalone: true,
  imports: [CommonModule, FormsModule, BreadcrumbsComponent, AddRemarksComponent],
  // DaterangepickerComponent
  templateUrl: './ur-cogs-state-wise-bucket.component.html',
  styleUrl: './ur-cogs-state-wise-bucket.component.scss'
})
export class UrCogsStateWiseBucketComponent implements OnInit, OnDestroy {
  @ViewChild(AddRemarksComponent) addRemarksModal!: AddRemarksComponent;

  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private urCOGSSrv = inject(UrUnrecognisedCOGSService);
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
  breadCrumbItems = signal<breadCrumbItems[]>([{ label: 'Unrecognised COGS' }]);

  // Data
  items = signal<Record<string, any>[]>([]);
  grandTotalAmt = signal(0);

  // Pagination
  currentPage = signal(1);
  pageSize = signal(10);
  totalRecords = signal(0);
  totalPages = signal(0);

  // Table config
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

  // Sticky: Customer Name, Sold to Party, Reg No (+ checkbox = 4 frozen)
  private readonly columnTypeMap: Record<string, { type: 'text' | 'currency' | 'date'; sticky?: boolean; width?: number; label?: string }> = {
    'Customer Name': { type: 'text', sticky: true },
    'Sold to Party': { type: 'text', sticky: true },
    'Reg No': { type: 'text', sticky: true },
    'State': { type: 'text', width: 90 },
    'Sales Value': { type: 'currency', width: 90, label: 'Sales\nValue' },
    'Billing Date': { type: 'date' },
    'Days': { type: 'text', width: 90 },
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

  stickyColumns = computed(() => this.columns().filter(c => c.sticky));
  scrollableColumns = computed(() => this.columns().filter(c => !c.sticky));

  ngOnInit(): void {
    this.activatedRoute.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const token = params['token'];
      if (token) {
        try {
          const data = this.jwtSrv.decrypt(decodeURIComponent(token));
          this.selectedState.set(data.state);
          this.selectedDate.set(data.date); // Ensure selected date is set here
          this.selectedStatus.set(data.status || '');
          const ageing = data.ageing || '';
          this.selectedAgeing.set(ageing);
          this.isShowingAllAgeing.set(ageing === '');
          this.sourceTab.set(data.tab || 'state');
          this.loadData(this.selectedDate()); // Load data with the selected date
        } catch {
          this.navigateBack();
        }
      } else {
        this.loadData();
      }
    });
  }

  // ─── Data Loading ────────────────────────────────────────

  loadData(selectedDate?: string): void {
    this.isLoading.set(true);
    const dateRange = this.dateRangeSrv.getFormattedDateRange();

    const params: any = {
      Stage: this.selectedStatus(),
      Ageing: this.selectedAgeing(),
      State: this.selectedState(),
      date: this.selectedDate(),
      page: this.currentPage(),
      pageSize: this.pageSize(),
      searchTerm: this.searchTerm().trim(),
      ...(dateRange.startDate && { startDate: dateRange.startDate, endDate: dateRange.endDate }),
    };

    this.urCOGSSrv._getCOGSStateWiseBucketSummary(params)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          const items = res.Items || [];
          this.items.set(items);
          this.grandTotalAmt.set(res.GrandTotalAmt || 0);
          this.totalRecords.set(res.TotalCount || 0);
          this.totalPages.set(res.TotalPages || 0);

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

  private buildColumnsFromData(sampleItem: Record<string, any>): void {
    const keys = Object.keys(sampleItem);
    const cols: ColumnConfig[] = [];

  const salesValueIndex = keys.indexOf('Sales Value');


    for (const key of keys) {
      if (this.skipColumns.has(key)) continue;
      const typeInfo = this.columnTypeMap[key];
      cols.push({
        key,
        label: typeInfo?.label || key,
        type: typeInfo?.type || 'text',
        sticky: typeInfo?.sticky || false,
        collapsible: !(typeInfo?.sticky),
        width: typeInfo?.width || 140
        
      });
    }

    cols.sort((a, b) => (a.sticky === b.sticky ? 0 : a.sticky ? -1 : 1));
    this.columns.set(cols);
  }

  // ─── Cell Formatting ────────────────────────────────────

  getCellValue(item: Record<string, any>, col: ColumnConfig): string {
    const val = item[col.key];
    if (val === null || val === undefined || val === '') return '-';

    switch (col.type) {
      case 'date':
        return this.formatDate(val);
      case 'currency':
        return Number(val).toFixed(2);
      default:
        return String(val);
    }
  }

  private formatDate(val: any): string {
    if (!val) return '-';
    const s = String(val).trim();
    const datePart = s.split(' ')[0];

    if (/^\d{2}-\d{2}-\d{4}$/.test(datePart)) {
      return datePart; // already dd-MM-yyyy
    }
    if (/^\d{4}-\d{2}-\d{2}/.test(datePart)) {
      const [y, m, d] = datePart.split('-');
      return `${d}-${m}-${y}`;
    }
    if (datePart.includes('/')) {
      const parts = datePart.split('/');
      if (parts.length === 3) {
        return `${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}-${parts[2]}`;
      }
    }
    return s;
  }

  isCurrencyColumn(col: ColumnConfig): boolean {
    return col.type === 'currency';
  }

  // ─── Column Collapse ────────────────────────────────────

  isColumnCollapsed(key: string): boolean { return this.collapsedColumns().has(key); }

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
    return String(item['Reg No'] || item['Billing No'] || '');
  }

  isRowSelected(item: Record<string, any>): boolean {
    return this.selectedRowIds().has(this.getRowId(item));
  }

  toggleRowSelection(item: Record<string, any>, event: any): void {
    const id = this.getRowId(item);
    const ids = new Set(this.selectedRowIds());
    const objects = [...this.selectedRowObjects()];
    if (event.target.checked) { ids.add(id); objects.push(item); }
    else { ids.delete(id); const idx = objects.findIndex(x => this.getRowId(x) === id); if (idx > -1) objects.splice(idx, 1); }
    this.selectedRowIds.set(ids);
    this.selectedRowObjects.set(objects);
  }

  toggleSelectAll(event: any): void {
    if (event.target.checked) {
      this.selectedRowIds.set(new Set(this.items().map(i => this.getRowId(i))));
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

  getStartRecord(): number { return this.totalRecords() === 0 ? 0 : (this.currentPage() - 1) * this.pageSize() + 1; }
  getEndRecord(): number { return Math.min(this.currentPage() * this.pageSize(), this.totalRecords()); }

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
    this.router.navigate(['/unrecognisedRevenueComponent'], { queryParams: { tab: this.sourceTab() } });
  }

  openAddRemarkModal(): void {
    if (!this.addRemarksModal) return;
    const sel = this.selectedRowObjects();
    sel.length > 0 ? this.addRemarksModal.openWithSelections(sel) : this.addRemarksModal.openModal();
  }

  onRemarkSaved(): void {
    this.currentPage.set(1);
    this.loadData();
    this.selectedRowIds.set(new Set());
    this.selectedRowObjects.set([]);
  }

  downloadExcel(): void {
    this.isDownloading.set(true);
    this.urCOGSSrv._excelCOGSStateWiseBucketSummary({ State: this.selectedState(), Ageing: this.selectedAgeing() })
      .subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url; a.download = `StateWiseCOGS_${this.selectedState()}.xlsx`; a.click();
          window.URL.revokeObjectURL(url);
          this.isDownloading.set(false);
        },
        error: () => { this.toastSrv.showToast('Download failed', 'error'); this.isDownloading.set(false); },
      });
  }

  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }
}