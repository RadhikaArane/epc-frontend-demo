export interface APIRESPONSE {
  statusCode: number
  data: any
}

export interface BALANCE {
  statusCode: number
  getMycartDetails: any
}


export interface LoginResponseModel { 
  StatusCode: number
   Status: number
  Message: string
  AccessToken: string
  RefreshToken: string
  data: any;
}

export interface ProductOfferingsResponseModel {
  statusCode: number
  product: any[]
}






export interface ApiResponseMaslModel{
  statusCode: number
  data: any
}

//user profile
export interface ApiResponseUserProfileModel {
  statusCode: number;
  data: any;
}

//ledger
export interface ApiLedgerResponseModel {
  statusCode: number;
  data : any;
}

//outstanding
export interface ApiOutstandingResponseModel {
  statusCode: number
  data: any;
}
