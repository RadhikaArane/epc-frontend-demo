import {
  Component, EventEmitter, inject, Input, Output, OnInit,
  signal, computed, HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastService } from '../../../../../shared/services/componentServices/toast.service';
import { AuthService } from '../../../../../shared/services/common/auth.service';
import { UrUnrecognisedAddRemarkServiceService } from '../../../../../shared/services/unrecognisedInvoice/ur-unrecognised-add-remark.service';
import { PredefinedRemarksItem, urGetPredefinedRemarks } from '../../../../../shared/models/unrecognisedInvoice-models/remarks';

@Component({
  selector: 'app-add-remarks',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-remarks.component.html',
  styleUrl: './add-remarks.component.scss',
})
export class AddRemarksComponent implements OnInit {
  @Input() filterParams: any = {};
  @Output() projectAdded = new EventEmitter<void>();
  @Output() modalClosed = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private remarksSrv = inject(UrUnrecognisedAddRemarkServiceService);
  private toastSrv = inject(ToastService);
  private authSrv = inject(AuthService);

  // UI State
  showModal = signal(false);
  isLoading = signal(false);
  isDownloadRemarksExcel = signal(false)
  activeTab = signal<'normal' | 'ceo'>('normal');
  loadPredefined = signal<PredefinedRemarksItem[]>([]);
  selectedFile = signal<File | null>(null);
  availableYears = signal<number[]>([]);

  // Registration Dropdown
  registrationList = signal<any[]>([]);
  selectedIds = signal<Set<string>>(new Set());
  isRegistrationOpen = signal(false);

  // Remark For Dropdown
  remarkForOptions = signal<string[]>(['COGs', 'Invoice']);
  isRemarkForOpen = signal(false);
  selectedRemarkForText = signal('-- Select --');

  selectedRegistrationText = computed(() => {
    const ids = this.selectedIds();
    const selected = (this.registrationList() || [])
      .filter(x => ids.has(String(x.Id)))
      .map(x => String(x.RegistrationNumber || '').trim())
      .filter(x => x && x !== '-');
    if (selected.length === 0) return '-- Select --';
    if (selected.length <= 3) return selected.join(', ');
    return `${selected.length} Selected`;
  });

  // ─── Two Separate Forms ───────────────────────────────
  normalForm!: FormGroup;
  ceoForm!: FormGroup;

  constructor() {
    this.initForms();
    this.generateYears();
  }

  ngOnInit(): void {
    this.loadPredefinedRemarks();
    this.setStaticRemarkOptions();
  }

  // ─── Form Init ────────────────────────────────────────

  private initForms(): void {
    // Normal Remark Form
    this.normalForm = this.fb.group({
      registrationNo: ['', Validators.required],
      remarkFor: ['', Validators.required],
      predefinedReasonRemarkNo: [''],
      billingRRPendingReason: [''],
      predefinedActionRemarkNo: [''],
      actionToBeTakenForCompletionRR: [''],
      completionMonth: ['', Validators.required],
      completionYear: [new Date().getFullYear(), Validators.required],
      billingRRCompletionTargetDate: ['', Validators.required],
    });

    // CEO/CFO Remark Form
    this.ceoForm = this.fb.group({
      registrationNo: ['', Validators.required],
      remarkFor: ['', Validators.required],
      completionMonth: ['', Validators.required],
      completionYear: [new Date().getFullYear(), Validators.required],
      reviewedRemarkByCEO_CFO: ['', Validators.required],
    });
  }

  private generateYears(): void {
    const years = [];
    for (let i = 2020; i <= 2030; i++) years.push(i);
    this.availableYears.set(years);
  }

  // ─── Validation: Either predefined OR manual required ──

  isReasonValid(): boolean {
    const f = this.normalForm;
    return !!(f.get('predefinedReasonRemarkNo')?.value || f.get('billingRRPendingReason')?.value?.trim());
  }

  isActionValid(): boolean {
    const f = this.normalForm;
    return !!(f.get('predefinedActionRemarkNo')?.value || f.get('actionToBeTakenForCompletionRR')?.value?.trim());
  }

  get activeForm(): FormGroup {
    return this.activeTab() === 'normal' ? this.normalForm : this.ceoForm;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.activeForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  // ─── Tab Switch ───────────────────────────────────────

  switchTab(tab: 'normal' | 'ceo'): void {
    this.activeTab.set(tab);
    // Sync shared fields (registrationNo, remarkFor) to new tab
    this.syncRegAndRemarkFor();
  }

  private syncRegAndRemarkFor(): void {
    const status = this.selectedIds().size > 0 ? 'valid' : '';
    const remarkFor = this.selectedRemarkForText() !== '-- Select --' ? this.selectedRemarkForText() : '';
    this.normalForm.patchValue({ registrationNo: status, remarkFor });
    this.ceoForm.patchValue({ registrationNo: status, remarkFor });
  }

  // ─── Registration Dropdown ────────────────────────────

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.registration-dropdown-container')) this.isRegistrationOpen.set(false);
    if (!target.closest('.remarkfor-dropdown-container')) this.isRemarkForOpen.set(false);
  }

  toggleRegistrationDropdown(): void { this.isRegistrationOpen.update(v => !v); }

  toggleSelection(item: any, event: Event): void {
    event.stopPropagation();
    const id = String(item.Id);
    const set = new Set(this.selectedIds());
    set.has(id) ? set.delete(id) : set.add(id);
    this.selectedIds.set(set);
    this.syncRegAndRemarkFor();
  }

  isSelected(item: any): boolean { return this.selectedIds().has(String(item.Id)); }

  // ─── Remark For Dropdown ──────────────────────────────

  toggleRemarkForDropdown(): void { this.isRemarkForOpen.update(v => !v); }

  selectRemarkFor(option: string): void {
    this.selectedRemarkForText.set(option);
    this.normalForm.patchValue({ remarkFor: option });
    this.ceoForm.patchValue({ remarkFor: option });
    this.isRemarkForOpen.set(false);
  }

  // ─── Modal Open / Close ───────────────────────────────

  openModal(): void {
    this.normalForm.reset({ completionYear: new Date().getFullYear(), predefinedReasonRemarkNo: '', predefinedActionRemarkNo: '' });
    this.ceoForm.reset({ completionYear: new Date().getFullYear() });
    this.registrationList.set([]);
    this.selectedIds.set(new Set());
    this.selectedFile.set(null);
    this.activeTab.set('normal');
    this.setStaticRemarkOptions();
    this.showModal.set(true);
  }

  openWithSelections(parentSelections: any[]): void {
    this.openModal();
    const mapped = (parentSelections || []).map(x => {
      const regNo = String(x.registrationNo || x['Registration No.'] || x['Reg No'] || x.RegistrationNumber || x.regNo || '').trim();
      return { Id: String(x.id || x.Id || regNo), RegistrationNumber: regNo || '-' };
    }).filter(x => x.RegistrationNumber !== '-');

    this.registrationList.set(mapped);
    this.selectedIds.set(new Set(mapped.map(x => x.Id)));
    this.syncRegAndRemarkFor();
  }

  closeModal(): void {
    this.showModal.set(false);
    this.modalClosed.emit();
  }

  reset(): void { this.openModal(); }

  // ─── Predefined Remarks (NO auto-fill) ────────────────

  loadPredefinedRemarks(): void {
    this.remarksSrv._getPredefinedRemarks().subscribe({
      next: (res: urGetPredefinedRemarks) => this.loadPredefined.set(res.items || []),
      error: () => this.toastSrv.showToast('Failed to load predefined remarks', 'error'),
    });
  }

  setStaticRemarkOptions(): void {
    const dashboardType = this.filterParams?.DashboardType || 'Inventory';
    const target = dashboardType.toLowerCase() === 'cogs' ? 'COGs' : 'Invoice';
    this.normalForm.patchValue({ remarkFor: target });
    this.ceoForm.patchValue({ remarkFor: target });
    this.selectedRemarkForText.set(target);
  }

  // ─── Get selected reg nos helper ──────────────────────

  private getSelectedRegNos(): string[] {
    const ids = this.selectedIds();
    return (this.registrationList() || [])
      .filter(x => ids.has(String(x.Id)))
      .map(x => String(x.RegistrationNumber || '').trim())
      .filter(x => x && x !== '-');
  }

  // ─── Submit Normal Remark ─────────────────────────────

  submitNormalRemark(): void {
    this.normalForm.markAllAsTouched();

    if (this.normalForm.invalid) {
      this.toastSrv.showToast('Please fill all required fields', 'warning');
      return;
    }

    if (!this.isReasonValid()) {
      this.toastSrv.showToast('Select predefined reason OR enter Billing/RR Pending Reason', 'warning');
      return;
    }

    if (!this.isActionValid()) {
      this.toastSrv.showToast('Select predefined action OR enter Action To Be Taken', 'warning');
      return;
    }

    const regNos = this.getSelectedRegNos();
    if (regNos.length === 0) { this.toastSrv.showToast('No valid Reg Nos selected', 'warning'); return; }

    const f = this.normalForm.value;
    const payload = {
      year: String(f.completionYear),
      month: String(f.completionMonth),
      predefinedReasonRemarkNo: f.predefinedReasonRemarkNo || '',
      predefinedActionRemarkNo: f.predefinedActionRemarkNo || '',
      billingRRPendingReason: f.billingRRPendingReason || '',
      actionToBeTakenForCompletionRR: f.actionToBeTakenForCompletionRR || '',
      billingRRCompletionTargetDate: f.billingRRCompletionTargetDate || '',
      custRegNumbers: regNos,
      actorEmployeeId: String(this.authSrv.userDetails?.employeeId || ''),
      remarkFor: String(f.remarkFor),
      approve: '',
    };

    this.isLoading.set(true);
    this.remarksSrv._upsertRemarks(payload).subscribe({
      next: () => { this.toastSrv.showToast('Remark saved successfully', 'success'); this.isLoading.set(false); this.projectAdded.emit(); this.closeModal(); },
      error: (err: any) => {
        if (err?.status === 200) { this.toastSrv.showToast('Remark saved successfully', 'success'); this.projectAdded.emit(); this.closeModal(); }
        else { this.toastSrv.showToast('Error saving remark', 'error'); }
        this.isLoading.set(false);
      },
    });
  }

  // ─── Submit CEO/CFO Remark ────────────────────────────

  submitCeoCfoRemark(): void {
    this.ceoForm.markAllAsTouched();

    if (this.ceoForm.invalid) {
      this.toastSrv.showToast('Please fill all required fields', 'warning');
      return;
    }

    const regNos = this.getSelectedRegNos();
    if (regNos.length === 0) { this.toastSrv.showToast('No valid Reg Nos selected', 'warning'); return; }

    const f = this.ceoForm.value;
    const payload = {
      year: String(f.completionYear),
      month: String(f.completionMonth),
      remarkFor: String(f.remarkFor),
      custRegNumbers: regNos.join(','),
      reviewedRemarkByCEO_CFO: f.reviewedRemarkByCEO_CFO,
      actorEmployeeId: String(this.authSrv.userDetails?.employeeId || ''),
    };

    this.isLoading.set(true);
    this.remarksSrv._reviewUpsertRemarks(payload).subscribe({
      next: () => { this.toastSrv.showToast('CEO/CFO Remark saved successfully', 'success'); this.isLoading.set(false); this.projectAdded.emit(); this.closeModal(); },
      error: (err: any) => {
        if (err?.status === 200) { this.toastSrv.showToast('CEO/CFO Remark saved successfully', 'success'); this.projectAdded.emit(); this.closeModal(); }
        else { this.toastSrv.showToast('Error saving CEO/CFO remark', 'error'); }
        this.isLoading.set(false);
      },
    });
  }

  // ─── Excel Export / Upload ────────────────────────────

  exportRemarksExcel(): void {
    this.isDownloadRemarksExcel.set(true);
    
    const exportPayload = {
      DashboardType: this.filterParams?.DashboardType || 'Inventory',
      SummaryType: this.filterParams?.SummaryType || 'PanIndia',
      State: this.filterParams?.State || '', 
      SelectedDate: this.filterParams?.SelectedDate || '', 
      Ageing: this.filterParams?.Ageing || '', 
      searchTerm: this.filterParams?.searchTerm || this.filterParams?.SearchTerm || ''
    }; 

    // ─── LOGGING ───
    console.log('🚀 [Component] Export Triggered. Raw Filter Params:', this.filterParams);
    console.log('📦 [Component] Prepared Payload for Service:', exportPayload);
    // ───────────────

    this.remarksSrv._exportRemarksExcel(exportPayload).subscribe({
      next: (blob) => {
        const a = document.createElement('a');
        a.href = window.URL.createObjectURL(blob);
        
        // Dynamic file name
        const locationName = exportPayload.State ? exportPayload.State : exportPayload.SummaryType;
        const typeName = exportPayload.DashboardType.toLowerCase() === 'cogs' ? 'COGs' : 'Invoice';
        a.download = `Remarks_${typeName}_${locationName}_${Date.now()}.xlsx`; 
        
        a.click();
        this.isDownloadRemarksExcel.set(false);
      },
      error: (err) => { 
        console.error('❌ [Component] Export failed:', err);
        this.isDownloadRemarksExcel.set(false); 
        this.toastSrv.showToast('Export failed', 'error'); 
      },
    });
  }

  onFileSelected(event: any): void { this.selectedFile.set(event.target.files[0]); }

  uploadRemarksExcel(): void {
    if (!this.selectedFile()) { this.toastSrv.showToast('Please select a file', 'warning'); return; }
    this.isLoading.set(true);
    const fd = new FormData();
    fd.append('file', this.selectedFile()!);
    fd.append('EmployeeId', String(this.authSrv.userDetails?.employeeId || ''));
    this.remarksSrv._uploadRemarksExcel(fd).subscribe({
      next: () => { this.toastSrv.showToast('Uploaded successfully', 'success'); this.isLoading.set(false); this.projectAdded.emit(); },
      error: (err) => { this.toastSrv.showToast(err?.error?.message || 'Upload failed', 'error'); this.isLoading.set(false); },
    });
  }
}