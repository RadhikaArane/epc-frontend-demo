import {
  Component, inject, signal, Input, Output, EventEmitter,
  OnDestroy, OnInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ToastService } from '../../../../../shared/services/componentServices/toast.service';
import { ConfirmationDialogService } from '../../../../../shared/services/componentServices/confirmation-dialog.service';
import { PbExtensionLetterService } from '../../../../../shared/services/projectBusiness/pb-extension-letter.service';
import { AuthService } from '../../../../../shared/services/common/auth.service';

export interface ExtensionLetter {
  ExtensionLetterId: string;
  ProjectId: string;
  ExpectedCompletionDate: string;
  AttachmentId: string;
  FileName: string;
  FileSizeBytes: number;
  ContentType: string;
  UploadedDate: string;
  UploadedBy: string;
  Remarks: string;
  EmployeeId: string;
  EmployeeName: string;
}

@Component({
  selector: 'app-pb-extension-letter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pb-extension-letter.component.html',
  styleUrl: './pb-extension-letter.component.scss'
})
export class PbExtensionLetterComponent implements OnInit, OnDestroy {

  // ==================== Inputs ====================
  @Input({ required: true }) projectId!: string;
  @Input({ required: true }) expectedCompletionDate!: string;

  // ==================== Outputs ====================
  /** Emits after successful upload so parent can proceed with project update */
  @Output() uploadComplete = new EventEmitter<void>();
  /** Emits when user cancels the upload modal (date-change flow) */
  @Output() uploadCancelled = new EventEmitter<void>();

  // ==================== Services ====================
  private extensionLetterSrv = inject(PbExtensionLetterService);
  private toastSrv = inject(ToastService);
  private confirmationDialogSrv = inject(ConfirmationDialogService);
  private authSrv = inject(AuthService);

  // ==================== Signals ====================
  // Upload modal
  showUploadModal = signal<boolean>(false);
  uploadFile = signal<File | null>(null);
  uploadRemarks = signal<string>('');
  uploadErrorMessage = signal<string>('');
  isUploading = signal<boolean>(false);

  // View modal
  showViewModal = signal<boolean>(false);
  extensionLetters = signal<ExtensionLetter[]>([]);
  isLoadingLetters = signal<boolean>(false);

  private destroy$ = new Subject<void>();

  ngOnInit(): void { }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ==================== Upload Modal ====================

  /** Called by parent when expectedCompletionDate has changed and upload is required */
  openUploadModal(): void {
    this.resetUploadForm();
    this.showUploadModal.set(true);
  }

  closeUploadModal(): void {
    this.showUploadModal.set(false);
    this.resetUploadForm();
  }

  cancelUpload(): void {
    this.closeUploadModal();
    this.uploadCancelled.emit();
  }

  private resetUploadForm(): void {
    this.uploadFile.set(null);
    this.uploadRemarks.set('');
    this.uploadErrorMessage.set('');
    this.isUploading.set(false);
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      this.uploadFile.set(null);
      this.uploadErrorMessage.set('');
      return;
    }

    // Validate: PDF only, max 25MB
    const fileName = file.name.toLowerCase();
    if (!fileName.endsWith('.pdf')) {
      this.uploadErrorMessage.set('Only PDF files are allowed.');
      this.uploadFile.set(null);
      input.value = '';
      return;
    }

    const maxSize = 25 * 1024 * 1024;
    if (file.size > maxSize) {
      this.uploadErrorMessage.set('File size must not exceed 25MB.');
      this.uploadFile.set(null);
      input.value = '';
      return;
    }

    this.uploadFile.set(file);
    this.uploadErrorMessage.set('');
  }

  submitUpload(): void {
    // Validate
    if (!this.uploadFile()) {
      this.uploadErrorMessage.set('Please select a PDF file.');
      return;
    }

    if (!this.uploadRemarks().trim()) {
      this.uploadErrorMessage.set('Please enter remarks explaining the extension.');
      return;
    }

    if (!this.projectId) {
      this.uploadErrorMessage.set('Project ID is missing.');
      return;
    }

    this.isUploading.set(true);
    this.uploadErrorMessage.set('');

    const formData = new FormData();
    formData.append('ProjectId', this.projectId);
    formData.append('ExpectedCompletionDate', this.expectedCompletionDate);
    formData.append('ExtensionLetterFile', this.uploadFile()!);
    formData.append('Remarks', this.uploadRemarks().trim());
    formData.append('EmployeeId', this.getEmployeeId());
    formData.append('EmployeeName', this.getEmployeeName());

    this.extensionLetterSrv._uploadExtensionletter(formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.toastSrv.showToast('Extension letter uploaded successfully', 'success');
          this.isUploading.set(false);
          this.closeUploadModal();
          this.uploadComplete.emit();
        },
        error: (error) => {
          console.error('Upload failed:', error);
          this.uploadErrorMessage.set(error?.error?.message || 'Upload failed. Please try again.');
          this.toastSrv.showToast('Error uploading extension letter', 'error');
          this.isUploading.set(false);
        }
      });
  }

  // ==================== View Modal ====================

  openViewModal(): void {
    this.showViewModal.set(true);
    this.loadExtensionLetters();
  }

  closeViewModal(): void {
    this.showViewModal.set(false);
    this.extensionLetters.set([]);
  }

  private loadExtensionLetters(): void {
    if (!this.projectId) return;

    this.isLoadingLetters.set(true);

    this.extensionLetterSrv._getExtensionLetters(this.projectId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          if (response?.success && response?.data) {
            this.extensionLetters.set(response.data);
          } else {
            this.extensionLetters.set([]);
          }
          this.isLoadingLetters.set(false);
        },
        error: (err) => {
          console.error('Error loading extension letters:', err);
          this.toastSrv.showToast('Error loading extension letters', 'error');
          this.isLoadingLetters.set(false);
        }
      });
  }

  // ==================== Download ====================

  downloadLetter(letter: ExtensionLetter): void {
    this.toastSrv.showToast('Preparing download...', 'warning');

    this.extensionLetterSrv._downloadExtensionLetter(letter.ExtensionLetterId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (blob: Blob) => {
          if (blob && blob.size > 0) {
            const fileUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = fileUrl;
            link.download = letter.FileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(fileUrl);
            this.toastSrv.showToast('Download completed', 'success');
          } else {
            this.toastSrv.showToast('Downloaded file is empty', 'error');
          }
        },
        error: (err) => {
          console.error('Error downloading:', err);
          this.toastSrv.showToast('Failed to download extension letter', 'error');
        }
      });
  }

  // ==================== Delete ====================

  async deleteLetter(letter: ExtensionLetter): Promise<void> {
    const confirmed = await this.confirmationDialogSrv.showConfirm(
      'Are you sure you want to delete this extension letter? This action cannot be undone.',
      'Delete Extension Letter'
    );

    if (!confirmed) return;

    this.extensionLetterSrv._deleteExtensionLetter(letter.ExtensionLetterId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.toastSrv.showToast('Extension letter deleted successfully', 'success');
          this.loadExtensionLetters();
        },
        error: (err) => {
          console.error('Error deleting:', err);
          this.toastSrv.showToast('Error deleting extension letter', 'error');
        }
      });
  }

  // ==================== Helpers ====================

  formatFileSize(bytes: number): string {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }

  private getEmployeeId(): any {
    return this.authSrv.userDetails?.employeeId;
  }

  private getEmployeeName(): any {
    return this.authSrv.userDetails?.name;
  }
 
}