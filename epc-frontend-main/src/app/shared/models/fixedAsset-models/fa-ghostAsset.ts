

export class faGhostAsset {
    Description: string;
    SerialOrModel: string;
    AssetClassId: number;
    LocationId: number; 
    ConditionRemarks: string;
    Photo: File | null;

    constructor(

    ) {
        this.Description = '';
        this.SerialOrModel = '';
        this.AssetClassId = 0;
        this.LocationId = 0;
        this.ConditionRemarks = '';
        this.Photo = null;
    }
}



export interface fagGetGhostAssetAPIResponse {
    Items: ItemFaGhost[]
    TotalCount: number
    TotalPages: number
    Page: number
    PageSize: number
}

export interface ItemFaGhost {
    GhostId: number
    Description: string
    SerialOrModel: string
    AssetClass: string
    Location: string
    PhotoUrl: string
    Status: string
    ReportedOn: string
}

