import { Component,signal,ViewChild,ElementRef,OnInit,OnDestroy,inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { BreadcrumbsComponent } from '../../../../common/breadcrumbs/breadcrumbs.component';
import { breadCrumbItems } from '../../../../../shared/models/models';
import { ToastService } from '../../../../../shared/services/componentServices/toast.service';
import { ConfirmationDialogService } from '../../../../../shared/services/componentServices/confirmation-dialog.service';
import { FaGhostAssetService } from '../../../../../shared/services/fixedAsset/fa-ghost-asset.service';
import { ItemFaGhost } from '../../../../../shared/models/fixedAsset-models/fa-ghostAsset';
import { FaCampaignManagementService } from '../../../../../shared/services/fixedAsset/fa-campaign-management.service';
import { Fixassetmodel } from '../../../../../shared/models/fixedAsset-models/fixedassets';
import { ActivatedRoute } from '@angular/router';

declare var bootstrap: any;

@Component({
  selector: 'app-fa-ghost-asset',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BreadcrumbsComponent],
  templateUrl: './fa-ghost-asset.component.html',
  styleUrls: ['./fa-ghost-asset.component.scss']
})
export class FaGhostAssetComponent implements OnInit, OnDestroy {

private faCampaignSrv = inject(FaCampaignManagementService);



campaigns = signal<Fixassetmodel[]>([]);
selectedCampaignId = signal<number | null>(null);



  @ViewChild('createGhostAssetModal') createGhostAssetModal!: ElementRef;
  @ViewChild('fileInput') fileInput!: ElementRef;

  private fb = inject(FormBuilder);
  private srv = inject(FaGhostAssetService);
  private toastSrv = inject(ToastService);
  private confirmSrv = inject(ConfirmationDialogService);
  private destroy$ = new Subject<void>();
  private route = inject(ActivatedRoute);

  breadCrumbItems = signal<breadCrumbItems[]>([{ label: 'Verification' }]);

  ghostAssets = signal<ItemFaGhost[]>([]);
  totalRecords = signal<number>(0);
  currentPage = signal<number>(1);
  pageSize = signal<number>(10);
  totalPages = signal<number>(0);
  
  isLoading = signal<boolean>(false);
  isUploading = signal<boolean>(false);

  locations = signal<any[]>([]);
  assetClasses = signal<any[]>([]);

  ghostAssetForm!: FormGroup;
  selectedFile = signal<File | null>(null);
  errorMessage = signal<string>('');

  ngOnInit(): void {
this.loadCampaigns(); 


    this.initForm();
    this.loadFilters();
    this.loadGhostAssets();
    this.reviewForm = this.fb.group({
      decision: ['', Validators.required],
      adminRemarks: ['', Validators.required]
    });

    this.ghostAssets.set([]);
  this.totalRecords.set(0);
  this.totalPages.set(0);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initForm(): void {
    this.ghostAssetForm = this.fb.group({
      Description: ['', Validators.required],
      SerialOrModel: ['', Validators.required],
      AssetClassId: ['', Validators.required],
      LocationId: ['', Validators.required],
      ConditionRemarks: ['']
    });
  }

  loadFilters(): void {
    this.srv.getLocationsAndClasses()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.locations.set(res?.Locations || []);
          this.assetClasses.set(res?.AssetClasses || []);
        },
        error: (err) => {
          console.error('Error loading filters:', err);
          this.toastSrv.showToast('Failed to load filters', 'error');
        }
      });
  }









loadCampaigns(): void {
  const params: any = {}; // you can pass { filter: 'active' } if needed

  this.faCampaignSrv
    ._getCampaigns(params)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (res: Fixassetmodel[]) => {
        this.campaigns.set(res);

        if (res && res.length > 0) {
          const defaultId = res[0].Id;

          this.selectedCampaignId.set(defaultId);
          this.loadGhostAssets();
        }
      },
      error: (err) => {
        console.error('Campaign list error:', err);
        this.campaigns.set([]);
      }
    });
}


onCampaignChange(event: Event): void {
  const value = (event.target as HTMLSelectElement).value;

  // ✅ If no campaign selected -> clear UI
  if (!value) {
    this.selectedCampaignId.set(null);
    this.ghostAssets.set([]);
    this.totalRecords.set(0);
    this.totalPages.set(0);
    this.currentPage.set(1);
    return;
  }

  const campaignId = Number(value);
  this.selectedCampaignId.set(campaignId);

  // ✅ Reset pagination and reload data
  this.currentPage.set(1);
  this.loadGhostAssets();
}






















  // loadGhostAssets(): void {
  //   this.isLoading.set(true);

  //   this.srv.getGhostAssets(this.currentPage(), this.pageSize())
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe({
  //       next: (res: any) => {
  //         this.ghostAssets.set(res?.Items || []);
  //         this.totalRecords.set(res?.TotalCount || 0);
  //         this.totalPages.set(res?.TotalPages || 0);
  //         this.currentPage.set(res?.Page || 1);
  //         this.pageSize.set(res?.PageSize || 10);
  //         this.isLoading.set(false);
  //       },
  //       error: (err) => {
  //         console.error('Error loading ghost assets:', err);
  //         this.toastSrv.showToast('Failed to load ghost assets', 'error');
  //         this.isLoading.set(false);
  //         this.ghostAssets.set([]);
  //         this.totalRecords.set(0);
  //         this.totalPages.set(0);
  //       }
  //     });
  // }







loadGhostAssets(): void {

  // ✅ Do not call API if campaign not selected
  if (!this.selectedCampaignId()) {
    this.ghostAssets.set([]);
    this.totalRecords.set(0);
    this.totalPages.set(0);
    return;
  }

  this.isLoading.set(true);

  const payload = {
    campaignId: this.selectedCampaignId()!,
    page: this.currentPage(),
    pageSize: this.pageSize()
  };

  this.srv._searchGhostAssets(payload)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (res: any) => {
        // ✅ Swagger response shows: { items: [] }
        this.ghostAssets.set(res?.items || res?.Items || []);

        // ✅ If backend also returns pagination (if available)
        this.totalRecords.set(res?.totalCount || res?.TotalCount || 0);
        this.totalPages.set(res?.totalPages || res?.TotalPages || 0);

        this.isLoading.set(false);
      },
      error: (err:any) => {
        console.error('Ghost search API error:', err);
        this.toastSrv.showToast('Failed to load ghost assets', 'error');

        this.isLoading.set(false);
        this.ghostAssets.set([]);
        this.totalRecords.set(0);
        this.totalPages.set(0);
      }
    });
}

























  onPageChange(newPage: number): void {
    if (newPage < 1 || newPage > this.totalPages()) {
      return;
    }

    if (newPage === this.currentPage()) {
      return;
    }

    this.currentPage.set(newPage);
    this.loadGhostAssets();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onPageSizeChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const newPageSize = parseInt(target.value, 10);

    this.pageSize.set(newPageSize);
    this.currentPage.set(1);
    this.loadGhostAssets();
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

  getStartRecord(): number {
    if (this.totalRecords() === 0) return 0;
    return (this.currentPage() - 1) * this.pageSize() + 1;
  }

  getEndRecord(): number {
    const end = this.currentPage() * this.pageSize();
    return Math.min(end, this.totalRecords());
  }

  openCreateGhostAssetModal(): void {
    this.resetForm();
    this.openModal();
  }

  openModal(): void {
    if (this.createGhostAssetModal) {
      const modalElement = this.createGhostAssetModal.nativeElement;
      const modal = new bootstrap.Modal(modalElement, {
        backdrop: 'static',
        keyboard: false
      });
      modal.show();
    }
  }

  closeModal(): void {
    if (this.createGhostAssetModal) {
      const modalElement = this.createGhostAssetModal.nativeElement;

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

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    this.errorMessage.set('');
    this.selectedFile.set(null);

    if (!file) {
      return;
    }

    // Validate file type
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp'
    ];
    if (!allowedTypes.includes(file.type)) {
      this.errorMessage.set('Invalid file type. Only image files are allowed.');
      input.value = '';
      return;
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      this.errorMessage.set('File size exceeds 5MB limit.');
      input.value = '';
      return;
    }

    this.selectedFile.set(file);
  }

  submit(): void {
    if (this.ghostAssetForm.invalid) {
      this.ghostAssetForm.markAllAsTouched();
      this.toastSrv.showToast('Please fill all required fields', 'error');
      return;
    }

    this.isUploading.set(true);

    const formData = new FormData();
    const formValue = this.ghostAssetForm.value;

    Object.keys(formValue).forEach((key) => {
      const value = formValue[key];
      if (value !== null && value !== undefined && value !== '') {
        formData.append(key, value);
      }
    });

    if (this.selectedFile()) {
      formData.append('Photo', this.selectedFile()!);
    }

    this.srv._createGhost(formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.toastSrv.showToast('Ghost asset created successfully!', 'success');
          this.closeModal();
          this.loadGhostAssets();
        },
        error: (err) => {
          console.error('Error creating ghost asset:', err);
          this.toastSrv.showToast(
            err?.error?.message || 'Failed to create ghost asset',
            'error'
          );
        },
        complete: () => {
          this.isUploading.set(false);
        }
      });
  }

  resetForm(): void {
    this.ghostAssetForm.reset({
      Description: '',
      SerialOrModel: '',
      AssetClassId: '',
      LocationId: '',
      ConditionRemarks: ''
    });
    this.selectedFile.set(null);
    this.errorMessage.set('');
    
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  // async confirmApprove(asset: ItemFaGhost): Promise<void> {
  //   const confirmed = await this.confirmSrv.showConfirm(
  //     `Are you sure you want to approve "${asset.Description}"?`,
  //     'Confirm Approve'
  //   );

  //   if (confirmed) {
  //     this.approveGhostAsset(asset);
  //   }
  // }

  // async confirmReject(asset: ItemFaGhost): Promise<void> {
  //   const confirmed = await this.confirmSrv.showConfirm(
  //     `Are you sure you want to reject "${asset.Description}"?`,
  //     'Confirm Reject'
  //   );

  //   if (confirmed) {
  //     this.rejectGhostAsset(asset);
  //   }
  // }

  // approveGhostAsset(asset: ItemFaGhost): void {  
  //   this.srv.approveGhostAsset(asset.GhostId)
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe({
  //       next: () => {
  //         this.toastSrv.showToast(`"${asset.Description}" approved successfully`, 'success');
  //         this.loadGhostAssets();
  //       },
  //       error: (err) => {
  //         console.error('Approve failed:', err);
  //         this.toastSrv.showToast(
  //           err?.error?.message || 'Failed to approve ghost asset',
  //           'error'
  //         );
  //       }
  //     });
  // }

  // rejectGhostAsset(asset: ItemFaGhost): void { 
  //   this.srv.rejectGhostAsset(asset.GhostId)
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe({
  //       next: () => {
  //         this.toastSrv.showToast(`"${asset.Description}" rejected successfully`, 'success');
  //         this.loadGhostAssets();
  //       },
  //       error: (err) => {
  //         console.error('Reject failed:', err);
  //         this.toastSrv.showToast(
  //           err?.error?.message || 'Failed to reject ghost asset',
  //           'error'
  //         );
  //       }
  //     });
  // }

  @ViewChild('reviewModal') reviewModal!: ElementRef;

selectedGhostAsset = signal<ItemFaGhost | null>(null);

reviewForm!: FormGroup;

openReviewModal(asset: ItemFaGhost): void {
  this.selectedGhostAsset.set(asset);
  // this.reviewForm.reset();

  this.reviewForm.reset({
  decision: '',
  adminRemarks: ''
});


  const modal = new bootstrap.Modal(this.reviewModal.nativeElement, {
    backdrop: 'static',
    keyboard: false
  });
  modal.show();
}

submitReview(): void {
 
  if (this.reviewForm.invalid || !this.selectedGhostAsset()) {
    this.reviewForm.markAllAsTouched();
    return;
  }

  const asset = this.selectedGhostAsset()!;
  const payload = this.reviewForm.value;
 debugger
  this.srv.reviewGhostAsset(asset.GhostId, payload)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: () => {
        this.toastSrv.showToast(
          `Asset ${payload.decision} successfully`,
          'success'
        );
        this.loadGhostAssets();

        const modal = bootstrap.Modal.getInstance(this.reviewModal.nativeElement);
        modal?.hide();
      },
      error: (err) => {
        this.toastSrv.showToast(
          err?.error?.message || 'Review failed',
          'error'
        );
      }
    });
}






async confirmApprove(asset: ItemFaGhost): Promise<void> {
 console.log("approved calling fix data show **********",asset)
  const confirmed = await this.confirmSrv.showConfirm(
    `Are you sure you want to approve "${asset.Description}"?`,
    'Confirm Approve'
   
  );

  if (!confirmed) return;

  const payload = {
    decision: 'Approve',
    adminRemarks: 'Approved by admin'
  };
  console.log("Ghost id find ",asset.GhostId)
  this.srv.reviewGhostAsset(asset.GhostId, payload)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: () => {
        this.toastSrv.showToast('Asset approved successfully', 'success');
        this.loadGhostAssets();
      },
      error: (err) => {
        this.toastSrv.showToast(err?.error?.message || 'Approve failed', 'error');
      }
    });
}


async confirmReject(asset: ItemFaGhost): Promise<void> {
    console.log("reject calling fix data show **********",asset)
  const confirmed = await this.confirmSrv.showConfirm(
    `Are you sure you want to reject "${asset.Description}"?`,
    'Confirm Reject'
  );

  if (!confirmed) return;

  const payload = {
    decision: 'Reject',
    adminRemarks: 'Rejected by admin'
  };
   
  this.srv.reviewGhostAsset(asset.GhostId, payload)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: () => {
        this.toastSrv.showToast('Asset rejected successfully', 'success');
        this.loadGhostAssets();
      },
      error: (err) => {
        this.toastSrv.showToast(err?.error?.message || 'Reject failed', 'error');
      }
    });
}



}