import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { breadCrumbItems } from '../../../../../shared/models/models';
import { BreadcrumbsComponent } from '../../../../common/breadcrumbs/breadcrumbs.component';
import { AuthService } from '../../../../../shared/services/common/auth.service';
import { ToastService } from '../../../../../shared/services/componentServices/toast.service';
import { Subject, takeUntil } from 'rxjs';
import { DashboardCountResponse, DashboardResponse, Summary } from '../../../../../shared/models/fixedAsset-models/fa-dashBoardmodelModel';
import { FaDashboardSrvService } from '../../../../../shared/services/fixedAsset/fa-dashboard-srv.service';
import { FaCampaignManagementService } from '../../../../../shared/services/fixedAsset/fa-campaign-management.service';
import { Fixassetmodel } from '../../../../../shared/models/fixedAsset-models/fixedassets';
import { Router } from '@angular/router';
import { JwtService } from '../../../../../shared/services/common/jwt.service';

@Component({
  selector: 'app-fa-dashboard',
  standalone: true,
  imports: [BreadcrumbsComponent, CommonModule],
  templateUrl: './fa-dashboard.component.html',
  styleUrl: './fa-dashboard.component.scss'
})
export class FaDashboardComponent implements OnInit, OnDestroy {


  currentPage = signal<number>(1);
  pageSize = signal<number>(10);
  totalRecords = signal<number>(0);
  totalPages = signal<number>(0);


  private faCampaignSrv = inject(FaCampaignManagementService);

  campaigns = signal<Fixassetmodel[]>([]);
  selectedCampaignId = signal<number | null>(null);
  selectedCampaigName = signal<string | null>(null);


  private faDashboardSrv = inject(FaDashboardSrvService);
  private authSrv = inject(AuthService);
  private toastSrv = inject(ToastService);
  private destroy$ = new Subject<void>();
  private router = inject(Router);
  jwtSrv = inject(JwtService);

  breadCrumbItems = signal<breadCrumbItems[]>([
    { label: 'Dashboard' }
  ]);

  userName = signal(this.authSrv.userDetails?.name || 'User');
  isLoadingSummary = signal<boolean>(false);

  dashboardData = signal<Summary[]>([]);
  dashboardCount = signal<DashboardCountResponse | null>(null);

  errorMsg = signal<string>('');

  ngOnInit(): void {
    this.loadDashboardCount();

    this.loadCampaigns();
    this.dashboardData.set([]);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  viewNotAvailableAssets(): void {
    const status = "NotAvailable";
    const token = encodeURIComponent(this.jwtSrv.encrypt(status));
    this.router.navigate(
      ['/faVerifiedAssetComponent'],
      { queryParams: { token } }
    );
  }

  _goToAssetMaster(): void {
    this.router.navigate(
      ['/faAssetMasteraComponent'],

    );
  }
  _goToVerified(type: 'verified'): void {
    this.router.navigate(
      ['/faVerifiedAssetComponent'],

    );
  }
  _goToGhost(type: 'ghost'): void {
    this.router.navigate(
      ['/faGhostAssetComponent'],

    );
  }

  loadDashboardCount(): void {
    if (!this.selectedCampaignId()) {
      return;
    }

    this.isLoadingSummary.set(true);
    this.errorMsg.set('');

    this.faDashboardSrv
      ._getDashboardCount(this.selectedCampaignId()!)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: DashboardCountResponse) => {
          this.dashboardCount.set(res);
          this.isLoadingSummary.set(false);
        },
        error: (err: any) => {
          console.error('Dashboard count API failed', err);
          this.errorMsg.set('Failed to load dashboard count');
          this.toastSrv.showToast('Failed to load dashboard data', 'error');
          this.isLoadingSummary.set(false);
          this.dashboardCount.set(null);
        }
      });
  }

  loadCampaigns(): void {
    const params: any = {};

    this.faCampaignSrv
      ._getCampaigns(params)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: Fixassetmodel[]) => {
          const list = res || [];
          this.campaigns.set(list);

          // ✅ Auto select first campaign and load data
          if (list.length > 0) {
            this.selectedCampaignId.set(list[0].Id);
            const selected = this.campaigns().find(x => x.Id === this.selectedCampaignId());
            this.selectedCampaigName.set(selected?.Name ?? null);
            this.currentPage.set(1);
            this.loadDashboardCount();  // add for new dashboard count
            this.loadDashboardSummaryByCampaignId();
          }
        },
        error: (err) => {
          console.error('Campaign list error:', err);
          this.campaigns.set([]);
        }
      });
  }

  getSerialNumber(index: number): number {
    return (this.currentPage() - 1) * this.pageSize() + index + 1;
  }

  onCampaignChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;

    if (!value) {
      this.selectedCampaignId.set(null);
      this.dashboardData.set([]);
      this.dashboardCount.set(null); //  optional reset if do not want then delete this 
      this.totalRecords.set(0);
      this.totalPages.set(0);
      this.currentPage.set(1);
      return;
    }

    const campaignId = Number(value);
    this.selectedCampaignId.set(campaignId);
    const selected = this.campaigns().find(x => x.Id === campaignId);
    this.selectedCampaigName.set(selected?.Name ?? null);

    this.currentPage.set(1);
    this.loadDashboardCount();
    this.loadDashboardSummaryByCampaignId();
  }


  loadDashboardSummaryByCampaignId(): void {
    const campaignId = this.selectedCampaignId();

    if (!campaignId) {
      this.dashboardData.set([]);
      this.totalRecords.set(0);
      this.totalPages.set(0);
      this.currentPage.set(1);
      return;
    }

    this.isLoadingSummary.set(true);
    this.errorMsg.set('');

    const params = {
      CampaignId: campaignId,
      page: this.currentPage(),
      pageSize: this.pageSize()
    };

    this.faDashboardSrv._getDashboardSummary(params)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: DashboardResponse) => {

          // ✅ Table data
          this.dashboardData.set(res?.data?.Items || []);

          // ✅ IMPORTANT: Pagination values set 
          this.totalRecords.set(res?.data?.TotalCount || 0);
          this.totalPages.set(res?.data?.TotalPages || 0);

          // ✅ Sync current page & page size (optional but recommended)
          this.currentPage.set(res?.data?.Page || this.currentPage());
          this.pageSize.set(res?.data?.PageSize || this.pageSize());

          this.isLoadingSummary.set(false);
        },
        error: (err: any) => {
          console.error('Dashboard summary API failed', err);
          this.errorMsg.set('Failed to load dashboard summary');
          this.toastSrv.showToast('Failed to load dashboard summary', 'error');

          this.isLoadingSummary.set(false);
          this.dashboardData.set([]);
          this.totalRecords.set(0);
          this.totalPages.set(0);
        }
      });
  }

  downloadExcelByCampaign(): void {
    const campaignId = this.selectedCampaignId();
    if (!campaignId) {
      this.toastSrv.showToast('Please select a campaign', 'error');
      return;
    }

    const nameRaw = this.selectedCampaigName() ?? 'Campaign';
    const safeName = nameRaw
      .replace(/[<>:"/\\|?*\x00-\x1F]/g, '_') // windows filename safety
      .trim();

    this.faDashboardSrv._getExcelDownload(campaignId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (blob: Blob) => {
          if (blob && blob.size > 0) {
            const date = new Date().toISOString().split('T')[0];
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `Campaign_${safeName}_${date}.xlsx`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            this.toastSrv.showToast('Export completed successfully!', 'success');
          } else {
            this.toastSrv.showToast('Export file is empty', 'error');
          }
        },
        error: () => {
          this.toastSrv.showToast('Failed to export Campaign', 'error');
        }
      });
  }

  //pagination


  onPageChange(newPage: number): void {
    if (newPage < 1 || newPage > this.totalPages()) return;
    if (newPage === this.currentPage()) return;

    this.currentPage.set(newPage);
    this.loadDashboardSummaryByCampaignId();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onPageSizeChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const newPageSize = parseInt(target.value, 10);

    this.pageSize.set(newPageSize);
    this.currentPage.set(1);
    this.loadDashboardSummaryByCampaignId();
  }

  getVisiblePages(): number[] {
    const current = this.currentPage();
    const total = this.totalPages();
    const pages: number[] = [];

    if (total === 0) return pages;

    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i);
      return pages;
    }

    pages.push(1);

    let rangeStart = Math.max(2, current - 1);
    let rangeEnd = Math.min(total - 1, current + 1);

    if (rangeStart > 2) pages.push(-1);

    for (let i = rangeStart; i <= rangeEnd; i++) pages.push(i);

    if (rangeEnd < total - 1) pages.push(-2);

    pages.push(total);

    return pages;
  }

  getStartRecord(): number {
    if (this.totalRecords() === 0) return 0;
    return (this.currentPage() - 1) * this.pageSize() + 1;
  }

  getEndRecord(): number {
    const end = this.currentPage() * this.pageSize();
    return Math.min(end, this.totalRecords());
  }
  getProgressBarColor(percentage: number): string {
    if (percentage >= 80) {
      return 'linear-gradient(90deg, #0ea81d 0%, #4ceb17 100%)';
    } else if (percentage >= 50) {
      return 'linear-gradient(90deg, #f093fb 0%, #f5576c 100%)';
    } else {
      return 'linear-gradient(90deg, #fa709a 0%, #fee140 100%)';
    }
  }

  getBadgeColor(percentage: number): string {
    if (percentage >= 80) {
      return 'linear-gradient(135deg, #0ea81d 0%, #4ceb17 100%)';
    } else if (percentage >= 50) {
      return 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
    } else {
      return 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)';
    }
  }
}
