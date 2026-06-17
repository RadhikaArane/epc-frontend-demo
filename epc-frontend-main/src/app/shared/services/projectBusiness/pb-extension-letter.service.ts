import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { HttpEncSrvWrapperService } from '../common/http-enc-srv-wrapper.service';
import { EncryptionServiceService } from '../common/encryption-service.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PbExtensionLetterService {

  private apiURL = environment.apiUrl;

  http = inject(HttpClient);
  httpWrapper = inject(HttpEncSrvWrapperService)
  encryptionSrv = inject(EncryptionServiceService);

  constructor() { }



  //extension letter
  _uploadExtensionletter(formData: FormData): Observable<any> {
    return this.httpWrapper.post<any>(`${this.apiURL}ProjectBusiness/api/ProjectExtensionLetter/upload`, formData)
  }
  _getExtensionLetters(projectId: string): Observable<any> {
    const params = this.httpWrapper.createParams({
      projectId: projectId
    })
    return this.httpWrapper.get(`${this.apiURL}ProjectBusiness/api/ProjectExtensionLetter/GetExtensionLetters?`, { params });
  }
  _downloadExtensionLetter(extensionLetterId: string): Observable<Blob> {
    const params = this.httpWrapper.createParams({
      extensionLetterId: extensionLetterId
    })
    return this.httpWrapper.get(`${this.apiURL}ProjectBusiness/api/ProjectExtensionLetter/DownloadExtensionletter?`, { params, responseType: 'blob' });
  }
  _deleteExtensionLetter(extensionLetterId: string): Observable<any> {
    const params = this.httpWrapper.createParams({
      extensionLetterId: extensionLetterId
    })
    return this.httpWrapper.delete(`${this.apiURL}ProjectBusiness/api/ProjectExtensionLetter/DeleteExtensionLetter?`, { params });
  }

}
