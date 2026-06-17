import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpContext } from '@angular/common/http';
import { HttpEncSrvWrapperService } from '../common/http-enc-srv-wrapper.service';
import { EncryptionServiceService } from '../common/encryption-service.service';
import { Observable } from 'rxjs';
import { SKIP_LOADER } from '../../core/interceptors/epc-loader.interceptor';
import { AddNewProject } from '../../models/projectBusiness-models/pbAddNewProject';

@Injectable({
  providedIn: 'root'
})
export class PbAddNewProjectService {

  private apiURL = environment.apiUrl;
  http = inject(HttpClient);
  httpWrapper = inject(HttpEncSrvWrapperService)
  encryptionSrv = inject(EncryptionServiceService);

  constructor() { }

  _getAllCustomers(params: any): Observable<any> {
    const plainParams: any = {
      page: params.page,
      pageSize: params.pageSize
    };
    return this.httpWrapper.get<any>(`${this.apiURL}ProjectBusiness/api/ProjectExpense/GetAllCustomers?`, {
      plainParams: plainParams
    })
  }

  _addNewProject(data: AddNewProject): Observable<any> {
    return this.httpWrapper.post(`${this.apiURL}ProjectBusiness/api/Projects/CreateProject`, data)
  }

  _getGSTValues(projectArea: number, hectorRate: number): Observable<any> {
    const params = this.httpWrapper.createParams({
      projectArea: projectArea,
      HectareRate: hectorRate
    });
    return this.httpWrapper.get<any>(`${this.apiURL}ProjectBusiness/api/Projects/calculateSaleValue?`, { params, context: new HttpContext().set(SKIP_LOADER, true) })
  }

  //agreement attchments
  _uploadProjectAttachment(formData: FormData): Observable<any> {
    return this.httpWrapper.post<any>(`${this.apiURL}ProjectBusiness/api/ProjectAttachments/UploadProjectAttachments`, formData)
  }

  _uploadEmailAttachment(formData: FormData): Observable<any> {
    return this.httpWrapper.post<any>(`${this.apiURL}ProjectBusiness/api/ProjectEmailAttachments/UploadEmailAttachments`, formData)
  }
}
