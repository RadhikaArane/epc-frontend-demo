import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../../../../shared/services/common/auth.service';
import { ToastService } from '../../../../../shared/services/componentServices/toast.service';
import { UrManageSettingsService } from '../../../../../shared/services/unrecognisedInvoice/ur-manage-settings.service';
import { JwtService } from '../../../../../shared/services/common/jwt.service';
import { ConfirmationDialogService } from '../../../../../shared/services/componentServices/confirmation-dialog.service';
import { Router } from '@angular/router';
import { breadCrumbItems } from '../../../../../shared/models/models';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { BreadcrumbsComponent } from '../../../../common/breadcrumbs/breadcrumbs.component';

@Component({
  selector: 'app-ur-dealer-master',
  standalone: true,
  imports: [CommonModule, BreadcrumbsComponent],
  templateUrl: './ur-dealer-master.component.html',
  styleUrl: './ur-dealer-master.component.scss'
})
export class UrDealerMasterComponent {

  authSrv = inject(AuthService);
  toastSrv = inject(ToastService);
  urSettingSrv = inject(UrManageSettingsService);
  jwtSrv = inject(JwtService);
  confirmationDialogSrv = inject(ConfirmationDialogService);
  router = inject(Router);

  breadCrumbItems = signal<breadCrumbItems[]>([]);
  isLoading = signal<boolean>(true);
  allDealer = signal<any[]>([]);

  // Pagination signals
  currentPage = signal<number>(1);
  pageSize = signal<number>(10);
  totalRecords = signal<number>(0);
  totalPages = signal<number>(0);

  // Expanded dealer tracking
  expandedDealers = signal<Set<number>>(new Set());
  
  // Location slider tracking
  dealerLocationIndex = signal<Map<number, number>>(new Map());

  private destroy$ = new Subject<void>();

  constructor() {
    this.breadCrumbItems.set([
      { label: 'Manage Data' },
    ]);
  }

  ngOnInit() {
    this.loadDealer();
  }

  // ==================== PROJECT MANAGEMENT METHODS ====================

  private loadDealer(): void {
    this.isLoading.set(true);

    const params = {
      page: this.currentPage(),
      pageSize: this.pageSize()
    };

    console.log('Loading Dealers with params:', params);

    this.urSettingSrv._getAllDealers(params)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          console.log("Dealers response:", res);

          this.allDealer.set(res.Items || []);
          this.totalRecords.set(res.TotalRecords || 0);
          this.totalPages.set(res.TotalPages || 0);
          this.currentPage.set(res.Page || 1);
          this.pageSize.set(res.PageSize || 10);

          this.isLoading.set(false);
        },
        error: (err: any) => {
          console.error("Error loading Dealers:", err);
          this.toastSrv.showToast(
            err?.message || 'Error occurred while loading Dealers.',
            'error'
          );
          this.isLoading.set(false);
          this.allDealer.set([]);
          this.totalRecords.set(0);
          this.totalPages.set(0);
        }
      });
  }

  // ==================== LOCATION SLIDER METHODS ====================

  toggleDealerExpansion(dealerPK: number): void {
    const expanded = new Set(this.expandedDealers());
    if (expanded.has(dealerPK)) {
      expanded.delete(dealerPK);
    } else {
      expanded.add(dealerPK);
      // Initialize location index for this dealer
      if (!this.dealerLocationIndex().has(dealerPK)) {
        const newMap = new Map(this.dealerLocationIndex());
        newMap.set(dealerPK, 0);
        this.dealerLocationIndex.set(newMap);
      }
    }
    this.expandedDealers.set(expanded);
  }

  isDealerExpanded(dealerPK: number): boolean {
    return this.expandedDealers().has(dealerPK);
  }

  getCurrentLocationIndex(dealerPK: number): number {
    return this.dealerLocationIndex().get(dealerPK) || 0;
  }

  getVisibleLocations(locations: any[], dealerPK: number): any[] {
    const startIndex = this.getCurrentLocationIndex(dealerPK);
    // Show 3 locations at a time on desktop, 1 on mobile
    const itemsToShow = window.innerWidth < 768 ? 1 : window.innerWidth < 1200 ? 2 : 3;
    return locations.slice(startIndex, startIndex + itemsToShow);
  }

  canSlidePrev(dealerPK: number): boolean {
    return this.getCurrentLocationIndex(dealerPK) > 0;
  }

  canSlideNext(dealerPK: number, locations: any[]): boolean {
    const currentIndex = this.getCurrentLocationIndex(dealerPK);
    const itemsToShow = window.innerWidth < 768 ? 1 : window.innerWidth < 1200 ? 2 : 3;
    return currentIndex + itemsToShow < locations.length;
  }

  slidePrev(dealerPK: number): void {
    const currentIndex = this.getCurrentLocationIndex(dealerPK);
    if (currentIndex > 0) {
      const newMap = new Map(this.dealerLocationIndex());
      newMap.set(dealerPK, currentIndex - 1);
      this.dealerLocationIndex.set(newMap);
    }
  }

  slideNext(dealerPK: number, locations: any[]): void {
    const currentIndex = this.getCurrentLocationIndex(dealerPK);
    const itemsToShow = window.innerWidth < 768 ? 1 : window.innerWidth < 1200 ? 2 : 3;
    if (currentIndex + itemsToShow < locations.length) {
      const newMap = new Map(this.dealerLocationIndex());
      newMap.set(dealerPK, currentIndex + 1);
      this.dealerLocationIndex.set(newMap);
    }
  }

  getLocationDisplayRange(dealerPK: number, totalLocations: number): string {
    const currentIndex = this.getCurrentLocationIndex(dealerPK);
    const itemsToShow = window.innerWidth < 768 ? 1 : window.innerWidth < 1200 ? 2 : 3;
    const start = currentIndex + 1;
    const end = Math.min(currentIndex + itemsToShow, totalLocations);
    return `${start}-${end} of ${totalLocations}`;
  }

  // ==================== PAGINATION METHODS ====================

  onPageChange(newPage: number): void {
    if (newPage < 1 || newPage > this.totalPages()) {
      return;
    }

    if (newPage === this.currentPage()) {
      return;
    }

    console.log(`Changing page from ${this.currentPage()} to ${newPage}`);

    this.currentPage.set(newPage);
    this.loadDealer();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onPageSizeChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const newPageSize = parseInt(target.value, 10);

    console.log(`Changing page size from ${this.pageSize()} to ${newPageSize}`);

    this.pageSize.set(newPageSize);
    this.currentPage.set(1);
    this.loadDealer();
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

  //use to call after like deletion API call
  private refreshCurrentPage(): void {
    this.loadDealer();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}