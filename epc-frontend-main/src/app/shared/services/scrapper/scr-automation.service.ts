import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpContext } from '@angular/common/http';
import { HttpEncSrvWrapperService } from '../common/http-enc-srv-wrapper.service';
import { EncryptionServiceService } from '../common/encryption-service.service';
import { Observable } from 'rxjs';
import { SKIP_LOADER } from '../../core/interceptors/epc-loader.interceptor';
import { ScrapingState, ScrapperReportResponse, StatusMessage } from '../../models/scrapper-models/scrapperAutomation';
import { CacheConfig, JwtService } from '../common/jwt.service';

@Injectable({
  providedIn: 'root'
})
export class ScrAutomationService {

  private apiURL = environment.apiUrl;

  http = inject(HttpClient);
  httpWrapper = inject(HttpEncSrvWrapperService)
  encryptionSrv = inject(EncryptionServiceService);
  jwtSrv = inject(JwtService)

  constructor() {
    this.loadStateFromDB();
  }


  //run automation
  private readonly SCRAPING_DB_CONFIG: CacheConfig = {
    dbName: 'scraper-automation-db',
    storeName: 'scraping-state-store',
    version: 1,
    ttl: 48 * 60 * 60 * 1000 // 48 hours TTL
  };

  private readonly SCRAPING_STATE_KEY = 'active_scraping_job';

  // Persistent state signals
  persistentJobId = signal<string | null>(null);
  persistentMessages = signal<StatusMessage[]>([]);
  persistentIsActive = signal<boolean>(false);
  persistentSelectedState = signal<string | null>(null);


  private async loadStateFromDB(): Promise<void> {
    try {
      const state = await this.jwtSrv.get<ScrapingState>(
        this.SCRAPING_STATE_KEY,
        this.SCRAPING_DB_CONFIG
      );

      if (state && state.isActive) {
        console.log('✅ Restored scraping state from IndexedDB:', state);
        this.persistentJobId.set(state.jobId);
        this.persistentSelectedState.set(state.selectedState);
        this.persistentMessages.set(state.messages);
        this.persistentIsActive.set(state.isActive);
      }
    } catch (error) {
      console.error('❌ Failed to load state from IndexedDB:', error);
    }
  }

  /**
   * Save current state to IndexedDB
   */
  private async saveStateToDBAsync(): Promise<void> {
    try {
      const state: ScrapingState = {
        jobId: this.persistentJobId() || '',
        selectedState: this.persistentSelectedState() || '',
        messages: this.persistentMessages(),
        isActive: this.persistentIsActive(),
        lastUpdated: Date.now()
      };

      await this.jwtSrv.store(
        this.SCRAPING_STATE_KEY,
        state,
        this.SCRAPING_DB_CONFIG
      );
    } catch (error) {
      console.error('❌ Failed to save state to IndexedDB:', error);
    }
  }

  /**
   * Save state to IndexedDB (fire and forget)
   */
  private saveStateToDB(): void {
    this.saveStateToDBAsync().catch(err =>
      console.error('Background save failed:', err)
    );
  }

  /**
   * Store scraping state
   */
  setScrapingState(jobId: string, state: string): void {
    this.persistentJobId.set(jobId);
    this.persistentSelectedState.set(state);
    this.persistentIsActive.set(true);
    this.saveStateToDB();
  }

  /**
   * Add message to persistent storage
   */
  addPersistentMessage(message: string): void {
    const newMessage: StatusMessage = {
      message: message,
      timestamp: new Date()
    };
    this.persistentMessages.update(messages => [newMessage, ...messages]);
    this.saveStateToDB();
  }

  /**
   * Clear scraping state
   */
  async clearScrapingState(): Promise<void> {
    this.persistentJobId.set(null);
    this.persistentMessages.set([]);
    this.persistentIsActive.set(false);
    this.persistentSelectedState.set(null);

    // Delete from IndexedDB
    await this.jwtSrv.delete(
      this.SCRAPING_STATE_KEY,
      this.SCRAPING_DB_CONFIG
    );
  }

  /**
   * Check if scraping is active
   */
  hasActiveJob(): boolean {
    return this.persistentIsActive() && this.persistentJobId() !== null;
  }

  /**
   * Update only isActive flag
   */
  setIsActive(isActive: boolean): void {
    this.persistentIsActive.set(isActive);
    this.saveStateToDB();
  }


  _automationRun(data: any): Observable<any> {
    return this.httpWrapper.post(`${this.apiURL}Scrapper/api/automation/run`, data)
  }
  _getAutomationStatus(jobId: string): Observable<any> {
    const params = this.httpWrapper.createParams({
      jobID: jobId
    })
    return this.httpWrapper.get(`${this.apiURL}Scrapper/api/captcha/status?`,
      {
        params,
        context: new HttpContext().set(SKIP_LOADER, true)
      })
  }
  _getCaptcha(state: string): Observable<any> {
    const params = this.httpWrapper.createParams({
      state: state
    })
    return this.httpWrapper.get(`${this.apiURL}Scrapper/api/captcha/latest?`,
      {
        params,
        context: new HttpContext().set(SKIP_LOADER, true)
      })
  }
  _postCaptcha(data: { jobId: string; answer: string }): Observable<any> {
    return this.httpWrapper.post(`${this.apiURL}Scrapper/api/captcha/answer`, data);
  }

  _stopScrapping(data: any): Observable<any> {
    return this.httpWrapper.post(`${this.apiURL}Scrapper/api/automation/stop`, data);
  }





  //manage jobs
  _getJobsStateWise(): Observable<any> {
    return this.httpWrapper.get(`${this.apiURL}Scrapper/api/JobStatusLive`)
  }

  _getJobsStateWiseAttachment(state: string): Observable<any> {
    const params = this.httpWrapper.createParams({
      StateName: state
    });
    return this.httpWrapper.get(`${this.apiURL}Scrapper/api/JobStatusLive/download?`, { 
      params, 
      responseType: 'blob',
      context: new HttpContext().set(SKIP_LOADER, true)
   
     })
  }


  _getJobsStateReport(param: any): Observable<ScrapperReportResponse> {
    const encryptedParams: any = {
      state: param.state,
      year: param.year,
      month: param.month
    };
    const plainParams: any = {
      page: param.page,
      pageSize: param.pageSize
    };
    return this.httpWrapper.get(`${this.apiURL}Scrapper/api/reports/showdata?`,
      {
        encryptedParams: encryptedParams,
        plainParams: plainParams
      })
  }

  _getJobReportExport(param: any): Observable<any> {
    const params = this.httpWrapper.createParams({
      state: param.state,
      finishedAt: param.finishedAt
    });
    return this.httpWrapper.get(`${this.apiURL}Scrapper/api/reports/export?`,
      { params,  responseType: 'blob', context: new HttpContext().set(SKIP_LOADER, true)})
  }





  //logs
  _getScrapperLogs(param: { date: string, page: number, pageSize: number }): Observable<any> {
    const encryptedParams = {
    date: param.date
    };

  const plainParams = {
    page: param.page.toString(),
    pageSize: param.pageSize.toString()
  };

  return this.httpWrapper.get(`${this.apiURL}Scrapper/api/scrapper-logs`, {
    encryptedParams: encryptedParams,
    plainParams: plainParams
  });
}

//upload manual
_uploadManualData(state: string, scrapDate: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('State', state);
    formData.append('ScrapDate', scrapDate);
    formData.append('File', file);

    return this.httpWrapper.post(`${this.apiURL}Scrapper/api/manual-upload`, formData);
  }

}