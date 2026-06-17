import { breadCrumbItems } from './../../../../../../shared/models/models';
import { CommonModule } from '@angular/common';
import { Component, signal, OnInit, inject, OnDestroy, computed } from '@angular/core';
import { BreadcrumbsComponent } from '../../../../../common/breadcrumbs/breadcrumbs.component';
import { TrHeadOfficeReviewService } from '../../../../../../shared/services/tradeReceivable/tr-head-office-review.service';
import { Subject, forkJoin, of } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';
import { ProjectMarketItems, PMRemark } from '../../../../../../shared/models/tradeReceivable-models/headOfficeReview';
import { ToastService } from '../../../../../../shared/services/componentServices/toast.service';
import { FormsModule } from '@angular/forms';
declare var bootstrap: any;

@Component({
  selector: 'app-tr-project-market',
  standalone: true,
  imports: [CommonModule, BreadcrumbsComponent, FormsModule],
  templateUrl: './tr-project-market.component.html',
  styleUrl: './tr-project-market.component.scss',
})
export class TrProjectMarketComponent implements OnInit, OnDestroy {
  private projectMarketSrv = inject(TrHeadOfficeReviewService);
  private destroy$ = new Subject<void>();
  private toastSrv = inject(ToastService);
  
  selectedMonth = signal<string>(this.getPreviousMonth());
  isLoading = signal<boolean>(false);
  selectedUnit = signal<string>('L');
  
  // ===== Edit Mode & Remarks State =====
  isEditMode = signal<boolean>(false);
  isSaving = signal<boolean>(false);
  remarksMap = signal<Record<string, PMRemark>>({});
  breadCrumbItems = signal<breadCrumbItems[]>([{ label: 'Head Office Review' }]);
  projectMarketData = signal<ProjectMarketItems | null>(null);

  getPreviousMonth(): string {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  }

  monthYearLabel = computed(() => {
    const date = new Date(this.selectedMonth() + '-01');
    return date.toLocaleString('en-GB', { month: 'short', year: '2-digit' }).replace(' ', '-');
  });

  prevMonthYearLabel = computed(() => {
    const date = new Date(this.selectedMonth() + '-01');
    date.setMonth(date.getMonth() - 1);
    return date.toLocaleString('en-GB', { month: 'short', year: '2-digit' }).replace(' ', '-');
  });

  monthLabel = computed(() => {
    const date = new Date(this.selectedMonth() + '-01');
    return date.toLocaleString('en-GB', { month: 'long' });
  });

  // 👇 ADDED: Computes next month/year (e.g., 'Apr-26')
  nextMonthYearLabel = computed(() => {
    const date = new Date(this.selectedMonth() + '-01');
    date.setMonth(date.getMonth() + 1);
    return date.toLocaleString('en-GB', { month: 'short', year: '2-digit' }).replace(' ', '-');
  });

  // 👇 ADDED: Computes next full month string (e.g., 'April')
  nextMonthLabel = computed(() => {
    const date = new Date(this.selectedMonth() + '-01');
    date.setMonth(date.getMonth() + 1);
    return date.toLocaleString('en-GB', { month: 'long' });
  });

  projectMarketHeaderLabel = computed(() => {
    const date = new Date(this.selectedMonth() + '-01');
    return date.toLocaleString('en-US', { month: 'long', year: 'numeric' });
  });

  toPercent(value: number | null | undefined): string {
    if (value == null) return '0%';
    return Math.round(value * 100).toFixed(0) + '%';
  }

  getCurrentMonthYear(): string {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  }

  private getMonthYearFromDate(dateStr: string): { month: number; year: number } {
    const [yearStr, monthStr] = dateStr.split('-');
    return {
      month: Number(monthStr),
      year: Number(yearStr)
    };
  }

  onDateChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    if (value) {
      this.selectedMonth.set(value);
      this.loadProjectMarketData();
    }
  }

  onUnitChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedUnit.set(select.value);
    this.loadProjectMarketData();
  }

  ngOnInit(): void {
    this.loadProjectMarketData();
  }

  // ============ LOAD DATA ============
  loadProjectMarketData(): void {
    this.isLoading.set(true);
    this.projectMarketData.set(null);
    this.isEditMode.set(false); // Reset edit mode on reload
    
    const { month, year } = this.getMonthYearFromDate(this.selectedMonth());
    const unit = this.selectedUnit();

    // Map 'L' -> 'Lakhs' and 'Cr' -> 'Crores' strictly for the Remarks API
    const remarksUnit = unit === 'L' ? 'Lakhs' : (unit === 'Cr' ? 'Crores' : 'Rupees');

    console.log('Calling Project Market APIs with:', { month, year, unit, remarksUnit });

    forkJoin({
      mainData: this.projectMarketSrv._getProjectMarketData(month, year, unit),
      remarksData: this.projectMarketSrv._getProjectMarketRemarks(month, year, remarksUnit).pipe(
        catchError(() => of({ data: [] })) // Fallback if remarks fail
      )
    })
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: ({ mainData, remarksData }) => {
        this.projectMarketData.set(mainData);
        
        // Map remarks back to state rows
        const mappedRemarks: Record<string, PMRemark> = {};
        mainData.stateWiseData?.forEach((item: any) => {
          const existingRemark = (remarksData as any).data?.find((r: any) => r.State === item.State);
          mappedRemarks[item.State] = existingRemark || this.createEmptyRemark(item.State);
        });
        
        this.remarksMap.set(mappedRemarks);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.toastSrv.showToast(err?.message || 'Failed to fetch Project Market data', 'error');
        this.isLoading.set(false);
      }
    });
  }

  createEmptyRemark(state: string): PMRemark {
    return {
      Id: null, State: state, ZonalManager: '', RevenuePlan: 0, FarmerContri: 0, SubsidyCollectionPlan: 0,
      PlanWk1: 0, PlanWk2: 0, PlanWk3: 0, PlanWk4: 0, PlanTotal: 0,
      ActualWk1: 0, ActualWk2: 0, ActualWk3: 0, ActualWk4: 0, ActualTotal: 0,
      Remarks: '', ReviewerName: '', Status: '', HasRemark: false
    };
  }

  // ============ EDIT MODE HANDLERS ============
  toggleEdit(): void {
    this.isEditMode.set(true);
  }

  cancelEdit(): void {
    this.isEditMode.set(false);
    this.loadProjectMarketData(); // Discard changes by reloading
  }

  saveRemarks(): void {
    this.isSaving.set(true);
    const { month, year } = this.getMonthYearFromDate(this.selectedMonth());
    const unit = this.selectedUnit();

    // Map unit back to full strings for the backend
    const remarksUnit = unit === 'L' ? 'Lakhs' : (unit === 'Cr' ? 'Crores' : 'Rupees');

    const payloadArray = Object.values(this.remarksMap()).map(rm => ({
      state: String(rm.State || ''),
      revenuePlan: Number(rm.RevenuePlan) || 0,
      farmerContri: Number(rm.FarmerContri) || 0,
      subsidyCollectionPlan: Number(rm.SubsidyCollectionPlan) || 0,
      planWk1: Number(rm.PlanWk1) || 0,
      planWk2: Number(rm.PlanWk2) || 0,
      planWk3: Number(rm.PlanWk3) || 0,
      planWk4: Number(rm.PlanWk4) || 0,
      actualWk1: Number(rm.ActualWk1) || 0,
      actualWk2: Number(rm.ActualWk2) || 0,
      actualWk3: Number(rm.ActualWk3) || 0,
      actualWk4: Number(rm.ActualWk4) || 0,
      remarks: String(rm.Remarks || ''),
      reviewerName: "Admin",
      status: "In Review" 
    }));

    const payload = {
      month: Number(month), 
      year: Number(year),   
      unit: remarksUnit,
      remarks: payloadArray
    };

    this.projectMarketSrv._updateProjectMarketRemarks(payload).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        this.toastSrv.showToast('Remarks saved successfully', 'success');
        this.isSaving.set(false);
        this.isEditMode.set(false);
        this.loadProjectMarketData(); // Refresh UI with updated server data
      },
      error: (err) => {
        this.toastSrv.showToast('Failed to save remarks', 'error');
        this.isSaving.set(false);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(); // Added missing next() before complete()
    this.destroy$.complete();
  }
}