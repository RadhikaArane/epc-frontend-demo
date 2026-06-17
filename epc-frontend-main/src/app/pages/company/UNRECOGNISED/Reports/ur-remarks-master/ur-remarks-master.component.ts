import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { BreadcrumbsComponent } from '../../../../common/breadcrumbs/breadcrumbs.component';
import { breadCrumbItems } from '../../../../../shared/models/models';
import { PredefinedRemarksItem } from '../../../../../shared/models/unrecognisedInvoice-models/reports';
import { UrReportsService } from '../../../../../shared/services/unrecognisedInvoice/ur-reports.service';
import { ToastService } from '../../../../../shared/services/componentServices/toast.service';
import { ConfirmationDialogService } from '../../../../../shared/services/componentServices/confirmation-dialog.service';

@Component({
  selector: 'app-ur-remarks-master',
  standalone: true,
  imports: [CommonModule, BreadcrumbsComponent, ReactiveFormsModule],
  providers: [DatePipe],
  templateUrl: './ur-remarks-master.component.html',
  styleUrl: './ur-remarks-master.component.scss',
})
export class UrRemarksMasterComponent implements OnInit, OnDestroy {
  private urReportsSrv = inject(UrReportsService);
  private fb = inject(FormBuilder);
  private toastSrv = inject(ToastService);
  private datePipe = inject(DatePipe);
  private confirmSrv = inject(ConfirmationDialogService);
  private destroy$ = new Subject<void>();

  breadCrumbItems = signal<breadCrumbItems[]>([{ label: 'Reports' }]);

  // Table
  isLoading = signal(false);
  rows = signal<PredefinedRemarksItem[]>([]);
  totalCount = signal(0);

  // Pagination
  currentPage = signal(1);
  pageSize = signal(10);
  totalPages = signal(0);

  // Create Modal
  showCreateModal = signal(false);
  isSaving = signal(false);

  createForm = this.fb.group({
    billingRRPendingReason: ['', Validators.required],
    actionToBeTakenForCompletionRR: ['', Validators.required],
  });

  // Update Modal
  showUpdateModal = signal(false);
  isUpdating = signal(false);
  selectedId = signal('');

  updateForm = this.fb.group({
    billingRRPendingReason: ['', Validators.required],
    actionToBeTakenForCompletionRR: ['', Validators.required],
  });

  ngOnInit(): void {
    this.loadData();
  }

  // ─── Data Load ──────────────────────────────────────────

  loadData(): void {
    this.isLoading.set(true);

    this.urReportsSrv
      ._getPredefinedRemarks(this.currentPage(), this.pageSize())
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          const data = res?.data ?? res ?? {};
          const items = data?.items ?? data?.Items ?? [];
          const total = Number(data?.totalCount ?? data?.TotalCount ?? 0);

          this.rows.set(Array.isArray(items) ? items : []);
          this.totalCount.set(total);
          this.totalPages.set(total === 0 ? 1 : Math.ceil(total / this.pageSize()));
          this.isLoading.set(false);
        },
        error: () => {
          this.toastSrv.showToast('Failed to load predefined remarks', 'error');
          this.rows.set([]);
          this.totalCount.set(0);
          this.totalPages.set(1);
          this.isLoading.set(false);
        },
      });
  }

  // ─── Pagination ─────────────────────────────────────────

  onPageChange(newPage: number): void {
    if (newPage < 1 || newPage > this.totalPages()) {
      return;
    }

    if (newPage === this.currentPage()) {
      return;
    }

    console.log(`Changing page from ${this.currentPage()} to ${newPage}`);

    this.currentPage.set(newPage);
    this.loadData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onPageSizeChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const newPageSize = parseInt(target.value, 10);

    console.log(`Changing page size from ${this.pageSize()} to ${newPageSize}`);

    this.pageSize.set(newPageSize);
    this.currentPage.set(1);
    this.loadData();
  }

  getStartRecord(): number {
    return this.totalCount() === 0 ? 0 : (this.currentPage() - 1) * this.pageSize() + 1;
  }

  getEndRecord(): number {
    return Math.min(this.currentPage() * this.pageSize(), this.totalCount());
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

  // ─── Create Modal ───────────────────────────────────────

  openCreateModal(): void {
    this.createForm.reset();
    this.showCreateModal.set(true);
  }

  closeCreateModal(): void {
    this.showCreateModal.set(false);
  }

  saveCreate(): void {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      this.toastSrv.showToast('Please fill required fields', 'warning');
      return;
    }

    const payload = {
      billingRRPendingReason: String(this.createForm.value.billingRRPendingReason || '').trim(),
      actionToBeTakenForCompletionRR: String(this.createForm.value.actionToBeTakenForCompletionRR || '').trim(),
    };

    this.isSaving.set(true);

    this.urReportsSrv._createPredefinedRemark(payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.toastSrv.showToast('Remark created successfully', 'success');
          this.isSaving.set(false);
          this.closeCreateModal();
          this.currentPage.set(1);
          this.loadData();
        },
        error: (err) => {
          if (err?.status === 200) {
            this.toastSrv.showToast('Remark created successfully', 'success');
            this.closeCreateModal();
            this.currentPage.set(1);
            this.loadData();
          } else {
            this.toastSrv.showToast(err?.error?.message || 'Create failed', 'error');
          }
          this.isSaving.set(false);
        },
      });
  }

  // ─── Update Modal ───────────────────────────────────────

  openUpdateModal(row: PredefinedRemarksItem): void {
    this.selectedId.set(String(row.PredefinedRemarkNo));
    this.updateForm.patchValue({
      billingRRPendingReason: row.BillingRRPendingReason,
      actionToBeTakenForCompletionRR: row.ActionToBeTakenForCompletionRR,
    });
    this.showUpdateModal.set(true);
  }

  closeUpdateModal(): void {
    this.showUpdateModal.set(false);
  }

  saveUpdate(): void {
    if (this.updateForm.invalid) {
      this.updateForm.markAllAsTouched();
      this.toastSrv.showToast('Please fill required fields', 'warning');
      return;
    }

    const payload = {
      id: this.selectedId(),
      billingRRPendingReason: String(this.updateForm.value.billingRRPendingReason || '').trim(),
      actionToBeTakenForCompletionRR: String(this.updateForm.value.actionToBeTakenForCompletionRR || '').trim(),
    };

    this.isUpdating.set(true);

    this.urReportsSrv._updatePredefinedRemark(payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.toastSrv.showToast('Remark updated successfully', 'success');
          this.isUpdating.set(false);
          this.closeUpdateModal();

          // Instant UI update
          this.rows.update(rows =>
            rows.map(r =>
              String(r.PredefinedRemarkNo) === payload.id
                ? { ...r, BillingRRPendingReason: payload.billingRRPendingReason, ActionToBeTakenForCompletionRR: payload.actionToBeTakenForCompletionRR }
                : r
            )
          );
        },
        error: () => {
          this.toastSrv.showToast('Update failed', 'error');
          this.isUpdating.set(false);
        },
      });
  }

  // ─── Delete ─────────────────────────────────────────────

  async openDeleteDialog(id: number): Promise<void> {
    const confirmed = await this.confirmSrv.showConfirm('Do you want to delete this Remark?', 'Delete Confirmation');
    if (confirmed) this.deleteRemark(id);
  }

  private deleteRemark(id: number): void {
    this.urReportsSrv._deletePredefinedRemark(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.toastSrv.showToast('Remark deleted successfully', 'success');
          // If last item on page, go back one page
          if (this.rows().length === 1 && this.currentPage() > 1) {
            this.currentPage.update(p => p - 1);
          }
          this.loadData();
        },
        error: () => this.toastSrv.showToast('Failed to delete Remark', 'error'),
      });
  }

  // ─── Helper ─────────────────────────────────────────────

  formatDt(s: any): string {
    if (!s) return '-';
    const dt = new Date(String(s));
    return isNaN(dt.getTime()) ? String(s) : this.datePipe.transform(dt, 'dd-MM-yyyy HH:mm') || '-';
  }

  // Form field validation helper
  isInvalid(form: FormGroup, field: string): boolean {
    const ctrl = form.get(field);
    return ctrl ? ctrl.invalid && (ctrl.dirty || ctrl.touched) : false;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}