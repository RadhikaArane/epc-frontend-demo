import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpEncSrvWrapperService } from '../common/http-enc-srv-wrapper.service';
import { environment } from '../../../../environments/environment';
import { faAssetResponse, faLocationClassAPIResponse } from '../../models/fixedAsset-models/fa-AssetMasterModel';

@Injectable({
  providedIn: 'root'
})
export class FaAssetsMasterSrvService {

  private httpWrapper = inject(HttpEncSrvWrapperService);
  private apiUrl = environment.apiUrl; 

  _getAssets(params: any): Observable<faAssetResponse> {
    const encryptedParams: any = {};
 
    // if (params.locationId) {
    //   encryptedParams.locationId = params.locationId;
    // }

    // if (params.assetClassId) {
    //   encryptedParams.assetClassId = params.assetClassId;
    // }

    // if (params.searchText) {
    //   encryptedParams.searchText = params.searchText;
    // }


if (params.locationId !== null && params.locationId !== undefined) {
    encryptedParams.locationId = params.locationId;
  }

  if (params.assetClassId !== null && params.assetClassId !== undefined) {
    encryptedParams.assetClassId = params.assetClassId;
  }

  if (params.campaignId !== null && params.campaignId !== undefined) {
    encryptedParams.campaignId = params.campaignId;
  }

  if (params.assetNumber !== null && params.assetNumber !== undefined) {
    encryptedParams.assetNumber = params.assetNumber;
  }


  //   if (params.locationId !== null && params.locationId !== undefined) {
  //   encryptedParams.locationId = params.locationId;
  // }

  // if (params.classId !== null && params.classId !== undefined) {
  //   encryptedParams.classId = params.classId;
  // }

  // if (params.searchText !== null && params.searchText !== undefined && params.searchText !== '') {
  //   encryptedParams.searchText = params.searchText;
  // }


    const plainParams: any = {
      page: params.page,
      pageSize: params.pageSize,

    };

    return this.httpWrapper.get(`${this.apiUrl}FixedAssetVerification/api/master-assets/search`, {
      encryptedParams: encryptedParams,
      plainParams: plainParams
    });
  }


  _getLocationsAndClasses(): Observable<faLocationClassAPIResponse> {
    return this.httpWrapper.get(`${this.apiUrl}FixedAssetVerification/api/master-data`);
  }

  _getCampaignsName(): Observable<faLocationClassAPIResponse> {
    return this.httpWrapper.get(`${this.apiUrl}FixedAssetVerification/api/campaigns`);
  }

  // _getAssetById(assetId: number): Observable<any> {
  //   const params = this.httpWrapper.createParams({
  //     assetId: assetId
  //   })
  //   return this.httpWrapper.get(`${this.apiUrl}FixedAssetVerification/api/assets`, { params });
  // }

}