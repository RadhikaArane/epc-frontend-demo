import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';

// Models
import { breadCrumbItems } from '../../../../../../shared/models/models';
import { CustomerWiseDaum, Totals } from '../../../../../../shared/models/tradeReceivable-models/headOfficeReview';

// Components
import { BreadcrumbsComponent } from '../../../../../common/breadcrumbs/breadcrumbs.component';

// Services
import { Subject, finalize } from 'rxjs';
import { ToastService } from '../../../../../../shared/services/componentServices/toast.service';
import { TrHeadOfficeReviewService } from '../../../../../../shared/services/tradeReceivable/tr-head-office-review.service';

@Component({
  selector: 'app-tr-open-additional',
  standalone: true,
  imports: [CommonModule, DecimalPipe, BreadcrumbsComponent],
  templateUrl: './tr-open-additional.component.html',
  styleUrl: './tr-open-additional.component.scss'
})
export class TrOpenAdditionalComponent implements OnInit {

  headOfcsrv = inject(TrHeadOfficeReviewService);
  toastSrv = inject(ToastService);
  private destroy$ = new Subject<void>();

  // --- Signals ---

  // Breadcrumbs
  breadCrumbItems = signal<breadCrumbItems[]>([]);

  // Date Filter: Initialize with current YYYY-MM
  // selectedMonth = signal<string>(new Date().toISOString().slice(0, 7));// testing purpose *************

  // testing purpose for ******************
  selectedMonth = signal<string>(this.getPreviousMonth());
  getPreviousMonth(): string {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  }

  // Loading State
  isLoading = signal<boolean>(false);

  // Data
  openAdditionalList = signal<CustomerWiseDaum[]>([]);
  openAdditionalTotals = signal<Totals | null>(null);
  selectedUnit = signal<string>('L');
  selectedState = signal<string>('Andhra Pradesh');
  salesStates = [
    // 'All',
    'Andhra Pradesh',
    'Gujarat',
    'Tamil Nadu',
    'Karnataka',
    'Chhattisgarh',
    'Maharashtra',
    'Rajasthan',
    'Telangana',
    'Madhya Pradesh',
    'Uttar Pradesh',
    'Kerala',
    'West Bengal'
  ];

  // --- Computed Headers ---
  monthYearLabel = computed(() => {
    const date = new Date(this.selectedMonth() + '-01');
    return date.toLocaleString('en-GB', { month: 'short', year: '2-digit' }).replace(' ', '-');
  });

  constructor() {
    this.breadCrumbItems.set([{ label: 'Head Office Review' }]);
  }

  ngOnInit(): void {
    this.loadOpenAdditional();
  }

  // Helper to parse "2025-09" -> { month: 9, year: 2025 }
  private getMonthYearFromDate(dateStr: string): { month: number; year: number } {
    const [yearStr, monthStr] = dateStr.split('-');
    return {
      month: Number(monthStr),
      year: Number(yearStr)
    };
  }

  onStateChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedState.set(value);
    this.loadOpenAdditional(); 
  }


  onUnitChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedUnit.set(select.value);
    this.loadOpenAdditional();
    // /const unit = this.selectedUnit();   
  }

  loadOpenAdditional(): void {
    this.isLoading.set(true);

    const state = this.selectedState();

    const { month, year } = this.getMonthYearFromDate(this.selectedMonth());
    const unit = this.selectedUnit();

    this.headOfcsrv
      ._getOpenAdditional(month, year, state, unit)
      .pipe(
        finalize(() => this.isLoading.set(false))
      )
      .subscribe({
        next: (res: any) => {
          this.openAdditionalList.set(res?.customerWiseData || []);
          this.openAdditionalTotals.set(res?.totals || null);
        },
        error: (err) => {
          console.error(err);
          this.toastSrv.showToast('Failed to load Open Additional', 'error');
        }
      });
  }

  openAditionalHeaderLabel = computed(() => {
    const date = new Date(this.selectedMonth() + '-01'); // YYYY-MM-01
    return date.toLocaleString('en-US', { month: 'long', year: 'numeric' });
    // "February 2026"
  });

  onDateChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = target.value; // Returns YYYY-MM

    if (value) {
      this.selectedMonth.set(value);
      this.loadOpenAdditional();
    }
  }
}