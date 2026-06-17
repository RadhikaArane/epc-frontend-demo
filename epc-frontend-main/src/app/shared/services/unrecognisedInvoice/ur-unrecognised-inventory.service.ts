import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpEncSrvWrapperService } from '../common/http-enc-srv-wrapper.service';
import { Observable } from 'rxjs';
import { AreaWiseAgingBucketResponse, AreaWiseStageSummaryResponse, PanIndiaSummaryBucketResponse, PanIndiaSummaryResponse, StateWiseAgingBucketResponse, StateWiseStageSummaryResponse } from '../../models/unrecognisedInvoice-models/Inventory';
import { AuthService } from '../common/auth.service';
import { HttpContext } from '@angular/common/http';
import { SKIP_LOADER } from '../../core/interceptors/epc-loader.interceptor';

@Injectable({
  providedIn: 'root'
})
export class UrUnrecognisedInventoryService {

  private apiURL = environment.apiUrl;

  httpWrapper = inject(HttpEncSrvWrapperService)
  authSrv = inject(AuthService)

  employeeId = signal(this.authSrv.userDetails?.employeeId);

  constructor() { 
    
  }

  // Dynamic Column
  _getDynamicRemarkColumns(date: string): Observable<any> {
    return this.httpWrapper.post<any>(
      `${this.apiURL}UnrecognisedInvoice/Common/api/billing/dynamic-columns`,
      { SelectedDate: date }
    );
  }

  _getInventoryPanIndiaSummary(selectedDate: unknown): Observable<PanIndiaSummaryResponse> {
    const params = this.httpWrapper.createParams({
      EmployeeId:this.employeeId(),
      SelectedDate: selectedDate
    });
    return this.httpWrapper.get<PanIndiaSummaryResponse>(`${this.apiURL}UnrecognisedInvoice/Common/api/InventoryDashboard/Pan-summary`, { params })
  }

  _getInventoryPanIndiaBucketSummary(param: any): Observable<PanIndiaSummaryBucketResponse> {
    const encryptedParams: any = {
      State: param.State,
      Ageing: param.Ageing,
      StageName: param.StageName,
      SearchTerm: param.searchTerm,
      EmployeeId: this.employeeId(),
      SelectedDate: param.SelectedDate
    };
    const plainParams: any = {
      page: param.page,
      pageSize: param.pageSize
    };
    return this.httpWrapper.get<PanIndiaSummaryBucketResponse>(`${this.apiURL}UnrecognisedInvoice/Common/api/InventoryDashboard/inventory-pan-india-summary?`, {
      encryptedParams: encryptedParams,
      plainParams: plainParams
    })
  }

   _excelInventoryPanIndiaBucketSummary(param: any): Observable<any> {
    
    const encryptedParams: any = {
      EmployeeId: String(this.employeeId() || ''), 
      State: param.State || '',
      AreaName: param.AreaName || '', 
      StageName: param.StageName || '', 
      Ageing: param.Ageing || '', 
      SelectedDate: param.SelectedDate || '', 
      SearchTerm: param.SearchTerm || '',     
      Export: 'Export'
    }; 

    const plainParams: any = {
      page: param.page || 1,
      pageSize: param.pageSize || 10
    };
    
    return this.httpWrapper.get<any>(
      `${this.apiURL}UnrecognisedInvoice/Common/api/InventoryDashboard/pan-india-summary/export?`, 
      {
        encryptedParams: encryptedParams, 
        plainParams: plainParams,
        responseType: 'blob', 
        context: new HttpContext().set(SKIP_LOADER, true)
      }
    );
  }
 
  _getInventoryStateWiseSummary(param: any): Observable<StateWiseStageSummaryResponse> {
    const encryptedParams: any = {
      state: param.state,
      EmployeeId: this.employeeId(),
      SelectedDate: param.date
    };
    const plainParams: any = {
      page: param.page,
      pageSize: param.pageSize
    };
    return this.httpWrapper.get<StateWiseStageSummaryResponse>(`${this.apiURL}UnrecognisedInvoice/Common/api/InventoryDashboard/state-wise-stage-summary?`,
      {
        encryptedParams: encryptedParams,
        plainParams: plainParams
      });
  }

  _getInventoryStateWiseBucketSummary(param: any): Observable<StateWiseAgingBucketResponse> {
    const encryptedParams: any = {
      State: param.State,
      Ageing: param.Ageing,
      StageName: param.Stage,
      SearchTerm: param.searchTerm,
      EmployeeId: this.employeeId(),
      SelectedDate: param.date
    };
    const plainParams: any = {
      page: param.page,
      pageSize: param.pageSize
    };
    return this.httpWrapper.get<StateWiseAgingBucketResponse>(`${this.apiURL}UnrecognisedInvoice/Common/api/InventoryDashboard/inventory-state-wise-staging?`,
      {
        encryptedParams: encryptedParams,
        plainParams: plainParams
      })
  }

   _excelInventoryStateWiseBucketSummary(param: any): Observable<any> {
    
    const encryptedParams: any = {
      EmployeeId: String(this.employeeId() || ''), 
      State: param.State || '',
      StageName: param.StageName || '',     
      Ageing: param.Ageing || '',           
      SelectedDate: param.SelectedDate || '', 
      SearchTerm: param.searchTerm || '',   
      Export: 'Export'
    }; 
    
    return this.httpWrapper.get<any>(
      `${this.apiURL}UnrecognisedInvoice/Common/api/InventoryDashboard/state-wise-staging/export?`, 
      {
        encryptedParams: encryptedParams, 
        responseType: 'blob', 
        context: new HttpContext().set(SKIP_LOADER, true)
      }
    );
  }

  _getInventoryAreaWiseSummary(param:any): Observable<AreaWiseStageSummaryResponse> {
    const encryptedParams: any = {
      State: param.state,
      AreaName: param.area, 
      EmployeeId: this.employeeId(),
      SelectedDate: param.date
    };
    const plainParams: any = {
      page: param.page,
      pageSize: param.pageSize
    };

    return this.httpWrapper.get<AreaWiseStageSummaryResponse>(
      `${this.apiURL}UnrecognisedInvoice/Common/api/InventoryDashboard/area-wise-stage-summary`,
      { encryptedParams: encryptedParams,
        plainParams: plainParams }
    );
  }

  _getInventoryAreaWiseBucketSummary(param: any): Observable<AreaWiseAgingBucketResponse> {
    const encryptedParams: any = {
      AreaName: param.AreaName,
      Ageing: param.Ageing,
      StageName: param.Stage,
      SearchTerm: param.searchTerm,
      EmployeeId: this.employeeId(),
      SelectedDate: param.date
    };

    const plainParams: any = {
      page: param.page,
      pageSize: param.pageSize
    };

    return this.httpWrapper.get<AreaWiseAgingBucketResponse>(
      `${this.apiURL}UnrecognisedInvoice/Common/api/InventoryDashboard/inventory-area-wise-staging`,
      {
        encryptedParams: encryptedParams,
        plainParams: plainParams
      }
    );
  }

    _excelInventoryAreaWiseBucketSummary(param: any): Observable<any> {
    
    const encryptedParams: any = {
      EmployeeId: String(this.employeeId() || ''), 
      AreaName: param.AreaName || '',
      StageName: param.StageName || '',       
      Ageing: param.Ageing || '',             
      SelectedDate: param.SelectedDate || '', 
      SearchTerm: param.searchTerm || '',     
      Export: 'Export'
    }; 
    
    return this.httpWrapper.get<any>(
      `${this.apiURL}UnrecognisedInvoice/Common/api/InventoryDashboard/area-wise-staging/export?`, 
      {
        encryptedParams: encryptedParams, 
        responseType: 'blob', 
        context: new HttpContext().set(SKIP_LOADER, true)
      }
    );
  }

  getAreasByState(state: string): Observable<any> {
  const encryptedParams: any = {
    State: state
  };
  return this.httpWrapper.get<any>(
    `${this.apiURL}UnrecognisedInvoice/Common/api/DealerAreaSummary/areas-by-state`,
    { encryptedParams: encryptedParams }
  );
}

}