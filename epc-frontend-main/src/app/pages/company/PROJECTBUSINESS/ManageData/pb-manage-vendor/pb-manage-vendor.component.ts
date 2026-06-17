import { Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { breadCrumbItems } from '../../../../../shared/models/models';
import { CommonModule } from '@angular/common';
import { BreadcrumbsComponent } from '../../../../common/breadcrumbs/breadcrumbs.component';
import { ToastService } from '../../../../../shared/services/componentServices/toast.service';
import { PbProjectManagementService } from '../../../../../shared/services/projectBusiness/pb-project-management.service';
import { Subject, takeUntil } from 'rxjs';
import { GetVendorList } from '../../../../../shared/models/projectBusiness-models/projectmanagement';

declare var bootstrap: any;

@Component({
  selector: 'app-pb-manage-vendor',
  standalone: true,
  imports: [CommonModule, BreadcrumbsComponent],
  templateUrl: './pb-manage-vendor.component.html',
  styleUrl: './pb-manage-vendor.component.scss'
})
export class PbManageVendorComponent {

  breadCrumbItems = signal<breadCrumbItems[]>([
    { label: 'Manage Data' },
  ]);

  @ViewChild("AddVendorUpload") AddVendorUpload!: ElementRef | undefined;
  @ViewChild("fileInput") fileInput!: ElementRef<HTMLInputElement>;

  // Signals
  selectedFile = signal<File | null>(null);
  errorMessage = signal<string>('');
  isUploading = signal<boolean>(false);

  // Pagination signals
  currentPage = signal<number>(1);
  pageSize = signal<number>(10);
  totalRecords = signal<number>(0);
  totalPages = signal<number>(0);

  isLoading = signal<boolean>(true);
  allVendors = signal<GetVendorList[]>([]);



  toastSrv = inject(ToastService);
  projectSrv = inject(PbProjectManagementService);
  private destroy$ = new Subject<void>();

  constructor() { }

  ngOnInit() {
    this.loadVendorList();
  }

  OpenModal(): void {
    if (this.AddVendorUpload) {
      this.resetForm();
      const modalElement = this.AddVendorUpload.nativeElement;
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  CloseModal(): void {
    if (this.AddVendorUpload) {
      const modalElement = this.AddVendorUpload.nativeElement;

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

    if (!file) {
      this.selectedFile.set(null);
      this.errorMessage.set('');
      return;
    }

    // Validate file
    const validation = this.validateFile(file);
    if (!validation.isValid) {
      this.errorMessage.set(validation.message);
      this.selectedFile.set(null);
      input.value = ''; // Clear input
      return;
    }

    this.selectedFile.set(file);
    this.errorMessage.set('');
  }

  validateFile(file: File): { isValid: boolean; message: string } {
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    const allowedTypes = [
      'application/vnd.ms-excel', // .xls
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' // .xlsx
    ];
    const allowedExtensions = ['.xls', '.xlsx'];

    // Check file extension
    const fileName = file.name.toLowerCase();
    const hasValidExtension = allowedExtensions.some(ext => fileName.endsWith(ext));

    if (!hasValidExtension) {
      return {
        isValid: false,
        message: 'Only Excel files (.xls, .xlsx) are allowed.'
      };
    }

    // Check file type
    if (!allowedTypes.includes(file.type) && file.type !== '') {
      return {
        isValid: false,
        message: 'Invalid file type. Only Excel files are allowed.'
      };
    }

    // Check file size
    if (file.size > maxSize) {
      return {
        isValid: false,
        message: 'File size must not exceed 5MB.'
      };
    }

    return { isValid: true, message: '' };
  }

  saveVendor(): void {
    if (!this.selectedFile()) {
      this.errorMessage.set('Please select a file to upload.');
      return;
    }

    this.isUploading.set(true);
    this.errorMessage.set('');

    const formData = new FormData();
    formData.append('file', this.selectedFile()!);

    this.projectSrv._uploadVendorAttachment(formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          console.log('Upload successful', res);
          this.isUploading.set(false);
          this.toastSrv.showToast('Excel Uploading Successfully', 'success');
          this.CloseModal();
        },
        error: (error) => {
          console.error('Upload failed', error);
          this.isUploading.set(false);
          this.errorMessage.set(error?.error?.message || 'Upload failed. Please try again.');
          this.toastSrv.showToast('Error uploading project list', 'error');
        }
      });
  }

  resetForm(): void {
    this.selectedFile.set(null);
    this.errorMessage.set('');
    this.isUploading.set(false);
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }


  //table
  private loadVendorList(): void {
    this.isLoading.set(true);

    const params = {
      page: this.currentPage(),
      pageSize: this.pageSize()
    };

    console.log('Loading Vendor list with params:', params);

    this.projectSrv._getAllVendors(params)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          console.log("Vendor response:", res);

          this.allVendors.set(res.items || []);
          this.totalRecords.set(res.total || 0);
          this.totalPages.set(res.totalPages || 0);
          this.currentPage.set(res.page || 1);
          this.pageSize.set(res.pageSize || 10);

          this.isLoading.set(false);
        },
        error: (err: any) => {
          console.error("Error loading Vendor List:", err);
          this.toastSrv.showToast(
            err?.message || 'Error occurred while loading Vendor list.',
            'error'
          );
          this.isLoading.set(false);
          this.allVendors.set([]);
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

    console.log(`Changing page from ${this.currentPage()} to ${newPage}`);

    this.currentPage.set(newPage);
    this.loadVendorList();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onPageSizeChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const newPageSize = parseInt(target.value, 10);

    console.log(`Changing page size from ${this.pageSize()} to ${newPageSize}`);

    this.pageSize.set(newPageSize);
    this.currentPage.set(1);
    this.loadVendorList();
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

  //use to call after like deletion API call
  private refreshCurrentPage(): void {
    this.loadVendorList();
  }


  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}