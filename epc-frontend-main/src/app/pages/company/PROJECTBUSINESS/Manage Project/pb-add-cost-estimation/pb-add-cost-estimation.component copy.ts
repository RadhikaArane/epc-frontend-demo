// import {
//   Component, ElementRef, HostListener, inject, signal,
//   ViewChild, OnDestroy, OnInit, computed
// } from '@angular/core';
// import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { ActivatedRoute, Router } from '@angular/router';
// import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
// import { BreadcrumbsComponent } from '../../../../common/breadcrumbs/breadcrumbs.component';
// import { breadCrumbItems } from '../../../../../shared/models/models';
// import { JwtService } from '../../../../../shared/services/common/jwt.service';
// import { ToastService } from '../../../../../shared/services/componentServices/toast.service';
// import { ConfirmationDialogService } from '../../../../../shared/services/componentServices/confirmation-dialog.service';
// import { PbProjectManagementService } from '../../../../../shared/services/projectBusiness/pb-project-management.service';
// import {
//   GetCostHead, GetSubHead, Vendor,
//   VendorAttachment, VendorPaginationState
// } from '../../../../../shared/models/projectBusiness-models/projectmanagement';
// import { PbManageCostHeadsComponent } from '../pb-manage-cost-heads/pb-manage-cost-heads.component';
// import { PbManageSubCostHeadsComponent } from '../pb-manage-sub-cost-heads/pb-manage-sub-cost-heads.component';

// declare var bootstrap: any; 

// // ==================== Interfaces ====================

// interface SubHeadRow {
//   id: string;
//   subHeadId: string;
//   subHeadName: string;
//   costBasis: string;
//   amount: string;
//   excelFile: File | null;
//   isAmountFromExcel: boolean;
//   fileIndex: number | null;
//   touched: boolean;
//   isNewlyAdded: boolean;
// }

// interface CostEstimationRow {
//   id: string;
//   costHeadId: string;
//   costHeadName: string;
//   costBasis: string;
//   amount: string;
//   excelFile: File | null;
//   isAmountFromExcel: boolean;
//   fileIndex: number | null;
//   selectedVendors: Vendor[];
//   vendorAttachments: VendorAttachment[];
//   showVendorDropdown: boolean;
//   touched: boolean;
//   // Sub Head fields
//   subHeads: SubHeadRow[];
//   showSubHeadDropdown: boolean;
//   subHeadDropdownList: GetSubHead[];
//   isLoadingSubHeads: boolean;
// }

// @Component({
//   selector: 'app-pb-add-cost-estimation',
//   standalone: true,
//   imports: [
//     BreadcrumbsComponent,
//     CommonModule,
//     ReactiveFormsModule,
//     PbManageCostHeadsComponent,
//     PbManageSubCostHeadsComponent
//   ],
//   templateUrl: './pb-add-cost-estimation.component.html',
//   styleUrl: './pb-add-cost-estimation.component.scss'
// })
// export class PbAddCostEstimationComponent implements OnInit, OnDestroy {

//   // ==================== Service Injections ====================

//   private fb = inject(FormBuilder);
//   private jwtSrv = inject(JwtService);
//   private activatedRoute = inject(ActivatedRoute);
//   private toastSrv = inject(ToastService);
//   private confirmationDialogSrv = inject(ConfirmationDialogService);
//   private projectSrv = inject(PbProjectManagementService);
//   private router = inject(Router);

//   // ==================== Signals ====================

//   breadCrumbItems = signal<breadCrumbItems[]>([{ label: 'Project Management' }]);
//   projectId = signal<string | null>(null);

//   allCostHeads = signal<GetCostHead[]>([]);
//   isLoadingCostHeads = signal<boolean>(false);

//   costEstimationRows = signal<CostEstimationRow[]>([]);
//   selectedCostHeadForAdd = signal<string>('');
//   isSubmittingProject = signal<boolean>(false);

//   allVendors = signal<Vendor[]>([]);
//   isLoadingVendors = signal<boolean>(false);
//   vendorPagination = signal<VendorPaginationState>({
//     page: 1,
//     pageSize: 10,
//     total: 0,
//     totalPages: 0,
//     searchTerm: ''
//   });

//   // Bulk upload signals
//   selectedFileBulkUpload = signal<File | null>(null);
//   isDownloadingBulkUpload = signal(false);
//   isPreviewingBulkUpload = signal(false);
//   isUploadingBulkUpload = signal(false);
//   previewCostHeads = signal<{ SrNo: number; CostHeadName: string; CostBasis: string | null; Amount: number }[]>([]);
//   previewSubHeads = signal<{ SrNo: number; CostHeadName: string; SubHeadName: string; CostBasis: string | null; Amount: number }[]>([]);


//   bulkUploadStep = computed<'upload' | 'preview'>(() =>
//     this.previewCostHeads().length > 0 || this.previewSubHeads().length > 0 ? 'preview' : 'upload'
//   );

//   previewCostHeadTotal = computed(() =>
//     this.previewCostHeads().reduce((sum, r) => sum + r.Amount, 0)
//   );

//   previewSubHeadTotal = computed(() =>
//     this.previewSubHeads().reduce((sum, r) => sum + r.Amount, 0)
//   );

//   previewGrandTotal = computed(() =>
//     this.previewCostHeadTotal() + this.previewSubHeadTotal()
//   );

//   public parseFloat = Number.parseFloat;
//   private searchSubject = new Subject<string>();

//   // ==================== ViewChild ====================

//   @ViewChild('CostHeadModal') CostHeadModal!: ElementRef;
//   @ViewChild('SubCostHeadModal') SubCostHeadModal!: ElementRef;
//   @ViewChild('bulkCostBasisUploadModal') bulkCostBasisUploadModal!: ElementRef;
//   @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
//   @ViewChild(PbManageCostHeadsComponent) manageCostHeadsComponent!: PbManageCostHeadsComponent;

//   private destroy$ = new Subject<void>();
//   costEstimationForm!: FormGroup;

//   // ==================== Lifecycle ====================

//   ngOnInit(): void {
//     this.initializeForms();
//     this.loadProjectIdFromUrl();
//     this.loadCostHeads();
//     this.loadVendors();
//     this.setupVendorSearch();
//   }

//   // ==================== Host Listener ====================

//   @HostListener('document:click', ['$event'])
//   onDocumentClick(event: MouseEvent): void {
//     const target = event.target as HTMLElement;

//     // Close vendor + sub head dropdowns when clicking outside
//     if (!target.closest('.vendor-dropdown-container') &&
//       !target.closest('.sub-head-dropdown-container')) {
//       const hasOpen = this.costEstimationRows().some(
//         r => r.showVendorDropdown || r.showSubHeadDropdown
//       );
//       if (hasOpen) {
//         this.costEstimationRows.set(
//           this.costEstimationRows().map(row => ({
//             ...row,
//             showVendorDropdown: false,
//             showSubHeadDropdown: false
//           }))
//         );
//       }
//     }
//   }

//   // ==================== Initialize ====================

//   private initializeForms(): void {
//     this.costEstimationForm = this.fb.group({
//       projectId: ['', Validators.required]
//     });
//   }

//   private loadProjectIdFromUrl(): void {
//     this.activatedRoute.queryParams
//       .pipe(takeUntil(this.destroy$))
//       .subscribe({
//         next: (params: any) => {
//           const token = params['token'];
//           if (token) {
//             try {
//               const decryptedId = this.jwtSrv.decrypt(decodeURIComponent(token));
//               this.projectId.set(decryptedId);
//               this.costEstimationForm.patchValue({ projectId: decryptedId });
//             } catch (error) {
//               console.error('Invalid token:', error);
//               this.toastSrv.showToast('Invalid project token', 'error');
//             }
//           }
//         }
//       });
//   }

//   // ==================== Load Cost Heads ====================

//   loadCostHeads(): void {
//     this.isLoadingCostHeads.set(true);
//     this.projectSrv._getCostHeads(true)
//       .pipe(takeUntil(this.destroy$))
//       .subscribe({
//         next: (response: any) => {
//           this.allCostHeads.set(response.items || []);
//           this.isLoadingCostHeads.set(false);
//         },
//         error: () => {
//           this.toastSrv.showToast('Error loading cost heads', 'error');
//           this.isLoadingCostHeads.set(false);
//         }
//       });
//   }

//   onCostHeadsUpdated(): void {
//     this.loadCostHeads();
//   }

//   onSubHeadsUpdated(): void {
//     // Refresh sub head dropdown lists for open rows if needed
//   }

//   // ==================== Modal Management ====================

//   openCostHeadModal(): void {
//     if (this.CostHeadModal) {
//       const modal = new bootstrap.Modal(this.CostHeadModal.nativeElement);
//       modal.show();
//     }
//   }

//   closeCostHeadModal(): void {
//     if (this.CostHeadModal) {
//       const modal = bootstrap.Modal.getInstance(this.CostHeadModal.nativeElement);
//       modal?.hide();
//     }
//   }

//   openSubCostHeadModal(): void {
//     if (this.SubCostHeadModal) {
//       const modal = new bootstrap.Modal(this.SubCostHeadModal.nativeElement);
//       modal.show();
//     }
//   }

//   closeSubCostHeadModal(): void {
//     if (this.SubCostHeadModal) {
//       const modal = bootstrap.Modal.getInstance(this.SubCostHeadModal.nativeElement);
//       modal?.hide();
//     }
//   }

//   // ==================== Bulk Cost Basis Upload ====================

//   openBulkCostBasisUpload(): void {
//     if (this.bulkCostBasisUploadModal) {
//       const modal = new bootstrap.Modal(this.bulkCostBasisUploadModal.nativeElement);
//       modal.show();
//     }
//   }

//   closeBulkCostBasisUpload(): void {
//     if (this.bulkCostBasisUploadModal) {
//       const modal = bootstrap.Modal.getInstance(this.bulkCostBasisUploadModal.nativeElement);
//       modal?.hide();
//     }
//     this.selectedFileBulkUpload.set(null);
//     this.previewCostHeads.set([]);
//     this.previewSubHeads.set([]);
//   }

//   downloadBulkCostBasisExcel(): void {
//     this.isDownloadingBulkUpload.set(true);
//     this.projectSrv._downloadBulkCostBasisExcel()
//       .pipe(takeUntil(this.destroy$))
//       .subscribe({
//         next: (blob: Blob) => {
//           this.isDownloadingBulkUpload.set(false);
//           if (blob && blob.size > 0) {
//             const date = new Date().toISOString().split('T')[0];
//             const url = window.URL.createObjectURL(blob);
//             const link = document.createElement('a');
//             link.href = url;
//             link.download = `CostBasis_Template_${date}.xlsx`;
//             document.body.appendChild(link);
//             link.click();
//             document.body.removeChild(link);
//             window.URL.revokeObjectURL(url);
//             this.toastSrv.showToast('Template downloaded successfully!', 'success');
//           } else {
//             this.toastSrv.showToast('Downloaded file is empty', 'error');
//           }
//         },
//         error: () => {
//           this.isDownloadingBulkUpload.set(false);
//           this.toastSrv.showToast('Failed to download template', 'error');
//         }
//       });
//   }

//   onFileSelectedBulkUpload(event: Event): void {
//     const input = event.target as HTMLInputElement;
//     if (input.files && input.files.length > 0) {
//       this.selectedFileBulkUpload.set(input.files[0]);
//       this.previewCostHeads.set([]);
//       this.previewSubHeads.set([]);
//     }
//   }

//   onFileDrop(event: DragEvent): void {
//     event.preventDefault();
//     const files = event.dataTransfer?.files;
//     if (files && files.length > 0) {
//       const file = files[0];
//       if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
//         this.selectedFileBulkUpload.set(file);
//         this.previewCostHeads.set([]);
//         this.previewSubHeads.set([]);
//       } else {
//         this.toastSrv.showToast('Please upload a valid Excel file (.xlsx or .xls)', 'error');
//       }
//     }
//   }

//   clearSelectedFileBulkUpload(): void {
//     this.selectedFileBulkUpload.set(null);
//     this.previewCostHeads.set([]);
//     this.previewSubHeads.set([]);
//   }

//   previewBulkCostBasisExcel(): void {
//     const file = this.selectedFileBulkUpload();
//     if (!file) return;
//     const formData = new FormData();
//     formData.append('excelFile', file);
//     this.isPreviewingBulkUpload.set(true);

//     this.projectSrv._previewBulkCostBasisExcel(formData)
//       .pipe(takeUntil(this.destroy$))
//       .subscribe({
//         next: (res: any) => {
//           this.isPreviewingBulkUpload.set(false);
//           if (res?.StatusCode === 200 && res?.Data) {
//             const costHeads = res.Data.CostHeads || [];
//             const subHeads = res.Data.SubHeads || [];

//             if (costHeads.length === 0 && subHeads.length === 0) {
//               this.toastSrv.showToast('No data found in uploaded Excel', 'error');
//               return;
//             }

//             this.previewCostHeads.set(costHeads);
//             this.previewSubHeads.set(subHeads);
//           } else {
//             this.toastSrv.showToast('No data found in uploaded Excel', 'error');
//           }
//         },
//         error: () => {
//           this.isPreviewingBulkUpload.set(false);
//           this.toastSrv.showToast('Failed to preview Excel file', 'error');
//         }
//       });
//   }

//   uploadBulkCostBasisExcel(): void {
//     const file = this.selectedFileBulkUpload();
//     if (!file) return;
//     const formData = new FormData();
//     formData.append('projectId', this.projectId()!);
//     formData.append('excelFile', file);
//     this.isUploadingBulkUpload.set(true);
//     this.projectSrv._uploadBulkCostBasisExcel(formData)
//       .pipe(takeUntil(this.destroy$))
//       .subscribe({
//         next: () => {
//           this.isUploadingBulkUpload.set(false);
//           this.selectedFileBulkUpload.set(null);
//           this.previewCostHeads.set([]);
//           this.previewSubHeads.set([]);
//           this.toastSrv.showToast('Cost basis uploaded successfully!', 'success');
//           this.closeBulkCostBasisUpload();
//           this.navigateBack();
//         },
//         error: () => {
//           this.isUploadingBulkUpload.set(false);
//           this.toastSrv.showToast('Failed to upload Excel file', 'error');
//         }
//       });
//   }

//   // ==================== Vendor Management ====================

//   private setupVendorSearch(): void {
//     this.searchSubject
//       .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
//       .subscribe(searchTerm => {
//         const currentPagination = this.vendorPagination();
//         this.vendorPagination.set({ ...currentPagination, searchTerm, page: 1 });
//         this.loadVendors();
//       });
//   }

//   loadVendors(append: boolean = false): void {
//     this.isLoadingVendors.set(true);
//     const pagination = this.vendorPagination();
//     this.projectSrv._getVendors(pagination.page, pagination.pageSize)
//       .pipe(takeUntil(this.destroy$))
//       .subscribe({
//         next: (response: any) => {
//           const vendors: Vendor[] = response.items || [];
//           this.allVendors.set(append ? [...this.allVendors(), ...vendors] : vendors);
//           this.vendorPagination.set({
//             ...pagination,
//             total: response.total || 0,
//             totalPages: response.totalPages || 0
//           });
//           this.isLoadingVendors.set(false);
//         },
//         error: () => {
//           this.toastSrv.showToast('Error loading vendors', 'error');
//           this.isLoadingVendors.set(false);
//         }
//       });
//   }

//   onVendorSearch(event: Event): void {
//     const input = event.target as HTMLInputElement;
//     this.searchSubject.next(input.value);
//   }

//   loadMoreVendors(): void {
//     const pagination = this.vendorPagination();
//     if (pagination.page < pagination.totalPages && !this.isLoadingVendors()) {
//       this.vendorPagination.set({ ...pagination, page: pagination.page + 1 });
//       this.loadVendors(true);
//     }
//   }

//   onVendorDropdownScroll(event: Event): void {
//     const element = event.target as HTMLElement;
//     const position = element.scrollHeight - element.scrollTop - element.clientHeight;
//     if (position < 50) this.loadMoreVendors();
//   }

//   // ==================== Cost Estimation Row Management ====================

//   addCostEstimationRow(): void {
//     const costHeadId = this.selectedCostHeadForAdd();
//     if (!costHeadId) {
//       this.toastSrv.showToast('Please select a cost head', 'warning');
//       return;
//     }
//     if (this.costEstimationRows().some(row => row.costHeadId === costHeadId)) {
//       this.toastSrv.showToast('This cost head is already added', 'warning');
//       return;
//     }
//     const costHead = this.allCostHeads().find(ch => ch.CostHeadId === costHeadId);
//     if (!costHead) return;

//     const newRow: CostEstimationRow = {
//       id: this.generateId(),
//       costHeadId: costHead.CostHeadId,
//       costHeadName: costHead.Name,
//       costBasis: '',
//       amount: '',
//       excelFile: null,
//       isAmountFromExcel: false,
//       fileIndex: null,
//       selectedVendors: [],
//       vendorAttachments: [],
//       showVendorDropdown: false,
//       touched: false,
//       // Sub head defaults
//       subHeads: [],
//       showSubHeadDropdown: false,
//       subHeadDropdownList: [],
//       isLoadingSubHeads: false
//     };

//     this.costEstimationRows.set([...this.costEstimationRows(), newRow]);
//     this.selectedCostHeadForAdd.set('');
//     this.toastSrv.showToast('Cost head added successfully', 'success');
//   }

//   async removeCostEstimationRow(rowId: string): Promise<void> {
//     const confirmed = await this.confirmationDialogSrv.showConfirm(
//       'Are you sure you want to remove this item?',
//       'Remove Cost Item'
//     );
//     if (confirmed) {
//       this.costEstimationRows.set(this.costEstimationRows().filter(row => row.id !== rowId));
//       this.toastSrv.showToast('Cost item removed successfully', 'success');
//     }
//   }

//   updateRowField(rowId: string, field: keyof CostEstimationRow, value: any): void {
//     this.costEstimationRows.set(
//       this.costEstimationRows().map(row =>
//         row.id === rowId ? { ...row, [field]: value } : row
//       )
//     );
//   }

//   // ==================== Excel File Management (Cost Head Row) ====================

//   async onExcelFileSelect(rowId: string, event: Event): Promise<void> {
//     const input = event.target as HTMLInputElement;
//     const file = input.files?.[0];
//     if (!file) return;

//     const extension = '.' + file.name.split('.').pop()?.toLowerCase();
//     if (!['.xlsx', '.xls'].includes(extension)) {
//       this.toastSrv.showToast('Invalid file type. Only .xlsx and .xls allowed', 'error');
//       input.value = '';
//       return;
//     }
//     if (file.size > 10 * 1024 * 1024) {
//       this.toastSrv.showToast('File too large. Maximum 10MB allowed', 'error');
//       input.value = '';
//       return;
//     }

//     // Set loading
//     this.costEstimationRows.set(
//       this.costEstimationRows().map(row =>
//         row.id === rowId
//           ? { ...row, excelFile: file, amount: 'Loading...', isAmountFromExcel: true }
//           : row
//       )
//     );

//     try {
//       const amount = await this.fetchSubHeadExcelAmountAsync(file); // reuse same method

//       this.costEstimationRows.set(
//         this.costEstimationRows().map(row =>
//           row.id === rowId
//             ? {
//               ...row,
//               excelFile: file,           // ✅ explicitly stored
//               amount: amount.toString(),
//               isAmountFromExcel: true
//             }
//             : row
//         )
//       );

//       this.toastSrv.showToast(`Amount calculated: ₹${this.formatAmount(amount.toString())}`, 'success');

//     } catch (error) {
//       this.costEstimationRows.set(
//         this.costEstimationRows().map(row =>
//           row.id === rowId
//             ? { ...row, excelFile: null, amount: '', isAmountFromExcel: false }
//             : row
//         )
//       );
//       this.toastSrv.showToast(typeof error === 'string' ? error : 'Failed to calculate amount', 'error');
//     }

//     input.value = '';
//   }


//   removeExcelFile(rowId: string): void {
//     this.costEstimationRows.set(
//       this.costEstimationRows().map(row =>
//         row.id === rowId
//           ? { ...row, excelFile: null, isAmountFromExcel: false, fileIndex: null, amount: '' }
//           : row
//       )
//     );
//     this.toastSrv.showToast('Excel file removed', 'warning');
//   }

//   formatFileSize(bytes: number): string {
//     if (bytes === 0) return '0 Bytes';
//     const k = 1024;
//     const sizes = ['Bytes', 'KB', 'MB'];
//     const i = Math.floor(Math.log(bytes) / Math.log(k));
//     return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
//   }

//   // ==================== Sub Head Management ====================

//   toggleSubHeadDropdown(rowId: string): void {
//     const currentRow = this.costEstimationRows().find(r => r.id === rowId);
//     const isOpening = !currentRow?.showSubHeadDropdown;

//     this.costEstimationRows.set(
//       this.costEstimationRows().map(row => ({
//         ...row,
//         showVendorDropdown: false,
//         showSubHeadDropdown: row.id === rowId ? isOpening : false
//       }))
//     );

//     // Load sub heads if opening and not yet loaded
//     if (isOpening && currentRow && currentRow.subHeadDropdownList.length === 0) {
//       this.loadSubHeadsForRow(rowId, currentRow.costHeadId);
//     }
//   }

//   private loadSubHeadsForRow(rowId: string, costHeadId: string): void {
//     this.costEstimationRows.set(
//       this.costEstimationRows().map(row =>
//         row.id === rowId ? { ...row, isLoadingSubHeads: true } : row
//       )
//     );

//     this.projectSrv._getSubHeads(costHeadId, true)
//       .pipe(takeUntil(this.destroy$))
//       .subscribe({
//         next: (response: any) => {
//           const subHeads: GetSubHead[] = response.items || [];
//           this.costEstimationRows.set(
//             this.costEstimationRows().map(row =>
//               row.id === rowId
//                 ? { ...row, subHeadDropdownList: subHeads, isLoadingSubHeads: false }
//                 : row
//             )
//           );
//         },
//         error: () => {
//           this.toastSrv.showToast('Error loading sub heads', 'error');
//           this.costEstimationRows.set(
//             this.costEstimationRows().map(row =>
//               row.id === rowId ? { ...row, isLoadingSubHeads: false } : row
//             )
//           );
//         }
//       });
//   }

//   isSubHeadAlreadyAdded(rowId: string, subHeadId: string): boolean {
//     const row = this.costEstimationRows().find(r => r.id === rowId);
//     return row?.subHeads.some(sh => sh.subHeadId === subHeadId) || false;
//   }

//   addSubHeadToRow(rowId: string, subHead: GetSubHead): void {
//     if (this.isSubHeadAlreadyAdded(rowId, subHead.SubHeadId)) {
//       this.toastSrv.showToast(`${subHead.Name} is already added`, 'warning');
//       return;
//     }

//     const newSubHeadRow: SubHeadRow = {
//       id: this.generateId(),
//       subHeadId: subHead.SubHeadId,
//       subHeadName: subHead.Name,
//       costBasis: '',
//       amount: '',
//       excelFile: null,
//       isAmountFromExcel: false,
//       fileIndex: null,
//       touched: false,
//       isNewlyAdded: true
//     };

//     this.costEstimationRows.set(
//       this.costEstimationRows().map(row =>
//         row.id === rowId
//           ? { ...row, subHeads: [...row.subHeads, newSubHeadRow], showSubHeadDropdown: false }
//           : row
//       )
//     );

//     // Remove animation flag after animation completes (800ms)
//     setTimeout(() => {
//       this.costEstimationRows.set(
//         this.costEstimationRows().map(row => ({
//           ...row,
//           subHeads: row.subHeads.map(sh =>
//             sh.id === newSubHeadRow.id ? { ...sh, isNewlyAdded: false } : sh
//           )
//         }))
//       );
//     }, 900);

//     this.toastSrv.showToast(`${subHead.Name} added`, 'success');
//   }

//   async removeSubHeadFromRow(rowId: string, subHeadRowId: string, subHeadName: string): Promise<void> {
//     const confirmed = await this.confirmationDialogSrv.showConfirm(
//       `Remove sub head "${subHeadName}"?`,
//       'Remove Sub Head'
//     );
//     if (confirmed) {
//       this.costEstimationRows.set(
//         this.costEstimationRows().map(row =>
//           row.id === rowId
//             ? { ...row, subHeads: row.subHeads.filter(sh => sh.id !== subHeadRowId) }
//             : row
//         )
//       );
//     }
//   }

//   updateSubHeadField(rowId: string, subHeadRowId: string, field: keyof SubHeadRow, value: any): void {
//     this.costEstimationRows.set(
//       this.costEstimationRows().map(row =>
//         row.id === rowId
//           ? {
//             ...row,
//             subHeads: row.subHeads.map(sh =>
//               sh.id === subHeadRowId ? { ...sh, [field]: value } : sh
//             )
//           }
//           : row
//       )
//     );
//   }

//   // ==================== Sub Head Excel Management ====================

//   async onSubHeadExcelSelect(rowId: string, subHeadRowId: string, event: Event): Promise<void> {
//     const input = event.target as HTMLInputElement;
//     const file = input.files?.[0];
//     if (!file) return;

//     // Validation
//     const extension = '.' + file.name.split('.').pop()?.toLowerCase();
//     if (!['.xlsx', '.xls'].includes(extension)) {
//       this.toastSrv.showToast('Only .xlsx and .xls files allowed', 'error');
//       input.value = '';
//       return;
//     }
//     if (file.size > 10 * 1024 * 1024) {
//       this.toastSrv.showToast('File too large. Maximum 10MB allowed', 'error');
//       input.value = '';
//       return;
//     }

//     // Set loading state
//     this.costEstimationRows.set(
//       this.costEstimationRows().map(row =>
//         row.id === rowId
//           ? {
//             ...row,
//             subHeads: row.subHeads.map(sh =>
//               sh.id === subHeadRowId
//                 ? { ...sh, excelFile: file, amount: 'Loading...', isAmountFromExcel: true }
//                 : sh
//             )
//           }
//           : row
//       )
//     );

//     try {
//       // ✅ await — waits for this call to finish before anything else updates signal
//       const amount = await this.fetchSubHeadExcelAmountAsync(file);

//       this.costEstimationRows.set(
//         this.costEstimationRows().map(row =>
//           row.id === rowId
//             ? {
//               ...row,
//               subHeads: row.subHeads.map(sh =>
//                 sh.id === subHeadRowId
//                   ? {
//                     ...sh,
//                     excelFile: file,           // ✅ file safely stored
//                     amount: amount.toString(),
//                     isAmountFromExcel: true
//                   }
//                   : sh
//               )
//             }
//             : row
//         )
//       );

//       this.toastSrv.showToast(`Sub head excel amount: ₹${this.formatAmount(amount.toString())}`, 'success');

//     } catch (error) {
//       // Reset on error
//       this.costEstimationRows.set(
//         this.costEstimationRows().map(row =>
//           row.id === rowId
//             ? {
//               ...row,
//               subHeads: row.subHeads.map(sh =>
//                 sh.id === subHeadRowId
//                   ? { ...sh, excelFile: null, amount: '', isAmountFromExcel: false }
//                   : sh
//               )
//             }
//             : row
//         )
//       );
//       this.toastSrv.showToast(typeof error === 'string' ? error : 'Failed to calculate amount', 'error');
//     }

//     input.value = '';
//   }

//   private fetchSubHeadExcelAmountAsync(file: File): Promise<number> {
//     return new Promise((resolve, reject) => {
//       this.projectSrv._getCostHeadExcelAmount(file)
//         .pipe(takeUntil(this.destroy$))
//         .subscribe({
//           next: (response: any) => {
//             if (response?.StatusCode === 200 && response?.Data?.TotalAmount !== undefined) {
//               resolve(response.Data.TotalAmount);
//             } else {
//               reject('Invalid response');
//             }
//           },
//           error: () => reject('Failed to calculate amount')
//         });
//     });
//   }



//   removeSubHeadExcelFile(rowId: string, subHeadRowId: string): void {
//     this.costEstimationRows.set(
//       this.costEstimationRows().map(row =>
//         row.id === rowId
//           ? {
//             ...row,
//             subHeads: row.subHeads.map(sh =>
//               sh.id === subHeadRowId
//                 ? { ...sh, excelFile: null, amount: '', isAmountFromExcel: false, fileIndex: null }
//                 : sh
//             )
//           }
//           : row
//       )
//     );
//     this.toastSrv.showToast('Sub head Excel file removed', 'warning');
//   }

//   hasAnySubHeads(): boolean {
//     return this.costEstimationRows().some(row => row.subHeads.length > 0);
//   }

//   getSubHeadTotal(rowId: string): string {
//     const row = this.costEstimationRows().find(r => r.id === rowId);
//     if (!row) return '0.00';
//     const total = row.subHeads.reduce((sum, sh) => {
//       const amount = parseFloat(sh.amount);
//       return sum + (isNaN(amount) || sh.amount === 'Loading...' ? 0 : amount);
//     }, 0);
//     return total.toFixed(2);
//   }

//   // ==================== Vendor Selection ====================

//   toggleVendorDropdown(rowId: string): void {
//     this.costEstimationRows.set(
//       this.costEstimationRows().map(row => ({
//         ...row,
//         showVendorDropdown: row.id === rowId ? !row.showVendorDropdown : false,
//         showSubHeadDropdown: false
//       }))
//     );
//   }

//   toggleVendorSelection(rowId: string, vendor: Vendor): void {
//     const row = this.costEstimationRows().find(r => r.id === rowId);
//     if (!row) return;

//     const existingIndex = row.selectedVendors.findIndex(v => v.VendorId === vendor.VendorId);
//     let updatedVendors: Vendor[];
//     let updatedAttachments: VendorAttachment[];

//     if (existingIndex > -1) {
//       updatedVendors = row.selectedVendors.filter((_, i) => i !== existingIndex);
//       updatedAttachments = row.vendorAttachments.filter(va => va.vendorId !== vendor.VendorId);
//       this.toastSrv.showToast(`${vendor.Name} removed`, 'warning');
//     } else {
//       updatedVendors = [...row.selectedVendors, vendor];
//       updatedAttachments = [
//         ...row.vendorAttachments,
//         { vendorId: vendor.VendorId, vendorName: vendor.Name, file: null, files: [] as File[], assignedAmount: '' }
//       ];
//       this.toastSrv.showToast(`${vendor.Name} added`, 'success');
//     }

//     this.costEstimationRows.set(
//       this.costEstimationRows().map(r =>
//         r.id === rowId
//           ? { ...r, selectedVendors: updatedVendors, vendorAttachments: updatedAttachments }
//           : r
//       )
//     );
//   }

//   isVendorSelected(rowId: string, vendorId: string): boolean {
//     const row = this.costEstimationRows().find(r => r.id === rowId);
//     return row?.selectedVendors.some(v => v.VendorId === vendorId) || false;
//   }

//   getVendorAmount(rowId: string, vendorId: string): string {
//     const row = this.costEstimationRows().find(r => r.id === rowId);
//     const attachment = row?.vendorAttachments.find(va => va.vendorId === vendorId);
//     return attachment?.assignedAmount || '';
//   }

//   updateVendorAmount(rowId: string, vendorId: string, amount: string): void {
//     this.costEstimationRows.set(
//       this.costEstimationRows().map(row =>
//         row.id === rowId
//           ? {
//             ...row,
//             vendorAttachments: row.vendorAttachments.map(va =>
//               va.vendorId === vendorId ? { ...va, assignedAmount: amount } : va
//             )
//           }
//           : row
//       )
//     );
//   }

//   // ==================== Vendor File Management ====================

//   onVendorFileSelect(rowId: string, vendorId: string, event: Event): void {
//     const input = event.target as HTMLInputElement;
//     const files = Array.from(input.files || []);
//     if (files.length === 0) return;

//     const maxSize = 5 * 1024 * 1024;
//     const allowedTypes = ['.doc', '.docx', '.pdf'];

//     for (const file of files) {
//       const extension = '.' + file.name.split('.').pop()?.toLowerCase();
//       if (!allowedTypes.includes(extension)) {
//         this.toastSrv.showToast(`Invalid file type: ${file.name}`, 'error');
//         input.value = '';
//         return;
//       }
//       if (file.size > maxSize) {
//         this.toastSrv.showToast(`File too large: ${file.name}`, 'error');
//         input.value = '';
//         return;
//       }
//     }

//     const row = this.costEstimationRows().find(r => r.id === rowId);
//     if (!row) return;

//     const attachmentIndex = row.vendorAttachments.findIndex(va => va.vendorId === vendorId);
//     if (attachmentIndex === -1) return;

//     const updatedAttachments = [...row.vendorAttachments];
//     updatedAttachments[attachmentIndex] = {
//       ...updatedAttachments[attachmentIndex],
//       files: [...updatedAttachments[attachmentIndex].files, ...files]
//     };

//     this.costEstimationRows.set(
//       this.costEstimationRows().map(r =>
//         r.id === rowId ? { ...r, vendorAttachments: updatedAttachments } : r
//       )
//     );

//     this.toastSrv.showToast(`${files.length} file(s) attached`, 'success');
//     input.value = '';
//   }

//   removeVendorFile(rowId: string, vendorId: string, fileIndex: number): void {
//     const row = this.costEstimationRows().find(r => r.id === rowId);
//     if (!row) return;

//     const attachmentIndex = row.vendorAttachments.findIndex(va => va.vendorId === vendorId);
//     if (attachmentIndex === -1) return;

//     const updatedAttachments = [...row.vendorAttachments];
//     updatedAttachments[attachmentIndex] = {
//       ...updatedAttachments[attachmentIndex],
//       files: updatedAttachments[attachmentIndex].files.filter((_, i) => i !== fileIndex)
//     };

//     this.costEstimationRows.set(
//       this.costEstimationRows().map(r =>
//         r.id === rowId ? { ...r, vendorAttachments: updatedAttachments } : r
//       )
//     );
//     this.toastSrv.showToast('File removed', 'success');
//   }

//   // ==================== Validation ====================

//   validateAmount(event: Event): void {
//     const input = event.target as HTMLInputElement;
//     let value = input.value;
//     value = value.replace(/[^\d.]/g, '');
//     const parts = value.split('.');
//     if (parts.length > 2) value = parts[0] + '.' + parts.slice(1).join('');
//     if (parts.length === 2 && parts[1].length > 2) value = parts[0] + '.' + parts[1].substring(0, 2);
//     input.value = value;
//   }

//   private validateCostHeadRow(row: CostEstimationRow): { valid: boolean; errors: string[] } {
//     const errors: string[] = [];

//     // If sub heads exist, skip parent cost basis + amount validation
//     // (sub head rows handle their own validation)
//     if (row.subHeads.length === 0) {
//       const hasCostBasis = row.costBasis?.trim().length > 0;
//       const hasExcel = row.excelFile !== null;

//       if (!hasCostBasis && !hasExcel) {
//         errors.push('Provide either Cost Basis or Excel file');
//       }
//       if (!hasExcel) {
//         const amount = parseFloat(row.amount);
//         if (!row.amount || isNaN(amount) || amount <= 0) {
//           errors.push('Amount is required');
//         }
//       }
//       if (hasExcel) {
//         const amount = parseFloat(row.amount);
//         if (!row.amount || row.amount === 'Loading...' || isNaN(amount) || amount <= 0) {
//           errors.push('Excel amount calculation is incomplete');
//         }
//       }
//     }

//     // Vendor validation always applies regardless of sub heads
//     if (row.selectedVendors.length > 0) {
//       for (const vendor of row.selectedVendors) {
//         const attachment = row.vendorAttachments.find(va => va.vendorId === vendor.VendorId);
//         const vendorAmount = parseFloat(attachment?.assignedAmount || '');
//         if (!attachment?.assignedAmount || isNaN(vendorAmount) || vendorAmount <= 0) {
//           errors.push(`Amount required for vendor: ${vendor.Name}`);
//         }
//       }
//     }

//     return { valid: errors.length === 0, errors };
//   }

//   private validateSubHeadRow(subHead: SubHeadRow, index: number): string[] {
//     const errors: string[] = [];
//     const hasCostBasis = subHead.costBasis?.trim().length > 0;
//     // const hasExcel = subHead.excelFile !== null;
//     const hasExcel = !!subHead.excelFile;

//     if (!hasCostBasis && !hasExcel) {
//       errors.push(`Sub Head ${index} (${subHead.subHeadName}): Provide Cost Basis or Excel`);
//     }

//     if (!hasExcel) {
//       const amount = parseFloat(subHead.amount);
//       if (!subHead.amount || isNaN(amount) || amount <= 0) {
//         errors.push(`Sub Head ${index} (${subHead.subHeadName}): Amount is required`);
//       }
//     }

//     if (hasExcel) {
//       const amount = parseFloat(subHead.amount);
//       if (!subHead.amount || subHead.amount === 'Loading...' || isNaN(amount) || amount <= 0) {
//         errors.push(`Sub Head ${index} (${subHead.subHeadName}): Excel amount not ready`);
//       }
//     }

//     return errors;
//   }

//   // ==================== Submit ====================

//   onProjectSubmit(): void {
//     if (this.costEstimationRows().length === 0) {
//       this.toastSrv.showToast('Please add at least one cost item', 'warning');
//       return;
//     }

//     // Mark all rows and sub heads as touched
//     this.costEstimationRows.set(
//       this.costEstimationRows().map(row => ({
//         ...row,
//         touched: true,
//         subHeads: row.subHeads.map(sh => ({ ...sh, touched: true }))
//       }))
//     );

//     const validationErrors: string[] = [];

//     this.costEstimationRows().forEach((row, index) => {
//       // Validate cost head row
//       const { valid, errors } = this.validateCostHeadRow(row);
//       if (!valid) {
//         validationErrors.push(`Row ${index + 1} (${row.costHeadName}): ${errors.join(', ')}`);
//       }

//       // Validate each sub head
//       row.subHeads.forEach((subHead, subIdx) => {
//         const subErrors = this.validateSubHeadRow(subHead, subIdx + 1);
//         if (subErrors.length > 0) {
//           validationErrors.push(`Row ${index + 1} (${row.costHeadName}) → ${subErrors.join(', ')}`);
//         }
//       });
//     });

//     if (validationErrors.length > 0) {
//       this.toastSrv.showToast(validationErrors[0], 'error');
//       return;
//     }

//     if (!this.projectId()) {
//       this.toastSrv.showToast('Project ID is missing', 'error');
//       return;
//     }

//     this.submitCostEstimation();
//   }

//   // ==================== Submit Flow ====================

//   private submitCostEstimation(): void {
//     this.isSubmittingProject.set(true);
//     const formData = this.buildFormDataPayload();

//     // Step 1: Assign Cost Headers
//     this.logFormData('Assign Headers', formData);  //last logging code
//     this.projectSrv._assignCostHeaders(formData)
//       .pipe(takeUntil(this.destroy$))
//       .subscribe({
//         next: () => {
//           // Step 2: Assign Sub Heads (if any)
//           if (this.hasAnySubHeads()) {
//             this.assignSubHeads();
//           } else {
//             this.proceedToVendors();
//           } 
//         },
//         error: (error) => {
//           console.error('Error saving cost headers:', error);
//           this.toastSrv.showToast('Failed to save cost headers', 'error');
//           this.isSubmittingProject.set(false);
//         }
//       });
//   }

//   private assignSubHeads(): void {
//     const subHeadFormData = this.buildSubHeadFormDataPayload();

//     console.group('✅ BEFORE httpWrapper');
//   subHeadFormData.forEach((value, key) => {
//     console.log(key, ':', value instanceof File ? `[File] ${value.name}` : value);
//   });
//   console.groupEnd()
  
//     // Step 2: Assign Sub Headers
//     this.logFormData('assignSubHeads', subHeadFormData);
//     this.projectSrv._assignSubHeaders(subHeadFormData)
//       .pipe(takeUntil(this.destroy$))
//       .subscribe({
//         next: () => {
//           this.proceedToVendors();
//         },
//         error: (error) => {
//           console.error('Error assigning sub heads:', error);
//           this.toastSrv.showToast('Failed to assign sub heads', 'error');
//           this.isSubmittingProject.set(false);
//         }
//       });
//   }

//   private proceedToVendors(): void {
//     // Step 3: Check if any vendors need assignment
//     const hasVendors = this.costEstimationRows().some(row => row.selectedVendors.length > 0);
//     if (!hasVendors) {
//       this.toastSrv.showToast('Cost estimation saved successfully!', 'success');
//       this.completeSubmission(true);
//     } else {
//       this.fetchProjectCostHeadMapping();
//     }
//   }

//   // ==================== Build FormData Payloads ====================

//   private buildFormDataPayload(): FormData {
//     const formData = new FormData();
//     const rows = this.costEstimationRows();
//     const excelRows: CostEstimationRow[] = [];
//     const costHeadsJson: any[] = [];

//     rows.forEach(row => {
//       const hasExcel = !!row.excelFile;           // ✅ catches null AND undefined
//       const hasSubHeads = row.subHeads.length > 0;

//       if (hasExcel && !hasSubHeads) {
//         // Parent row has excel, no sub heads → send fileIndex
//         const fileIndex = excelRows.length;
//         excelRows.push(row);
//         row.fileIndex = fileIndex;
//         costHeadsJson.push({
//           headId: row.costHeadId,
//           costBasis: row.costBasis || '',
//           fileIndex
//         });

//       } else if (hasSubHeads) {
//         // Has sub heads (excel or manual) → always manualAmount = sum of sub heads
//         const subHeadTotal = row.subHeads.reduce((sum, sh) => {
//           const amt = parseFloat(sh.amount);
//           return sum + (isNaN(amt) || sh.amount === 'Loading...' ? 0 : amt);
//         }, 0);

//         costHeadsJson.push({
//           headId: row.costHeadId,
//           costBasis: row.costBasis || '',
//           manualAmount: parseFloat(subHeadTotal.toFixed(2))
//           // ✅ no fileIndex ever when sub heads exist
//         });

//       } else {
//         // No excel, no sub heads → manual amount from input
//         const manualAmount = parseFloat(this.formatAmount(row.amount));
//         costHeadsJson.push({
//           headId: row.costHeadId,
//           costBasis: row.costBasis || '',
//           manualAmount: parseFloat(manualAmount.toFixed(2))
//         });
//       }
//     });

//     formData.append('projectId', this.projectId()!);
//     formData.append('costHeadsJson', JSON.stringify(costHeadsJson));
//     excelRows.forEach((row) => {
//       if (row.excelFile) formData.append('excelFiles', row.excelFile, row.excelFile.name); // ✅ same key
//     });

//     return formData;
//   }

//   private buildSubHeadFormDataPayload(): FormData {

//     const formData = new FormData();
//     const rows = this.costEstimationRows();
//     const excelItems: { file: File }[] = [];
//     const subHeadsJson: any[] = [];

//     rows.forEach(row => {
//       row.subHeads.forEach(subHead => {
//         const hasExcel = !!subHead.excelFile;

//         if (hasExcel) {
//           const fileIndex = excelItems.length;
//           excelItems.push({ file: subHead.excelFile! });
//           subHeadsJson.push({
//             costHeadId: row.costHeadId,
//             subHeadId: subHead.subHeadId,
//             costBasis: subHead.costBasis || '',
//             fileIndex
//           });
//         } else {
//           subHeadsJson.push({
//             costHeadId: row.costHeadId,
//             subHeadId: subHead.subHeadId,
//             costBasis: subHead.costBasis || '',
//             manualAmount: parseFloat(this.formatAmount(subHead.amount))
//           });
//         }
//       });
//     });

//     formData.append('projectId', this.projectId()!);
//     formData.append('subHeadsJson', JSON.stringify(subHeadsJson));
//     excelItems.forEach((item) => {
//       formData.append('excelFiles', item.file, item.file.name);
//     });

//     return formData;
//   }

//   // ==================== Vendor Assignment Flow ====================

//   private fetchProjectCostHeadMapping(): void {
//     this.projectSrv._getProjectCostHeadId(this.projectId()!)
//       .pipe(takeUntil(this.destroy$))
//       .subscribe({ 
//         next: (response: any) => {
//           if (!response?.Items || response.Items.length === 0) {
//             this.toastSrv.showToast('Failed to get cost head mapping', 'error');
//             this.isSubmittingProject.set(false);
//             return;
//           }

//           const costHeadMapping: { [key: string]: string } = {};
//           response.Items.forEach((item: any) => {
//             costHeadMapping[item.CostHeadId] = item.ProjectCostHeadId;
//           });

//           this.assignAllVendors(costHeadMapping);
//         },
//         error: (error) => {
//           console.error('Error fetching mapping:', error);
//           this.toastSrv.showToast('Failed to fetch cost head mapping', 'error');
//           this.isSubmittingProject.set(false);
//         }
//       });
//   }

//   private assignAllVendors(costHeadMapping: { [key: string]: string }): void {
//     const projectId = this.projectId()!;
//     const rows = this.costEstimationRows();
//     const vendorAssignments: {
//       projectId: string;
//       projectCostHeadId: string;
//       vendorAssignmentsJson: string;
//     }[] = [];

//     for (const row of rows) {
//       if (!row.selectedVendors || row.selectedVendors.length === 0) continue;
//       const projectCostHeadId = costHeadMapping[row.costHeadId];
//       if (!projectCostHeadId) continue;

//       const vendorAssignmentsArray = row.selectedVendors
//         .map(vendor => {
//           const attachment = row.vendorAttachments.find(va => va.vendorId === vendor.VendorId);
//           return { vendorId: vendor.VendorId, assignedAmount: parseFloat(attachment?.assignedAmount || '0') };
//         })
//         .filter(va => va.assignedAmount > 0);

//       if (vendorAssignmentsArray.length === 0) continue;
//       vendorAssignments.push({ projectId, projectCostHeadId, vendorAssignmentsJson: JSON.stringify(vendorAssignmentsArray) });
//     }

//     if (vendorAssignments.length === 0) {
//       this.toastSrv.showToast('Cost estimation saved successfully!', 'success');
//       this.completeSubmission(true);
//       return;
//     }

//     console.log(vendorAssignments);

//     this.projectSrv._assignVendorsToCostHead(vendorAssignments)
//       .pipe(takeUntil(this.destroy$))
//       .subscribe({
//         next: (response: any) => {
//           const hasAttachments = this.costEstimationRows().some(row =>
//             row.vendorAttachments.some(va => va.files.length > 0)
//           );
//           if (!hasAttachments) {
//             this.toastSrv.showToast('Cost estimation saved successfully!', 'success');
//             this.completeSubmission(true);
//           } else {
//             this.uploadAllVendorAttachments(response, costHeadMapping);
//           }
//         },
//         error: (error) => {
//           console.error('Error assigning vendors:', error);
//           this.toastSrv.showToast('Failed to assign vendors', 'error');
//           this.isSubmittingProject.set(false);
//         }
//       });
//   }

//   private async uploadAllVendorAttachments(
//     assignVendorResponse: any,
//     costHeadMapping: { [key: string]: string }
//   ): Promise<void> {
//     const results = assignVendorResponse?.Results;

//     if (!Array.isArray(results) || results.length === 0) {
//       this.toastSrv.showToast('Cost estimation saved successfully!', 'success');
//       this.completeSubmission(true);
//       return;
//     }

//     const rows = this.costEstimationRows();
//     let failedUploads = 0;

//     try {
//       for (const result of results) {
//         const assignedVendors = result.assignedVendors;
//         if (!Array.isArray(assignedVendors) || assignedVendors.length === 0) continue;

//         for (const assignedVendor of assignedVendors) {
//           const { ProjectCostHeadId: plainProjectCostHeadId, ProjectCostHeadVendorId: projectCostHeadVendorId, VendorId: vendorId } = assignedVendor;
//           if (!plainProjectCostHeadId || !projectCostHeadVendorId || !vendorId) continue;

//           const row = rows.find(r => costHeadMapping[r.costHeadId] === plainProjectCostHeadId);
//           if (!row) continue;

//           const vendorAttachment = row.vendorAttachments.find(va => va.vendorId === vendorId);
//           if (!vendorAttachment || vendorAttachment.files.length === 0) continue;

//           try {
//             await this.uploadSingleVendorAttachment(projectCostHeadVendorId, vendorAttachment.files);
//           } catch {
//             failedUploads++;
//           }
//         }
//       }

//       if (failedUploads === 0) {
//         this.toastSrv.showToast('Cost estimation saved successfully!', 'success');
//       } else {
//         this.toastSrv.showToast(`Saved with ${failedUploads} upload error(s)`, 'warning');
//       }
//       this.completeSubmission(failedUploads === 0);
//     } catch {
//       this.toastSrv.showToast('Error uploading attachments', 'warning');
//       this.completeSubmission(false);
//     }
//   }

//   private uploadSingleVendorAttachment(projectCostHeadVendorId: string, files: File[]): Promise<any> {
//     return new Promise((resolve, reject) => {
//       const formData = new FormData();
//       formData.append('Items[0].ProjectCostHeadVendorId', projectCostHeadVendorId);
//       files.forEach(file => formData.append('Items[0].Files', file, file.name));

//       this.projectSrv._uploadVendorAttachments(formData)
//         .pipe(takeUntil(this.destroy$))
//         .subscribe({ next: resolve, error: reject });
//     });
//   }

//   private completeSubmission(success: boolean): void {
//     if (success) {
//       this.resetCostEstimationTable();
//       this.navigateBack();
//     }
//     this.isSubmittingProject.set(false);
//   }

//   // ==================== Helper Functions ====================

//   formatAmount(amount: string): string {
//     const num = parseFloat(amount);
//     return isNaN(num) ? '0.00' : num.toFixed(2);
//   }

//   calculateGrandTotal(): number {
//     return this.costEstimationRows().reduce((total, row) => {
//       const rowAmount = parseFloat(row.amount);
//       const rowTotal = isNaN(rowAmount) || row.amount === 'Loading...' ? 0 : rowAmount;

//       const subHeadTotal = row.subHeads.reduce((sum, sh) => {
//         const shAmount = parseFloat(sh.amount);
//         return sum + (isNaN(shAmount) || sh.amount === 'Loading...' ? 0 : shAmount);
//       }, 0);

//       return total + rowTotal + subHeadTotal;
//     }, 0);
//   }

//   getAvailableCostHeads(): GetCostHead[] {
//     const addedIds = this.costEstimationRows().map(row => row.costHeadId);
//     return this.allCostHeads().filter(ch => !addedIds.includes(ch.CostHeadId) && ch.IsActive);
//   }

//   getAvailableSubHeadsForRow(rowId: string): GetSubHead[] {
//     const row = this.costEstimationRows().find(r => r.id === rowId);
//     if (!row) return [];
//     const addedIds = row.subHeads.map(sh => sh.subHeadId);
//     return row.subHeadDropdownList.filter(sh => !addedIds.includes(sh.SubHeadId));
//   }

//   resetCostEstimationTable(): void {
//     this.costEstimationRows.set([]);
//     this.selectedCostHeadForAdd.set('');
//   }

//   async onCancel(): Promise<void> {
//     if (this.costEstimationRows().length === 0) {
//       this.navigateBack();
//       return;
//     }
//     const confirmed = await this.confirmationDialogSrv.showConfirm(
//       'All unsaved data will be lost. Are you sure?',
//       'Confirm Cancel'
//     );
//     if (confirmed) {
//       this.resetCostEstimationTable();
//       this.navigateBack();
//     }
//   }

//   navigateBack(): void {
//     this.router.navigate(['/pbProjectManagementComponent']);
//   }

//   private generateId(): string {
//     return Date.now().toString(36) + Math.random().toString(36).substr(2);
//   }

//   // for logggging
//   private logFormData(label: string, fd: FormData): void {
//     console.group(`📦 ${label}`);
//     fd.forEach((value, key) => {
//       if (value instanceof File) {
//         console.log(`${key}:`, `[File] ${value.name} (${(value.size / 1024).toFixed(1)} KB)`);
//       } else {
//         console.log(`${key}:`, value);
//       }
//     });
//     console.groupEnd();
//   }
//   ngOnDestroy(): void {
//     this.destroy$.next();
//     this.destroy$.complete();
//   }
// }