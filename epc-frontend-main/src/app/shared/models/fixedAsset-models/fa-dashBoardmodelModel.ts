export interface Summary {
  Location: string;
  AssetClass: string;
  TotalAssets: number;
  VerifiedManual: number;
  VerifiedScanned: number;
  VerifiedNonTaggable: number;
  Pending: number;
  CompletionPercentage: number;
}

// ✅ New API response structure
export interface DashboardResponse {
  campaignId: number;
  ghostReportedCount: number;

  data: DashboardSummaryData;
}

export interface DashboardSummaryData {
  Items: Summary[];
  TotalCount: number;
  TotalPages: number;
  Page: number;
  PageSize: number;
}

// export interface DashboardCountResponse {
//   TotalAssets: number;
//   TotalGhostAssets: number;
//   VerifiedManual: number;
//   VerifiedScanned: number;
//   NotAvailable: number;
// }


















export interface DashboardCountResponse {
  CampaignId: string
  TotalAssets: string
  VerifiedAssets: string
  NotAvailableAssets: string
  GhostAssetsFound: string
}


// export interface Summary {
//   Location: string;
//   AssetClass: string;
//   TotalAssets: number;
//   VerifiedManual: number;
//   VerifiedScanned: number;
//   VerifiedNonTaggable: number;
//   Pending: number;
//   CompletionPercentage: number;
// }

// export interface DashboardResponse {
//   campaignId: number;
//   ghostReportedCount: number;
//   missingCount: number;
//   verifiedCount: number;
//   totalAssetCount: number;
//   summary: Summary[];
// }

// export interface DashboardCountResponse {
//   TotalAssets: number
//   TotalGhostAssets: number
//   VerifiedManual: number
//   VerifiedScanned: number
//   NotAvailable: number 
// }

//

// export interface Root {
//   campaignId: number
//   ghostReportedCount: number
//   summary: Summary[]
// }

// export interface Summary {
//   Location: string
//   AssetClass: string
//   TotalAssets: number
//   VerifiedManual: number
//   VerifiedScanned: number
//   VerifiedNonTaggable: number
//   Pending: number
//   CompletionPercentage: number
// }

