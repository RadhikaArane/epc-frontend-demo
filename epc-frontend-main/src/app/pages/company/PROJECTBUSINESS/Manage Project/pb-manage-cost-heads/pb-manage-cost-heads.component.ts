import { Component, inject, signal, OnDestroy, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { ToastService } from '../../../../../shared/services/componentServices/toast.service';
import { ConfirmationDialogService } from '../../../../../shared/services/componentServices/confirmation-dialog.service';
import { PbProjectManagementService } from '../../../../../shared/services/projectBusiness/pb-project-management.service';
import { GetCostHead } from '../../../../../shared/models/projectBusiness-models/projectmanagement';

@Component({
  selector: 'app-pb-manage-cost-heads',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './pb-manage-cost-heads.component.html',
  styleUrl: './pb-manage-cost-heads.component.scss'
})
export class PbManageCostHeadsComponent implements OnInit, OnDestroy {

  // Services
  private fb = inject(FormBuilder);
  private toastSrv = inject(ToastService);
  private confirmationDialogSrv = inject(ConfirmationDialogService);
  private projectSrv = inject(PbProjectManagementService);

  // Signals
  allCostHeads = signal<GetCostHead[]>([]);
  isLoadingCostHeads = signal<boolean>(false);
  isCostHeadSubmitting = signal<boolean>(false);
  isEditingCostHead = signal<boolean>(false);
  selectedCostHeadId = signal<string>('');
  showActiveOnly = signal<boolean>(true);

  // Output Events
  @Output() costHeadsUpdated = new EventEmitter<void>();

  // Form
  costHeadForm!: FormGroup;

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.initializeForm();
    this.loadCostHeads();
  }

  // ==================== Initialize Form ====================

  private initializeForm(): void {
    this.costHeadForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      docType: ['', Validators.required],
      isActive: ['true']
    });
  }

  // ==================== Load Cost Heads ====================

  loadCostHeads(): void {
    this.isLoadingCostHeads.set(true);

    this.projectSrv._getCostHeads(this.showActiveOnly())
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          this.allCostHeads.set(response.items || []);
          this.isLoadingCostHeads.set(false);
          console.log('✓ Cost heads loaded:', response.items?.length || 0);
        },
        error: (error) => {
          console.error('✗ Error loading cost heads:', error);
          this.toastSrv.showToast('Error loading cost heads. Please try again.', 'error');
          this.isLoadingCostHeads.set(false);
        }
      });
  }

  // ==================== Submit Cost Head ====================

  onCostHeadSubmit(): void {
    if (this.costHeadForm.invalid) {
      this.costHeadForm.markAllAsTouched();
      this.toastSrv.showToast('Please fill all required fields', 'error');
      return;
    }

    this.isCostHeadSubmitting.set(true);

    if (this.isEditingCostHead()) {
      this.updateCostHead();
    } else {
      this.createCostHead();
    }
  }

  // ==================== Create Cost Head ====================

  private createCostHead(): void {
    const payload = {
      name: this.costHeadForm.value.name,
      docType: this.costHeadForm.value.docType
    };

    this.projectSrv._createCostHead(payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.toastSrv.showToast('Cost head created successfully', 'success');
          this.resetForm();
          this.loadCostHeads();
          this.costHeadsUpdated.emit(); // Notify parent
          this.isCostHeadSubmitting.set(false);
        },
        error: (error) => {
          console.error('✗ Error creating cost head:', error);
          this.toastSrv.showToast('Error creating cost head. Please try again.', 'error');
          this.isCostHeadSubmitting.set(false);
        }
      });
  }

  // ==================== Update Cost Head ====================

  private updateCostHead(): void {
    const payload = {
      costHeadId: this.selectedCostHeadId(),
      docType: this.costHeadForm.value.docType,
      name: this.costHeadForm.value.name,
      isActive: this.costHeadForm.value.isActive
    };

    this.projectSrv._updateCostHead(payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.toastSrv.showToast('Cost head updated successfully', 'success');
          this.resetForm();
          this.loadCostHeads();
          this.costHeadsUpdated.emit(); // Notify parent
          this.isCostHeadSubmitting.set(false);
        },
        error: (error) => {
          console.error('✗ Error updating cost head:', error);
          this.toastSrv.showToast('Error updating cost head. Please try again.', 'error');
          this.isCostHeadSubmitting.set(false);
        }
      });
  }

  // ==================== Edit Cost Head ====================

  editCostHead(costHead: GetCostHead): void {
    this.isEditingCostHead.set(true);
    this.selectedCostHeadId.set(costHead.CostHeadId);
    this.costHeadForm.patchValue({
      name: costHead.Name,
      docType: costHead.DocType,
      isActive: costHead.IsActive ? 'true' : 'false'
    });
  }

  // ==================== Activate Cost Head ====================

  async activateCostHead(costHead: GetCostHead): Promise<void> {
    const confirmed = await this.confirmationDialogSrv.showConfirm(
      `Are you sure you want to activate "${costHead.Name}"?`,
      'Activate Cost Head'
    );

    if (confirmed) {
      this.projectSrv._updateCostHead({
        costHeadId: costHead.CostHeadId,
        name: costHead.Name,
        isActive: 'true'
      })
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.toastSrv.showToast('Cost head activated successfully', 'success');
            this.loadCostHeads();
            this.costHeadsUpdated.emit(); // Notify parent
          },
          error: (error) => {
            console.error('✗ Error activating cost head:', error);
            this.toastSrv.showToast('Error activating cost head. Please try again.', 'error');
          }
        });
    }
  }

  // ==================== Deactivate Cost Head ====================

  async deactivateCostHead(costHeadId: string): Promise<void> {
    const costHead = this.allCostHeads().find(ch => ch.CostHeadId === costHeadId);

    const confirmed = await this.confirmationDialogSrv.showConfirm(
      `Are you sure you want to deactivate "${costHead?.Name}"?`,
      'Deactivate Cost Head'
    );

    if (confirmed) {
      this.projectSrv._deactivateCostHead(costHeadId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.toastSrv.showToast('Cost head deactivated successfully', 'success');
            this.loadCostHeads();
            this.costHeadsUpdated.emit(); // Notify parent
          },
          error: (error) => {
            console.error('✗ Error deactivating cost head:', error);
            this.toastSrv.showToast('Error deactivating cost head. Please try again.', 'error');
          }
        });
    }
  }

  // ==================== Helper Functions ====================

  toggleActiveOnly(): void {
    this.showActiveOnly.set(!this.showActiveOnly());
    this.loadCostHeads();
  }

  resetForm(): void {
    this.costHeadForm.reset({ name: '', docType: '', isActive: 'true' });
    this.isEditingCostHead.set(false);
    this.selectedCostHeadId.set('');
  }

  cancelEdit(): void {
    this.resetForm();
    this.toastSrv.showToast('Edit cancelled', 'warning');
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.costHeadForm.get(fieldName);
    return !!(field?.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.costHeadForm.get(fieldName);
    if (field?.hasError('required')) return 'This field is required';
    if (field?.hasError('minlength')) {
      return `Minimum ${field.errors?.['minlength'].requiredLength} characters`;
    }
    return '';
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}