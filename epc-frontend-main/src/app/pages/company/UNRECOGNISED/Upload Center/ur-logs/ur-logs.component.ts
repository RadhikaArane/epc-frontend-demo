import { CommonModule } from '@angular/common';
import { Component, inject, signal, computed, OnInit } from '@angular/core'; 
import { FormsModule } from '@angular/forms'; 
import { BreadcrumbsComponent } from '../../../../common/breadcrumbs/breadcrumbs.component';
import { UrUnrecUploadLogsService } from '../../../../../shared/services/unrecognisedInvoice/ur-unrec-upload-logs.service';
import { ToastService } from '../../../../../shared/services/componentServices/toast.service';
import { AuthService } from '../../../../../shared/services/common/auth.service';
import { logs } from '../../../../../shared/models/unrecognisedInvoice-models/uploadLogs';

@Component({
  selector: 'app-ur-logs',
  standalone: true,
  imports: [CommonModule, BreadcrumbsComponent, FormsModule], 
  templateUrl: './ur-logs.component.html',
  styleUrl: './ur-logs.component.scss'
})
export class UrLogsComponent implements OnInit {

  breadCrumbItems = signal([
    { label: 'Upload Center' }
  ]);

  urLogsSrv = inject(UrUnrecUploadLogsService);
  toastSrv = inject(ToastService);
  authSrv = inject(AuthService);

  employeeId = signal(this.authSrv.userDetails?.employeeId);
  
  uploadLogs = signal<logs[]>([]); 

  selectedFilter = signal<string>('All');

  filteredLogs = computed(() => {
    const filter = this.selectedFilter();
    const logs = this.uploadLogs();

    if (filter === 'All') {
      return logs;
    }
    
    return logs.filter(log => log.TableName === filter);
  });

  ngOnInit(): void {
    this.fetchLogs();
  }

  fetchLogs() {
    const id = this.employeeId();

    if (!id) {
      console.warn('⚠️ No Employee ID found.');
      return;
    }

    console.log('1. Starting API Call (Encrypted) with ID:', id);

    this.urLogsSrv._getUploadLogs(id).subscribe({
      next: (res: any) => {
        const data = Array.isArray(res) ? res : (res?.data || []);
        this.uploadLogs.set(data); 
      },
      error: (err) => {
        console.error('❌ API Error:', err);
        if (err.error) {
           console.error('❌ Server Message:', JSON.stringify(err.error, null, 2));
        }
        this.toastSrv.showToast('Failed to load logs', 'error');
      }
    });
  }

  onFilterChange(event: any) {
    this.selectedFilter.set(event.target.value);
  }
}