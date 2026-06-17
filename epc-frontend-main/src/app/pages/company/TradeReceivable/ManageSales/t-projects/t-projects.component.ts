import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TrManageSalesService } from '../../../../../shared/services/tradeReceivable/tr-manage-sales.service';
import { ToastService } from '../../../../../shared/services/componentServices/toast.service';
import { BreadcrumbsComponent } from '../../../../common/breadcrumbs/breadcrumbs.component';
import { 
  ProjectsResponse, 
  ProjectsRow, 
  ColumnMapping, 
  FormattedProjectsRow 
} from '../../../../../shared/models/tradeReceivable-models/trManageSales';

@Component({
  selector: 'app-t-projects',
  standalone: true,
  imports: [CommonModule, FormsModule, BreadcrumbsComponent],
  templateUrl: './t-projects.component.html',
  styleUrl: './t-projects.component.scss'
})
export class TProjectsComponent implements OnInit, OnDestroy {

  breadCrumbItems = signal([
    { label: 'Manage Sales' },
    { label: 'Projects' }
  ]);

  // Services
  manageSalesSrv = inject(TrManageSalesService);
  toastSrv = inject(ToastService);

  // State
  loading = signal<boolean>(false);
  columns = signal<ColumnMapping[]>([]);
  rows = signal<FormattedProjectsRow[]>([]);
  totalRows = signal<number>(0);
  selectedMonth = signal<string>('');
  selectedYear = signal<number>(0);
  selectedMonthYear = signal<string>('');

  // Frozen columns (first 10 columns based on HTML)
  frozenColumnCount = 10;

  // Amount field names for formatting
  private amountFields = new Set<string>([
    'Quantity',
    'Basic_Cost',
    'Discount',
    'Net_Cost',
    'Total_Before_Tax',
    'CGST_Amt',
    'SGST_Amt',
    'UGSTAmt',
    'IGST_Amt',
    'Rounding_Off',
    'Grand_Total'
  ]);

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.initializeDefaultMonthYear();
    this.loadProjectsData();
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

    this.loadProjectsData();
  }

  public formatDate(value: string): string {
  const date = value.split(' ')[0];
  return date; 
}


  getStickyLeft(colIndex: number): string | null {
  if (colIndex >= this.frozenColumnCount) {
    return null;
  }

  // base width for normal columns
  let left = colIndex * 120;

  // Distribution Channel ki extra width
  if (colIndex > this.columns().findIndex(c => c.field === 'Distribution_Channel')) {
    left += 60; // extra width added
  }

  return `${left}px`;
  }


  // ============ LOAD PROJECTS DATA ============

  loadProjectsData(): void {
    if (!this.selectedMonth() || !this.selectedYear()) {
      this.toastSrv.showToast('Please select month and year', 'error');
      return;
    }

    this.loading.set(true);

    this.manageSalesSrv._getManageSalesProjects(this.selectedMonth(), this.selectedYear())
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: ProjectsResponse) => {
          console.log('Projects Data:', res);

          // PRE-FORMAT COLUMNS ONCE (header text)
          const mappedColumns: ColumnMapping[] = res.Columns.map((col, index) => ({
            field: col,
            header: this.formatHeader(col),
            frozen: index < this.frozenColumnCount
          }));

          // PRE-FORMAT ROWS ONCE (all cell values)
          const formattedRows: FormattedProjectsRow[] = res.Rows.map(row => this.formatRow(row));

          // Set formatted data
          this.columns.set(mappedColumns);
          this.rows.set(formattedRows);
          this.totalRows.set(res.TotalRows);
          this.loading.set(false);

          if (res.Rows.length === 0) {
            this.toastSrv.showToast('No data found for selected month and year', 'info');
          }
        },
        error: (err: any) => {
          console.error('Error loading Projects data:', err);
          this.loading.set(false);
          this.toastSrv.showToast('Error loading Projects data', 'error');
        }
      });
  }

  // ============ DATA FORMATTING (RUNS ONCE PER ROW) ============

  /**
   * Format entire row - called ONCE when data is received
   */
  private formatRow(row: ProjectsRow): FormattedProjectsRow {
    const formattedRow: FormattedProjectsRow = {};

    Object.keys(row).forEach(key => {
      const value = row[key];

      // Handle null/undefined/empty
      if (value === null || value === undefined || value === '') {
        formattedRow[key] = '-';
        return;
      }

      // Format amount fields
      if (this.amountFields.has(key)) {
        formattedRow[key] = this.formatAmount(value);
      } else {
        // Keep as-is (text and dates are already formatted)
        formattedRow[key] = value.toString();
      }
    });

    return formattedRow;
  }

  /**
   * Format amount/currency values with 2 decimal places and commas
   */
  private formatAmount(value: string | number | null): string {
    if (value === null || value === undefined || value === '') {
      return '-';
    }

    const numValue = parseFloat(value.toString());
    
    if (isNaN(numValue)) {
      return value.toString();
    }

    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(numValue);
  }

  /**
   * Format column header from snake_case to Title Case
   */
  private formatHeader(columnName: string): string {
    return columnName
      .replace(/_/g, ' ')
      .replace(/([A-Z])/g, ' $1')
      .trim()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}