import { Component, computed, inject, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BreadcrumbsComponent } from '../../../../common/breadcrumbs/breadcrumbs.component';
import { UrUsersLogsService } from '../../../../../shared/services/unrecognisedInvoice/ur-users-logs.service';
import { AuthService } from '../../../../../shared/services/common/auth.service';
import { ToastService } from '../../../../../shared/services/componentServices/toast.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-ur-users-logs',
  standalone: true,
  imports: [CommonModule, BreadcrumbsComponent, ReactiveFormsModule],
  templateUrl: './ur-users-logs.component.html',
  styleUrl: './ur-users-logs.component.scss',
})
export class UrUsersLogsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private userSrv = inject(UrUsersLogsService);
  public authSrv = inject(AuthService);
  private toastSrv = inject(ToastService);

  users = signal<any[]>([]);
  isLoading = signal(true);


  currentPage = signal(1);
  pageSize = signal(10);
  totalRecords = signal(0);
  totalPages = signal(0);

  visiblePages = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();

    if (total <= 5) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    let start = Math.max(current - 2, 1);
    let end = Math.min(start + 4, total);

    if (end - start < 4) {
      start = Math.max(end - 4, 1);
    }

    const pages: number[] = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  });

  isEditMode = signal(false); // Flag to check if the modal is in edit mode

  showModal = signal(false);
  roles = signal<any[]>([]);
  zones = signal<any[]>([]);
  regions = signal<any[]>([]);
  areas = signal<any[]>([]);
  reportingManagers = signal<any[]>([]);
  breadCrumbItems = signal([
    { label: 'Reports' },
    { label: 'User Management' },
  ]);

  showDeleteConfirm = signal(false);
  deleteTargetUser = signal<any | null>(null);

  deleteUserName = signal('');

  userForm!: FormGroup;
  currentProjectName = signal('');

  ngOnInit(): void {
    this.initForm();
    this.loadDropdowns();
    this.loadUsers();
  }

  loadUsers(): void {

  this.isLoading.set(true);

  const projId =
    this.userForm?.get('projectTypeId')?.value ||
    this.authSrv.userDetails?.projectTypeId ||
    3;

  const payload = {
    projectTypeId: String(projId),
    page: String(this.currentPage()),
    pageSize: String(this.pageSize()),
  };

  this.userSrv.showUsersByProjectType(payload)
    .pipe(finalize(() => this.isLoading.set(false)))
    .subscribe({
      next: (res) => {

        console.log("API RESPONSE:", res);

        const list = Array.isArray(res)
          ? res
          : (res?.Data ?? res?.data ?? res?.Items ?? []);

        const totalCount =
          res?.TotalCount ??
          res?.totalCount ??
          res?.Count ??
          res?.count ??
          list.length;

        this.users.set(list);

        this.totalRecords.set(Number(totalCount) || 0);

        this.totalPages.set(
          Math.ceil((Number(totalCount) || 0) / this.pageSize())
        );

      },
      error: () => {
        this.toastSrv.showToast('Failed to load users', 'error');
      }
    });
}

  getEmployeeName(u: any): string {
    return `${u?.FirstName ?? ''} ${u?.LastName ?? ''}`.trim() || '-';
  }

  getActiveBadge(u: any): { text: string; cls: string; icon: string } {
    const isActive = String(u?.ActiveStatus ?? '').toUpperCase() === 'Y';
    return isActive
      ? {
          text: 'Active',
          cls: 'bg-success-subtle text-success',
          icon: 'bi-check-circle',
        }
      : {
          text: 'Inactive',
          cls: 'bg-danger-subtle text-danger',
          icon: 'bi-x-circle',
        };
  }

  getAccessBadge(u: any): { text: string; cls: string; icon: string } {
    const locked = String(u?.LockStatus ?? '') === '1'; // your response uses "1"/"0"
    return locked
      ? {
          text: 'Locked',
          cls: 'bg-danger-subtle text-danger',
          icon: 'bi-lock-fill',
        }
      : {
          text: 'Unlocked',
          cls: 'bg-success-subtle text-success',
          icon: 'bi-unlock-fill',
        };
  }

  initForm() {
    const user = this.authSrv.userDetails;
    const defaultProjId = user?.projectTypeId || 3;

    // Per your payload, createdBy is usually the Employee ID string (e.g. "1234")
    const defaultCreatedBy = user?.employeeId || '1234';
    this.currentProjectName.set(user?.projectTypeName || 'Unknown Project');

    this.userForm = this.fb.group({
      userPK: [''],
      employeeId: ['', Validators.required],
      projectTypeId: [defaultProjId, Validators.required],

      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      password: ['', [Validators.required, Validators.minLength(4)]],

      designation: ['', Validators.required],
      roleId: ['', Validators.required],
      zone: ['', Validators.required],
      zoneName: [''],
      region: ['', Validators.required],
      regionName: [''],
      area: ['', Validators.required],
      areaName: [''],

      reportingManagerId: ['', Validators.required],

      createdBy: [defaultCreatedBy, Validators.required],
      modifiedBy: [defaultCreatedBy], // ✅ add this
      activeStatus: [true, Validators.required],
      lockStatus: [false, Validators.required],
    });
  }

  loadDropdowns() {
    this.userSrv.getRoles().subscribe({ next: (res) => this.roles.set(res) });
    this.userSrv.getZones().subscribe({ next: (res) => this.zones.set(res) });
    this.userSrv.getReportingManagers().subscribe({
      next: (res: any[]) => {
        const cleanList = (res || []).filter(
          (x) => (x?.Value ?? '').toString().trim() !== '',
        );
        this.reportingManagers.set(cleanList);
      },
      error: () => this.toastSrv.showToast('Failed to load managers', 'error'),
    });
  }

  onDesignationChange(e: any) {
    this.userForm.patchValue({ roleId: e.target.value });
  }

  onZoneChange(e: any) {
    const id = e.target.value;
    const name = e.target.options[e.target.selectedIndex].text;
    this.userForm.patchValue({
      zoneName: name,
      region: '',
      regionName: '',
      area: '',
      areaName: '',
    });
    this.regions.set([]);
    this.areas.set([]);
    if (id)
      this.userSrv.getRegions(id).subscribe((res) => this.regions.set(res));
  }

  onRegionChange(e: any) {
    const id = e.target.value;
    const name = e.target.options[e.target.selectedIndex].text;
    this.userForm.patchValue({ regionName: name, area: '', areaName: '' });
    this.areas.set([]);
    if (id) this.userSrv.getAreas(id).subscribe((res) => this.areas.set(res));
  }

  onAreaChange(e: any) {
    const name = e.target.options[e.target.selectedIndex].text;
    this.userForm.patchValue({ areaName: name });
  }

  onDeleteUser(user: any): void {
    const userPK = String(user.UserPK || user.userPK || '');

    if (!userPK) {
      this.toastSrv.showToast('User PK not found', 'warning');
      return;
    }

    this.deleteTargetUser.set(user);
    this.deleteUserName.set(this.getEmployeeName(user));
    this.showDeleteConfirm.set(true);
  }

  // Form submission logic
  onSubmit() {
    if (this.userForm.valid) {
      const payload = this.userForm.value;

      if (this.isEditMode()) {
  const formValue = this.userForm.value;

  const updatePayload = {
    UserPK: String(formValue.userPK),
    Password: String(formValue.password ?? ''),
    FirstName: String(formValue.firstName ?? ''),
    LastName: String(formValue.lastName ?? ''),
    Email: String(formValue.email ?? ''),
    Mobile: String(formValue.mobile ?? ''),
    Designation: String(formValue.designation ?? ''),
    RoleId: String(formValue.roleId ?? ''),
    ActiveStatus: String(formValue.activeStatus),
    ReportingManagerId: String(formValue.reportingManagerId ?? ''),
    EmployeeId: String(formValue.employeeId ?? ''),
    LockStatus: String(formValue.lockStatus),
    ModifiedBy: String(this.authSrv.userDetails?.employeeId || formValue.modifiedBy || ''),
    ProjectTypeId: String(formValue.projectTypeId ?? ''),
    Zone: String(formValue.zone ?? ''),
    ZoneName: String(formValue.zoneName ?? ''),
    Region: String(formValue.region ?? ''),
    RegionName: String(formValue.regionName ?? ''),
    Area: String(formValue.area ?? ''),
    AreaName: String(formValue.areaName ?? '')
  };

  this.userSrv.updateUser(updatePayload).subscribe({
    next: (res) => {
      this.toastSrv.showToast('User updated successfully', 'success');
      this.closeModal();
      this.loadUsers();
    },
    error: (err) => {
      console.error('Update Error:', err);
      this.toastSrv.showToast('Failed to update user', 'error');
    }
  });
} else {
        // Call the create API
        this.userSrv.addUser(payload).subscribe({
          next: (res) => {
            this.toastSrv.showToast(
              res.Message || 'User Registered Successfully',
              'success',
            );
            this.closeModal();
            this.currentPage.set(1);
            this.loadUsers();
          },
          error: (err) => {
            this.toastSrv.showToast('Registration Failed', 'error');
          },
        });
      }
    } else {
      this.toastSrv.showToast('Please fill all required fields.', 'warning');
      this.userForm.markAllAsTouched();
    }
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
    this.loadUsers();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onPageSizeChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const newPageSize = parseInt(target.value, 10);

    console.log(`Changing page size from ${this.pageSize()} to ${newPageSize}`);

    this.pageSize.set(newPageSize);
    this.currentPage.set(1);
    this.loadUsers();
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

  getStartRecord(): number {
  return this.totalRecords() === 0 ? 0 : (this.currentPage() - 1) * this.pageSize() + 1;
}

getEndRecord(): number {
  return Math.min(this.currentPage() * this.pageSize(), this.totalRecords());
}

  closeDeleteConfirm(): void {
    this.showDeleteConfirm.set(false);
    this.deleteTargetUser.set(null);
    this.deleteUserName.set('');
  }

  confirmDeleteUser(): void {
    const user = this.deleteTargetUser();

    if (!user) {
      this.closeDeleteConfirm();
      return;
    }

    const userPK = String(user.UserPK || user.userPK || '');

    if (!userPK) {
      this.toastSrv.showToast('User PK not found', 'warning');
      this.closeDeleteConfirm();
      return;
    }

    this.userSrv.deleteUser({ userPK }).subscribe({
      next: () => {
        this.toastSrv.showToast('User deleted successfully', 'success');

        this.users.set(
          this.users().filter((u) => String(u.UserPK || u.userPK) !== userPK),
        );

        this.closeDeleteConfirm();
        this.loadUsers();
      },
      error: () => {
        this.toastSrv.showToast('Failed to delete user', 'error');
        this.closeDeleteConfirm();
      },
    });
  }

  // Open the edit modal and set the flag to true (edit mode)
  openEditModal(user: any): void {
    this.isEditMode.set(true); // Set to edit mode

    // Set form values with the existing user data
    this.userForm.patchValue({
      userPK: user.UserPK,
      employeeId: user.EmployeeId,
      firstName: user.FirstName,
      lastName: user.LastName,
      email: user.Email,
      mobile: user.Mobile,
      designation: user.Designation,
      roleId: user.RoleId,
      reportingManagerId: user.ReportingManagerId,
      zone: user.Zone,
      zoneName: user.ZoneName,
      region: user.Region,
      regionName: user.RegionName,
      area: user.Area,
      areaName: user.AreaName,
      activeStatus: user.ActiveStatus === 'Y',
      lockStatus: user.LockStatus === '1',
      projectTypeId: user.ProjectTypeId,
      modifiedBy: this.authSrv.userDetails?.employeeId || '1234',
    });

    // Open the modal
    this.showModal.set(true);
  }

  // Open the modal for creating a new user and set the flag to false (create mode)
  openAddRemarkModal() {
    this.isEditMode.set(false); // Set to create mode
    this.initForm(); // Reset the form for create mode
    this.showModal.set(true);
  }
  closeModal() {
    this.showModal.set(false);
  }
}
