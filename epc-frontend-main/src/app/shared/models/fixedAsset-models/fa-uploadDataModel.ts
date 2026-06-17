export interface UploadHistoryResponse {
  totalRecords: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  items: UploadHistoryItem[];
}

export interface UploadHistoryItem {
  ImportId: string
  CampaignName: string
  UploadedByFullName: string
  UploadedOn: string
  FileName: string
  TotalRows: string
  SuccessRows: string
  FailedRows: string
  ErrorFilePath: any
}

// export interface UploadHistoryItem {
//   importId: number;
//   campaignId: number;
//   uploadedBy: number;
//   uploadedOn: string;
//   fileName: string;
//   totalRows: number;
//   successRows: number;
//   failedRows: number;
//   errorFilePath: string | null;
// }




export class UploadHistoryCreatePayload {
  
  
    CampaignName: string
    ErrorFilePath: string | null;

  constructor() {
    this.ErrorFilePath = null;
    this.CampaignName = '';
  }
}
