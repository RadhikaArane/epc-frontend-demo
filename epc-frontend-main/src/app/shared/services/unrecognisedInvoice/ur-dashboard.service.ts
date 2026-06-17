import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environment'; 
import { HttpEncSrvWrapperService } from '../common/http-enc-srv-wrapper.service'; 
import { AuthService } from '../common/auth.service'; 
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UrDashboardService {
  private apiURL = environment.apiUrl;

  httpWrapper = inject(HttpEncSrvWrapperService);
  authSrv = inject(AuthService);

  employeeId = signal(this.authSrv.userDetails?.employeeId);

  constructor() { }

  // 1st Table API
  _getDashboardSummary(selectedDate: string, stageName: string, stateName: string): Observable<any> {
    const params = this.httpWrapper.createParams({
      EmployeeId: this.employeeId(),
      StageName: stageName,
      StateName: stateName,
      SelectedDate: selectedDate
    });
    
    return this.httpWrapper.get<any>(
      `${this.apiURL}UnrecognisedInvoice/Common/api/DailyDashboardState/summary`, 
      { params }
    );
  }

  // 2nd Table API (Pipeline)
  _getDashboardPipeline(selectedDate: string, stageName: string, stateName: string): Observable<any> {
    const params = this.httpWrapper.createParams({
      EmployeeId: this.employeeId(),
      StageName: stageName,
      StateName: stateName,
      SelectedDate: selectedDate
    });
    
    return this.httpWrapper.get<any>(
      `${this.apiURL}UnrecognisedInvoice/Common/api/DailyDashboardState/pipeline`, 
      { params }
    );
  }
}