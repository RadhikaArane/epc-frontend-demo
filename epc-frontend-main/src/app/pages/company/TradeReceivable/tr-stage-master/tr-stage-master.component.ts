import { Component, OnDestroy, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { BreadcrumbsComponent } from '../../../common/breadcrumbs/breadcrumbs.component';
import { breadCrumbItems } from '../../../../shared/models/models';
import { ToastService } from '../../../../shared/services/componentServices/toast.service';
import { TrStageMasterService } from '../../../../shared/services/tradeReceivable/tr-stage-master.service';
import { StageMasterEntry } from '../../../../shared/models/tradeReceivable-models/stageMaster';
import { ConfirmationDialogService } from '../../../../shared/services/componentServices/confirmation-dialog.service';

type RowVM = {
  id: string;
  StateName: string;
  PortalStatus: string;
  Category: string;
  Steps: string;
  originalPortalStatus: string;
  originalCategory: string;
  originalSteps: string; 
  CreatedAt?: string;
  UpdatedAt?: string | null;
  IsActive: boolean;
  isEditing: boolean;
  isNew: boolean;
};

@Component({
  selector: 'app-tr-stage-master',
  standalone: true,
  imports: [CommonModule, BreadcrumbsComponent],
  templateUrl: './tr-stage-master.component.html',
  styleUrl: './tr-stage-master.component.scss',
})
export class TrStageMasterComponent implements OnInit, OnDestroy {

  breadCrumbItems = signal<breadCrumbItems[]>([
    { label: 'Dashboard' },
    { label: 'Stage Master' },
  ]);

  private destroy$ = new Subject<void>();

  stageSrv = inject(TrStageMasterService);
  toastSrv = inject(ToastService);
  confirmationDialogSrv = inject(ConfirmationDialogService);

  states = signal<string[]>([]);
  categories = signal<string[]>([]);
  selectedState = signal<string>('');
  rows = signal<RowVM[]>([]);

  searchQuery = signal<string>('');

  filteredRows = computed(() => {
    const q = this.searchQuery().trim().toLowerCase();
    if (!q) return this.rows();
    return this.rows().filter(r =>
      r.PortalStatus.toLowerCase().includes(q) || r.isNew
    );
  });

  isLoadingStates = signal<boolean>(false);
  isLoadingRows = signal<boolean>(false);
  isLoadingCategories = signal<boolean>(false);
  savingRowId = signal<string>('');
  deletingRowId = signal<string>('');

  isAddMode = signal<boolean>(false);
  isAdding = signal<boolean>(false);
  pageError = signal<string>('');

  ngOnInit(): void {
    this.loadStates();
    this.loadCategories();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private makeId(): string {
    return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
  }

  private patchRow(id: string, patch: Partial<RowVM>) {
    this.rows.update(list => list.map(r => r.id === id ? { ...r, ...patch } : r));
  }

  private removeRow(id: string) {
    this.rows.update(list => list.filter(r => r.id !== id));
  }

  loadStates(): void {
    this.isLoadingStates.set(true);
    this.pageError.set('');

    this.stageSrv.getStates()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.isLoadingStates.set(false);
          if (!res?.Success) {
            this.pageError.set(res?.Message || 'Failed to load states.');
            return;
          }
          
          let list = res.Data || [];
          
          list.sort((a, b) => a.localeCompare(b));

          this.states.set(list);
          
          const defaultState = list.length > 0 ? list[0] : '';
          this.selectedState.set(defaultState);
          
          if (defaultState) this.loadRowsByState(defaultState);
        },
        error: (err) => {
          this.isLoadingStates.set(false);
          this.pageError.set(err?.error?.message || err?.error?.Message || 'Error loading states.');
        },
      });
  }

  onAddStateClick(): void {
    this.toastSrv.showToast('Add State feature will be connected to the backend soon.', 'info');
  }

  onExportExcelClick(): void {
    this.toastSrv.showToast('Export Excel feature will be connected to the backend soon.', 'info');
  }

  loadCategories(): void {
    if (this.categories().length > 0) return;
    this.isLoadingCategories.set(true);
    this.stageSrv.getCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.isLoadingCategories.set(false);
          if (res?.Success) this.categories.set(res.Data || []);
        },
        error: () => this.isLoadingCategories.set(false),
      });
  }

  loadRowsByState(state: string): void {
    this.cancelAddMode();
    this.searchQuery.set('');
    this.isLoadingRows.set(true);
    this.pageError.set('');

    this.stageSrv.getByState(state)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.isLoadingRows.set(false);
          if (!res?.Success) {
            this.pageError.set(res?.Message || 'Failed to load portal status.');
            this.rows.set([]);
            return;
          }
          
          let data: StageMasterEntry[] = res.Data || [];

          data.sort((a, b) => {
            const activeA = a.IsActive !== false;
            const activeB = b.IsActive !== false;
            if (activeA !== activeB) {
              return activeA ? -1 : 1; 
            }
            
            const stepA = String(a.Steps || '').trim().toUpperCase();
            const stepB = String(b.Steps || '').trim().toUpperCase();

            const getCategory = (step: string) => {
              if (!step) return 4; 
              if (/^\d+[A-Z]*$/.test(step)) return 1; 
              if (/^[A-Z]$/.test(step)) return 2; 
              return 3; 
            };

            const catA = getCategory(stepA);
            const catB = getCategory(stepB);

            if (catA !== catB) {
              return catA - catB;
            }

            if (catA === 1 || catA === 2 || catA === 3) {
              const stepComparison = stepA.localeCompare(stepB, undefined, { numeric: true, sensitivity: 'base' });
              if (stepComparison !== 0) return stepComparison;
            }

            return String(a.PortalStatus || '').localeCompare(String(b.PortalStatus || ''));
          });

          this.rows.set(data.map(x => {
            // Check if backend returned a blank category, default to "Not Considered"
            const assignedCategory = x.Category ? x.Category : 'Not Considered';

            return {
              id: this.makeId(),
              StateName: x.StateName,
              PortalStatus: x.PortalStatus,
              Category: assignedCategory,
              Steps: String(x.Steps || ''), 
              originalPortalStatus: x.PortalStatus,
              originalCategory: assignedCategory,
              originalSteps: String(x.Steps || ''), 
              CreatedAt: x.CreatedAt,
              UpdatedAt: x.UpdatedAt,
              IsActive: x.IsActive !== false, 
              isEditing: false,
              isNew: false,
            };
          }));
          
        },
        error: (err) => {
          this.isLoadingRows.set(false);
          this.pageError.set(err?.error?.message || err?.error?.Message || 'Error loading portal status list.');
          this.rows.set([]);
        },
      });
  }

  onSearchInput(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value);
  }

  onStateChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedState.set(value);
    this.loadRowsByState(value);
  }

  onAddTopClick(): void {
    if (!this.isAddMode()) {
      const state = this.selectedState();
      if (!state) return;

      // Automatically default new entries to 'Not Considered'
      const defaultCategory = this.categories().find(c => c.toLowerCase() === 'not considered') || 'Not Considered';

      const newRow: RowVM = {
        id: this.makeId(),
        StateName: state,
        PortalStatus: '',
        Category: defaultCategory, // <-- Defaults to Not Considered here
        Steps: '',
        originalPortalStatus: '',
        originalCategory: defaultCategory,
        originalSteps: '', 
        IsActive: true,
        isEditing: true,
        isNew: true,
      };
      
      this.rows.update(list => [newRow, ...list]);
      this.searchQuery.set(''); 
      this.isAddMode.set(true);
      return;
    }
    this.saveNewRow();
  }

  private saveNewRow(): void {
    const newRow = this.rows().find(r => r.isNew);
    if (!newRow) { this.isAddMode.set(false); return; }

    if (!newRow.PortalStatus?.trim()) {
      this.toastSrv.showToast('Please enter Portal Status', 'error');
      return;
    }
    if (!newRow.Category?.trim()) {
      this.toastSrv.showToast('Please select a Category', 'error');
      return;
    }

    this.isAdding.set(true);

    this.stageSrv.addPortalStatus({
      StateName: this.selectedState(),
      PortalStatus: newRow.PortalStatus.trim(),
      Category: newRow.Category,
      Steps: newRow.Steps?.trim() || '' 
    }).pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.isAdding.set(false);
          if (!res?.Success) {
            this.toastSrv.showToast(res?.Message || 'Failed to add Portal Status.', 'error');
            return;
          }
          this.toastSrv.showToast(res?.Message || 'Portal Status added successfully.', 'success');
          
          this.isAddMode.set(false);
          this.loadRowsByState(this.selectedState()); 
        },
        error: (err) => {
          this.isAdding.set(false);
          
          const errorMsg = err?.error?.message || err?.error?.Message || err?.message;

          if (err?.status === 409) {
            this.toastSrv.showToast(
              errorMsg || `Conflict: Cannot add "${newRow.PortalStatus.trim()}". It might already exist as a hidden/deleted entry.`,
              'warning'
            );
            return;
          } 
          this.toastSrv.showToast(errorMsg || 'Error adding portal status', 'error');
        },
      });
  }

  cancelAddMode(): void {
    const newRow = this.rows().find(r => r.isNew);
    if (newRow) this.removeRow(newRow.id);
    this.isAddMode.set(false);
    this.isAdding.set(false);
  }

  onUpdateSave(rowId: string): void {
    const row = this.rows().find(r => r.id === rowId);
    if (!row) return;

    if (!row.isEditing) {
      this.patchRow(rowId, { isEditing: true });
      return;
    }

    if (row.isNew) { this.saveNewRow(); return; }

    if (!row.PortalStatus?.trim()) {
      this.toastSrv.showToast('Portal Status is required', 'error');
      return;
    }
    if (!row.Category?.trim()) {
      this.toastSrv.showToast('Category is required', 'error');
      return;
    }

    this.savingRowId.set(rowId);

    this.stageSrv.updatePortalStatus({
      StateName: this.selectedState(),
      OldPortalStatus: row.originalPortalStatus,
      NewPortalStatus: row.PortalStatus.trim(),
      Category: row.Category,
      Steps: row.Steps?.trim() || '' 
    }).pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.savingRowId.set('');
          if (!res?.Success) {
            this.toastSrv.showToast(res?.Message || 'Update failed', 'error');
            return;
          }
          this.toastSrv.showToast(res?.Message || 'Updated successfully', 'success');
          
          this.loadRowsByState(this.selectedState());
        },
        error: (err) => {
          this.savingRowId.set('');
          const errorMsg = err?.error?.message || err?.error?.Message || err?.message;
          this.toastSrv.showToast(errorMsg || 'Error updating portal status', 'error');
        },
      });
  }

  cancelEdit(rowId: string): void {
    const row = this.rows().find(r => r.id === rowId);
    if (!row) return;
    this.patchRow(rowId, {
      isEditing: false,
      PortalStatus: row.originalPortalStatus,
      Category: row.originalCategory,
      Steps: row.originalSteps,
    });
  }

  async onDelete(rowId: string): Promise<void> {
    const row = this.rows().find(r => r.id === rowId);
    if (!row) return;

    if (row.isNew) {
      this.removeRow(rowId);
      this.isAddMode.set(false);
      return;
    }

    const confirmed = await this.confirmationDialogSrv.showConfirm(
      `Do you want to delete "${row.originalPortalStatus}"?`,
      'Delete Confirmation'
    );
    if (!confirmed) return;

    this.deletingRowId.set(rowId);

    this.stageSrv.deletePortalStatus({
      StateName: this.selectedState(),
      PortalStatus: row.originalPortalStatus,
    }).pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.deletingRowId.set('');
          if (!res?.Success) {
            this.toastSrv.showToast(res?.Message || 'Delete failed', 'error');
            return;
          }
          this.toastSrv.showToast(res?.Message || 'Deleted successfully', 'success');
          
          this.loadRowsByState(this.selectedState());
        },
        error: (err) => {
          this.deletingRowId.set('');
          const errorMsg = err?.error?.message || err?.error?.Message || err?.message;
          this.toastSrv.showToast(errorMsg || 'Error deleting portal status', 'error');
        },
      });
  }

  onPortalStatusInput(rowId: string, event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.patchRow(rowId, { PortalStatus: value });
  }

  onCategoryChange(rowId: string, event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.patchRow(rowId, { Category: value });
  }

  onStepsInput(rowId: string, event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.patchRow(rowId, { Steps: value });
  }
}