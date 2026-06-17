import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpEncSrvWrapperService } from '../common/http-enc-srv-wrapper.service';
import { AuthService } from '../common/auth.service';
import { Observable } from 'rxjs';
import { uploadLogs } from '../../models/unrecognisedInvoice-models/uploadLogs';

@Injectable({
  providedIn: 'root'
})
export class UrUnrecUploadLogsService {

  private apiURL = environment.apiUrl;
  
  httpWrapper = inject(HttpEncSrvWrapperService);
  authSrv = inject(AuthService);

  constructor() { }

  _getUploadLogs(id: string): Observable<uploadLogs> {
      const params = this.httpWrapper.createParams({
        EmployeeId: id
      });
      return this.httpWrapper.get<uploadLogs>(`${this.apiURL}UnrecognisedInvoice/Common/api/Upload/logs`, { params });
    }
}