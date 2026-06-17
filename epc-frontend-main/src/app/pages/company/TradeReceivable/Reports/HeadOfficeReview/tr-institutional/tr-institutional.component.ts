import { Component, inject, signal, OnInit, computed, OnDestroy } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';

// Models
import { breadCrumbItems } from '../../../../../../shared/models/models';
import { Institutional, CustomerDaum, GrandTotals } from '../../../../../../shared/models/tradeReceivable-models/headOfficeReview';

// Components
import { BreadcrumbsComponent } from '../../../../../common/breadcrumbs/breadcrumbs.component';

// Services
import { TrHeadOfficeReviewService } from '../../../../../../shared/services/tradeReceivable/tr-head-office-review.service';
import { ToastService } from '../../../../../../shared/services/componentServices/toast.service';
import { Subject, finalize, takeUntil } from 'rxjs';

@Component({
  selector: 'app-tr-institutional',
  standalone: true,
  imports: [CommonModule, DecimalPipe, BreadcrumbsComponent],
  templateUrl: './tr-institutional.component.html',
  styleUrl: './tr-institutional.component.scss'
})
export class TrInstitutionalComponent implements OnInit, OnDestroy {

  headOfcsrv = inject(TrHeadOfficeReviewService);
  toastSrv = inject(ToastService);
  private destroy$ = new Subject<void>();

  // --- Signals ---
  
  // Breadcrumbs
  breadCrumbItems = signal<breadCrumbItems[]>([]);

  selectedUnit = signal<string>('L');

  // Date Filter: Initialize with current YYYY-MM
  // selectedMonth = signal<string>(new Date().toISOString().slice(0, 7));// ********* testing purpose 
 
  // testing purpose********************
  selectedMonth = signal<string>(this.getPreviousMonth());
  getPreviousMonth(): string {
  const d = new Date();
  d.setMonth(d.getMonth() - 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
} 
 
  // Data Signals
  institutionalData = signal<Institutional | null>(null);
  customerList = signal<CustomerDaum[]>([]);
  grandTotals = signal<GrandTotals | null>(null);

  // Loading State
  isLoading = signal<boolean>(false);

  // Computed Header
  monthYearLabel = computed(() => {
    const date = new Date(this.selectedMonth() + '-01');
    return date.toLocaleString('en-GB', { month: 'short', year: '2-digit' }).replace(' ', '-');
  });

  constructor() {
    this.breadCrumbItems.set([{ label: 'Head Office Review' }]);
  }

  ngOnInit(): void {
    this.loadInstitutional();
  }

    onUnitChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedUnit.set(select.value);
    this.loadInstitutional();
    // /
  }

  // Helper to parse "2025-09" -> { month: 9, year: 2025 }
  private getMonthYearFromDate(dateStr: string): { month: number; year: number } {
    const [yearStr, monthStr] = dateStr.split('-');
    return {
      month: Number(monthStr),
      year: Number(yearStr)
    };
  }

  loadInstitutional(): void {
    this.isLoading.set(true);
    
    const { month, year } = this.getMonthYearFromDate(this.selectedMonth());
    const unit = this.selectedUnit();   

    this.headOfcsrv
      ._getInstitutionalMarket(month, year, unit)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.isLoading.set(false))
      )
      .subscribe({
        next: (res) => {
          this.institutionalData.set(res);
          this.customerList.set(res?.customerData || []);
          this.grandTotals.set(res?.grandTotals || null);
        },
        error: (err) => {
          console.error('❌ API ERROR:', err);
          this.toastSrv.showToast('Failed to load Institutional data', 'error');
        }
      });
  }

  institutionalHeaderLabel = computed(() => {
  const date = new Date(this.selectedMonth() + '-01'); // YYYY-MM-01
  return date.toLocaleString('en-US', { month: 'long', year: 'numeric' }); 
  // "February 2026"
});

  onDateChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = target.value; // YYYY-MM

    if (value) {
      this.selectedMonth.set(value);
      this.loadInstitutional();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}