export interface NonVerifiedAsset {
  Page: number
  PageSize: number
  TotalRecords: number
  TotalPages: number
  Items: Item[]
}

export interface Item {
  AssetId: string
  AssetNumber: string
  Description: string
  AssetClassId: string
  AssetClassName: string
  LocationId: string
  LocationName: string
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
  UpdatedOn: any
  ImportId: string
  CampaignId: string
}
