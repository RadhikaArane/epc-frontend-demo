import { Component, inject, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { TrManageSalesService } from '../../../../../shared/services/tradeReceivable/tr-manage-sales.service';
import { AuthService } from '../../../../../shared/services/common/auth.service';
import { ToastService } from '../../../../../shared/services/componentServices/toast.service';
import { GroupingSalesRow } from '../../../../../shared/models/tradeReceivable-models/trManageSales';
import { BreadcrumbsComponent } from '../../../../common/breadcrumbs/breadcrumbs.component';
import { breadCrumbItems } from '../../../../../shared/models/models';

@Component({
  selector: 'app-t-grouping-sale',
  standalone: true,
  imports: [FormsModule, BreadcrumbsComponent],
  templateUrl: './t-grouping-sale.component.html',
  styleUrl: './t-grouping-sale.component.scss'
})
export class TGroupingSaleComponent implements OnInit, OnDestroy {

  manageSaleSrv = inject(TrManageSalesService);
  authSrv = inject(AuthService);
  toastSrv = inject(ToastService);

  breadCrumbItems = signal<breadCrumbItems[]>([
    { label: 'Working Files' },
    { label: 'Grouping Sales' }
  ]);

  private destroy$ = new Subject<void>();

  // ============ DATA SIGNALS ============
  GroupingSalesRow = signal<GroupingSalesRow[]>([]);
  columns = signal<string[]>([]);
  isLoading = signal<boolean>(false);

  // ============ FILTER SIGNALS ============
  selectedDate = signal<string>('');
  selectedMonth = signal<string>('');
  selectedYear = signal<number>(0);

  // ============ COMPUTED: dynamic month/total columns (excludes GL + GL_Name) ============
  dynamicColumns = computed(() =>
    this.columns().filter(c => c !== 'GL' && c !== 'GL_Name')
  );

  // ============ LIFECYCLE ============
  ngOnInit(): void {
    this.initializeDefaultMonthYear();
    this.loadGroupingSales();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ============ INITIALIZE DEFAULT MONTH-YEAR (previous month) ============
  initializeDefaultMonthYear(): void {
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);

    const year = lastMonth.getFullYear();
    const monthNum = String(lastMonth.getMonth() + 1).padStart(2, '0');
    const monthName = lastMonth.toLocaleString('en-US', { month: 'long' });

    this.selectedDate.set(`${year}-${monthNum}`);
    this.selectedMonth.set(monthName);
    this.selectedYear.set(year);
  }

  // ============ FILTER CHANGE ============
  onDateChange(value: string): void {
    if (!value) return;

    this.selectedDate.set(value);

    const [yearStr, monthStr] = value.split('-');
    const year = parseInt(yearStr, 10);
    const monthIndex = parseInt(monthStr, 10) - 1;
    const monthName = new Date(year, monthIndex).toLocaleString('en-US', { month: 'long' });

    this.selectedMonth.set(monthName);
    this.selectedYear.set(year);

    this.loadGroupingSales();
  }

  // ============ LOAD DATA ============
  loadGroupingSales(): void {
    this.isLoading.set(true);

    const month = this.selectedMonth();
    const year = this.selectedYear();

    this.manageSaleSrv._getManageSalesGroupingSales(month, year)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.columns.set(res.Columns ?? []);
          this.GroupingSalesRow.set(res.Rows ?? []);
          this.isLoading.set(false);
        },
        error: (err: any) => {
          console.error('Error loading Grouping Sales:', err);
          this.toastSrv.showToast('Error loading Grouping Sales', 'error');
          this.GroupingSalesRow.set([]);
          this.columns.set([]);
          this.isLoading.set(false);
        }
      });
  }

  getCellValue(row: any, col: string): string {
    const val = row[col];
    if (val === '' || val === null || val === undefined) return '';
    const num = parseFloat(val);
    if (isNaN(num)) return '';
    return num.toFixed(1);
  }

}