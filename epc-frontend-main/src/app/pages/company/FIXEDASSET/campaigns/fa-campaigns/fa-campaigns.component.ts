import { Component, inject, signal, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { breadCrumbItems } from '../../../../../shared/models/models';
import { BreadcrumbsComponent } from '../../../../common/breadcrumbs/breadcrumbs.component';
import { FixassetCreatePayload, Fixassetmodel } from '../../../../../shared/models/fixedAsset-models/fixedassets';
import { FaCampaignManagementService } from '../../../../../shared/services/fixedAsset/fa-campaign-management.service';
import { ConfirmationDialogService } from '../../../../../shared/services/componentServices/confirmation-dialog.service';
import { ToastService } from '../../../../../shared/services/componentServices/toast.service';
import { Subject, takeUntil } from 'rxjs';

declare var bootstrap: any;

@Component({
  selector: 'app-fa-campaigns',
  standalone: true,
  imports: [BreadcrumbsComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './fa-campaigns.component.html',
  styleUrl: './fa-campaigns.component.scss'
})
export class FaCampaignsComponent implements OnInit {

  @ViewChild('createCampaignModal') createCampaignModal!: ElementRef;

  breadCrumbItems = signal<breadCrumbItems[]>([{ label: 'Campaigns' }]);

  campaigns = signal<Fixassetmodel[]>([]);
  activeCampaign = signal<Fixassetmodel | null>(null);

  isEditMode = signal<boolean>(false);
  editingCampaignId = signal<number | null>(null);


  isLoading = signal<boolean>(false);
  isSubmitting = signal<boolean>(false);

  campaignForm!: FormGroup;

  selectedFilter = signal<string>('');

  private fb = inject(FormBuilder);
  private faCampaignSrv = inject(FaCampaignManagementService);
  private confirmDialogSrv = inject(ConfirmationDialogService);
  private toastSrv = inject(ToastService);
  private destroy$ = new Subject<void>();

  constructor() {
    this.campaignForm = this.fb.group({
      name: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCampaigns();
  }

  loadCampaigns(): void {
    this.isLoading.set(true);

    const filter = this.selectedFilter();
    const params: any = {};
    if (filter === 'active') {
      params.status = 'active';
    }
    else if (filter === 'inactive') {
      params.status = 'inactive';
    }

    this.faCampaignSrv
      ._getCampaigns(params)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          console.log('✅ Campaigns Response:', res);
          this.campaigns.set(res);
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('❌ Campaigns API Error:', err);
          this.toastSrv.showToast('Failed to load campaigns', 'error');
          this.campaigns.set([]);
          this.isLoading.set(false);
        }
      });
  }

  onFilterChange(event: any): void {
    const target = event.target as HTMLSelectElement;
    this.selectedFilter.set(target.value);
    this.loadCampaigns();
  }

  openModal(): void {
    if (this.createCampaignModal) {
      const modalElement = this.createCampaignModal.nativeElement;
      const modal = new bootstrap.Modal(modalElement, {
        backdrop: 'static',
        keyboard: false
      });
      modal.show();
    }
  }

  closeModal(): void {
    if (this.createCampaignModal) {
      const modalElement = this.createCampaignModal.nativeElement;

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

  submit(): void {
    if (this.campaignForm.invalid) {
      this.campaignForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    let api$;

    if (this.isEditMode()) {
      // ✅ UPDATE PAYLOAD
      const payload = {
        campaignId: this.editingCampaignId(),
        name: this.campaignForm.value.name,
        startDate: this.campaignForm.value.startDate,
        endDate: this.campaignForm.value.endDate
      };

      api$ = this.faCampaignSrv._updateCampaign(payload);
    } else {
      // ✅ CREATE PAYLOAD
      // const payload = {
      //   Name: this.campaignForm.value.name,
      //   StartDate: this.campaignForm.value.startDate,
      //   EndDate: this.campaignForm.value.endDate
      // };





      const payload = new FixassetCreatePayload();

      payload.Name = this.campaignForm.value.name;
      payload.StartDate = this.campaignForm.value.startDate;
      payload.EndDate = this.campaignForm.value.endDate;














      api$ = this.faCampaignSrv._createCampaign(payload);
    }

    api$.pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {

        if (this.isEditMode()) {
          // 🔥 UI UPDATE
          this.campaigns.update(list =>
            list.map(c =>
              c.Id === this.editingCampaignId()
                ? {
                  ...c,
                  Name: this.campaignForm.value.name,
                  StartDate: new Date(this.campaignForm.value.startDate).toISOString(),
                  EndDate: new Date(this.campaignForm.value.endDate).toISOString()
                }
                : c
            )
          );
        } else {
          this.loadCampaigns();
        }

        this.closeModal();
        this.isSubmitting.set(false);
      },
      error: (err) => {
        console.error('❌ Update error', err);
        this.isSubmitting.set(false);
      }
    });
  }

  resetForm(): void {
    this.campaignForm.reset();
    this.isEditMode.set(false);
    this.editingCampaignId.set(null);
  }

  activateDeactivateCampaign(campaign: Fixassetmodel, event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    const originalState = campaign.IsActive;

    const payload = { campaignId: campaign.Id };

    const api$ = campaign.IsActive
      ? this.faCampaignSrv._deactivateCampaign(payload)
      : this.faCampaignSrv._activateCampaign(payload);

    api$.pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.toastSrv.showToast(
          `Campaign ${campaign.IsActive ? 'deactivated' : 'activated'} successfully!`,
          'success'
        );

        // ✅ UI update only AFTER backend success
        this.campaigns.update(list =>
          list.map(c =>
            c.Id === campaign.Id
              ? { ...c, IsActive: !originalState }
              : c
          )
        );
      },
      error: (err) => {
        console.error('❌ Toggle error', err);

        // ❌ revert checkbox if backend failed
        checkbox.checked = originalState;

        this.toastSrv.showToast(
          err.error?.message || 'Failed to update campaign status',
          'error'
        );
      }
    });
  }


  onEditCampaign(campaign: Fixassetmodel): void {
    this.isEditMode.set(true);
    this.editingCampaignId.set(campaign.Id);

    this.campaignForm.patchValue({
      name: campaign.Name,
      startDate: campaign.StartDate.substring(0, 10),
      endDate: campaign.EndDate.substring(0, 10)
    });

    this.openModal();
  }

  async onDeleteCampaign(campaign: Fixassetmodel): Promise<void> {

    const confirmed = await this.confirmDialogSrv.showConfirm(
      `Are you sure you want to delete "${campaign.Name}"?`,
      'Confirm Delete'
    );

    if (!confirmed) {
      return;
    }

    // const payload = { campaignId: campaign.Id.toString() };

    this.faCampaignSrv._deleteCampaign(campaign.Id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.toastSrv.showToast('Campaign deleted successfully!', 'success');

          // 🔥 UI lo row remove (NO reload)
          this.campaigns.update(list =>
            list.filter(c => c.Id !== campaign.Id)
          );
        },
        error: (err) => {
          console.error('❌ Delete error', err);
          this.toastSrv.showToast(
            err.error?.message || 'Failed to delete campaign',
            'error'
          );
        }
      });
  }



  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}