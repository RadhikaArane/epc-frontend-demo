import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpEncSrvWrapperService } from '../common/http-enc-srv-wrapper.service';
import { environment } from '../../../../environments/environment';
import { NonVerifiedAsset } from '../../models/fixedAsset-models/fa-non-verified-asset.model';

@Injectable({
  providedIn: 'root'
})
export class FaNonVerifiedAssetSrvService {

  private httpWrapper = inject(HttpEncSrvWrapperService);
  private apiUrl = environment.apiUrl;

  getNonVerifiedAssets(params: {
    CampaignId: number;
    page: number;
    pageSize: number;
  }): Observable<NonVerifiedAsset> {

    const query = new URLSearchParams({
      CampaignId: params.CampaignId.toString(),
      Page: params.page.toString(),
      PageSize: params.pageSize.toString()
    }).toString();

    return this.httpWrapper.get<NonVerifiedAsset>(
      `${this.apiUrl}FixedAssetVerification/api/not-verified-assets?${query}`
    );
  }



// exportNonVerifiedAssets(campaignId: number) {
//   return this.httpWrapper.get(
//     `${this.apiUrl}FixedAssetVerification/api/not-verified-assets/download`,
//     {
//       encryptedParams: {
//         CampaignId: campaignId
//       },
//       responseType: 'blob'
//     }
//   );
// }





exportNonVerifiedAssets(campaignId: number) {
  const params = this.httpWrapper.createParams({
    CampaignId: campaignId
  });

  return this.httpWrapper.get(
    `${this.apiUrl}FixedAssetVerification/api/not-verified-assets/download`,
    {
      params,
      responseType: 'blob'
    }
  );
}


}
