import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.prod';
import { HttpEncSrvWrapperService } from '../common/http-enc-srv-wrapper.service';
import { CreatePredefinedRemarkRequest, PredefinedRemarksPagedResponse } from '../../models/unrecognisedInvoice-models/reports';
import { from, Observable, switchMap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EncryptionServiceService } from '../common/encryption-service.service';

@Injectable({
  providedIn: 'root'
})
export class UrReportsService {

  constructor() { }

  private apiURL = environment.apiUrl;
  http = inject(HttpClient);
  httpWrapper = inject(HttpEncSrvWrapperService);
  encryptionSrv = inject(EncryptionServiceService);

  // GET paged
  _getPredefinedRemarks(page: number, pageSize: number): Observable<PredefinedRemarksPagedResponse> {
    const plainParams: any = {
      page: page,
      pageSize: pageSize,
    };
    return this.httpWrapper.get<PredefinedRemarksPagedResponse>(`${this.apiURL}UnrecognisedInvoice/Review/api/PredefinedRemarks/paged?`, {
      plainParams: plainParams
    })
  }

  // POST create
  _createPredefinedRemark(payload: CreatePredefinedRemarkRequest): Observable<any> {
    return this.httpWrapper.post<PredefinedRemarksPagedResponse>(`${this.apiURL}UnrecognisedInvoice/Review/api/PredefinedRemarks/create`, payload)

  }

  // PUT update
  _updatePredefinedRemark(payload: {
    id: string;
    billingRRPendingReason: string;
    actionToBeTakenForCompletionRR: string;
  }): Observable<any> {
    return this.httpWrapper.post<PredefinedRemarksPagedResponse>(`${this.apiURL}UnrecognisedInvoice/Review/api/PredefinedRemarks/update`, payload)
  }

  // DELETE
  // _deletePredefinedRemark(id: number): Observable<any> {
  //   const url = `${this.apiURL}UnrecognisedInvoice/Review/api/PredefinedRemarks/delete/${id}`;
  //   return this.httpWrapper.delete<any>(url);
  // }


  _deletePredefinedRemark(id: number): Observable<any> {
    return from(
      this.encryptionSrv
        .encryptSensitiveData({
          Id: id,
        })
        .then(({ encryptedParams, xAesKey, requestId }) => {
          debugger;
          const headers = new HttpHeaders()
            .set('x-aes-key', xAesKey)
            .set('x-request-id', requestId);

          // const encryptedId = encodeURIComponent(encryptedParams[']);

          const encryptedRemarkNo = encryptedParams['Id'];
          const urlSafeEncrypted = this.encodeBase64ForUrl(encryptedRemarkNo);

          return this.http.delete(
            `${this.apiURL}UnrecognisedInvoice/Review/api/PredefinedRemarks/delete/${urlSafeEncrypted}`,
            { headers },
          );
        }),
    ).pipe(switchMap((res) => res as Observable<any>));
  }

  private encodeBase64ForUrl(base64String: string): string {
    return base64String.replace(/\+/g, '%2B').replace(/\//g, '%2F');
    // Leave = as is
  }
}
