import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
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
import { param } from 'jquery';
import { Access } from '../../../../../shared/models/unrecognisedInvoice-models/settings';

@Component({
  selector: 'app-ur-access',
  standalone: true,
  imports: [CommonModule,BreadcrumbsComponent],
  templateUrl: './ur-access.component.html',
  styleUrl: './ur-access.component.scss'
})
export class UrAccessComponent implements OnInit, OnDestroy{

  authSrv = inject(AuthService);
  toastSrv = inject(ToastService);
  urSettingSrv = inject(UrManageSettingsService);
  jwtSrv = inject(JwtService);
  confirmationDialogSrv = inject(ConfirmationDialogService);
  router = inject(Router);

  breadCrumbItems = signal<breadCrumbItems[]>([]);
  isLoading = signal<boolean>(true);
  allAccess = signal<Access[]>([]); 

  // Pagination signals
  currentPage = signal<number>(1);
  pageSize = signal<number>(10);
  totalRecords = signal<number>(0);
  totalPages = signal<number>(0);


  private destroy$ = new Subject<void>();

  constructor() {
    this.breadCrumbItems.set([
      { label: 'Settings' },
    ]);
  }

  ngOnInit() {
    this.loadAccess();
  }

  // ==================== PROJECT MANAGEMENT METHODS ====================

  private loadAccess(): void {
    this.isLoading.set(true); 

    const params = {
      page: this.currentPage(),
      pageSize: this.pageSize()
    };

    console.log('Loading Access with params:', params);

    this.urSettingSrv._getAllAccess(params)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          console.log("Access response:", res);

          this.allAccess.set(res.Items || []);
          this.totalRecords.set(res.TotalRecords || 0);
          this.totalPages.set(res.TotalPages || 0);
          this.currentPage.set(res.Page || 1);
          this.pageSize.set(res.PageSize || 10);

          this.isLoading.set(false);
        },
        error: (err: any) => {
          console.error("Error loading Access:", err);
          this.toastSrv.showToast(
            err?.message || 'Error occurred while loading Access.',
            'error'
          );
          this.isLoading.set(false);
          this.allAccess.set([]);
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

    console.log(`Changing page from ${this.currentPage()} to ${newPage}`);

    this.currentPage.set(newPage);
    this.loadAccess();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onPageSizeChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const newPageSize = parseInt(target.value, 10);

    console.log(`Changing page size from ${this.pageSize()} to ${newPageSize}`);

    this.pageSize.set(newPageSize);
    this.currentPage.set(1);
    this.loadAccess();
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
    this.loadAccess();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
