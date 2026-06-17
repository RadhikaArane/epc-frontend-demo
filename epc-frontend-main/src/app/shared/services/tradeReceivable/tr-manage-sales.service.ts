import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpEncSrvWrapperService } from '../common/http-enc-srv-wrapper.service';
import { Observable } from 'rxjs';
import { ProjectsResponse, SalesFTMFinalResponse } from '../../models/tradeReceivable-models/trManageSales';

@Injectable({
  providedIn: 'root'
})
export class TrManageSalesService {

  private apiURL = environment.apiUrl;

  httpWrapper = inject(HttpEncSrvWrapperService)

  constructor() { }

  _getManageSalesRoughSummary(month: string, year: number): Observable<any> {
    const params = this.httpWrapper.createParams({
      Month: month,
      Year: year
    });
    return this.httpWrapper.get(`${this.apiURL}TradeReceivable/api/SalesData/get-sales-data/rough-summary`, { params });
  }

  _getManageSalesGroupingSales(month: string, year: number): Observable<any> {
    const params = this.httpWrapper.createParams({
      Month: month,
      Year: year
    });
    return this.httpWrapper.get(`${this.apiURL}TradeReceivable/api/SalesData/get-grouping-sales`, { params });
  }

  //Final Summary Left-Table
  _getManageSalesFinalSummary(month: string, year: number): Observable<any> {
    const params = this.httpWrapper.createParams({
      Month: month,
      Year: year
    });
    return this.httpWrapper.get(`${this.apiURL}TradeReceivable/api/SalesData/get-sales-data/final-summary`, { params });
  }

  //Final Summary Right-Table
  _getSecondaryDiscounts(month: string, year: number): Observable<any> {
    const params = this.httpWrapper.createParams({
      Month: month,
      Year: year
    });
    return this.httpWrapper.get(
      `${this.apiURL}TradeReceivable/api/SalesData/get-secondary-discount`,
      { params }
    );
  }

  _postSecondaryDiscount(payload: any) {
    return this.httpWrapper.post(
      `${this.apiURL}TradeReceivable/api/SalesData/secondary-discount-initialize`,
      payload
    );
  }

  _patchSecondaryDiscount(payload: any) {
    return this.httpWrapper.patch(
      `${this.apiURL}TradeReceivable/api/SalesData/secondary-discount-update`,
      payload
    );
  }


  //Project-RR
  _getManageSalesProjectsRR(month: string, year: number): Observable<any> {
    const params = this.httpWrapper.createParams({
      Month: month,
      Year: year
    });
    return this.httpWrapper.get(`${this.apiURL}TradeReceivable/api/SalesData/get-projects-rr`, { params });
  }

  _getManageSalesProjects(month: string, year: number): Observable<ProjectsResponse> {
    const params = this.httpWrapper.createParams({
      Month: month,
      Year: year
    });
    return this.httpWrapper.get<ProjectsResponse>(`${this.apiURL}TradeReceivable/api/SalesData/get-projects`, { params });
  }

  _getManageSalesFTMFinal(month: string, year: number, pageNumber: number, pageSize: number): Observable<SalesFTMFinalResponse> {
    const encryptedParams: any = ({
      Month: month,
      Year: year
    });
    const plainParams: any = {
      pageNumber: pageNumber,
      pageSize: pageSize
    };
    return this.httpWrapper.get<SalesFTMFinalResponse>(
      `${this.apiURL}TradeReceivable/api/SalesData/get-sales-ftm-final`,
      {
        encryptedParams: encryptedParams,
        plainParams: plainParams
      }
    );
  }

  _getManageSalesEntries(month: string, year: number): Observable<any> {
    const params = this.httpWrapper.createParams({
      Month: month,
      Year: year
    });
    return this.httpWrapper.get(`${this.apiURL}TradeReceivable/api/SalesData/get-reopen-sale-entries`, { params });
  }


  //upload 
  _uploadProjectsRRAttachment(formData: FormData): Observable<any> {
    return this.httpWrapper.post<any>(`${this.apiURL}TradeReceivable/api/SalesData/projects-rr-upload`, formData);
  }

  _uploadProjectsAttachment(formData: FormData): Observable<any> {
    return this.httpWrapper.post<any>(`${this.apiURL}TradeReceivable/api/SalesData/projects-upload`, formData);
  }

  _uploadCreditNoteAttachment(formData: FormData): Observable<any> {
    return this.httpWrapper.post<any>(`${this.apiURL}TradeReceivable/api/SalesData/credit-note-upload`, formData);
  }

  _uploadGroupingSaleAttachment(formData: FormData): Observable<any> {
    return this.httpWrapper.post<any>(`${this.apiURL}TradeReceivable/api/SalesData/grouping-sales-upload`, formData);
  }

  _uploadSalesFTMAttachment(formData: FormData): Observable<any> {
    return this.httpWrapper.post<any>(`${this.apiURL}TradeReceivable/api/ExcelProcessor/sales-data-upload`, formData, {
      responseType: 'blob',
    });
  }

  _uploadSalesFTMFinalAttachment(formData: FormData): Observable<any> {
    return this.httpWrapper.post<any>(`${this.apiURL}TradeReceivable/api/SalesData/sales-ftm-final-upload`, formData);
  }

  _getMissingDataReport(params: {
    Month: string;
    Year: string;
    PortalStatusDate: string;
  }): Observable<any> {

    const httpParams = this.httpWrapper.createParams({
      Month: params.Month,
      Year: params.Year,
      PortalStatusDate: params.PortalStatusDate
    });

    return this.httpWrapper.get<any>(
      `${this.apiURL}TradeReceivable/api/ExcelProcessor/missing-data-report`,
      { params: httpParams }
    );
  }

  _uploadMissingDataAttachment(formData: FormData): Observable<any> {
    return this.httpWrapper.post<any>(`${this.apiURL}TradeReceivable/api/ExcelProcessor/upload-missing-portal-status`, formData, {
      responseType: 'blob',
    });
  }

  _exportMissingPortalStatus(params: {
    Month: string;
    Year: string;
    PortalStatusDate: string;
  }): Observable<Blob> {

    const httpParams = this.httpWrapper.createParams({
      Month: params.Month,
      Year: params.Year,
      PortalStatusDate: params.PortalStatusDate
    });

    return this.httpWrapper.get(
      `${this.apiURL}TradeReceivable/api/ExcelProcessor/export-missing-portal-status`,
      { params: httpParams, responseType: 'blob' }
    );
  }

  _exportSalesFTM(payload: { Month: string; Year: string }): Observable<Blob> {
    return this.httpWrapper.post(
      `${this.apiURL}TradeReceivable/api/ExcelProcessor/export-salesftm`,
      payload,
      { responseType: 'blob' }
    );
  }

  _exportSecondaryDiscount(month: string, year: number): Observable<Blob> {
    const params = this.httpWrapper.createParams({
      Month: month,
      Year: year
    });
    return this.httpWrapper.get(
      `${this.apiURL}TradeReceivable/api/SalesData/secondary-discount-export`,
      {
        params: params,
        responseType: 'blob'
      }
    );

  }

  _uploadSecondaryDiscountExcel(formData: FormData): Observable<any> { 
    return this.httpWrapper.post(
      `${this.apiURL}TradeReceivable/api/SalesData/secondary-discount-upload`, formData);
  }

}
