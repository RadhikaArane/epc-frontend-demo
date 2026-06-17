import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpContext } from '@angular/common/http';
import { HttpEncSrvWrapperService } from '../common/http-enc-srv-wrapper.service';
import { EncryptionServiceService } from '../common/encryption-service.service';
import { Observable } from 'rxjs';
import { SKIP_LOADER } from '../../core/interceptors/epc-loader.interceptor';

@Injectable({
  providedIn: 'root'
})
export class PbUploadService {

  private apiURL = environment.apiUrl;
  http = inject(HttpClient);
  httpWrapper = inject(HttpEncSrvWrapperService)
  encryptionSrv = inject(EncryptionServiceService);

  constructor() { }

  _uploadCollectionData(formData: FormData): Observable<any> {
    return this.httpWrapper.post(`${this.apiURL}ProjectBusiness/api/Collection/upload`, formData);
  }

  _uploadSalesData(formData: FormData): Observable<any> {
    return this.httpWrapper.post(`${this.apiURL}ProjectBusiness/api/Sale/uploadsales`, formData);
  }
}
