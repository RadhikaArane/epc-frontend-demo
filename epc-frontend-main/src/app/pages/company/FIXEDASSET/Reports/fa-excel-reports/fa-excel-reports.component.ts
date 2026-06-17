import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

import { BreadcrumbsComponent } from '../../../../common/breadcrumbs/breadcrumbs.component';
import { breadCrumbItems } from '../../../../../shared/models/models';
import { ToastService } from '../../../../../shared/services/componentServices/toast.service';
import { FaExcelMasterReportSrvService } from '../../../../../shared/services/fixedAsset/fa-excel-master-report-srv.service';
import { FaCampaignManagementService } from '../../../../../shared/services/fixedAsset/fa-campaign-management.service';
import { Fixassetmodel } from '../../../../../shared/models/fixedAsset-models/fixedassets';

@Component({
  selector: 'app-fa-excel-reports',
  standalone: true,
  imports: [CommonModule, BreadcrumbsComponent],
  templateUrl: './fa-excel-reports.component.html',
  styleUrl: './fa-excel-reports.component.scss'
})
export class FaExcelReportsComponent implements OnInit, OnDestroy {
   

  private excelSrv = inject(FaExcelMasterReportSrvService);
  private toastSrv = inject(ToastService);
  private faCampaignSrv = inject(FaCampaignManagementService);

  private destroy$ = new Subject<void>();

  selectedCampaignId = signal<number | null>(null);
  campaigns = signal<Fixassetmodel[]>([]);

  breadCrumbItems = signal<breadCrumbItems[]>([
    { label: 'Dashboard' }
  ]);

  // 🔄 Load campaigns same as Dashboard
  ngOnInit(): void {
    this.loadCampaigns();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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

          // ✅ Auto-select first campaign
          if (list.length > 0) {
            this.selectedCampaignId.set(list[0].Id);
          }
        },
        error: (err) => {
          console.error('Campaign list error:', err);
          this.campaigns.set([]);
          this.toastSrv.showToast('Failed to load campaigns', 'error');
        }
      });
  }

  onCampaignChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedCampaignId.set(value ? Number(value) : null);
  }

  downloadMasterStatus(): void {
    if (!this.selectedCampaignId()) {
      this.toastSrv.showToast('Please select campaign', 'warning');
      return;
    }

    this.excelSrv.exportMasterStatus(this.selectedCampaignId()!)
      .subscribe({
        next: (blob) => this.downloadFile(blob, 'Master_Status_Report'),
        error: () => this.toastSrv.showToast('Download failed', 'error')
      });
  }

  downloadGhostReport(): void {
    if (!this.selectedCampaignId()) {
      this.toastSrv.showToast('Please select campaign', 'warning');
      return;
    }

    this.excelSrv.exportGhostAssets(this.selectedCampaignId()!)
      .subscribe({
        next: (blob) => this.downloadFile(blob, 'Ghost_Asset_Report'),
        error: () => this.toastSrv.showToast('Download failed', 'error')
      });
  }

  private downloadFile(blob: Blob, name: string): void {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name}.xlsx`;
    a.click();
    window.URL.revokeObjectURL(url);

    this.toastSrv.showToast('Excel downloaded successfully', 'success');
  }
}
