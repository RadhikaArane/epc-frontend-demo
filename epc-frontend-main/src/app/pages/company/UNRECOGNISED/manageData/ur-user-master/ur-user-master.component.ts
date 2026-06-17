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
  selector: 'app-ur-user-master',
  standalone: true,
  imports: [CommonModule, BreadcrumbsComponent],
  templateUrl: './ur-user-master.component.html',
  styleUrl: './ur-user-master.component.scss'
})
export class UrUserMasterComponent {

  authSrv = inject(AuthService);
  toastSrv = inject(ToastService);
  urSettingSrv = inject(UrManageSettingsService);
  jwtSrv = inject(JwtService);
  confirmationDialogSrv = inject(ConfirmationDialogService);
  router = inject(Router);

  breadCrumbItems = signal<breadCrumbItems[]>([]);
  isLoading = signal<boolean>(true);
  allUsers = signal<any[]>([]);

  // Pagination signals
  currentPage = signal<number>(1);
  pageSize = signal<number>(10);
  totalRecords = signal<number>(0);
  totalPages = signal<number>(0);

  // Expanded user tracking
  expandedUsers = signal<Set<number>>(new Set());

  // Location slider tracking
  userLocationIndex = signal<Map<number, number>>(new Map());

  private destroy$ = new Subject<void>();

  constructor() {
    this.breadCrumbItems.set([
      { label: 'Manage Data' },
    ]);
  }

  ngOnInit() {
    this.loadUsers();
  }

  // ==================== USER MANAGEMENT METHODS ====================

  private loadUsers(): void {
    this.isLoading.set(true);

    const params = {
      page: this.currentPage(),
      pageSize: this.pageSize()
    };

    console.log('Loading Users with params:', params);

    this.urSettingSrv._getAllUsers(params)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          console.log("Users response:", res);
          this.allUsers.set(res.Items || []);
          this.totalRecords.set(res.TotalRecords || 0);
          this.totalPages.set(res.TotalPages || 0);
          this.currentPage.set(res.Page || 1);
          this.pageSize.set(res.PageSize || 10);

          this.isLoading.set(false);
        },
        error: (err: any) => {
          console.error("Error loading Users:", err);
          this.toastSrv.showToast(
            err?.message || 'Error occurred while loading Users.',
            'error'
          );
          this.isLoading.set(false);
          this.allUsers.set([]);
          this.totalRecords.set(0);
          this.totalPages.set(0);
        }
      });
  }

  // ==================== LOCATION SLIDER METHODS ====================

  toggleUserExpansion(userPK: number): void {
    const expanded = new Set(this.expandedUsers());
    if (expanded.has(userPK)) {
      expanded.delete(userPK);
    } else {
      expanded.add(userPK);
      // Initialize location index for this user
      if (!this.userLocationIndex().has(userPK)) {
        const newMap = new Map(this.userLocationIndex());
        newMap.set(userPK, 0);
        this.userLocationIndex.set(newMap);
      }
    }
    this.expandedUsers.set(expanded);
  }

  isUserExpanded(userPK: number): boolean {
    return this.expandedUsers().has(userPK);
  }

  getCurrentLocationIndex(userPK: number): number {
    return this.userLocationIndex().get(userPK) || 0;
  }

  getVisibleLocations(locations: any[], userPK: number): any[] {
    const startIndex = this.getCurrentLocationIndex(userPK);
    // Show 3 locations at a time on desktop, 1 on mobile
    const itemsToShow = window.innerWidth < 768 ? 1 : window.innerWidth < 1200 ? 2 : 3;
    return locations.slice(startIndex, startIndex + itemsToShow);
  }

  canSlidePrev(userPK: number): boolean {
    return this.getCurrentLocationIndex(userPK) > 0;
  }

  canSlideNext(userPK: number, locations: any[]): boolean {
    const currentIndex = this.getCurrentLocationIndex(userPK);
    const itemsToShow = window.innerWidth < 768 ? 1 : window.innerWidth < 1200 ? 2 : 3;
    return currentIndex + itemsToShow < locations.length;
  }

  slidePrev(userPK: number): void {
    const currentIndex = this.getCurrentLocationIndex(userPK);
    if (currentIndex > 0) {
      const newMap = new Map(this.userLocationIndex());
      newMap.set(userPK, currentIndex - 1);
      this.userLocationIndex.set(newMap);
    }
  }

  slideNext(userPK: number, locations: any[]): void {
    const currentIndex = this.getCurrentLocationIndex(userPK);
    const itemsToShow = window.innerWidth < 768 ? 1 : window.innerWidth < 1200 ? 2 : 3;
    if (currentIndex + itemsToShow < locations.length) {
      const newMap = new Map(this.userLocationIndex());
      newMap.set(userPK, currentIndex + 1);
      this.userLocationIndex.set(newMap);
    }
  }

  getLocationDisplayRange(userPK: number, totalLocations: number): string {
    const currentIndex = this.getCurrentLocationIndex(userPK);
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
    this.loadUsers();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onPageSizeChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const newPageSize = parseInt(target.value, 10);

    console.log(`Changing page size from ${this.pageSize()} to ${newPageSize}`);

    this.pageSize.set(newPageSize);
    this.currentPage.set(1);
    this.loadUsers();
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
    this.loadUsers();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}