import { Component, inject, signal } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { breadCrumbItems } from '../../../../../../shared/models/models';
import { ScrDashboardService } from '../../../../../../shared/services/scrapper/scr-dashboard.service';
import { ToastService } from '../../../../../../shared/services/componentServices/toast.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BreadcrumbsComponent } from '../../../../../common/breadcrumbs/breadcrumbs.component';
import { Kartaka_HortiItem } from '../../../../../../shared/models/scrapper-models/scrapperDashboard';

@Component({
  selector: 'app-scr-kah',
  standalone: true,
  imports: [CommonModule,BreadcrumbsComponent],
  templateUrl: './scr-kah.component.html',
  styleUrl: './scr-kah.component.scss'
})
export class ScrKAHComponent {

  breadCrumbItems = signal<breadCrumbItems[]>([]);
  
    overview = signal<Kartaka_HortiItem[]>([]);
    selectedState = signal<string>('')
    currentPage = signal<number>(1);
    pageSize = signal<number>(10);
    totalRecords = signal<number>(0);
    totalPages = signal<number>(0);  
    scrappingDate = signal<string>('')
  
    isLoading = signal<boolean>(true);
  
    scrDashboardSrv = inject(ScrDashboardService);
    toastSrv = inject(ToastService);
    router = inject(Router);
  
    private destroy$ = new Subject<void>();
  
    constructor() {
      this.breadCrumbItems.set([
        { label: 'Dashboard' },
      ]);
    }
  
    ngOnInit() {
      this.loadOverview();
    }
  
  
    loadOverview() {
      this.isLoading.set(true);
      this.selectedState.set("Karnataka_Horti");
  
  
      const params = { 
        state: this.selectedState(), 
        page: this.currentPage(),
        pageSize: this.pageSize()
      };
   
  
      this.scrDashboardSrv._getStateOverview(params)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res: any) => { 
  
            this.overview.set(res.items || []);
            this.totalRecords.set(res.total || 0);
            this.totalPages.set(res.totalPages || 0);
            this.currentPage.set(res.page || 1);
            this.pageSize.set(res.pageSize || 10);
  
            this.scrappingDate.set(res.selectedScrappingDateTime);
  
            this.isLoading.set(false);
  
          },
          error: (err) => {
            console.error('Error loading job stats:', err);
            this.toastSrv.showToast('Failed to load overview', 'error');
            this.isLoading.set(false);
            this.overview.set([]);
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
      this.loadOverview();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  
    onPageSizeChange(event: Event): void {
      const target = event.target as HTMLSelectElement;
      const newPageSize = parseInt(target.value, 10);
  
      console.log(`Changing page size from ${this.pageSize()} to ${newPageSize}`);
  
      this.pageSize.set(newPageSize);
      this.currentPage.set(1);
      this.loadOverview();
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
      this.loadOverview();
    }
  
    BacktoDashboard(): void {
      this.router.navigate(['/scrDashboardComponent']);
    }
  
  
    
     onExportClick(): void {
      const state = "Karnataka_Horti";
      console.log('🚀 Export clicked for state:', state);
  
      this.scrDashboardSrv.downloadStateAttachment(state)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (success) => {
            console.log('Download completed:', success);
          },
          error: (err) => {
            console.error('Download failed:', err);
          }
        });
    }
  
  
  
    ngOnDestroy() {
      this.destroy$.next();
      this.destroy$.complete();
    }
    
}
