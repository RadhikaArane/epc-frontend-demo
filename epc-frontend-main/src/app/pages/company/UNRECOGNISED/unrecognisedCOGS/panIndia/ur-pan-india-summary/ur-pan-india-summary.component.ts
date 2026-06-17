import { Component, inject, signal, OnInit, OnDestroy, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { UrUnrecognisedCOGSService } from '../../../../../../shared/services/unrecognisedInvoice/ur-unrecognised-cogs.service';
import { ToastService } from '../../../../../../shared/services/componentServices/toast.service';
import { JwtService } from '../../../../../../shared/services/common/jwt.service';
import { AllStateTotal, COGSPanIndiaSummaryResponse, StateData } from '../../../../../../shared/models/unrecognisedInvoice-models/inventoryCOGS';

interface DisplayStateItem {
  state: string;
  lessThan30: number;
  days30to60: number;
  days60to90: number;
  days90to150: number;
  days150to180: number;
  days180to365: number;
  days365to730: number;
  days730to1095: number;
  stateTotal: number;
  [key: string]: string | number;
}

interface DisplayGrandTotals {
  lessThan30: number;
  days30to60: number;
  days60to90: number;
  days90to150: number;
  days150to180: number;
  days180to365: number;
  days365to730: number;
  days730to1095: number;
  grandTotal: number;
  [key: string]: number;
}

@Component({
  selector: 'app-ur-pan-india-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ur-pan-india-summary.component.html',
  styleUrl: './ur-pan-india-summary.component.scss'
})
export class UrPanIndiaSummaryComponent implements OnInit, OnDestroy {
  private urCOGSSrv = inject(UrUnrecognisedCOGSService);
  private router = inject(Router);
  private jwtSrv = inject(JwtService);
  private toastSrv = inject(ToastService);
  private destroy$ = new Subject<void>();

  isLoading = signal<boolean>(true);
  error = signal<string | null>(null);

  selectedDate = signal<string>('');

  onDateChange(event: any): void {
    const selectedDate = event.target.value;
    this.selectedDate.set(selectedDate);  // Save selected date
    this.loadCOGSPanIndiaSummary(selectedDate);  // Reload data with the selected date
  }

  private rawStates = signal<StateData[]>([]);
  private rawAllStateTotal = signal<AllStateTotal[]>([]);
  totalStates = signal<number>(0);

  displayStates = computed<DisplayStateItem[]>(() => {
    return this.rawStates().map(state => {
      const agingData = state.AgingData;
      const findAmt = (name: string) => agingData.find(a => a.AgingBucket === name)?.Amount || 0;
      
      return {
        state: state.State,
        lessThan30: findAmt('< 30 days'),
        days30to60: findAmt('30 - 60 days'),
        days60to90: findAmt('60 - 90 days'),
        days90to150: findAmt('90 - 150 days'),
        days150to180: findAmt('150 - 180 days'),
        days180to365: findAmt('180 - 365 days'),
        days365to730: findAmt('365 - 730 days'),
        days730to1095: findAmt('730 - 1095 days'),
        stateTotal: state.StateTotal
      };
    });
  });

  displayGrandTotals = computed<DisplayGrandTotals>(() => {
    const totals = this.rawAllStateTotal();
    const findAmt = (name: string) => totals.find(a => a.AgingBucket === name)?.Amount || 0;
    
    return {
      lessThan30: findAmt('< 30 days'),
      days30to60: findAmt('30 - 60 days'),
      days60to90: findAmt('60 - 90 days'),
      days90to150: findAmt('90 - 150 days'),
      days150to180: findAmt('150 - 180 days'),
      days180to365: findAmt('180 - 365 days'),
      days365to730: findAmt('365 - 730 days'),
      days730to1095: findAmt('730 - 1095 days'),
      grandTotal: findAmt('Total')
    };
  });

  // Collapse/Expand state
  collapsedColumns = signal<Set<string>>(new Set());

  // Column configuration
  bucketColumns = [
    { key: 'lessThan30', label: '< 30 days<br><span class="small text-white d-block" style="opacity: 0.9;">(In Lakhs)</span>', originalKey: '< 30 Days', collapsible: true },
    { key: 'days30to60', label: '30 - 60 days<br><span class="small text-white d-block" style="opacity: 0.9;">(In Lakhs)</span>', originalKey: '30 - 60 Days', collapsible: true },
    { key: 'days60to90', label: '60 - 90 days<br><span class="small text-white d-block" style="opacity: 0.9;">(In Lakhs)</span>', originalKey: '60 - 90 Days', collapsible: true },
    { key: 'days90to150', label: '90 - 150 days<br><span class="small text-white d-block" style="opacity: 0.9;">(In Lakhs)</span>', originalKey: '90 - 150 Days', collapsible: true },
    { key: 'days150to180', label: '150 - 180 days<br><span class="small text-white d-block" style="opacity: 0.9;">(In Lakhs)</span>', originalKey: '150 - 180 Days', collapsible: true },
    { key: 'days180to365', label: '180 - 365 days<br><span class="small text-white d-block" style="opacity: 0.9;">(In Lakhs)</span>', originalKey: '180 - 365 Days', collapsible: true },
    { key: 'days365to730', label: '365 - 730 days<br><span class="small text-white d-block" style="opacity: 0.9;">(In Lakhs)</span>', originalKey: '365 - 730 Days', collapsible: true },
    { key: 'days730to1095', label: '730 - 1095 days<br><span class="small text-white d-block" style="opacity: 0.9;">(In Lakhs)</span>', originalKey: '730 - 1095 Days', collapsible: true }
  ];

  ngOnInit(): void {
    this.loadCOGSPanIndiaSummary();
  }

  loadCOGSPanIndiaSummary(selectedDate?: string): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.urCOGSSrv._getCOGSPanIndiaSummary(selectedDate || '')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: COGSPanIndiaSummaryResponse) => {
          console.log('COGS Pan India Summary response:', response);

          this.rawStates.set(response.States || []);
          this.rawAllStateTotal.set(response.AllStateTotal || []);
          this.totalStates.set(response.TotalStates || 0);

          this.isLoading.set(false);
        },
        error: (err: any) => {
          console.error('Error loading COGS Pan India Summary:', err);
          this.error.set('Failed to load data. Please try again.');
          this.toastSrv.showToast(err?.message || 'Error loading data', 'error');
          this.isLoading.set(false);
        }
      });
  }

  onBucketClick(state: any, originalBucketKey: string): void {
    const date = this.selectedDate();
    console.log('Navigating to COGS pan-wise bucket for:', state.state, 'Ageing:', originalBucketKey || 'All Aging');

    const navigationData = {
      state: state.state,
      ageing: originalBucketKey, // Passes '' for Total which binds to 'All Aging'
      tab: 'pan',
      date: date
    };

    const encryptedToken = this.jwtSrv.encrypt(JSON.stringify(navigationData));
    const encodedToken = encodeURIComponent(encryptedToken);

    this.router.navigate(['/urCogsPanWiseBucketComponent'], {
      queryParams: { token: encodedToken }
    });
  }

  // ==================== COLLAPSE/EXPAND METHODS ====================

  toggleColumn(columnKey: string): void {
    const collapsed = new Set(this.collapsedColumns());
    collapsed.has(columnKey) ? collapsed.delete(columnKey) : collapsed.add(columnKey);
    this.collapsedColumns.set(collapsed);
  }

  isColumnCollapsed(columnKey: string): boolean {
    return this.collapsedColumns().has(columnKey);
  } 

  getCollapsedTooltip(state: DisplayStateItem, bucket: any): string {
    const value = state[bucket.key] as number;
    const formatted = '₹' + value.toLocaleString('en-IN', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
    return `${bucket.originalKey} (In Lakhs): ${formatted} (Click to expand)`;
  }

  getCollapsedTooltipTotal(bucket: any): string {
    const value = this.displayGrandTotals()[bucket.key];
    const formatted = '₹' + value.toLocaleString('en-IN', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
    return `${bucket.originalKey} (In Lakhs): ${formatted} (Click to expand)`;
  }

  trackByState(index: number, state: DisplayStateItem): string {
    return state.state;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}