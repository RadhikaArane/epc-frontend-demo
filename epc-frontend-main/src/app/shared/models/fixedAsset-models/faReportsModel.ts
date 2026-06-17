export interface faScanHistoryResponse {
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  data: faVerifiedAsset[];
}

export interface faVerifiedAsset {
  VerificationId: number;
  CampaignId: number;
  AssetId: number;
  Status: string;
  Method: string;
  VerifiedBy: number;
  VerifiedOn: string;
  Latitude: number;
  Longitude: number;
  Remarks: string;
  QrRawText: string | null;
  QrParsedJson: string | null;
  VerificationImagePath: string | null;
}