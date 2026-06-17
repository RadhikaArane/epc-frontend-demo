import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpEncSrvWrapperService } from '../common/http-enc-srv-wrapper.service';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../common/auth.service';

@Injectable({
  providedIn: 'root',
})
export class FaUploadSrvService {
  private http = inject(HttpClient);
  private httpWrapper = inject(HttpEncSrvWrapperService);
  private apiUrl = environment.apiUrl;
  private authSrv = inject(AuthService);

  // Get User ID from Auth Service
  userId = signal(this.authSrv.userDetails?.userId);

  constructor() {
    // DEBUG: Check what ID the app THINKS is logged in
    console.log('Auth Details in :', this.authSrv.userDetails);
    console.log('User ID being sent:', this.userId());
  }

  _uploadExcel(formData: FormData) {
    console.log('>>> [Service] _uploadExcel called. FormData received.');

    return this.httpWrapper.post(
      `${this.apiUrl}FixedAssetVerification/api/assets/upload`,
      formData,
    );
  }

  _getUploadHistory(pageNumber: number, pageSize: number): Observable<any> {
    const plainParams: any = {
      PageNumber: pageNumber,
      PageSize: pageSize,
    };
    return this.httpWrapper.get<any>(
      `${this.apiUrl}FixedAssetVerification/api/asset-imports/upload-history`,
      { plainParams: plainParams },
    );
  }
}
