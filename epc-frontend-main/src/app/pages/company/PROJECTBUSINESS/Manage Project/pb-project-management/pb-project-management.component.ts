import { Component, ElementRef, signal, ViewChild, OnDestroy, inject, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { BreadcrumbsComponent } from '../../../../common/breadcrumbs/breadcrumbs.component';
import { breadCrumbItems } from '../../../../../shared/models/models';
import { ToastService } from '../../../../../shared/services/componentServices/toast.service';
import { AuthService } from '../../../../../shared/services/common/auth.service';
import { PbProjectManagementService } from '../../../../../shared/services/projectBusiness/pb-project-management.service';
import { GetAllProject } from '../../../../../shared/models/projectBusiness-models/projectmanagement';
import { ConfirmationDialogService } from '../../../../../shared/services/componentServices/confirmation-dialog.service';
import { Router } from '@angular/router';
import { JwtService } from '../../../../../shared/services/common/jwt.service';
import { PbNodalAgencyComponent } from "../pb-nodal-agency/pb-nodal-agency.component";
import { PbAddNewProjectComponent } from "../pb-add-new-project/pb-add-new-project.component";
import { PbAddNodalAgencyService } from '../../../../../shared/services/projectBusiness/pb-add-nodal-agency.service';
import { GetNodalAgency, NodalAgencyResponse } from '../../../../../shared/models/projectBusiness-models/pbNodalAgency';

declare var bootstrap: any;

@Component({
  selector: 'app-pb-project-management',
  standalone: true,
  imports: [BreadcrumbsComponent, CommonModule, PbNodalAgencyComponent, PbAddNewProjectComponent],
  templateUrl: './pb-project-management.component.html',
  styleUrl: './pb-project-management.component.scss'
})
export class PbProjectManagementComponent implements OnInit, OnDestroy {
  authSrv = inject(AuthService);
  toastSrv = inject(ToastService);
  projectSrv = inject(PbProjectManagementService);
  projectNodalSrv = inject(PbAddNodalAgencyService);
  jwtSrv = inject(JwtService);
  confirmationDialogSrv = inject(ConfirmationDialogService);
  router = inject(Router);

  breadCrumbItems = signal<breadCrumbItems[]>([{ label: 'Project Management' }]);

  // Main table
  isLoading = signal<boolean>(true);
  allProjects = signal<GetAllProject[]>([]);
  currentPage = signal<number>(1);
  pageSize = signal<number>(10);
  totalRecords = signal<number>(0);
  totalPages = signal<number>(0);

  // Project Filter
  projectDropdownList = signal<GetAllProject[]>([]);
  projectDropdownPage = signal<number>(1);
  projectDropdownPageSize = signal<number>(5);
  isProjectDropdownLoading = signal<boolean>(false);
  hasMoreProjects = signal<boolean>(true);
  selectedProjectId = signal<string | null>(null);
  selectedProjectName = signal<string>('All Projects');
  isProjectDropdownOpen = signal<boolean>(false);

  // Nodal Agency Filter
  nodalAgencyList = signal<GetNodalAgency[]>([]);
  selectedNodalAgencyId = signal<string | null>(null);
  selectedNodalAgencyName = signal<string>('All Nodal Agencies');
  isNodalDropdownOpen = signal<boolean>(false);
  isNodalDropdownLoading = signal<boolean>(false);

  @ViewChild("AddNewProject") AddProject!: ElementRef | undefined;
  @ViewChild("AddNodalAgency") AddNodalAgency!: ElementRef | undefined;

  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.loadProjects();
    this.loadProjectDropdown();
    this.loadNodalAgencies();
  }

  // ==================== CLICK OUTSIDE HANDLER ====================

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.project-filter-dropdown')) {
      this.isProjectDropdownOpen.set(false);
    }
    if (!target.closest('.nodal-filter-dropdown')) {
      this.isNodalDropdownOpen.set(false);
    }
  }

  // ==================== PROJECT FILTER DROPDOWN ====================

  toggleProjectDropdown(): void {
    const isOpening = !this.isProjectDropdownOpen();
    this.isProjectDropdownOpen.set(isOpening);

    if (isOpening) {
      this.projectDropdownPage.set(1);
      this.hasMoreProjects.set(true);
      this.projectDropdownList.set([]);
      this.loadProjectDropdown();
    }
  }

  loadProjectDropdown(): void {
    if (this.isProjectDropdownLoading()) return;

    this.isProjectDropdownLoading.set(true);

    this.projectSrv._getAllProjectsDropdown({
      page: this.projectDropdownPage(),
      pageSize: this.projectDropdownPageSize()
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          const newProjects = res.items || [];

          // Simply append new projects
          this.projectDropdownList.update(current => [...current, ...newProjects]);

          this.hasMoreProjects.set(this.projectDropdownPage() < (res.totalPages || 0));
          this.isProjectDropdownLoading.set(false);
        },
        error: (err: any) => {
          console.error("Error loading project dropdown:", err);
          this.toastSrv.showToast('Error loading projects', 'error');
          this.isProjectDropdownLoading.set(false);
        }
      });
  }

  onProjectDropdownScroll(event: Event): void {
    const element = event.target as HTMLElement;
    const atBottom = element.scrollHeight - element.scrollTop - element.clientHeight < 50;

    if (atBottom && this.hasMoreProjects() && !this.isProjectDropdownLoading()) {
      this.projectDropdownPage.update(p => p + 1);
      this.loadProjectDropdown();
    }
  }

  selectProject(project: GetAllProject | null): void {
    this.selectedProjectId.set(project?.ProjectId ?? null);
    this.selectedProjectName.set(project?.ProjectName ?? 'All Projects');
    this.isProjectDropdownOpen.set(false);
    this.currentPage.set(1);
    this.loadProjects();
  }

  // ==================== NODAL AGENCY FILTER DROPDOWN ====================

  toggleNodalDropdown(): void {
    this.isNodalDropdownOpen.update(state => !state);
  }

  loadNodalAgencies(): void {
    this.isNodalDropdownLoading.set(true);

    this.projectNodalSrv._getNodalAgencies()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: NodalAgencyResponse) => {
          this.nodalAgencyList.set(response.StatusCode === 200 && response.Data ? response.Data : []);
          this.isNodalDropdownLoading.set(false);
        },
        error: (error) => {
          console.error('Error loading nodal agencies:', error);
          this.toastSrv.showToast('Error loading nodal agencies', 'error');
          this.isNodalDropdownLoading.set(false);
        }
      });
  }

  selectNodalAgency(agency: GetNodalAgency | null): void {
    this.selectedNodalAgencyId.set(agency?.NodalAgencyId ?? null);
    this.selectedNodalAgencyName.set(agency?.NodalAgencyName ?? 'All Nodal Agencies');
    this.isNodalDropdownOpen.set(false);
    this.currentPage.set(1);
    this.loadProjects();
  }

  // ==================== LOAD PROJECTS (WITH FILTERS) ====================

  private loadProjects(): void {
    this.isLoading.set(true);

    const params: any = {
      page: this.currentPage(),
      pageSize: this.pageSize()
    };

    if (this.selectedProjectId()) params.projectId = this.selectedProjectId();
    if (this.selectedNodalAgencyId()) params.nodalAgencyId = this.selectedNodalAgencyId();

    this.projectSrv._getAllProject(params)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          const items = res?.items ? res.items : res?.item ? [res.item] : [];
          this.allProjects.set(items);
          this.totalRecords.set(res.total || 0);
          this.totalPages.set(res.totalPages || 0);
          this.isLoading.set(false);
        },
        error: (err: any) => {
          console.error("Error loading projects:", err);
          this.toastSrv.showToast('Error loading projects', 'error');
          this.isLoading.set(false);
          this.allProjects.set([]);
        }
      });
  }

  // ==================== PAGINATION ====================

  onPageChange(newPage: number): void {
    if (newPage < 1 || newPage > this.totalPages() || newPage === this.currentPage()) return;
    this.currentPage.set(newPage);
    this.loadProjects();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onPageSizeChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.pageSize.set(parseInt(target.value, 10));
    this.currentPage.set(1);
    this.loadProjects();
  }

  getVisiblePages(): number[] {
    const current = this.currentPage();
    const total = this.totalPages();
    const pages: number[] = [];
    if (total === 0) return pages;
    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i);
      return pages;
    }
    pages.push(1);
    let rangeStart = Math.max(2, current - 1);
    let rangeEnd = Math.min(total - 1, current + 1);
    if (rangeStart > 2) pages.push(-1);
    for (let i = rangeStart; i <= rangeEnd; i++) pages.push(i);
    if (rangeEnd < total - 1) pages.push(-2);
    pages.push(total);
    return pages;
  }

  getSerialNumber(index: number): number {
    return (this.currentPage() - 1) * this.pageSize() + index + 1;
  }

  getStartRecord(): number {
    return this.totalRecords() === 0 ? 0 : (this.currentPage() - 1) * this.pageSize() + 1;
  }

  getEndRecord(): number {
    return Math.min(this.currentPage() * this.pageSize(), this.totalRecords());
  }

  // ==================== DELETE PROJECT ====================

  async openDeleteDialog(projectId: string): Promise<void> {
    const confirmed = await this.confirmationDialogSrv.showConfirm(
      'Do you want to delete this Project?',
      'Delete Confirmation'
    );
    if (confirmed) this.deleteProject(projectId);
  }

  deleteProject(projectId: string): void {
    this.projectSrv._deleteProject(projectId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.toastSrv.showToast('Project deleted successfully', 'success');
          // if (this.allProjects().length === 1 && this.currentPage() > 1) {
          //   this.currentPage.update(p => p - 1);
          // }
          this.loadProjects();
        },
        error: (error) => {
          console.error('Error deleting project:', error);
          this.toastSrv.showToast('Failed to delete project', 'error');
        }
      });
  }

  // ==================== MODALS ====================

  OpenModal(): void {
    if (this.AddProject) {
      const modal = new bootstrap.Modal(this.AddProject.nativeElement);
      modal.show();
    }
  }

  CloseModal(): void {
    if (this.AddProject) {
      const modal = bootstrap.Modal.getInstance(this.AddProject.nativeElement);
      if (modal) modal.hide();
    }
  }

  onProjectAdded(): void {
    this.currentPage.set(1);
    this.loadProjects();
    this.projectDropdownPage.set(1);
    this.projectDropdownList.set([]);
    this.loadProjectDropdown();
    this.loadNodalAgencies();
    this.CloseModal();
  }

  onModalClosed(): void {
    this.CloseModal();
  }

  OpenNodalModal(): void {
    if (this.AddNodalAgency) {
      const modal = new bootstrap.Modal(this.AddNodalAgency.nativeElement);
      modal.show();
    }
  }

  CloseNodalModal(): void {
    if (this.AddNodalAgency) {
      const modal = bootstrap.Modal.getInstance(this.AddNodalAgency.nativeElement);
      if (modal) modal.hide();
    }
  }

  // ==================== NAVIGATION ====================

  viewAddCostEstimation(projectId: string): void {
    const token = encodeURIComponent(this.jwtSrv.encrypt(projectId));
    this.router.navigate(['/pbAddCostEstimationComponent'], { queryParams: { token } });
  }
  
  // ==================== View Cost Estimation Navigation ====================

  viewCostEstimation(projectId: string): void {
    const token = encodeURIComponent(this.jwtSrv.encrypt(projectId));
    this.router.navigate(['/pbViewCostEstimationComponent'], { queryParams: { token } });
  }

  // ====================0 Edit Cost Estimation Navigation ====================
  viewEditCostEstimation(projectId: string): void {
    const token = encodeURIComponent(this.jwtSrv.encrypt(projectId));
    this.router.navigate(['/pbEditCostEstimationComponent'], { queryParams: { token } });
  }

  // ==================== EXPORT ====================

  exportProjects(): void {
    this.projectSrv._getAllProjectExcel()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (blob: Blob) => {
          if (blob && blob.size > 0) {
            const date = new Date().toISOString().split('T')[0];
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `Projects_${date}.xlsx`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            this.toastSrv.showToast('Export completed successfully!', 'success');
          } else {
            this.toastSrv.showToast('Export file is empty', 'error');
          }
        },
        error: () => {
          this.toastSrv.showToast('Failed to export projects', 'error');
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}