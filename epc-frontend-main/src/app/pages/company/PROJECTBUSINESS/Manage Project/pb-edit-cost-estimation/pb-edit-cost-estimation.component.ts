import { Component, inject, signal, OnDestroy, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil, forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BreadcrumbsComponent } from '../../../../common/breadcrumbs/breadcrumbs.component';
import { breadCrumbItems } from '../../../../../shared/models/models';
import { JwtService } from '../../../../../shared/services/common/jwt.service';
import { ToastService } from '../../../../../shared/services/componentServices/toast.service';
import { ConfirmationDialogService } from '../../../../../shared/services/componentServices/confirmation-dialog.service';
import { PbProjectManagementService } from '../../../../../shared/services/projectBusiness/pb-project-management.service';
import {
  Vendor,
  ExistingAttachment,
  EditVendorAttachment,
  EditCostEstimationRow,
  VendorPaginationState,
  GetAllProject
} from '../../../../../shared/models/projectBusiness-models/projectmanagement';
import { PbExcelGridComponent } from '../pb-excel-grid/pb-excel-grid.component';
import { PbAddNewProjectService } from '../../../../../shared/services/projectBusiness/pb-add-new-project.service';
import { PbExtensionLetterComponent } from '../pb-extension-letter/pb-extension-letter.component';

type EditRow = EditCostEstimationRow & {
  isExcelManualEntry?: boolean;
  excelCostBasis?: string;
  isUpdatingRow?: boolean;
  isSavingVendors?: boolean;
};

@Component({
  selector: 'app-pb-edit-cost-estimation',
  standalone: true,
  imports: [BreadcrumbsComponent, CommonModule, ReactiveFormsModule, PbExcelGridComponent, PbExtensionLetterComponent],
  templateUrl: './pb-edit-cost-estimation.component.html',
  styleUrl: './pb-edit-cost-estimation.component.scss'
})
export class PbEditCostEstimationComponent implements OnInit, OnDestroy {
  // Services
  private fb = inject(FormBuilder);
  private jwtSrv = inject(JwtService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private toastSrv = inject(ToastService);
  private confirmationDialogSrv = inject(ConfirmationDialogService);
  private projectSrv = inject(PbProjectManagementService);
  private pbAddNewProjectService = inject(PbAddNewProjectService);

  // Signals 
  breadCrumbItems = signal<breadCrumbItems[]>([
    { label: 'Project Management' },
    { label: 'Edit Cost Estimation' }
  ]);

  projectId = signal<string | null>(null);
  projectDetails = signal<GetAllProject | null>(null);
  costEstimationRows = signal<EditRow[]>([]);

  isLoadingProject = signal<boolean>(false);
  isSubmittingProject = signal<boolean>(false);

  allVendors = signal<Vendor[]>([]);
  isLoadingVendors = signal<boolean>(false);
  vendorPagination = signal<VendorPaginationState>({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
    searchTerm: ''
  });

  showExcelModal = signal<boolean>(false);
  currentExcelRow = signal<EditRow | null>(null);
  excelModalData = signal<any[][]>([]);

  // Extension Letter Component
  @ViewChild('extensionLetterComp') extensionLetterComp!: PbExtensionLetterComponent;
  originalExpectedCompletionDate = signal<string>('');

  public parseFloat = Number.parseFloat;

  private destroy$ = new Subject<void>();
  editProjectForm!: FormGroup;

  ngOnInit(): void {
    this.initializeForm();
    this.loadProjectIdFromUrl();
    this.loadVendors();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ==================== Initialize Form ====================

  private initializeForm(): void {
    this.editProjectForm = this.fb.group({
      projectId: ['', Validators.required],
      projectName: [{ value: '', disabled: true }],
      projectIncharge: [{ value: '', disabled: true }],
      nodalAgencyName: [{ value: '', disabled: true }],
      wbsNo: [{ value: '', disabled: true }],
      chakNo: [{ value: '', disabled: true }],
      projectArea: ['', Validators.required],
      hectareRate: [{ value: '' }],
      agreementDate: ['', Validators.required],
      endDate: ['', Validators.required],
      projectStartDate: ['', Validators.required],
      expectedCompletionDate: ['', Validators.required],
      totalSaleValueExclGst: ['', Validators.required],
      totalSaleValueInclGst: ['', Validators.required],
    });
  }

  // ==================== Load Project ID from URL ====================

  private loadProjectIdFromUrl(): void {
    this.activatedRoute.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (params: any) => {
          const token = params['token'];
          if (token) {
            try {
              const decryptedId = this.jwtSrv.decrypt(decodeURIComponent(token));
              this.projectId.set(decryptedId);
              this.editProjectForm.patchValue({ projectId: decryptedId });
              this.loadProjectData(decryptedId);
            } catch (error) {
              console.error('Invalid token:', error);
              this.toastSrv.showToast('Invalid project token', 'error');
              this.navigateBack();
            }
          } else {
            this.toastSrv.showToast('Project ID is missing', 'error');
            this.navigateBack();
          }
        },
        error: (error) => {
          console.error('Error loading project ID:', error);
          this.toastSrv.showToast('Error loading project information', 'error');
          this.navigateBack();
        }
      });
  }

  // ==================== Load Project Data ====================

  private loadProjectData(projectId: string): void {
    this.isLoadingProject.set(true);

    forkJoin({
      details: this.projectSrv._getProjectById(projectId),
      costHeads: this.projectSrv._getProjectCostHeadAmounts(projectId)
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (results) => {
          if (results.details?.StatusCode === 200 && results.details?.item) {
            const project = results.details.item;
            this.projectDetails.set(project);
            this.populateProjectDetails(project);
          } else {
            this.toastSrv.showToast('Project not found', 'error');
            this.navigateBack();
            return;
          }

          if (results.costHeads?.StatusCode === 200 && results.costHeads?.Items) {
            this.createCostEstimationRows(results.costHeads.Items);
          } else {
            this.costEstimationRows.set([]);
          }

          this.isLoadingProject.set(false);
        },
        error: (err: any) => {
          console.error('Error loading project data:', err);
          this.toastSrv.showToast('Error loading project data', 'error');
          this.isLoadingProject.set(false);
          this.navigateBack();
        }
      });
  }

  // ==================== Populate Project Details ====================

  private populateProjectDetails(project: GetAllProject): void {
    const formattedExpectedDate = this.formatDate(project.ExpectedCompletionDate);

    this.editProjectForm.patchValue({
      projectName: project.ProjectName || '',
      projectIncharge: project.ProjectIncharge || '',
      nodalAgencyName: project.NodalAgencyName || '',
      wbsNo: project.WbsNo || '',
      chakNo: project.ChakNo || '',
      projectArea: project.ProjectArea || 0,
      agreementDate: this.formatDate(project.AgreementDate),
      endDate: this.formatDate(project.EndDate),
      projectStartDate: this.formatDate(project.ProjectStartDate),
      expectedCompletionDate: formattedExpectedDate,
      totalSaleValueExclGst: project.TotalSaleValueExclGst || 0,
      totalSaleValueInclGst: project.TotalSaleValueInclGst || 0,
      hectareRate: project.HectareRate ?? ''
    });

    // Track original date to detect changes
    this.originalExpectedCompletionDate.set(formattedExpectedDate);
  }

  // ==================== Create Cost Estimation Rows ====================

  private createCostEstimationRows(items: any[]): void {
    const rows: EditRow[] = items.map(item => ({
      id: this.generateId(),
      projectCostHeadId: item.ProjectCostHeadId,
      costHeadId: item.CostHeadId,
      costHeadName: item.CostHeadName,
      costBasis: item.CostBasis || '',
      amount: item.Amount?.toString() || '0',
      originalAmount: item.Amount?.toString() || '0',
      originalCostBasis: item.CostBasis || '',

      // Excel fields
      hasExcel: false,
      excelData: null,
      isLoadingExcel: false,
      excelMetadata: null,
      excelFullData: null,
      isExcelManualEntry: false,
      excelCostBasis: '',
      isUpdatingRow: false,

      selectedVendors: [],
      vendorAttachments: [],
      showVendorDropdown: false,
      isLoadingVendors: false
    }));

    this.costEstimationRows.set(rows);

    rows.forEach(row => {
      this.loadVendorsForCostHead(row.projectCostHeadId, row.id);
      this.loadExcelDataForRow(row);
    });
  }

  // ==================== Excel Management ====================

  /**
   * Manual entry check:
   * - CostBasis is null/empty AND all LineItems.Item === "Manual Entry"
   * => Treat as NO excel, show costBasis from costHeadAmounts API instead
   */
  private isManualEntryExcel(fullData: any): boolean {
    const cb = (fullData?.CostBasis ?? '').toString().trim();
    const lineItems = Array.isArray(fullData?.LineItems) ? fullData.LineItems : [];
    const hasLineItems = lineItems.length > 0;

    const allManual = hasLineItems && lineItems.every((x: any) =>
      ((x?.Item ?? '').toString().trim().toLowerCase() === 'manual entry')
    );

    // Only manual entry when CostBasis is empty AND all items are "Manual Entry"
    return cb === '' && allManual;
  }

  loadExcelDataForRow(row: EditRow): void {
    if (!this.projectId() || !row.costHeadId) return;

    this.updateRowExcelLoadingState(row.id, true);

    this.projectSrv._getCostHeadExcelDetails(this.projectId()!, row.costHeadId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          if (response?.StatusCode === 200 && response?.Data) {
            const full = response.Data;
            const manualExcel = this.isManualEntryExcel(full);

            if (manualExcel) {
              // Manual Entry with empty CostBasis -> treat as NO excel
              // CostBasis will come from costHeadAmounts (already in row.costBasis / row.originalCostBasis)
              this.updateRowExcelData(row.id, [], full, true);
            } else {
              // Has real excel data OR has CostBasis from excel -> show excel view
              const excelData = this.parseExcelResponse(full);
              this.updateRowExcelData(row.id, excelData, full, false);

              if (full.TotalAmount != null) {
                this.updateRowAmount(row.id, full.TotalAmount.toString());
              }
            }
          }
          this.updateRowExcelLoadingState(row.id, false);
        },
        error: (err) => {
          console.error('Error loading Excel data:', err);
          this.updateRowExcelLoadingState(row.id, false);
        }
      });
  }

  private parseExcelResponse(data: any): any[][] {
    if (!data?.LineItems || !Array.isArray(data.LineItems) || data.LineItems.length === 0) {
      return [];
    }

    const headers = ['Sr No', 'Item Code', 'Item', 'Qty', 'Unit', 'Rate', 'Amount'];
    const rows = data.LineItems.map((item: any) => [
      item.SrNo ?? '',
      item.ItemCode ?? '',
      item.Item ?? '',
      item.Qty ?? '',
      item.Unit ?? '',
      item.Rate ?? '',
      item.Amount ?? ''
    ]);

    return [headers, ...rows];
  }

  private updateRowAmount(rowId: string, amount: string): void {
    const rows = this.costEstimationRows().map(row => {
      if (row.id === rowId) return { ...row, amount };
      return row;
    });
    this.costEstimationRows.set(rows);
  }

  private updateRowExcelData(rowId: string, excelData: any[][], fullData?: any, isManualEntry: boolean = false): void {
    const rows = this.costEstimationRows().map(row => {
      if (row.id === rowId) {
        const excelCostBasis = (fullData?.CostBasis ?? '').toString();
        return {
          ...row,
          isExcelManualEntry: isManualEntry,
          hasExcel: !isManualEntry && excelData.length > 0,
          excelData: !isManualEntry ? excelData : null,
          excelMetadata: !isManualEntry ? (fullData?.Metadata || null) : null,
          excelFullData: !isManualEntry ? (fullData || null) : null,
          excelCostBasis
        };
      }
      return row;
    });
    this.costEstimationRows.set(rows);
  }

  private updateRowExcelLoadingState(rowId: string, loading: boolean): void {
    const rows = this.costEstimationRows().map(row => {
      if (row.id === rowId) return { ...row, isLoadingExcel: loading };
      return row;
    });
    this.costEstimationRows.set(rows);
  }

  openExcelModal(row: EditRow): void {
    this.currentExcelRow.set(row);
    this.excelModalData.set(row.excelData || []);
    this.showExcelModal.set(true);
  }

  closeExcelModal(): void {
    this.showExcelModal.set(false);
    this.currentExcelRow.set(null);
  }

  onExcelUpdateComplete(): void {
    const currentRow = this.currentExcelRow();
    if (currentRow) this.loadExcelDataForRow(currentRow);
  }

  // ==================== Load Vendors for Cost Head ====================

  private loadVendorsForCostHead(projectCostHeadId: string, rowId: string): void {
    this.updateRowLoadingState(rowId, true);

    this.projectSrv._getProjectCostHeadVendors(projectCostHeadId)
      .pipe(
        takeUntil(this.destroy$),
        catchError(err => {
          console.error(`Error loading vendors for cost head ${projectCostHeadId}:`, err);
          return of({ StatusCode: 200, items: [] });
        })
      )
      .subscribe({
        next: (response: any) => {
          if (response?.StatusCode === 200 && response?.items) {
            const vendors = response.items;

            const rows = this.costEstimationRows().map(row => {
              if (row.id === rowId) {
                const vendorAttachments: EditVendorAttachment[] = vendors.map((v: any) => ({
                  projectCostHeadVendorId: v.ProjectCostHeadVendorId,
                  vendorId: v.VendorId,
                  vendorName: v.Name,
                  files: [],
                  existingAttachments: [],
                  isLoadingAttachments: false,
                  assignedAmount: ''
                }));

                return {
                  ...row,
                  selectedVendors: vendors.map((v: any) => ({
                    VendorId: v.VendorId,
                    Name: v.Name,
                    IsActive: v.IsActive
                  })),
                  vendorAttachments,
                  isLoadingVendors: false
                };
              }
              return row;
            });

            this.costEstimationRows.set(rows);

            vendors.forEach((vendor: any) => {
              this.loadVendorAttachments(rowId, vendor.ProjectCostHeadVendorId);
            });
          } else {
            this.updateRowLoadingState(rowId, false);
          }
        },
        error: (err) => {
          console.error('Error in vendor loading:', err);
          this.updateRowLoadingState(rowId, false);
        }
      });
  }

  // ==================== Load Vendor Attachments ====================

  private loadVendorAttachments(rowId: string, projectCostHeadVendorId: string): void {
    this.updateVendorAttachmentLoadingState(rowId, projectCostHeadVendorId, true);

    this.projectSrv._getVendorAttachments(projectCostHeadVendorId)
      .pipe(
        takeUntil(this.destroy$),
        catchError(err => {
          console.error(`Error loading attachments for vendor ${projectCostHeadVendorId}:`, err);
          return of({ StatusCode: 200, items: [] });
        })
      )
      .subscribe({
        next: (response: any) => {
          if (response?.StatusCode === 200 && response?.items) {
            const attachments: ExistingAttachment[] = response.items;

            const rows = this.costEstimationRows().map(row => {
              if (row.id === rowId) {
                const updatedAttachments = row.vendorAttachments.map(va => {
                  if (va.projectCostHeadVendorId === projectCostHeadVendorId) {
                    return { ...va, existingAttachments: attachments, isLoadingAttachments: false };
                  }
                  return va;
                });

                return { ...row, vendorAttachments: updatedAttachments };
              }
              return row;
            });

            this.costEstimationRows.set(rows);
          } else {
            this.updateVendorAttachmentLoadingState(rowId, projectCostHeadVendorId, false);
          }
        },
        error: (err) => {
          console.error('Error loading attachments:', err);
          this.updateVendorAttachmentLoadingState(rowId, projectCostHeadVendorId, false);
        }
      });
  }

  // ==================== Vendor Management ====================

  loadVendors(append: boolean = false): void {
    this.isLoadingVendors.set(true);
    const pagination = this.vendorPagination();

    this.projectSrv._getVendors(pagination.page, pagination.pageSize)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          const vendors: Vendor[] = response.items || [];
          if (append) this.allVendors.set([...this.allVendors(), ...vendors]);
          else this.allVendors.set(vendors);

          this.vendorPagination.set({
            ...pagination,
            total: response.total || 0,
            totalPages: response.totalPages || 0
          });

          this.isLoadingVendors.set(false);
        },
        error: (error) => {
          console.error('Error loading vendors:', error);
          this.toastSrv.showToast('Error loading vendors', 'error');
          this.isLoadingVendors.set(false);
        }
      });
  }

  loadMoreVendors(): void {
    const pagination = this.vendorPagination();
    if (pagination.page < pagination.totalPages && !this.isLoadingVendors()) {
      this.vendorPagination.set({ ...pagination, page: pagination.page + 1 });
      this.loadVendors(true);
    }
  }

  onVendorDropdownScroll(event: Event): void {
    const element = event.target as HTMLElement;
    const threshold = 50;
    const position = element.scrollHeight - element.scrollTop - element.clientHeight;
    if (position < threshold) this.loadMoreVendors();
  }

  toggleVendorDropdown(rowId: string): void {
    const rows = this.costEstimationRows().map(row =>
      row.id === rowId ? { ...row, showVendorDropdown: !row.showVendorDropdown } : row
    );
    this.costEstimationRows.set(rows);
  }

  // ==================== Add/Remove Vendors ====================

  async toggleVendorSelection(rowId: string, vendor: Vendor): Promise<void> {
    const row = this.costEstimationRows().find(r => r.id === rowId);
    if (!row) return;

    const existingIndex = row.selectedVendors.findIndex(v => v.VendorId === vendor.VendorId);

    if (existingIndex > -1) {
      const confirmed = await this.confirmationDialogSrv.showConfirm(
        `Remove vendor "${vendor.Name}" and all its attachments?`,
        'Remove Vendor'
      );
      if (confirmed) this.removeVendorFromRow(rowId, vendor.VendorId);
    } else {
      this.addVendorToRow(rowId, vendor);
    }
  }

  private addVendorToRow(rowId: string, vendor: Vendor): void {
    const rows = this.costEstimationRows().map(row => {
      if (row.id === rowId) {
        const updatedVendors = [...row.selectedVendors, vendor];
        const updatedAttachments: any[] = [
          ...row.vendorAttachments,
          {
            projectCostHeadVendorId: '',   // empty = new vendor
            vendorId: vendor.VendorId,
            vendorName: vendor.Name,
            files: [],
            existingAttachments: [],
            isLoadingAttachments: false,
            assignedAmount: ''
          }
        ];

        return { ...row, selectedVendors: updatedVendors, vendorAttachments: updatedAttachments };
      }
      return row;
    });

    this.costEstimationRows.set(rows);
    this.toastSrv.showToast(`${vendor.Name} added`, 'success');
  }

  getVendorAmount(rowId: string, vendorId: string): string {
    const row = this.costEstimationRows().find(r => r.id === rowId);
    if (!row) return '';
    const attachment = row.vendorAttachments.find(va => va.vendorId === vendorId);
    return (attachment as any)?.assignedAmount || '';
  }

  updateVendorAmount(rowId: string, vendorId: string, amount: string): void {
    const rows = this.costEstimationRows().map(row => {
      if (row.id === rowId) {
        const updatedAttachments = row.vendorAttachments.map(va => {
          if (va.vendorId === vendorId) return { ...(va as any), assignedAmount: amount };
          return va;
        });
        return { ...row, vendorAttachments: updatedAttachments };
      }
      return row;
    });

    this.costEstimationRows.set(rows);
  }

  private removeVendorFromRow(rowId: string, vendorId: string): void {
    const row = this.costEstimationRows().find(r => r.id === rowId);
    if (!row) return;

    const vendorAttachment = row.vendorAttachments.find(va => va.vendorId === vendorId);

    if (vendorAttachment?.projectCostHeadVendorId) {
      this.projectSrv._removeProjectCostHeadVendor(vendorAttachment.projectCostHeadVendorId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.removeVendorFromState(rowId, vendorId);
            this.toastSrv.showToast('Vendor removed successfully', 'success');
          },
          error: (err) => {
            console.error('Error removing vendor:', err);
            this.toastSrv.showToast('Error removing vendor', 'error');
          }
        });
    } else {
      this.removeVendorFromState(rowId, vendorId);
      this.toastSrv.showToast('Vendor removed', 'success');
    }
  }

  private removeVendorFromState(rowId: string, vendorId: string): void {
    const rows = this.costEstimationRows().map(row => {
      if (row.id === rowId) {
        return {
          ...row,
          selectedVendors: row.selectedVendors.filter(v => v.VendorId !== vendorId),
          vendorAttachments: row.vendorAttachments.filter(va => va.vendorId !== vendorId)
        };
      }
      return row;
    });

    this.costEstimationRows.set(rows);
  }

  isVendorSelected(rowId: string, vendorId: string): boolean {
    const row = this.costEstimationRows().find(r => r.id === rowId);
    return row?.selectedVendors.some(v => v.VendorId === vendorId) || false;
  }

  // ==================== File Management ====================

  onVendorFileSelect(rowId: string, vendorId: string, event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files || []);
    if (files.length === 0) return;

    const maxSize = 5 * 1024 * 1024;
    const allowedTypes = ['.doc', '.docx', '.pdf'];

    for (const file of files) {
      const extension = '.' + file.name.split('.').pop()?.toLowerCase();

      if (!allowedTypes.includes(extension)) {
        this.toastSrv.showToast(`Invalid file type: ${file.name}`, 'error');
        input.value = '';
        return;
      }

      if (file.size > maxSize) {
        this.toastSrv.showToast(`File too large: ${file.name} (max 5MB)`, 'error');
        input.value = '';
        return;
      }
    }

    const row = this.costEstimationRows().find(r => r.id === rowId);
    if (!row) return;

    const attachmentIndex = row.vendorAttachments.findIndex(va => va.vendorId === vendorId);
    if (attachmentIndex === -1) return;

    const updatedAttachments = [...row.vendorAttachments];
    updatedAttachments[attachmentIndex] = {
      ...updatedAttachments[attachmentIndex],
      files: [...updatedAttachments[attachmentIndex].files, ...files]
    };

    const rows = this.costEstimationRows().map(r =>
      r.id === rowId ? { ...r, vendorAttachments: updatedAttachments } : r
    );
    this.costEstimationRows.set(rows);

    this.toastSrv.showToast(`${files.length} file(s) attached`, 'success');
    input.value = '';
  }

  removeVendorFile(rowId: string, vendorId: string, fileIndex: number): void {
    const row = this.costEstimationRows().find(r => r.id === rowId);
    if (!row) return;

    const attachmentIndex = row.vendorAttachments.findIndex(va => va.vendorId === vendorId);
    if (attachmentIndex === -1) return;

    const updatedAttachments = [...row.vendorAttachments];
    const updatedFiles = updatedAttachments[attachmentIndex].files.filter((_: any, i: number) => i !== fileIndex);
    updatedAttachments[attachmentIndex] = { ...updatedAttachments[attachmentIndex], files: updatedFiles };

    const rows = this.costEstimationRows().map(r =>
      r.id === rowId ? { ...r, vendorAttachments: updatedAttachments } : r
    );
    this.costEstimationRows.set(rows);
    this.toastSrv.showToast('File removed', 'success');
  }

  async deleteExistingAttachment(rowId: string, vendorId: string, attachmentId: string): Promise<void> {
    const confirmed = await this.confirmationDialogSrv.showConfirm(
      'Are you sure you want to delete this attachment? This action cannot be undone.',
      'Delete Attachment'
    );

    if (confirmed) {
      this.projectSrv._deleteVendorAttachment(attachmentId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.removeExistingAttachmentFromState(rowId, vendorId, attachmentId);
            this.toastSrv.showToast('Attachment deleted successfully', 'success');
          },
          error: (err) => {
            console.error('Error deleting attachment:', err);
            this.toastSrv.showToast('Error deleting attachment', 'error');
          }
        });
    }
  }

  downloadAttachment(attachmentId: string, projectCostHeadVendorId: string, fileName: string): void {
    const attachmentParams = { attachmentId, projectCostHeadVendorId };

    this.toastSrv.showToast('Preparing download...', 'warning');

    this.projectSrv._getVendorAttachmentDownload(attachmentParams)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (blob: Blob) => {
          if (blob && blob.size > 0) {
            const fileUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = fileUrl;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(fileUrl);
            this.toastSrv.showToast('Download completed successfully', 'success');
          } else {
            this.toastSrv.showToast('Downloaded file is empty', 'error');
          }
        },
        error: (err) => {
          console.error('Error downloading attachment:', err);
          this.toastSrv.showToast('Failed to download attachment', 'error');
        }
      });
  }

  private removeExistingAttachmentFromState(rowId: string, vendorId: string, attachmentId: string): void {
    const rows = this.costEstimationRows().map(row => {
      if (row.id === rowId) {
        const updatedAttachments = row.vendorAttachments.map(va => {
          if (va.vendorId === vendorId) {
            return {
              ...va,
              existingAttachments: va.existingAttachments.filter((att: any) => att.AttachmentId !== attachmentId)
            };
          }
          return va;
        });

        return { ...row, vendorAttachments: updatedAttachments };
      }
      return row;
    });

    this.costEstimationRows.set(rows);
  }

  // ==================== Update Row Fields ====================

  updateRowField(rowId: string, field: 'costBasis' | 'amount', value: any): void {
    const rows = this.costEstimationRows().map(row =>
      row.id === rowId ? { ...row, [field]: value } : row
    );
    this.costEstimationRows.set(rows);
  }

  validateAmount(event: any): void {
    const input = event.target;
    let value = input.value;
    value = value.replace(/[^\d.]/g, '');
    value = value.replace(/^0+(?=\d)/, '');

    const parts = value.split('.');
    if (parts.length > 2) value = parts[0] + '.' + parts.slice(1).join('');

    if (parts.length === 2 && parts[1].length > 2) {
      value = parts[0] + '.' + parts[1].substring(0, 2);
    }

    if (value.startsWith('.')) value = '0' + value;
    if (value === '' || value === '.') value = '0';

    input.value = value;
  }

  // ==================== Separate Project Update ====================

  updateProjectOnly(): void {
    if (this.editProjectForm.invalid) {
      this.editProjectForm.markAllAsTouched();
      this.toastSrv.showToast('Please fill all required project fields', 'error');
      return;
    }

    const currentDate = this.editProjectForm.controls['expectedCompletionDate'].value;
    const originalDate = this.originalExpectedCompletionDate();

    // If expectedCompletionDate changed → require extension letter first
    if (currentDate && originalDate && currentDate !== originalDate) {
      if (this.extensionLetterComp) {
        this.extensionLetterComp.openUploadModal();
      } else {
        this.toastSrv.showToast('Extension letter component not available', 'error');
      }
      return;
    }

    // Date not changed → update project directly
    this.proceedWithProjectUpdate();
  }

  /** Called by extension letter component after successful upload */
  onExtensionLetterUploaded(): void {
    this.proceedWithProjectUpdate();
  }

  /** Called by extension letter component when user cancels upload */
  onExtensionLetterCancelled(): void {
    this.toastSrv.showToast('Extension letter upload cancelled. Project not updated.', 'warning');
  }

  private proceedWithProjectUpdate(): void {
    this.isSubmittingProject.set(true);

    const controls = this.editProjectForm.controls;
    const updateData = {
      projectId: this.projectId()!,
      agreementDate: controls['agreementDate'].value,
      endDate: controls['endDate'].value,
      projectStartDate: controls['projectStartDate'].value,
      expectedCompletionDate: controls['expectedCompletionDate'].value,
      projectArea: controls['projectArea'].value,
      hectareRate: controls['hectareRate'].value,
      totalSaleValueExclGst: controls['totalSaleValueExclGst'].value,
      totalSaleValueInclGst: controls['totalSaleValueInclGst'].value,
    };

    this.projectSrv._updateProject(updateData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.toastSrv.showToast('Project details updated successfully', 'success');
          // Update the original date so subsequent saves don't re-trigger
          this.originalExpectedCompletionDate.set(controls['expectedCompletionDate'].value);
          this.isSubmittingProject.set(false);
        },
        error: (err) => {
          console.error('Error updating project:', err);
          this.toastSrv.showToast('Error updating project details', 'error');
          this.isSubmittingProject.set(false);
        }
      });
  }

  // ==================== Row-wise Update ====================

  updateSingleRow(row: EditRow): void {
    if (!this.projectId()) return;

    // Determine final cost basis:
    // 1. If excel has CostBasis (excelCostBasis), use that
    // 2. Else use manually entered costBasis
    // 3. Else fall back to originalCostBasis from costHeadAmounts API
    const excelCb = (row.excelCostBasis ?? '').toString().trim();
    const manualCb = (row.costBasis ?? '').toString().trim();
    const originalCb = (row.originalCostBasis ?? '').toString().trim();

    // Cost basis is optional — pass empty string if not provided
    const finalCostBasis = excelCb || manualCb || originalCb || '';

    const amt = parseFloat(row.amount);
    if (!row.amount || isNaN(amt) || amt <= 0) {
      this.toastSrv.showToast(`Valid amount required for ${row.costHeadName}`, 'error');
      return;
    }

    // Set row-level loading
    this.setRowUpdating(row.id, true);

    const formData = new FormData();
    formData.append('projectId', this.projectId()!);
    formData.append('costHeadsJson', JSON.stringify([{
      headId: row.costHeadId,
      costBasis: finalCostBasis,
      manualAmount: parseFloat(this.formatAmount(row.amount))
    }]));

    this.projectSrv._assignCostHeaders(formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.toastSrv.showToast(`${row.costHeadName} cost head updated successfully`, 'success');
          this.setRowUpdating(row.id, false);
          this.loadExcelDataForRow(row);
        },
        error: (err) => {
          console.error('Row update failed:', err);
          this.toastSrv.showToast('Error updating cost head', 'error');
          this.setRowUpdating(row.id, false);
        }
      });
  }

  private setRowUpdating(rowId: string, updating: boolean): void {
    const rows = this.costEstimationRows().map(row =>
      row.id === rowId ? { ...row, isUpdatingRow: updating } : row
    );
    this.costEstimationRows.set(rows);
  }

  // ==================== Save Vendors & Attachments for a Row (Separate Button) ====================

  saveVendorsForRow(row: EditRow): void {
    if (!this.projectId()) return;

    const projectId = this.projectId()!;
    const projectCostHeadId = row.projectCostHeadId;

    if (!projectCostHeadId) {
      this.toastSrv.showToast('Cost head mapping not found', 'error');
      return;
    }

    this.setRowVendorSaving(row.id, true);

    // Build vendor assignments from NEW vendors only (no projectCostHeadVendorId yet)
    // Pattern follows assignAllVendors: map selectedVendors -> find attachment -> get assignedAmount
    const newVendors = row.selectedVendors.filter(vendor => {
      const va = row.vendorAttachments.find(a => a.vendorId === vendor.VendorId);
      return va && !va.projectCostHeadVendorId;
    });

    if (newVendors.length === 0) {
      // No new vendors to assign -> skip to uploading attachments for existing vendors
      this.uploadAllVendorAttachmentsForRow(row, null);
      return;
    }

    // Match the add-flow pattern: map -> filter assignedAmount > 0
    const vendorAssignmentsArray = newVendors
      .map(vendor => {
        const attachment = row.vendorAttachments.find(va => va.vendorId === vendor.VendorId);
        return {
          vendorId: vendor.VendorId,
          assignedAmount: parseFloat(attachment?.assignedAmount || '0')
        };
      })
      .filter(va => va.assignedAmount > 0);

    // If no vendor has a valid amount, skip assign API and go straight to attachments
    if (vendorAssignmentsArray.length === 0) {
      this.toastSrv.showToast('Enter assigned amount for new vendors to assign them', 'warning');
      this.uploadAllVendorAttachmentsForRow(row, null);
      return;
    }

    const vendorAssignment = {
      projectId,
      projectCostHeadId,
      vendorAssignmentsJson: JSON.stringify(vendorAssignmentsArray)
    };

    this.projectSrv._assignVendorsToCostHead([vendorAssignment])
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          const hasAttachments = row.vendorAttachments.some(va => va.files.length > 0);

          if (!hasAttachments) {
            this.toastSrv.showToast(`Vendors assigned for ${row.costHeadName}`, 'success');
            this.setRowVendorSaving(row.id, false);
            this.reloadRowData(row);
          } else {
            this.uploadAllVendorAttachmentsForRow(row, response);
          }
        },
        error: (error) => {
          console.error('Error assigning vendors:', error);
          this.toastSrv.showToast('Failed to assign vendors', 'error');
          this.setRowVendorSaving(row.id, false);
        }
      });
  }

  private async uploadAllVendorAttachmentsForRow(row: EditRow, assignVendorResponse: any): Promise<void> {
    const results = assignVendorResponse?.Results;

    // Build a map of vendorId -> projectCostHeadVendorId from the assign response
    const vendorIdToProjectCostHeadVendorId: { [vendorId: string]: string } = {};

    if (Array.isArray(results)) {
      for (const result of results) {
        const assignedVendors = result.assignedVendors;
        if (!Array.isArray(assignedVendors)) continue;

        for (const av of assignedVendors) {
          if (av.VendorId && av.ProjectCostHeadVendorId) {
            vendorIdToProjectCostHeadVendorId[av.VendorId] = av.ProjectCostHeadVendorId;
          }
        }
      }
    }

    // Update newly assigned vendor IDs in state
    if (Object.keys(vendorIdToProjectCostHeadVendorId).length > 0) {
      const rows = this.costEstimationRows().map(r => {
        if (r.id !== row.id) return r;
        const updatedAttachments = r.vendorAttachments.map(va => {
          if (!va.projectCostHeadVendorId && vendorIdToProjectCostHeadVendorId[va.vendorId]) {
            return { ...va, projectCostHeadVendorId: vendorIdToProjectCostHeadVendorId[va.vendorId] };
          }
          return va;
        });
        return { ...r, vendorAttachments: updatedAttachments };
      });
      this.costEstimationRows.set(rows);
    }

    // Re-read the row from signal after vendor IDs are updated
    const updatedRow = this.costEstimationRows().find(r => r.id === row.id) || row;
    const attachmentsToUpload = updatedRow.vendorAttachments.filter(va => va.files.length > 0);

    if (attachmentsToUpload.length === 0) {
      this.toastSrv.showToast(`Vendors saved for ${row.costHeadName}`, 'success');
      this.setRowVendorSaving(row.id, false);
      this.reloadRowData(row);
      return;
    }

    let failedUploads = 0;

    try {
      for (const va of attachmentsToUpload) {
        const projectCostHeadVendorId = va.projectCostHeadVendorId
          || vendorIdToProjectCostHeadVendorId[va.vendorId];

        if (!projectCostHeadVendorId) {
          failedUploads++;
          continue;
        }

        try {
          await this.uploadSingleVendorAttachment(projectCostHeadVendorId, va.files);
        } catch {
          failedUploads++;
        }
      }

      if (failedUploads === 0) {
        this.toastSrv.showToast(`Vendors & attachments saved for ${row.costHeadName}`, 'success');
      } else {
        this.toastSrv.showToast(`Saved with ${failedUploads} upload error(s)`, 'warning');
      }
    } finally {
      this.setRowVendorSaving(row.id, false);
      this.reloadRowData(row);
    }
  }

  private setRowVendorSaving(rowId: string, saving: boolean): void {
    const rows = this.costEstimationRows().map(row =>
      row.id === rowId ? { ...row, isSavingVendors: saving } : row
    );
    this.costEstimationRows.set(rows);
  }

  /** Reload vendor attachments & excel data for a row after update */
  private reloadRowData(row: EditRow): void {
    this.loadVendorsForCostHead(row.projectCostHeadId, row.id);
    this.loadExcelDataForRow(row);
  }

  // ==================== Prevent form default submit ====================

  onProjectSubmit(): void {
    // No-op: project info and rows are updated separately
  }

  // ==================== GST ====================

  onSaleValue(): void {
    const area = Number(this.editProjectForm.get('projectArea')?.value);
    const hectareRate = Number(this.editProjectForm.get('hectareRate')?.value);

    if (!area || isNaN(area) || area <= 0 || !hectareRate || isNaN(hectareRate) || hectareRate <= 0) {
      this.editProjectForm.patchValue({
        totalSaleValueExclGst: '',
        totalSaleValueInclGst: ''
      });
      return;
    }

    this.pbAddNewProjectService._getGSTValues(area, hectareRate)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          const data = res?.Data ?? res;
          this.editProjectForm.patchValue({
            totalSaleValueExclGst: data?.TotalSaleValueExclGst ?? '',
            totalSaleValueInclGst: data?.TotalSaleValueInclGst ?? ''
          });
        },
        error: () => this.toastSrv.showToast('Failed to calculate sale value', 'error')
      });
  }

  // ==================== Extension Letter ====================
  // Handled by PbExtensionLetterComponent (see template)

  /** Opens the view modal on the extension letter child component */
  openExtensionLetterView(): void {
    if (this.extensionLetterComp) {
      this.extensionLetterComp.openViewModal();
    }
  }

  // ==================== Upload Vendor Attachments ====================

  private uploadSingleVendorAttachment(projectCostHeadVendorId: string, files: File[]): Promise<any> {
    const formData = new FormData();
    formData.append('Items[0].ProjectCostHeadVendorId', projectCostHeadVendorId);
    files.forEach(file => formData.append('Items[0].Files', file, file.name));

    return this.projectSrv._uploadVendorAttachments(formData)
      .pipe(takeUntil(this.destroy$))
      .toPromise();
  }

  // ==================== Helper Functions ====================

  formatAmount(amount: string): string {
    const num = parseFloat(amount);
    return isNaN(num) ? '0.00' : num.toFixed(2);
  }

  calculateGrandTotal(): number {
    return this.costEstimationRows().reduce((total, row) => total + (parseFloat(row.amount) || 0), 0);
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    try {
      return dateString.split('T')[0];
    } catch {
      return '';
    }
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private updateRowLoadingState(rowId: string, loading: boolean): void {
    const rows = this.costEstimationRows().map(row =>
      row.id === rowId ? { ...row, isLoadingVendors: loading } : row
    );
    this.costEstimationRows.set(rows);
  }

  private updateVendorAttachmentLoadingState(rowId: string, projectCostHeadVendorId: string, loading: boolean): void {
    const rows = this.costEstimationRows().map(row => {
      if (row.id === rowId) {
        const updatedAttachments = row.vendorAttachments.map(va => {
          if (va.projectCostHeadVendorId === projectCostHeadVendorId) {
            return { ...va, isLoadingAttachments: loading };
          }
          return va;
        });
        return { ...row, vendorAttachments: updatedAttachments };
      }
      return row;
    });
    this.costEstimationRows.set(rows);
  }

  async onCancel(): Promise<void> {
    const confirmed = await this.confirmationDialogSrv.showConfirm(
      'Are you sure you want to cancel? All unsaved changes will be lost.',
      'Warning'
    );
    if (confirmed) this.navigateBack();
  }

  navigateBack(): void {
    this.router.navigate(['/pbProjectManagementComponent']);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.editProjectForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.editProjectForm.get(fieldName);
    if (field?.hasError('required')) return 'This field is required';
    return '';
  }
}