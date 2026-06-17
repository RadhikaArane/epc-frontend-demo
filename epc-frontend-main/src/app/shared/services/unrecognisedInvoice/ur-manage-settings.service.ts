import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { HttpEncSrvWrapperService } from '../common/http-enc-srv-wrapper.service';
import { EncryptionServiceService } from '../common/encryption-service.service';
import { Observable } from 'rxjs';
import { Access, AccessLevels, Areas, Regions, States, Zones, } from '../../models/unrecognisedInvoice-models/settings';
import { Roles } from '../common/menu.service';

@Injectable({
  providedIn: 'root',
})
export class UrManageSettingsService {
  private apiURL = environment.apiUrl;

  http = inject(HttpClient);
  httpWrapper = inject(HttpEncSrvWrapperService);
  encryptionSrv = inject(EncryptionServiceService);

  constructor() { }

  _getAllAccess(params: any): Observable<Access> {
    const plainParams: any = { page: params.page, pageSize: params.pageSize };
    return this.httpWrapper.get<Access>(`${this.apiURL}UnrecognisedInvoice/common/api/UDLookup/access`, { plainParams });
  }

  _getAccessLevels(params: any): Observable<AccessLevels> {
    const plainParams: any = { page: params.page, pageSize: params.pageSize };
    return this.httpWrapper.get<AccessLevels>(`${this.apiURL}UnrecognisedInvoice/common/api/UDLookup/access-levels`, { plainParams });
  }

  _getAreas(params: any): Observable<Areas> {
    const plainParams: any = { page: params.page, pageSize: params.pageSize };
    return this.httpWrapper.get<Areas>(`${this.apiURL}UnrecognisedInvoice/common/api/UDLookup/areas`, { plainParams });
  }

  _getRegions(params: any): Observable<Regions> {
    const plainParams: any = { page: params.page, pageSize: params.pageSize };
    return this.httpWrapper.get<Regions>(`${this.apiURL}UnrecognisedInvoice/common/api/UDLookup/regions`, { plainParams });
  }

  _getRoles(params: any): Observable<Roles> {
    const plainParams: any = { page: params.page, pageSize: params.pageSize };
    return this.httpWrapper.get<Roles>(`${this.apiURL}UnrecognisedInvoice/common/api/UDLookup/roles`, { plainParams });
  }

  _getStates(params: any): Observable<States> {
    const plainParams: any = { page: params.page, pageSize: params.pageSize };
    return this.httpWrapper.get<States>(`${this.apiURL}UnrecognisedInvoice/common/api/UDLookup/states`, { plainParams });
  }

  _getZones(params: any): Observable<Zones> {
    const plainParams: any = { page: params.page, pageSize: params.pageSize };
    return this.httpWrapper.get<Zones>(`${this.apiURL}UnrecognisedInvoice/common/api/UDLookup/zones`, { plainParams });
  }

  _getAllDealers(params: any): Observable<Zones> {
    const plainParams: any = { page: params.page, pageSize: params.pageSize };
    return this.httpWrapper.get<Zones>(`${this.apiURL}UnrecognisedInvoice/common/api/UDLookup/dealers-with-locations`, { plainParams });
  }

  _getAllUsers(params: any): Observable<Zones> {
    const plainParams: any = { page: params.page, pageSize: params.pageSize };
    return this.httpWrapper.get<Zones>(`${this.apiURL}UnrecognisedInvoice/common/api/UDLookup/users-with-locations`, { plainParams });
  }

  // ==========================================
  // STATE FACTOR APIs
  // ==========================================
  _getAllStateStockFactors(): Observable<any> {
    return this.httpWrapper.get<any>(`${this.apiURL}UnrecognisedInvoice/Common/api/StateStockFactors`);
  }

  _getStateStockFactorById(id: number): Observable<any> {
    return this.httpWrapper.get<any>(`${this.apiURL}UnrecognisedInvoice/Common/api/StateStockFactors/${id}`);
  }

  _addStateStockFactor(body: { State: string; StockMultFact: string; CreatedBy: string }): Observable<any> {
    return this.httpWrapper.post<any>(`${this.apiURL}UnrecognisedInvoice/Common/api/StateStockFactors`, body);
  }

  _updateStateStockFactor(body: { Id: string; StockMultFact: string; UpdatedBy: string }): Observable<any> {
    return this.httpWrapper.put<any>(
      `${this.apiURL}UnrecognisedInvoice/Common/api/StateStockFactors`,
      body
    );
  }

  _deleteStateStockFactor(id: string | number): Observable<any> {
    return this.httpWrapper.delete<any>(
      `${this.apiURL}UnrecognisedInvoice/Common/api/StateStockFactors/delete`,
      { body: { Id: String(id) } }
    );
  }

  // ==========================================
  // STAGE MASTER APIs (NEW)
  // ==========================================

  _getStagesByState(stateName: string): Observable<any> {
    const plainParams: any = { StateName: stateName };
    return this.httpWrapper.get<any>(
      `${this.apiURL}UnrecognisedInvoice/Common/api/Stage/stages/state`,
      { plainParams }
    );
  }

  _editStage(body: any): Observable<any> {
    return this.httpWrapper.put<any>(
      `${this.apiURL}UnrecognisedInvoice/Common/api/Stage/stages/state`,
      body
    );
  }

  _addStage(body: any): Observable<any> {
    return this.httpWrapper.post<any>(
      `${this.apiURL}UnrecognisedInvoice/Common/api/Stage/stages/state`,
      body
    );
  }

  _deleteStage(id: string | number): Observable<any> {
    return this.httpWrapper.delete<any>(
      `${this.apiURL}UnrecognisedInvoice/Common/api/Stage/stages/state`,
      { body: { Id: String(id) } }
    );
  }

  _setRecognisedStage(id: string | number): Observable<any> {
    return this.httpWrapper.put<any>(
      `${this.apiURL}UnrecognisedInvoice/Common/api/Stage/stages/state/recognised`,
      { Id: String(id) }
    );
  }

  private encodeBase64ForUrl(base64String: string): string {
    return base64String.replace(/\+/g, '%2B').replace(/\//g, '%2F');
  }
}