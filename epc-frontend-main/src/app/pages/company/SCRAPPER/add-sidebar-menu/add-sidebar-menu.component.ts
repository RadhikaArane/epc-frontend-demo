import { CommonModule } from '@angular/common';
import { Component, HostListener, inject, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { breadCrumbItems } from '../../../../shared/models/models';
import { AuthService } from '../../../../shared/services/common/auth.service';
import { ToastService } from '../../../../shared/services/componentServices/toast.service';
import { ScrAddSidebarMenuService } from '../../../../shared/services/scrapper/scr-add-sidebar-menu.service';
import { BreadcrumbsComponent } from '../../../common/breadcrumbs/breadcrumbs.component';

@Component({
  selector: 'app-add-sidebar-menu',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BreadcrumbsComponent],
  templateUrl: './add-sidebar-menu.component.html',
  styleUrl: './add-sidebar-menu.component.scss',
})
export class AddSidebarMenuComponent implements OnInit {
  private fb = inject(FormBuilder);

  breadCrumbItems = signal<breadCrumbItems[]>([]);
  authSrv = inject(AuthService);
  toastSrv = inject(ToastService);
  scrAddSidebarSrv = inject(ScrAddSidebarMenuService);

  projectTypes = signal<{ projectTypeId: number; projectTypeName: string }[]>([]);
selectedProjectTypes = signal<{ projectTypeId: number; projectTypeName: string }[]>([]);
showProjectTypeDropdown = signal(false);

roles = signal<{ roleId: number; roleName: string }[]>([]);
selectedRoles = signal<{ roleId: number; roleName: string }[]>([]);
showRoleDropdown = signal(false);

selectedSubProjectTypes = signal<{ projectTypeId: number; projectTypeName: string }[]>([]);
showSubProjectTypeDropdown = signal(false);

selectedSubRoles = signal<{ roleId: number; roleName: string }[]>([]);
showSubRoleDropdown = signal(false);

isUpdateMenuSaving = signal(false);
updateMenuForm!: FormGroup;

isDeleteMenuSaving = signal(false);
deleteMenuForm!: FormGroup;

isUpdateSubMenuSaving = signal(false);
updateSubMenuForm!: FormGroup;

isDeleteSubMenuSaving = signal(false);
deleteSubMenuForm!: FormGroup;

// Update Menu dropdown signals
selectedUpdateMenuProjectTypes = signal<{ projectTypeId: number; projectTypeName: string }[]>([]);
showUpdateMenuProjectTypeDropdown = signal(false);

selectedUpdateMenuRoles = signal<{ roleId: number; roleName: string }[]>([]);
showUpdateMenuRoleDropdown = signal(false);

// Update Sub Menu dropdown signals
selectedUpdateSubMenuProjectTypes = signal<{ projectTypeId: number; projectTypeName: string }[]>([]);
showUpdateSubMenuProjectTypeDropdown = signal(false);

selectedUpdateSubMenuRoles = signal<{ roleId: number; roleName: string }[]>([]);
showUpdateSubMenuRoleDropdown = signal(false);

  
  isSaving = signal(false);
  menuForm!: FormGroup;

  isSubMenuSaving = signal(false);
  subMenuForm!: FormGroup;

  constructor() {
  this.breadCrumbItems.set([
    { label: 'Dashboard' },
    { label: 'Add Sidebar Menu' }
  ]);

  this.initForm();
  this.initSubMenuForm();
  this.initUpdateMenuForm();
  this.initDeleteMenuForm();
  this.initUpdateSubMenuForm();
  this.initDeleteSubMenuForm();
}

  ngOnInit(): void {
  this.loadProjectTypes();
  this.loadRoles();
}

loadProjectTypes(): void {
  this.scrAddSidebarSrv.getProjectTypes().subscribe({
    next: (res) => {
      const list = Array.isArray(res) ? res : (res?.Data ?? []);

      this.projectTypes.set(
        (list || []).map((x: any) => ({
          projectTypeId: Number(x.ProjectTypeId),
          projectTypeName: String(x.ProjectTypeName)
        }))
      );
    },
    error: (err) => {
      console.error('Get Project Types Error:', err);
      this.toastSrv.showToast('Failed to load project types', 'error');
    }
  });
}

loadRoles(): void {
  this.scrAddSidebarSrv.getRoles().subscribe({
    next: (res) => {
      const list = Array.isArray(res) ? res : (res?.Data ?? []);

      this.roles.set(
        (list || []).map((x: any) => ({
          roleId: Number(x.RoleId),
          roleName: String(x.RoleName)
        }))
      );
    },
    error: (err) => {
      console.error('Get Roles Error:', err);
      this.toastSrv.showToast('Failed to load roles', 'error');
    }
  });
}



toggleProjectTypeDropdown(): void {
  this.showProjectTypeDropdown.set(!this.showProjectTypeDropdown());
}

isProjectTypeSelected(projectTypeId: number): boolean {
  return this.selectedProjectTypes().some(x => x.projectTypeId === projectTypeId);
}

onProjectTypeSelect(item: { projectTypeId: number; projectTypeName: string }): void {
  const current = [...this.selectedProjectTypes()];
  const index = current.findIndex(x => x.projectTypeId === item.projectTypeId);

  if (index > -1) {
    current.splice(index, 1);
  } else {
    current.push(item);
  }

  this.selectedProjectTypes.set(current);
}

toggleRoleDropdown(): void {
  this.showRoleDropdown.set(!this.showRoleDropdown());
}

isRoleSelected(roleId: number): boolean {
  return this.selectedRoles().some(x => x.roleId === roleId);
}

onRoleSelect(item: { roleId: number; roleName: string }): void {
  const current = [...this.selectedRoles()];
  const index = current.findIndex(x => x.roleId === item.roleId);

  if (index > -1) {
    current.splice(index, 1);
  } else {
    current.push(item);
  }

  this.selectedRoles.set(current);
}

removeSelectedRole(roleId: number): void {
  this.selectedRoles.set(
    this.selectedRoles().filter(x => x.roleId !== roleId)
  );
}

private getSelectedRoleIds(): number[] {
  return this.selectedRoles().map(x => x.roleId);
}

removeSelectedProjectType(projectTypeId: number): void {
  this.selectedProjectTypes.set(
    this.selectedProjectTypes().filter(x => x.projectTypeId !== projectTypeId)
  );
}

getSelectedProjectTypeNames(): string {
  return this.selectedProjectTypes().map(x => x.projectTypeName).join(', ');
}

private getSelectedProjectTypeIds(): number[] {
  return this.selectedProjectTypes().map(x => x.projectTypeId);
}

@HostListener('document:click', ['$event'])
onDocumentClick(event: Event): void {
  const target = event.target as HTMLElement;

  if (!target.closest('.project-type-dropdown-wrapper')) {
    this.showProjectTypeDropdown.set(false);
  }

  if (!target.closest('.role-dropdown-wrapper')) {
    this.showRoleDropdown.set(false);
  }

  if (!target.closest('.sub-project-type-dropdown-wrapper')) {
    this.showSubProjectTypeDropdown.set(false);
  }

  if (!target.closest('.sub-role-dropdown-wrapper')) {
    this.showSubRoleDropdown.set(false);
  }

  if (!target.closest('.update-menu-project-type-dropdown-wrapper')) {
  this.showUpdateMenuProjectTypeDropdown.set(false);
}

if (!target.closest('.update-menu-role-dropdown-wrapper')) {
  this.showUpdateMenuRoleDropdown.set(false);
}

if (!target.closest('.update-submenu-project-type-dropdown-wrapper')) {
  this.showUpdateSubMenuProjectTypeDropdown.set(false);
}

if (!target.closest('.update-submenu-role-dropdown-wrapper')) {
  this.showUpdateSubMenuRoleDropdown.set(false);
}
}

  initForm(): void {
    this.menuForm = this.fb.group({
      menuValue: ['', Validators.required],
      icon: ['', Validators.required],
      route: ['', Validators.required],
      hasSubRoute: ['false', Validators.required],
      hasSubRouteTwo: ['false', Validators.required],
      sortOrder: ['', Validators.required],
      projectTypeIds: [''],
      roleIds: [''],
    });
  }

  private toBracketArrayString(value: string): string {
    const cleaned = (value || '')
      .split(',')
      .map(x => x.trim())
      .filter(x => x !== '');

    return `[${cleaned.join(',')}]`;
  }

  onSubmit(): void {
    if (this.menuForm.invalid) {
      this.menuForm.markAllAsTouched();
      this.toastSrv.showToast('Please fill all required fields', 'warning');
      return;
    }

    if (this.selectedProjectTypes().length === 0) {
  this.toastSrv.showToast('Please select at least one project type', 'warning');
  return;
}

if (this.selectedRoles().length === 0) {
  this.toastSrv.showToast('Please select at least one role', 'warning');
  return;
}

    const formValue = this.menuForm.value;

    const payload = {
  menuValue: String(formValue.menuValue ?? '').trim(),
  icon: String(formValue.icon ?? '').trim(),
  route: String(formValue.route ?? '').trim(),
  hasSubRoute: String(formValue.hasSubRoute ?? 'false'),
  hasSubRouteTwo: String(formValue.hasSubRouteTwo ?? 'false'),
  sortOrder: String(formValue.sortOrder ?? ''),
  projectTypeIds: this.getSelectedProjectTypeIds(),
  roleIds: this.getSelectedRoleIds(),
};

    console.log('Create Sidebar Menu Payload:', payload);

    this.isSaving.set(true);

    this.scrAddSidebarSrv.createSidebarMenu(payload).subscribe({
      next: (res) => {
        console.log('Create Menu Response:', res);
        this.toastSrv.showToast('Sidebar menu created successfully', 'success');
        this.isSaving.set(false);
        this.resetForm();
      },
      error: (err) => {
        console.error('Create Sidebar Menu Error:', err);
        this.toastSrv.showToast('Failed to create sidebar menu', 'error');
        this.isSaving.set(false);
      },
    });
  }

  resetForm(): void {
    this.menuForm.reset({
      menuValue: '',
      icon: '',
      route: '',
      hasSubRoute: 'false',
      hasSubRouteTwo: 'false',
      sortOrder: '',
      projectTypeIds: '',
      roleIds: '',
    });
    this.selectedProjectTypes.set([]);
  this.selectedRoles.set([]);

  this.showProjectTypeDropdown.set(false);
  this.showRoleDropdown.set(false);
  }

  toggleSubProjectTypeDropdown(): void {
  this.showSubProjectTypeDropdown.set(!this.showSubProjectTypeDropdown());
}

isSubProjectTypeSelected(projectTypeId: number): boolean {
  return this.selectedSubProjectTypes().some(x => x.projectTypeId === projectTypeId);
}

onSubProjectTypeSelect(item: { projectTypeId: number; projectTypeName: string }): void {
  const current = [...this.selectedSubProjectTypes()];
  const index = current.findIndex(x => x.projectTypeId === item.projectTypeId);

  if (index > -1) {
    current.splice(index, 1);
  } else {
    current.push(item);
  }

  this.selectedSubProjectTypes.set(current);
}

removeSelectedSubProjectType(projectTypeId: number): void {
  this.selectedSubProjectTypes.set(
    this.selectedSubProjectTypes().filter(x => x.projectTypeId !== projectTypeId)
  );
}

private getSelectedSubProjectTypeIds(): number[] {
  return this.selectedSubProjectTypes().map(x => x.projectTypeId);
}

toggleSubRoleDropdown(): void {
  this.showSubRoleDropdown.set(!this.showSubRoleDropdown());
}

isSubRoleSelected(roleId: number): boolean {
  return this.selectedSubRoles().some(x => x.roleId === roleId);
}

onSubRoleSelect(item: { roleId: number; roleName: string }): void {
  const current = [...this.selectedSubRoles()];
  const index = current.findIndex(x => x.roleId === item.roleId);

  if (index > -1) {
    current.splice(index, 1);
  } else {
    current.push(item);
  }

  this.selectedSubRoles.set(current);
}

removeSelectedSubRole(roleId: number): void {
  this.selectedSubRoles.set(
    this.selectedSubRoles().filter(x => x.roleId !== roleId)
  );
}

private getSelectedSubRoleIds(): number[] {
  return this.selectedSubRoles().map(x => x.roleId);
}

  initSubMenuForm(): void {
  this.subMenuForm = this.fb.group({
    menuItemId: ['', Validators.required],
    menuValue: ['', Validators.required],
    route: ['', Validators.required],
    sortOrder: ['', Validators.required],
    projectTypeIds: [''],
    roleIds: [''],
  });
}

onSubMenuSubmit(): void {
  if (this.subMenuForm.invalid) {
    this.subMenuForm.markAllAsTouched();
    this.toastSrv.showToast('Please fill all sub menu required fields', 'warning');
    return;
  }

  if (this.selectedSubProjectTypes().length === 0) {
  this.toastSrv.showToast('Please select at least one sub menu project type', 'warning');
  return;
}

if (this.selectedSubRoles().length === 0) {
  this.toastSrv.showToast('Please select at least one sub menu role', 'warning');
  return;
}

  const formValue = this.subMenuForm.value;

  const payload = {
  menuItemId: Number(formValue.menuItemId ?? 0),
  menuValue: String(formValue.menuValue ?? '').trim(),
  route: String(formValue.route ?? '').trim(),
  sortOrder: String(formValue.sortOrder ?? '').trim(),
  projectTypeIds: this.getSelectedSubProjectTypeIds(),
  roleIds: this.getSelectedSubRoleIds(),
};

  console.log('Create Sub Menu Payload:', payload);

  this.isSubMenuSaving.set(true);

  this.scrAddSidebarSrv.createSubMenu(payload).subscribe({
    next: (res) => {
      console.log('Create Sub Menu Response:', res);
      this.toastSrv.showToast('Sub menu created successfully', 'success');
      this.isSubMenuSaving.set(false);
      this.resetSubMenuForm();
    },
    error: (err) => {
      console.error('Create Sub Menu Error:', err);
      this.toastSrv.showToast('Failed to create sub menu', 'error');
      this.isSubMenuSaving.set(false);
    }
  });
}

resetSubMenuForm(): void {
  this.subMenuForm.reset({
    menuItemId: '',
    menuValue: '',
    route: '',
    sortOrder: '',
    projectTypeIds: '',
    roleIds: '',
  });

  this.selectedSubProjectTypes.set([]);
  this.selectedSubRoles.set([]);
  this.showSubProjectTypeDropdown.set(false);
  this.showSubRoleDropdown.set(false);
}

initUpdateMenuForm(): void {
  this.updateMenuForm = this.fb.group({
    menuItemId: ['', Validators.required],
    menuValue: ['', Validators.required],
    icon: ['', Validators.required],
    sortOrder: ['', Validators.required],
    isActive: [true, Validators.required],
    projectTypeIds: [''],
    roleIds: [''],
  });
}

initDeleteMenuForm(): void {
  this.deleteMenuForm = this.fb.group({
    menuItemId: ['', Validators.required],
  });
}

initUpdateSubMenuForm(): void {
  this.updateSubMenuForm = this.fb.group({
    subMenuItemId: ['', Validators.required],
    menuValue: ['', Validators.required],
    route: ['', Validators.required],
    sortOrder: ['', Validators.required],
    isActive: [true, Validators.required],
    projectTypeIds: [''],
    roleIds: [''],
  });
}

initDeleteSubMenuForm(): void {
  this.deleteSubMenuForm = this.fb.group({
    subMenuItemId: ['', Validators.required],
  });
}

toggleUpdateMenuProjectTypeDropdown(): void {
  this.showUpdateMenuProjectTypeDropdown.set(!this.showUpdateMenuProjectTypeDropdown());
}

isUpdateMenuProjectTypeSelected(projectTypeId: number): boolean {
  return this.selectedUpdateMenuProjectTypes().some(x => x.projectTypeId === projectTypeId);
}

onUpdateMenuProjectTypeSelect(item: { projectTypeId: number; projectTypeName: string }): void {
  const current = [...this.selectedUpdateMenuProjectTypes()];
  const index = current.findIndex(x => x.projectTypeId === item.projectTypeId);

  if (index > -1) current.splice(index, 1);
  else current.push(item);

  this.selectedUpdateMenuProjectTypes.set(current);
}

removeSelectedUpdateMenuProjectType(projectTypeId: number): void {
  this.selectedUpdateMenuProjectTypes.set(
    this.selectedUpdateMenuProjectTypes().filter(x => x.projectTypeId !== projectTypeId)
  );
}

private getSelectedUpdateMenuProjectTypeIds(): number[] {
  return this.selectedUpdateMenuProjectTypes().map(x => x.projectTypeId);
}

toggleUpdateMenuRoleDropdown(): void {
  this.showUpdateMenuRoleDropdown.set(!this.showUpdateMenuRoleDropdown());
}

isUpdateMenuRoleSelected(roleId: number): boolean {
  return this.selectedUpdateMenuRoles().some(x => x.roleId === roleId);
}

onUpdateMenuRoleSelect(item: { roleId: number; roleName: string }): void {
  const current = [...this.selectedUpdateMenuRoles()];
  const index = current.findIndex(x => x.roleId === item.roleId);

  if (index > -1) current.splice(index, 1);
  else current.push(item);

  this.selectedUpdateMenuRoles.set(current);
}

removeSelectedUpdateMenuRole(roleId: number): void {
  this.selectedUpdateMenuRoles.set(
    this.selectedUpdateMenuRoles().filter(x => x.roleId !== roleId)
  );
}

private getSelectedUpdateMenuRoleIds(): number[] {
  return this.selectedUpdateMenuRoles().map(x => x.roleId);
}

toggleUpdateSubMenuProjectTypeDropdown(): void {
  this.showUpdateSubMenuProjectTypeDropdown.set(!this.showUpdateSubMenuProjectTypeDropdown());
}

isUpdateSubMenuProjectTypeSelected(projectTypeId: number): boolean {
  return this.selectedUpdateSubMenuProjectTypes().some(x => x.projectTypeId === projectTypeId);
}

onUpdateSubMenuProjectTypeSelect(item: { projectTypeId: number; projectTypeName: string }): void {
  const current = [...this.selectedUpdateSubMenuProjectTypes()];
  const index = current.findIndex(x => x.projectTypeId === item.projectTypeId);

  if (index > -1) current.splice(index, 1);
  else current.push(item);

  this.selectedUpdateSubMenuProjectTypes.set(current);
}

removeSelectedUpdateSubMenuProjectType(projectTypeId: number): void {
  this.selectedUpdateSubMenuProjectTypes.set(
    this.selectedUpdateSubMenuProjectTypes().filter(x => x.projectTypeId !== projectTypeId)
  );
}

private getSelectedUpdateSubMenuProjectTypeIds(): number[] {
  return this.selectedUpdateSubMenuProjectTypes().map(x => x.projectTypeId);
}

toggleUpdateSubMenuRoleDropdown(): void {
  this.showUpdateSubMenuRoleDropdown.set(!this.showUpdateSubMenuRoleDropdown());
}

isUpdateSubMenuRoleSelected(roleId: number): boolean {
  return this.selectedUpdateSubMenuRoles().some(x => x.roleId === roleId);
}

onUpdateSubMenuRoleSelect(item: { roleId: number; roleName: string }): void {
  const current = [...this.selectedUpdateSubMenuRoles()];
  const index = current.findIndex(x => x.roleId === item.roleId);

  if (index > -1) current.splice(index, 1);
  else current.push(item);

  this.selectedUpdateSubMenuRoles.set(current);
}

removeSelectedUpdateSubMenuRole(roleId: number): void {
  this.selectedUpdateSubMenuRoles.set(
    this.selectedUpdateSubMenuRoles().filter(x => x.roleId !== roleId)
  );
}

private getSelectedUpdateSubMenuRoleIds(): number[] {
  return this.selectedUpdateSubMenuRoles().map(x => x.roleId);
}

onUpdateMenuSubmit(): void {
  if (this.updateMenuForm.invalid) {
    this.updateMenuForm.markAllAsTouched();
    this.toastSrv.showToast('Please fill all update menu required fields', 'warning');
    return;
  }

  if (this.selectedUpdateMenuProjectTypes().length === 0) {
    this.toastSrv.showToast('Please select at least one project type for update menu', 'warning');
    return;
  }

  if (this.selectedUpdateMenuRoles().length === 0) {
    this.toastSrv.showToast('Please select at least one role for update menu', 'warning');
    return;
  }

  const formValue = this.updateMenuForm.value;

  const payload = {
    menuItemId: Number(formValue.menuItemId ?? 0),
    menuValue: String(formValue.menuValue ?? '').trim(),
    icon: String(formValue.icon ?? '').trim(),
    sortOrder: Number(formValue.sortOrder ?? 0),
    isActive: !!formValue.isActive,
    projectTypeIds: this.getSelectedUpdateMenuProjectTypeIds(),
    roleIds: this.getSelectedUpdateMenuRoleIds(),
  };

  console.log('Update Menu Payload:', payload);

  this.isUpdateMenuSaving.set(true);

  this.scrAddSidebarSrv.updateMenu(payload).subscribe({
    next: (res) => {
      console.log('Update Menu Response:', res);
      this.toastSrv.showToast('Menu updated successfully', 'success');
      this.isUpdateMenuSaving.set(false);
      this.resetUpdateMenuForm();
    },
    error: (err) => {
      console.error('Update Menu Error:', err);
      this.toastSrv.showToast('Failed to update menu', 'error');
      this.isUpdateMenuSaving.set(false);
    }
  });
}

onDeleteMenuSubmit(): void {
  if (this.deleteMenuForm.invalid) {
    this.deleteMenuForm.markAllAsTouched();
    this.toastSrv.showToast('Please enter menu item id', 'warning');
    return;
  }

  const payload = {
    menuItemId: String(this.deleteMenuForm.value.menuItemId ?? '').trim()
  };

  console.log('Delete Menu Payload:', payload);

  this.isDeleteMenuSaving.set(true);

  this.scrAddSidebarSrv.deleteMenu(payload).subscribe({
    next: (res) => {
      console.log('Delete Menu Response:', res);
      this.toastSrv.showToast('Menu deleted successfully', 'success');
      this.isDeleteMenuSaving.set(false);
      this.resetDeleteMenuForm();
    },
    error: (err) => {
      console.error('Delete Menu Error:', err);
      this.toastSrv.showToast('Failed to delete menu', 'error');
      this.isDeleteMenuSaving.set(false);
    }
  });
}

onUpdateSubMenuSubmit(): void {
  if (this.updateSubMenuForm.invalid) {
    this.updateSubMenuForm.markAllAsTouched();
    this.toastSrv.showToast('Please fill all update sub menu required fields', 'warning');
    return;
  }

  if (this.selectedUpdateSubMenuProjectTypes().length === 0) {
    this.toastSrv.showToast('Please select at least one project type for update sub menu', 'warning');
    return;
  }

  if (this.selectedUpdateSubMenuRoles().length === 0) {
    this.toastSrv.showToast('Please select at least one role for update sub menu', 'warning');
    return;
  }

  const formValue = this.updateSubMenuForm.value;

  const payload = {
    subMenuItemId: Number(formValue.subMenuItemId ?? 0),
    menuValue: String(formValue.menuValue ?? '').trim(),
    route: String(formValue.route ?? '').trim(),
    sortOrder: String(formValue.sortOrder ?? '').trim(),
    isActive: !!formValue.isActive,
    projectTypeIds: this.getSelectedUpdateSubMenuProjectTypeIds(),
    roleIds: this.getSelectedUpdateSubMenuRoleIds(),
  };

  console.log('Update Sub Menu Payload:', payload);

  this.isUpdateSubMenuSaving.set(true);

  this.scrAddSidebarSrv.updateSubMenu(payload).subscribe({
    next: (res) => {
      console.log('Update Sub Menu Response:', res);
      this.toastSrv.showToast('Sub menu updated successfully', 'success');
      this.isUpdateSubMenuSaving.set(false);
      this.resetUpdateSubMenuForm();
    },
    error: (err) => {
      console.error('Update Sub Menu Error:', err);
      this.toastSrv.showToast('Failed to update sub menu', 'error');
      this.isUpdateSubMenuSaving.set(false);
    }
  });
}

onDeleteSubMenuSubmit(): void {
  if (this.deleteSubMenuForm.invalid) {
    this.deleteSubMenuForm.markAllAsTouched();
    this.toastSrv.showToast('Please enter sub menu item id', 'warning');
    return;
  }

  const payload = {
    subMenuItemId: String(this.deleteSubMenuForm.value.subMenuItemId ?? '').trim()
  };

  console.log('Delete Sub Menu Payload:', payload);

  this.isDeleteSubMenuSaving.set(true);

  this.scrAddSidebarSrv.deleteSubMenu(payload).subscribe({
    next: (res) => {
      console.log('Delete Sub Menu Response:', res);
      this.toastSrv.showToast('Sub menu deleted successfully', 'success');
      this.isDeleteSubMenuSaving.set(false);
      this.resetDeleteSubMenuForm();
    },
    error: (err) => {
      console.error('Delete Sub Menu Error:', err);
      this.toastSrv.showToast('Failed to delete sub menu', 'error');
      this.isDeleteSubMenuSaving.set(false);
    }
  });
}

resetUpdateMenuForm(): void {
  this.updateMenuForm.reset({
    menuItemId: '',
    menuValue: '',
    icon: '',
    sortOrder: '',
    isActive: true,
    projectTypeIds: '',
    roleIds: '',
  });

  this.selectedUpdateMenuProjectTypes.set([]);
  this.selectedUpdateMenuRoles.set([]);
  this.showUpdateMenuProjectTypeDropdown.set(false);
  this.showUpdateMenuRoleDropdown.set(false);
}

resetDeleteMenuForm(): void {
  this.deleteMenuForm.reset({
    menuItemId: '',
  });
}

resetUpdateSubMenuForm(): void {
  this.updateSubMenuForm.reset({
    subMenuItemId: '',
    menuValue: '',
    route: '',
    sortOrder: '',
    isActive: true,
    projectTypeIds: '',
    roleIds: '',
  });

  this.selectedUpdateSubMenuProjectTypes.set([]);
  this.selectedUpdateSubMenuRoles.set([]);
  this.showUpdateSubMenuProjectTypeDropdown.set(false);
  this.showUpdateSubMenuRoleDropdown.set(false);
}

resetDeleteSubMenuForm(): void {
  this.deleteSubMenuForm.reset({
    subMenuItemId: '',
  });
}

}