import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpEncSrvWrapperService } from '../common/http-enc-srv-wrapper.service';
import { Observable } from 'rxjs';
import { HORPmCompResModel, OMRemark, openMarketComparison, OpenMarketItems, PMRemarksResponse } from '../../models/tradeReceivable-models/headOfficeReview';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TrHeadOfficeReviewService {

  private apiURL = environment.apiUrl;

  httpWrapper = inject(HttpEncSrvWrapperService);
  http = inject(HttpClient)

  constructor() { }

  _getOpenMarketData(month: number, year: number, unit:string): Observable<OpenMarketItems> {
  const params = this.httpWrapper.createParams({
    Month: month,
    Year: year,
    Unit: unit
  });

  return this.httpWrapper.get<OpenMarketItems>(
    `${this.apiURL}TradeReceivable/api/TradeReceivables/open-market-data`,
    { params }
  );
}

// ✅ Get Open Market Remarks Data (Now expects an Array directly!)
  _getOpenMarketRemarks(month: number, year: number, unit: string): Observable<OMRemark[]> {
    const params = this.httpWrapper.createParams({
      Month: month,
      Year: year,
      Unit: unit
    });
    return this.httpWrapper.get<OMRemark[]>(
      `${this.apiURL}TradeReceivable/api/TradeReceivables/open-market-remarks`,
      { params }
    );
  }

  // ✅ Update Open Market Remarks Data (Bulk PUT)
  _updateOpenMarketRemarks(payload: any): Observable<any> {
    return this.httpWrapper.put<any>(
      `${this.apiURL}TradeReceivable/api/TradeReceivables/open-market-remarks/bulk`,
      payload
    );
  }


  _getOpenAdditional(month: number, year: number, state:string, unit:string): Observable<any> {
  const params = this.httpWrapper.createParams({
    Month: month,
    Year: year,
    State: state,
    Unit: unit
  });

  return this.httpWrapper.get<any>(
    `${this.apiURL}TradeReceivable/api/TradeReceivables/opn-add-data`,
    { params }
  );
}


  _getProjectMarketData(month: number, year: number, unit:string): Observable<any> {
  const params = this.httpWrapper.createParams({
    Month: month,
    Year: year,
    Unit: unit
  });

  return this.httpWrapper.get<any>(
    `${this.apiURL}TradeReceivable/api/TradeReceivables/project-market-data`,
    { params }
  );
} 

// ✅ Get Remarks Data
  _getProjectMarketRemarks(month: number, year: number, unit: string): Observable<PMRemarksResponse> {
    const params = this.httpWrapper.createParams({
      Month: month,
      Year: year,
      Unit: unit
    });
    return this.httpWrapper.get<PMRemarksResponse>(
      `${this.apiURL}TradeReceivable/api/TradeReceivables/project-market-remarks`,
      { params }
    );
  }

  // ✅ Update Remarks Data (Bulk PUT)
  _updateProjectMarketRemarks(payload: any): Observable<any> {
    return this.httpWrapper.put<any>(
      `${this.apiURL}TradeReceivable/api/TradeReceivables/project-market-remarks/bulk`,
      payload
    );
  }


  _getProjectMarketAdditional(month: number, year: number, unit:string): Observable<any> {
  const params = this.httpWrapper.createParams({
    Month: month,
    Year: year,
    Unit:unit
  });

  return this.httpWrapper.get<any>(
    `${this.apiURL}TradeReceivable/api/TradeReceivables/pm-addi-data`,
    { params }
  );
}
 
_getOpenMarketComparison(month: number, year: number) {
  const params = this.httpWrapper.createParams({
    Month: month,
    Year: year,
    // Unit: unit
  });

  return this.httpWrapper.get<openMarketComparison>(
    `${this.apiURL}TradeReceivable/api/TradeReceivables/openmarketcomp`,
    { params }
  );
}

_getInstitutionalMarket(month: number, year: number, unit:string): Observable<any> {
  const params = this.httpWrapper.createParams({
    Month: month,
    Year: year,
    Unit:unit
  });

  return this.httpWrapper.get<any>(
    `${this.apiURL}TradeReceivable/api/TradeReceivables/institutional-market`,
    { params }
  );
}

_getSalesData(month: number, year: number, unit: string): Observable<any> {

  const params = this.httpWrapper.createParams({
    Month: month,
    Year: year,
    Unit: unit
  });
  return this.httpWrapper.get<any>(
    `${this.apiURL}TradeReceivable/api/TradeReceivables/sales-data`,
    { params }
  );
}

// ✅ PM Comparison (Last 6 Months)
  _getHOR_PMComp(month: string, year: string, unit:string): Observable<HORPmCompResModel> {
    const url = `${this.apiURL}TradeReceivable/api/TradeReceivables/pm-comp-data-6months?Month=${month}&Year=${year}&Unit=${unit}`;
    
    // Log active for debugging
    console.log('📤 [Service] Fetching PM Comp Data:', url);

    return this.httpWrapper.get<HORPmCompResModel>(url);
  }

  // ✅ Collections Data API
  _getCollectionsData(month: string, year: string, unit: string): Observable<any> {
    const url = `${this.apiURL}TradeReceivable/api/TradeReceivables/collections-data?Month=${month}&Year=${year}&Unit=${unit}`;
    
    console.log('📤 [Service] Fetching Collections Data:', url);
    
    return this.httpWrapper.get<any>(url);
  }




}
