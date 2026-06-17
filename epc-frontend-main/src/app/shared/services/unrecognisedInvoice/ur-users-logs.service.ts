import { inject, Injectable, signal } from '@angular/core';
import { from, Observable, switchMap, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { HttpEncSrvWrapperService } from '../common/http-enc-srv-wrapper.service';
import { AuthService } from '../common/auth.service';
import { DropdownList, UserAddPayload, UserAddResponse } from '../../models/unrecognisedInvoice-models/userLogs';
import { EncryptionServiceService } from '../common/encryption-service.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UrUsersLogsService {
  set(list: any) {
    throw new Error('Method not implemented.');
  }
  private apiURL = environment.apiUrl;
  private httpWrapper = inject(HttpEncSrvWrapperService);
  private authSrv = inject(AuthService);

  private http = inject(HttpClient);
  private encryptionSrv = inject(EncryptionServiceService);

  employeeId = signal(this.authSrv.userDetails?.employeeId);

  getRoles(): Observable<DropdownList> {
    return this.httpWrapper.get<DropdownList>(`${this.apiURL}AuthService/api/Auth/roles`, {});
  }

  getReportingManagers(): Observable<DropdownList> {
    return this.httpWrapper.get<DropdownList>(`${this.apiURL}AuthService/api/Auth/reporting-managers`, {});
  }

  getZones(): Observable<DropdownList> {
    return this.httpWrapper.get<DropdownList>(`${this.apiURL}AuthService/api/Auth/zones`, {});
  }



  private encodeBase64ForUrl(base64String: string): string {
    return base64String.replace(/\+/g, '%2B').replace(/\//g, '%2F');
    // Leave = as is
  }

  //   getRegions(zoneId: string): Observable<DropdownList> {
  //   return from(
  //     this.encryptionSrv.encryptSensitiveData({ ZoneId: zoneId }).then(
  //       ({ encryptedParams, xAesKey, requestId }) => {
  //         const headers = new HttpHeaders()
  //           .set('x-aes-key', xAesKey)
  //           .set('x-request-id', requestId);

  //         const encryptedZoneId = encryptedParams['ZoneId'];
  //         const urlSafeEncrypted = this.encodeBase64ForUrl(encryptedZoneId);

  //         return this.http.get<DropdownList>(
  //           `${this.apiURL}AuthService/api/Auth/regions/${urlSafeEncrypted}`,
  //           { headers }
  //         );
  //       }
  //     )
  //   ).pipe(switchMap(res => res as Observable<DropdownList>));
  // }

  getRegions(zoneExternalId: string): Observable<any[]> {
    return this.httpWrapper.post<any[]>(
      `${this.apiURL}AuthService/api/Auth/regions`,
      { ZoneExternalId: String(zoneExternalId) }
    );
  }

  // getAreas(regionId: string): Observable<DropdownList> {
  //   return from(
  //     this.encryptionSrv.encryptSensitiveData({ RegionId: regionId }).then(
  //       ({ encryptedParams, xAesKey, requestId }) => {
  //         const headers = new HttpHeaders()
  //           .set('x-aes-key', xAesKey)
  //           .set('x-request-id', requestId);

  //         const encryptedRegionId = encryptedParams['RegionId'];
  //         const urlSafeEncrypted = this.encodeBase64ForUrl(encryptedRegionId);

  //         return this.http.get<DropdownList>(
  //           `${this.apiURL}AuthService/api/Auth/areas/${urlSafeEncrypted}`,
  //           { headers }
  //         );
  //       }
  //     )
  //   ).pipe(switchMap(res => res as Observable<DropdownList>));
  // }/

  getAreas(regionExternalId: string): Observable<any[]> {
    return this.httpWrapper.post<any[]>(
      `${this.apiURL}AuthService/api/Auth/areas`,
      { RegionExternalId: String(regionExternalId) }
    );
  }

  // getRegions(zoneId: string): Observable<DropdownList> {
  //   return this.httpWrapper.get<DropdownList>(`${this.apiURL}AuthService/api/Auth/regions/${zoneId}`, {});
  // }

  // getAreas(regionId: string): Observable<DropdownList> {
  //   return this.httpWrapper.get<DropdownList>(`${this.apiURL}AuthService/api/Auth/areas/${regionId}`, {});
  // }

  addUser(payload: UserAddPayload): Observable<UserAddResponse> {
    // Ensure strict type formatting based on the new API contract
    const formattedPayload = {
      ...payload,
      projectTypeId: Number(payload.projectTypeId), // Must be Int32
      reportingManagerId: String(payload.reportingManagerId), // Ensure string format
      createdBy: String(payload.createdBy),

      // Audit field required by wrapper logic (if applicable)
      EmployeeId: this.employeeId()
    };

    console.log('Final Payload sending to API:', formattedPayload);

    return this.httpWrapper.post<UserAddResponse>(`${this.apiURL}AuthService/api/Auth/add`, formattedPayload).pipe(
      tap(res => console.log('Add User Response:', res))
    );
  }

  showUsersByProjectType(payload: {
  projectTypeId: string;
  page: string;
  pageSize: string;
}): Observable<any> {
  const encryptedParams = {
    ProjectTypeId: String(payload.projectTypeId)
  };

  const plainParams = {
    Page: String(payload.page),
    PageSize: String(payload.pageSize)
  };

  return this.httpWrapper.get<any>(
    `${this.apiURL}AuthService/api/Auth/show?`,
    {
      encryptedParams,
      plainParams
    }
  );
}

  updateUser(payload: any): Observable<any> {
  console.log('Update Payload:', payload);
  return this.httpWrapper.post<any>(
    `${this.apiURL}AuthService/api/Auth/update`, 
    payload
  );
}

  deleteUser(payload: { userPK: string }): Observable<any> {
  return this.httpWrapper.post<any>(
    `${this.apiURL}AuthService/api/Auth/delete`,
    payload
  );
}
}