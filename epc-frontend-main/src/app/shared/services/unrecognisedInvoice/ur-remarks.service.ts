import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { PanIndiaSummaryBucketResponse } from '../../models/unrecognisedInvoice-models/Inventory';
import { environment } from '../../../../environments/environment';
import { HttpEncSrvWrapperService } from '../common/http-enc-srv-wrapper.service';
import { AuthService } from '../common/auth.service';
import { UpsertRemarksPayload, urGetPredefinedRemarks } from '../../models/unrecognisedInvoice-models/remarks';
import { COGSPanBucketResponse } from '../../models/unrecognisedInvoice-models/inventoryCOGS';

@Injectable({
  providedIn: 'root'
})
export class UrRemarksService {

  private apiURL = environment.apiUrl;

  httpWrapper = inject(HttpEncSrvWrapperService)
  authSrv = inject(AuthService)

  employeeId = signal(this.authSrv.userDetails?.employeeId);

  constructor() { }

  //remarks Inventory
  _getInventoryPanIndiaBucketSummary(param: any): Observable<PanIndiaSummaryBucketResponse> {
    const encryptedParams: any = {
      State: param.State,
      Ageing: param.Ageing,
      SearchTerm: param.searchTerm,
      EmployeeId: this.employeeId()
    };
    const plainParams: any = {
      page: param.page,
      pageSize: param.pageSize
    };
    return this.httpWrapper.get<PanIndiaSummaryBucketResponse>(`${this.apiURL}UnrecognisedInvoice/Common/api/InventoryDashboard/inventory-pan-india-summary?`, {
      encryptedParams: encryptedParams,
      plainParams: plainParams
    })
  }

  _exportRemarksExcel(params: any): Observable<Blob> {
    const encryptedParams: any = { 
      EmployeeId: this.employeeId()
    };
    
    return this.httpWrapper.get(`${this.apiURL}UnrecognisedInvoice/Review/api/inventory/debit-panindia/export`, {
      encryptedParams: encryptedParams, responseType: 'blob'
    });
  }


  //remarks COGS
  _getCOGSPanIndiaBucketSummary(param: any): Observable<COGSPanBucketResponse> {
    const encryptedParams: any = {
      State: param.State,
      Ageing: param.Ageing,
      SearchTerm: param.searchTerm,
      EmployeeId: this.employeeId(),
    };
    const plainParams: any = {
      page: param.page,
      pageSize: param.pageSize
    };
    return this.httpWrapper.get<COGSPanBucketResponse>(`${this.apiURL}UnrecognisedInvoice/Common/api/COGSUnrecognise/pan-india-summary?`, {
      encryptedParams: encryptedParams,
      plainParams: plainParams
    })
  }

  _exportCOGSRemarksExcel(params: any): Observable<Blob> {
    const encryptedParams: any = {
      State: params.State,
      Ageing: params.Ageing,
      SearchTerm: params.searchTerm,
      EmployeeId: this.employeeId()
    };
    
    return this.httpWrapper.get(`${this.apiURL}UnrecognisedInvoice/Review/api/cogs/panindia/export`, {
      encryptedParams: encryptedParams,  responseType: 'blob'
    });
  }


  _upsertRemarks(payload: UpsertRemarksPayload): Observable<any> {
    return this.httpWrapper.post<any>(`${this.apiURL}UnrecognisedInvoice/Review/api/Remarks/upsert`, payload);
  }

  _uploadRemarksExcel(formData: FormData): Observable<any> {     
    return this.httpWrapper.post<any>(`${this.apiURL}UnrecognisedInvoice/Review/api/cogs/panindia/upload-remarks`, formData);
  }

  _getPredefinedRemarks(): Observable<urGetPredefinedRemarks> { 
    return this.httpWrapper.get(`${this.apiURL}UnrecognisedInvoice/Review/api/PredefinedRemarks/paged`)
  }

  // Dynamic Column
  _getDynamicColumns(date: string): Observable<any> {
    const body = { SelectedDate: date };
    return this.httpWrapper.post<any>(`${this.apiURL}UnrecognisedInvoice/Common/api/billing/dynamic-columns`, body);
  }
  
}