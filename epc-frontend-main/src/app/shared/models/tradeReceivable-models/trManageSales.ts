// Rough Summary
export interface Root {
  Table1: Table1
  Table2: Table2
}

export interface Table1 {
  Rows: Row[]
}

export interface Row {
  ProjectType: string
  RegionDesc?: string
  Considered: number
  NotConsidered: number
  SalesReturnOpen: number
  SalesReturnProject: number
  GrandTotal: number
  IsSubtotal: boolean
  IsGrandTotal: boolean
}

export interface Table2 {
  Rows: Row2[]
}

export interface Row2 {
  SaleStatus: string
  RegionDesc?: string
  MarchAndBefore: number
  AprToCurrentMonthMinus1: number
  GrandTotal: number
  IsSubtotal: boolean
  IsGrandTotal: boolean
}

// Final Summary
export interface Root {
  Month: string
  Year: number
  Considered: Considered
  SaleReversal: SaleReversal
  NetSaleBeforeADJ: NetSaleBeforeAdj
  InstitutionalSale: InstitutionalSale
  Discounts: Discounts
  CreditNote: CreditNote
  FreightRecoverynotconsideredasSale: FreightRecoverynotconsideredasSale
  NetSaleAfterADJ: NetSaleAfterAdj
  NotConsidered: NotConsidered
  GrossSale: GrossSale
  NetSale: number
  NetSaleDifference: number
}

export interface Considered {
  Rows: ConsideredRow[]
  Total: ConsideredTotal
}

export interface ConsideredRow {
  State: string
  Open: number
  ProjectMarket: number
  Institutional: number
  ProjectsBusiness: number
  Export: number
  Total: number
  Before_2024_25: number
  YTD_PreviousMonth: number
  InstitutionalSale: number
  FinalSale: number
}

export interface ConsideredTotal {
  State: string
  Open: number
  ProjectMarket: number
  Institutional: number
  ProjectsBusiness: number
  Export: number
  Total: number
  Before_2024_25: number
  YTD_PreviousMonth: number
  InstitutionalSale: number
  FinalSale: number
}

export interface SaleReversal {
  Rows: SaleReversalRow[]
  Total: SaleReversalTotal
}

export interface SaleReversalRow {
  State: string
  Open: number
  ProjectMarket: number
  Institutional: number
  ProjectsBusiness: number
  Export: number
  Total: number
  Before_2024_25: any
  YTD_PreviousMonth: any
  InstitutionalSale: any
  FinalSale: number
}

export interface SaleReversalTotal {
  State: string
  Open: number
  ProjectMarket: number
  Institutional: number
  ProjectsBusiness: number
  Export: number
  Total: number
  Before_2024_25: any
  YTD_PreviousMonth: any
  InstitutionalSale: any
  FinalSale: number
}

export interface NetSaleBeforeAdj {
  Label: string
  Open: number
  ProjectMarket: number
  Institutional: number
  ProjectsBusiness: number
  Export: number
  Total: number
  Before_2024_25: number
  YTD_PreviousMonth: number
  InstitutionalSale: number
  FinalSale: number
}

export interface InstitutionalSale {
  Label: string
  Open: number
  ProjectMarket: number
  Institutional: number
  ProjectsBusiness: number
  Export: number
  Total: number
  Before_2024_25: number
  YTD_PreviousMonth: number
  InstitutionalSale: number
  FinalSale: number
}

export interface Discounts {
  Label: string
  Open: number
  ProjectMarket: number
  Institutional: number
  ProjectsBusiness: number
  Export: number
  Total: number
  Before_2024_25: number
  YTD_PreviousMonth: number
  InstitutionalSale: number
  FinalSale: number
}

export interface CreditNote {
  Label: string
  Open: number
  ProjectMarket: number
  Institutional: number
  ProjectsBusiness: number
  Export: number
  Total: number
  Before_2024_25: number
  YTD_PreviousMonth: number
  InstitutionalSale: number
  FinalSale: number
}

export interface FreightRecoverynotconsideredasSale {
  Label: string
  Open: number
  ProjectMarket: number
  Institutional: number
  ProjectsBusiness: number
  Export: number
  Total: number
  Before_2024_25: number
  YTD_PreviousMonth: number
  InstitutionalSale: number
  FinalSale: number
}

export interface NetSaleAfterAdj {
  Label: string
  Open: number
  ProjectMarket: number
  Institutional: number
  ProjectsBusiness: number
  Export: number
  Total: number
  Before_2024_25: number
  YTD_PreviousMonth: number
  InstitutionalSale: number
  FinalSale: number
}

export interface NotConsidered {
  Rows: NotConsideredRow[]
  Total: NotConsideredTotal
}

export interface NotConsideredRow {
  State: string
  Open: number
  ProjectMarket: number
  Institutional: number
  ProjectsBusiness: number
  Export: number
  Total: number
  Before_2024_25: number
  YTD_PreviousMonth: number
  InstitutionalSale: number
  FinalSale: number
}

export interface NotConsideredTotal {
  State: string
  Open: number
  ProjectMarket: number
  Institutional: number
  ProjectsBusiness: number
  Export: number
  Total: number
  Before_2024_25: number
  YTD_PreviousMonth: number
  InstitutionalSale: number
  FinalSale: number
}

export interface GrossSale {
  Label: string
  Open: number
  ProjectMarket: number
  Institutional: number
  ProjectsBusiness: number
  Export: number
  Total: number
  Before_2024_25: number
  YTD_PreviousMonth: number
  InstitutionalSale: number
  FinalSale: number
}

//Final Summary Table 2
export interface SecondaryDiscountsGet {
  Month: string
  Year: number
  Data: SecondaryDiscountsGetData[]
  Total: any
  TotalRows: number
}

export interface SecondaryDiscountsGetData {
  State: string
  SecondaryFreightAsDiscount: number
  ProvisionCreditNoteOpenMarket: number
  FCDiscountProjectMkt: number
  FOCCreditNote: number 
  DomesticFreightRecovery: number
  InstitutionalSale: number
  SalesReversal: number
  FinalSale: number
}

// Add this to your trManageSales.ts file
export interface SecondaryDiscountsPatch {
  Month: string;
  Year: string;
  Data: SecondaryDiscountsGetData[];
}



//projects RR get 
export interface ProjectsRRResponse {
  Month: string;
  Year: number;
  Columns: string[];
  Rows: ProjectsRRRow[];
  TotalRows: number;
}
export interface ProjectsRRRow {
  [key: string]: string | number | null;
}
export interface ProjectsRRRowTyped {
  YearMonth: string;
  GL_Account: string;
  Posting_Date: string;
  Document_Type: string;
  Document_Number: string;
  Amount_in_Local_Currency: string;
  State: string;
  Text: string;
  Reference: string;
  Document_Date: string;
  Document_Currency: string;
  Amount_in_Doc_Curr: string;
  Posting_Key: string;
  Invoice_Reference: string;
  Reference_Key: string;
  Document_Header_Text: string;
  Cost_Center: string;
  Profit_Center: string;
  Offsetting_Account: string;
  Assignment: string;
  User_Name: string;
  Material: string;
}
export interface ColumnMapping {
  field: string;
  header: string;
  frozen: boolean;
}
export interface FormattedProjectsRRRow {
  [key: string]: string;
}


//project 
export interface ProjectsResponse {
  Month: string;
  Year: number;
  Columns: string[];
  Rows: ProjectsRow[];
  TotalRows: number;
} 
export interface ProjectsRow {
  [key: string]: string | number | null;
} 
export interface ProjectsRowTyped {
  Bill_Document_No: string;
  Bill_Date: string;
  Registration_No: string;
  Billing_Type: string;
  Plant: string;
  Region_Desc_Of_STP: string;
  Region_Of_Sold_To_Party: string;
  Sales_Order_No: string;
  Outbond_Delivery_No: string;
  Distribution_Channel: string;
  Sold_To_Party: string;
  Sold_To_Party_Name: string;
  Payer_Name: string;
  Installer_No: string;
  Installer_Name: string;
  Quantity: string;
  Basic_Cost: string;
  Discount: string;
  Net_Cost: string;
  Total_Before_Tax: string;
  CGST_Amt: string;
  SGST_Amt: string;
  UGSTAmt: string;
  IGST_Amt: string;
  Rounding_Off: string;
  Grand_Total: string;
  Storage_Location: string;
  Proforma_Invoice_No: string;
  Division: string;
  Sales_Organisation: string;
  Sales_Office: string;
  City_Of_Sold_To_Party: string;
  City_Of_Payer: string;
  Customer_TIN_No: string;
  WBS_Element: string;
  LR_Number: string;
  LR_Date: string;
  Registration_Date: string;
  Work_Order_No: string;
  Work_Order_Date: string;
  Installation_Date: string;
  Vehicle_No: string;
  Project_Type: string;
  Portal_Status_01_12_2025: string;
  Step_No: string;
  Sale_Status: string;
  Cases: string;
  Installation_Date_Client: string;
} 
export interface ColumnMapping {
  field: string;
  header: string;
  frozen: boolean;
} 
export interface FormattedProjectsRow {
  [key: string]: string;
}


//Grouping sales
export interface Root {
  Month: string
  Year: number
  Columns: string[]
  Rows: GroupingSalesRow[]
  TotalRows: number
}

 

export interface GroupingSalesRow {
  GL: string
  GL_Name: string
  Apr: string
  May: string
  June: string
  July: string
  Aug: string
  Sept: string
  Oct: string
  Nov: string
  Total: string
}


//salesFTM Final (Paginated)
export interface SalesFTMFinalResponse {
  Month: string;
  Year: number;
  Columns: string[];
  Rows: SalesFTMFinalRow[];
  TotalRows: number;
  PageNumber: number;
  PageSize: number;
  TotalPages: number;
  HasPreviousPage: boolean;
  HasNextPage: boolean;
} 
export interface SalesFTMFinalRow {
  [key: string]: string | number | null;
}
export interface ColumnMapping {
  field: string;
  header: string;
  frozen: boolean;
} 
export interface FormattedSalesFTMFinalRow {
  [key: string]: string;
} 
export interface PaginationParams {
  month: string;
  year: number;
  pageNumber: number;
  pageSize: number;
}


//entries

export interface EntryItem {
  SrNo: number;
  GLCode: string;
  GLDesc: string;
  CustVendorCode: string | null;
  PstKy: string;
  Dr: number | null;
  Cr: number | null;
  Remarks: string;
}

export interface EntriesResponse {
  Month: string;
  Year: number;
  DocNo: string;
  DocType: string;
  Entries: EntryItem[];
  TotalDr: number;
  TotalCr: number;
}

export interface GroupedEntry {
  srNo: number;
  entries: EntryItem[];
}

//  Missing Data (upload Sales FTM model) 
export interface SalesFTMModel {
  success: boolean
  data: Data
  message: string
}

export interface Data {
  PortalStatusDate: string
  Month: string
  Year: string
  Summary: Summary[]
  ProjectMarketStateWise: ProjectMarketStateWise[]
}

export interface Summary { 
  ProjectType: string
  TotalCount: number
  MissingCount: number 
  ConsideredAmount: number
  NotConsideredAmount: number
  TotalAmount: number
  MissingAmount: number
  HasStateWiseBreakdown: boolean 
}

export interface ProjectMarketStateWise {
  StateName: string
  TotalCount: number
  MissingCount: number
  ConsideredAmount: number
  NotConsideredAmount: number
  TotalAmount: number
  MissingAmount: number
  KarnatakaBreakdown: KarnatakaBreakdown[]
}

export interface KarnatakaBreakdown {
  PortalTable: string
  RegistrationFormat: string
  TotalCount: number
  MissingCount: number
  ConsideredAmount: number
  NotConsideredAmount: number
  TotalAmount: number
  MissingAmount: number
}