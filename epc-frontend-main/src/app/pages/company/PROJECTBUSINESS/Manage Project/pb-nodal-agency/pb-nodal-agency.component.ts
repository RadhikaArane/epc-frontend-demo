import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ToastService } from '../../../../../shared/services/componentServices/toast.service';
import { ConfirmationDialogService } from '../../../../../shared/services/componentServices/confirmation-dialog.service';
import { PbAddNodalAgencyService } from '../../../../../shared/services/projectBusiness/pb-add-nodal-agency.service';
import { GetNodalAgency, NodalAgencyResponse } from '../../../../../shared/models/projectBusiness-models/pbNodalAgency';

@Component({
  selector: 'app-pb-nodal-agency',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './pb-nodal-agency.component.html',
  styleUrl: './pb-nodal-agency.component.scss'
})
export class PbNodalAgencyComponent implements OnInit, OnDestroy {

  private fb = inject(FormBuilder);
  private projectNodalSrv = inject(PbAddNodalAgencyService);
  private toastSrv = inject(ToastService);
  private confirmationDialogSrv = inject(ConfirmationDialogService);

  allNodalAgencies = signal<GetNodalAgency[]>([]);
  filteredNodalAgencies = signal<GetNodalAgency[]>([]);
  isLoadingNodalAgencies = signal(false);
  isSubmitting = signal(false);
  isEditing = signal(false);
  selectedAgencyId = signal('');
  showForm = signal(false);
  searchTerm = signal('');

  nodalAgencyForm!: FormGroup;

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.initForm();
    this.loadNodalAgencies();
  }

  // ==================== Form ====================

  private initForm(): void {
    this.nodalAgencyForm = this.fb.group({
      nodalAgencyName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]]
    });
  }

  // ==================== Load ====================

  loadNodalAgencies(): void {
    this.isLoadingNodalAgencies.set(true);

    this.projectNodalSrv._getNodalAgencies()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: NodalAgencyResponse) => {
          const data = res.StatusCode === 200 && res.Data ? res.Data : [];
          this.allNodalAgencies.set(data);
          this.applyFilter();
          this.isLoadingNodalAgencies.set(false);
        },
        error: () => {
          this.toastSrv.showToast('Error loading nodal agencies', 'error');
          this.isLoadingNodalAgencies.set(false);
        }
      });
  }

  // ==================== Add ====================

  onAdd(): void {
    this.isEditing.set(false);
    this.selectedAgencyId.set('');
    this.nodalAgencyForm.reset();
    this.showForm.set(true);
  }

  // ==================== Edit ====================

  onEdit(agency: GetNodalAgency): void {
    this.isEditing.set(true);
    this.selectedAgencyId.set(agency.NodalAgencyId);
    this.nodalAgencyForm.patchValue({ nodalAgencyName: agency.NodalAgencyName });
    this.showForm.set(true);
  }

  // ==================== Submit ====================

  onSubmit(): void {
    if (this.nodalAgencyForm.invalid) {
      this.nodalAgencyForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    const name = this.nodalAgencyForm.value.nodalAgencyName.trim();

    if (this.isEditing()) {
      // UPDATE — plain object, no class needed
      const body = {
        nodalAgencyId: this.selectedAgencyId(),
        nodalAgencyName: name
      };

      this.projectNodalSrv._updateNodalAgency(body)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.toastSrv.showToast('Nodal agency updated successfully', 'success');
            this.reset();
            this.loadNodalAgencies();
            this.isSubmitting.set(false);
          },
          error: () => {
            this.toastSrv.showToast('Error updating nodal agency', 'error');
            this.isSubmitting.set(false);
          }
        });

    } else {
      // CREATE — plain object, no class needed
      const body = { nodalAgencyName: name };

      this.projectNodalSrv._createNodalAgency(body)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.toastSrv.showToast('Nodal agency created successfully', 'success');
            this.reset();
            this.loadNodalAgencies();
            this.isSubmitting.set(false);
          },
          error: () => {
            this.toastSrv.showToast('Error creating nodal agency', 'error');
            this.isSubmitting.set(false);
          }
        });
    }
  }

  // ==================== Delete ====================

  async onDelete(agency: GetNodalAgency): Promise<void> {
    const confirmed = await this.confirmationDialogSrv.showConfirm(
      `Are you sure you want to delete "${agency.NodalAgencyName}"?`,
      'Delete Confirmation'
    );

    if (!confirmed) return;

    this.projectNodalSrv._deleteNodalAgency(agency.NodalAgencyId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.toastSrv.showToast('Nodal agency deleted successfully', 'success');
          this.loadNodalAgencies();
        },
        error: () => {
          this.toastSrv.showToast('Error deleting nodal agency', 'error');
        }
      });
  }

  // ==================== Search ====================

  onSearch(event: Event): void {
    this.searchTerm.set((event.target as HTMLInputElement).value);
    this.applyFilter();
  }

  private applyFilter(): void {
    const term = this.searchTerm().toLowerCase().trim();
    this.filteredNodalAgencies.set(
      term
        ? this.allNodalAgencies().filter(a => a.NodalAgencyName.toLowerCase().includes(term))
        : this.allNodalAgencies()
    );
  }

  // ==================== Helpers ====================

  reset(): void {
    this.nodalAgencyForm.reset();
    this.showForm.set(false);
    this.isEditing.set(false);
    this.selectedAgencyId.set('');
  }

  cancel(): void {
    this.reset();
    this.toastSrv.showToast('Cancelled', 'warning');
  }

  isInvalid(field: string): boolean {
    const f = this.nodalAgencyForm.get(field);
    return !!(f?.invalid && (f.dirty || f.touched));
  }

  getError(field: string): string {
    const f = this.nodalAgencyForm.get(field);
    if (f?.hasError('required')) return 'This field is required';
    if (f?.hasError('minlength')) return `Minimum ${f.errors?.['minlength'].requiredLength} characters required`;
    if (f?.hasError('maxlength')) return `Maximum ${f.errors?.['maxlength'].requiredLength} characters allowed`;
    return '';
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}