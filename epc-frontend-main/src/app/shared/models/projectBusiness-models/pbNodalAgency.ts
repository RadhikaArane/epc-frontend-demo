//nodal agency models
export interface NodalAgencyResponse {
    StatusCode: number
    Data: GetNodalAgency[]
}
export interface GetNodalAgency {
    NodalAgencyId: string
    NodalAgencyName: string
}

export class AddNewNodalAgency {
    nodalAgencyName: string
    constructor() {
        this.nodalAgencyName = '';
    }
}

export class updateNodalAgency {
    nodalAgencyId: string;
    nodalAgencyName: string
    constructor() {
        this.nodalAgencyId = '';
        this.nodalAgencyName = '';
    }
}
