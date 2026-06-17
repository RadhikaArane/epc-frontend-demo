import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpEncSrvWrapperService } from '../common/http-enc-srv-wrapper.service';
import { Observable } from 'rxjs';
import { HttpContext } from '@angular/common/http';
import { SKIP_LOADER } from '../../core/interceptors/epc-loader.interceptor';

@Injectable({
  providedIn: 'root'
})
export class TrWorkingFilesService {

  private apiURL = environment.apiUrl;
  httpWrapper = inject(HttpEncSrvWrapperService)

  constructor() { }

 _getDebitSummary(month: string, year: string): Observable<any> { 
    const params = this.httpWrapper.createParams({
      month: month,
      year: year
    });
    return this.httpWrapper.get(`${this.apiURL}TradeReceivable/api/reports/debit-summary`, { params });
  }
 
  _getDebitByStatePaged(state: string, month: string, year: string, pageNumber: number, pageSize: number): Observable<any> {  
    const encryptedParams: any = {
      state: state,
      month: month,
      year: year
    };
    const plainParams: any = {
      pageNumber: pageNumber,
      pageSize: pageSize
    };
    return this.httpWrapper.get(`${this.apiURL}TradeReceivable/api/reports/debit-by-state-paged`, {
      encryptedParams: encryptedParams,
      plainParams: plainParams,
      context: new HttpContext().set(SKIP_LOADER, true)
    });
  }


  //credit
  _getCreditSummary(month: string, year: string): Observable<any> { 
    const params = this.httpWrapper.createParams({
      month: month,
      year: year
    }); 
    return this.httpWrapper.get(`${this.apiURL}TradeReceivable/api/reports/credit-summary`, { params });
  }
 
  _getCredirByStatePaged(state: string, month: string, year: string, pageNumber: number, pageSize: number): Observable<any> {  
    const encryptedParams: any = {
      state: state,
      month: month,
      year: year
    };
    const plainParams: any = {
      pageNumber: pageNumber,
      pageSize: pageSize
    };
    return this.httpWrapper.get(`${this.apiURL}TradeReceivable/api/reports/credit-by-state-paged`, {
      encryptedParams: encryptedParams,
      plainParams: plainParams,
      context: new HttpContext().set(SKIP_LOADER, true)
    });
  }
}
