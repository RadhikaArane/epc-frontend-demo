// ✅ UI lo use chese model (camelCase)
export interface NonTaggableRequest {
  requestId: number;
  campaignName: string;
  assetNumber: string;
  requestedBy: string;
  requestedOn: string;
  reason: string;
  photoPath: string;
  status: string;
  reviewedBy: any;
  reviewedOn: any;
  reviewRemarks: any;
}

// ✅ Backend response shape (PascalCase) - API nundi as-it-is vastundi
export interface NonTaggableResponseApi {
  Items: NonTaggableRequestApi[];
  TotalCount: number;
  TotalPages: number;
  Page: number;
  PageSize: number;
}

export interface NonTaggableRequestApi {
  RequestId: number;
  CampaignName: string;
  AssetNumber: string;
  RequestedBy: string;
  RequestedOn: string;
  Reason: string;
  PhotoPath: string;
  Status: string;
  ReviewedBy: any;
  ReviewedOn: any;
  ReviewRemarks: any;
}

// export interface NonTaggableRequest {
//   requestId: number;
//   campaignName: string;
//   assetNumber: string;
//   requestedBy: string;
//   requestedOn: string;
//   reason: string;
//   photoPath: string;
//   status: string;
//   reviewedBy: string | null;
//   reviewedOn: string | null;
//   reviewRemarks: string | null;
// }

// export interface NonTaggableResponse {
//   items: NonTaggableRequest[];
//   totalCount: number;
// }

//---

// export interface NonTaggableResponse {
//   Items: NonTaggableResponse
//   items: NonTaggableRequest[]
//   totalCount: number
//   totalPages: number
//   page: number
//   pageSize: number
// }

// export interface NonTaggableRequest {
//   requestId: number
//   campaignName: string
//   assetNumber: string
//   requestedBy: string
//   requestedOn: string
//   reason: string
//   photoPath: string
//   status: string
//   reviewedBy: any
//   reviewedOn: any
//   reviewRemarks: any
// }
