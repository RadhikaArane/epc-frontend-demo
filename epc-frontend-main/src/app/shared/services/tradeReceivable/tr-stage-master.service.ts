import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { HttpEncSrvWrapperService } from '../common/http-enc-srv-wrapper.service';
import {
  StageMasterStatesResponse,
  StageMasterByStateResponse,
  StageMasterCategoryResponse,
  StageMasterAddRequest,
  StageMasterUpdateRequest,
  StageMasterDeleteRequest,
  ApiResponse
} from '../../models/tradeReceivable-models/stageMaster'; 

@Injectable({
  providedIn: 'root'
})
export class TrStageMasterService {

  private apiURL = environment.apiUrl;
  httpWrapper = inject(HttpEncSrvWrapperService);

  // 1) Get States
  getStates(): Observable<StageMasterStatesResponse> {
    return this.httpWrapper.get<StageMasterStatesResponse>(
      `${this.apiURL}TradeReceivable/api/StageMaster/states`
    );
  }

  // 2) Get Categories
  getCategories(): Observable<StageMasterCategoryResponse> {
    return this.httpWrapper.get<StageMasterCategoryResponse>(
      `${this.apiURL}TradeReceivable/api/StageMaster/categories`
    );
  }

  // 3) Get Portal Status by State
  getByState(stateName: string): Observable<StageMasterByStateResponse> {
    const params = this.httpWrapper.createParams({ StateName: stateName });
    return this.httpWrapper.get<StageMasterByStateResponse>(
      `${this.apiURL}TradeReceivable/api/StageMaster/by-state`,
      { params }
    );
  }

  // 4) Add
  addPortalStatus(body: StageMasterAddRequest): Observable<ApiResponse<any>> {
    return this.httpWrapper.post<ApiResponse<any>>(
      `${this.apiURL}TradeReceivable/api/StageMaster/add`,
      body
    );
  }

  // 5) Update
  updatePortalStatus(body: StageMasterUpdateRequest): Observable<ApiResponse<any>> {
    return this.httpWrapper.put<ApiResponse<any>>(
      `${this.apiURL}TradeReceivable/api/StageMaster/update`,
      body
    );
  }

  // 6) Delete (DELETE with body)
  deletePortalStatus(body: StageMasterDeleteRequest): Observable<ApiResponse<any>> {
    return this.httpWrapper.delete<ApiResponse<any>>(
      `${this.apiURL}TradeReceivable/api/StageMaster/delete`, {body:body} 
    );
  }
}
