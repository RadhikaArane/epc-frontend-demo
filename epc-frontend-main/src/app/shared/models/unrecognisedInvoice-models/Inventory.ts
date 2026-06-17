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

export interface PanIndiaSummaryResponse {
  TotalStates: number
  Page: number
  PageSize: number
  States: StateData[];
  AllStateTotal: AllStateTotal[];
}

export interface PanIndiaSummaryBucketResponse {
  Page: number
  PageSize: number
  TotalCount: number
  TotalPages: number
  GrandTotalAmt: number
  Items: PanIndiaSummaryBucketItemResponse[]
  Item: any[]
}

//pan India Bucket summary
export interface PanIndiaSummaryBucketItemResponse {
  "Inv. Ref.": string
  "Sold To Party": string
  "Sold To Party Name": string
  "Installer No.": string
  "Installer Name": string
  "Registration No.": string
  "Portal Status": string
  "Bill Date": string
  Ageing: string
  "Sales Value": number
  "Billing / RR Pending reason Given For Dec25": any
  "Action Commitment Given in Jan26 for Completion / RR": any
  "Billing / RR / Completion Target Date in Jan26": any
  "Billing / RR Pending reason for Jan26": any
  "Action to be taken for Completion / RR in Feb26": any
  "Billing / RR / Completion Target Date in Feb26": any
  "Reviewed Remark By CEO/CFO in Feb26": any
  "Approved By in Feb26": any
  "Updated By in Feb26": any
}


//state wise 
export interface AgeingBucket {
  AgeingBucket: string;
  TotalAmount: number;
}

export interface StateWiseStageItem {
  State: string;
  Status: string;
  AgeingBuckets: AgeingBucket[];
  StatusTotalAmount: number;
}

export interface CombinedSum {
  State: string;
  AgeingBucket: string;
  GrandTotal: number;
}

export interface StateWiseStageSummaryResponse {
  Page: number;
  PageSize: number;
  TotalCount: number;
  TotalPages: number;
  GrandTotalAmt: number | null;
  Items: StateWiseStageItem[];
  CombinedSumsForStateAndAgeingBucket: CombinedSum[];
}
//state summary
export interface StateWiseAgingBucketItem {
  "Inv. Ref.": string
  "Sold To Party": string
  "Sold To Party Name": string
  "Installer No.": string
  "Installer Name": string
  "Registration No.": string
  "Portal Status": string
  "Bill Date": string
  Ageing: string
  "Sales Value": number
  "Billing / RR Pending reason Given For Sep25": any
  "Action Commitment Given in Oct25 for Completion / RR": any
  "Billing / RR / Completion Target Date in Oct25": any
  "Billing / RR Pending reason for Oct25": any
  "Action to be taken for Completion / RR in Nov25": any
  "Billing / RR / Completion Target Date in Nov25": any
  "Reviewed Remark By CEO/CFO in Nov25": any
  "Approved By in Nov25": any
  "Updated By in Nov25": any
}

export interface StateWiseAgingBucketResponse {
  Page: number;
  PageSize: number;
  TotalCount: number;
  TotalPages: number;
  GrandTotalAmt: number | null;
  Items: StateWiseAgingBucketItem[];
  Item: any[];
}


//area 
// Interfaces based on actual API response
export interface AgeingBucket {
  AgeingBucket: string;
  TotalAmount: number;
}

export interface AreaWiseStageItem {
  AreaName: string;
  Status: string;
  AgeingBuckets: AgeingBucket[];
  StatusTotalAmount: number;
}

export interface CombinedSum {
  AreaName: string;
  AgeingBucket: string;
  GrandTotal: number;
}

export interface AreaWiseStageSummaryResponse {
  Page: number;
  PageSize: number;
  TotalCount: number;
  TotalPages: number;
  Items: AreaWiseStageItem[];
  CombinedSumsForAreaAndAgeingBucket: CombinedSum[];
}



// Interface based on actual API response
export interface AreaWiseAgingBucketItem {
  "Inv. Ref.": string
  "Sold To Party": string
  "Sold To Party Name": string
  "Installer No.": string
  "Installer Name": string
  "Registration No.": string
  "Portal Status": string
  "Bill Date": string
  Ageing: string
  "Sales Value": number
  "Billing / RR Pending reason Given For Dec25": any
  "Action Commitment Given in Jan26 for Completion / RR": any
  "Billing / RR / Completion Target Date in Jan26": any
  "Billing / RR Pending reason for Jan26": any
  "Action to be taken for Completion / RR in Feb26": any
  "Billing / RR / Completion Target Date in Feb26": any
  "Reviewed Remark By CEO/CFO in Feb26": any
  "Approved By in Feb26": any
  "Updated By in Feb26": any
}

export interface AreaWiseAgingBucketResponse {
  Page: number;
  PageSize: number;
  TotalCount: number;
  TotalPages: number;
  GrandTotalAmt: number;
  Items: AreaWiseAgingBucketItem[];
  Item: any[];
}