 import { CommonModule } from '@angular/common';
  import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
  import { BreadcrumbsComponent } from '../../../../common/breadcrumbs/breadcrumbs.component';
  import { AuthService } from '../../../../../shared/services/common/auth.service';
  import { ToastService } from '../../../../../shared/services/componentServices/toast.service';
  import { UrManageSettingsService } from '../../../../../shared/services/unrecognisedInvoice/ur-manage-settings.service';
  import { JwtService } from '../../../../../shared/services/common/jwt.service';
  import { ConfirmationDialogService } from '../../../../../shared/services/componentServices/confirmation-dialog.service';
  import { Router } from '@angular/router';
  import { breadCrumbItems } from '../../../../../shared/models/models';
  import { Subject, takeUntil } from 'rxjs';
import { States } from '../../../../../shared/models/unrecognisedInvoice-models/settings';

@Component({
  selector: 'app-ur-states',
  standalone: true,
  imports: [CommonModule, BreadcrumbsComponent],
  templateUrl: './ur-states.component.html',
  styleUrl: './ur-states.component.scss'
})
export class UrStatesComponent implements OnInit, OnDestroy{
 
    authSrv = inject(AuthService);
    toastSrv = inject(ToastService);
    urSettingSrv = inject(UrManageSettingsService);
    jwtSrv = inject(JwtService);
    confirmationDialogSrv = inject(ConfirmationDialogService);
    router = inject(Router);
  
    breadCrumbItems = signal<breadCrumbItems[]>([]);
    isLoading = signal<boolean>(true);
    allStates = signal<States[]>([]);
  
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
      this.loadStates();
    }
  
    // ==================== PROJECT MANAGEMENT METHODS ====================
  
    private loadStates(): void {
      this.isLoading.set(true);
  
      const params = {
        page: this.currentPage(),
        pageSize: this.pageSize()
      };
  
      console.log('Loading States with params:', params);
  
      this.urSettingSrv._getStates(params)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res: any) => {
            console.log("STates response:", res);
  
            this.allStates.set(res.Items || []);
            this.totalRecords.set(res.TotalRecords || 0);
            this.totalPages.set(res.TotalPages || 0);
            this.currentPage.set(res.Page || 1);
            this.pageSize.set(res.PageSize || 10);
  
            this.isLoading.set(false);
          },
          error: (err: any) => {
            console.error("Error loading States:", err);
            this.toastSrv.showToast(
              err?.message || 'Error occurred while loading States.',
              'error'
            );
            this.isLoading.set(false);
            this.allStates.set([]);
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
      this.loadStates();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  
    onPageSizeChange(event: Event): void {
      const target = event.target as HTMLSelectElement;
      const newPageSize = parseInt(target.value, 10);
  
      console.log(`Changing page size from ${this.pageSize()} to ${newPageSize}`);
  
      this.pageSize.set(newPageSize);
      this.currentPage.set(1);
      this.loadStates();
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
      this.loadStates();
    }
  
    ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete();
    }
    
  

}
