import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { BreadcrumbsComponent } from '../../../../common/breadcrumbs/breadcrumbs.component';
import { breadCrumbItems } from '../../../../../shared/models/models';
import { FaReportsService } from '../../../../../shared/services/fixedAsset/fa-reports.service';
import { ToastService } from '../../../../../shared/services/componentServices/toast.service'; 
import { faVerifiedAsset } from '../../../../../shared/models/fixedAsset-models/faReportsModel';

@Component({
  selector: 'app-fa-scanned-history',
  standalone: true,
  imports: [BreadcrumbsComponent, CommonModule],
  templateUrl: './fa-scanned-history.component.html',
  styleUrl: './fa-scanned-history.component.scss'
})
export class FaScannedHistoryComponent implements OnInit, OnDestroy {

  private reportSrv = inject(FaReportsService);
  private toastSrv = inject(ToastService);
  private destroy$ = new Subject<void>();

  breadCrumbItems = signal<breadCrumbItems[]>([
    { label: 'Scanned History Report' }
  ]);

  scanHistory = signal<faVerifiedAsset[]>([]);
  isLoading = signal<boolean>(false);
  currentPage = signal<number>(1);
  pageSize = signal<number>(10);
  totalRecords = signal<number>(0);
  totalPages = signal<number>(0);

  ngOnInit(): void {
    this.loadScanHistory();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadScanHistory(): void {
    this.isLoading.set(true);

    this.reportSrv._getScanHistory(this.currentPage(), this.pageSize())
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.scanHistory.set(res?.data || []);
          this.totalRecords.set(res?.totalRecords || 0);
          this.totalPages.set(res?.totalPages || 0);
          this.currentPage.set(res?.pageNumber || 1);
          this.pageSize.set(res?.pageSize || 10);
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('Error loading scan history:', err);
          this.toastSrv.showToast('Failed to load scan history', 'error');
          this.isLoading.set(false);
          this.scanHistory.set([]);
          this.totalRecords.set(0);
          this.totalPages.set(0);
        }
      });
  }

  onPageChange(newPage: number): void {
    if (newPage < 1 || newPage > this.totalPages()) {
      return;
    }

    if (newPage === this.currentPage()) {
      return;
    }

    this.currentPage.set(newPage);
    this.loadScanHistory();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onPageSizeChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const newPageSize = parseInt(target.value, 10);

    this.pageSize.set(newPageSize);
    this.currentPage.set(1);
    this.loadScanHistory();
  }

  getVisiblePages(): number[] {
    const current = this.currentPage();
    const total = this.totalPages();
    const pages: number[] = [];

    if (total === 0) {
      return pages;
    }

    if (total <= 7) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
      return pages;
    }

    pages.push(1);

    let rangeStart = Math.max(2, current - 1);
    let rangeEnd = Math.min(total - 1, current + 1);

    if (rangeStart > 2) {
      pages.push(-1);
    }

    for (let i = rangeStart; i <= rangeEnd; i++) {
      pages.push(i);
    }

    if (rangeEnd < total - 1) {
      pages.push(-2);
    }

    pages.push(total);

    return pages;
  }

  getSerialNumber(index: number): number {
    return (this.currentPage() - 1) * this.pageSize() + index + 1;
  }

  getStartRecord(): number {
    if (this.totalRecords() === 0) return 0;
    return (this.currentPage() - 1) * this.pageSize() + 1;
  }

  getEndRecord(): number {
    const end = this.currentPage() * this.pageSize();
    return Math.min(end, this.totalRecords());
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'VerifiedScanned':
        return 'bg-success';
      case 'VerifiedManual':
        return 'bg-primary';
      case 'VerifiedNonTaggable':
        return 'bg-warning';
      default:
        return 'bg-secondary';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'VerifiedScanned':
        return 'Verified Scanned';
      case 'VerifiedManual':
        return 'Verified Manual';
      case 'VerifiedNonTaggable':
        return 'Non-Taggable';
      default:
        return status;
    }
  }
}