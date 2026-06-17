import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpContext } from '@angular/common/http';
import { HttpEncSrvWrapperService } from '../common/http-enc-srv-wrapper.service';
import { EncryptionServiceService } from '../common/encryption-service.service';
import { Observable } from 'rxjs';
import { SKIP_LOADER } from '../../core/interceptors/epc-loader.interceptor';

@Injectable({
  providedIn: 'root'
})
export class PbCostEstimationService {

  private apiURL = environment.apiUrl;
  http = inject(HttpClient);
  httpWrapper = inject(HttpEncSrvWrapperService)
  encryptionSrv = inject(EncryptionServiceService);

  constructor() { }

  _getProjectSummaryAudit(month: number, year: number): Observable<any> {
    const params = this.httpWrapper.createParams({
      month: month,
      year: year
    });
    return this.httpWrapper.get(`${this.apiURL}ProjectBusiness/api/ProjectRevenue/GetProjectSummaryAudit?`, { params });
  }

  _getFTMEntryExport(projectId: string, month: number, year: number): Observable<Blob> {
    const encryptedParams: any = {
      projectId: projectId,
      month: month,
      year: year
    };
    return this.httpWrapper.get<Blob>(`${this.apiURL}ProjectBusiness/api/ProjectRevenue/download?`,
      {
        encryptedParams: encryptedParams,
        responseType: 'blob',
        context: new HttpContext().set(SKIP_LOADER, true)
      });
  }

  _downLoadProjectSummaryAudit(): Observable<Blob> {
    return this.httpWrapper.get<Blob>(`${this.apiURL}ProjectBusiness/api/ProjectRevenue/ExportProjectSummaryAudit`, { responseType: 'blob', context: new HttpContext().set(SKIP_LOADER, true) });
  }

  _saveDocNumber(projectId: string, month: number, year: number, documentNo: string): Observable<any> {
    const body = {
      projectId: projectId,
      month: month.toString(),
      year: year.toString(),
      documentNo: documentNo
    };
    return this.httpWrapper.post(`${this.apiURL}ProjectBusiness/api/ProjectRevenue/document-number`, body);
  }



}
