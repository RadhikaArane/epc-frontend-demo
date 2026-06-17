import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TrManageSalesService } from '../../../../../shared/services/tradeReceivable/tr-manage-sales.service';
import { ToastService } from '../../../../../shared/services/componentServices/toast.service';
import { BreadcrumbsComponent } from '../../../../common/breadcrumbs/breadcrumbs.component';
import { EntriesResponse, EntryItem, GroupedEntry } from '../../../../../shared/models/tradeReceivable-models/trManageSales';


@Component({
  selector: 'app-t-entries',
  standalone: true,
  imports: [CommonModule, FormsModule, BreadcrumbsComponent],
  templateUrl: './t-entries.component.html',
  styleUrl: './t-entries.component.scss'
})
export class TEntriesComponent implements OnInit, OnDestroy {

  breadCrumbItems = signal([
    { label: 'Manage Revenue Recognition' },
    { label: 'Entries' }
  ]);

  // Services
  manageSalesSrv = inject(TrManageSalesService);
  toastSrv = inject(ToastService);

  // State
  loading = signal<boolean>(false);
  groupedEntries = signal<GroupedEntry[]>([]);
  selectedMonth = signal<string>('');
  selectedYear = signal<number>(0);
  selectedMonthYear = signal<string>('');
  docNo = signal<string>('');
  docType = signal<string>('');
  totalDr = signal<number>(0);
  totalCr = signal<number>(0);

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.initializeDefaultMonthYear();
    this.loadEntriesData();
  }

  // ============ INITIALIZE DEFAULT MONTH-YEAR ============

  initializeDefaultMonthYear(): void {
    const today = new Date();
    // Go to 1st of current month, subtract 1 month -> lands in last month safely
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    
    // Extract the pieces we need
    const year = lastMonth.getFullYear();
    const monthNum = String(lastMonth.getMonth() + 1).padStart(2, '0');
    const monthName = lastMonth.toLocaleString('en-US', { month: 'long' });

    // Sync all three signals at once
    this.selectedMonthYear.set(`${year}-${monthNum}`); 
    this.selectedMonth.set(monthName);                 
    this.selectedYear.set(year);                       
  }

  // ============ MONTH-YEAR FILTER CHANGE ============

  onMonthYearChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    if (!value) return;

    this.selectedMonthYear.set(value);

    const [year, monthNum] = value.split('-');
    const monthIndex = parseInt(monthNum, 10) - 1;
    const monthName = new Date(parseInt(year), monthIndex).toLocaleString('en-US', { month: 'long' });

    this.selectedMonth.set(monthName);
    this.selectedYear.set(parseInt(year, 10));

    this.loadEntriesData();
  }

  private formatDate(value: string): string {
  return value.split(' ')[0];
}

  // ============ LOAD ENTRIES DATA ============

  loadEntriesData(): void {
    if (!this.selectedMonth() || !this.selectedYear()) {
      this.toastSrv.showToast('Please select month and year', 'error');
      return;
    }

    this.loading.set(true);

    this.manageSalesSrv._getManageSalesEntries(this.selectedMonth(), this.selectedYear())
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: EntriesResponse) => {
          console.log('Entries Data:', res);

          // Set header information
          this.docNo.set(res.DocNo);
          this.docType.set(res.DocType);
          this.totalDr.set(res.TotalDr);
          this.totalCr.set(res.TotalCr);

          // Group entries by SrNo
          const grouped = this.groupEntriesBySrNo(res.Entries);
          this.groupedEntries.set(grouped);

          this.loading.set(false);

          if (res.Entries.length === 0) {
            this.toastSrv.showToast('No entries found for selected month and year', 'info');
          }
        },
        error: (err: any) => {
          console.error('Error loading Entries data:', err);
          this.loading.set(false);
          this.toastSrv.showToast('Error loading Entries data', 'error');
        }
      });
  }

  // ============ GROUP ENTRIES BY SR NO ============

  private groupEntriesBySrNo(entries: EntryItem[]): GroupedEntry[] {
    const grouped = new Map<number, EntryItem[]>();

    entries.forEach(entry => {
      if (!grouped.has(entry.SrNo)) {
        grouped.set(entry.SrNo, []);
      }
      grouped.get(entry.SrNo)!.push(entry);
    });

    // Convert map to array and sort by SrNo
    return Array.from(grouped.entries())
      .map(([srNo, entries]) => ({ srNo, entries }))
      .sort((a, b) => a.srNo - b.srNo);
  }

  // ============ FORMAT AMOUNT ============

  formatAmount(value: number | null): string {
    if (value === null || value === undefined) {
      return '-';
    }

    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  }

  // ============ CHECK IF FIRST ENTRY IN GROUP ============

  isFirstInGroup(entry: EntryItem, groupEntries: EntryItem[]): boolean {
    return groupEntries[0] === entry;
  }

  // ============ GET ROW SPAN FOR SR NO COLUMN ============

  getRowSpan(groupEntries: EntryItem[]): number {
    return groupEntries.length;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}