
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpEncSrvWrapperService } from '../common/http-enc-srv-wrapper.service';
import { Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { EncryptionServiceService } from '../common/encryption-service.service';


@Injectable({
  providedIn: 'root',
})
export class UrUploadCenterService {
 
  private apiURL = environment.apiUrl;
  private httpWrapper = inject(HttpEncSrvWrapperService);
  private http = inject(HttpClient);
  private encryptionSrv = inject(EncryptionServiceService);

  /**
   * SAP Single File Upload
   * employeeId is passed in URL to bypass the 400 validation error
   */
  _uploadSAPUnrecognised(formData: FormData): Observable<any> {
    return this.httpWrapper.post<any>(
      `${this.apiURL}UnrecognisedInvoice/Common/api/Upload/excel`,
      formData
    );
  }

  /**
   * SalesFTM Multiple File Upload
   */
  uploadSalesFTM(formData: FormData): Observable<any> {
    return this.httpWrapper.post<any>(
      `${this.apiURL}UnrecognisedInvoice/Common/api/Upload/sales-ftm-excel`,
      formData
    );
  }


  getUploadDates(tableName: string): Observable<any> {
  return this.httpWrapper.get<any>(`${this.apiURL}UnrecognisedInvoice/Common/api/Upload/get-upload-dates`, {
    plainParams: {},
    encryptedParams: { TableName: tableName }
  });
}

exportSalesFTMByUploadDate(selectedDate: string): Observable<Blob> {
  return this.httpWrapper.get<Blob>(
    `${this.apiURL}UnrecognisedInvoice/Common/api/Upload/export-by-upload-date-SalesFTM`,
    {
      plainParams: {},
      encryptedParams: { SelectedDate: selectedDate },
      responseType: 'blob' as any
    }
  );
}

exportConsignmentByUploadDate(selectedDate: string): Observable<Blob> {
  return this.httpWrapper.get<Blob>(
    `${this.apiURL}UnrecognisedInvoice/Common/api/Upload/export-by-upload-date-Consignment`,
    {
      plainParams: {},
      encryptedParams: { SelectedDate: selectedDate },
      responseType: 'blob' as any
    }
  );
}

// Add this inside UrUploadCenterService
  exportLatestNotConsidered(selectedDate: string, employeeId: string): Observable<Blob> {
    return this.httpWrapper.get<Blob>(
      `${this.apiURL}UnrecognisedInvoice/Common/api/InventoryDashboard/debit-below-recognised/export`,
      {
        plainParams: {},
        encryptedParams: { 
          EmployeeId: employeeId, 
          SelectedDate: selectedDate 
        },
        responseType: 'blob' as any
      }
    );
  }

  // Download Excel for Missing Reg No
  exportMissingRecords(selectedDate: string, employeeId: string): Observable<Blob> {
    return this.httpWrapper.get<Blob>(
      `${this.apiURL}UnrecognisedInvoice/Common/api/MissedRegistration/export`,
      {
        plainParams: {},
        encryptedParams: { 
          EmployeeId: employeeId, 
          SelectedDate: selectedDate 
        },
        responseType: 'blob' as any
      }
    );
  }

  // Upload Excel for Missing Reg No
  uploadMissingRecords(formData: FormData): Observable<any> {
    return this.httpWrapper.post<any>(
      `${this.apiURL}UnrecognisedInvoice/Common/api/MissedRegistration/upload-reg-update`, // Clean URL!
      formData
    );
  }
  
  
  
}