import { CommonModule } from "@angular/common";
import { BreadcrumbsComponent } from "../../../../../../common/breadcrumbs/breadcrumbs.component";
import { Component, computed, inject, OnDestroy, OnInit, signal } from "@angular/core";
import { TrHeadOfficeReviewService } from "../Service/tr-head-office-review.service";
import { Subject, takeUntil } from "rxjs";
import { ToastService } from "../../../../../../../shared/services/componentServices/toast.service";
import { breadCrumbItems } from "../../../../../../../shared/models/models";
import { ProjectMarketItems } from "../Model/headOfficeReview";


@Component({
  selector: 'app-tr-project-market',
  standalone: true,
  imports: [CommonModule, BreadcrumbsComponent],
  templateUrl: './tr-project-market.component.html',
  styleUrl: './tr-project-market.component.scss',
})
export class TrProjectMarketComponent implements OnInit, OnDestroy {

  private projectMarketSrv = inject(TrHeadOfficeReviewService);  
  private destroy$ = new Subject<void>();
  private toastSrv = inject(ToastService);

  // ADDED: Signal for the Month-Year Filter
  selectedMonth = signal<string>(new Date().toISOString().slice(0,7));  //YYYY-MM

  // ADDED: Computed Values for headers
  monthYearLabel = computed(() => {
    const date = new Date(this.selectedMonth() + '-01');
    return date.toLocaleString('en-GB', { month: 'short', year: '2-digit' }).replace(' ','-');
  });

  // Return just the month 
  monthLabel = computed(() => {
    const date = new Date(this.selectedMonth() + '-01');
    return date.toLocaleString('en-GB', { month: 'long' });
  });

  // UPDATED: Method to handle date change
  onDateChange(event: Event): void{
    const value = (event.target as HTMLInputElement).value;
    if (value) {
      this.selectedMonth.set(value);
      this.loadProjectMarketData();
    }
  }

  // ADDED: Breadcrumb Signal
  breadCrumbItems = signal<breadCrumbItems[]>([]);

  projectMarketData = signal<ProjectMarketItems | null>(null);

  constructor() {
    this.breadCrumbItems.set([{ label: 'Project Market' }]);
  }

  ngOnInit(): void {
    this.loadProjectMarketData();
  }

  loadProjectMarketData(): void {
    console.log('Fetching Project Market Data...');

    this.projectMarketSrv
      ._getProject_Market()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          // console.log('Project Market Data Received:', response);
          this.projectMarketData.set(response);
        },
        error: (err) => {
          const errorMessage = err?.message || 'Failed to fetch Project Market data';
          this.toastSrv.showToast(errorMessage, 'error');

          //Reset Data error
          // this.projectMarketData.set(null);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
