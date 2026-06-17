import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpContext } from '@angular/common/http';
import { HttpEncSrvWrapperService } from '../common/http-enc-srv-wrapper.service';
import { EncryptionServiceService } from '../common/encryption-service.service';
import { Observable } from 'rxjs';
import { AddNewNodalAgency, NodalAgencyResponse, updateNodalAgency } from '../../models/projectBusiness-models/pbNodalAgency';

@Injectable({
  providedIn: 'root'
})
export class PbAddNodalAgencyService {

  private apiURL = environment.apiUrl;
  http = inject(HttpClient);
  httpWrapper = inject(HttpEncSrvWrapperService)
  encryptionSrv = inject(EncryptionServiceService);

  constructor() { }

  //nodal agency
  _getNodalAgencies(nodalAgencyId?: string): Observable<NodalAgencyResponse> {
    const params = this.httpWrapper.createParams({
      NodalAgencyId: nodalAgencyId
    })
    return this.httpWrapper.get<NodalAgencyResponse>(`${this.apiURL}ProjectBusiness/api/Projects/GetNodalAgencies?`, { params });
  }
  _createNodalAgency(request: AddNewNodalAgency): Observable<void> {
    return this.httpWrapper.post(`${this.apiURL}ProjectBusiness/api/Projects/CreateNodalAgency`, request);
  }
  _updateNodalAgency(request: any): Observable<updateNodalAgency> {
    return this.httpWrapper.put(`${this.apiURL}ProjectBusiness/api/Projects/UpdateNodalAgency`, request);
  }
  _deleteNodalAgency(nodalAgencyId: string): Observable<any> {
    const params = this.httpWrapper.createParams({
      NodalAgencyId: nodalAgencyId
    })
    return this.httpWrapper.delete(`${this.apiURL}ProjectBusiness/api/Projects/DeleteNodalAgency?`, { params });
  }





}
