import { Component, inject, signal, OnDestroy, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { ToastService } from '../../../../../shared/services/componentServices/toast.service';
import { ConfirmationDialogService } from '../../../../../shared/services/componentServices/confirmation-dialog.service';
import { PbProjectManagementService } from '../../../../../shared/services/projectBusiness/pb-project-management.service';
import { GetCostHead, GetSubHead } from '../../../../../shared/models/projectBusiness-models/projectmanagement';

@Component({
  selector: 'app-pb-manage-sub-cost-heads',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './pb-manage-sub-cost-heads.component.html',
  styleUrl: './pb-manage-sub-cost-heads.component.scss'
})
export class PbManageSubCostHeadsComponent implements OnInit, OnDestroy {

  // Services
  private fb = inject(FormBuilder);
  private toastSrv = inject(ToastService);
  private confirmationDialogSrv = inject(ConfirmationDialogService);
  private projectSrv = inject(PbProjectManagementService);

  // Cost Heads (for form dropdown + table filter dropdown)
  allCostHeads = signal<GetCostHead[]>([]);
  isLoadingCostHeads = signal<boolean>(false);

  // Table filter (independent from form)
  filterCostHeadId = signal<string>('');

  // Sub Heads list
  allSubHeads = signal<GetSubHead[]>([]);
  isLoadingSubHeads = signal<boolean>(false);

  // Form state
  isEditingSubHead = signal<boolean>(false);
  selectedSubHeadId = signal<string>('');
  isSubHeadSubmitting = signal<boolean>(false);
  showActiveOnly = signal<boolean>(true);

  @Output() subHeadsUpdated = new EventEmitter<void>();

  subHeadForm!: FormGroup;
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.initializeForm();
    this.loadCostHeads();
    this.loadSubHeads(); // load all on open, no filter
  }

  // ==================== Form ====================

  private initializeForm(): void {
    this.subHeadForm = this.fb.group({
      costHeadId: ['', Validators.required],
      name: ['', [Validators.required, Validators.minLength(2)]],
      isActive: ['true']
    });
  }

  // ==================== Load Cost Heads (for dropdowns) ====================

  loadCostHeads(): void {
    this.isLoadingCostHeads.set(true);

    this.projectSrv._getCostHeads(true)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          this.allCostHeads.set(response.items || []);
          this.isLoadingCostHeads.set(false);
        },
        error: () => {
          this.toastSrv.showToast('Error loading cost heads', 'error');
          this.isLoadingCostHeads.set(false);
        }
      });
  }

  // ==================== Load Sub Heads (costHeadId optional) ====================

  loadSubHeads(costHeadId: string = ''): void {
    this.isLoadingSubHeads.set(true);

    this.projectSrv._getSubHeads(costHeadId, this.showActiveOnly())
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          this.allSubHeads.set(response.items || []);
          this.isLoadingSubHeads.set(false);
        },
        error: () => {
          this.toastSrv.showToast('Error loading sub heads', 'error');
          this.isLoadingSubHeads.set(false);
        }
      });
  }

  // ==================== Table Filter ====================

  onTableFilterChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.filterCostHeadId.set(value);
    this.loadSubHeads(value);
  }

  clearTableFilter(): void {
    this.filterCostHeadId.set('');
    this.loadSubHeads('');
  }

  getFilterCostHeadName(): string {
    return this.allCostHeads().find(ch => ch.CostHeadId === this.filterCostHeadId())?.Name || '';
  }

  toggleActiveOnly(): void {
    this.showActiveOnly.set(!this.showActiveOnly());
    this.loadSubHeads(this.filterCostHeadId()); // respect current table filter
  }

  // ==================== Submit ====================

  onSubHeadSubmit(): void {
    if (this.subHeadForm.invalid) {
      this.subHeadForm.markAllAsTouched();
      this.toastSrv.showToast('Please fill all required fields', 'error');
      return;
    }

    this.isSubHeadSubmitting.set(true);

    if (this.isEditingSubHead()) {
      this.updateSubHead();
    } else {
      this.createSubHead();
    }
  }

  // ==================== Create ====================

  private createSubHead(): void {
    const payload = {
      costHeadId: this.subHeadForm.value.costHeadId,
      name: this.subHeadForm.value.name
    };

    this.projectSrv._createSubHead(payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.toastSrv.showToast('Sub head created successfully', 'success');
          this.resetForm();
          this.loadSubHeads(this.filterCostHeadId());
          this.subHeadsUpdated.emit();
          this.isSubHeadSubmitting.set(false);
        },
        error: () => {
          this.toastSrv.showToast('Error creating sub head', 'error');
          this.isSubHeadSubmitting.set(false);
        }
      });
  }

  // ==================== Update ====================

  private updateSubHead(): void {
    const payload = {
      subHeadId: this.selectedSubHeadId(),
      name: this.subHeadForm.value.name,
      isActive: this.subHeadForm.value.isActive
    };

    this.projectSrv._updateSubHead(payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.toastSrv.showToast('Sub head updated successfully', 'success');
          this.resetForm();
          this.loadSubHeads(this.filterCostHeadId());
          this.subHeadsUpdated.emit();
          this.isSubHeadSubmitting.set(false);
        },
        error: () => {
          this.toastSrv.showToast('Error updating sub head', 'error');
          this.isSubHeadSubmitting.set(false);
        }
      });
  }

  // ==================== Edit ====================

  editSubHead(subHead: GetSubHead): void {
    this.isEditingSubHead.set(true);
    this.selectedSubHeadId.set(subHead.SubHeadId);
    this.subHeadForm.patchValue({
      costHeadId: subHead.CostHeadId,
      name: subHead.Name,
      isActive: subHead.IsActive ? 'true' : 'false'
    });
  }

  // ==================== Deactivate ====================

  async deactivateSubHead(subHead: GetSubHead): Promise<void> {
    const confirmed = await this.confirmationDialogSrv.showConfirm(
      `Are you sure you want to deactivate "${subHead.Name}"?`,
      'Deactivate Sub Head'
    );

    if (confirmed) {
      this.projectSrv._deactivateSubHead(subHead.SubHeadId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.toastSrv.showToast('Sub head deactivated successfully', 'success');
            this.loadSubHeads(this.filterCostHeadId());
            this.subHeadsUpdated.emit();
          },
          error: () => {
            this.toastSrv.showToast('Error deactivating sub head', 'error');
          }
        });
    }
  }

  // ==================== Activate ====================

  async activateSubHead(subHead: GetSubHead): Promise<void> {
    const confirmed = await this.confirmationDialogSrv.showConfirm(
      `Are you sure you want to activate "${subHead.Name}"?`,
      'Activate Sub Head'
    );

    if (confirmed) {
      this.projectSrv._updateSubHead({
        subHeadId: subHead.SubHeadId,
        name: subHead.Name,
        isActive: 'true'
      })
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.toastSrv.showToast('Sub head activated successfully', 'success');
            this.loadSubHeads(this.filterCostHeadId());
            this.subHeadsUpdated.emit();
          },
          error: () => {
            this.toastSrv.showToast('Error activating sub head', 'error');
          }
        });
    }
  }

  // ==================== Helpers ====================

  resetForm(): void {
    this.subHeadForm.reset({ costHeadId: '', name: '', isActive: 'true' });
    this.isEditingSubHead.set(false);
    this.selectedSubHeadId.set('');
  }

  cancelEdit(): void {
    this.resetForm();
    this.toastSrv.showToast('Edit cancelled', 'warning');
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.subHeadForm.get(fieldName);
    return !!(field?.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.subHeadForm.get(fieldName);
    if (field?.hasError('required')) return 'This field is required';
    if (field?.hasError('minlength')) return `Minimum ${field.errors?.['minlength'].requiredLength} characters`;
    return '';
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}