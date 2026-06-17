import { Component, inject, signal, DestroyRef, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UrUnrecognisedInventoryService } from '../../../../../../shared/services/unrecognisedInvoice/ur-unrecognised-inventory.service';
import { AllStateTotal, PanIndiaSummaryResponse, StateData } from '../../../../../../shared/models/unrecognisedInvoice-models/Inventory'; 
import { JwtService } from '../../../../../../shared/services/common/jwt.service';
import { ToastService } from '../../../../../../shared/services/componentServices/toast.service';

@Component({
  selector: 'app-ui-pan-india-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ui-pan-india-summary.component.html',
  styleUrl: './ui-pan-india-summary.component.scss'
})
export class UiPanIndiaSummaryComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  private urInventorySrv = inject(UrUnrecognisedInventoryService);
  private router = inject(Router);
  private jwtSrv = inject(JwtService);
  private toastSrv = inject(ToastService);

  isLoading = signal<boolean>(true);
  error = signal<string | null>(null);
  states = signal<StateData[]>([]);
  allStateTotals = signal<AllStateTotal[]>([]);
  collapsedColumns = signal<Set<string>>(new Set());

  selectedDate = signal<string>('');

  // onDateChange(event: any): void {
  //   const selectedDate = event.target.value;
  //   this.selectedDate.set(selectedDate);  // Save selected date
  //   this.loadInventoryPanIndiaSummary(selectedDate);  // Reload data with the selected date
  // }

  onDateChange(event: any): void {
  const selectedDate = event.target.value;
  this.selectedDate.set(selectedDate);  // Save selected date 
  this.loadInventoryPanIndiaSummary(selectedDate);  // Reload data with the selected date
}

  bucketColumns = [
    { key: '< 30 days', label: '< 30 days<br>(In Lakhs)' },
    { key: '30 - 60 days', label: '30 - 60 days<br>(In Lakhs)' },
    { key: '60 - 90 days', label: '60 - 90 days<br>(In Lakhs)' },
    { key: '90 - 150 days', label: '90 - 150 days<br>(In Lakhs)' },
    { key: '150 - 180 days', label: '150 - 180 days<br>(In Lakhs)' },
    { key: '180 - 365 days', label: '180 - 365 days<br>(In Lakhs)' },
    { key: '365 - 730 days', label: '365 - 730 days<br>(In Lakhs)' },
    { key: '730 - 1095 days', label: '730 - 1095 days<br>(In Lakhs)' }
  ];

  totalsMap = computed(() => {
    const map = new Map<string, number>();
    this.allStateTotals().forEach(total => map.set(total.AgingBucket, total.Amount));
    return map;
  });

  stateAmountsMap = computed(() => {
    const map = new Map<string, Map<string, number>>();
    this.states().forEach(state => {
      const bucketMap = new Map<string, number>();
      state.AgingData.forEach(aging => bucketMap.set(aging.AgingBucket, aging.Amount));
      map.set(state.State, bucketMap);
    });
    return map;
  });

  ngOnInit(): void { this.loadInventoryPanIndiaSummary(); }

  loadInventoryPanIndiaSummary(selectedDate?: string): void {
    this.isLoading.set(true);
    this.urInventorySrv._getInventoryPanIndiaSummary(selectedDate || '')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.states.set(response.States || []);
          this.allStateTotals.set(response.AllStateTotal || []);
          this.isLoading.set(false);
        },
        error: (err) => {
          this.toastSrv.showToast('Error loading data', 'error');
          this.isLoading.set(false);
        }
      });
  }

  getAmount(state: StateData, bucketKey: string): number {
    return this.stateAmountsMap().get(state.State)?.get(bucketKey) || 0;
  }

  getTotalAmount(bucketKey: string): number {
    return this.totalsMap().get(bucketKey) || 0;
  }

  onBucketClick(state: StateData, bucketKey: string,): void {
    const date = this.selectedDate();
    const navigationData = { state: state.State, ageing: bucketKey, tab: 'pan', date: date};
    const encryptedToken = this.jwtSrv.encrypt(JSON.stringify(navigationData));
    this.router.navigate(['/urPanIndiaBucketSummaryComponent'], { 
      queryParams: { token: encodeURIComponent(encryptedToken) } 
    });
  }

  toggleColumn(columnName: string): void {
    const collapsed = new Set(this.collapsedColumns());
    collapsed.has(columnName) ? collapsed.delete(columnName) : collapsed.add(columnName);
    this.collapsedColumns.set(collapsed);
  }

  isColumnCollapsed(columnName: string): boolean { return this.collapsedColumns().has(columnName); }
  trackByState(index: number, state: StateData): string { return state.State; }
}