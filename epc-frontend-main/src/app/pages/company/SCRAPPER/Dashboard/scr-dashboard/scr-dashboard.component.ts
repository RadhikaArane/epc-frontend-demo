import { Component, inject, signal } from '@angular/core';
import { BreadcrumbsComponent } from '../../../../common/breadcrumbs/breadcrumbs.component';
import { breadCrumbItems } from '../../../../../shared/models/models';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ScrAutomationService } from '../../../../../shared/services/scrapper/scr-automation.service';
import { Subject, takeUntil } from 'rxjs';
import { ToastService } from '../../../../../shared/services/componentServices/toast.service';
import { ScrDashboardService } from '../../../../../shared/services/scrapper/scr-dashboard.service';
import { JobStats } from '../../../../../shared/models/scrapper-models/scrapperDashboard';
import { AuthService } from '../../../../../shared/services/common/auth.service';

@Component({
  selector: 'app-scr-dashboard',
  standalone: true,
  imports: [BreadcrumbsComponent, RouterLink, CommonModule, ReactiveFormsModule],
  templateUrl: './scr-dashboard.component.html',
  styleUrl: './scr-dashboard.component.scss'
})
export class ScrDashboardComponent {

  breadCrumbItems = signal<breadCrumbItems[]>([]);
  jobStats = signal<JobStats | null>(null);
  stateControl = new FormControl('');


  authSrv = inject(AuthService);
  scrDashboardSrv = inject(ScrDashboardService);
  toastSrv = inject(ToastService);
  private destroy$ = new Subject<void>();

  userName = signal(this.authSrv.userDetails?.name);

  constructor() {
    this.breadCrumbItems.set([
      { label: 'Dashboard' },
    ]);
 
  }

  ngOnInit() {
    // Load all states data initially (without state filter)
    this.loadFinishedFailedJobs();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onStateChange() {
    // Load data based on selected state
    this.loadFinishedFailedJobs();
  }

  loadFinishedFailedJobs() {
    const selectedState = this.stateControl.value || '';

    this.scrDashboardSrv._getFinishedFailedJob(selectedState)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: JobStats) => {
          console.log('Dashboard Stats Received:', res);
          
          this.jobStats.set({
            finished: res?.finished ?? 0,
            failed: res?.failed ?? 0
          });
        },
        error: (err) => {
          console.error('Error loading job stats:', err);
          this.toastSrv.showToast('Failed to load job statistics', 'error');
          this.jobStats.set({ finished: 0, failed: 0 });
        }
      });
  }
}