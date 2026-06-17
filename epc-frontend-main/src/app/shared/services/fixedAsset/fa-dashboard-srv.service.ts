import { inject, Injectable } from '@angular/core'; 
import { Observable } from 'rxjs';
import { HttpEncSrvWrapperService } from '../common/http-enc-srv-wrapper.service';
import { environment } from '../../../../environments/environment';
import { DashboardCountResponse, DashboardResponse } from '../../models/fixedAsset-models/fa-dashBoardmodelModel';

@Injectable({
  providedIn: 'root'
}) 
export class FaDashboardSrvService {

  constructor() { }

  private httpWrapper = inject(HttpEncSrvWrapperService)
  private apiUrl = environment.apiUrl;

  // _getDashboardSummary():Observable<DashboardResponse>{
  //   return  this.httpWrapper.get<DashboardResponse>(`${this.apiUrl}FixedAssetVerification/api/dashboard/summary`);
  // }





  // _postDashboardSummary(payload: any): Observable<DashboardResponse> {
  //   return this.httpWrapper.post<DashboardResponse>(
  //     `${this.apiUrl}FixedAssetVerification/api/dashboard/summary`,
  //     payload
  //   );
  // }








// _getDashboardSummary(params: {
//     CampaignId: number,
//     page: number,
//     pageSize: number
//   }): Observable<DashboardResponse> {

//     const query = new URLSearchParams({
//       CampaignId: params.CampaignId.toString(),
//       page: params.page.toString(),
//       pageSize: params.pageSize.toString()
//     }).toString();

//     return this.httpWrapper.get<DashboardResponse>(
//       `${this.apiUrl}FixedAssetVerification/api/dashboard/summary?${query}`
//     );
//   }
//   _getDashboardCount():Observable<DashboardCountResponse>{
//     return  this.httpWrapper.get<DashboardCountResponse>(`${this.apiUrl}FixedAssetVerification/api/dashboard/summary/overall`);
//   }
// }

// olddd  coes //////////////************************ */




_getDashboardSummary(params: {
  CampaignId: number;
  page: number;
  pageSize: number;
}): Observable<DashboardResponse> {

  return this.httpWrapper.get<DashboardResponse>(
    `${this.apiUrl}FixedAssetVerification/api/dashboard/summary`,
    {
      encryptedParams: {
        CampaignId: params.CampaignId
      },
      plainParams: {
        page: params.page,
        pageSize: params.pageSize
      }
    }
  );
}

_getDashboardCount(campaignId: number): Observable<DashboardCountResponse> {
  return this.httpWrapper.get<DashboardCountResponse>(
    `${this.apiUrl}FixedAssetVerification/api/desktop/campaignwise-dashboard`,
    {
      encryptedParams: { campaignId }
    }
  );
}

 _getExcelDownload(campaignId:any): Observable<any> { 
    const params = this.httpWrapper.createParams({
        CampaignId: campaignId,
      }); 
    return this.httpWrapper.get<Blob>(`${this.apiUrl}FixedAssetVerification/api/verification-dashboard-download`,{ params, responseType: 'blob' });
  }

}