import { breadCrumbItems } from './../../../../../../shared/models/models';
import { Component, computed, inject, signal } from '@angular/core';
import { TrHeadOfficeReviewService } from '../../../../../../shared/services/tradeReceivable/tr-head-office-review.service';
import { ToastService } from '../../../../../../shared/services/componentServices/toast.service';
import { Subject } from 'rxjs';
import {
  GrandTotalsOMC, MonthlyData2OMC, MonthlyData3OMC,
  MonthlyDataOMC, openMarketComparison, StateWiseDataOMC,
  Totals2OMC, Totals3OMC, TotalsOMC
} from '../../../../../../shared/models/tradeReceivable-models/headOfficeReview';
import { CommonModule, DecimalPipe } from '@angular/common';
import { BreadcrumbsComponent } from '../../../../../common/breadcrumbs/breadcrumbs.component';

@Component({
  selector: 'app-tr-open-comparison',
  standalone: true,
  imports: [DecimalPipe, CommonModule, BreadcrumbsComponent],
  templateUrl: './tr-open-comparison.component.html',
  styleUrl: './tr-open-comparison.component.scss'
})
export class TrOpenComparisonComponent {

  headOfcsrv = inject(TrHeadOfficeReviewService);
  toastSrv = inject(ToastService);
  private destroy$ = new Subject<void>();

  breadCrumbItems = signal<breadCrumbItems[]>([]);

  constructor() {
    this.breadCrumbItems.set([{ label: 'Head Office Review' }]);
  }

  uniqueMonthYears = signal<string[]>([]);

  // Raw API data — stored as-is, never modified
  comparisonData = signal<openMarketComparison | null>(null);
  stateWiseData = signal<StateWiseDataOMC[]>([]);
  exportsData = signal<MonthlyData2OMC[]>([]);
  institutionalData = signal<MonthlyData3OMC[]>([]);
  grandTotals = signal<GrandTotalsOMC | null>(null);
  openMarketSubTotals = signal<any[]>([]);

  selectedUnit = signal<string>('L');
  isLoading = signal<boolean>(false);
  selectedMonth = signal<number>(0);
  selectedYear = signal<number>(0);

  // ✅ Computed divisor — switches between Lakhs and Crores without any API call
  // Assumes API returns raw values in Rupees
  readonly divisor = computed(() => this.selectedUnit() === 'Cr' ? 10_000_000 : 100_000);

  ngOnInit(): void {
    const today = new Date();
    today.setMonth(today.getMonth() - 1);
    this.selectedMonth.set(today.getMonth() + 1);
    this.selectedYear.set(today.getFullYear());
    this.loadOpenComparison();
  }

  // ✅ Only updates the signal — no API call, divisor recomputes automatically
  onUnitChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedUnit.set(select.value);
  }

  // ✅ Used in HTML: convert(raw value) → divided by current divisor
  convert(value: number | null | undefined): number {
    return (value ?? 0) / this.divisor();
  }

  loadOpenComparison(): void {
    this.isLoading.set(true);

    // Note: no longer passing `unit` to API — conversion is handled on frontend
    this.headOfcsrv
      ._getOpenMarketComparison(this.selectedMonth(), this.selectedYear())
      .subscribe({
        next: (res) => {
          console.log('🔥 OPEN COMPARISON RESPONSE:', res);

          this.comparisonData.set(res);

          const stateWise = res?.openMarket?.stateWiseData || [];
          const exportsMonthly = res?.exports?.monthlyData || [];
          const institutionalMonthly = res?.institutional?.monthlyData || [];

          this.stateWiseData.set(stateWise);
          this.exportsData.set(exportsMonthly);
          this.institutionalData.set(institutionalMonthly);
          this.grandTotals.set(res?.grandTotals || null);

          this.openMarketSubTotals.set(res?.openMarket?.subTotalsByMonth || []);

          this.extractUniqueMonthYears(stateWise, exportsMonthly, institutionalMonthly);

          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('❌ API ERROR:', err);
          this.toastSrv.showToast('Failed to load Open Comparison', 'error');
          this.isLoading.set(false);
        },
      });
  }

  extractUniqueMonthYears(
    stateWiseData: StateWiseDataOMC[],
    exportsData: MonthlyData2OMC[],
    institutionalData: MonthlyData3OMC[]
  ): void {
    const monthYearSet = new Set<string>();

    stateWiseData.forEach(s => s.MonthlyData.forEach(m => monthYearSet.add(m.MonthYear)));
    exportsData.forEach(m => monthYearSet.add(m.MonthYear));
    institutionalData.forEach(m => monthYearSet.add(m.MonthYear));

    const monthOrder: Record<string, number> = {
      January: 1, February: 2, March: 3, April: 4, May: 5, June: 6,
      July: 7, August: 8, September: 9, October: 10, November: 11, December: 12
    };

    const sorted = Array.from(monthYearSet).sort((a, b) => {
      const [aM, aY] = a.split(' ');
      const [bM, bY] = b.split(' ');
      return (Number(bY) * 100 + (monthOrder[bM] || 0)) - (Number(aY) * 100 + (monthOrder[aM] || 0));
    });

    this.uniqueMonthYears.set(sorted);
  }

  getStateMonthData(monthlyData: MonthlyDataOMC[], monthYear: string): MonthlyDataOMC | null {
    return monthlyData.find(m => m.MonthYear === monthYear) ?? null;
  }

  getExportMonthData(monthYear: string): MonthlyData2OMC | null {
    return this.exportsData().find(m => m.MonthYear === monthYear) ?? null;
  }
  
  getSubTotalMonthData(monthYear: string): any {
    return this.openMarketSubTotals().find(m => m.MonthYear === monthYear) ?? null;
  }

  getInstitutionalMonthData(monthYear: string): MonthlyData3OMC | null {
    return this.institutionalData().find(m => m.MonthYear === monthYear) ?? null;
  }

  isSelectedMonth(monthYear: string): boolean {
    const name = new Date(2000, this.selectedMonth() - 1, 1)
      .toLocaleString('en-US', { month: 'long' });
    return monthYear === `${name} ${this.selectedYear()}`;
  }

  onMonthYearChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    if (!value) return;
    const [year, month] = value.split('-').map(Number);
    this.selectedMonth.set(month);
    this.selectedYear.set(year);
    this.loadOpenComparison();
  }

  getSelectedMonthName(): string {
    const month = this.selectedMonth();
    if (!month) return '';
    return new Date(2000, month - 1, 1).toLocaleString('en-US', { month: 'long' });
  }
}