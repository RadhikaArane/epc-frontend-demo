//debit
// Updated models for new API response
export interface DebitSummary {
  State: string;
  Age0To6Months: number;
  Age6To12Months: number;
  Age1To2Years: number;
  Age2To3Years: number;
  AgeMoreThan3Years: number;
  Total: number;
}

export interface DebitDetailResponse {
  PageNumber: number;
  PageSize: number;
  TotalCount: number;
  TotalPages: number;
  Items: DebitDetail[];
}

export interface DebitDetail {
  Concat: string
  State: string
  "Zonal Manager": string
  Customer: string
  Name: string
  District: any
  City: any
  "Inv. Ref.": string
  "Distribution Channel": string
  "Doc Type": string
  "Sold To Party": string
  "Sold To Party Name": string
  "Installer No.": string
  "Installer Name": string
  "Registration No.": string
  SG: string
  Date: string
  "Due Date": string
  Total: number
  "Gross Inv Value"?: number
  "Market type": string
  Remark: string
  "Pending O/S %"?: number
  "01-12-2025": number
  Ageing: string
  "New Ageing": string
  "New Addi Ageing": string
  "Ageing -1": string
  "Not Due/Overdue": string
  "Portal Status 01-12-2025": string
  "Final Category": string
  "Cat-1": string
  "Additional PDD": string
  PDD: string
  "Installation Date": any
  rem: string
  "RR Pending": string
  "Portal Status 01-11-2025": string
  "Final Category 01-11-2025": string

  [key: string]: any;
}

export interface StateAccordionData {
  state: string;
  isOpen: boolean;
  isLoading: boolean;
  currentPage: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  items: DebitDetail[];
}

//credit
export interface CreditSummary {
  State: string;
  TotalCreditAmount: number;
}

export interface CreditDetailResponse {
  PageNumber: number;
  PageSize: number;
  TotalCount: number;
  TotalPages: number;
  Items: CreditDetail[];
}

export interface CreditDetail {
  Concat: string;
  State: string;
  Customer: string;
  Name: string;
  "Inv. Ref": string;
  Amt: number;
  "Distribution Channel": string;
  "Market type": string;
  [key: string]: any;
}

export interface StateAccordionDataCredit {
  state: string;
  isOpen: boolean;
  isLoading: boolean;
  currentPage: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  items: CreditDetail[];
}