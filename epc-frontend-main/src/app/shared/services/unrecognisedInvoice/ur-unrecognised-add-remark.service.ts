import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { HttpEncSrvWrapperService } from '../common/http-enc-srv-wrapper.service';
import { AuthService } from '../common/auth.service';
import {
  UpsertRemarksPayload,
  urGetPredefinedRemarks,
  EncryptedParams,
} from '../../models/unrecognisedInvoice-models/remarks';
import { PanIndiaSummaryBucketResponse } from '../../models/unrecognisedInvoice-models/Inventory';
import { HttpContext } from '@angular/common/http';
import { SKIP_LOADER } from '../../core/interceptors/epc-loader.interceptor';

@Injectable({
  providedIn: 'root',
})
export class UrUnrecognisedAddRemarkServiceService {
  private apiURL = environment.apiUrl;

  httpWrapper = inject(HttpEncSrvWrapperService);
  authSrv = inject(AuthService);

  employeeId = signal(this.authSrv.userDetails?.employeeId);

  constructor() {}

  // Get Registration Number
  _getRegistrationNumbers(params: any): Observable<any> {
    const currentUserId =
      this.authSrv.userDetails?.userId ||
      this.authSrv.userDetails?.employeeId ||
      '';

    const encryptedParams: any = {
      DashboardType: params?.DashboardType || 'Cogs',
      SummaryType: params?.SummaryType || 'PanIndia',
      EmployeeId: this.employeeId() || '',
      State: params?.State || '',
      AreaName: params?.AreaName || '',
      Id: String(currentUserId),

      SearchTerm: params?.SearchTerm || '',
    };

    const plainParams = {
      page: params.page,
      pageSize: params.pageSize,
    };

    return this.httpWrapper.get(
      `${this.apiURL}UnrecognisedInvoice/Common/api/dashboard/minimal`,
      {
        encryptedParams: encryptedParams,
        plainParams: plainParams,
        context: new HttpContext().set(SKIP_LOADER, true),
      },
    );
  }

  _getPanIndiaBucketSummary(
    param: any,
  ): Observable<PanIndiaSummaryBucketResponse> {
    const encryptedParams: any = {
      State: param.State,
      Ageing: param.Ageing,
      SearchTerm: param.searchTerm,
      EmployeeId: this.employeeId(),
    };
    const plainParams: any = {
      page: param.page,
      pageSize: param.pageSize,
    };
    return this.httpWrapper.get<PanIndiaSummaryBucketResponse>(
      `${this.apiURL}UnrecognisedInvoice/Common/api/COGSUnrecognise/pan-india-summary?`,
      {
        encryptedParams: encryptedParams,
        plainParams: plainParams,
      },
    );
  }

  _exportRemarksExcel(params: any): Observable<Blob> {
    console.log('📥 [Service] Received params from component:', params);

    const isCogs = (params.DashboardType || '').toLowerCase() === 'cogs';
    let endpointUrl = '';
    
    // Generate a valid date string fallback just in case it's missing
    const validDate = params.SelectedDate || new Date().toISOString().split('T')[0];

    // Initialize the base payload with common properties explicitly 
    const encryptedPayload: any = {
      EmployeeId: String(this.employeeId() || ''),
      State: params.State || '',
      SelectedDate: validDate
    };

    // Dynamically set URL and the specific Ageing key
    if (isCogs) {
      endpointUrl = `${this.apiURL}UnrecognisedInvoice/Review/api/cogs/panindia/export`;
      encryptedPayload.Ageing = params.Ageing || ''; // COGS uses 'Ageing'
    } else {
      endpointUrl = `${this.apiURL}UnrecognisedInvoice/Review/api/inventory/debit-panindia/export`;
      encryptedPayload.AgeingBucket = params.Ageing || ''; // Inventory uses 'AgeingBucket'
    }

    // ─── LOGGING ───
    console.log(`🔗 [Service] Request Type: ${isCogs ? 'COGS' : 'INVOICE'}`);
    console.log(`📍 [Service] Target URL: ${endpointUrl}`);
    console.log(`📤 [Service] Encrypted Params Payload:`, encryptedPayload);
    // ───────────────

    return this.httpWrapper.get(
      endpointUrl,
      {
        encryptedParams: encryptedPayload, 
        responseType: 'blob',
        context: new HttpContext().set(SKIP_LOADER, true),
      }
    );
  }

  _upsertRemarks(payload: UpsertRemarksPayload): Observable<any> {
    return this.httpWrapper.post<any>(
      `${this.apiURL}UnrecognisedInvoice/Review/api/Remarks/upsert`,
      payload,
    );
  }

  _uploadRemarksExcel(formData: FormData): Observable<any> {
    return this.httpWrapper.post<any>(
      `${this.apiURL}UnrecognisedInvoice/Review/api/cogs/panindia/upload-remarks`,
      formData,
    );
  }

  _getPredefinedRemarks(): Observable<urGetPredefinedRemarks> {
    return this.httpWrapper.get<urGetPredefinedRemarks>(
      `${this.apiURL}UnrecognisedInvoice/Review/api/PredefinedRemarks/paged`,
    );
  }

  _reviewUpsertRemarks(payload: any): Observable<any> {
    return this.httpWrapper.post<any>(
      `${this.apiURL}UnrecognisedInvoice/Review/api/Remarks/review-upsert`,
      payload,
    );
  }
}
