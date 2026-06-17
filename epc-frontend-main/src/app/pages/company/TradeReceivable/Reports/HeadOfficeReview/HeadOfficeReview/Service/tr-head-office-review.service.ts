import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpEncSrvWrapperService } from '../common/http-enc-srv-wrapper.service';
import { Observable } from 'rxjs';
import { HORPmCompResModel } from '../../models/tradeReceivable-models/headOfficeReview';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TrHeadOfficeReviewService {

  private apiURL = environment.apiUrl;

  httpWrapper = inject(HttpEncSrvWrapperService)
  http = inject(HttpClient)

  constructor() { }

  _getHOR_PMComp(Date:string): Observable<HORPmCompResModel> {
    const params = this.httpWrapper.createParams({
      asOn: Date,
    });
    return this.httpWrapper.get<HORPmCompResModel>(`${this.apiURL}TradeReceivable/api/head-office/pm-comp`, { params });
  }

  _getProject_Market(): Observable<any>{
    return this.http.get<any>(`http://localhost:3000/GetProjectMarket`)
  }

  _getProject_Market_Additional(): Observable<any>{
    return this.http.get<any>(`http://localhost:3000/ProjectMarketAddition`)
  }
}
