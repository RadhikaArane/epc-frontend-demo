import { Component, inject, signal, OnInit, OnDestroy, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { UrUnrecognisedInventoryService } from '../../../../../../shared/services/unrecognisedInvoice/ur-unrecognised-inventory.service';
import { ToastService } from '../../../../../../shared/services/componentServices/toast.service';
import { JwtService } from '../../../../../../shared/services/common/jwt.service';
import { AreaWiseStageItem, AreaWiseStageSummaryResponse, CombinedSum } from '../../../../../../shared/models/unrecognisedInvoice-models/Inventory';

interface DisplayAreaWiseItem {
  areaName: string;
  status: string;
  [key: string]: string | number; // Index signature for dynamic buckets and statusTotal
}

interface DisplayGrandTotals {
  overallTotal: number;
  [key: string]: number; // Index signature for dynamic bucket totals
}

@Component({
  selector: 'app-ui-area-wise-aging',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ui-area-wise-aging.component.html',
  styleUrl: './ui-area-wise-aging.component.scss'
})
export class UiAreaWiseAgingComponent implements OnInit, OnDestroy {
  private urInventorySrv = inject(UrUnrecognisedInventoryService);
  private router = inject(Router);
  private jwtSrv = inject(JwtService);
  private toastSrv = inject(ToastService);
  private destroy$ = new Subject<void>();

  isLoading = signal<boolean>(true);
  error = signal<string | null>(null);
  selectedState = signal<string>('');
  selectedAreaName = signal<string>('');
  selectedDate = signal<string>('');

  areaOptions = signal<string[]>([]);
  isLoadingAreas = signal<boolean>(false);

  private rawItems = signal<AreaWiseStageItem[]>([]);
  private rawCombinedSums = signal<CombinedSum[]>([]);

  onDateChange(event: Event): void {
    const selectedDate = (event.target as HTMLInputElement).value;
    this.selectedDate.set(selectedDate); // Store the selected date in YYYY-MM-DD format
    this.loadAreaWiseStageSummary(selectedDate); // Reload data with new date
  }

  displayItems = computed<DisplayAreaWiseItem[]>(() => {
    return this.rawItems().map(item => {
      const findAmt = (name: string) => item.AgeingBuckets.find(a => a.AgeingBucket === name)?.TotalAmount || 0;
      return {
        areaName: item.AreaName,
        status: item.Status,
        lessThan30: findAmt('< 30 days'),
        days30to60: findAmt('30 - 60 days'),
        days60to90: findAmt('60 - 90 days'),
        days90to150: findAmt('90 - 150 days'),
        days150to180: findAmt('150 - 180 days'),
        days180to365: findAmt('180 - 365 days'),
        days365to730: findAmt('365 - 730 days'),
        days730to1095: findAmt('730 - 1095 days'),
        notDue: findAmt('Not Due'),
        statusTotal: item.StatusTotalAmount
      };
    });
  });

  displayGrandTotals = computed<DisplayGrandTotals>(() => {
    const sums = this.rawCombinedSums();
    const sumBucket = (name: string) => sums.filter(s => s.AgeingBucket === name).reduce((t, s) => t + s.GrandTotal, 0);
    return {
      lessThan30: sumBucket('< 30 days'),
      days30to60: sumBucket('30 - 60 days'),
      days60to90: sumBucket('60 - 90 days'),
      days90to150: sumBucket('90 - 150 days'),
      days150to180: sumBucket('150 - 180 days'),
      days180to365: sumBucket('180 - 365 days'),
      days365to730: sumBucket('365 - 730 days'),
      days730to1095: sumBucket('730 - 1095 days'),
      notDue: sumBucket('Not Due'),
      overallTotal: sums.reduce((t, s) => t + s.GrandTotal, 0)
    };
  });

  currentPage = signal<number>(1);
  pageSize = signal<number>(10);
  totalRecords = signal<number>(0);
  totalPages = signal<number>(0);
  collapsedColumns = signal<Set<string>>(new Set());

  bucketColumns = [
    { key: 'lessThan30', label: '< 30 days<br><span class="text-white small d-block">(In Lakhs)</span>', originalKey: '< 30 days', collapsible: true },
    { key: 'days30to60', label: '30 - 60 days<br><span class="text-white small d-block">(In Lakhs)</span>', originalKey: '30 - 60 days', collapsible: true },
    { key: 'days60to90', label: '60 - 90 days<br><span class="text-white small d-block">(In Lakhs)</span>', originalKey: '60 - 90 days', collapsible: true },
    { key: 'days90to150', label: '90 - 150 days<br><span class="text-white small d-block">(In Lakhs)</span>', originalKey: '90 - 150 days', collapsible: true },
    { key: 'days150to180', label: '150 - 180 days<br><span class="text-white small d-block">(In Lakhs)</span>', originalKey: '150 - 180 days', collapsible: true },
    { key: 'days180to365', label: '180 - 365 days<br><span class="text-white small d-block">(In Lakhs)</span>', originalKey: '180 - 365 days', collapsible: true },
    { key: 'days365to730', label: '365 - 730 days<br><span class="text-white small d-block">(In Lakhs)</span>', originalKey: '365 - 730 days', collapsible: true },
    { key: 'days730to1095', label: '730 - 1095 days<br><span class="text-white small d-block">(In Lakhs)</span>', originalKey: '730 - 1095 days', collapsible: true },
    { key: 'notDue', label: 'Not Due<br><span class="text-white small d-block">(In Lakhs)</span>', originalKey: 'Not Due', collapsible: true }
  ];

  ngOnInit(): void { this.loadAreaWiseStageSummary(); }

  onStateChange(event: Event): void {
  const state = (event.target as HTMLSelectElement).value;
  this.selectedState.set(state);

  // ✅ state change ayyaka area reset
  this.selectedAreaName.set('');
  this.areaOptions.set([]);

  // ✅ if All States selected, API call vaddu
  if (!state) {
    this.loadAreaWiseStageSummary();
    return;
  }

  // ✅ load areas from API and also reload summary
  this.loadAreasByState(state);
  this.loadAreaWiseStageSummary();
}

loadAreasByState(state: string) {
  this.isLoadingAreas.set(true);

  this.urInventorySrv
    .getAreasByState(state)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (res: any) => {
        // ✅ response array/string list assume
        const list =
          (Array.isArray(res) && res) ||
          (Array.isArray(res?.Items) && res.Items) ||
          (Array.isArray(res?.Areas) && res.Areas) ||
          (Array.isArray(res?.areas) && res.areas) ||
          [];

        // convert to string list + unique + sort
        const areas: string[] = [...new Set<string>(
      list.map((x: any) => String(x?.AreaName ?? x?.areaName ?? x))
    )]
    .filter((x): x is string =>
      x !== '' && x !== 'null' && x !== 'undefined'
    )
    .sort((a, b) => a.localeCompare(b));     // `a` and `b` are now strings

this.areaOptions.set(areas);
        this.isLoadingAreas.set(false);
      },
      error: () => {
        this.isLoadingAreas.set(false);
        this.areaOptions.set([]);
        this.toastSrv.showToast('Failed to load areas', 'error');
      }
    });
}

  onAreaNameChange(event: Event): void {
    this.selectedAreaName.set((event.target as HTMLSelectElement).value);
    this.loadAreaWiseStageSummary();
  }

  loadAreaWiseStageSummary(selectedDate?: string): void {
    this.isLoading.set(true);
    const data = { area: this.selectedAreaName(), state: this.selectedState(),date: this.selectedDate(), page: this.currentPage(), pageSize: this.pageSize() };
    this.urInventorySrv._getInventoryAreaWiseSummary(data).pipe(takeUntil(this.destroy$)).subscribe({
      next: (response) => {
        this.rawItems.set(response.Items || []);
        this.rawCombinedSums.set(response.CombinedSumsForAreaAndAgeingBucket || []);
        this.totalRecords.set(response.TotalCount || 0);
        this.totalPages.set(response.TotalPages || 0);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  onBucketClick(item: any, originalBucketKey: string): void {
    const date = this.selectedDate();
    const navigationData = { area: item.areaName, status: item.status, ageing: originalBucketKey, tab: 'area',date: date };
    const token = encodeURIComponent(this.jwtSrv.encrypt(JSON.stringify(navigationData)));
    this.router.navigate(['/urAreaWiseAgingBucketComponent'], { queryParams: { token } });
  }

  toggleColumn(columnKey: string): void {
    const collapsed = new Set(this.collapsedColumns());
    collapsed.has(columnKey) ? collapsed.delete(columnKey) : collapsed.add(columnKey);
    this.collapsedColumns.set(collapsed);
  }

  isColumnCollapsed(columnKey: string): boolean { return this.collapsedColumns().has(columnKey); }
  onPageChange(newPage: number): void { this.currentPage.set(newPage); this.loadAreaWiseStageSummary(); }
  onPageSizeChange(event: Event): void { this.pageSize.set(parseInt((event.target as HTMLSelectElement).value)); this.currentPage.set(1); this.loadAreaWiseStageSummary(); }
  getSerialNumber(i: number): number { return (this.currentPage() - 1) * this.pageSize() + i + 1; }
  getVisiblePages(): number[] { return [1]; }
  trackByItem(i: number, item: any): string { return `${item.areaName}-${item.status}`; }
  getCollapsedTooltip(item: DisplayAreaWiseItem, bucket: any): string {
    const value = item[bucket.key] as number;
    return `${bucket.originalKey} (In Lakhs): ₹${value.toLocaleString('en-IN', { minimumFractionDigits: 2 })} (Click to expand)`;
  }
  getCollapsedTooltipTotal(bucket: any): string {
    const value = this.displayGrandTotals()[bucket.key];
    return `${bucket.originalKey} (In Lakhs): ₹${value.toLocaleString('en-IN', { minimumFractionDigits: 2 })} (Click to expand)`;
  }
  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }
}