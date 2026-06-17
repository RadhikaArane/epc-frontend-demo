import { inject, Injectable } from '@angular/core';
import { HttpEncSrvWrapperService } from '../common/http-enc-srv-wrapper.service';
import { environment } from '../../../../environments/environment';
import { from, Observable, switchMap } from 'rxjs';
import { fagGetGhostAssetAPIResponse, faGhostAsset } from '../../models/fixedAsset-models/fa-ghostAsset';
import { faLocationClassAPIResponse } from '../../models/fixedAsset-models/fa-AssetMasterModel';
import { EncryptionServiceService } from '../common/encryption-service.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FaGhostAssetService {

  constructor() { }

  private httpWrapper = inject(HttpEncSrvWrapperService);
  private encryptionSrv = inject(EncryptionServiceService)
  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);

  _createGhost(formData: FormData): Observable<faGhostAsset> {
    return this.httpWrapper.post<any>(`${this.apiUrl}FixedAssetVerification/api/ghost-assets`, formData);
  }

  getGhostAssets(page: number, pageSize: number): Observable<fagGetGhostAssetAPIResponse> {
    const plainParams: any = {
      page: page,
      pageSize: pageSize
    };
    return this.httpWrapper.get(`${this.apiUrl}FixedAssetVerification/api/ghost-assets`, { plainParams: plainParams });
  }

  getLocationsAndClasses(): Observable<faLocationClassAPIResponse> {
    return this.httpWrapper.get<faLocationClassAPIResponse>(`${this.apiUrl}FixedAssetVerification/api/master-data`);
  }

  // approveGhostAsset(GhostId: number): Observable<any> {
  //   return from(
  //     this.encryptionSrv.encryptSensitiveData({ GhostId: GhostId })
  //       .then(({ encryptedParams, xAesKey, requestId }) => {
  //         const headers = new HttpHeaders()
  //           .set('x-aes-key', xAesKey)
  //           .set('x-request-id', requestId);

  //         const encryptedId = encodeURIComponent(encryptedParams['GhostId']);
  //         console.log("ID", encryptedId);
  //         const url = `${this.apiUrl}FixedAssetVerification/api/nontaggable/${encryptedId}/approve`;

  //         return this.http.put(url, {}, { headers });
  //       })
  //   ).pipe(
  //     switchMap(result => result as Observable<any>)
  //   ); 
  // }

  // rejectGhostAsset(GhostId: number): Observable<any> {
  //    return from(
  //     this.encryptionSrv.encryptSensitiveData({ GhostId: GhostId })
  //       .then(({ encryptedParams, xAesKey, requestId }) => {
  //         const headers = new HttpHeaders()
  //           .set('x-aes-key', xAesKey)
  //           .set('x-request-id', requestId);

  //         const encryptedId = encodeURIComponent(encryptedParams['GhostId']);
  //         console.log("ID", encryptedId);
  //         const url = `${this.apiUrl}FixedAssetVerification/api/nontaggable/${encryptedId}/reject`;

  //         return this.http.put(url, {}, { headers });
  //       })
  //   ).pipe(
  //     switchMap(result => result as Observable<any>)
  //   );  
  // }

  reviewGhostAsset(
  ghostId: number,
  payload: { decision: string; adminRemarks: string }
): Observable<any> {
  return from( 

  
    this.encryptionSrv.encryptSensitiveData({
      GhostId: ghostId,
      decision: payload.decision,
      adminRemarks: payload.adminRemarks
    }).then(({ encryptedParams, xAesKey, requestId }) => {
        debugger
      const headers = new HttpHeaders()
        .set('x-aes-key', xAesKey)
        .set('x-request-id', requestId);

      const encryptedId = encodeURIComponent(encryptedParams['GhostId']);

      const body = {
        decision: encryptedParams['decision'],
        adminRemarks: encryptedParams['adminRemarks']
      };

      
      return this.http.post(
        `${this.apiUrl}FixedAssetVerification/api/ghost-assets/${encryptedId}/review`,
        body,
        { headers }
      );
    })
  ).pipe(
    switchMap(res => res as Observable<any>)
  );
}













_searchGhostAssets(payload: {
  campaignId: number;
  page: number;
  pageSize: number;
}): Observable<any> {

  const body = {
    campaignId: payload.campaignId,
    page: payload.page,     
    pageSize: payload.pageSize
  };

  return this.httpWrapper.post<any>(
    `${this.apiUrl}FixedAssetVerification/api/ghost-assets/search`,
    body
  );
}







 
}
