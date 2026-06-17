// export interface faAssetResponse {
//   page: number;
//   pageSize: number;
//   totalCount: number;
//   items: faAssetsItem[];
// }

// export interface faAssetsItem {
//   AssetId: number;
//   AssetNumber: string;
//   Description: string;
//   AssetClass: string;
//   Location: string;
//   Status: string;
//   Method: string;
// }


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


export interface faAssetResponse {
  Page: number
  PageSize: number
  TotalRecords: number
  TotalPages: number
  Items: faAssetsItem[]
}

export interface faAssetsItem {
  AssetId: string
  AssetNumber: string
  Description: string
  AssetClassId: string
  LocationId: string
  Department: string
  CostCenter: string
  CapitalisationDate: string
  QuantityText: string
  PlantDescription: string
  PlantLocationCode: string
  PlantCode: string
  TagStatus: string
  CustomFieldsJson: string
  CreatedOn: string 
  UpdatedOn: string
}

// campaign model
export type Root = Campaign[]

export interface Campaign {
  Id: number
  Name: string
  StartDate: string
  EndDate: string
  IsActive: boolean
}