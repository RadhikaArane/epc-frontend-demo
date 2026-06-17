import { Component, EventEmitter, Output, signal, OnDestroy, OnInit, AfterViewInit, inject, ViewChild, ElementRef, HostListener } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil, forkJoin } from 'rxjs';
import { ToastService } from '../../../../../shared/services/componentServices/toast.service';
import { PbProjectManagementService } from '../../../../../shared/services/projectBusiness/pb-project-management.service';
import { CustomerItem } from '../../../../../shared/models/projectBusiness-models/projectmanagement';
import { PbAddNewProjectService } from '../../../../../shared/services/projectBusiness/pb-add-new-project.service';
import { AddNewProject } from '../../../../../shared/models/projectBusiness-models/pbAddNewProject';
import { GetNodalAgency } from '../../../../../shared/models/projectBusiness-models/pbNodalAgency';
import { PbAddNodalAgencyService } from '../../../../../shared/services/projectBusiness/pb-add-nodal-agency.service';

@Component({  
  selector: 'app-pb-add-new-project',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './pb-add-new-project.component.html',
  styleUrl: './pb-add-new-project.component.scss'
})
export class PbAddNewProjectComponent implements OnInit, OnDestroy {
  private toastSrv = inject(ToastService);
  private projectSrv = inject(PbProjectManagementService);
  private PbAddNewProjectService = inject(PbAddNewProjectService);
  private projectNodalSrv = inject(PbAddNodalAgencyService);
  
  private destroy$ = new Subject<void>();

  @Output() projectAdded = new EventEmitter<void>();
  @Output() modalClosed = new EventEmitter<void>();

  @ViewChild('customerDropdownList') customerDropdownList!: ElementRef<HTMLDivElement>;
  @ViewChild('ceoAgreementInput') ceoAgreementInput!: ElementRef<HTMLInputElement>;
  @ViewChild('ceoEmailInput') ceoEmailInput!: ElementRef<HTMLInputElement>;

  // Form state
  isSubmitting = signal<boolean>(false);

  // Customer dropdown state
  customerDropdownData = signal<CustomerItem[]>([]);
  currentCustomerPage = signal<number>(1);
  customerPageSize = signal<number>(25);
  hasMoreCustomers = signal<boolean>(true);
  isLoadingCustomers = signal<boolean>(false);
  isLoadingMoreCustomers = signal<boolean>(false);
  selectedCustomerName = signal<string>('Select Customer');
  isCustomerDropdownOpen = signal<boolean>(false);

  // Nodal Agency state
  nodalAgencyList = signal<GetNodalAgency[]>([]);
  isLoadingNodalAgencies = signal<boolean>(false);

  // File upload state
  ceoAgreementFile = signal<File | null>(null);
  ceoAgreementFileName = signal<string>('');
  ceoAgreementError = signal<string>('');

  ceoEmailFile = signal<File | null>(null);
  ceoEmailFileName = signal<string>('');
  ceoEmailError = signal<string>('');
  isDragging = signal<boolean>(false);

  //gst
  gstLoading = signal<boolean>(false);
  gstError = signal<string>('');


  // File validation config
  private readonly FILE_CONFIG = {
    agreement: {
      types: ['application/pdf', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
      extensions: ['.pdf', '.xls', '.xlsx'],
      maxSize: 10 * 1024 * 1024
    },
    email: {
      types: ['application/vnd.ms-outlook', 'message/rfc822', 'application/octet-stream'],
      extensions: ['.msg', '.eml'],
      maxSize: 10 * 1024 * 1024
    }
  };

  addProjectForm: FormGroup = new FormGroup({
    ProjectNumber: new FormControl('', [Validators.required]),
    chakNo: new FormControl('', [Validators.required]), 
    wbsNo: new FormControl('', [Validators.required]),
    projectName: new FormControl('', [Validators.required]),
    customerId: new FormControl('', [Validators.required]),
    status: new FormControl('Active', [Validators.required]),
    agreementDate: new FormControl('', [Validators.required]),
    projectStartDate: new FormControl('', [Validators.required]),
    endDate: new FormControl('', [Validators.required]),
    expectedCompletionDate: new FormControl('', [Validators.required]),
    projectArea: new FormControl('', [Validators.required, Validators.min(0)]),
    HectareRate: new FormControl('', [Validators.min(0)]),
    // HectareRate: new FormControl<number | null>(null, [Validators.min(0)]),
    totalSaleValueExclGst: new FormControl('', [Validators.required]),
    totalSaleValueInclGst: new FormControl('', [Validators.required]),
    nodalAgencyId: new FormControl('', [Validators.required]),
    projectIncharge: new FormControl('', [Validators.required]),
    ceoAgreementAttachment: new FormControl(null, [Validators.required]),
    ceoEmailAttachment: new FormControl(null, [Validators.required])
  });

  // ==================== LIFECYCLE HOOKS ====================

  ngOnInit(): void {
    this.loadInitialData();
  }



  /**
   * Load customers and nodal agencies on component initialization
   */
  private loadInitialData(): void {
    console.log('📡 Loading initial data (Customers + Nodal Agencies)...');

    // Load both in parallel for better performance
    forkJoin({
      customers: this.PbAddNewProjectService._getAllCustomers({
        page: this.currentCustomerPage(),
        pageSize: this.customerPageSize()
      }),
      agencies: this.projectNodalSrv._getNodalAgencies()
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (results) => {
          // Handle customers
          if (results.customers?.StatusCode === 200 && Array.isArray(results.customers.items)) {
            this.customerDropdownData.set(results.customers.items);
            this.hasMoreCustomers.set(results.customers.items.length >= this.customerPageSize());
            console.log(`✅ Loaded ${results.customers.items.length} customers`);
          }

          // Handle nodal agencies
          if (results.agencies?.StatusCode === 200 && Array.isArray(results.agencies.Data)) {
            this.nodalAgencyList.set(results.agencies.Data);
            console.log(`✅ Loaded ${results.agencies.Data.length} nodal agencies`);
          }

          console.log('🎉 Initial data loaded successfully');
        },
        error: (err) => {
          console.error('❌ Error loading initial data:', err);
          this.toastSrv.showToast('Error loading form data', 'error');
        }
      });
  }


  // ==================== FILE VALIDATION ====================

  private validateFile(file: File, config: typeof this.FILE_CONFIG.agreement | typeof this.FILE_CONFIG.email): string | null {
    const extension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));

    if (!config.extensions.includes(extension)) {
      return `Only ${config.extensions.join(', ')} files are allowed`;
    }

    if (!config.types.includes(file.type) && !config.extensions.includes(extension)) {
      return 'Invalid file type';
    }

    if (file.size > config.maxSize) {
      return `File size must be less than ${config.maxSize / (1024 * 1024)}MB`;
    }

    return null;
  }

  private sanitizeFileName(fileName: string): string {
    return fileName.replace(/[\/\\<>:"|?*]/g, '').replace(/\.\./g, '').trim();
  }

  // ==================== CEO AGREEMENT FILE ====================

  triggerCeoAgreementFileInput(): void {
    this.ceoAgreementInput?.nativeElement.click();
  }

  onCeoAgreementFileSelect(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    this.processCeoAgreementFile(file);
  }

  private processCeoAgreementFile(file: File | undefined): void {
    this.resetCeoAgreementFile();

    if (!file) return;

    const error = this.validateFile(file, this.FILE_CONFIG.agreement);
    if (error) {
      this.ceoAgreementError.set(error);
      if (this.ceoAgreementInput) this.ceoAgreementInput.nativeElement.value = '';
      return;
    }

    this.ceoAgreementFile.set(file);
    this.ceoAgreementFileName.set(this.sanitizeFileName(file.name));
    this.addProjectForm.patchValue({ ceoAgreementAttachment: file });
  }

  removeCeoAgreementFile(): void {
    this.resetCeoAgreementFile();
    if (this.ceoAgreementInput) this.ceoAgreementInput.nativeElement.value = '';
  }

  private resetCeoAgreementFile(): void {
    this.ceoAgreementFile.set(null);
    this.ceoAgreementFileName.set('');
    this.ceoAgreementError.set('');
    this.addProjectForm.patchValue({ ceoAgreementAttachment: null });
  }

  // ==================== CEO EMAIL FILE (with Drag & Drop) ====================

  triggerCeoEmailFileInput(): void {
    this.ceoEmailInput?.nativeElement.click();
  }

  onCeoEmailFileSelect(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    this.processCeoEmailFile(file);
  }

  onEmailDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(true);
  }

  onEmailDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
  }

  onEmailDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);

    const file = event.dataTransfer?.files?.[0];
    this.processCeoEmailFile(file);
  }

  private processCeoEmailFile(file: File | undefined): void {
    this.resetCeoEmailFile();

    if (!file) {
      this.ceoEmailError.set('Please save the email as .msg/.eml file first, then drag or browse');
      return;
    }

    const error = this.validateFile(file, this.FILE_CONFIG.email);
    if (error) {
      this.ceoEmailError.set(error);
      if (this.ceoEmailInput) this.ceoEmailInput.nativeElement.value = '';
      return;
    }

    this.ceoEmailFile.set(file);
    this.ceoEmailFileName.set(this.sanitizeFileName(file.name));
    this.addProjectForm.patchValue({ ceoEmailAttachment: file });
  }

  removeCeoEmailFile(): void {
    this.resetCeoEmailFile();
    if (this.ceoEmailInput) this.ceoEmailInput.nativeElement.value = '';
  }

  private resetCeoEmailFile(): void {
    this.ceoEmailFile.set(null);
    this.ceoEmailFileName.set('');
    this.ceoEmailError.set('');
    this.addProjectForm.patchValue({ ceoEmailAttachment: null });
  }

  // ==================== CUSTOMER DROPDOWN ====================

  toggleCustomerDropdown(): void {
    const isOpen = !this.isCustomerDropdownOpen();
    this.isCustomerDropdownOpen.set(isOpen);

    // No need to load data here, it's already loaded in ngOnInit
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const dropdown = document.getElementById('customerDropdownContainer');
    if (dropdown && !dropdown.contains(event.target as HTMLElement)) {
      this.isCustomerDropdownOpen.set(false);
    }
  }

  private loadCustomers(isInitial: boolean = false): void {
    if (isInitial) {
      this.currentCustomerPage.set(1);
      this.customerDropdownData.set([]);
      this.hasMoreCustomers.set(true);
      this.isLoadingCustomers.set(true);
    } else {
      this.isLoadingMoreCustomers.set(true);
    }

    const params = { page: this.currentCustomerPage(), pageSize: this.customerPageSize() };

    this.PbAddNewProjectService._getAllCustomers(params)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          if (res?.StatusCode === 200 && Array.isArray(res.items)) {
            const newData = isInitial ? res.items : [...this.customerDropdownData(), ...res.items];
            this.customerDropdownData.set(newData);
            this.hasMoreCustomers.set(res.items.length >= this.customerPageSize());
          }
          this.isLoadingCustomers.set(false);
          this.isLoadingMoreCustomers.set(false);
        },
        error: (err) => {
          console.error('❌ Error loading more customers:', err);
          this.toastSrv.showToast('Error loading customers', 'error');
          this.isLoadingCustomers.set(false);
          this.isLoadingMoreCustomers.set(false);
        }
      });
  }

  onCustomerDropdownScroll(event: Event): void {
    const div = event.target as HTMLDivElement;
    const isNearBottom = div.scrollTop + div.clientHeight > div.scrollHeight - 50;

    if (isNearBottom && this.hasMoreCustomers() && !this.isLoadingMoreCustomers()) {
      this.currentCustomerPage.update(p => p + 1);
      this.loadCustomers(false);
    }
  }

  selectCustomer(customer: CustomerItem): void {
    this.selectedCustomerName.set(customer.Name1);
    this.addProjectForm.patchValue({ customerId: customer.Id });
    this.isCustomerDropdownOpen.set(false);
  }

  getFilteredCustomers(): CustomerItem[] {
    return this.customerDropdownData();
  }

  // ==================== NODAL AGENCY ====================

  onNodalAgencyDropdownOpen(): void {
    this.loadNodalAgencies();
  }

  private loadNodalAgencies(): void {
    this.isLoadingNodalAgencies.set(true);

    this.projectNodalSrv._getNodalAgencies()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          if (res?.StatusCode === 200 && Array.isArray(res.Data)) {
            this.nodalAgencyList.set(res.Data);
            console.log(`✅ Reloaded ${res.Data.length} nodal agencies`);
          }
          this.isLoadingNodalAgencies.set(false);
        },
        error: (err) => {
          console.error('❌ Error reloading nodal agencies:', err);
          this.toastSrv.showToast('Error loading nodal agencies', 'error');
          this.isLoadingNodalAgencies.set(false);
        }
      });
  }

  onNodalAgencyChange(event: Event): void {
    const nodalAgencyId = (event.target as HTMLSelectElement).value;
    this.addProjectForm.patchValue({ nodalAgencyId });
  }


  // ==================== GST ====================

  onSaleValue(): void {
    const area = Number(this.addProjectForm.get('projectArea')?.value);
    const HectareRate = Number(this.addProjectForm.get('HectareRate')?.value);

    // Check if either area or hector rate is invalid
    if (!area || isNaN(area) || area <= 0 || !HectareRate || isNaN(HectareRate) || HectareRate <= 0) {
      this.addProjectForm.patchValue({
        totalSaleValueExclGst: '',
        totalSaleValueInclGst: ''
      });
      return;
    }

    // Call API if both values are valid
    this.PbAddNewProjectService._getGSTValues(area, HectareRate)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          const data = res?.Data ?? res;

          this.addProjectForm.patchValue({
            totalSaleValueExclGst: data?.TotalSaleValueExclGst ?? '',
            totalSaleValueInclGst: data?.TotalSaleValueInclGst ?? ''
          });
        },
        error: () => {
          this.toastSrv.showToast('Failed to calculate sale value', 'error');
        }
      });
  }



  // ==================== FORM SUBMISSION ====================

  onSubmit(): void {
    if (this.addProjectForm.invalid) {
      this.addProjectForm.markAllAsTouched();

      if (!this.ceoAgreementFile()) this.ceoAgreementError.set('CEO/Agreement attachment is required');
      if (!this.ceoEmailFile()) this.ceoEmailError.set('CEO/Approved Email attachment is required');

      this.toastSrv.showToast('Please fill all required fields', 'error');
      return;
    }

    this.isSubmitting.set(true);

    const projectData: AddNewProject = { 
    ...this.addProjectForm.value  
  };
    console.log("addProjectForm", this.addProjectForm);

    this.PbAddNewProjectService._addNewProject(projectData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          const projectId = res.Data?.ProjectId || res.ProjectId;

          if (!projectId) {
            this.toastSrv.showToast('Project created but ID missing', 'warning');
            this.finishSubmission();
            return;
          }

          this.uploadAttachments(projectId);
        },
        error: (err) => {
          this.toastSrv.showToast(err?.message || 'Error adding project', 'error');
          this.isSubmitting.set(false);
        }
      });
  }

  private uploadAttachments(projectId: string): void {
    const agreementData = new FormData();
    agreementData.append('projectId', projectId);
    agreementData.append('Files', this.ceoAgreementFile()!, this.ceoAgreementFileName());

    const emailData = new FormData();
    emailData.append('ProjectId', projectId);
    emailData.append('EmailFiles', this.ceoEmailFile()!, this.ceoEmailFileName());

    forkJoin({
      agreement: this.PbAddNewProjectService._uploadProjectAttachment(agreementData),
      email: this.PbAddNewProjectService._uploadEmailAttachment(emailData)
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.toastSrv.showToast('Project created successfully', 'success');
          this.finishSubmission();
        },
        error: () => {
          this.toastSrv.showToast('Project created but attachments failed', 'warning');
          this.finishSubmission();
        }
      });
  }

  private finishSubmission(): void {
    this.isSubmitting.set(false);
    this.resetAndClose();
    this.projectAdded.emit();
  }

  // ==================== FORM UTILITIES ====================

  resetAndClose(): void {
    this.addProjectForm.reset({ status: 'Active' });
    this.selectedCustomerName.set('Select Customer');
    // Keep the loaded data, just reset the page
    this.currentCustomerPage.set(1);
    this.isCustomerDropdownOpen.set(false);
    this.removeCeoAgreementFile();
    this.removeCeoEmailFile();
    this.modalClosed.emit();
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.addProjectForm.get(fieldName);
    return !!(field?.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.addProjectForm.get(fieldName);
    if (field?.hasError('required')) return 'This field is required';
    if (field?.hasError('min')) return `Minimum value is ${field.errors?.['min'].min}`;
    return '';
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}