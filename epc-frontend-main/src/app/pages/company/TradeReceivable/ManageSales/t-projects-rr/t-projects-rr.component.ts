import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TrManageSalesService } from '../../../../../shared/services/tradeReceivable/tr-manage-sales.service';
import { ToastService } from '../../../../../shared/services/componentServices/toast.service';
import { BreadcrumbsComponent } from '../../../../common/breadcrumbs/breadcrumbs.component';
import { 
  ProjectsRRResponse, 
  ProjectsRRRow,  
  ColumnMapping, 
  FormattedProjectsRRRow 
} from '../../../../../shared/models/tradeReceivable-models/trManageSales';

@Component({
  selector: 'app-t-projects-rr',
  standalone: true,
  imports: [CommonModule, FormsModule, BreadcrumbsComponent],
  templateUrl: './t-projects-rr.component.html',
  styleUrl: './t-projects-rr.component.scss'
})
export class TProjectsRrComponent implements OnInit, OnDestroy {

  breadCrumbItems = signal([
    { label: 'Manage Sales' },
    { label: 'Projects RR' }
  ]);

  // Services
  manageSalesSrv = inject(TrManageSalesService);
  toastSrv = inject(ToastService);

  // State
  loading = signal<boolean>(false);
  columns = signal<ColumnMapping[]>([]);
  rows = signal<FormattedProjectsRRRow[]>([]);
  totalRows = signal<number>(0);
  selectedMonth = signal<string>('');
  selectedYear = signal<number>(0);
  selectedMonthYear = signal<string>('');

  // Frozen columns (first 6 columns)
  // frozenColumnCount = 5;

  // --- Frozen Columns Logic ---
  frozenColumnsList = [
    'YearMonth',
    'GL_Account',
    'Document_Number'
  ];

  // Amount field names for formatting
  private amountFields = new Set<string>();

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.initializeDefaultMonthYear();
    this.loadProjectsRRData();
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

    this.loadProjectsRRData();
  }

  private formatDate(value: string): string {
  return value.split(' ')[0];
}


  // ============ LOAD PROJECTS RR DATA ============

  loadProjectsRRData(): void {
    if (!this.selectedMonth() || !this.selectedYear()) {
      this.toastSrv.showToast('Please select month and year', 'error');
      return;
    }

    this.loading.set(true);

    this.manageSalesSrv._getManageSalesProjectsRR(this.selectedMonth(), this.selectedYear())
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: ProjectsRRResponse) => {
          console.log('Projects RR Data:', res);

          // Identify amount fields
          this.amountFields.clear();
          res.Columns.forEach(col => {
            if (col.toLowerCase().includes('amount')) {
              this.amountFields.add(col);
            }
          });

          // PRE-FORMAT COLUMNS ONCE (header text)
          const mappedColumns: ColumnMapping[] = res.Columns.map((col) => ({
            field: col,
            header: this.formatHeader(col),
            frozen: this.isColumnFrozen(col) // Use the new function here!
          }));

          // PRE-FORMAT ROWS ONCE (all cell values)
          const formattedRows: FormattedProjectsRRRow[] = res.Rows.map(row => this.formatRow(row));

          // Set formatted data
          this.columns.set(mappedColumns);
          this.rows.set(formattedRows);
          this.totalRows.set(res.TotalRows);
          this.loading.set(false);

          setTimeout(() => this.calculateDynamicFrozenPositions(), 100);

          if (res.Rows.length === 0) {
            this.toastSrv.showToast('No data found for selected month and year', 'info');
          }
        },
        error: (err: any) => {
          console.error('Error loading Projects RR data:', err);
          this.loading.set(false);
          this.toastSrv.showToast('Error loading Projects RR data', 'error');
        }
      });
  }

  // Store dynamically calculated left positions
  frozenLeftPositions = signal<Map<string, number>>(new Map());

  isColumnFrozen(fieldName: string): boolean {
    return this.frozenColumnsList.includes(fieldName);
  }

  getFrozenLeftPosition(fieldName: string): number {
    return this.frozenLeftPositions().get(fieldName) || 0;
  }

  calculateDynamicFrozenPositions(): void {
    const table = document.querySelector('.table-ultra-compact');
    if (!table) return;

    const headerCells = table.querySelectorAll('thead th');
    const positions = new Map<string, number>();
    
    let currentLeft = 0;

    this.columns().forEach((col, index) => {
      if (this.isColumnFrozen(col.field) && headerCells[index]) {
        positions.set(col.field, currentLeft);
        const actualWidth = (headerCells[index] as HTMLElement).offsetWidth;
        currentLeft += actualWidth;
      }
    });

    this.frozenLeftPositions.set(positions);
  }

  // ============ DATA FORMATTING (RUNS ONCE PER ROW) ============

  /**
   * Format entire row - called ONCE when data is received
   */
  private formatRow(row: ProjectsRRRow): FormattedProjectsRRRow {
    const formattedRow: FormattedProjectsRRRow = {};

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
        // Handle date fields
           if (key === 'Posting_Date' || key === 'Document_Date') {
            formattedRow[key] = this.formatDate(value.toString());
          } else {
            formattedRow[key] = value.toString();
          }
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
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
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