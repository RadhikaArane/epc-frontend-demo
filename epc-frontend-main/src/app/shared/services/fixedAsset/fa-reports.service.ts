import { inject, Injectable } from '@angular/core';
import { HttpEncSrvWrapperService } from '../common/http-enc-srv-wrapper.service';
import { EncryptionServiceService } from '../common/encryption-service.service';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FaReportsService {

  constructor() { }

  private httpWrapper = inject(HttpEncSrvWrapperService);
  private encryptionSrv = inject(EncryptionServiceService)
  private apiUrl = environment.apiUrl;
  // private http = inject(HttpClient); 

  _getScanHistory(page: number, pageSize: number): Observable<any> {
    const plainParams: any = {
      page: page,
      pageSize: pageSize
    };
    return this.httpWrapper.get(
      `${this.apiUrl}FixedAssetVerification/api/verified-assets`,
      { plainParams: plainParams }
    );
  }
}
