import { Injectable, inject } from '@angular/core';
import { Observable, from, switchMap } from 'rxjs';
import { HttpEncSrvWrapperService } from '../common/http-enc-srv-wrapper.service';
import { EncryptionServiceService } from '../common/encryption-service.service';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FaExcelMasterReportSrvService {

  private httpWrapper = inject(HttpEncSrvWrapperService);
  private encryptionSrv = inject(EncryptionServiceService);
  private apiUrl = environment.apiUrl;

  // ✅ MASTER STATUS EXPORT (ENCRYPTED CampaignId)
  // exportMasterStatus(campaignId: number): Observable<Blob> {
  //   return from(
  //     this.encryptionSrv.encryptSensitiveData({
  //       CampaignId: campaignId
  //     })
  //   ).pipe(
  //     switchMap(({ encryptedParams, xAesKey }) =>
  //       this.httpWrapper.get(
  //         `${this.apiUrl}FixedAssetVerification/api/reports/master-status-export`,
  //         {
  //           encryptedParams,
  //           headers: {
  //             'x-aes-key': xAesKey
  //           },
  //           responseType: 'blob'
  //         }
  //       )
  //     )
  //   );
  // }







exportMasterStatus(campaignId: number): Observable<Blob> {
  const params = this.httpWrapper.createParams({
    CampaignId: campaignId
  });

  return this.httpWrapper.get(
    `${this.apiUrl}FixedAssetVerification/api/reports/master-status-export`,
    {
      params,
      responseType: 'blob'
    }
  );
}

























  // ✅ GHOST ASSET EXPORT (ENCRYPTED CampaignId)
//   exportGhostAssets(campaignId: number): Observable<Blob> {
//     return from(
//       this.encryptionSrv.encryptSensitiveData({
//         CampaignId: campaignId
//       })
//     ).pipe(
//       switchMap(({ encryptedParams, xAesKey }) =>
//         this.httpWrapper.get(
//           `${this.apiUrl}FixedAssetVerification/api/reports/ghost-export`,
//           {
//             encryptedParams,
//             headers: {
//               'x-aes-key': xAesKey
//             },
//             responseType: 'blob'
//           }
//         )
//       )
//     );
//   }
// }








exportGhostAssets(campaignId: number) {
  const params = this.httpWrapper.createParams({
    CampaignId: campaignId
  });

  return this.httpWrapper.get(
    `${this.apiUrl}FixedAssetVerification/api/reports/ghost-export`,
    {
      params,
      responseType: 'blob'
    }
  );
}
}