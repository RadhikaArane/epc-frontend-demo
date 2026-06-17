import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { BreadcrumbsComponent } from '../../../../common/breadcrumbs/breadcrumbs.component';
import { ScrAutomationService } from '../../../../../shared/services/scrapper/scr-automation.service';
import { ToastService } from '../../../../../shared/services/componentServices/toast.service';
import { breadCrumbItems } from '../../../../../shared/models/models';
import { finalize } from 'rxjs';

interface StateOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-scr-manual-upload',
  standalone: true,
  imports: [CommonModule, BreadcrumbsComponent],
  templateUrl: './scr-manual-upload.component.html',
  styleUrl: './scr-manual-upload.component.scss'
})
export class ScrManualUploadComponent {

private scrapperSrv = inject(ScrAutomationService);
  private toastSrv = inject(ToastService);

  breadCrumbItems = signal<breadCrumbItems[]>([{ label: 'Manual Upload' }]);

  // Form signals
  selectedState = signal<string>('');
  scrapDate = signal<string>('');
  selectedFile = signal<File | null>(null);
  isLoading = signal<boolean>(false);

  // States dropdown options (reused from other components)
  readonly states: StateOption[] = [
{ value: '', label: 'Select State' },
    { value: 'AndhraPradesh', label: 'Andhra Pradesh' },
    { value: 'Chhattisgarh', label: 'Chhattisgarh' },
    { value: 'Gujarat', label: 'Gujarat' },
    { value: 'Karnataka_Horti', label: 'Karnataka Horticulture' },
    { value: 'Karnataka_Agri', label: 'Karnataka Agriculture' },
    { value: 'MadhyaPradesh', label: 'Madhya Pradesh' },
    { value: 'Tamilnadu', label: 'Tamil Nadu' },
    { value: 'Telangana', label: 'Telangana' },
    { value: 'UttarPradesh', label: 'Uttar Pradesh' },
    { value: 'WestBengal', label: 'West Bengal' }
  ];

  /**
   * Handle file selection
   */
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile.set(input.files[0]);
    }
  }

  /**
   * Submit the upload form
   */
  onUpload(): void {
    const state = this.selectedState();
    const date = this.scrapDate();
    const file = this.selectedFile();

    if (!state || !date || !file) {
      this.toastSrv.showToast('Please fill in all required fields.', 'warning');
      return;
    }

    this.isLoading.set(true);
    console.log(state,date);

    this.scrapperSrv._uploadManualData(state, date, file)
      .pipe(
        finalize(() => this.isLoading.set(false))
      )
      .subscribe({
        next: (res) => {
          console.log('✅ Upload successful:', res);
          this.toastSrv.showToast('File uploaded successfully!', 'success');
          this.resetForm();
        },
        error: (err) => {
          console.error('❌ Upload failed:', err);
          this.toastSrv.showToast(err.error?.message || 'Failed to upload file.', 'error');
        }
      });
  }

  /**
   * Reset the form to its initial state
   */
  private resetForm(): void {
    this.selectedState.set('');
    this.scrapDate.set('');
    this.selectedFile.set(null);
    // Reset file input field visually
    const fileInput = document.getElementById('formFile') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }
}
