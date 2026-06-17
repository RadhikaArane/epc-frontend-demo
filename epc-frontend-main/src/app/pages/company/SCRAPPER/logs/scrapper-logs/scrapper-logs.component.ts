import { Component, OnInit, signal, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil, finalize } from 'rxjs';
import { breadCrumbItems } from '../../../../../shared/models/models';
import { BreadcrumbsComponent } from '../../../../common/breadcrumbs/breadcrumbs.component';
import { ScrAutomationService } from '../../../../../shared/services/scrapper/scr-automation.service';
import { ToastService } from '../../../../../shared/services/componentServices/toast.service';

export interface ScrapperLogs {
  State: string;
  StartedAt: string;
  FinishedAt: string;
  DeviceInfo: string;
  Status: string;
  RunBy: string;
}

export interface Logs {
  Page: number;
  PageSize: number;
  TotalCount: number;
  Items: ScrapperLogs[];
}

@Component({
  selector: 'app-scrapper-logs',
  standalone: true,
  imports: [BreadcrumbsComponent, CommonModule],
  templateUrl: './scrapper-logs.component.html',
  styleUrl: './scrapper-logs.component.scss'
})
export class ScrapperLogsComponent implements OnInit, OnDestroy {
  private scrapperSrv = inject(ScrAutomationService);
  private toastSrv = inject(ToastService);
  private destroy$ = new Subject<void>();
  
  breadCrumbItems = signal<breadCrumbItems[]>([{ label: 'Logs' }]);
  
  // Data signals
  logsData = signal<Logs | null>(null); 
  isLoading = signal<boolean>(false);

  // 1. Initialize with an empty string to show --/--/---- in the UI
  selectedDate = signal<string>(''); 

  // Pagination signals
  currentPage = signal<number>(1);
  pageSize = signal<number>(10);
  totalRecords = signal<number>(0);
  totalPages = signal<number>(0);

  ngOnInit(): void {
    this.loadLogs();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadLogs() {
    this.isLoading.set(true);
    
    // 2. Determine what date to send to the API
    // If selectedDate is empty, fallback to 'today' for the API call 
    // so the user still sees data, but the input remains empty.
    const today = new Date().toISOString().split('T')[0];
    const apiDate = this.selectedDate() || today; 

    const params = {
      date: apiDate,
      page: this.currentPage(),
      pageSize: this.pageSize()
    };

    this.scrapperSrv._getScrapperLogs(params)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.isLoading.set(false))
      )
      .subscribe({
        next: (res: Logs) => {
          this.logsData.set(res);
          this.totalRecords.set(res.TotalCount || 0);
          this.totalPages.set(Math.ceil((res.TotalCount || 0) / this.pageSize()));
        },
        error: (err) => {
          console.error('Error fetching logs:', err);
          this.toastSrv.showToast('Failed to load logs', 'error');
        }
      });
  }

  onDateChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.selectedDate.set(value);
    this.resetToFirstPage();
  }

  // 3. Update reset to clear the input back to empty
  resetFilters(): void {
    this.selectedDate.set(''); 
    this.resetToFirstPage();
  }

  private resetToFirstPage(): void {
    this.currentPage.set(1);
    this.loadLogs();
  }

  onPageChange(newPage: number): void {
    if (newPage < 1 || newPage > this.totalPages() || newPage === this.currentPage()) return;
    this.currentPage.set(newPage);
    this.loadLogs();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onPageSizeChange(event: Event): void {
    const newSize = parseInt((event.target as HTMLSelectElement).value, 10);
    this.pageSize.set(newSize);
    this.currentPage.set(1);
    this.loadLogs();
  }

  getVisiblePages(): number[] {
    const current = this.currentPage();
    const total = this.totalPages();
    const pages: number[] = [];
    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      pages.push(1);
      if (current > 3) pages.push(-1);
      for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) pages.push(i);
      if (current < total - 2) pages.push(-2);
      pages.push(total);
    }
    return pages;
  }

  getSerialNumber(index: number): number {
    return (this.currentPage() - 1) * this.pageSize() + index + 1;
  }

  getStartRecord(): number {
    return this.totalRecords() === 0 ? 0 : (this.currentPage() - 1) * this.pageSize() + 1;
  }

  getEndRecord(): number {
    return Math.min(this.currentPage() * this.pageSize(), this.totalRecords());
  }
}