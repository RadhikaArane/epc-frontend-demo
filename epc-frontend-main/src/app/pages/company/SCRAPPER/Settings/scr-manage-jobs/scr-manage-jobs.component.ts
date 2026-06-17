// scr-manage-jobs.component.ts
import { Component, inject, signal, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { breadCrumbItems } from '../../../../../shared/models/models';
import { BreadcrumbsComponent } from '../../../../common/breadcrumbs/breadcrumbs.component';
import { ScrSettingsService } from '../../../../../shared/services/scrapper/scr-settings.service'; 
import { ConfirmationDialogService } from '../../../../../shared/services/componentServices/confirmation-dialog.service';
import { ToastService } from '../../../../../shared/services/componentServices/toast.service';
import { ScrapperState } from '../../../../../shared/models/scrapper-models/scrapperSettings';

declare var bootstrap: any;

@Component({
  selector: 'app-scr-manage-jobs',
  standalone: true,
  imports: [BreadcrumbsComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './scr-manage-jobs.component.html',
  styleUrl: './scr-manage-jobs.component.scss'
})
export class ScrManageJobsComponent implements OnInit {
  @ViewChild('addStateModal') addStateModal!: ElementRef;

  breadCrumbItems = signal<breadCrumbItems[]>([]);
  stateList = signal<ScrapperState[]>([]);
  isLoading = signal(false);
  
  stateForm!: FormGroup;
  isEditMode = signal(false);
  currentEditId = signal<number | null>(null);
  
  private scrapperSrv = inject(ScrSettingsService);
  private fb = inject(FormBuilder);
  private confirmDialogSrv = inject(ConfirmationDialogService);
  private toastSrv = inject(ToastService);

  ngOnInit() {
    this.breadCrumbItems.set([{ label: 'Settings' }]);
    this.initForm();
    this.loadJobs();
  }

  initForm() {
    this.stateForm = this.fb.group({
      stateName: ['', Validators.required],
      portalLink: ['', [Validators.required, Validators.pattern(/^https?:\/\/.+/)]],
      userName: ['', Validators.required],
      password: ['', Validators.required],
      otpRequired: [false],
      otpNumber: ['']
    });

    this.stateForm.get('otpRequired')?.valueChanges.subscribe(value => {
      const otpNumberControl = this.stateForm.get('otpNumber');
      if (value) {
        otpNumberControl?.setValidators(Validators.required);
      } else {
        otpNumberControl?.clearValidators();
        otpNumberControl?.setValue('');
      }
      otpNumberControl?.updateValueAndValidity();
    });
  }

  loadJobs() {
    this.isLoading.set(true);
    this.scrapperSrv._getStateData().subscribe({
      next: (res) => {
        this.stateList.set(res.items);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error("Error loading Jobs:", err);
        this.toastSrv.showToast('Failed to load state data. Please try again.', 'error');
        this.isLoading.set(false);
      }
    });
  }

  openAddModal() {
    this.isEditMode.set(false);
    this.currentEditId.set(null);
    this.resetForm();
    this.openModal();
  }

  openEditModal(state: ScrapperState) {
    this.isEditMode.set(true);
    this.currentEditId.set(state.id!);
    
    this.stateForm.patchValue({
      stateName: state.stateName,
      portalLink: state.portalLink,
      userName: state.userName,
      password: state.password,
      otpRequired: state.otpRequired,
      otpNumber: state.otpNumber
    });
    
    this.openModal();
  }

  async openDeleteModal(state: ScrapperState) {
    const confirmed = await this.confirmDialogSrv.showConfirm(
      `Are you sure you want to delete "${state.stateName}"? This action cannot be undone.`,
      'Confirm Delete'
    );

    if (confirmed) {
      this.deleteState(state.id!);
    }
  }

  saveState() {
    if (this.stateForm.invalid) {
      this.stateForm.markAllAsTouched();
      this.toastSrv.showToast('Please fill all required fields correctly', 'error');
      return;
    }

    const formData = this.stateForm.value;

    if (this.isEditMode()) {
      const updateData = {
        id: this.currentEditId(),
        ...formData,
        isActive: true
      };
      
      this.scrapperSrv._updateState(this.currentEditId()!, updateData).subscribe({
        next: (res) => {
          this.toastSrv.showToast('State updated successfully!', 'success');
          this.closeModal();
          this.loadJobs();
        },
        error: (err) => {
          console.error('Error updating state:', err);
          this.toastSrv.showToast(err.error?.message || 'Failed to update state', 'error');
        }
      });
    } else {
      this.scrapperSrv._addState(formData).subscribe({
        next: (res) => {
          this.toastSrv.showToast('New state added successfully!', 'success');
          this.closeModal();
          this.loadJobs();
        },
        error: (err) => {
          console.error('Error adding state:', err);
          this.toastSrv.showToast(err.error?.message || 'Failed to add state', 'error');
        }
      });
    }
  }

  deleteState(id: number) {
    this.scrapperSrv._deleteState(id).subscribe({
      next: (res) => {
        this.toastSrv.showToast('State deleted successfully!', 'success');
        this.loadJobs();
      },
      error: (err) => {
        console.error('Error deleting state:', err);
        this.toastSrv.showToast(err.error?.message || 'Failed to delete state', 'error');
      }
    });
  }

  togglePassword(event: Event) {
    const button = event.currentTarget as HTMLElement;
    const inputGroup = button.closest('.input-group');
    const input = inputGroup?.querySelector('input') as HTMLInputElement;
    
    if (input) {
      input.type = input.type === 'password' ? 'text' : 'password';
    }
  }

  openPortalLink(url: string, event: Event) {
    event.preventDefault();
    if (url && url.trim()) {
      window.open(url, '_blank');
    }
  }

  resetForm() {
    this.stateForm.reset({
      stateName: '',
      portalLink: '',
      userName: '',
      password: '',
      otpRequired: false,
      otpNumber: ''
    });
  }

  openModal(): void {
    if (this.addStateModal) {
      const modalElement = this.addStateModal.nativeElement;
      const modal = new bootstrap.Modal(modalElement, {
        backdrop: 'static',
        keyboard: false
      });
      modal.show();
    }
  }

  closeModal(): void {
    if (this.addStateModal) {
      const modalElement = this.addStateModal.nativeElement;

      const activeElement = document.activeElement as HTMLElement;
      if (modalElement.contains(activeElement)) {
        activeElement.blur();
      }

      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      }
      this.resetForm();
    }
  }
}