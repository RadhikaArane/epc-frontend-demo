import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbsComponent } from '../../../../../common/breadcrumbs/breadcrumbs.component';
import { breadCrumbItems } from '../../../../../../shared/models/models';
import { TrHeadOfficeReviewService } from '../../../../../../shared/services/tradeReceivable/tr-head-office-review.service';
import { Subject, takeUntil, finalize } from 'rxjs';
import { ProjectMarketAddItems } from '../../../../../../shared/models/tradeReceivable-models/headOfficeReview';
import { ToastService } from '../../../../../../shared/services/componentServices/toast.service';

@Component({
  selector: 'app-tr-project-market-aditional',
  standalone: true,
  imports: [CommonModule, BreadcrumbsComponent],
  templateUrl: './tr-project-market-aditional.component.html',
  styleUrl: './tr-project-market-aditional.component.scss',
})
export class TrProjectMarketAditionalComponent implements OnInit, OnDestroy {
  
  private projectMarketAddSrv = inject(TrHeadOfficeReviewService);
  private toastSrv = inject(ToastService);
  private destroy$ = new Subject<void>();

  // Breadcrumb Signal
  breadCrumbItems = signal<breadCrumbItems[]>([]);
  
  // Data Signal
  projectMarketAddData = signal<ProjectMarketAddItems | null>(null);

  // Loading Signal
  isLoading = signal<boolean>(false);

  selectedUnit = signal<string>('L');

  // Date Selection Signal (YYYY-MM)
  selectedMonth = signal<string>(this.getPreviousMonth());
  
  getPreviousMonth(): string {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  }

  // Computed Labels for Dynamic Headers
  monthYearLabel = computed(() => {
    const date = new Date(this.selectedMonth() + '-01');
    return date
      .toLocaleString('en-GB', { month: 'short', year: '2-digit' })
      .replace(' ', '-');
  });

  // 👇 ADDED: Computes next month/year (e.g., 'Apr-26')
  nextMonthYearLabel = computed(() => {
    const date = new Date(this.selectedMonth() + '-01');
    date.setMonth(date.getMonth() + 1);
    return date.toLocaleString('en-GB', { month: 'short', year: '2-digit' }).replace(' ', '-');
  });

  constructor() {
    this.breadCrumbItems.set([{ label: 'Head Office Review' }]);
  }

  ngOnInit(): void {
    this.loadProjectMarketAddData();
  }

  onDateChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    if (value) {
      this.selectedMonth.set(value);
      this.loadProjectMarketAddData();
    }
  }

   onUnitChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedUnit.set(select.value);
    this.loadProjectMarketAddData();
  }

  loadProjectMarketAddData(): void {
    this.isLoading.set(true);
    this.projectMarketAddData.set(null)
    const unit = this.selectedUnit();  
    const [year, month] = this.selectedMonth().split('-').map(Number);

    this.projectMarketAddSrv
      ._getProjectMarketAdditional(month, year, unit)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.isLoading.set(false)) // Ensure loading stops on success or error
      )
      .subscribe({
        next: (response) => {
          this.projectMarketAddData.set(response);
        },
        error: (err) => {
          this.toastSrv.showToast(
            err?.message || 'Failed to fetch Project Market Additional data',
            'error'
          );
        },
      });
  }

  projectMarketAditionalHeaderLabel = computed(() => {
    const date = new Date(this.selectedMonth() + '-01'); // YYYY-MM-01
    return date.toLocaleString('en-US', { month: 'long', year: 'numeric' }); 
  });

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}