import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpEncSrvWrapperService } from '../common/http-enc-srv-wrapper.service';
import { Observable } from 'rxjs';
import { OLSPagedResponse } from '../../models/tradeReceivable-models/trOneLineSummary';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TrOneLineSummaryService {

  private apiURL = environment.apiUrl;

  httpWrapper = inject(HttpEncSrvWrapperService)
   http = inject(HttpClient)

  _getOneLineSummary(month: string, year: string): Observable<any> {
    const params = this.httpWrapper.createParams({
      month: month,
      year: year
    });
    return this.httpWrapper.get<any>(`${this.apiURL}TradeReceivable/api/reports/ols-summary-new`, { params });
  }

  // _getOLSByStatePaged(state: string, month: string, year: string, pageNumber: number, pageSize: number): Observable<OLSPagedResponse> {
  //   const encryptedParams: any = {
  //     state: state,
  //     month: month,
  //     year: year
  //   };
  //   const plainParams: any = {
  //     pageNumber: pageNumber,
  //     pageSize: pageSize
  //   };
  //   return this.httpWrapper.get<OLSPagedResponse>(`${this.apiURL}TradeReceivable/api/reports/ols-by-state-paged`, {
  //     encryptedParams: encryptedParams,
  //     plainParams: plainParams
  //   });
  // }

  _getOLSByStatePaged(
  state: string,
  month: string,
  year: string,
  pageNumber: number,
  pageSize: number
): Observable<OLSPagedResponse> {

  const encryptedParams = { state, month, year };
  const plainParams = { pageNumber, pageSize };

  return this.httpWrapper.get<OLSPagedResponse>(
    `${this.apiURL}TradeReceivable/api/reports/ols-detail-by-state-paged`,
    { encryptedParams, plainParams }
  );
}

}
