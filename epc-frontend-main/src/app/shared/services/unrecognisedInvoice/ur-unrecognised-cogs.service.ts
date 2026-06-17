import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpEncSrvWrapperService } from '../common/http-enc-srv-wrapper.service';
import { Observable } from 'rxjs';
import { COGSAreaBucketResponse, COGSAreaWiseSummaryResponse, COGSPanBucketResponse, COGSPanIndiaSummaryResponse, COGSStateBucketResponse, COGSStateWiseSummaryResponse } from '../../models/unrecognisedInvoice-models/inventoryCOGS';
import { AuthService } from '../common/auth.service';
import { HttpContext } from '@angular/common/http';
import { SKIP_LOADER } from '../../core/interceptors/epc-loader.interceptor';

@Injectable({
  providedIn: 'root'
})
export class UrUnrecognisedCOGSService {

  private apiURL = environment.apiUrl;
 
  httpWrapper = inject(HttpEncSrvWrapperService)
  authSrv = inject(AuthService)
  
    employeeId = signal(this.authSrv.userDetails?.employeeId);

  constructor() { }

  // Dynamic Columns
  _getDynamicRemarkColumns(date: string): Observable<any> {
    return this.httpWrapper.post<any>(
      `${this.apiURL}UnrecognisedInvoice/Common/api/billing/dynamic-columns`,
      { SelectedDate: date }
    );
  }

  _getCOGSPanIndiaSummary(selectedDate: unknown): Observable<COGSPanIndiaSummaryResponse> {
    const params = this.httpWrapper.createParams({
      EmployeeId:this.employeeId(),
      SelectedDate: selectedDate
    });
    return this.httpWrapper.get<COGSPanIndiaSummaryResponse>(`${this.apiURL}UnrecognisedInvoice/Common/api/COGSUnrecognise/combined-aging-summary`,{ params })
  }

  _getCOGSPanIndiaBucketSummary(param: any): Observable<COGSPanBucketResponse> {
    const encryptedParams: any = {
      State: param.State,
      Ageing: param.Ageing,
      SearchTerm: param.searchTerm,
      EmployeeId:this.employeeId(),
      SelectedDate: param.date
    };
    const plainParams: any = {
      page: param.page,
      pageSize: param.pageSize
    };
    return this.httpWrapper.get<COGSPanBucketResponse>(`${this.apiURL}UnrecognisedInvoice/Common/api/COGSUnrecognise/pan-india-summary?`, {
      encryptedParams: encryptedParams,
      plainParams: plainParams
    })
  }

   _excelCOGSPanIndiaBucketSummary(param: any): Observable<any> {
      const encryptedParams: any = {
        State: param.State,
        Ageing: param.Ageing, 
        EmployeeId: this.employeeId()
      }; 
      return this.httpWrapper.get<any>(`${this.apiURL}UnrecognisedInvoice/Common/api/COGSUnrecognise/pan-india-summary/export?`, {
        encryptedParams: encryptedParams, responseType: 'blob', context: new HttpContext().set(SKIP_LOADER, true)
      })
    }



  _getCOGSStateWiseSummary(param: any): Observable<COGSStateWiseSummaryResponse> {
    const encryptedParams: any = {
      State: param.state, 
      EmployeeId:this.employeeId(),
      SelectedDate: param.date
    };
    const plainParams: any = {
      page: param.page,
      pageSize: param.pageSize
    };

    return this.httpWrapper.get<COGSStateWiseSummaryResponse>(
      `${this.apiURL}UnrecognisedInvoice/Common/api/COGSUnrecognise/state-wise-aging-summary`,
      { encryptedParams: encryptedParams,
        plainParams: plainParams }
    );
  }

  _getCOGSStateWiseBucketSummary(param: any): Observable<COGSStateBucketResponse> {
    const encryptedParams: any = {
      State: param.State,
      StageName: param.Stage,
      Ageing: param.Ageing,
      SearchTerm: param.searchTerm,
      EmployeeId:this.employeeId(),
      SelectedDate: param.date
    };
    const plainParams: any = {
      page: param.page,
      pageSize: param.pageSize
    };

    return this.httpWrapper.get<COGSStateBucketResponse>(
      `${this.apiURL}UnrecognisedInvoice/Common/api/COGSUnrecognise/state-wise-staging`,
      {
        encryptedParams: encryptedParams,
        plainParams: plainParams
      }
    );
  }

  _excelCOGSStateWiseBucketSummary(param: any): Observable<any> {
      const encryptedParams: any = {
        State: param.State,
        Ageing: param.Ageing, 
        EmployeeId: this.employeeId()
      }; 
      return this.httpWrapper.get<any>(`${this.apiURL}UnrecognisedInvoice/Common/api/COGSUnrecognise/state-wise-staging/export?`, {
        encryptedParams: encryptedParams, responseType: 'blob', context: new HttpContext().set(SKIP_LOADER, true)
      })
    }


  _getCOGSAreaWiseSummary(param: any): Observable<COGSAreaWiseSummaryResponse> {
    const encryptedParams: any = {
      State: param.state,
      Area: param.area, 
      EmployeeId:this.employeeId(),
      SelectedDate: param.date
    };
    const plainParams: any = {
      page: param.page,
      pageSize: param.pageSize
    };

    return this.httpWrapper.get<COGSAreaWiseSummaryResponse>(
      `${this.apiURL}UnrecognisedInvoice/Common/api/COGSUnrecognise/area-wise-stage-summary-with-combined-sums`,
      { encryptedParams: encryptedParams,
        plainParams: plainParams }
    );
  }

  _getCOGSAreaWiseBucketSummary(param: any): Observable<COGSAreaBucketResponse> {
    const encryptedParams: any = {
      StageName: param.Stage,
      AreaName: param.AreaName,
      SearchTerm: param.searchTerm,
      Ageing: param.Ageing,
      EmployeeId:this.employeeId(),
      SelectedDate: param.date
    }; 

    console.log("PAYLOAD SENT TO BACKEND:", JSON.stringify(encryptedParams, null, 2));

    const plainParams: any = {
      page: param.page,
      pageSize: param.pageSize
    };

    return this.httpWrapper.get<COGSAreaBucketResponse>(
      `${this.apiURL}UnrecognisedInvoice/Common/api/COGSUnrecognise/area-wise-search`,
      {
        encryptedParams: encryptedParams,
        plainParams: plainParams
      }
    );
  }

  _excelCOGSAreaWiseBucketSummary(param: any): Observable<any> {
      const encryptedParams: any = {
        AreaName: param.AreaName,
        Ageing: param.Ageing, 
        EmployeeId: this.employeeId()
      }; 
      return this.httpWrapper.get<any>(`${this.apiURL}UnrecognisedInvoice/Common/api/COGSUnrecognise/cogs-area-wise/export?`, {
        encryptedParams: encryptedParams, responseType: 'blob', context: new HttpContext().set(SKIP_LOADER, true)
      })
    }

    // ✅ Areas by State (GET)
_getAreasByState(state: string): Observable<string[]> {
  const encryptedParams: any = {
    State: state,
    EmployeeId: this.employeeId(),
  };

  return this.httpWrapper.get<string[]>(
    `${this.apiURL}UnrecognisedInvoice/Common/api/DealerAreaSummary/areas-by-state`,
    { encryptedParams }
  );
}
}
