import { Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

// Adjust paths as needed
import { BreadcrumbsComponent } from './../../../../common/breadcrumbs/breadcrumbs.component';
import { breadCrumbItems } from '../../../../../shared/models/models';
import { ConfirmationDialogService } from '../../../../../shared/services/componentServices/confirmation-dialog.service';
import { ToastService } from '../../../../../shared/services/componentServices/toast.service';
import { MobileUserService } from '../../../../../shared/services/fixedAsset/fa-mobile-user-srv.service';
import { faMobileUser } from '../../../../../shared/models/fixedAsset-models/fa-mobileUser';

declare var bootstrap: any;

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [BreadcrumbsComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.scss'
})
export class faCreateUserComponent implements OnInit {

  @ViewChild('createUserModel') createUserModel!: ElementRef;

  private fb = inject(FormBuilder);
  private mobileUserService = inject(MobileUserService);
  private confirmDialogSrv = inject(ConfirmationDialogService);
  private toastSrv = inject(ToastService);

  // Signals
  breadCrumbItems = signal<breadCrumbItems[]>([{ label: 'User Management' }]);
  usersList = signal<faMobileUser[]>([]);
  isLoading = signal<boolean>(false);
  isSubmitting = signal<boolean>(false);
  isEditMode = signal<boolean>(false);
  
  userForm: FormGroup;
  currentEditId: number | null = null;

  modalInstance: any;

  constructor() {
    this.userForm = this.fb.group({
      employeeId: ['', Validators.required],
      fullName: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobileNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10,12}$')]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  // --- API Methods ---

  loadUsers() {
    this.isLoading.set(true);
    console.log('🔄 [Component] loadUsers called');

    this.mobileUserService.getMobileUsers().subscribe({
      next: (data: any) => {
        console.log('✅ [Component] Users received:', data);
        const users = Array.isArray(data) ? data : (data?.Items || data?.items || []);
        this.usersList.set(users);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('❌ [Component] Error fetching users:', err);
        this.toastSrv.showToast('Failed to load users', 'error');
        this.usersList.set([]);
        this.isLoading.set(false);
      }
    });
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      this.toastSrv.showToast('Please fill all required fields', 'error');
      return;
    }

    this.isSubmitting.set(true);
    const formValue = this.userForm.value;

    // Construct Payload based on your Image (Body Request)
    const apiPayload = {
      username: formValue.username,
      password: formValue.password,
      fullName: formValue.fullName,
      email: formValue.email,
      mobileNumber: formValue.mobileNumber,
      employeeId: formValue.employeeId
    };

    console.log('📤 [Component] Submitting Payload:', apiPayload);

    if (this.isEditMode() && this.currentEditId) {
      // --- UPDATE ---
      // We pass the ID separately for the URL, and the object for the Body
      this.mobileUserService.updateMobileUser(this.currentEditId, apiPayload).subscribe({
        next: (res) => {
          this.toastSrv.showToast('User updated successfully', 'success');
          this.closeModal();
          this.loadUsers();
        },
        error: (err) => {
          console.error('Update Failed', err);
          this.toastSrv.showToast('Update failed', 'error');
          this.isSubmitting.set(false);
        },
        complete: () => this.isSubmitting.set(false)
      });

    } else {
      // --- CREATE ---
      this.mobileUserService.createMobileUser(apiPayload).subscribe({
        next: (res) => {
          this.toastSrv.showToast('User created successfully', 'success');
          this.closeModal();
          this.loadUsers();
        },
        error: (err) => {
          console.error('Create Failed', err);
          this.toastSrv.showToast('Creation failed', 'error');
          this.isSubmitting.set(false);
        },
        complete: () => this.isSubmitting.set(false)
      });
    }
  }

  async deleteUser(user: any): Promise<void> {
    const idToDelete = user.UserId ?? user.userId;

    const name = user.FullName || user.fullName;

    const confirmed = await this.confirmDialogSrv.showConfirm(
      `Are you sure you want to delete ${name}?`,
      'Confirm Delete'
    );

    if (!confirmed) return;

    this.mobileUserService.deleteMobileUser(idToDelete).subscribe({
      next: (res) => {
        this.toastSrv.showToast('User deleted successfully', 'success');
        this.loadUsers();
      },
      error: (err) => {
        console.error('Delete Failed', err);
        // Note: 405 Method Not Allowed usually means Server/IIS config issues (WebDAV)
        this.toastSrv.showToast('Delete failed', 'error');
      }
    });
  }

  // --- UI Helpers ---

  openCreateModal(): void {
    this.isEditMode.set(false);
    this.currentEditId = null;
    this.userForm.reset();
    this.userForm.get('employeeId')?.enable();
    this.openModal();
  }

  editUser(user: any): void {
  this.isEditMode.set(true);

  // ✅ Use UserId for update URL
  this.currentEditId = user.UserId ?? user.userId;

  this.userForm.patchValue({
    employeeId: user.EmployeeId ?? user.employeeId,
    fullName: user.FullName ?? user.fullName,
    username: user.Username ?? user.username,
    email: user.Email ?? user.email,
    mobileNumber: user.MobileNumber ?? user.mobileNumber,
    password: '' // ✅ don't set PasswordHash here
  });

  // ✅ Optional: if you don't want employeeId to be sent/edited in update
  this.userForm.get('employeeId')?.disable();

  // ✅ Optional: make password not required in edit mode
  this.userForm.get('password')?.clearValidators();
  this.userForm.get('password')?.updateValueAndValidity();

  this.openModal();
}

  openModal(): void {
    if (this.createUserModel) {
      this.modalInstance = new bootstrap.Modal(this.createUserModel.nativeElement, {
        backdrop: 'static',
        keyboard: false,
      });
      this.modalInstance.show();
    }
  }

  closeModal(): void {

  // ✅ Remove focus from any active element
  const activeEl = document.activeElement as HTMLElement;
  if (activeEl) {
    activeEl.blur();
  }

  if (this.modalInstance) {
    this.modalInstance.hide();
  }

  this.userForm.reset();
}

}