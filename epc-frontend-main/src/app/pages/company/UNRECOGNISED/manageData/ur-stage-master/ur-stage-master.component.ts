import { Component, signal, inject, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { BreadcrumbsComponent } from '../../../../common/breadcrumbs/breadcrumbs.component';
import { breadCrumbItems } from '../../../../../shared/models/models';
import { UrManageSettingsService } from '../../../../../shared/services/unrecognisedInvoice/ur-manage-settings.service';
import { AuthService } from '../../../../../shared/services/common/auth.service';
import { ToastService } from '../../../../../shared/services/componentServices/toast.service';
import { ConfirmationDialogService } from '../../../../../shared/services/componentServices/confirmation-dialog.service';

@Component({
  selector: 'app-ur-stage-master',
  standalone: true,
  imports: [CommonModule, FormsModule, BreadcrumbsComponent],
  templateUrl: './ur-stage-master.component.html',
  styleUrl: './ur-stage-master.component.scss'
})
export class UrStageMasterComponent implements OnDestroy {

  private settingsSrv = inject(UrManageSettingsService);
  private authSrv = inject(AuthService);
  private toastSrv = inject(ToastService);
  private confirmDialogSrv = inject(ConfirmationDialogService);
  private destroy$ = new Subject<void>();

  @ViewChild('closeAddModal') closeAddModal!: ElementRef;
  @ViewChild('closeEditModal') closeEditModal!: ElementRef;

  breadCrumbItems = signal<breadCrumbItems[]>([
    { label: 'Manage Data ' },
  ]);

  stages = signal<any[]>([]);
  isLoading = signal<boolean>(false);
  isSaving = signal<boolean>(false);

  // Directly track the StateName string for the new API
  selectedStateName = signal<string>('Andhra Pradesh'); 

  // Simplified Form Models
  addStageForm = signal({ StageName: '', Category: '' });
  editStageForm = signal({ Id: '', StageName: '', Category: '' });

  constructor() {
    this.fetchStages();
  }

  onStateChange(val: string) {
    this.selectedStateName.set(val);
    this.fetchStages();
  }

  fetchStages() {
    const stateName = this.selectedStateName();
    this.isLoading.set(true);

    this.settingsSrv._getStagesByState(stateName)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any[]) => {
          this.stages.set(res || []);
          this.isLoading.set(false);
        },
        error: (err: any) => {
          console.error('❌ [Stages API Error]:', err);
          this.stages.set([]);
          this.isLoading.set(false);
          this.toastSrv.showToast('Failed to load stages', 'error');
        }
      });
  }

  // ==========================================
  // ADD STAGE
  // ==========================================
  openAddModal() {
    this.addStageForm.set({ StageName: '', Category: '' });
  }

  saveAddStage() {
    const form = this.addStageForm();
    if (!form.StageName || !form.Category) {
      this.toastSrv.showToast('Please fill all fields', 'warning');
      return;
    }

    this.isSaving.set(true);
    const payload = {
      StateName: this.selectedStateName(),
      StageName: form.StageName,
      Category: form.Category,
      CreatedBy: String(this.authSrv.userDetails?.employeeId || '')
    };

    this.settingsSrv._addStage(payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.isSaving.set(false);
          this.toastSrv.showToast('Stage added successfully', 'success');
          this.closeAddModal.nativeElement.click(); 
          this.fetchStages(); 
        },
        error: (err) => {
          console.error('❌ Add Stage Error:', err);
          this.isSaving.set(false);
          this.toastSrv.showToast('Failed to add stage', 'error');
        }
      });
  }

  // ==========================================
  // EDIT STAGE
  // ==========================================
  openEditModal(row: any) {
    console.log('📌 [EDIT] Raw Row Data:', row);
    
    // Check all possible spellings of Id
    const actualId = row.Id ?? row.id ?? row.stageId ?? '';

    if (!actualId) {
      this.toastSrv.showToast('Error: Backend is not providing the Id.', 'error');
    }

    this.editStageForm.set({
      Id: String(actualId),
      StageName: row.StageName || '',
      Category: row.Category || ''
    });
  }

  saveEdit() {
    const form = this.editStageForm();
    if (!form.StageName || !form.Category) {
      this.toastSrv.showToast('Please fill all fields', 'warning');
      return;
    }
    if (!form.Id || form.Id === 'undefined') {
      this.toastSrv.showToast('Cannot update without a valid Id from backend', 'error');
      return;
    }

    this.isSaving.set(true);
    const payload = {
      Id: form.Id,
      StageName: form.StageName,
      Category: form.Category,
      UpdatedBy: String(this.authSrv.userDetails?.employeeId || '')
    };

    console.log('🚀 [EDIT PAYLOAD]:', payload);

    this.settingsSrv._editStage(payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.isSaving.set(false);
          this.toastSrv.showToast('Stage updated successfully', 'success');
          this.closeEditModal.nativeElement.click(); 
          this.fetchStages(); 
        },
        error: (err) => {
          console.error('❌ Edit Stage Error:', err);
          this.isSaving.set(false);
          this.toastSrv.showToast('Failed to update stage', 'error');
        }
      });
  }

  // ==========================================
  // DELETE STAGE
  // ==========================================
  async deleteStage(row: any): Promise<void> {
    console.log('📌 [DELETE] Raw Row Data:', row);

    // Check all possible spellings of Id
    const actualId = row.Id ?? row.id ?? row.stageId ?? '';

    if (!actualId) {
      this.toastSrv.showToast('Error: Cannot delete, Id is missing from backend.', 'error');
      return; // 🛑 Stops the API from firing and crashing
    }

    const confirmed = await this.confirmDialogSrv.showConfirm(
      `Are you sure you want to delete the stage: "${row.StageName}"?`,
      'Confirm Delete'
    );

    if (!confirmed) return;

    console.log(`🚀 [DELETE PAYLOAD] Sending Id:`, { Id: String(actualId) });

    this.settingsSrv._deleteStage(actualId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.toastSrv.showToast('Stage deleted successfully', 'success');
          this.fetchStages(); 
        },
        error: (err) => {
          console.error('❌ Delete Stage Error:', err);
          this.toastSrv.showToast('Failed to delete stage', 'error');
        }
      });
  }

  // ==========================================
  // SET RECOGNISED
  // ==========================================
  async setRecognised(row: any): Promise<void> {
    console.log('📌 [RECOGNISE] Raw Row Data:', row);

    // Check all possible spellings of Id
    const actualId = row.Id ?? row.id ?? row.stageId ?? '';

    if (!actualId) {
      this.toastSrv.showToast('Error: Cannot update, Id is missing from backend.', 'error');
      return; // 🛑 Stops the API from firing and crashing
    }

    const confirmed = await this.confirmDialogSrv.showConfirm(
      `Set "${row.StageName}" as Recognised?`,
      'Confirm Action'
    );

    if (!confirmed) return;

    console.log(`🚀 [RECOGNISE PAYLOAD] Sending Id:`, { Id: String(actualId) });

    this.settingsSrv._setRecognisedStage(actualId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.toastSrv.showToast('Stage marked as recognised', 'success');
          this.fetchStages(); 
        },
        error: (err) => {
          console.error('❌ Set Recognised Error:', err);
          this.toastSrv.showToast('Failed to update status', 'error');
        }
      });
  } 

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}