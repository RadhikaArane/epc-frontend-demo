export interface verifiedResponse {
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  data: verifiedItem[];
}

export interface verifiedItem {
  CampaignName: string
  AssetNumber: string
  AssetDescription: string
  AssetClass: string
  Location: string
  QuantityText: string
  Status: string
  Method: string
  VerifiedBy: string
  VerifiedOn: string
  Latitude: string
  Longitude: string
  Remarks: string
  VerificationImagePath?: string
}


export interface faLocationClassAPIResponse {
  Locations: faLocation[]
  AssetClasses: faAssetClass[]
}

export interface faLocation {
  LocationId: number
  LocationName: string
}

export interface faAssetClass {
  AssetClassId: number
  ClassName: string
}  


// export interface verifiedResponse {
//   page: number;
//   pageSize: number;
//   totalCount: number;
//   items: verifiedItem[];
// }

// export interface verifiedItem {
//   AssetId: number;
//   AssetNumber: string;
//   Description: string;
//   AssetClass: string;
//   Location: string;
//   Status: string;
//   Method: string;
// }


// export interface faLocationClassAPIResponse {
//   Locations: faLocation[]
//   AssetClasses: faAssetClass[]
// }

// export interface faLocation {
//   LocationId: number
//   LocationName: string
// }

// export interface faAssetClass {
//   AssetClassId: number
//   ClassName: string
// }  