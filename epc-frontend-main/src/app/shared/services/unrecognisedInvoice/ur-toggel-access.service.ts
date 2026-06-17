import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpEncSrvWrapperService } from '../common/http-enc-srv-wrapper.service';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../common/auth.service';

@Injectable({ providedIn: 'root' })
export class UrToggelAccessService {

  private httpWrapper = inject(HttpEncSrvWrapperService);
  private authSrv     = inject(AuthService);
  private apiURL      = environment.apiUrl;

  getRouteAccessItems(projectTypeId: number, roleId: number): Observable<any> {
    const encryptedParams: any = {
      ProjectTypeId: projectTypeId,
      RoleId        : roleId,
    };
    return this.httpWrapper.get<any>(
      `${this.apiURL}UnrecognisedInvoice/common/api/RouteAccess/GetRouteAccessItems`,
      { encryptedParams: encryptedParams }
    );
  }

  toggleRouteAccess(payload: {
    RouteAccessItemId: string;
    RoleId           : string;
    ProjectTypeId    : string;
    IsActive         : string;
  }): Observable<any> {
    return this.httpWrapper.post<any>(
      `${this.apiURL}UnrecognisedInvoice/common/api/RouteAccess/ToggleRouteAccess`,
      payload
    );
  }
}