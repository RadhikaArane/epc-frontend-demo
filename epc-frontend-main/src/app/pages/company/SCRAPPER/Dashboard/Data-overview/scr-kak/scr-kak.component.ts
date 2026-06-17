import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { breadCrumbItems } from '../../../../../../shared/models/models';
import { CommonModule } from '@angular/common';
import { BreadcrumbsComponent } from '../../../../../common/breadcrumbs/breadcrumbs.component';
import { ScrDashboardService } from '../../../../../../shared/services/scrapper/scr-dashboard.service';
import { ToastService } from '../../../../../../shared/services/componentServices/toast.service';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Kartaka_AgriItem } from '../../../../../../shared/models/scrapper-models/scrapperDashboard';

@Component({
  selector: 'app-scr-kak',
  standalone: true,
  imports: [CommonModule, BreadcrumbsComponent],
  templateUrl: './scr-kak.component.html',
  styleUrl: './scr-kak.component.scss'
})
export class ScrKAKComponent implements OnInit, OnDestroy {
  breadCrumbItems = signal<breadCrumbItems[]>([]);
  
  // Use the specific interface for the table rows
  overview = signal<Kartaka_AgriItem[]>([]);
  selectedState = signal<string>("Karnataka_Agri");
  currentPage = signal<number>(1);
  pageSize = signal<number>(10);
  totalRecords = signal<number>(0);
  totalPages = signal<number>(0);  
  scrappingDate = signal<string>('');
  isLoading = signal<boolean>(true);

  private scrDashboardSrv = inject(ScrDashboardService);
  private toastSrv = inject(ToastService);
  private router = inject(Router);
  private destroy$ = new Subject<void>();

  constructor() {
    this.breadCrumbItems.set([
      { label: 'Dashboard'},
    ]);
  }

  ngOnInit() {
    this.loadOverview();
  }

  loadOverview() {
    this.isLoading.set(true);

    const params = { 
      state: this.selectedState(), 
      page: this.currentPage(),
      pageSize: this.pageSize()
    };

    this.scrDashboardSrv._getStateOverview(params)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => { 
          if (res.items && res.items.length === 0) {
            console.log('Available Keys', Object.keys(res.items[0]));
          }
          
          this.overview.set(res.items || []);
          this.totalRecords.set(res.total || 0);
          this.totalPages.set(res.totalPages || 0);
          this.currentPage.set(res.page || 1);
          this.pageSize.set(res.pageSize || 10);
          this.scrappingDate.set(res.selectedScrappingDateTime);
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('Error loading overview:', err);
          this.toastSrv.showToast('Failed to load overview', 'error');
          this.isLoading.set(false);
          this.overview.set([]);
        }
      });
  }

  onPageChange(newPage: number): void {
    if (newPage < 1 || newPage > this.totalPages() || newPage === this.currentPage()) {
      return;
    }
    this.currentPage.set(newPage);
    this.loadOverview();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onPageSizeChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.pageSize.set(parseInt(target.value, 10));
    this.currentPage.set(1);
    this.loadOverview();
  }

  getVisiblePages(): number[] {
    const current = this.currentPage();
    const total = this.totalPages();
    if (total <= 0) return [];
    
    const pages: number[] = [];
    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      pages.push(1);
      if (current > 3) pages.push(-1);
      const start = Math.max(2, current - 1);
      const end = Math.min(total - 1, current + 1);
      for (let i = start; i <= end; i++) pages.push(i);
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

  BacktoDashboard(): void {
    this.router.navigate(['/scrDashboardComponent']);
  }

  onExportClick(): void {
    this.scrDashboardSrv.downloadStateAttachment(this.selectedState())
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}