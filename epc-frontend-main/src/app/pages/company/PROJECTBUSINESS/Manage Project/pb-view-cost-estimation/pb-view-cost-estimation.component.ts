import { Component, inject, signal, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil, forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BreadcrumbsComponent } from '../../../../common/breadcrumbs/breadcrumbs.component';
import { breadCrumbItems } from '../../../../../shared/models/models';
import { JwtService } from '../../../../../shared/services/common/jwt.service';
import { ToastService } from '../../../../../shared/services/componentServices/toast.service';
import { PbProjectManagementService } from '../../../../../shared/services/projectBusiness/pb-project-management.service';
import { GetAllProject, CostHeadItem, VendorInfo, ExistingAttachment, RevisionInfo } from '../../../../../shared/models/projectBusiness-models/projectmanagement';

@Component({
  selector: 'app-pb-view-cost-estimation',
  standalone: true,
  imports: [CommonModule, BreadcrumbsComponent],
  templateUrl: './pb-view-cost-estimation.component.html',
  styleUrl: './pb-view-cost-estimation.component.scss'
})
export class PbViewCostEstimationComponent implements OnInit, OnDestroy {
  // Services
  private jwtSrv = inject(JwtService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private toastSrv = inject(ToastService);
  private projectSrv = inject(PbProjectManagementService);

  // Signals
  breadCrumbItems = signal<breadCrumbItems[]>([
    { label: 'Project Management' },
    { label: 'View Cost Estimation' }
  ]);

  projectId = signal<string | null>(null);
  projectDetails = signal<GetAllProject | null>(null);
  costHeadItems = signal<CostHeadItem[]>([]);
  isLoadingProject = signal<boolean>(false);

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.loadProjectIdFromUrl();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ==================== Load Project ID from URL ====================

  private loadProjectIdFromUrl(): void {
    this.activatedRoute.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (params: any) => {
          const token = params['token'];
          if (token) {
            try {
              const decryptedId = this.jwtSrv.decrypt(decodeURIComponent(token));
              this.projectId.set(decryptedId);
              this.loadProjectData(decryptedId);
            } catch (error) {
              console.error('Invalid token:', error);
              this.toastSrv.showToast('Invalid project token', 'error');
              this.navigateBack();
            }
          } else {
            this.toastSrv.showToast('Project ID is missing', 'error');
            this.navigateBack();
          }
        },
        error: (error) => {
          console.error('Error loading project ID:', error);
          this.toastSrv.showToast('Error loading project information', 'error');
          this.navigateBack();
        }
      });
  }

  // ==================== Load Project Data ====================

  private loadProjectData(projectId: string): void {
    this.isLoadingProject.set(true);

    forkJoin({
      details: this.projectSrv._getProjectById(projectId),
      costHeads: this.projectSrv._getProjectCostHeadAmounts(projectId)
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (results) => {
          if (results.details?.StatusCode === 200 && results.details?.item) {
            this.projectDetails.set(results.details.item);
          } else {
            this.toastSrv.showToast('Project not found', 'error');
            this.navigateBack();
            return;
          }

          if (results.costHeads?.StatusCode === 200 && results.costHeads?.Items) {
            this.createCostHeadItems(results.costHeads.Items, projectId);
          } else {
            this.costHeadItems.set([]);
          }

          this.isLoadingProject.set(false);
        },
        error: (err: any) => {
          console.error('Error loading project data:', err);
          this.toastSrv.showToast('Error loading project data', 'error');
          this.isLoadingProject.set(false);
          this.navigateBack();
        }
      });
  }

  // ==================== Create Cost Head Items ====================

  private createCostHeadItems(items: any[], projectId: string): void {
    const costHeads: CostHeadItem[] = items.map(item => ({
      ProjectCostHeadId: item.ProjectCostHeadId,
      CostHeadId: item.CostHeadId,
      CostHeadName: item.CostHeadName,
      CostBasis: item.CostBasis || '',
      Amount: item.Amount || 0,
      vendors: [],
      revisions: [],
      isLoadingVendors: false,
      isLoadingRevisions: false
    }));

    this.costHeadItems.set(costHeads);

    costHeads.forEach((costHead, index) => {
      this.loadVendorsAndRevisions(costHead, index, projectId);
    });
  }

  // ==================== Load Vendors and Revisions ====================

  private loadVendorsAndRevisions(costHead: CostHeadItem, index: number, projectId: string): void {
    this.updateCostHeadLoadingState(index, 'isLoadingVendors', true);
    this.updateCostHeadLoadingState(index, 'isLoadingRevisions', true);

    forkJoin({
      vendors: this.projectSrv._getProjectCostHeadVendors(costHead.ProjectCostHeadId).pipe(
        catchError(() => of({ StatusCode: 200, items: [] }))
      ),
      revisions: this.projectSrv._getProjectCostHeadRevisions(projectId, costHead.CostHeadId).pipe(
        catchError(() => of({ StatusCode: 200, data: { Revisions: [] } }))
      )
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (results) => {
          // Handle vendors
          if (results.vendors?.StatusCode === 200 && results.vendors?.items) {
            const vendors: VendorInfo[] = results.vendors.items.map((v: any) => ({
              ProjectCostHeadVendorId: v.ProjectCostHeadVendorId,
              VendorId: v.VendorId,
              Name: v.Name,
              attachments: [],
              isLoadingAttachments: false
            }));

            this.updateCostHeadVendors(index, vendors);

            vendors.forEach((vendor, vendorIndex) => {
              this.loadVendorAttachments(index, vendorIndex, vendor.ProjectCostHeadVendorId);
            });
          }

          // Handle revisions
          const revisionsData = results.revisions?.data || results.revisions?.Data;
          const revisions = revisionsData?.Revisions || revisionsData?.revisions || [];

          if (revisions && revisions.length > 0) {
            const mappedRevisions: RevisionInfo[] = revisions.map((rev: any) => ({
              historyId: rev.HistoryId || rev.historyId,
              amount: rev.Amount || rev.amount,
              periodMonth: rev.PeriodMonth || rev.periodMonth,
              periodMonthDisplay: rev.PeriodMonthDisplay || rev.periodMonthDisplay,
              source: rev.Source || rev.source,
              createdOnUtc: rev.CreatedOnUtc || rev.createdOnUtc,
              revisionNumber: rev.RevisionNumber || rev.revisionNumber,
              runningTotal: rev.RunningTotal || rev.runningTotal
            }));

            // Sort by revision number ascending
            const sortedRevisions = mappedRevisions.sort((a, b) => a.revisionNumber - b.revisionNumber);
            this.updateCostHeadRevisions(index, sortedRevisions);
          }

          this.updateCostHeadLoadingState(index, 'isLoadingVendors', false);
          this.updateCostHeadLoadingState(index, 'isLoadingRevisions', false);
        },
        error: () => {
          this.updateCostHeadLoadingState(index, 'isLoadingVendors', false);
          this.updateCostHeadLoadingState(index, 'isLoadingRevisions', false);
        }
      });
  }

  // ==================== Load Vendor Attachments ====================

  private loadVendorAttachments(costHeadIndex: number, vendorIndex: number, projectCostHeadVendorId: string): void {
    this.updateVendorLoadingState(costHeadIndex, vendorIndex, true);

    this.projectSrv._getVendorAttachments(projectCostHeadVendorId)
      .pipe(
        takeUntil(this.destroy$),
        catchError(() => of({ StatusCode: 200, items: [] }))
      )
      .subscribe({
        next: (response: any) => {
          if (response?.StatusCode === 200 && response?.items) {
            this.updateVendorAttachments(costHeadIndex, vendorIndex, response.items);
          }
          this.updateVendorLoadingState(costHeadIndex, vendorIndex, false);
        },
        error: () => {
          this.updateVendorLoadingState(costHeadIndex, vendorIndex, false);
        }
      });
  }

  // ==================== Update State Helpers ====================

  private updateCostHeadLoadingState(index: number, field: 'isLoadingVendors' | 'isLoadingRevisions', loading: boolean): void {
    const items = [...this.costHeadItems()];
    if (items[index]) {
      items[index] = { ...items[index], [field]: loading };
      this.costHeadItems.set(items);
    }
  }

  private updateCostHeadVendors(index: number, vendors: VendorInfo[]): void {
    const items = [...this.costHeadItems()];
    if (items[index]) {
      items[index] = { ...items[index], vendors };
      this.costHeadItems.set(items);
    }
  }

  private updateCostHeadRevisions(index: number, revisions: RevisionInfo[]): void {
    const items = [...this.costHeadItems()];
    if (items[index]) {
      items[index] = { ...items[index], revisions };
      this.costHeadItems.set(items);
    }
  }

  private updateVendorLoadingState(costHeadIndex: number, vendorIndex: number, loading: boolean): void {
    const items = [...this.costHeadItems()];
    if (items[costHeadIndex]?.vendors[vendorIndex]) {
      const vendors = [...items[costHeadIndex].vendors];
      vendors[vendorIndex] = { ...vendors[vendorIndex], isLoadingAttachments: loading };
      items[costHeadIndex] = { ...items[costHeadIndex], vendors };
      this.costHeadItems.set(items);
    }
  }

  private updateVendorAttachments(costHeadIndex: number, vendorIndex: number, attachments: ExistingAttachment[]): void {
    const items = [...this.costHeadItems()];
    if (items[costHeadIndex]?.vendors[vendorIndex]) {
      const vendors = [...items[costHeadIndex].vendors];
      vendors[vendorIndex] = { ...vendors[vendorIndex], attachments };
      items[costHeadIndex] = { ...items[costHeadIndex], vendors };
      this.costHeadItems.set(items);
    }
  }

  // ==================== Download Attachment ====================

  downloadAttachment(attachmentId: string, projectCostHeadVendorId: string, fileName: string): void {
    this.toastSrv.showToast('Preparing download...', 'warning');

    this.projectSrv._getVendorAttachmentDownload({
      attachmentId,
      projectCostHeadVendorId
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (blob: Blob) => {
          if (blob && blob.size > 0) {
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            this.toastSrv.showToast('Download completed', 'success');
          } else {
            this.toastSrv.showToast('File is empty', 'error');
          }
        },
        error: () => {
          this.toastSrv.showToast('Download failed', 'error');
        }
      });
  }

  // ==================== Helper Functions ====================

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }

  onCancel(): void {
    this.navigateBack();
  }

  navigateBack(): void {
    this.router.navigate(['/pbProjectManagementComponent']);
  }
}