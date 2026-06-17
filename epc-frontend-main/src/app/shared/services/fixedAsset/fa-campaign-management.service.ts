import { param } from 'jquery';

import { inject, Injectable } from '@angular/core';
import { from, Observable, switchMap } from 'rxjs';
import { HttpEncSrvWrapperService } from '../common/http-enc-srv-wrapper.service';
import { environment } from '../../../../environments/environment';
import { EncryptionServiceService } from '../common/encryption-service.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FixassetCreatePayload, Fixassetmodel } from '../../models/fixedAsset-models/fixedassets';

@Injectable({
  providedIn: 'root',
})
export class FaCampaignManagementService {
  private httpWrapper = inject(HttpEncSrvWrapperService);
  private encryptionSrv = inject(EncryptionServiceService);
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  _getCampaigns(param: any) {
    const params = this.httpWrapper.createParams({
      status: param.status,
    });
    return this.httpWrapper.get<Fixassetmodel[]>(
      `${this.apiUrl}FixedAssetVerification/api/campaigns`,
      { params },
    );
  }
    // adding package prevoius any 
  _createCampaign(payload: FixassetCreatePayload) {
    return this.httpWrapper.post(
      `${this.apiUrl}FixedAssetVerification/api/campaigns`,
      payload,
    );
  }

  _activateCampaign(payload: any): Observable<any> {
    return this.httpWrapper.put(
      `${this.apiUrl}FixedAssetVerification/api/campaigns/activate`,
      payload,
    );
  }

  _deactivateCampaign(payload: any): Observable<any> {
    return this.httpWrapper.put(
      `${this.apiUrl}FixedAssetVerification/api/campaigns/deactivate`,
      payload,
    );
  }

  _updateCampaign(payload: any): Observable<any> {
    return this.httpWrapper.put(
      `${this.apiUrl}FixedAssetVerification/api/campaigns`,
      payload,
    );
  }

  _deleteCampaign(campaignId: any): Observable<any> {
    const params = this.httpWrapper.createParams({
      CampaignId: campaignId.toString(),
    });
    return this.httpWrapper.delete(
      `${this.apiUrl}FixedAssetVerification/api/campaigns`,
      { params },
    );
  }

  
 _getExcelDownload(campaignId:any): Observable<any> { 
    const params = this.httpWrapper.createParams({
        CampaignId: campaignId,
      }); 
    return this.httpWrapper.get<Blob>(`${this.apiUrl}FixedAssetVerification/api/verification-dashboard-download`,{ params, responseType: 'blob' });
  }
}
