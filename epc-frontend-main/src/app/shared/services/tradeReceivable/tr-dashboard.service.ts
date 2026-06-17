import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpEncSrvWrapperService } from '../common/http-enc-srv-wrapper.service';
import { Observable } from 'rxjs';
import { CollectionsResponse, MonthlyUploadStatusResponse, SalesResponse } from '../../models/tradeReceivable-models/trDashboard';

@Injectable({
  providedIn: 'root'
})
export class TrDashboardService {

  private apiURL = environment.apiUrl;

  httpWrapper = inject(HttpEncSrvWrapperService)

  constructor() { }

  _getMonthlyUploadStatus(month: string, year: number): Observable<MonthlyUploadStatusResponse> {
    const params = this.httpWrapper.createParams({ Month: month, Year: year });
    return this.httpWrapper.get<MonthlyUploadStatusResponse>(`${this.apiURL}TradeReceivable/api/reports/monthly-upload-status`, { params });
  }

  _getDashboardReceivables(data: any): Observable<any> {
    const params = this.httpWrapper.createParams({
      PortalStatusDate: data.portalStatusDate,
      State: data.state,
      Month:data.month,
      Year:data.year,
      Unit: data.unit
    });
    return this.httpWrapper.get(`${this.apiURL}TradeReceivable/api/dashboard/receivables`, { params });
  }

  _getReceivablesPortalDates(data: any): Observable<any> {
    const params = this.httpWrapper.createParams({
      State: data.state,
      Month:data.month,
      Year:data.year,
    });
    return this.httpWrapper.get(`${this.apiURL}TradeReceivable/api/dashboard/available-dates`, { params });
  }


  _getDashboardCollections(year:number, unit: string): Observable<CollectionsResponse> {
    const params = this.httpWrapper.createParams({
      Year:year,
      unit: unit
    });
    return this.httpWrapper.get<CollectionsResponse>(`${this.apiURL}TradeReceivable/api/collections/dashboard`, { params });
  }

  _getDashboardSales(month: string, year: number, unit: string, state: string): Observable<SalesResponse> {
   const params = this.httpWrapper.createParams({
    Month: month,
    Year: year,
    Unit: unit,
    State: state
  });
    return this.httpWrapper.get<SalesResponse>(`${this.apiURL}TradeReceivable/api/SalesData/get-sales-dashboard`, { params });
  }

} 