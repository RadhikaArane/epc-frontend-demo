import { Component, inject, signal, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbsComponent } from '../../../../common/breadcrumbs/breadcrumbs.component';
import { FaAssetsMasterSrvService } from '../../../../../shared/services/fixedAsset/fa-assets-master-srv.service';
import { Campaign, faAssetClass, faAssetResponse, faAssetsItem, faLocation } from '../../../../../shared/models/fixedAsset-models/fa-AssetMasterModel';
import { Subject, takeUntil } from 'rxjs';
import { ToastService } from '../../../../../shared/services/componentServices/toast.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-fa-asset-mastera',
  standalone: true,
  imports: [CommonModule, BreadcrumbsComponent],
  templateUrl: './fa-asset-mastera.component.html',
  styleUrl: './fa-asset-mastera.component.scss'
})
export class FaAssetMasteraComponent implements OnInit {
  
  private faAssetsSrv = inject(FaAssetsMasterSrvService);
  private toastSrv = inject(ToastService);
  private destroy$ = new Subject<void>();
  private route = inject(ActivatedRoute);

  breadCrumbItems = signal([{ label: 'Assets Master' }]);

  selectedCampaignId = signal<number | null>(null);

  // Table data
  assets = signal<faAssetsItem[]>([]);
  totalRecords = signal<number>(0);
  totalPages = signal<number>(0);
  isLoading = signal<boolean>(false);

  // Pagination
  currentPage = signal<number>(1);
  pageSize = signal<number>(10);

  // Filters
  locations = signal<faLocation[]>([]);
  assetClasses = signal<faAssetClass[]>([]);

  // Campaign
  Campaign = signal<Campaign[]>([]);
  assetNumber = signal<string | null>(null);


  // selectedLocationId = signal<string>('All');
  // selectedClassId = signal<string>('All'); 

  
  selectedLocationId = signal<string | null>('All');  // Default to 'All' location
  selectedClassId = signal<string | null>('All');  // Default to 'All' class


  // // Modal
  // @ViewChild('viewAssetModal', { static: false })
  // viewAssetModalRef!: ElementRef<HTMLElement>;
  
  selectedAsset = signal<faAssetsItem | null>(null);
  fileError: any;

  ngOnInit(): void {
    this.loadFilters();
    // this.loadAssets();
    this.loadCampaigns(); 

  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ========================
  // LOAD FILTERS
  // ========================
  loadFilters(): void {
    this.faAssetsSrv._getLocationsAndClasses()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.locations.set(res?.Locations || []);
          this.assetClasses.set(res?.AssetClasses || []);
        },
        error: (err) => {
          console.error('Error loading filters:', err);
          this.locations.set([]);
          this.assetClasses.set([]);
        }

        
      });  
  }

  // ========================
  // loadCampaigns
  // ========================
  loadCampaigns(): void {
    this.faAssetsSrv._getCampaignsName()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.Campaign.set(res || []);
          console.log("campaign data", this.Campaign());
          this.Campaign.set(res);

          if (res.length > 0) {
            const firstId = res[0].Id;
            this.selectedCampaignId.set(firstId);
            console.log("Default Campaign Selected:", res[0].Name);
          }

          this.loadAssets();
        },
        error: (err) => {
          console.error('Error loading filters:', err);
          this.Campaign.set([]);
          this.loadAssets();
        }

        
      });  
  }



  // ========================
  // LOAD ASSETS
  // ========================
  loadAssets(): void {
    this.isLoading.set(true);
    console.log("load assets called")

    const params = {
                page: this.currentPage(),
                pageSize: this.pageSize(),
                
                locationId:
                  this.selectedLocationId() === 'All' ? null : this.selectedLocationId(),
                assetClassId:
                  this.selectedClassId() === 'All' ? null : this.selectedClassId(),
                campaignId:
                  this.selectedCampaignId(),
                assetNumber:
                  this.assetNumber(),
              };
console.log('Params passes values for :', params);

    this.faAssetsSrv._getAssets(params)
  .pipe(takeUntil(this.destroy$))
  .subscribe({
    next: (res: faAssetResponse) => {
      // Assuming res.Items is an array of asset objects.
      this.assets.set(res?.Items || []);
      this.totalRecords.set(res?.TotalRecords || 0);
      this.totalPages.set(Math.ceil((res?.TotalRecords || 0) / this.pageSize()));
      this.isLoading.set(false);
    },
    error: (err) => {
      console.error('Error loading assets:', err);
      this.toastSrv.showToast('Failed to load assets', 'error');
      this.isLoading.set(false);
      this.assets.set([]);
      this.totalRecords.set(0);
      this.totalPages.set(0);
    }
  });
  }

  // ========================
  // FILTER HANDLERS
  // ========================

  onCampaignChange(event: Event): void {
  const target = event.target as HTMLSelectElement;

  const value = target.value === 'All'
    ? null
    : Number(target.value);

  this.selectedCampaignId.set(value);

  this.currentPage.set(1);
  this.loadAssets();
}


  onLocationChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedLocationId.set(target.value); // Update location filter
    this.currentPage.set(1); // Reset to the first page
    this.loadAssets(); // Reload assets based on the new location filter
  }

onClassChange(event: Event): void {
  const target = event.target as HTMLSelectElement;
  console.log('Asset class change fired'); // 👈 ADD THIS
  this.selectedClassId.set(target.value); // Update asset class filter
  
  this.currentPage.set(1); // Reset to the first page
  this.loadAssets(); // Reload assets based on the new asset class filter
  
}

  // onAssetNumberSearch(value: string): void {
  //   const trimmedValue = value?.trim();

  //   this.assetNumber.set(trimmedValue ? trimmedValue : null);
 
  //   this.currentPage.set(1);
  //   this.loadAssets();
  // }










  

onAssetSearch(value: string): void {
  const trimmedValue = value?.trim();

  if (trimmedValue) {
    console.log('Searching Asset Number:', trimmedValue);
    this.assetNumber.set(trimmedValue);
    this.currentPage.set(1);
    this.loadAssets();
  } else {
    this.toastSrv.showToast('Please enter Asset Number', 'warning');
  }
}

clearAssetSearch(): void {
  this.assetNumber.set(null);
  this.currentPage.set(1);
  this.loadAssets();
}







  //pagination 
  onPageChange(newPage: number): void {
    if (newPage < 1 || newPage > this.totalPages()) {
      return;
    }

    if (newPage === this.currentPage()) {
      return;
    }

    this.currentPage.set(newPage);
    this.loadAssets();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onPageSizeChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const newPageSize = parseInt(target.value, 10);

    this.pageSize.set(newPageSize);
    this.currentPage.set(1);
    this.loadAssets();
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

  

  // ========================
  // MODAL HANDLERS
  // ========================
  // onViewClick(asset: faAssetsItem): void {
  //   const assetId = asset.AssetId;

  //   this.faAssetsSrv._getAssetById(assetId)
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe({
  //       next: (response) => {
  //         const items = response?.items || [];
  //         const foundAsset = items.find((x: any) => 
  //           String(x.AssetId) === String(assetId)
  //         );
          
  //         this.selectedAsset.set(foundAsset || asset);
  //         this.openModal();
  //       },
  //       error: (err) => {
  //         console.error('Error loading asset details:', err);
  //         this.toastSrv.showToast('Failed to load asset details', 'error');
  //       }
  //     });
  // }

  // openModal(): void {
  //   if (this.viewAssetModalRef) {
  //     const modalElement = this.viewAssetModalRef.nativeElement;
  //     const bootstrapModal = new (window as any).bootstrap.Modal(modalElement, {
  //       backdrop: 'static'
  //     });
  //     bootstrapModal.show();
  //   }
  // }

  // closeModal(): void {
  //   if (this.viewAssetModalRef) {
  //     const modalElement = this.viewAssetModalRef.nativeElement;
      
  //     // Blur active element
  //     const activeElement = document.activeElement as HTMLElement;
  //     if (modalElement.contains(activeElement)) {
  //       activeElement.blur();
  //     }
      
  //     // Get and hide modal
  //     const bootstrapModal = (window as any).bootstrap.Modal.getInstance(modalElement);
  //     if (bootstrapModal) {
  //       bootstrapModal.hide();
  //     }
      
  //     this.selectedAsset.set(null);
  //   }
  // }
}