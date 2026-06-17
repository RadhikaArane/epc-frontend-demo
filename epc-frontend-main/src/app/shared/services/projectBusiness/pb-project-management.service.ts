import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpEncSrvWrapperService } from '../common/http-enc-srv-wrapper.service';
import { HttpClient, HttpContext, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { GetAllProject } from '../../models/projectBusiness-models/projectmanagement';
import { EncryptionServiceService } from '../common/encryption-service.service';
import { SKIP_LOADER } from '../../core/interceptors/epc-loader.interceptor';

@Injectable({
  providedIn: 'root'
})
export class PbProjectManagementService {
  private apiURL = environment.apiUrl;

  http = inject(HttpClient);
  httpWrapper = inject(HttpEncSrvWrapperService)
  encryptionSrv = inject(EncryptionServiceService);

  constructor() { }

  _getAllProject(params: any): Observable<GetAllProject> {
    const encryptedParams: any = {
      projectId: params.projectId,
      NodalAgencyId: params.nodalAgencyId
    };
    const plainParams: any = {
      page: params.page,
      pageSize: params.pageSize
    };
    return this.httpWrapper.get<GetAllProject>(`${this.apiURL}ProjectBusiness/api/Projects/GetProjectById?`, {
      encryptedParams: encryptedParams,
      plainParams: plainParams
    })
  }

  _getAllProjectExcel(): Observable<Blob> {
    return new Observable<Blob>(observer => {
      this.encryptionSrv.encryptSensitiveData({})
        .then(({ xAesKey, requestId }) => {

          const headers = new HttpHeaders()
            .set('x-aes-key', xAesKey)
            .set('x-request-id', requestId);

          const url = `${this.apiURL}ProjectBusiness/api/Export/project-details`;

          this.httpWrapper.get(url, { headers, responseType: 'blob' }).subscribe({
            next: (blob) => {
              observer.next(blob);
              observer.complete();
            },
            error: (err) => {
              observer.error(err);
            }
          });
        })
        .catch(err => {
          observer.error(err);
        });
    });
  }

  _deleteProject(projectId: string): Observable<any> {
    const params = this.httpWrapper.createParams({
      projectId: projectId
    })
    return this.httpWrapper.delete<any>(`${this.apiURL}ProjectBusiness/api/Projects/DeleteProject?`, { params })
  }


  _updateProject(updateData: any): Observable<any> {
    return this.httpWrapper.put<any>(`${this.apiURL}ProjectBusiness/api/Projects/UpdateProject?`, updateData)
  }

 






  //cost estimation
  _getCostHeads(activeOnly: boolean = true): Observable<any> {
    const params = this.httpWrapper.createParams({
      activeOnly: activeOnly
    })
    return this.httpWrapper.get<any>(
      `${this.apiURL}ProjectBusiness/api/CostHeads?`, { params }
    );
  }

  _createCostHead(data: any): Observable<any> {
    return this.httpWrapper.post<any>(
      `${this.apiURL}ProjectBusiness/api/CostHeads/CreateCostHead`,
      data
    );
  }

  _updateCostHead(data: { costHeadId: string; name: string; isActive: string }): Observable<any> {
    return this.httpWrapper.put<any>(
      `${this.apiURL}ProjectBusiness/api/CostHeads/UpdateCostHead`,
      data
    );
  }

  _deactivateCostHead(costHeadId: string): Observable<any> {
    const params = this.httpWrapper.createParams({
      costHeadId: costHeadId
    })
    return this.httpWrapper.delete<any>(
      `${this.apiURL}ProjectBusiness/api/CostHeads/DeactivateCostHead?`, { params }
    );
  }

  // get su heads
  // ==================== Sub Cost Heads ====================

  _createSubHead(payload: { costHeadId: string; name: string }): Observable<any> {
    return this.httpWrapper.post(`${this.apiURL}ProjectBusiness/api/SubHeads/CreateSubHead`, payload);
  }

  _getSubHeads(costHeadId: string = '', activeOnly: boolean = true): Observable<any> {
    const paramObj: any = { activeOnly };
    if (costHeadId) paramObj.costHeadId = costHeadId;
    const params = this.httpWrapper.createParams(paramObj);
    return this.httpWrapper.get(`${this.apiURL}ProjectBusiness/api/SubHeads/GetSubHeads`, { params, context: new HttpContext().set(SKIP_LOADER, true) });
  }

  _updateSubHead(payload: { subHeadId: string; name: string; isActive: string }): Observable<any> {
    return this.httpWrapper.put(`${this.apiURL}ProjectBusiness/api/SubHeads/UpdateSubHead`, payload);
  }

  _deactivateSubHead(subHeadId: string): Observable<any> {
    const params = this.httpWrapper.createParams({ subHeadId });
    return this.httpWrapper.delete(`${this.apiURL}ProjectBusiness/api/SubHeads/DeactivateSubHead`, { params });
  }



  _getCostHeadExcelAmount(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('excelFile', file);
    return this.httpWrapper.post(`${this.apiURL}ProjectBusiness/api/CostHeads/GetExcelAmount`, formData);
  }

  _downloadBulkCostBasisExcel(): Observable<Blob> {
    return this.httpWrapper.get(`${this.apiURL}ProjectBusiness/api/CostHeads/DownloadBulkAssignTemplate`, { responseType: 'blob', context: new HttpContext().set(SKIP_LOADER, true) });
  }

  _previewBulkCostBasisExcel(formData: FormData): Observable<any> {
    return this.httpWrapper.post(`${this.apiURL}ProjectBusiness/api/CostHeads/PreviewBulkAssignExcel`, formData);
  }

  _uploadBulkCostBasisExcel(formData: FormData): Observable<any> {
    return this.httpWrapper.post(`${this.apiURL}ProjectBusiness/api/CostHeads/BulkAssignFromExcel`, formData);
  }

  _getCostHeadExcelDetails(projectId: string, costHeadId: string): Observable<any> {
    const params = this.httpWrapper.createParams({
      projectId: projectId,
      costHeadId: costHeadId
    })
    return this.httpWrapper.get<any>(
      `${this.apiURL}ProjectBusiness/api/CostHeads/GetCostHeadExcelDetails`, { params }
    );
  }

  _calculateLineItemAmount(qty: number, rate: number): Observable<any> {
    const plainParams: any = {
      qty: qty,
      rate: rate
    };
    return this.httpWrapper.get<any>(`${this.apiURL}ProjectBusiness/api/CostHeads/CalculateAmount`, { plainParams: plainParams, context: new HttpContext().set(SKIP_LOADER, true) }
    );
  }

  _updateCostHeadEstimation(data: any): Observable<any> {
    return this.httpWrapper.put<any>(`${this.apiURL}ProjectBusiness/api/CostHeads/UpdateCostHeadEstimation`, data);
  }

  _assignCostHeaders(data: FormData): Observable<any> {
    return this.httpWrapper.post<any>(
      `${this.apiURL}ProjectBusiness/api/CostHeads/AssignHeaders`,
      data
    );
  }

  _assignSubHeaders(formData: FormData): Observable<any> {
    return this.httpWrapper.post<any>(`${this.apiURL}ProjectBusiness/api/CostHeads/AssignSubHeaders`, formData);
  }

  _getVendors(page: number = 1, pageSize: number = 10): Observable<any> {
    const encryptedParams: any = {
      onlyActive: true,
    };
    const plainParams: any = {
      page: page,
      pageSize: pageSize
    };
    return this.httpWrapper.get<any>(
      `${this.apiURL}ProjectBusiness/api/CostHeads/GetVendors?`, {
      encryptedParams: encryptedParams,
      plainParams: plainParams
    }
    );
  }

  _getProjectCostHeadId(projectId: any): Observable<any> {
    const params = this.httpWrapper.createParams({
      projectId: projectId
    })
    return this.httpWrapper.get<any>(
      `${this.apiURL}ProjectBusiness/api/CostHeads/GetProjectCostHeads?`, { params }
    );
  }

  _assignVendorsToCostHead(data: Array<{
    projectId: string;
    projectCostHeadId: string;
    vendorAssignmentsJson: string;
  }>): Observable<any> {
    return this.httpWrapper.post<any>(`${this.apiURL}ProjectBusiness/api/CostHeads/assignvendors`, data)
  }


  _uploadVendorAttachments(formData: FormData): Observable<any> {
    return this.httpWrapper.post<any>(
      `${this.apiURL}ProjectBusiness/api/VendorAttachments/UploadVendorAttachments`,  // adjust URL if needed
      formData
    );
  }

  _getProjectCostHeads(): Observable<any> {
    const params = this.httpWrapper.createParams({
      projectId: "49B33621-6A8B-4FCA-805F-66E3627CC124"
    })
    return this.httpWrapper.get<any>(`${this.apiURL}ProjectBusiness/api/CostHeads/ListProjectCostHead?`, { params });
  }
  // 6, 10 pending

















  //manage cost estimation
  _getAllProjectsDropdown(params: { page: number; pageSize: number }): Observable<any> {
    const plainParams: any = {
      page: params.page,
      pageSize: params.pageSize
    };

    return this.httpWrapper.get<any>(
      `${this.apiURL}ProjectBusiness/api/ProjectExpense/GetAllProjects?`,
      {
        plainParams: plainParams,
        context: new HttpContext().set(SKIP_LOADER, true)
      }
    );
  }

  // Get project details by ID
  _getProjectById(projectId: string): Observable<any> {
    const params = this.httpWrapper.createParams({
      projectId: projectId
    });

    return this.httpWrapper.get<any>(
      `${this.apiURL}ProjectBusiness/api/Projects/GetProjectById?`,
      { params }
    );
  }

  // Get project cost head amounts
  _getProjectCostHeadAmounts(projectId: string): Observable<any> {
    const params = this.httpWrapper.createParams({
      projectId: projectId
    });

    return this.httpWrapper.get<any>(
      `${this.apiURL}ProjectBusiness/api/ProjectExpense/GetProjectCostHeadAmounts?`,
      { params }
    );
  }

  // Save project cost estimation (add this when backend API is ready)
  _saveProjectCostEstimation(payload: any[]): Observable<any> {
    return this.httpWrapper.post<any>(
      `${this.apiURL}ProjectBusiness/api/ProjectExpense/SaveProjectCostEstimation`,
      payload
    );
  }











  //edit page
  // Add these methods to your PbProjectManagementService class

  // Get vendors assigned to a specific project cost head
  _getProjectCostHeadVendors(projectCostHeadId: string): Observable<any> {
    const params = this.httpWrapper.createParams({
      projectCostHeadId: projectCostHeadId
    });
    return this.httpWrapper.get<any>(
      `${this.apiURL}ProjectBusiness/api/CostHeads/VendorsList?`,
      { params }
    );
  }

  // Get attachments for a specific vendor
  _getVendorAttachments(projectCostHeadVendorId: string): Observable<any> {
    const params = this.httpWrapper.createParams({
      projectCostHeadVendorId: projectCostHeadVendorId
    });
    return this.httpWrapper.get<any>(
      `${this.apiURL}ProjectBusiness/api/VendorAttachments?`,
      { params }
    );
  }

  // In your PbProjectManagementService

  _getVendorAttachmentDownload(attachmentParams: any): Observable<Blob> {
    return new Observable<Blob>(observer => {
      this.encryptionSrv.encryptSensitiveData({
        attachmentId: attachmentParams.attachmentId,
        projectCostHeadVendorId: attachmentParams.projectCostHeadVendorId
      }).then(({ encryptedParams, xAesKey, requestId }) => {

        const headers = new HttpHeaders()
          .set('x-aes-key', xAesKey)
          .set('x-request-id', requestId);

        const encryptedAttachmentId = encodeURIComponent(encryptedParams['attachmentId']);
        const encryptedVendorId = encodeURIComponent(encryptedParams['projectCostHeadVendorId']);

        const url = `${this.apiURL}ProjectBusiness/api/VendorAttachments/DownloadAttachment?attachmentId=${encryptedAttachmentId}&projectCostHeadVendorId=${encryptedVendorId}`;

        this.http.get(url, { headers, responseType: 'blob' }).subscribe({
          next: (blob) => {
            observer.next(blob);
            observer.complete();
          },
          error: (err) => {
            observer.error(err);
          }
        });
      }).catch(err => {
        observer.error(err);
      });
    });
  }

  // Update cost basis and amounts
  _updateProjectCostHeadAmounts(data: Array<{
    projectCostHeadId: string;
    costBasis: string;
    amount: number;
  }>): Observable<any> {
    return this.httpWrapper.put<any>(
      `${this.apiURL}ProjectBusiness/api/CostHeads/AssignHeaders`,
      data
    );
  }

  // Remove vendor from project cost head
  _removeProjectCostHeadVendor(projectCostHeadVendorId: string): Observable<any> {
    const params = this.httpWrapper.createParams({
      projectCostHeadVendorId: projectCostHeadVendorId
    });
    return this.httpWrapper.delete<any>(
      `${this.apiURL}ProjectBusiness/api/CostHeads/DeleteCostHeaderVendor?`,
      { params }
    );
  }

  // Delete vendor attachment
  _deleteVendorAttachment(attachmentId: string): Observable<any> {
    const params = this.httpWrapper.createParams({
      attachmentId: attachmentId
    });
    return this.httpWrapper.delete<any>(
      `${this.apiURL}ProjectBusiness/api/VendorAttachments/DeleteVendorAttachment?`,
      { params }
    );
  }










 





  //vendor attachment
  _uploadVendorAttachment(formData: FormData): Observable<any> {
    return this.httpWrapper.post<any>(`${this.apiURL}ProjectBusiness/api/Export/upload-vendor-master`, formData)
  }
  _getAllVendors(params: { page: number; pageSize: number }): Observable<any> {
    const plainParams: any = {
      page: params.page,
      pageSize: params.pageSize
    };
    return this.httpWrapper.get<any>(
      `${this.apiURL}ProjectBusiness/api/ProjectExpense/GetAllVendors?`,
      { plainParams: plainParams }
    );
  }

  _uploadCustomerAttachment(formData: FormData): Observable<any> {
    return this.httpWrapper.post<any>(`${this.apiURL}ProjectBusiness/api/Export/upload-customer-master`, formData)
  }

  _getAllCustomerList(params: { page: number; pageSize: number }): Observable<any> {
    const plainParams: any = {
      page: params.page,
      pageSize: params.pageSize
    };
    return this.httpWrapper.get<any>(
      `${this.apiURL}ProjectBusiness/api/ProjectExpense/GetAllCustomers?`,
      { plainParams: plainParams }
    );
  }
 



  _getProjectCostHeadRevisions(projectId: string, costHeadId: string): Observable<any> {
    const params = this.httpWrapper.createParams({
      projectId: projectId,
      costHeadId: costHeadId
    });
    return this.httpWrapper.get<any>(`${this.apiURL}ProjectBusiness/api/ProjectExpense/GetRevisions?`, { params });
  }

 



}

