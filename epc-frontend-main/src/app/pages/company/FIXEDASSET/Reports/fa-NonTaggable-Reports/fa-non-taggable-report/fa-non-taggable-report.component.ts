import {
  Component,
  OnInit,
  signal,
  inject,
  ViewChild,
  ElementRef,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { BreadcrumbsComponent } from '../../../../../common/breadcrumbs/breadcrumbs.component'; // Adjust path
import { breadCrumbItems } from '../../../../../../shared/models/models'; // Adjust path
import { FaNonTaggableAssetService } from '../../../../../../shared/services/fixedAsset/fa-non-taggable-asset.service';
import {
  NonTaggableRequest,
  NonTaggableResponseApi,
} from '../../../../../../shared/models/fixedAsset-models/fa-NonTaggableReportModel';
import { ToastService } from '../../../../../../shared/services/componentServices/toast.service';
import { ConfirmationDialogService } from '../../../../../../shared/services/componentServices/confirmation-dialog.service';

@Component({
  selector: 'app-fa-non-taggable-report',
  standalone: true,
  imports: [CommonModule, BreadcrumbsComponent, FormsModule],
  templateUrl: './fa-non-taggable-report.component.html',
  styleUrl: './fa-non-taggable-report.component.scss',
})
export class FaNonTaggableReportComponent implements OnInit, OnDestroy {
  private nonTaggableService = inject(FaNonTaggableAssetService);
  private confirmDialogSrv = inject(ConfirmationDialogService);
  private toastService = inject(ToastService);
  private destroy$ = new Subject<void>();

  breadCrumbItems = signal<breadCrumbItems[]>([
    { label: 'Non Taggable Report' },
  ]);

  busyRowId = signal<number | null>(null);
  busyAction = signal<'Approve' | 'Reject' | null>(null);

  isRowBusy(id: number): boolean {
    return this.busyRowId() === id;
  }

  // Table Data Signals
  requestItems = signal<NonTaggableRequest[]>([]);
  totalRecords = signal<number>(0);
  totalPages = signal<number>(0);
  isLoading = signal<boolean>(false);

  // Pagination Signals
  currentPage = signal<number>(1);
  pageSize = signal<number>(10);

  // Filter Signals
  selectedStatus = signal<string>('All');
  statusList = signal<string[]>(['Pending', 'Approved', 'Rejected']);

  @ViewChild('confirmModal') confirmModalRef!: ElementRef<HTMLElement>;

  itemToAction = signal<NonTaggableRequest | null>(null);

  actionType = signal<'Approve' | 'Reject' | null>(null);

  ngOnInit(): void {
    console.log('🏁 [Component] Init Started');
    this.loadData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ========================
  // LOAD DATA
  // ========================
  loadData(): void {
    this.isLoading.set(true);

    const apiParams = {
      page: this.currentPage(),
      pageSize: this.pageSize(),
      status: this.selectedStatus(),
    };

    console.log('🔄 [Component] Calling Service with:', apiParams);

    this.nonTaggableService
      ._getNonTaggableRequests(apiParams)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          console.log('✅ [Component] API Response Received:', res);

          const items: NonTaggableRequest[] = (res?.Items || []).map(
            (x: any) => ({
              requestId: x.RequestId,
              campaignName: x.CampaignName,
              assetNumber: x.AssetNumber,
              requestedBy: x.RequestedBy,
              requestedOn: x.RequestedOn,
              reason: x.Reason,
              photoPath: x.PhotoPath,
              status: x.Status,
              reviewedBy: x.ReviewedBy,
              reviewedOn: x.ReviewedOn,
              reviewRemarks: x.ReviewRemarks,
            }),
          );

          this.requestItems.set(items);

          // ✅ totals keys also PascalCase
          this.totalRecords.set(res?.TotalCount || 0);

          const calculatedPages = Math.ceil(
            (res?.TotalCount || 0) / this.pageSize(),
          );
          this.totalPages.set(res?.TotalPages || calculatedPages);

          this.isLoading.set(false);
        },
        error: (err) => {
          console.error(' [Component] API Error:', err);
          this.isLoading.set(false);
          this.requestItems.set([]);
        },
      });
  }

  // ========================
  // ACTIONS: APPROVE / REJECT
  // ========================
  // ========================
  // 1. OPEN CONFIRMATION MODAL
  // ========================
  async openConfirmModal(
    action: 'Approve' | 'Reject',
    item: NonTaggableRequest,
  ): Promise<void> {
    const confirmed = await this.confirmDialogSrv.showConfirm(
      `Are you sure you want to ${action.toLowerCase()} "${item.campaignName}"?`,
      `Confirm ${action}`,
    );

    if (!confirmed) return;

    // ✅ Row-wise loading start
    this.busyRowId.set(item.requestId);
    this.busyAction.set(action);

    const apiCall =
      action === 'Approve'
        ? this.nonTaggableService._approveRequest(item.requestId)
        : this.nonTaggableService._rejectRequest(item.requestId);

    apiCall.pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        const newStatus = action === 'Approve' ? 'Approved' : 'Rejected';

        // ✅ UI lo status instant update (row remove cheyyaku)
        this.requestItems.update((list) =>
          list.map((r) =>
            r.requestId === item.requestId ? { ...r, status: newStatus } : r,
          ),
        );

        this.toastService.showToast(
          `Asset ${newStatus} successfully!`,
          'success',
        );

        // ✅ Row-wise loading stop
        this.busyRowId.set(null);
        this.busyAction.set(null);
      },
      error: (err) => {
        console.error(`❌ ${action} error`, err);

        this.toastService.showToast(
          err.error?.message || `Failed to ${action.toLowerCase()} Asset`,
          'error',
        );

        // ✅ Row-wise loading stop
        this.busyRowId.set(null);
        this.busyAction.set(null);
      },
    });
  }

  // ========================
  // 2. PROCEED WITH ACTION (Called when user clicks "Yes")
  // ========================
  proceedWithAction(): void {
    const item = this.itemToAction();
    const action = this.actionType();

    if (!item || !action) return;

    // Close Modal immediately
    this.closeConfirmModal();
    this.isLoading.set(true);

    if (action === 'Approve') {
      this.nonTaggableService
        ._approveRequest(item.requestId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.toastService.showToast(
              'Request Approved Successfully',
              'success',
            );
            this.loadData();
          },
          error: () => {
            this.toastService.showToast('Failed to Approve Request', 'error');
            this.isLoading.set(false);
          },
        });
    } else {
      this.nonTaggableService
        ._rejectRequest(item.requestId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.toastService.showToast(
              'Request Rejected Successfully',
              'success',
            );
            this.loadData();
          },
          error: () => {
            this.toastService.showToast('Failed to Reject Request', 'error');
            this.isLoading.set(false);
          },
        });
    }
  }

  closeConfirmModal(): void {
    if (this.confirmModalRef) {
      const modalElement = this.confirmModalRef.nativeElement;
      const bootstrapModal = (window as any).bootstrap.Modal.getInstance(
        modalElement,
      );
      if (bootstrapModal) bootstrapModal.hide();
    }
    // Reset state
    this.itemToAction.set(null);
    this.actionType.set(null);
  }

  // ========================
  // EVENTS & FILTERS
  // ========================
  onFilterChange(): void {
    console.log('🔍 [Filter] Status changed to:', this.selectedStatus());
    this.currentPage.set(1);
    this.loadData();
  }

  onPageChange(newPage: number): void {
    if (newPage < 1 || newPage > this.totalPages()) return;

    console.log('📄 [Pagination] Changing page to:', newPage);
    this.currentPage.set(newPage);
    this.loadData();
  }

  onPageSizeChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const newSize = parseInt(target.value, 10);

    console.log('📏 [Pagination] Changing page size to:', newSize);
    this.pageSize.set(newSize);
    this.currentPage.set(1);
    this.loadData();
  }

  // ========================
  // VIEW / MODAL LOGIC
  // ========================
  // onViewClick(item: NonTaggableRequest): void {
  //   console.log('👁️ [Modal] Opening view for Request ID:', item.requestId);
  //   this.selectedRequest.set(item);
  //   this.openModal();
  // }

  // openModal(): void {
  //   if (this.viewAssetModalRef) {
  //     const modalElement = this.viewAssetModalRef.nativeElement;
  //     const bootstrapModal = new (window as any).bootstrap.Modal(modalElement, {
  //       backdrop: 'static',
  //     });
  //     bootstrapModal.show();
  //   }
  // }

  // closeModal(): void {
  //   if (this.viewAssetModalRef) {
  //     const modalElement = this.viewAssetModalRef.nativeElement;
  //     const bootstrapModal = (window as any).bootstrap.Modal.getInstance(
  //       modalElement,
  //     );
  //     if (bootstrapModal) {
  //       bootstrapModal.hide();
  //     }
  //     this.selectedRequest.set(null);
  //   }
  // }

  // ========================
  // HELPERS
  // ========================
  getSerialNumber(index: number): number {
    return (this.currentPage() - 1) * this.pageSize() + index + 1;
  }

  getStartRecord(): number {
    return this.totalRecords() === 0
      ? 0
      : (this.currentPage() - 1) * this.pageSize() + 1;
  }

  getEndRecord(): number {
    return Math.min(this.currentPage() * this.pageSize(), this.totalRecords());
  }

  getVisiblePages(): number[] {
    const current = this.currentPage();
    const total = this.totalPages();
    const pages: number[] = [];

    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      pages.push(1);
      if (current > 3) pages.push(-1); // Ellipsis

      let start = Math.max(2, current - 1);
      let end = Math.min(total - 1, current + 1);

      for (let i = start; i <= end; i++) pages.push(i);

      if (current < total - 2) pages.push(-2); // Ellipsis
      pages.push(total);
    }
    return pages;
  }
}
