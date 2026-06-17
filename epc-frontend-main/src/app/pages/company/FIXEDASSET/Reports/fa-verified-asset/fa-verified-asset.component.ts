import { Component, inject, signal, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Subject, takeUntil, map } from 'rxjs';
import { ToastService } from '../../../../../shared/services/componentServices/toast.service';
import { CommonModule } from '@angular/common';
import { BreadcrumbsComponent } from '../../../../common/breadcrumbs/breadcrumbs.component';
import { FaVerifiedAssetsService } from '../../../../../shared/services/fixedAsset/fa-verified-assets.service';
import { verifiedItem, verifiedResponse } from '../../../../../shared/models/fixedAsset-models/fa-VerifiedAssetsModelmode';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtService } from '../../../../../shared/services/common/jwt.service';

@Component({
  selector: 'app-fa-verified-asset',
  standalone: true,
  imports: [CommonModule, BreadcrumbsComponent, FormsModule],
  templateUrl: './fa-verified-asset.component.html',
  styleUrl: './fa-verified-asset.component.scss'
})
export class FaVerifiedAssetComponent implements OnInit {
  isExporting = signal<boolean>(false);

  private faAssetsSrv = inject(FaVerifiedAssetsService);
  private toastSrv = inject(ToastService);
  private destroy$ = new Subject<void>();
  // private route = inject(ActivatedRoute);
  jwtSrv = inject(JwtService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  breadCrumbItems = signal([{ label: 'Verified Asset' }]);

  // Table data
  assets = signal<verifiedItem[]>([]);
  totalRecords = signal<number>(0);
  totalPages = signal<number>(0);
  isLoading = signal<boolean>(false);

  // Pagination
  currentPage = signal<number>(1);
  pageSize = signal<number>(10);

  // Filters
  // locations = signal<faLocation[]>([]);
  // assetClasses = signal<faAssetClass[]>([]);

  selectedLocationId = signal<string>('All');
  selectedClassId = signal<string>('All');

  // New Filters
  // selectedCampaignId = signal<number | null>(null);
  selectedCampaignId = signal<number>(0); // Default 0
  selectedStatus = signal<string>('All');
  selectedMethod = signal<string>('All');

  // Dropdown Lists
  campaignList = signal<any[]>([]);

  // Hardcoded based on your screenshot, but can be dynamic
  statusList = signal<string[]>(['VerifiedScanned', 'VerifiedManual', 'NotAvailable']);
  methodList = signal<string[]>(['Scan', 'Manual']);

  // Modal
  @ViewChild('viewAssetModal', { static: false })
  viewAssetModalRef!: ElementRef<HTMLElement>;

  selectedAsset = signal<verifiedItem | null>(null);

  ngOnInit(): void {
    // ONLY call loadCampaigns. 
    // loadAssets will be triggered INSIDE loadCampaigns after we find the active one.
    this.loadCampaigns();
    this.loadCampaignIdFromUrl();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


  private loadCampaignIdFromUrl(): void {
    this.activatedRoute.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (params: any) => {
          const token = params['token'];

          if (token) {
            try {
              const decryptedStatus =
                this.jwtSrv.decrypt(decodeURIComponent(token));

              // this.selectedCampaignId.set(decryptedCampaignId);
              this.selectedStatus.set(decryptedStatus);
              this.onFilterChange();   // reload table
            } catch (error) {
              this.navigateBack();
            }
          } else {
            this.navigateBack();
          }
        }
      });
  }
  navigateBack(): void {
  }
  exportVerifiedAssets(): void {
    if (!this.selectedCampaignId() || this.selectedCampaignId() === 0) {
      this.toastSrv.showToast('Please select a campaign', 'warning');
      return;
    }
    this.isExporting.set(true);
    this.faAssetsSrv.exportVerifiedAssets(this.selectedCampaignId())
      .subscribe({
        next: (blob: Blob) => {
          if (!blob || blob.size === 0) {
            this.toastSrv.showToast('File is empty or corrupt', 'error');
            this.isExporting.set(false);
            return;
          }
          const now = new Date();
          const date = now.toLocaleDateString('en-GB').replace(/\//g, '-');
          const time = now
            .toLocaleTimeString('en-GB', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            })
            .replace(/:/g, '-');

          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');

          link.href = url;
          link.download =
            `Verified_Assets_Campaign_${this.selectedCampaignId()}_${date}_${time}.xlsx`;

          document.body.appendChild(link);
          link.click();

          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);

          this.toastSrv.showToast('Excel downloaded successfully.', 'success');
          this.isExporting.set(false);
        },
        error: () => {
          this.toastSrv.showToast('Excel download failed', 'error');
          this.isExporting.set(false);
        }
      });
  }
  // LOAD DROPDOWN DATA (Campaigns)
  loadCampaigns(): void {
    this.faAssetsSrv._getCampaigns()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          const list = Array.isArray(res) ? res : (res?.data || res?.items || []);

          const campaigns = list.map((c: any) => ({
            id: c.Id || c.id || c.CampaignId,
            name: c.Name || c.name || c.CampaignName,
            isActive: c.IsActive || c.isActive
          }));
          this.campaignList.set(campaigns);
          // Logic to determine the default ID
          const defaultId = this.getDefaultCampaignId(campaigns);
          // Set the default immediately
          this.selectedCampaignId.set(defaultId);
          this.loadAssets();
        },
        error: (err) => {
          console.error('Error loading campaigns', err);
          this.toastSrv.showToast('Failed to load campaign list', 'error');
          this.loadAssets();
        }
      });
  }
  // 3. HELPER: GET DEFAULT ID

  private getDefaultCampaignId(campaigns: any[]): number {
    if (!campaigns || campaigns.length === 0) return 0;

    // Priority 1: Active Campaign
    const active = campaigns.find(c => c.isActive === true);
    if (active) return active.id;

    // Priority 2: First Campaign
    return campaigns[0].id;
  }


  // LOAD ASSETS
  loadAssets(): void {
    this.isLoading.set(true);

    const params = {
      page: this.currentPage(),
      pageSize: this.pageSize(),
      locationId: this.selectedLocationId() === 'All' ? null : this.selectedLocationId(),
      classId: this.selectedClassId() === 'All' ? null : this.selectedClassId(),
      campaignId: this.selectedCampaignId(),
      status: this.selectedStatus(),
      method: this.selectedMethod()
    };

    this.faAssetsSrv._getAssets(params)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: verifiedResponse) => {

          // Directly use API data (no mapping needed)
          this.assets.set(res.data ?? []);
          this.totalRecords.set(res.totalRecords ?? 0);
          this.totalPages.set(res.totalPages ?? 0);

          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('API Error:', err);
          this.toastSrv.showToast('Failed to load assets', 'error');
          this.isLoading.set(false);
          this.assets.set([]);
        }
      });
  }

  // FILTER HANDLERS
  
  onFilterChange(): void {
    this.currentPage.set(1);
    this.loadAssets();
  }
  // PAGINATION
  
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
    this.pageSize.set(parseInt(target.value, 10));
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

  
  // MODAL HANDLERS
  // ========================    verifiedResponse
  onViewClick(asset: verifiedItem): void {
    const searchId = asset.AssetNumber;

    this.faAssetsSrv._getAssetById(searchId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          const dataList: any[] = response?.data || [];
          const foundRaw = dataList.find((x: any) =>
            (x.assetNumber === searchId) || (x.AssetNumber === searchId)
          );

          if (foundRaw) {
            const mappedItem: verifiedItem = {
              AssetNumber: foundRaw.assetNumber || foundRaw.AssetNumber,
              AssetDescription: foundRaw.assetDescription || foundRaw.AssetDescription,
              AssetClass: foundRaw.assetClass || foundRaw.AssetClass,
              Location: foundRaw.location || foundRaw.Location,
              Status: foundRaw.status || foundRaw.Status,
              Method: foundRaw.method || foundRaw.Method,
              CampaignName: foundRaw.campaignName || foundRaw.CampaignName,
              QuantityText: foundRaw.quantityText || foundRaw.QuantityText,
              VerifiedBy: foundRaw.verifiedBy || foundRaw.VerifiedBy,
              VerifiedOn: foundRaw.verifiedOn || foundRaw.VerifiedOn,
              Latitude: foundRaw.latitude || foundRaw.Latitude,
              Longitude: foundRaw.longitude || foundRaw.Longitude,
              Remarks: foundRaw.remarks || foundRaw.Remarks,
            };
            this.selectedAsset.set(mappedItem);
          } else {
            this.selectedAsset.set(asset);
          }
          this.openModal();
        },
        error: (err) => {
          console.error('Error loading asset details:', err);
          this.toastSrv.showToast('Failed to load asset details', 'error');

          this.selectedAsset.set(asset);
          this.openModal();
        }
      });
  }
  openModal(): void {
    if (this.viewAssetModalRef) {
      const modalElement = this.viewAssetModalRef.nativeElement;
      const bootstrapModal = new (window as any).bootstrap.Modal(modalElement, {
        backdrop: 'static'
      });
      bootstrapModal.show();
    }
  }
  closeModal(): void {
    if (this.viewAssetModalRef) {
      const modalElement = this.viewAssetModalRef.nativeElement;
      // Blur active element
      const activeElement = document.activeElement as HTMLElement;
      if (modalElement.contains(activeElement)) {
        activeElement.blur();
      }
      // Get and hide modal
      const bootstrapModal = (window as any).bootstrap.Modal.getInstance(modalElement);
      if (bootstrapModal) {
        bootstrapModal.hide();
      }
      this.selectedAsset.set(null);
    }
  }
}