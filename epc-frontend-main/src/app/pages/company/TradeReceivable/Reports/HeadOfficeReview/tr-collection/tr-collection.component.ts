import { Component, inject, signal, OnInit, OnDestroy, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

// Models
import { breadCrumbItems } from '../../../../../../shared/models/models';
import {
  HORCollectionsResModel,
  MonthlyCollection,
} from '../../../../../../shared/models/tradeReceivable-models/headOfficeReview';

// Components
import { BreadcrumbsComponent } from '../../../../../common/breadcrumbs/breadcrumbs.component';

// Services
import { TrHeadOfficeReviewService } from '../../../../../../shared/services/tradeReceivable/tr-head-office-review.service';
import { ToastService } from '../../../../../../shared/services/componentServices/toast.service';

@Component({
  selector: 'app-tr-collection',
  standalone: true,
  imports: [CommonModule, FormsModule, BreadcrumbsComponent],
  templateUrl: './tr-collection.component.html',
  styleUrl: './tr-collection.component.scss',
})
export class TrCollectionComponent implements OnInit, OnDestroy {
  // 🔹 Signals
  breadCrumbItems = signal<breadCrumbItems[]>([]);
  isLoading = signal<boolean>(true);
  // selectedDate = signal<string>(this.getCurrentMonthStr()); // "YYYY-MM"  // testing purpose *************
  selectedUnit = signal<string>('Lakhs');
  collectionData = signal<HORCollectionsResModel | null>(null);

  // 🔹 Derived Data (Updated when API loads)
  tableHeaders: MonthlyCollection[] = [];
  columnTotals: any[] = [];

  // 🔹 Date config
  // maxDate: string = this.getCurrentMonthStr(); ******testing purpose 

  // *******testing purpose ****************
  selectedDate = signal<string>(this.getPreviousMonth());
  maxDate: string = this.getPreviousMonth();

  getPreviousMonth(): string {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  }

  // 🔹 Services
  headOfcsrv = inject(TrHeadOfficeReviewService);
  toastSrv = inject(ToastService);

  // 🔹 Destroy handler
  private destroy$ = new Subject<void>();

  constructor() {
    this.breadCrumbItems.set([{ label: 'Head Office Review' }]);
  }

  ngOnInit(): void {
    this.loadData();
  }

  // 🔹 Get first day of current month (YYYY-MM)
  getCurrentMonthStr(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  }

  // 🔹 Date picker change
  onDateChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.value) return;

    this.selectedDate.set(input.value);
    this.loadData();
  }

  // 🔹 Unit dropdown change
  onUnitChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedUnit.set(select.value);
    this.loadData();
  }

  // 🔥 MAIN API CALL
  loadData(): void {
    if (!this.selectedDate()) return;

    this.isLoading.set(true);

    // ✅ Reset data immediately so old table disappears/updates safely
    this.collectionData.set(null);
    this.tableHeaders = [];
    this.columnTotals = [];

    const [year, month] = this.selectedDate().split('-');
    const unit = this.selectedUnit();

    console.log(
      `🔄 [Component] Requesting Data -> Month: ${month}, Year: ${year}, Unit: ${unit}`,
    );

    this.headOfcsrv
      ._getCollectionsData(month, year, unit)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: HORCollectionsResModel) => {
          console.log('✅ [Component] API Response Received:', res);

          if (
            res &&
            res.data &&
            res.data.stateWiseData &&
            res.data.stateWiseData.length > 0
          ) {
            // ✅ 1) Build headers (all unique months) + sort DESC (Year desc, Month desc)
            const monthKey = (m: any) =>
              `${m.Year}-${String(m.Month).padStart(2, '0')}`;

            const headerMap = new Map<string, MonthlyCollection>();
            res.data.stateWiseData.forEach((st) => {
              (st.MonthlyData || []).forEach((m) => {
                const key = monthKey(m);
                if (!headerMap.has(key)) {
                  headerMap.set(key, {
                    Month: m.Month,
                    Year: m.Year,
                    MonthName: m.MonthName,
                  } as MonthlyCollection);
                }
              });
            });

            const headersDesc = Array.from(headerMap.values()).sort(
              (a: any, b: any) => b.Year - a.Year || b.Month - a.Month,
            );

            // ✅ 2) Align every state's MonthlyData to these headers (so UI columns match)
            // (missing month => 0 values)
            const alignedStates = res.data.stateWiseData.map((st) => {
              const map = new Map<string, any>(
                (st.MonthlyData || []).map((m) => [monthKey(m), m]),
              );

              const monthlyDesc = headersDesc.map((h) => {
                const key = monthKey(h);
                const found = map.get(key);
                return (
                  found ?? {
                    Month: h.Month,
                    Year: h.Year,
                    MonthName: h.MonthName,
                    ProjectMarket: 0,
                    OpenMarket: 0,
                    ProjectBusiness: 0,
                    InstitutionalAndOthers: 0,
                    Total: 0,
                  }
                );
              });

              return { ...st, MonthlyData: monthlyDesc };
            });

            // ✅ 3) Set back to component
            const sortedRes: HORCollectionsResModel = {
              ...res,
              data: {
                ...res.data,
                stateWiseData: alignedStates,
              },
            };

            this.collectionData.set(sortedRes);

            // ✅ headers now DESC
            this.tableHeaders = headersDesc;

            // ✅ footer totals based on DESC headers
            this.calculateFooterTotals(sortedRes);
          } else {
            this.collectionData.set(null);
            this.toastSrv.showToast(
              'No data found for the selected period.',
              'error',
            );
          }

          this.isLoading.set(false);
        },
        error: (err: any) => {
          console.error('❌ [Component] API Request Failed:', err);

          this.collectionData.set(null);

          if (err.status !== 404) {
            this.toastSrv.showToast(
              'Failed to load collections data. Please try again.',
              'error',
            );
          }

          this.isLoading.set(false);
        },
      });
  }

  // 🔹 Logic to sum columns for the footer
  private calculateFooterTotals(res: HORCollectionsResModel) {
    console.log('🧮 [Component] Calculating Footer Totals...');

    this.columnTotals = this.tableHeaders.map((_, index) => {
      let projMkt = 0;
      let openMkt = 0;
      let projBus = 0;
      let instOth = 0;

      res.data.stateWiseData.forEach((state) => {
        const monthData = state.MonthlyData[index];
        if (monthData) {
          projMkt += monthData.ProjectMarket || 0;
          openMkt += monthData.OpenMarket || 0;
          projBus += monthData.ProjectBusiness || 0;
          instOth += monthData.InstitutionalAndOthers || 0;
        }
      });

      return {
        ProjectMarket: projMkt,
        OpenMarket: openMkt,
        ProjectBusiness: projBus,
        InstitutionalAndOthers: instOth,
      };
    });
  }

  collectionHeaderLabel = computed(() => {
    const date = new Date(this.selectedDate() + '-01'); // YYYY-MM-01
    return date.toLocaleString('en-US', { month: 'long', year: 'numeric' });
    // "February 2026"
  });

  monthYearLabel = computed(() => {
    const date = new Date(this.selectedDate() + '-01');
    return date.toLocaleString('en-GB', { month: 'short', year: '2-digit' }).replace(' ', '-');
  });



  // 🔹 Utility formatter (returns '-' for 0/null)  testing purpose ************
  // formatNumber(value: number): string {
  //   if (value === 0 || value === null || value === undefined) {
  //     return '-';
  //   }
  //   return value.toFixed(2);
  // }


// testing purpose for changes ***********************
  formatNumber(value: number): string {
  if (value === 0 || value === null || value === undefined) {
    return '-';
  }
  return Math.round(value).toLocaleString('en-IN');
}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
