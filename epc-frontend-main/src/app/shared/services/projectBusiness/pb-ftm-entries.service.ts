import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpContext } from '@angular/common/http';
import { HttpEncSrvWrapperService } from '../common/http-enc-srv-wrapper.service';
import { EncryptionServiceService } from '../common/encryption-service.service';
import { Observable } from 'rxjs';
import { FTMApiResponse, QuarterlyApiResponse } from '../../models/projectBusiness-models/pbFtmEntries';
import { SKIP_LOADER } from '../../core/interceptors/epc-loader.interceptor';

@Injectable({
  providedIn: 'root'
})
export class PbFtmEntriesService {

  private apiURL = environment.apiUrl;
  http = inject(HttpClient);
  httpWrapper = inject(HttpEncSrvWrapperService)
  encryptionSrv = inject(EncryptionServiceService);

  constructor() { }

  _uploadFTMAttachment(formData: FormData): Observable<any> {
    return this.httpWrapper.post<any>(`${this.apiURL}ProjectBusiness/api/ProjectExpense/upload-ftm`, formData)
  }

  _getAllFTMProjects(page: number = 1, pageSize: number = 10): Observable<FTMApiResponse> {
    const plainParams: any = {
      page: page,
      pageSize: pageSize
    };
    return this.httpWrapper.get<FTMApiResponse>(
      `${this.apiURL}ProjectBusiness/api/ProjectRevenue/GetAllProjectsSummary`,
      { plainParams: plainParams }
    );
  }
  _getFTMProjectDetails(projectId: string): Observable<any> {
    const params = this.httpWrapper.createParams({
      projectId: projectId,
    });
    return this.httpWrapper.get<any>(`${this.apiURL}ProjectBusiness/api/ProjectRevenue/GetProjectRevenue?`, { params, context: new HttpContext().set(SKIP_LOADER, true) });
  }

  _downloadFTMExcel(): Observable<Blob> {
    return this.httpWrapper.get(`${this.apiURL}ProjectBusiness/api/ProjectRevenue/ExportProjectRevenueDetails?`, { responseType: 'blob', context: new HttpContext().set(SKIP_LOADER, true) });
  }

  //quarters
  _getQuarterlyData(): Observable<QuarterlyApiResponse> {
    return this.httpWrapper.get<QuarterlyApiResponse>(`${this.apiURL}ProjectBusiness/api/ProjectRevenue/GetAllProjectsQuarterlyMonthlyTotals`);
  }

  //unrecognised projects
  _getUnrecognisedProjects(): Observable<any> {
    return this.httpWrapper.get(`${this.apiURL}ProjectBusiness/api/ProjectRevenue/unrecognised-projects`);
  }
}
