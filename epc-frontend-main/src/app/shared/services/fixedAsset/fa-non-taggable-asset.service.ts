import { inject, Injectable } from '@angular/core';
import { HttpEncSrvWrapperService } from '../common/http-enc-srv-wrapper.service';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { NonTaggableResponseApi } from '../../../shared/models/fixedAsset-models/fa-NonTaggableReportModel';

@Injectable({
  providedIn: 'root'
})
export class FaNonTaggableAssetService {

  private httpWrapper = inject(HttpEncSrvWrapperService);
  private apiUrl = environment.apiUrl;

  constructor() {}

  _getNonTaggableRequests(params: any): Observable<NonTaggableResponseApi> {

    const plainParams: any = {
      Page: params.page,
      PageSize: params.pageSize
    };

    if (params.status && params.status !== 'All') {
      plainParams.Status = params.status;
    }

    // Logging to Console
    console.log('🚀 [Service] Preparing API Call...');
    console.log('📍 [Service] URL:', this.apiUrl);
    console.log('📋 [Service] Params:', plainParams);

    return this.httpWrapper.get(
      `${this.apiUrl}FixedAssetVerification/api/non-taggable-requests`,
      {
        plainParams: plainParams,
        encryptedParams: {}
      }
    );
  }

  

  _approveRequest(requestId: any) {
  const body = {
    requestId: requestId 
  };

  console.log('✅ [Approve] Payload:', body);

  return this.httpWrapper.post(
    `${this.apiUrl}FixedAssetVerification/api/nontaggable/approve`,
    body,
  );
}

_rejectRequest(requestId: any): Observable<any> {
  const body = {
    requestId: requestId 
  };

  console.log('✅ [Reject] Payload:', body);

  return this.httpWrapper.post(
    `${this.apiUrl}FixedAssetVerification/api/nontaggable/reject`,
    body,
  );
}

}
