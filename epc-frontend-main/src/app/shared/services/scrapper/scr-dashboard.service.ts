import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, ReplaySubject, Subject, throwError } from 'rxjs';
import { HttpEncSrvWrapperService } from '../common/http-enc-srv-wrapper.service';
import { environment } from '../../../../environments/environment';
import { ScrAutomationService } from './scr-automation.service';
import { ToastService } from '../componentServices/toast.service';

@Injectable({
  providedIn: 'root'
})
export class ScrDashboardService {

  private apiURL = environment.apiUrl; 

  httpWrapper = inject(HttpEncSrvWrapperService)
  private scrapperSrv = inject(ScrAutomationService);
  private toastSrv = inject(ToastService);

  constructor() { }

  // dashboard finished failed
  _getFinishedFailedJob(state: string): Observable<any> {
    const params = this.httpWrapper.createParams({
      state: state
    });
    return this.httpWrapper.get(`${this.apiURL}Scrapper/api/finishedfailedfilter?`, { params });
  }

  _getStateOverview(params: any): Observable<any> {
    const encryptedParams: any = {
      state: params.state,
    };
    const plainParams: any = {
      page: params.page,
      pageSize: params.pageSize
    };
    return this.httpWrapper.get(`${this.apiURL}Scrapper/api/statedataoverview?`,
      {
        encryptedParams: encryptedParams,
        plainParams: plainParams
      });
  } 


  downloadStateAttachment(state: string): Observable<boolean> {
    console.log('📥 Downloading attachment for state:', state);

    return this.scrapperSrv._getJobsStateWiseAttachment(state).pipe(
      map((blob: Blob) => {
        console.log("✅ Jobs attachment response received");

        // Validate blob
        if (!blob || blob.size === 0) {
          this.toastSrv.showToast('File is empty or corrupt', 'error');
          return false;
        }

        // Format date and time
        const now = new Date();
        const date = now.toLocaleDateString('en-GB').replace(/\//g, '-'); // DD-MM-YYYY
        const time = now.toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }).replace(/:/g, '-'); // HH-MM-SS

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

        this.toastSrv.showToast(`${state} attachment downloaded successfully`, 'success');
        return true;
      }),
      catchError((err: any) => {
        console.error("❌ Error downloading state attachment:", err);
        console.error("Decrypted error:", err.decryptedError);

        this.toastSrv.showToast(
          err?.message || 'Error occurred while downloading attachment.',
          'error'
        );

        return throwError(() => err);
      })
    );
  }

}