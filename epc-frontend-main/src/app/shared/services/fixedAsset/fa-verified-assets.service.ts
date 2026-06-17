import { inject, Injectable } from '@angular/core';
import { HttpEncSrvWrapperService } from '../common/http-enc-srv-wrapper.service';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { verifiedResponse } from '../../models/fixedAsset-models/fa-VerifiedAssetsModelmode';

@Injectable({
  providedIn: 'root'
})
export class FaVerifiedAssetsService {

  private httpWrapper = inject(HttpEncSrvWrapperService);
  private apiUrl = environment.apiUrl; 

   constructor() { }
 
  _getAssets(params: any): Observable<verifiedResponse> {
    const encryptedParams: any = {};
 
    const plainParams: any = {
      PageNumber: params.page,
      PageSize: params.pageSize,
    };

    // 1. Encrypted Params 

    if (params.campaignId && params.campaignId !== 0) {
      encryptedParams.CampaignId = params.campaignId;
    }
    if (params.locationId && params.locationId !== 'All') {
      encryptedParams.LocationId = params.locationId;
    }
    if (params.classId && params.classId !== 'All') {
      encryptedParams.AssetClass = params.classId;
    }
    if (params.searchText) {
      encryptedParams.searchText = params.searchText;
    }
    // 3. Other Filters (Method, Status) - if you implement them later
    if (params.method && params.method !== 'All') {
      plainParams.Method = params.method;
    }
    if (params.status && params.status !== 'All') {
      plainParams.Status = params.status;
    }

    return this.httpWrapper.get(`${this.apiUrl}FixedAssetVerification/api/verified-assets`, {
      encryptedParams: encryptedParams,
      plainParams: plainParams
    });
  }


  // _getLocationsAndClasses(): Observable<faLocationClassAPIResponse> {
  //   return this.httpWrapper.get(`${this.apiUrl}FixedAssetVerification/api/master-data`);
  // }

   _getAssetById(assetNumber: string): Observable<verifiedResponse> {
    //  const params = this.httpWrapper.createParams({
    //    AssetNumber: assetNumber
    //  })

    const plainParams = { AssetNumber: assetNumber };

     return this.httpWrapper.get(`${this.apiUrl}FixedAssetVerification/api/verified-assets`, { plainParams: plainParams });
   }


   _getCampaigns(): Observable<any> {
    const params = {};
    return this.httpWrapper.get(`${this.apiUrl}FixedAssetVerification/api/campaigns`, { params }); 
  }
  






exportVerifiedAssets(campaignId: number) {
  const params = this.httpWrapper.createParams({
    CampaignId: campaignId
  });

  return this.httpWrapper.get(
    `${this.apiUrl}FixedAssetVerification/api/verified-assets/download-excel`,
    {
      params,
      responseType: 'blob'
    }
  );
}














}