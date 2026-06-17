import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { TrManageSalesService } from '../../../../../shared/services/tradeReceivable/tr-manage-sales.service';
import { AuthService } from '../../../../../shared/services/common/auth.service';
import { ToastService } from '../../../../../shared/services/componentServices/toast.service';
import { Subject, takeUntil } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { Row, Row2 } from '../../../../../shared/models/tradeReceivable-models/trManageSales';
import { breadCrumbItems } from '../../../../../shared/models/models';
import { BreadcrumbsComponent } from '../../../../common/breadcrumbs/breadcrumbs.component';
import { DecimalPipe } from '@angular/common';


@Component({
  selector: 'app-t-rough-summary',
  standalone: true,
  imports: [FormsModule, BreadcrumbsComponent, DecimalPipe],
  templateUrl: './t-rough-summary.component.html',
  styleUrl: './t-rough-summary.component.scss'
})
export class TRoughSummaryComponent implements OnInit, OnDestroy {

  manageSaleSrv = inject(TrManageSalesService);
  authSrv = inject(AuthService);
  toastSrv = inject(ToastService);

  breadCrumbItems = signal<breadCrumbItems[]>([
    { label: 'Working Files' },
    { label: 'Rough Summary' }
  ]);

  private destroy$ = new Subject<void>();

  saleStatus = signal<Row[]>([]);
  month = signal<Row2[]>([]);

  // Filter signals
  selectedDate = signal<string>(this.getCurrentMonthYear());

  // Data signals
  isLoading = signal<boolean>(false);

  ngOnInit() {
    this.loadTradeRoughSummary();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getCurrentMonthYear(): string {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  }

  onDateChange(value: string): void {
    console.log('Date changed to:', value);
    this.selectedDate.set(value);
    this.loadTradeRoughSummary();
  }

  private getMonthYearFromDate(dateStr: string): { month: string; year: number } {
    // Parse YYYY-MM format directly to avoid timezone issues
    const [yearStr, monthStr] = dateStr.split('-');
    const year = parseInt(yearStr, 10);
    const monthIndex = parseInt(monthStr, 10) - 1; // Convert to 0-indexed

    // Create date in local timezone with explicit year, month, day
    const d = new Date(year, monthIndex, 1);
    const month = d.toLocaleString('en-US', { month: 'long' }); // "November"

    return { month, year };
  }

  loadTradeRoughSummary() {
    this.isLoading.set(true);

    const { month, year } = this.getMonthYearFromDate(this.selectedDate());
    
    // Debug: Log what we're sending to the API
    console.log('🔍 Filtering by:', { 
      month, 
      year, 
      rawDate: this.selectedDate() 
    });

    this.manageSaleSrv._getManageSalesRoughSummary(month, year)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          console.log('✅ API Response:', res);
          console.log('📊 Table1 Rows:', res.Table1?.Rows);
          console.log('📊 Table2 Rows:', res.Table2?.Rows);

          // Clear existing data first to ensure UI updates
          this.saleStatus.set([]);
          this.month.set([]);

          // Set new data
          this.saleStatus.set(res.Table1?.Rows || []);
          this.month.set(res.Table2?.Rows || []);

          console.log('📈 Sale Status Length:', this.saleStatus().length);
          console.log('📈 Month Length:', this.month().length);

          this.isLoading.set(false);
        },
        error: (err: any) => {
          console.error('❌ Error loading rough summary:', err);
          this.toastSrv.showToast('Error loading rough summary', 'error');
          
          // Clear data on error
          this.saleStatus.set([]);
          this.month.set([]);
          
          this.isLoading.set(false);
        }
      });
  }
  formatMonthYearUI(value: string): string {
  if (!value) return '';
  const [y, m] = value.split('-');        // "2026", "02"
  const d = new Date(Number(y), Number(m) - 1, 1);
  const monthName = d.toLocaleString('en-US', { month: 'long' }); // February
  return `${monthName} ${y}`; // "February 2026"
}
}