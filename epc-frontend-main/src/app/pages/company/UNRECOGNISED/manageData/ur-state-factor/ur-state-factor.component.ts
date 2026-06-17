import { Component, inject, signal, OnDestroy, ViewChild, ElementRef, } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { BreadcrumbsComponent } from '../../../../common/breadcrumbs/breadcrumbs.component';
import { breadCrumbItems } from '../../../../../shared/models/models';
import { UrManageSettingsService } from '../../../../../shared/services/unrecognisedInvoice/ur-manage-settings.service';
import { StateStockFactor } from '../../../../../shared/models/unrecognisedInvoice-models/settings';
import { ToastService } from '../../../../../shared/services/componentServices/toast.service';
import { ConfirmationDialogService } from '../../../../../shared/services/componentServices/confirmation-dialog.service';

@Component({
  selector: 'app-ur-state-factor',
  standalone: true,
  imports: [CommonModule, FormsModule, BreadcrumbsComponent],
  templateUrl: './ur-state-factor.component.html',
  styleUrl: './ur-state-factor.component.scss',
})
export class UrStateFactorComponent implements OnDestroy {
  private settingsSrv = inject(UrManageSettingsService);
  private toastSrv = inject(ToastService);
  private confirmDialogSrv = inject(ConfirmationDialogService); 
  private destroy$ = new Subject<void>();

  breadCrumbItems = signal<breadCrumbItems[]>([{ label: 'State Factor' }]);

  // dropdown + table data
  allFactors = signal<StateStockFactor[]>([]);
  dropdownStates = signal<{ id: number; name: string }[]>([]);
  tableRows = signal<StateStockFactor[]>([]);

  selectedStateId = signal<number>(0);

  // Edit modal fields
  editId = signal<number>(0);
  editState = signal<string>('');
  editStockMultFact = signal<string>('');
  editUpdatedBy = signal<string>(''); // ✅ Changed to UpdatedBy
  isUpdating = signal<boolean>(false);

  @ViewChild('editFactorModal') editFactorModalRef!: ElementRef<HTMLElement>;

  // Loading flags
  isLoading = signal<boolean>(false);
  isSaving = signal<boolean>(false);

  // Add Modal fields
  addState = signal<string>('');
  addStockMultFact = signal<string>('');
  addCreatedBy = signal<string>(''); // Add remains CreatedBy

  @ViewChild('addFactorModal') addFactorModalRef!: ElementRef<HTMLElement>;

  constructor() {
    this.loadAllStatesForDropdown();
  }

  // =========================
  // 1) GET ALL -> dropdown fill
  // =========================
  loadAllStatesForDropdown(focusStateName?: string, focusId?: number) {
    this.isLoading.set(true);

    this.settingsSrv
      ._getAllStateStockFactors()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          console.log('✅ [ALL StateStockFactors]:', res);

          const list: StateStockFactor[] = Array.isArray(res)
            ? res
            : res?.Items || [];
          this.allFactors.set(list || []);

          const latestByState = new Map<string, StateStockFactor>();

          (list || []).forEach((x) => {
            const prev = latestByState.get(x.State);
            if (!prev || Number(x.Id) > Number(prev.Id)) {
              latestByState.set(x.State, x);
            }
          });

          const options = Array.from(latestByState.values()).map((x) => ({
            name: x.State,
            id: x.Id,
          }));

          this.dropdownStates.set(options);
          this.selectedStateId.set(0);
          this.refreshTableForSelectedState();
          this.isLoading.set(false);
        },
        error: (err: any) => {
          console.error('❌ [ALL StateStockFactors ERROR]:', err);
          this.dropdownStates.set([]);
          this.tableRows.set([]);
          this.isLoading.set(false);
        },
      });
  }

  // =========================
  // 2) Dropdown change -> GET /{id}
  // =========================
  onStateChange(id: any) {
    const stateId = Number(id);
    this.selectedStateId.set(stateId);
    this.refreshTableForSelectedState();

    if (stateId !== 0) {
      this.loadById(stateId, true);
    } else {
      console.log('✅ ALL selected - showing all factors');
    }
  }

  loadById(id: number, consoleOnly: boolean = false) {
    if (!id) return;

    this.settingsSrv
      ._getStateStockFactorById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          console.log(`✅ [StateStockFactors/${id}] RESPONSE:`, res);
          if (!consoleOnly) {
            const rows: StateStockFactor[] = Array.isArray(res) ? res : res ? [res] : [];
            this.tableRows.set(rows);
          }
        },
        error: (err: any) => {
          console.error(`❌ [StateStockFactors/${id}] ERROR:`, err);
          if (!consoleOnly) this.tableRows.set([]);
        },
      });
  }

  // =========================
  // 3) Add Modal -> Save (POST)
  // =========================
  openAddModal() {
    const sel = this.dropdownStates().find(
      (x) => x.id === this.selectedStateId(),
    );
    if (sel) this.addState.set(sel.name);

    this.addStockMultFact.set('');
    this.addCreatedBy.set('');

    const el = this.addFactorModalRef?.nativeElement;
    if (el) {
      const m = new (window as any).bootstrap.Modal(el);
      m.show();
    }
  }

  closeAddModal() {
    const el = this.addFactorModalRef?.nativeElement;
    if (el) {
      const inst = (window as any).bootstrap.Modal.getInstance(el);
      if (inst) inst.hide();
    }
  }

  saveFactor() {
    const stName = this.addState().trim();
    const body = {
      State: stName,
      StockMultFact: this.addStockMultFact().trim(),
      CreatedBy: this.addCreatedBy().trim(),
    };

    this.isSaving.set(true);

    this.settingsSrv
      ._addStateStockFactor(body)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.toastSrv.showToast('State factor added successfully', 'success');
          this.isSaving.set(false);
          this.closeAddModal();

          const newId = res?.Id || res?.id || Date.now();
          const newRow: StateStockFactor = {
            Id: newId,
            State: stName,
            StockMultFact: body.StockMultFact,
            CreatedBy: body.CreatedBy,
            UpdatedBy: '', 
          };

          this.allFactors.update((list) => [newRow, ...(list || [])]);

          this.dropdownStates.update((opts) =>
            (opts || []).map((o) =>
              o.name.toLowerCase() === stName.toLowerCase()
                ? { ...o, id: Math.max(o.id, Number(newId)) }
                : o,
            ),
          );

          if (!this.dropdownStates().some((o) => o.name.toLowerCase() === stName.toLowerCase())) {
            this.dropdownStates.update((opts) => [
              { id: Number(newId), name: stName },
              ...(opts || []),
            ]);
          }

          if (this.getSelectedStateName().toLowerCase() === stName.toLowerCase()) {
            this.refreshTableForSelectedState();
          }
        },
        error: (err: any) => {
          console.error('❌ [POST ERROR]:', err);
          this.toastSrv.showToast('Failed to add state factor', 'error');
          this.isSaving.set(false);
        },
      });
  }

  private getSelectedStateName(): string {
    const selId = this.selectedStateId();
    if (selId === 0) return 'All';

    const sel = this.dropdownStates().find(x => x.id === selId);
    return sel?.name ?? '';
  }

  private refreshTableForSelectedState() {
    const selId = this.selectedStateId();

    if (selId === 0) {
      const rows = (this.allFactors() || [])
        .slice()
        .sort((a, b) => Number(b.Id) - Number(a.Id));
      this.tableRows.set(rows);
      return;
    }

    const stateName = this.getSelectedStateName().toLowerCase();

    const rows = (this.allFactors() || [])
      .filter(x => (x.State || '').toLowerCase() === stateName)
      .sort((a, b) => Number(b.Id) - Number(a.Id));

    this.tableRows.set(rows);
  }

  // =========================
  // 4) Edit logic
  // =========================
  openEditModal(row: StateStockFactor) {
    this.editId.set(Number(row.Id));
    this.editState.set(String(row.State || ''));
    this.editStockMultFact.set(String(row.StockMultFact || '')); 
    this.editUpdatedBy.set(''); // ✅ Reset field to empty for new entry

    const el = this.editFactorModalRef?.nativeElement;
    if (el) new (window as any).bootstrap.Modal(el).show();
  }

  closeEditModal() {
    const el = this.editFactorModalRef?.nativeElement;
    if (!el) return;
    const inst = (window as any).bootstrap.Modal.getInstance(el);
    if (inst) inst.hide();
  }

  updateFactor() {
    const id = this.editId();
    if (!id) return;

    // Create the exact payload the backend expects
    const apiPayload = {
      Id: String(id),
      StockMultFact: String(this.editStockMultFact() || '').trim(),
      UpdatedBy: String(this.editUpdatedBy() || '').trim()
    };

    if (!apiPayload.StockMultFact) {
      this.toastSrv.showToast('StockMultFact is required', 'warning');
      return;
    }
    if (!apiPayload.UpdatedBy) {
      this.toastSrv.showToast('UpdatedBy is required', 'warning');
      return;
    }

    this.isUpdating.set(true);

    // ✅ FIXED: Passing ONLY 1 argument (apiPayload) to match the service
    this.settingsSrv._updateStateStockFactor(apiPayload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.toastSrv.showToast('State factor updated successfully', 'success');

          // Safely update the frontend state
          this.allFactors.update(list =>
            (list || []).map(x => Number(x.Id) === id 
              ? { ...x, StockMultFact: apiPayload.StockMultFact, UpdatedBy: apiPayload.UpdatedBy } 
              : x
            )
          );

          this.refreshTableForSelectedState();
          this.isUpdating.set(false);
          this.closeEditModal();
        },
        error: (err: any) => {
          console.error('❌ [PUT ERROR]:', err);
          this.toastSrv.showToast('Failed to update state factor', 'error');
          this.isUpdating.set(false);
        }
      });
  }

  // =========================
  // 5) Delete logic
  // =========================
  async deleteFactor(row: StateStockFactor): Promise<void> {
    const idToDelete = row.Id;
    const stateName = row.State;

    console.log('🚀 [DELETE PAYLOAD] ID to delete:', idToDelete);

    const confirmed = await this.confirmDialogSrv.showConfirm(
      `Are you sure you want to delete this factor for ${stateName}?`,
      'Confirm Delete'
    );

    if (!confirmed) {
      console.log('❌ [DELETE CANCELLED] User cancelled deletion for ID:', idToDelete);
      return;
    }

    this.settingsSrv._deleteStateStockFactor(idToDelete.toString())
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          console.log('✅ [DELETE SUCCESS] Deleted ID:', idToDelete);
          this.toastSrv.showToast('State factor deleted successfully', 'success');

          this.allFactors.update(list =>
            (list || []).filter(x => Number(x.Id) !== Number(idToDelete))
          );

          this.rebuildDropdownKeepSelection();
          this.refreshTableForSelectedState();
        },
        error: (err: any) => {
          console.error('❌ [DELETE ERROR] Failed to delete ID:', idToDelete, err);
          this.toastSrv.showToast('Failed to delete state factor', 'error');
        }
      });
  }

  // dropdown rebuild helper
  private rebuildDropdownKeepSelection() {
    const currentStateName = this.getSelectedStateName().toLowerCase();

    const latestByState = new Map<string, StateStockFactor>();
    (this.allFactors() || []).forEach(x => {
      const prev = latestByState.get(x.State);
      if (!prev || Number(x.Id) > Number(prev.Id)) latestByState.set(x.State, x);
    });

    const options = Array.from(latestByState.values()).map(x => ({ name: x.State, id: x.Id }));
    this.dropdownStates.set(options);

    const found = options.find(o => o.name.toLowerCase() === currentStateName);
    const nextId = found?.id ?? options[0]?.id ?? 0;
    this.selectedStateId.set(nextId);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}