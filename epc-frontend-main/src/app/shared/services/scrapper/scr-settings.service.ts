import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpEncSrvWrapperService } from '../common/http-enc-srv-wrapper.service';
import { Observable } from 'rxjs';
import { ScrapperState, ScrapperStateResponse } from '../../models/scrapper-models/scrapperSettings';

@Injectable({
  providedIn: 'root'
})
export class ScrSettingsService {

  private apiURL = environment.apiUrl;
  httpWrapper = inject(HttpEncSrvWrapperService)

  constructor() { }

  _getJobsDetails(params: any): Observable<any> {
    const plainParams: any = {
      page: params.page,
      pageSize: params.pageSize
    };
    return this.httpWrapper.get(`${this.apiURL}Scrapper/api/settingstatedata?`, { plainParams: plainParams });
  }

  _getStateData():Observable<ScrapperStateResponse>{
    const plainParams: any = {
      page: 1,
      pageSize: 25
    };
    return this.httpWrapper.get(`${this.apiURL}Scrapper/api/settingstatedata?`, { plainParams: plainParams });
  }

  _addState(data: ScrapperState): Observable<any> {
    return this.httpWrapper.post(`${this.apiURL}Scrapper/api/settingstatedata`, data);
  }

  _updateState(id: number, data: ScrapperState): Observable<any> {
    const params = this.httpWrapper.createParams({
      id: id
    });
    return this.httpWrapper.put(`${this.apiURL}Scrapper/api/settingstatedata?`, data, { params });
  }

  _deleteState(id: number): Observable<any> {
    const params = this.httpWrapper.createParams({
      id: id
    });
    return this.httpWrapper.delete(`${this.apiURL}Scrapper/api/settingstatedata?`, { params });
  }

}
