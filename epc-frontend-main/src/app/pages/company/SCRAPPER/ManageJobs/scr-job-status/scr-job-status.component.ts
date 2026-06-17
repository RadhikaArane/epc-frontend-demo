import { Component, inject, signal } from '@angular/core';
import { breadCrumbItems } from '../../../../../shared/models/models';
import { BreadcrumbsComponent } from '../../../../common/breadcrumbs/breadcrumbs.component';
import { ScrAutomationService } from '../../../../../shared/services/scrapper/scr-automation.service';
import { ToastService } from '../../../../../shared/services/componentServices/toast.service';
import { Subject, takeUntil } from 'rxjs';
import { stateWiseJobs } from '../../../../../shared/models/scrapper-models/scrapperAutomation';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-scr-job-status',
  standalone: true,
  imports: [BreadcrumbsComponent, CommonModule],
  templateUrl: './scr-job-status.component.html',
  styleUrl: './scr-job-status.component.scss'
})
export class ScrJobStatusComponent {


  breadCrumbItems = signal<breadCrumbItems[]>([]);
  isLoading = signal<boolean>(false);
  allJobs = signal<stateWiseJobs[]>([])

  private scrapperSrv = inject(ScrAutomationService);
  private toastSrv = inject(ToastService); 
  private destroy$ = new Subject<void>(); 


  constructor() {
    this.breadCrumbItems.set([
      { label: 'Manage Jobs' },
    ]);
  }

  ngOnInit() {
    this.loadJobs();
  }

  loadJobs() {
    this.isLoading.set(true);
    this.scrapperSrv._getJobsStateWise()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          console.log("Jobs response:", res);

          this.allJobs.set(res);

          this.isLoading.set(false);
        },
        error: (err: any) => {
          console.error("Error loading Jobs:", err);
          this.toastSrv.showToast(
            err?.message || 'Error occurred while loading Jobs.',
            'error'
          );
          this.isLoading.set(false);
          this.allJobs.set([]);
        }
      });
  }

  private convertStateForDownload(state: string): string {
    const specialCases: { [key: string]: string } = {
      'Karnataka_Agri': 'karnataka_Agri',
      // 'TamilNadu_Horti': 'Tamilnadu',
      'Tamil_Nadu': 'Tamilnadu',
      'Karnataka_Horti': 'Karnataka_Horti'
    };

    if (specialCases[state]) {
      return specialCases[state];
    }
    return state.replace(/_/g, '');
  }

  downloadAttachment(state: string): void {

    const processedState = this.convertStateForDownload(state);

    console.log('Original state:', state);
    console.log('Processed state:', processedState);

    this.scrapperSrv._getJobsStateWiseAttachment(processedState)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (blob: Blob) => {
          console.log("Jobs attachment response received");

          // Validate blob
          if (!blob || blob.size === 0) {
            this.toastSrv.showToast('File is empty or corrupt', 'error');
            return;
          }

          // Create download link
          const now = new Date();
          const date = now.toLocaleDateString('en-GB').replace(/\//g, '-'); // DD-MM-YYYY
          const time = now.toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          }).replace(/:/g, '-'); // Use /:/g not ':'

          // Create download link
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${state}_jobs_${date}_${time}.xlsx`;

          // Trigger download
          document.body.appendChild(link);
          link.click();

          // Cleanup
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);

          this.toastSrv.showToast('Attachment downloaded successfully.', 'success');
          this.loadJobs();
        },
        error: (err: any) => {
          console.error("Error downloading state attachment:", err);
          console.error("Decrypted error:", err.decryptedError);

          this.toastSrv.showToast(
            err?.message || 'Error occurred while downloading attachment.',
            'error'
          );

          this.isLoading.set(false);
          this.allJobs.set([]);
          this.loadJobs();
        }
      });
  }

}

