import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil, finalize } from 'rxjs';
import { breadCrumbItems } from '../../../../../shared/models/models';
import { BreadcrumbsComponent } from '../../../../common/breadcrumbs/breadcrumbs.component';
import { ScrAutomationService } from '../../../../../shared/services/scrapper/scr-automation.service';
import { ToastService } from '../../../../../shared/services/componentServices/toast.service';
import { ScrapperReportItem } from '../../../../../shared/models/scrapper-models/scrapperAutomation';

interface StateOption {
  value: string;
  label: string;
}

interface FilterParams {
  page: number;
  pageSize: number;
  state?: string;
  year?: number;
  month?: number;
}

@Component({
  selector: 'app-ur-show-data',
  standalone: true,
  imports: [BreadcrumbsComponent, CommonModule],
  templateUrl: './ur-show-data.component.html',
  styleUrl: './ur-show-data.component.scss',
})
export class UrShowDataComponent implements OnInit, OnDestroy {
  private scrapperSrv = inject(ScrAutomationService);
  private toastSrv = inject(ToastService);
  private destroy$ = new Subject<void>();

  // Breadcrumb
  breadCrumbItems = signal<breadCrumbItems[]>([{ label: 'Reports' }]);

  // Data signals
  allData = signal<ScrapperReportItem[]>([]);
  isLoading = signal<boolean>(false);
  downloadingJobId = signal<string | null>(null);

  // Filter signals
  selectedState = signal<string>('');
  selectedMonth = signal<string>('');

  // Pagination signals
  currentPage = signal<number>(1);
  pageSize = signal<number>(10);
  totalRecords = signal<number>(0);
  totalPages = signal<number>(0);

  // States dropdown options
  readonly states: StateOption[] = [
    { value: '', label: 'All States' },
    { value: 'AndhraPradesh', label: 'Andhra Pradesh' },
    { value: 'Chhattisgarh', label: 'Chhattisgarh' },
    { value: 'Gujarat', label: 'Gujarat' },
    { value: 'Karnataka_Horti', label: 'Karnataka Horticulture' },
    { value: 'Karnataka_Agri', label: 'Karnataka Agriculture' },
    { value: 'MadhyaPradesh', label: 'Madhya Pradesh' },
    { value: 'Tamilnadu', label: 'Tamil Nadu' },
    { value: 'Telangana', label: 'Telangana' },
    { value: 'UttarPradesh', label: 'Uttar Pradesh' },
    { value: 'WestBengal', label: 'West Bengal' },
  ];

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Load scrapper data from API
   */
  loadData(): void {
    this.isLoading.set(true);

    const params = this.buildFilterParams();

    this.scrapperSrv
      ._getJobsStateReport(params)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.isLoading.set(false)),
      )
      .subscribe({
        next: (res) => {
          console.log('📊 Scrapper data loaded:', res);
          this.allData.set(res.items || []);
          this.totalRecords.set(res.totalCount || 0);
          this.totalPages.set(res.totalPages || 0);
          this.currentPage.set(res.page || 1);
          this.pageSize.set(res.pageSize || 10);
        },
        error: (err) => {
          console.error('❌ Error loading scrapper data:', err);
          this.toastSrv.showToast(
            err?.message || 'Failed to load data',
            'error',
          );
          this.resetDataState();
        },
      });
  }

  /**
   * Build filter parameters for API call
   */
  private buildFilterParams(): FilterParams {
    const params: FilterParams = {
      page: this.currentPage(),
      pageSize: this.pageSize(),
    };

    // Only add filters if they have values
    if (this.selectedState()) {
      params.state = this.selectedState();
    }

    if (this.selectedMonth()) {
      const [year, month] = this.selectedMonth().split('-');
      params.year = parseInt(year, 10);
      params.month = parseInt(month, 10);
    }

    return params;
  }

  /**
   * Reset data state to empty
   */
  private resetDataState(): void {
    this.allData.set([]);
    this.totalRecords.set(0);
    this.totalPages.set(0);
  }

  /**
   * Handle state filter change
   */
  onStateChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedState.set(value);
    this.resetToFirstPage();
  }

  /**
   * Handle month/year filter change
   */
  onMonthChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.selectedMonth.set(value);
    this.resetToFirstPage();
  }

  /**
   * Reset all filters
   */
  resetFilters(): void {
    this.selectedState.set('');
    this.selectedMonth.set('');
    this.resetToFirstPage();
  }

  /**
   * Reset to first page and reload data
   */
  private resetToFirstPage(): void {
    this.currentPage.set(1);
    this.loadData();
  }

  /**
   * Handle page change
   */
  onPageChange(newPage: number): void {
    if (this.isInvalidPageChange(newPage)) {
      return;
    }

    console.log(`📄 Changing page from ${this.currentPage()} to ${newPage}`);
    this.currentPage.set(newPage);
    this.loadData();
    this.scrollToTop();
  }

  /**
   * Check if page change is invalid
   */
  private isInvalidPageChange(newPage: number): boolean {
    return (
      newPage < 1 ||
      newPage > this.totalPages() ||
      newPage === this.currentPage()
    );
  }

  /**
   * Scroll to top of page
   */
  private scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /**
   * Handle page size change
   */
  onPageSizeChange(event: Event): void {
    const newPageSize = parseInt((event.target as HTMLSelectElement).value, 10);
    console.log(`📊 Changing page size to ${newPageSize}`);
    this.pageSize.set(newPageSize);
    this.resetToFirstPage();
  }

  /**
   * Get visible page numbers with ellipsis
   */
  getVisiblePages(): number[] {
    const current = this.currentPage();
    const total = this.totalPages();
    const pages: number[] = [];

    if (total === 0) return pages;

    // Show all pages if total is 7 or less
    if (total <= 7) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
      return pages;
    }

    // Always show first page
    pages.push(1);

    // Calculate range around current page
    const rangeStart = Math.max(2, current - 1);
    const rangeEnd = Math.min(total - 1, current + 1);

    // Add left ellipsis if needed
    if (rangeStart > 2) {
      pages.push(-1); // Ellipsis placeholder
    }

    // Add middle pages
    for (let i = rangeStart; i <= rangeEnd; i++) {
      pages.push(i);
    }

    // Add right ellipsis if needed
    if (rangeEnd < total - 1) {
      pages.push(-2); // Ellipsis placeholder
    }

    // Always show last page
    pages.push(total);

    return pages;
  }

  /**
   * Get serial number for table row
   */
  getSerialNumber(index: number): number {
    return (this.currentPage() - 1) * this.pageSize() + index + 1;
  }

  /**
   * Get start record number for display
   */
  getStartRecord(): number {
    if (this.totalRecords() === 0) return 0;
    return (this.currentPage() - 1) * this.pageSize() + 1;
  }

  /**
   * Get end record number for display
   */
  getEndRecord(): number {
    const end = this.currentPage() * this.pageSize();
    return Math.min(end, this.totalRecords());
  }

  /**
   * Get status badge class based on status
   */
  getStatusBadgeClass(status: string): string {
    const statusLower = status?.toLowerCase() || '';

    switch (statusLower) {
      case 'finished':
      case 'completed':
        return 'bg-success';
      case 'running':
        return 'bg-warning text-dark';
      case 'failed':
        return 'bg-danger';
      case 'cancelled':
        return 'bg-secondary';
      default:
        return 'bg-info';
    }
  }

  /**
   * Get formatted status text
   */
  getStatusText(status: string): string {
    return status || 'Unknown';
  }

  /**
   * Check if export button should be disabled
   */
  isExportDisabled(item: ScrapperReportItem): boolean {
    const status = item.status?.toLowerCase() || '';
    return status !== 'finished';
  }

  /**
   * Check if currently downloading this item
   */
  isDownloading(jobId: string): boolean {
    return this.downloadingJobId() === jobId;
  }

  /**
   * Download Excel report for a job
   */

  // private convertStateForDownload(state: string): string {
  //   const map: Record<string, string> = {
  //     'Karnataka_Horti': 'Karnataka horti',
  //     'Karnataka_Agri': 'Karnataka agri',
  //     'Tamil_Nadu': 'Tamil Nadu', 
  //   };

  //   if (map[state]) return map[state];
 
  //   return state.replace(/_/g, ' ');
  // }

  downloadAttachment(item: ScrapperReportItem): void {
    if (this.isExportDisabled(item)) {
      this.toastSrv.showToast('Can only export finished jobs', 'warning');
      return;
    }

    const state = item.state;
    const finished = item.finished;

    // const processedState = this.convertStateForDownload(state)/;

    this.downloadingJobId.set(item.job_id);

    const params = {
      state: state,
      finishedAt: item.finished,
    };

    console.log('⬇️ Starting download:', params);

    this.scrapperSrv
      ._getJobReportExport(params)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          // Always reset downloading state when done
          this.downloadingJobId.set(null);
        }),
      )
      .subscribe({
        next: (blob: Blob) => {
          console.log('Jobs attachment response received');

          // Validate blob
          if (!blob || blob.size === 0) {
            this.toastSrv.showToast('File is empty or corrupt', 'error');
            return;
          }

          // Create download link
          // const now = new Date();
          // const date = now.toLocaleDateString('en-GB').replace(/\//g, '-'); // DD-MM-YYYY
          // const time = now.toLocaleTimeString('en-GB', {
          //   hour: '2-digit',
          //   minute: '2-digit',
          //   second: '2-digit'
          // }).replace(/:/g, '-'); // Use /:/g not ':'

          // Create download link
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${state}_jobs_${finished}.xlsx`;

          // Trigger download
          document.body.appendChild(link);
          link.click();

          // Cleanup
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);

          this.toastSrv.showToast(
            `${state} Attachment downloaded successfully.`,
            'success',
          );
        },
        error: (err: any) => {
          console.error('❌ Download error:', err);
          this.toastSrv.showToast(
            err?.message || 'Failed to download report',
            'error',
          );
        },
      });
  }
}
