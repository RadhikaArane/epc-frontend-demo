import { Component, inject, signal, OnInit, computed, OnDestroy } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';

// Models
import { breadCrumbItems } from '../../../../../../shared/models/models';
import { Sales, SalesGrandTotal, StateWiseSalesData } from '../../../../../../shared/models/tradeReceivable-models/headOfficeReview';

// Components
import { BreadcrumbsComponent } from '../../../../../common/breadcrumbs/breadcrumbs.component';

// Services
import { TrHeadOfficeReviewService } from '../../../../../../shared/services/tradeReceivable/tr-head-office-review.service';
import { ToastService } from '../../../../../../shared/services/componentServices/toast.service';
import { Subject, finalize, takeUntil } from 'rxjs';

@Component({
  selector: 'app-tr-sales',
  standalone: true,
  imports: [CommonModule, DecimalPipe, BreadcrumbsComponent],
  templateUrl: './tr-sales.component.html',
  styleUrl: './tr-sales.component.scss'
})
export class TrSalesComponent implements OnInit, OnDestroy {

  headOfcsrv = inject(TrHeadOfficeReviewService);
  toastSrv = inject(ToastService);
  private destroy$ = new Subject<void>();

  // --- Signals ---
  
  // Breadcrumbs
  breadCrumbItems = signal<breadCrumbItems[]>([]);

  uniqueMonthYears = signal<string[]>([]);
  
  // Filters
  // selectedMonthStr = signal<string>(new Date().toISOString().slice(0, 7)); // YYYY-MM  *****testing purpose 
  selectedMonthStr = signal<string>(this.getPreviousMonth());//******testing purpose  */
  // selectedDate = signal<string>(this.getCurrentMonthStr()); // "YYYY-MM"  *************testing purpose 
  selectedDate = signal<string>(this.getPreviousMonth());// testing purpose for chnge*************

  selectedUnit = signal<string>('Lakhs');

  // 🔹 Date config
  // maxDate: string = this.getCurrentMonthStr();//  testing purpose 
  maxDate: string = this.getPreviousMonth(); // testing purpose *************

  getPreviousMonth(): string {
  const d = new Date();
  d.setMonth(d.getMonth() - 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

  // Loading
  isLoading = signal<boolean>(false);

  // Data
  salesData = signal<Sales | null>(null);
  stateWiseData = signal<StateWiseSalesData[]>([]);
  grandTotal = signal<SalesGrandTotal | null>(null);

  // Constants
  units = ['Lakhs', 'Crores'];

  // Computed Headers
  monthYearLabel = computed(() => {
    const date = new Date(this.selectedMonthStr() + '-01');
    return date.toLocaleString('en-GB', { month: 'short', year: '2-digit' }).replace(' ', '-');
  });

  constructor() {
    this.breadCrumbItems.set([{ label: 'Head Office Review' }]);
  }

  ngOnInit(): void {
    this.loadSales();
  }

  // Helper to get { month, year } from "YYYY-MM"
  private getMonthYear(dateStr: string): { month: number; year: number } {
    const [year, month] = dateStr.split('-').map(Number);
    return { month, year };
  }

  loadSales(): void {
    this.isLoading.set(true);

    const { month, year } = this.getMonthYear(this.selectedMonthStr());

    this.headOfcsrv
      ._getSalesData(month, year, this.selectedUnit())
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.isLoading.set(false))
      )
      .subscribe({
        next: (res) => {
          console.log('🔥 SALES RESPONSE', res);
          this.salesData.set(res);

// ✅ DESC headers build (Year desc, Month desc)
const monthKey = (m: any) => `${m.Year}-${String(m.Month).padStart(2, '0')}`;

const headerMap = new Map<string, any>();
(res?.data?.stateWiseData || []).forEach((st: { MonthlyData: any; }) => {
  (st.MonthlyData || []).forEach((m: { Month: any; Year: any; MonthName: any; }) => {
    const key = monthKey(m);
    if (!headerMap.has(key)) {
      headerMap.set(key, { Month: m.Month, Year: m.Year, MonthName: m.MonthName });
    }
  });
});

const headersDesc = Array.from(headerMap.values()).sort(
  (a, b) => (b.Year - a.Year) || (b.Month - a.Month)
);

// ✅ Align every state MonthlyData to headersDesc (so UI columns match)
const alignedStates = (res?.data?.stateWiseData || []).map((st: { MonthlyData: any; }) => {
  const map = new Map<string, any>((st.MonthlyData || []).map((m: any) => [monthKey(m), m]));

  const monthlyDesc = headersDesc.map(h => {
    const found = map.get(monthKey(h));
    return found ?? {
      Month: h.Month,
      Year: h.Year,
      MonthName: h.MonthName,
      ProjectMarket: 0,
      OpenMarket: 0,
      ProjectBusiness: 0,
      Institutional: 0,
      Exports: 0,
      Total: 0
    };
  });

  return { ...st, MonthlyData: monthlyDesc };
});

// ✅ set to signal
this.stateWiseData.set(alignedStates);

// ✅ update uniqueMonthYears in DESC order (HTML same)
this.uniqueMonthYears.set(headersDesc.map(h => h.MonthName));

// ✅ grand total same
this.grandTotal.set(res?.data?.grandTotal || null);

        },
        error: (err) => {
          console.error(err);
          this.toastSrv.showToast('Failed to load Sales data', 'error');
        }
      });
  }

  // Function to extract unique MonthYear values
    extractUniqueMonthYears(stateWiseData: StateWiseSalesData[]): void {
      const monthYearSet = new Set<string>();  // Using a Set to ensure uniqueness
  
      // Loop through the stateWiseData and MonthlyData to extract unique MonthYear
      stateWiseData.forEach((stateData) => {
        stateData.MonthlyData.forEach((monthData) => {
          monthYearSet.add(monthData.MonthName as unknown as string);  // Add MonthYear to the set (duplicate values will be ignored)
        });
      });
  
      // Set the unique MonthYear values to the signal
      this.uniqueMonthYears.set(Array.from(monthYearSet));  // Convert Set to an array
    }
    
    salesHeaderLabel = computed(() => {
  const d = new Date(this.selectedMonthStr() + '-01');
  return d.toLocaleString('en-US', { month: 'long', year: 'numeric' }); // February 2026
});


  getCurrentMonthStr(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  }

  onDateChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    if (value) {
      this.selectedMonthStr.set(value);
      this.loadSales();
    }
  }

  onUnitChange(event: Event): void {
    const unit = (event.target as HTMLSelectElement).value;
    this.selectedUnit.set(unit);
    this.loadSales();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}