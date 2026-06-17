import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

import { TrHeadOfficeReviewService } from '../../../../../../shared/services/tradeReceivable/tr-head-office-review.service';
import { ToastService } from '../../../../../../shared/services/componentServices/toast.service';
import { HORPmCompResModel, PMMonthlyData, PMStateWiseData } from '../../../../../../shared/models/tradeReceivable-models/headOfficeReview';
import { BreadcrumbsComponent } from '../../../../../common/breadcrumbs/breadcrumbs.component';
import { breadCrumbItems } from '../../../../../../shared/models/models';

@Component({
  selector: 'app-tr-pm-comparison',
  standalone: true,
  imports: [CommonModule, BreadcrumbsComponent],
  templateUrl: './tr-pm-comparison.component.html',
  styleUrl: './tr-pm-comparison.component.scss'
})
export class TrPmComparisonComponent implements OnInit, OnDestroy {

  isLoading = signal<boolean>(true);
  selectedDate = signal<string>(this.getCurrentMonthStr());
  pmData = signal<HORPmCompResModel | null>(null);
  dynamicMonths = signal<string[]>([]);
  selectedUnit = signal<string>('L');

  maxDate: string = this.getCurrentMonthStr();

  headOfcsrv = inject(TrHeadOfficeReviewService);
  toastSrv = inject(ToastService);
  private destroy$ = new Subject<void>();
  breadCrumbItems = signal<breadCrumbItems[]>([]);

  constructor() {
    this.breadCrumbItems.set([{ label: 'Head Office Review' }]);
  }

  ngOnInit(): void {
    this.loadData();
  }

  getCurrentMonthStr(): string {
    const today = new Date();
    today.setMonth(today.getMonth() - 1);
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  }

  onDateChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.value) return;
    this.selectedDate.set(input.value);
    this.loadData();
  }

  // ✅ No API call — just switch unit signal
  onUnitChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedUnit.set(select.value);
    this.loadData()
  }

  loadData(): void {
    if (!this.selectedDate()) return;
    this.isLoading.set(true);
    this.pmData.set(null);
    this.dynamicMonths.set([]);
    const unit = this.selectedUnit();

    const [year, month] = this.selectedDate().split('-');

    this.headOfcsrv
      ._getHOR_PMComp(month, year, unit)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: HORPmCompResModel) => {
          if (res?.stateWiseData?.length > 0) {
            this.pmData.set(res);
            // Build month labels from first state's MonthlyData
            const labels = res.stateWiseData[0].MonthlyData.map(m => m.MonthYear);
            this.dynamicMonths.set(labels);
          }
          this.isLoading.set(false);
        },
        error: () => {
          this.pmData.set(null);
          this.toastSrv.showToast('Data not found', 'error');
          this.isLoading.set(false);
        }
      });
  }

  // ─── Currency conversion ───────────────────────────────────────────────────

  // PM comparison values are counts (units), NOT currency amounts.
  // Currency selector is present but these columns don't need division.
  // If future columns carry rupee values, apply divisor here.
  // divisor = computed(() => this.selectedUnit() === 'Cr' ? 10_000_000 : 100_000);

  // ─── Data lookup helpers ───────────────────────────────────────────────────

  // Get a specific field from a state's MonthlyData for a given month label
  getVal(item: PMStateWiseData, monthLabel: string, key: keyof PMMonthlyData): number {
    const data = item.MonthlyData.find(m => m.MonthYear === monthLabel);
    return data ? (data[key] as number) : 0;
  }

  // ✅ Get grand total for a specific month column from monthlyGrandTotals
  getMonthlyGrandTotal(monthLabel: string, key: keyof PMMonthlyData): number {
    const data = this.pmData()?.monthlyGrandTotals?.find(m => m.MonthYear === monthLabel);
    return data ? (data[key] as number) : 0;
  }

  // ─── Formatters ───────────────────────────────────────────────────────────

  formatNumber(value: number): string {
    if (!value || value === 0) return '-';
    return Math.round(value).toLocaleString('en-IN');
  }

  formatMonthYearUI(value: string): string {
    if (!value) return '';
    const [y, m] = value.split('-');
    const d = new Date(Number(y), Number(m) - 1, 1);
    return d.toLocaleString('en-US', { month: 'long', year: 'numeric' });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}