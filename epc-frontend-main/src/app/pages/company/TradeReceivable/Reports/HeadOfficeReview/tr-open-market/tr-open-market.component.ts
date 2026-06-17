import { Component, inject, signal, OnInit, computed, OnDestroy } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { breadCrumbItems } from './../../../../../../shared/models/models';
import { CurrentMonthTotals, ExportsTotals, InstitutionalTotals, OpenMarketItems, PreviousMonthTotals, ProjectBusinessTotals, StateWiseDaum, Totals, OMRemark } from '../../../../../../shared/models/tradeReceivable-models/headOfficeReview';
import { BreadcrumbsComponent } from '../../../../../common/breadcrumbs/breadcrumbs.component';
import { TrHeadOfficeReviewService } from '../../../../../../shared/services/tradeReceivable/tr-head-office-review.service';
import { ToastService } from '../../../../../../shared/services/componentServices/toast.service';
import { Subject, forkJoin, of } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-tr-open-market',
  standalone: true,
  imports: [CommonModule, DecimalPipe, BreadcrumbsComponent, FormsModule],
  templateUrl: './tr-open-market.component.html',
  styleUrl: './tr-open-market.component.scss',
})
export class TrOpenMarketComponent implements OnInit, OnDestroy {

  private headOfcsrv = inject(TrHeadOfficeReviewService);
  private toastSrv = inject(ToastService);
  private destroy$ = new Subject<void>();

  // --- Signals ---
  breadCrumbItems = signal<breadCrumbItems[]>([{ label: 'Head Office Review' }]);
  selectedMonth = signal<string>(this.getPreviousMonth());
  isLoading = signal<boolean>(false);
  selectedUnit = signal<string>('L');

  // ===== Edit Mode & Remarks State =====
  isEditMode = signal<boolean>(false);
  isSaving = signal<boolean>(false);
  remarksMap = signal<Record<string, OMRemark>>({});

  // Data Signals
  OpenMarketData = signal<OpenMarketItems | null>(null);
  openMarketList = signal<StateWiseDaum[]>([]);
  currentTotals = signal<CurrentMonthTotals | null>(null);
  previousTotals = signal<PreviousMonthTotals | null>(null);
  exportsTotals = signal<ExportsTotals | null>(null);
  institutionalTotals = signal<InstitutionalTotals | null>(null);
  projectBusinessTotals = signal<ProjectBusinessTotals | null>(null);
  totals = signal<Totals | null>(null);

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

  monthLabel = computed(() => {
    const date = new Date(this.selectedMonth() + '-01');
    return date.toLocaleString('en-GB', { month: 'long' });
  });

  nextMonthYearLabel = computed(() => {
    const date = new Date(this.selectedMonth() + '-01');
    date.setMonth(date.getMonth() + 1);
    return date.toLocaleString('en-GB', { month: 'short', year: '2-digit' }).replace(' ', '-');
  });

  nextMonthLabel = computed(() => {
    const date = new Date(this.selectedMonth() + '-01');
    date.setMonth(date.getMonth() + 1);
    return date.toLocaleString('en-GB', { month: 'long' });
  });

  openMarketHeaderLabel = computed(() => {
    const date = new Date(this.selectedMonth() + '-01'); 
    return date.toLocaleString('en-US', { month: 'long', year: 'numeric' });
  });

  ngOnInit(): void {
    this.loadOpenMarket();
  }

  toPercent(value: number | null | undefined): string {
    if (value == null) return '0.00%';
    return (value * 100).toFixed(2) + '%';
  }

  private getMonthYearFromDate(dateStr: string): { month: number; year: number } {
    const [yearStr, monthStr] = dateStr.split('-');
    return { month: Number(monthStr), year: Number(yearStr) };
  }

  onUnitChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedUnit.set(select.value);
    this.loadOpenMarket();
  }

  onDateChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.value) {
      this.selectedMonth.set(target.value);
      this.loadOpenMarket();
    }
  }

  // ============ LOAD DATA ============
  loadOpenMarket(): void {
    this.isLoading.set(true);
    this.OpenMarketData.set(null);
    this.isEditMode.set(false);

    const { month, year } = this.getMonthYearFromDate(this.selectedMonth());
    const unit = this.selectedUnit();
    
    // API unit translation
    const remarksUnit = unit === 'L' ? 'Lakhs' : (unit === 'Cr' ? 'Crores' : 'Rupees');

    forkJoin({
      mainData: this.headOfcsrv._getOpenMarketData(month, year, unit),
      remarksData: this.headOfcsrv._getOpenMarketRemarks(month, year, remarksUnit).pipe(
        catchError(() => of([]))
      )
    })
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: ({ mainData, remarksData }) => {
        this.OpenMarketData.set(mainData);
        this.openMarketList.set(mainData.stateWiseData || []);
        this.currentTotals.set(mainData.currentMonthTotals || null);
        this.previousTotals.set(mainData.previousMonthTotals || null);
        this.exportsTotals.set(mainData.exportsTotals || null);
        this.institutionalTotals.set(mainData.institutionalTotals || null);
        this.projectBusinessTotals.set(mainData.projectBusinessTotals || null);
        this.totals.set(mainData.totals || null);

        const remarksList = Array.isArray(remarksData) ? remarksData : (remarksData as any).data || [];

        // Map remarks to states
        const mappedRemarks: Record<string, OMRemark> = {};
        mainData.stateWiseData?.forEach((item: any) => {
          const existingRemark = remarksList.find((r: any) => r.State === item.State);
          mappedRemarks[item.State] = existingRemark || this.createEmptyRemark(item.State);
        });
        
        this.remarksMap.set(mappedRemarks);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.toastSrv.showToast('Failed to load Open Market', 'error');
        this.isLoading.set(false);
      }
    });
  }

  createEmptyRemark(state: string): OMRemark {
    return {
      Id: null, State: state, ZonalManager: '', RevenuePlan: 0, CollectionPlan: 0,
      PlanWk1: 0, PlanWk2: 0, PlanWk3: 0, PlanWk4: 0, PlanWk5: 0, PlanTotal: 0,
      ActualWk1: 0, ActualWk2: 0, ActualWk3: 0, ActualWk4: 0, ActualTotal: 0,
      Remarks: '', ReviewerName: '', Status: '', HasRemark: false
    };
  }

  // ============ EDIT MODE & SAVE HANDLERS ============
  toggleEdit(): void {
    this.isEditMode.set(true);
  }

  cancelEdit(): void {
    this.isEditMode.set(false);
    this.loadOpenMarket(); // Discard changes by reloading
  }

  saveRemarks(): void {
    this.isSaving.set(true);
    const { month, year } = this.getMonthYearFromDate(this.selectedMonth());
    const unit = this.selectedUnit();
    const remarksUnit = unit === 'L' ? 'Lakhs' : (unit === 'Cr' ? 'Crores' : 'Rupees');
    
    const payloadArray = Object.values(this.remarksMap()).map(rm => ({
      state: String(rm.State || ''),
      revenuePlan: Number(rm.RevenuePlan) || 0,
      collectionPlan: Number(rm.CollectionPlan) || 0,
      planWk1: Number(rm.PlanWk1) || 0,
      planWk2: Number(rm.PlanWk2) || 0,
      planWk3: Number(rm.PlanWk3) || 0,
      planWk4: Number(rm.PlanWk4) || 0,
      planWk5: Number(rm.PlanWk5) || 0,
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

    console.log("Sending Payload:", payload);

    this.headOfcsrv._updateOpenMarketRemarks(payload).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        this.toastSrv.showToast('Remarks saved successfully', 'success');
        this.isSaving.set(false);
        this.isEditMode.set(false);
        this.loadOpenMarket(); 
      },
      error: (err) => {
        this.toastSrv.showToast('Failed to save remarks', 'error');
        this.isSaving.set(false);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}