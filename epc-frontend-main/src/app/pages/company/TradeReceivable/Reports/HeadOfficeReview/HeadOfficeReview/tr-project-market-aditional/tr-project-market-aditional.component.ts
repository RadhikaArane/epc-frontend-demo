import {
  Component,
  computed,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbsComponent } from '../../../../../../common/breadcrumbs/breadcrumbs.component';
import { TrHeadOfficeReviewService } from '../Service/tr-head-office-review.service';
import { ToastService } from '../../../../../../../shared/services/componentServices/toast.service';
import { Subject, takeUntil } from 'rxjs';
import { breadCrumbItems } from '../../../../../../../shared/models/models';
import { ProjectMarketAddItems } from '../Model/headOfficeReview';

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

  // ADDED: Breadcrumb Signal
  breadCrumbItems = signal<breadCrumbItems[]>([]);
  projectMarketAddData = signal<ProjectMarketAddItems | null>(null);

  // Date Selection Signal (YYYY-MM)
  selectedMonth = signal<string>(new Date().toISOString().slice(0, 7));

  // Computed Labels for Dynamic Headers
  monthYearLabel = computed(() => {
    const date = new Date(this.selectedMonth() + '-01');
    return date
      .toLocaleString('en-GB', { month: 'short', year: '2-digit' })
      .replace(' ', '-');
  });

  constructor() {
    this.breadCrumbItems.set([{ label: 'Project Market Additional' }]);
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

  loadProjectMarketAddData(): void {
    console.log('Fetching Project Market Additional Data...');

    this.projectMarketAddSrv
      ._getProject_Market_Additional()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          // console.log('Project Market Additional Data Received:', response);
          this.projectMarketAddData.set(response);
        },
        error: (err) => {
          const errorMessage =
            err?.message || 'Failed to fetch Project Market Additional data';
          this.toastSrv.showToast(errorMessage, 'error');
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
