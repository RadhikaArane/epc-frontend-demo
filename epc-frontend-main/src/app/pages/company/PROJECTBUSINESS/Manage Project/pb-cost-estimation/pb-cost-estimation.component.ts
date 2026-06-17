import {
  Component, inject, signal, OnInit, OnDestroy,
  ViewChild, ElementRef, HostListener, computed
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { BreadcrumbsComponent } from '../../../../common/breadcrumbs/breadcrumbs.component';
import { breadCrumbItems } from '../../../../../shared/models/models';
import { ToastService } from '../../../../../shared/services/componentServices/toast.service';
import { JwtService } from '../../../../../shared/services/common/jwt.service';
import { AuditNodalAgency, AuditProject, ProjectSummaryAuditResponse } from '../../../../../shared/models/projectBusiness-models/projectCostEstimation';
import { PbCostEstimationService } from '../../../../../shared/services/projectBusiness/pb-cost-estimation.service';
 
declare var bootstrap: any;
 
const MONTHS = [
  { label: 'January', value: 1 },
  { label: 'February', value: 2 },
  { label: 'March', value: 3 },
  { label: 'April', value: 4 },
  { label: 'May', value: 5 },
  { label: 'June', value: 6 },
  { label: 'July', value: 7 },
  { label: 'August', value: 8 },
  { label: 'September', value: 9 },
  { label: 'October', value: 10 },
  { label: 'November', value: 11 },
  { label: 'December', value: 12 },
];

@Component({
  selector: 'app-pb-cost-estimation',
  standalone: true,
  imports: [CommonModule, BreadcrumbsComponent],
  templateUrl: './pb-cost-estimation.component.html',
  styles: []
})
export class PbCostEstimationComponent implements OnInit, OnDestroy {

  // ==================== Inject ====================
  private router = inject(Router);
  private toastSrv = inject(ToastService);
  private projectCostEstimationSrv = inject(PbCostEstimationService);
  private jwtSrv = inject(JwtService);

  breadCrumbItems = signal<breadCrumbItems[]>([{ label: 'Project Management' }]);

  // ==================== Filter ====================
  months = MONTHS;
  currentYear = new Date().getFullYear();
  years: number[] = Array.from({ length: 6 }, (_, i) => this.currentYear - i); // last 6 years

  selectedMonth = signal<number>(new Date().getMonth() + 1);
  selectedYear = signal<number>(this.currentYear);

  // ==================== Data ====================
  isLoading = signal<boolean>(false);
  nodalAgencies = signal<AuditNodalAgency[]>([]);
  hasData = computed(() => this.nodalAgencies().length > 0);

  // ==================== FTM Export Modal ====================
  @ViewChild('ExportFTMModal') ExportFTMModal!: ElementRef;
  exportProjectId = signal<string>('');
  exportProjectName = signal<string>('');
  isExporting = signal<boolean>(false);
  exportError = signal<string>('');
  isDownloading = signal(false)

  // ==================== addding ftm docnt numbr ====================
  @ViewChild('DocNoModal') DocNoModal!: ElementRef;
  docNoProjectId = signal<string>('');
  docNoProjectName = signal<string>('');
  docNoInput = signal<string>('');
  isSavingDocNo = signal<boolean>(false);
  docNoError = signal<string>('');

  private destroy$ = new Subject<void>();
  Math: any;

  // ==================== Lifecycle ====================

  ngOnInit(): void {
    this.loadData();
  }

  // ==================== Load ====================

  loadData(): void {
    this.isLoading.set(true);
    this.nodalAgencies.set([]);

    this.projectCostEstimationSrv._getProjectSummaryAudit(this.selectedMonth(), this.selectedYear())
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: ProjectSummaryAuditResponse) => {
          if (res?.StatusCode === 200 && res?.result?.NodalAgencies) {
            this.nodalAgencies.set(res.result.NodalAgencies);
          } else {
            this.nodalAgencies.set([]);
          }
          this.isLoading.set(false);
        },
        error: () => {
          this.toastSrv.showToast('Failed to load project summary', 'error');
          this.isLoading.set(false);
        }
      });
  }

  onFilterChange(): void {
    this.loadData();
  }

  // ==================== Rowspan helper ====================

  /** Rowspan for agency cell = projects count + 1 (for totals row) */
  agencyRowspan(agency: AuditNodalAgency): number {
    return agency.Projects.length + 1;
  }

  // ==================== Cost Estimation Navigation ====================

  viewCostEstimation(projectId: string): void {
    const token = encodeURIComponent(this.jwtSrv.encrypt(projectId));
    this.router.navigate(['/pbViewCostEstimationComponent'], { queryParams: { token } });
  } 

  // ==================== FTM Export ====================

  openExportModal(project: AuditProject): void {
    this.exportProjectId.set(project.ProjectId);
    this.exportProjectName.set(project.ProjectName);
    this.exportError.set('');

    const modal = new bootstrap.Modal(this.ExportFTMModal.nativeElement);
    modal.show();
  }

  closeExportModal(): void {
    bootstrap.Modal.getInstance(this.ExportFTMModal.nativeElement)?.hide();
    this.exportError.set('');
  }

  exportFTMEntry(): void {
    if (!this.exportProjectId()) return;
    this.isExporting.set(true);
    this.exportError.set('');

    // Pass the currently selected filter month/year
    this.projectCostEstimationSrv._getFTMEntryExport(
      this.exportProjectId(),
      this.selectedMonth(),
      this.selectedYear()
    )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (blob: Blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          const monthLabel = this.months.find(m => m.value === this.selectedMonth())?.label || '';
          a.download = `FTM_Export_${this.exportProjectName()}_${monthLabel}_${this.selectedYear()}.xlsx`;
          a.click();
          window.URL.revokeObjectURL(url);
          this.isExporting.set(false);
          this.closeExportModal();
          this.toastSrv.showToast('FTM exported successfully', 'success');
        },
        error: () => {
          this.exportError.set('Export failed. Please try again.');
          this.isExporting.set(false);
        }
      });
  }

  // ==================== Add FTM Doc No ====================

  openFtmDocModal(project: AuditProject): void {
    this.docNoProjectId.set(project.ProjectId);
    this.docNoProjectName.set(project.ProjectName);
    this.docNoInput.set('');
    this.docNoError.set('');
    new bootstrap.Modal(this.DocNoModal.nativeElement).show();
  }

  closeDocNoModal(): void {
    bootstrap.Modal.getInstance(this.DocNoModal.nativeElement)?.hide();
  }

  saveDocNumber(): void {
    if (!this.docNoInput().trim()) {
      this.docNoError.set('Document number is required.');
      return;
    }
    this.isSavingDocNo.set(true);
    this.docNoError.set('');

    this.projectCostEstimationSrv._saveDocNumber(
      this.docNoProjectId(),
      this.selectedMonth(),
      this.selectedYear(),
      this.docNoInput().trim()
    ).pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.isSavingDocNo.set(false);
          this.toastSrv.showToast('Document number saved successfully', 'success');
          this.closeDocNoModal();
        },
        error: () => {
          this.isSavingDocNo.set(false);
          this.docNoError.set('Failed to save. Please try again.');
        }
      });
  }

  // ==================== Format Helpers ====================

  fmt(v: number | null | undefined | any): string {
    if (v == null || isNaN(v)) return '-';
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(v);
  }

  fmtPct(v: number | null | undefined): string {
    if (v == null || isNaN(v)) return '-';
    return Math.round(v) + '%'; 
  }

  fmtDate(d: string | null): string {
    if (!d) return '-';
    return new Date(d).toLocaleDateString('en-IN', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    });
  }

  marginClass(v: number): string {
    if (v > 0) return 'text-success fw-semibold';
    if (v < 0) return 'text-danger fw-semibold';
    return '';
  }

  selectedMonthLabel(): string {
    return this.months.find(m => m.value === this.selectedMonth())?.label || '';
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  //export ftm
  exportProjectSummaryAudit(): void {
    this.isDownloading.set(true);
    this.projectCostEstimationSrv._downLoadProjectSummaryAudit()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (blob: Blob) => {
          if (blob && blob.size > 0) {
            const date = new Date().toISOString().split('T')[0];
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `Project_Summary_Audit_${date}.xlsx`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            this.toastSrv.showToast('Export completed successfully!', 'success');
            this.isDownloading.set(false);
          } else {
            this.toastSrv.showToast('Export file is empty', 'error');
            this.isDownloading.set(false);
          }
        },
        error: () => {
          this.toastSrv.showToast('Failed to export projects', 'error');
          this.isDownloading.set(false);
        }
      });
  }
}