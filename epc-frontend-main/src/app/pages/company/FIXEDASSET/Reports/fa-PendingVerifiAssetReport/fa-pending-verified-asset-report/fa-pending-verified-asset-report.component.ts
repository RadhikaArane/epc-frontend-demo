import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

import { BreadcrumbsComponent } from '../../../../../common/breadcrumbs/breadcrumbs.component';
import { breadCrumbItems } from '../../../../../../shared/models/models';
import { FaCampaignManagementService } from '../../../../../../shared/services/fixedAsset/fa-campaign-management.service';
import { FaNonVerifiedAssetSrvService } from '../../../../../../shared/services/fixedAsset/fa-non-verified-asset-srv.service';
import { Item } from '../../../../../../shared/models/fixedAsset-models/fa-non-verified-asset.model';
import { ToastService } from '../../../../../../shared/services/componentServices/toast.service';

@Component({
  selector: 'app-fa-pending-verified-asset-report',
  standalone: true,
  imports: [CommonModule, BreadcrumbsComponent],
  templateUrl: './fa-pending-verified-asset-report.component.html',
  styleUrl: './fa-pending-verified-asset-report.component.scss'
})
export class FaPendingVerifiedAssetReportComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();
  isExporting = signal(false);
  private toastSrv = inject(ToastService);
  private campaignSrv = inject(FaCampaignManagementService);
  private nonVerifiedSrv = inject(FaNonVerifiedAssetSrvService);

  breadCrumbItems = signal<breadCrumbItems[]>([
    { label: 'Non Verified Assets' }
  ]);

  campaigns = signal<any[]>([]);
  selectedCampaignId = signal<number | null>(null);

  tableData = signal<Item[]>([]);
  isLoading = signal<boolean>(false);

  currentPage = signal<number>(1);
  pageSize = signal<number>(10);
  totalRecords = signal<number>(0);
  totalPages = signal<number>(0);

  ngOnInit(): void {
    this.loadCampaigns();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadCampaigns(): void {
    this.campaignSrv._getCampaigns({})
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        this.campaigns.set(res || []);

        if (res?.length) {
          this.selectedCampaignId.set(res[0].Id);
          this.currentPage.set(1);
          this.loadData();
        }
      });
  }

  onCampaignChange(event: Event): void {
    const value = Number((event.target as HTMLSelectElement).value);
    this.selectedCampaignId.set(value);
    this.currentPage.set(1);
    this.loadData();
  }

  loadData(): void {
    if (!this.selectedCampaignId()) return;

    this.isLoading.set(true);

    this.nonVerifiedSrv.getNonVerifiedAssets({
      CampaignId: this.selectedCampaignId()!,
      page: this.currentPage(),
      pageSize: this.pageSize()
    })
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (res) => {
        this.tableData.set(res.Items ?? []);
        this.totalRecords.set(res.TotalRecords ?? 0);
        this.totalPages.set(res.TotalPages ?? 0);
        this.isLoading.set(false);
      },
      error: () => {
        this.tableData.set([]);
        this.totalRecords.set(0);
        this.totalPages.set(0);
        this.isLoading.set(false);
      }
    });
  }

//excel upload code 

//   exportToExcel(): void {
//   if (!this.selectedCampaignId()) return;

//   this.nonVerifiedSrv
//     .exportNonVerifiedAssets(this.selectedCampaignId()!)
//     .subscribe({
//       next: (blob: Blob) => {
//         const url = window.URL.createObjectURL(blob);
//         const a = document.createElement('a');

//         a.href = url;
//         a.download = `Non_Verified_Assets_Campaign_${this.selectedCampaignId()}.xlsx`;
//         a.click();

//         window.URL.revokeObjectURL(url);
//       },
//       error: (err) => {
//         console.error('Export failed', err);
//         alert('Excel download failed');
//       }
//     });
// }








exportToExcel(): void {
  if (!this.selectedCampaignId()) {
    return;
  }

  this.isExporting.set(true);

  this.nonVerifiedSrv
    .exportNonVerifiedAssets(this.selectedCampaignId()!)
    .subscribe({
      next: (blob: Blob) => {

        if (!blob || blob.size === 0) {
          this.toastSrv.showToast('File is empty or corrupt', 'error');
          this.isExporting.set(false);
          return;
        }

        const now = new Date();
        const date = now.toLocaleDateString('en-GB').replace(/\//g, '-');
        const time = now
          .toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          })
          .replace(/:/g, '-');

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');

        link.href = url;
        link.download = `Non_Verified_Assets_Campaign_${this.selectedCampaignId()}_${date}_${time}.xlsx`;

        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        this.toastSrv.showToast('Excel downloaded successfully.', 'success');
        this.isExporting.set(false);
      },
      error: (err) => {
        console.error('Export failed', err);

        this.toastSrv.showToast(
          err?.message || 'Excel download failed',
          'error'
        );

        this.isExporting.set(false);
      }
    });
}
































// ================= PAGINATION (SAME AS DASHBOARD) =================

  onPageChange(newPage: number): void {
    if (newPage < 1 || newPage > this.totalPages()) return;
    if (newPage === this.currentPage()) return;

    this.currentPage.set(newPage);
    this.loadData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onPageSizeChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const newPageSize = parseInt(target.value, 10);

    this.pageSize.set(newPageSize);
    this.currentPage.set(1);
    this.loadData();
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
}