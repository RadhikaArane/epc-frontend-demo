import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { HttpEncSrvWrapperService } from '../common/http-enc-srv-wrapper.service'; 
import { HttpContext } from '@angular/common/http';
import { SKIP_LOADER } from '../../core/interceptors/epc-loader.interceptor';

@Injectable({
  providedIn: 'root'
})
export class TrUploadCenterService {

  private apiURL = environment.apiUrl;
  httpWrapper = inject(HttpEncSrvWrapperService) 

  _uploadSalesFy25Attachment(formData: FormData): Observable<any> {
    return this.httpWrapper.post<any>(`${this.apiURL}TradeReceivable/api/SalesFy25/upload`, formData)
  }

  _uploadFbl5nAttachment(formData: FormData): Observable<any> {
    return this.httpWrapper.post<any>(`${this.apiURL}TradeReceivable/api/Fbl5n/upload`, formData)
  }

  _uploadAssignmentAttachment(formData: FormData): Observable<any> {
    return this.httpWrapper.post<any>(`${this.apiURL}TradeReceivable/api/reports/upload-assignpending`, formData)
  }

  _uploadInstandProjectAttachment(formData: FormData): Observable<any> {
    return this.httpWrapper.post<any>(`${this.apiURL}TradeReceivable/api/ExcelDemo/upload`, formData)
  }

  _uploadCustomerMasterAttachment(formData: FormData): Observable<any> {
    return this.httpWrapper.post<any>(`${this.apiURL}TradeReceivable/api/CustomerMaster/upload`, formData)
  }

  _downloadReceivableSheet(param: any): Observable<any> {
    const params = this.httpWrapper.createParams({
      asOf: param.asOf,
      month: param.month,
      year: param.year
    });
    return this.httpWrapper.get<Blob>(
      `${this.apiURL}TradeReceivable/api/reports/trade-receivable-all-sheets`,
      { params, responseType: 'blob' as any , context: new HttpContext().set(SKIP_LOADER, true)}
    );
  }

  _uploadCollections(formData: FormData): Observable<any> {
    return this.httpWrapper.post<any>(`${this.apiURL}TradeReceivable/api/collections/upload`, formData)
  }

  // ================= NEWLY CONSOLIDATED APIS =================

  // 1. Project Business
  _uploadProjectBusiness(formData: FormData): Observable<any> {
    return this.httpWrapper.post<any>(`${this.apiURL}TradeReceivable/api/reports/upload-project-business`, formData);
  }

  // 2. Debit Sheet
  _downloadDebitSheet(month: string, year: string): Observable<Blob> {
    const params = this.httpWrapper.createParams({ Month: month, Year: year });
    return this.httpWrapper.get<Blob>(`${this.apiURL}TradeReceivable/api/reports/download-debit`, { params, responseType: 'blob' as any });
  }

  _uploadDebitSheet(formData: FormData): Observable<any> {
    return this.httpWrapper.post<any>(`${this.apiURL}TradeReceivable/api/reports/upload-debit`, formData);
  }

  // 3. Unbooked Collections
  _uploadUnbookedCollection(formData: FormData): Observable<any> {
    return this.httpWrapper.post<any>(`${this.apiURL}TradeReceivable/api/reports/upload-unbooked-collection`, formData);
  }

  // 4. PDD Data
  _uploadPddData(formData: FormData): Observable<any> {
    return this.httpWrapper.post<any>(`${this.apiURL}TradeReceivable/api/reports/upload-pdd`, formData);
  }

  // 4.1 Removal of PDD Data
  _uploadPddRemoval(formData: FormData): Observable<any> {
    return this.httpWrapper.post<any>(`${this.apiURL}TradeReceivable/api/reports/remove-pdd`, formData);
  }

  // 5. Missing Final Category & Registration
  _getMissingFinalCategoryCount(month: string, year: string): Observable<any> {
    const params = this.httpWrapper.createParams({ Month: month, Year: year });
    return this.httpWrapper.get<any>(`${this.apiURL}TradeReceivable/api/reports/missing-final-category-count`, { params });
  }

  _downloadMissingFinalCategory(month: string, year: string): Observable<Blob> {
    const params = this.httpWrapper.createParams({ Month: month, Year: year });
    return this.httpWrapper.get<Blob>(`${this.apiURL}TradeReceivable/api/reports/download-missing-final-category`, { params, responseType: 'blob' as any });
  }

  _uploadCorrectedRegistration(formData: FormData): Observable<any> {
    return this.httpWrapper.post<any>(`${this.apiURL}TradeReceivable/api/reports/upload-corrected-registration`, formData);
  }

  // 6. All Sheets (Export & Upload)
  _downloadAllSheets(month: string, year: string): Observable<Blob> {
    const params = this.httpWrapper.createParams({ Month: month, Year: year });
    return this.httpWrapper.get<Blob>(`${this.apiURL}TradeReceivable/api/reports/download-all-sheets`, { params, responseType: 'blob' as any });
  }

  _uploadAllSheets(formData: FormData): Observable<any> {
    return this.httpWrapper.post<any>(`${this.apiURL}TradeReceivable/api/reports/upload-all-sheets`, formData);
  }
  
}