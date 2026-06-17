import { Component, inject, signal, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { breadCrumbItems } from '../../../../../shared/models/models';
import { CommonModule } from '@angular/common';
import { BreadcrumbsComponent } from '../../../../common/breadcrumbs/breadcrumbs.component';
import { FaCampaignManagementService } from '../../../../../shared/services/fixedAsset/fa-campaign-management.service';
import { FaUploadSrvService } from '../../../../../shared/services/fixedAsset/fa-upload-srv.service';
import { Subject, takeUntil } from 'rxjs';
import { ToastService } from '../../../../../shared/services/componentServices/toast.service'; 
import { UploadHistoryItem } from '../../../../../shared/models/fixedAsset-models/fa-uploadDataModel';
import { AuthService } from '../../../../../shared/services/common/auth.service';

@Component({
  selector: 'app-fa-uploaddata',
  standalone: true,
  imports: [CommonModule, BreadcrumbsComponent],
  templateUrl: './fa-uploaddata.component.html',
  styleUrl: './fa-uploaddata.component.scss'
})
export class FaUploaddataComponent implements OnInit, OnDestroy {


  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('closeModalBtn') closeModalBtn!: ElementRef<HTMLButtonElement>;


  private faCampaignSrv = inject(FaCampaignManagementService);
  private faUploadSrv = inject(FaUploadSrvService);
  private toastSrv = inject(ToastService);
  private authSrv = inject(AuthService);
  
  private destroy$ = new Subject<void>();

  breadCrumbItems = signal<breadCrumbItems[]>([{ label: 'Master Data Upload' }]);
  userId = signal(this.authSrv.userDetails?.userId);

   // Campaign data
  campaigns = signal<any[]>([]);
  selectedCampaignId = signal<number | null>(null);

  // File data
  selectedFile = signal<File | null>(null);
  fileError = signal<string>('');

  // Upload state
  isUploading = signal<boolean>(false);
  uploadProgress = signal<number>(0);

    // File validation
  readonly MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
  readonly ALLOWED_EXTENSIONS = ['.xlsx', '.xls', '.csv'];

  // Upload History
  uploadHistory = signal<UploadHistoryItem[]>([]);
  isLoadingHistory = signal<boolean>(false);
  currentPage = signal<number>(1);
  PageSize = signal<number>(10);
  TotalRecords = signal<number>(0);
  TotalPages = signal<number>(0);



  ngOnInit(): void {
    this.loadUploadHistory();
    this.loadCampaigns();

  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadCampaigns(): void {
    this.faCampaignSrv._getCampaigns({ filter: 'active' })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any[]) => this.campaigns.set(res || []),
        error: (err) => {
          console.error('Failed to load campaigns', err);
          this.toastSrv.showToast('Failed to load campaigns data', 'error');
        }
      });
  }

  constructor() { 
    console.log('User ID found:', );
  }


  loadUploadHistory(): void {
    this.isLoadingHistory.set(true);

    this.faUploadSrv._getUploadHistory(this.currentPage(), this.PageSize())
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.uploadHistory.set(res?.Items || []);
          this.TotalRecords.set(res?.TotalRecords || 0);
          this.TotalPages.set(res?.TotalPages || 0);
          this.currentPage.set(res?.PageNumber || 1);
          this.PageSize.set(res?.PageSize || 10);
          this.isLoadingHistory.set(false);
        },
        error: (err) => {
          console.error('Error loading upload history:', err);
          this.toastSrv.showToast('Failed to load upload history', 'error');
          this.isLoadingHistory.set(false);
          this.uploadHistory.set([]);
          this.TotalRecords.set(0);
          this.TotalPages.set(0);
        }
      });
  }

  onCampaignChange(event: Event): void {
    const val = (event.target as HTMLSelectElement).value;
    this.selectedCampaignId.set(val ? Number(val) : null);
    this.fileError.set('');
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      this.selectedFile.set(null);
      this.fileError.set('');
      return;
    }
    const file = input.files[0];

    // Validate
    if (file.size > this.MAX_FILE_SIZE) {
      this.fileError.set('File size exceeds 100MB');
      this.selectedFile.set(null);
      return;
    }
    const ext = file.name.toLowerCase();
    if (!this.ALLOWED_EXTENSIONS.some(e => ext.endsWith(e))) {
      this.fileError.set('Only Excel/CSV files allowed');
      this.selectedFile.set(null);
      return;
    }
    
    this.selectedFile.set(file);
    this.fileError.set('');
  }

  canAnalyze(): boolean {
    return (this.selectedCampaignId() !== null && !!this.selectedFile() && !this.isUploading() && !this.fileError());
  }

  analyzeFile(): void {

    console.log('>>> [Component] analyzeFile() triggered');
    

    const file = this.selectedFile();
    const campaignId = this.selectedCampaignId();
    const userDetails = this.authSrv.userDetails;

    let userId = userDetails?.userId; //new addition

    // 2. Validate User ID (Prevents "FK_Import_User" Constraint Error)
    if (!userId) {
      console.error('>>> [Component] User ID is MISSING in AuthService!');
      this.toastSrv.showToast('Authentication Error: User ID missing. Please re-login.', 'error');
      
      // OPTIONAL: Fallback for testing (Remove in production)
      // userId = 1; 
      return; 
    }

    console.log('>>> [Component] Raw Data:', {
      File: file?.name,
      campaignId: campaignId,
      userDetails: userDetails,
      extractedUserId: userId
    });

    // const userId = userDetails?.userId;

    if (!file || campaignId === null) { 
      console.warn('>>> [Component] Validation failed: Faile or Campaign missing');
      return;
    }

    const formData = new FormData();
    formData.append('File', file);
    formData.append('CampaignId', campaignId.toString());
    formData.append('UploadedBy', userId.toString());

    console.log(`>>> [Component] Sending to Service with UserID [UploadedBy]: ${userId}`);

    this.isUploading.set(true);
    this.uploadProgress.set(0);

    const progressInterval = setInterval(() => {
      const current = this.uploadProgress();
      if (current < 90) this.uploadProgress.set(current + 10);
    }, 200);

    this.faUploadSrv._uploadExcel(formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          console.log('>>> [Component] Upload Success Response:', res);
          
          clearInterval(progressInterval);
          this.uploadProgress.set(100);
          setTimeout(() => {
            this.isUploading.set(false);
            this.toastSrv.showToast('File uploaded successfully!', 'success');

            // Close Modal & Reset
            if (this.closeModalBtn) this.closeModalBtn.nativeElement.click();
            this.resetUploadForm();
            
            // Refresh Table
            this.currentPage.set(1);
            this.loadUploadHistory();
          }, 500);
        },
        error: (err: any) => {
          console.error('>>> [Component] Upload Error:', err);
          
          clearInterval(progressInterval);
          this.isUploading.set(false);
          const msg = err?.error?.message || err?.error?.detail || err?.statusText || 'Upload failed';
          this.toastSrv.showToast(msg, 'error');
        }
      });
  }

  resetUploadForm(): void {
    this.selectedCampaignId.set(null);
    this.selectedFile.set(null);
    this.fileError.set('');
    this.uploadProgress.set(0);
    if (this.fileInput?.nativeElement) this.fileInput.nativeElement.value = '';
  }

  getFileSize(): string {
    const file = this.selectedFile();
    if (!file) return '';
    return (file.size / 1024 / 1024) < 1
      ? `${(file.size / 1024).toFixed(2)} KB`
      : `${(file.size / 1024 / 1024).toFixed(2)} MB`;
  }

  onUploadSuccess(): void {
    this.currentPage.set(1);
    this.loadUploadHistory();

    const closeBtn = document.getElementById('closeModalBtn');
    if(closeBtn) closeBtn.click();
  }


  onPageChange(newPage: number): void {
    if (newPage < 1 || newPage > this.TotalPages()) {
      return;
    }

    if (newPage === this.currentPage()) {
      return;
    }

    this.currentPage.set(newPage);
    this.loadUploadHistory();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onPageSizeChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const newPageSize = parseInt(target.value, 10);

    this.PageSize.set(newPageSize);
    this.currentPage.set(1);
    this.loadUploadHistory();
  }

  getVisiblePages(): number[] {
    const current = this.currentPage();
    const total = this.TotalPages();
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
    return (this.currentPage() - 1) * this.PageSize() + index + 1;
  }

  getStartRecord(): number {
    if (this.TotalRecords() === 0) return 0;
    return (this.currentPage() - 1) * this.PageSize() + 1;
  }

  getEndRecord(): number {
    const end = this.currentPage() * this.PageSize();
    return Math.min(end, this.TotalRecords());
  }

  // ADDED: logic to convert strings to html
  toNumber(value: any): number {
    return Number(value) || 0;
  }

  getCampaignName(CampaignName: string): string {
    const id = Number(CampaignName)
    const campaign = this.campaigns().find(c => c.Id === id);
    return campaign?.Name || `Campaign ${CampaignName}`;
  }





  validateFile(file: File): { isValid: boolean; error: string } {
    if (file.size > this.MAX_FILE_SIZE) {
      return { isValid: false, error: `File size exceeds ${this.MAX_FILE_SIZE / 1024 / 1024}MB limit` };
    }
    const fileName = file.name.toLowerCase();
    const hasValidExtension = this.ALLOWED_EXTENSIONS.some(ext => fileName.endsWith(ext));
    if (!hasValidExtension) {
      return { isValid: false, error: 'Only Excel (.xlsx, .xls) and CSV files are allowed' };
    }
    return { isValid: true, error: '' };
  }


  

  

  resetAll(): void {
    this.selectedCampaignId.set(null);
    this.selectedFile.set(null);
    this.fileError.set('');
    this.uploadProgress.set(0);
    if (this.fileInput?.nativeElement) this.fileInput.nativeElement.value = '';
  }
}
