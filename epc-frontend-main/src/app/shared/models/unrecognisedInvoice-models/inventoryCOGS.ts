export interface DynamicColumnResponse {
  IsSuccess: boolean;
  Data: string[];
}

export interface AgingData {
  AgingBucket: string;
  Amount: number;
}

export interface StateData {
  State: string;
  AgingData: AgingData[];
  StateTotal: number;
}

export interface AllStateTotal {
  AgingBucket: string;
  Amount: number;
}

export interface COGSPanIndiaSummaryResponse {
  TotalStates: number;
  Page: number;
  PageSize: number;
  States: StateData[];

  AllStateTotal: AllStateTotal[];
}

export interface COGSPanBucketItem {
  "Customer Name": string
  State: string
  "Sales Value": number
  "Sold to Party": string
  "Reg No": string
  "Installer No.": string
  "Installer Name": string
  "Sold to Party Name": string
  "Billing No": string
  "Billing Date": string
  "Portal Status": string
  Days: string
  Ageing: string
  "Billing / RR Pending reason Given For Dec25": any
  "Action Commitment Given in Jan26 for Completion / RR": any
  "Billing / RR / Completion Target Date in Jan26": any
  "Billing / RR Pending reason for Jan26": any
  "Action to be taken for Completion / RR in Feb26": any
  "Billing / RR / Completion Target Date in Feb26": any
  "CEO/CFO (HO Office Reviewed) in Feb26": any
  "Approved By in Feb26": any
  "Updated By in Feb26": any
}

export interface COGSPanBucketResponse {
  Page: number;
  PageSize: number;
  TotalCount: number;
  TotalPages: number;
  GrandTotalAmt: number;
  Items: COGSPanBucketItem[];
  Item: any[];
}


//state
export interface StateAgeingBucket {
  AgeingBucket: string;
  TotalAmount: number;
}

export interface StateWiseStageItem {
  State: string;
  Status: string;
  AgeingBuckets: StateAgeingBucket[];
  StatusTotalAmount: number;
}

export interface StateCombinedSum {
  State: string;
  AgeingBucket: string;
  GrandTotal: number;
}

export interface COGSStateWiseSummaryResponse {
  Page: number;
  PageSize: number;
  TotalCount: number;
  TotalPages: number;
  GrandTotalAmt: number | null;
  Items: StateWiseStageItem[];
  CombinedSumsForStateAndAgeingBucket: StateCombinedSum[];
}


export interface COGSStateBucketItem {
  "Customer Name": string
  State: string
  "Sales Value": number
  "Sold to Party": string
  "Reg No": string
  "Installer No.": string
  "Installer Name": string
  "Sold to Party Name": string
  "Billing No": string
  "Billing Date": string
  "Portal Status": string
  Days: number
  Ageing: string
  "Billing / RR Pending reason Given For Dec25": any
  "Action Commitment Given in Jan26 for Completion / RR": any
  "Billing / RR / Completion Target Date in Jan26": any
  "Billing / RR Pending reason for Jan26": any
  "Action to be taken for Completion / RR in Feb26": any
  "Billing / RR / Completion Target Date in Feb26": any
  "CEO/CFO (HO Office Reviewed) in Feb26": any
  "Approved By in Feb26": any
  "Updated By in Feb26": any

}

export interface COGSStateBucketResponse {
  Page: number;
  PageSize: number;
  TotalCount: number;
  TotalPages: number;
  GrandTotalAmt: number;
  Items: COGSStateBucketItem[];
  Item: any[];
}


//area
export interface AreaAgeingBucket {
  AgeingBucket: string;
  TotalAmount: number;
}

export interface AreaWiseStageItem {
  AreaName: string;
  Status: string;
  AgeingBuckets: AreaAgeingBucket[];
  StatusTotalAmount: number;
}

export interface AreaCombinedSum {
  AreaName: string;
  AgeingBucket: string;
  GrandTotal: number;
}

export interface COGSAreaWiseSummaryResponse {
  Page: number;
  PageSize: number;
  TotalCount: number;
  TotalPages: number;
  Items: AreaWiseStageItem[];
  CombinedSumsForAreaAndAgeingBucket: AreaCombinedSum[];
}

export interface COGSAreaBucketItem {
  AreaName: string
  DealerCode: string
  DealerName: string
  "Material Description": string
  "Customer Name": string
  Catogery: string
  State: string
  "Value Unrestricted": string
  Concat: string
  "Sold to Party": string
  "Reg No": string
  "Installer No.": string
  "Installer Name": string
  "Sold to Party Name": string
  "Billing Document": string
  "Billing Date": string
  "F.Y": string
  Month: string
  "Portal Status": string
  Days: number
  Ageing: string
  // "Previous Pending Reason": string
  // "Previous Action Commitment": string
  // "Previous Complition Target Date": string
  // "Curr Billing/RR Pending Reason": string
  // "Action To Be Taken For Complition/RR": string
  // "Billing/RR Complition Target Date": string
  [key: string]: any;
}

export interface COGSAreaBucketResponse {
  Page: number;
  PageSize: number;
  TotalCount: number;
  TotalPages: number;
  GrandTotalAmt: number;
  Items: COGSAreaBucketItem[];
  Item: any[];
}
