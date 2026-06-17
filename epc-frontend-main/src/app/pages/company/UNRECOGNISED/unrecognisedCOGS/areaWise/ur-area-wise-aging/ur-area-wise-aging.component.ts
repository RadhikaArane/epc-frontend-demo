import {
  Component,
  inject,
  signal,
  OnInit,
  OnDestroy,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { UrUnrecognisedCOGSService } from '../../../../../../shared/services/unrecognisedInvoice/ur-unrecognised-cogs.service';
import { ToastService } from '../../../../../../shared/services/componentServices/toast.service';
import { JwtService } from '../../../../../../shared/services/common/jwt.service';
import { AreaWiseStageItem } from '../../../../../../shared/models/unrecognisedInvoice-models/Inventory';
import {
  AreaCombinedSum,
  COGSAreaWiseSummaryResponse,
} from '../../../../../../shared/models/unrecognisedInvoice-models/inventoryCOGS';

interface DisplayAreaWiseItem {
  areaName: string;
  status: string;
  lessThan30: number;
  days30to60: number;
  days60to90: number;
  days90to150: number;
  days150to180: number;
  days180to365: number;
  days365to730: number;
  days730to1095: number;
  statusTotal: number;
  [key: string]: string | number;
}

interface DisplayGrandTotals {
  lessThan30: number;
  days30to60: number;
  days60to90: number;
  days90to150: number;
  days150to180: number;
  days180to365: number;
  days365to730: number;
  days730to1095: number;
  overallTotal: number;
  [key: string]: number;
}

@Component({
  selector: 'app-ur-area-wise-aging',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ur-area-wise-aging.component.html',
  styleUrl: './ur-area-wise-aging.component.scss',
})
export class UrAreaWiseAgingComponent implements OnInit, OnDestroy {
  private urCOGSSrv = inject(UrUnrecognisedCOGSService);
  private router = inject(Router);
  private jwtSrv = inject(JwtService);
  private toastSrv = inject(ToastService);
  private destroy$ = new Subject<void>();

  isLoading = signal<boolean>(true);
  error = signal<string | null>(null);

  selectedState = signal<string>('');
  selectedAreaName = signal<string>('');

  areaOptions = signal<string[]>([]);
  isLoadingAreas = signal<boolean>(false);

  selectedDate = signal<string>('');

  onDateChange(event: Event): void {
    const selectedDate = (event.target as HTMLInputElement).value;
    this.selectedDate.set(selectedDate); // Store the selected date in YYYY-MM-DD format
    this.loadAreaWiseStageSummary(selectedDate); // Reload data with new date
  }

  private rawItems = signal<AreaWiseStageItem[]>([]);
  private rawCombinedSums = signal<AreaCombinedSum[]>([]);

  displayItems = computed<DisplayAreaWiseItem[]>(() => {
    return this.rawItems().map((item) => {
      const buckets = item.AgeingBuckets;
      const findAmt = (name: string) =>
        buckets.find((a) => a.AgeingBucket === name)?.TotalAmount || 0;

      return {
        areaName: item.AreaName,
        status: item.Status || '-',
        lessThan30: findAmt('< 30 days'),
        days30to60: findAmt('30 - 60 days'),
        days60to90: findAmt('60 - 90 days'),
        days90to150: findAmt('90 - 150 days'),
        days150to180: findAmt('150 - 180 days'),
        days180to365: findAmt('180 - 365 days'),
        days365to730: findAmt('365 - 730 days'),
        days730to1095: findAmt('730 - 1095 days'),
        statusTotal: item.StatusTotalAmount,
      };
    });
  });

  displayGrandTotals = computed<DisplayGrandTotals>(() => {
    const sums = this.rawCombinedSums();
    const sumBucket = (name: string) =>
      sums
        .filter((s) => s.AgeingBucket === name)
        .reduce((t, s) => t + s.GrandTotal, 0);

    return {
      lessThan30: sumBucket('< 30 days'),
      days30to60: sumBucket('30 - 60 days'),
      days60to90: sumBucket('60 - 90 days'),
      days90to150: sumBucket('90 - 150 days'),
      days150to180: sumBucket('150 - 180 days'),
      days180to365: sumBucket('180 - 365 days'),
      days365to730: sumBucket('365 - 730 days'),
      days730to1095: sumBucket('730 - 1095 days'),
      overallTotal: sums.reduce((t, s) => t + s.GrandTotal, 0),
    };
  });

  currentPage = signal<number>(1);
  pageSize = signal<number>(10);
  totalRecords = signal<number>(0);
  totalPages = signal<number>(0);

  // Collapse/Expand state
  collapsedColumns = signal<Set<string>>(new Set());

  // Column configuration
  bucketColumns = [
    {
      key: 'lessThan30',
      label:
        '< 30 days<br><span class="small text-white d-block" style="opacity: 0.9;">(In Lakhs)</span>',
      originalKey: '< 30 Days',
      collapsible: true,
    },
    {
      key: 'days30to60',
      label:
        '30 - 60 days<br><span class="small text-white d-block" style="opacity: 0.9;">(In Lakhs)</span>',
      originalKey: '30 - 60 Days',
      collapsible: true,
    },
    {
      key: 'days60to90',
      label:
        '60 - 90 days<br><span class="small text-white d-block" style="opacity: 0.9;">(In Lakhs)</span>',
      originalKey: '60 - 90 Days',
      collapsible: true,
    },
    {
      key: 'days90to150',
      label:
        '90 - 150 days<br><span class="small text-white d-block" style="opacity: 0.9;">(In Lakhs)</span>',
      originalKey: '90 - 150 Days',
      collapsible: true,
    },
    {
      key: 'days150to180',
      label:
        '150 - 180 days<br><span class="small text-white d-block" style="opacity: 0.9;">(In Lakhs)</span>',
      originalKey: '150 - 180 Days',
      collapsible: true,
    },
    {
      key: 'days180to365',
      label:
        '180 - 365 days<br><span class="small text-white d-block" style="opacity: 0.9;">(In Lakhs)</span>',
      originalKey: '180 - 365 Days',
      collapsible: true,
    },
    {
      key: 'days365to730',
      label:
        '365 - 730 days<br><span class="small text-white d-block" style="opacity: 0.9;">(In Lakhs)</span>',
      originalKey: '365 - 730 Days',
      collapsible: true,
    },
    {
      key: 'days730to1095',
      label:
        '730 - 1095 days<br><span class="small text-white d-block" style="opacity: 0.9;">(In Lakhs)</span>',
      originalKey: '730 - 1095 Days',
      collapsible: true,
    },
  ];

  ngOnInit(): void {
    this.loadAreaWiseStageSummary();
  }

  onStateChange(event: Event): void {
    const state = (event.target as HTMLSelectElement).value;
    this.selectedState.set(state);

    // ✅ state change ayyaka area reset
    this.selectedAreaName.set('');
    this.areaOptions.set([]);

    // ✅ All States select chesinappudu areas api call vaddu
    if (!state) {
      this.loadAreaWiseStageSummary();
      return;
    }

    // ✅ State select ayithe areas api trigger
    this.loadAreasByState(state);

    // ✅ summary reload
    this.loadAreaWiseStageSummary();
  }

  onAreaNameChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedAreaName.set(value);
    this.loadAreaWiseStageSummary();
  }

  loadAreaWiseStageSummary(selectedDate?: string): void {
    this.isLoading.set(true);
    this.error.set(null);

    const data = {
      area: this.selectedAreaName(),
      state: this.selectedState(),
      date: this.selectedDate(),  
      page: this.currentPage(),
      pageSize: this.pageSize(),
    };

    this.urCOGSSrv
      ._getCOGSAreaWiseSummary(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: COGSAreaWiseSummaryResponse) => {
          console.log('COGS Area-wise Stage Summary response:', response);

          this.rawItems.set(response.Items || []);

          const combinedSums =
            response.CombinedSumsForAreaAndAgeingBucket || [];
          this.rawCombinedSums.set(combinedSums);
          this.totalRecords.set(response.TotalCount || 0);
          this.totalPages.set(response.TotalPages || 0);
          this.currentPage.set(response.Page || 1);
          this.pageSize.set(response.PageSize || 10);

          this.isLoading.set(false);
        },
        error: (err: any) => {
          console.error('Error loading COGS Area-wise Stage Summary:', err);
          this.error.set('Failed to load data. Please try again.');
          this.toastSrv.showToast(
            err?.message || 'Error loading data',
            'error',
          );
          this.isLoading.set(false);
        },
      });
  }

  loadAreasByState(state: string): void {
    this.isLoadingAreas.set(true);
    this.urCOGSSrv
      ._getAreasByState(state)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          // ✅ API response may be array or object
          const list =
            (Array.isArray(res) && res) ||
            (Array.isArray(res?.Items) && res.Items) ||
            (Array.isArray(res?.Areas) && res.Areas) ||
            (Array.isArray(res?.areas) && res.areas) ||
            [];

          const areas: string[] = Array.from(
            new Set<string>(
              list
                .map((x: any) =>
                  String(x?.AreaName ?? x?.areaName ?? x ?? '').trim(),
                )
                .filter(
                  (x: string) =>
                    x.length > 0 && x !== 'null' && x !== 'undefined',
                ),
            ),
          ).sort((a: string, b: string) => a.localeCompare(b));

          this.areaOptions.set(areas);
          this.isLoadingAreas.set(false);
        },
        error: (err) => {
          this.isLoadingAreas.set(false);
          this.areaOptions.set([]);
          this.toastSrv.showToast('Failed to load areas', 'error');
        },
      });
  }

  onBucketClick(item: DisplayAreaWiseItem, originalBucketKey: string): void {
    console.log(
      'Navigating to COGS area-wise bucket for:',
      item.areaName,
      item.status,
    );

    const date = this.selectedDate();
    const navigationData = {
      area: item.areaName,
      status: item.status,
      ageing: originalBucketKey,
      tab: 'area',
      date: date
    };

    const encryptedToken = this.jwtSrv.encrypt(JSON.stringify(navigationData));
    const encodedToken = encodeURIComponent(encryptedToken);

    this.router.navigate(['/urCogsAreaWiseBucketComponent'], {
      queryParams: { token: encodedToken },
    });
  }

  // ==================== COLLAPSE/EXPAND METHODS ====================

  toggleColumn(columnKey: string): void {
    const collapsed = new Set(this.collapsedColumns());
    collapsed.has(columnKey)
      ? collapsed.delete(columnKey)
      : collapsed.add(columnKey);
    this.collapsedColumns.set(collapsed);
  }

  isColumnCollapsed(columnKey: string): boolean {
    return this.collapsedColumns().has(columnKey);
  }

  getCollapsedTooltip(item: DisplayAreaWiseItem, bucket: any): string {
    const value = item[bucket.key] as number;
    const formatted =
      '₹' +
      value.toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    return `${bucket.originalKey} (In Lakhs): ${formatted} (Click to expand)`;
  }

  getCollapsedTooltipTotal(bucket: any): string {
    const value = this.displayGrandTotals()[bucket.key];
    const formatted =
      '₹' +
      value.toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    return `${bucket.originalKey} (In Lakhs): ${formatted} (Click to expand)`;
  }

  // ==================== PAGINATION METHODS ====================

  onPageChange(newPage: number): void {
    if (
      newPage < 1 ||
      newPage > this.totalPages() ||
      newPage === this.currentPage()
    )
      return;
    this.currentPage.set(newPage);
    this.loadAreaWiseStageSummary();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onPageSizeChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const newPageSize = parseInt(target.value, 10);
    this.pageSize.set(newPageSize);
    this.currentPage.set(1);
    this.loadAreaWiseStageSummary();
  }

  getVisiblePages(): number[] {
    const current = this.currentPage();
    const total = this.totalPages();
    if (total === 0) return [];

    const pages: number[] = [];
    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i);
      return pages;
    }

    pages.push(1);
    const rangeStart = Math.max(2, current - 1);
    const rangeEnd = Math.min(total - 1, current + 1);

    if (rangeStart > 2) pages.push(-1);
    for (let i = rangeStart; i <= rangeEnd; i++) pages.push(i);
    if (rangeEnd < total - 1) pages.push(-2);
    pages.push(total);

    return pages;
  }

  getSerialNumber(index: number): number {
    return (this.currentPage() - 1) * this.pageSize() + index + 1;
  }

  getStartRecord(): number {
    if (this.totalRecords() === 0) return 0;
    return (this.currentPage() - 1) * this.pageSize() + 1;
  }

  getEndRecord(): number {
    const end = this.currentPage() * this.pageSize();
    return Math.min(end, this.totalRecords());
  }

  trackByItem(index: number, item: DisplayAreaWiseItem): string {
    return `${item.areaName}-${item.status}`;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
