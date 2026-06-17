// ─────────────────────────────────────────────
// PM Comparison Models
// ─────────────────────────────────────────────

export interface PMMonthlyData {
  MonthYear: string;
  Month: number;
  Year: number;
  OpFPClear: number;
  InspectionDone: number;
  InspectionDueLessThan90Days: number;
  InspectionDueGreaterThan90Days: number;
}

export interface PMTotals {
  OpFPClear: number;
  InspectionDone: number;
  InspectionDueLessThan90Days: number;
  InspectionDueGreaterThan90Days: number;
}

export interface PMStateWiseData {
  State: string;
  ZonalManager: string;
  MonthlyData: PMMonthlyData[];
  Totals: PMTotals;
}

export interface HORPmCompResModel {
  StatusCode: number;
  message: string;
  inputMonth: number;
  inputYear: number;
  totalStates: number;
  stateWiseData: PMStateWiseData[];
  monthlyGrandTotals: PMMonthlyData[];   // ← per-month grand totals
  overallTotals: PMTotals;               // ← sum across all months
}



// Open Market 

export interface OpenMarketItems {
  StatusCode: number
  message: string
  month: number
  year: number
  tableName: string
  ageingColumnName: string
  previousMonth: number
  previousYear: number
  unbookedCollectionBreakdown: UnbookedCollectionBreakdown
  stateWiseData: StateWiseDaum[]
  currentMonthTotals: CurrentMonthTotals
  previousMonthTotals: PreviousMonthTotals
  exportsTotals: ExportsTotals
  institutionalTotals: InstitutionalTotals
  projectBusinessTotals: ProjectBusinessTotals
  totals: Totals
}

export interface UnbookedCollectionBreakdown {
  "Andhra Pradesh": number
  Chhattisgarh: number
  Gujarat: number
  Karnataka: number
  "Madhya Pradesh": number
  Rajasthan: number
  "Tamil Nadu": number
  Telangana: number
  "Uttar Pradesh": number
  Maharashtra: number
}

export interface StateWiseDaum {
  State: string
  ZonalManager: string
  OpOsIncluPDD: number
  UnbookedCollection: number
  PDD: number
  OpOsExcluPDD: number
  DaysLessThan30: number
  Days30To60: number
  Days60To90: number
  Days90To120: number
  Days120To180: number
  Days180To365: number
  LessThan3Yr: number
  GreaterThan3Yr: number
  OverduePercentage: number
  NotDue: number
}

export interface CurrentMonthTotals {
  TotalStates: number
  OpOsIncluPDD: number
  UnbookedCollection: number
  PDD: number
  OpOsExcluPDD: number
  DaysLessThan30: number
  Days30To60: number
  Days60To90: number
  Days90To120: number
  Days120To180: number
  Days180To365: number
  LessThan3Yr: number
  GreaterThan3Yr: number
  NotDue: number
  OverduePercentage: number
}

export interface PreviousMonthTotals {
  OpOsIncluPDD: number
  UnbookedCollection: number
  PDD: number
  OpOsExcluPDD: number
  DaysLessThan30: number
  Days30To60: number
  Days60To90: number
  Days90To120: number
  Days120To180: number
  Days180To365: number
  LessThan3Yr: number
  GreaterThan3Yr: number
  NotDue: number
  OverduePercentage: number
}

export interface ExportsTotals {
  OpOsIncluPDD: number
  UnbookedCollection: number
  PDD: number
  OpOsExcluPDD: number
  DaysLessThan30: number
  Days30To60: number
  Days60To90: number
  Days90To120: number
  Days120To180: number
  Days180To365: number
  LessThan3Yr: number
  GreaterThan3Yr: number
  NotDue: number
  OverduePercentage: number
}

export interface InstitutionalTotals {
  OpOsIncluPDD: number
  UnbookedCollection: number
  PDD: number
  OpOsExcluPDD: number
  DaysLessThan30: number
  Days30To60: number
  Days60To90: number
  Days90To120: number
  Days120To180: number
  Days180To365: number
  LessThan3Yr: number
  GreaterThan3Yr: number
  NotDue: number
  OverduePercentage: number
}

export interface ProjectBusinessTotals {
  OpOsIncluPDD: number
  UnbookedCollection: number
  PDD: number
  OpOsExcluPDD: number
  DaysLessThan30: number
  Days30To60: number
  Days60To90: number
  Days90To120: number
  Days120To180: number
  Days180To365: number
  LessThan3Yr: number
  GreaterThan3Yr: number
  NotDue: number
  OverduePercentage: number
}

export interface Totals {
  OpOsIncluPDD: number
  UnbookedCollection: number
  PDD: number
  OpOsExcluPDD: number
  DaysLessThan30: number
  Days30To60: number
  Days60To90: number
  Days90To120: number
  Days120To180: number
  Days180To365: number
  LessThan3Yr: number
  GreaterThan3Yr: number
  NotDue: number
  OverduePercentage: number
}

// ========= Open Market Remarks =============

export interface OMRemark {
  Id: number | null;
  State: string;
  ZonalManager: string | null;
  RevenuePlan: number;
  CollectionPlan: number;
  PlanWk1: number;
  PlanWk2: number;
  PlanWk3: number;
  PlanWk4: number;
  PlanWk5: number;
  PlanTotal: number;
  ActualWk1: number;
  ActualWk2: number;
  ActualWk3: number;
  ActualWk4: number;
  ActualTotal: number;
  Remarks: string | null;
  ReviewerName: string | null;
  Status: string | null;
  CreatedAt?: string | null;
  UpdatedAt?: string | null;
  HasRemark: boolean;
}


// Open Additional

export interface openAdditional {
  StatusCode: number
  message: string
  month: number
  year: number
  tableName: string
  ageingColumnName: string
  customerWiseData: CustomerWiseDaum[]
  totals: Totals
}

export interface CustomerWiseDaum {
  State: string
  Customer: string
  Name: string
  City: string
  AssignmentPending: number
  DaysLessThan30: number
  Days30To60: number
  Days60To90: number
  Days90To120: number
  Days120To180: number
  Days180To365: number
  GreaterThan365: number
  OverdueSubTotal: number
  NotDueLessThan30: number
  NotDueSubTotal: number
  GrandTotal: number
  CollectionRemarks: string
}

export interface Totals {
  TotalRecords: number
  AssignmentPending: number
  DaysLessThan30: number
  Days30To60: number
  Days60To90: number
  Days90To120: number
  Days120To180: number
  Days180To365: number
  GreaterThan365: number
  OverdueSubTotal: number
  NotDueLessThan30: number
  NotDueSubTotal: number
  GrandTotal: number
}


//========= Project Market =============

export interface ProjectMarketItems {
  StatusCode: number
  message: string
  month: number
  year: number
  tableName: string
  ageingColumnName: string
  previousMonth: number
  previousYear: number
  stateWiseData: StateWiseDaum[]
  currentMonthTotals: CurrentMonthTotals
  previousMonthTotals: PreviousMonthTotals
}

export interface StateWiseDaum {
  State: string
  ZonalManager: string
  OpOsIncluPDD: number
  UnbookedCollection: number
  PDD: number
  OpOsExcluPDDIncluRetention: number
  Retention: number
  DaysLessThan30: number
  Days30To60: number
  Days60To90: number
  Days90To120: number
  Days120To180: number
  Days180To365: number
  Days1YrTo2Yr: number
  DaysGreaterThan2Yr: number
  OpFPClear: number
  InspectionDone: number
  InspectionDueLessThan90Days: number
  InspectionDueGreaterThan90Days: number
  InspPendPercentage: number
}

export interface CurrentMonthTotals {
  TotalStates: number
  OpOsIncluPDD: number
  UnbookedCollection: number
  PDD: number
  OpOsExcluPDDIncluRetention: number
  Retention: number
  DaysLessThan30: number
  Days30To60: number
  Days60To90: number
  Days90To120: number
  Days120To180: number
  Days180To365: number
  Days1YrTo2Yr: number
  DaysGreaterThan2Yr: number
  OpFPClear: number
  InspectionDone: number
  InspectionDueLessThan90Days: number
  InspectionDueGreaterThan90Days: number
  InspPendPercentage: number
}

export interface PreviousMonthTotals {
  OpOsIncluPDD: number
  UnbookedCollection: number
  PDD: number
  OpOsExcluPDDIncluRetention: number
  Retention: number
  DaysLessThan30: number
  Days30To60: number
  Days60To90: number
  Days90To120: number
  Days120To180: number
  Days180To365: number
  Days1YrTo2Yr: number
  DaysGreaterThan2Yr: number
  OpFPClear: number
  InspectionDone: number
  InspectionDueLessThan90Days: number
  InspectionDueGreaterThan90Days: number
  InspPendPercentage: number
}

// ========= Project Market Remarks =============

export interface PMRemark {
  Id: number | null;
  State: string;
  ZonalManager: string | null;
  RevenuePlan: number;
  FarmerContri: number;
  SubsidyCollectionPlan: number;
  PlanWk1: number;
  PlanWk2: number;
  PlanWk3: number;
  PlanWk4: number;
  PlanTotal: number;
  ActualWk1: number;
  ActualWk2: number;
  ActualWk3: number;
  ActualWk4: number;
  ActualTotal: number;
  Remarks: string | null;
  ReviewerName: string | null;
  Status: string | null;
  CreatedAt?: string | null;
  UpdatedAt?: string | null;
  HasRemark: boolean;
}

export interface PMRemarksResponse {
  StatusCode: number;
  message: string;
  month: number;
  year: number;
  unit: string;
  totalStates: number;
  statesWithRemarks: number;
  statesFromDebit: number;
  statesRemarksOnly: number;
  data: PMRemark[];
}

// =========== Project-MArket-Additional ================

export interface ProjectMarketAddItems {
  StatusCode: number
  message: string
  month: number
  year: number
  tableName: string
  ageingColumnName: string
  stateWiseData: StateWiseDaum[]
  totals: Totals
}

export interface StateWiseDaum {
  State: string
  ZonalManager: string
  FPClear_Lt30: number
  FPClear_30To60: number
  FPClear_60To90: number
  FPClear_90To120: number
  FPClear_120To180: number
  FPClear_180To365: number
  FPClear_Gt365: number
  FPClear_Unbooked: number
  FPClear_SubTotal: number
  InspDone_Lt30: number
  InspDone_30To60: number
  InspDone_60To90: number
  InspDone_90To120: number
  InspDone_120To180: number
  InspDone_180To365: number
  InspDone_Gt365: number
  InspDone_SubTotal: number
  OfferedLt90_Lt30: number
  OfferedLt90_30To60: number
  OfferedLt90_60To90: number
  OfferedLt90_SubTotal: number
  OfferedGt90_90To120: number
  OfferedGt90_120To180: number
  OfferedGt90_180To365: number
  OfferedGt90_Gt365: number
  OfferedGt90_SubTotal: number
  GrandTotal: number
}

export interface Totals {
  TotalStates: number
  FPClear_Lt30: number
  FPClear_30To60: number
  FPClear_60To90: number
  FPClear_90To120: number
  FPClear_120To180: number
  FPClear_180To365: number
  FPClear_Gt365: number
  FPClear_Unbooked: number
  FPClear_SubTotal: number
  InspDone_Lt30: number
  InspDone_30To60: number
  InspDone_60To90: number
  InspDone_90To120: number
  InspDone_120To180: number
  InspDone_180To365: number
  InspDone_Gt365: number
  InspDone_SubTotal: number
  OfferedLt90_Lt30: number
  OfferedLt90_30To60: number
  OfferedLt90_60To90: number
  OfferedLt90_SubTotal: number
  OfferedGt90_90To120: number
  OfferedGt90_120To180: number
  OfferedGt90_180To365: number
  OfferedGt90_Gt365: number
  OfferedGt90_SubTotal: number
  GrandTotal: number
}


// Open Market comparison
export interface openMarketComparison {
  StatusCode: number
  message: string
  inputMonth: number
  inputYear: number
  openMarket: OpenMarket
  exports: ExportsOMC
  institutional: InstitutionalOMC
  grandTotals: GrandTotalsOMC
}

export interface OpenMarket {
  totalStates: number
  stateWiseData: StateWiseDataOMC[]
  subTotalsByMonth: SubTotalsByMonth[]
}

export interface StateWiseDataOMC {
  State: string
  ZonalManager: string
  MonthlyData: MonthlyDataOMC[]
  Totals: TotalsOMC
}

export interface MonthlyDataOMC {
  MonthYear: string
  Month: number
  Year: number
  DaysLessThan30: number
  Days30To60: number
  Days60To90: number
  Days90To120: number
  Days120To180: number
  Days180To365: number
  GreaterThan365Days: number
  NotDue: number
}

export interface TotalsOMC {
  DaysLessThan30: number
  Days30To60: number
  Days60To90: number
  Days90To120: number
  Days120To180: number
  Days180To365: number
  GreaterThan365Days: number
  NotDue: number
}

export interface SubTotalsByMonth {
  MonthYear: string
  Month: number
  Year: number
  DaysLessThan30: number
  Days30To60: number
  Days60To90: number
  Days90To120: number
  Days120To180: number
  Days180To365: number
  GreaterThan365Days: number
  SubTotal: number
  NotDue: number
  GrandTotal: number
}

export interface ExportsOMC {
  monthlyData: MonthlyData2OMC[]
  totals: Totals2OMC
}

export interface MonthlyData2OMC {
  MonthYear: string
  Month: number
  Year: number
  DaysLessThan30: number
  Days30To60: number
  Days60To90: number
  Days90To120: number
  Days120To180: number
  Days180To365: number
  GreaterThan365Days: number
  NotDue: number
}

export interface Totals2OMC {
  DaysLessThan30: number
  Days30To60: number
  Days60To90: number
  Days90To120: number
  Days120To180: number
  Days180To365: number
  GreaterThan365Days: number
  NotDue: number
}

export interface InstitutionalOMC {
  monthlyData: MonthlyData3OMC[]
  totals: Totals3OMC
}

export interface MonthlyData3OMC {
  MonthYear: string
  Month: number
  Year: number
  DaysLessThan30: number
  Days30To60: number
  Days60To90: number
  Days90To120: number
  Days120To180: number
  Days180To365: number
  GreaterThan365Days: number
  NotDue: number
}

export interface Totals3OMC {
  DaysLessThan30: number
  Days30To60: number
  Days60To90: number
  Days90To120: number
  Days120To180: number
  Days180To365: number
  GreaterThan365Days: number
  NotDue: number
}

export interface GrandTotalsOMC {
  DaysLessThan30: number
  Days30To60: number
  Days60To90: number
  Days90To120: number
  Days120To180: number
  Days180To365: number
  GreaterThan365Days: number
  NotDue: number
}


// Institutional Component Models
export interface Institutional {
  StatusCode: number
  message: string
  month: number
  year: number
  tableName: string
  ageingColumnName: string
  customerData: CustomerDaum[]
  concernWiseSummary: ConcernWiseSummary[]
  grandTotals: GrandTotals
}

export interface CustomerDaum {
  Conc: string
  State: string
  Customer: string
  Name: string
  DaysLessThan30: number
  Days30To60: number
  Days60To90: number
  Days90To120: number
  Days120To180: number
  Days180To365: number
  Days1YrTo2Yr: number
  Days2YrTo3Yr: number
  GreaterThan3Yr: number
  NotDue: number
  GrandTotal: number
  AssignmentPending: number
  Subtotal: number
}

export interface ConcernWiseSummary {
  Conc: string
  Assignment: number
  TotalCustomers: number
  DaysLessThan30: number
  Days30To60: number
  Days60To90: number
  Days90To120: number
  Days120To180: number
  Days180To365: number
  Days1YrTo2Yr: number
  Days2YrTo3Yr: number
  GreaterThan3Yr: number
  Subtotal: number
  NotDue: number
  GrandTotal: number
  AssignmentPending: number
}

export interface GrandTotals {
    Assignment: number
  TotalCustomers: number
  TotalConcerns: number
  DaysLessThan30: number
  Days30To60: number
  Days60To90: number
  Days90To120: number
  Days120To180: number
  Days180To365: number
  Days1YrTo2Yr: number
  Days2YrTo3Yr: number
  GreaterThan3Yr: number
  Subtotal: number
  NotDue: number
  GrandTotal: number
  AssignmentPending: number
}

// Sales Component Models
export interface Sales {
  StatusCode: number
  message: string
  requestedMonth: number
  requestedYear: number
  financialYear: string
  unit: string
  divisor: number
  monthsIncluded: number
  data: Data
}

export interface Data {
  stateWiseData: StateWiseSalesData[]
  grandTotal: SalesGrandTotal
}

export interface StateWiseSalesData {
  State: string
  MonthlyData: MonthlySalesData[]
  TotalProjectMarket: number
  TotalOpenMarket: number
  TotalProjectBusiness: number
  TotalInstitutional: number
  TotalExports: number
  GrandTotal: number
}

export interface MonthlySalesData {
  MonthYear(MonthYear: any): unknown
  Month: number
  Year: number
  MonthName: string
  ProjectMarket: number
  OpenMarket: number
  ProjectBusiness: number
  Institutional: number
  Exports: number
  Total: number
}

export interface SalesGrandTotal {
  Label: string
  StateWiseTotals: StateWiseSalesTotal[]
  MarketTypeWiseTotals: SalesMarketTypeWiseTotals
}

export interface StateWiseSalesTotal {
  State: string
  TotalProjectMarket: number
  TotalOpenMarket: number
  TotalProjectBusiness: number
  TotalInstitutional: number
  TotalExports: number
  GrandTotal: number
}

export interface SalesMarketTypeWiseTotals {
  TotalProjectMarket: number
  TotalOpenMarket: number
  TotalProjectBusiness: number
  TotalInstitutional: number
  TotalExports: number
  GrandTotal: number
}


// // Head Office Review - PM Comparison Models
// export interface HORPmCompResModel {
//   StatusCode: number;
//   message: string;
//   inputMonth: number;
//   inputYear: number;
//   totalStates: number;
//   stateWiseData: StateWisePM[];
//   overallTotals: OverallTotals;
// }

// export interface StateWisePM {
//   State: string;
//   ZonalManager: string;
//   MonthlyData: MonthlyPM[];
//   Totals: Totals;
// }

// export interface MonthlyPM {
//   MonthYear: string;
//   Month: number;
//   Year: number;
//   OpFPClear: number;
//   InspectionDone: number;
//   InspectionDueLessThan90Days: number;
//   InspectionDueGreaterThan90Days: number;
// }

// export interface Totals {
//   OpFPClear: number;
//   InspectionDone: number;
//   InspectionDueLessThan90Days: number;
//   InspectionDueGreaterThan90Days: number;
// }

// export interface OverallTotals {
//   OpFPClear: number
//   InspectionDone: number
//   InspectionDueLessThan90Days: number
//   InspectionDueGreaterThan90Days: number
// }

// Head Office Review - Collections Models
export interface HORCollectionsResModel {
  StatusCode: number
  message: string
  requestedMonth: number
  requestedYear: number
  financialYear: string
  unit: string
  divisor: number
  monthsIncluded: number
  data: CollectionData
}

export interface CollectionData {
  stateWiseData: StateWiseCollection[]
  grandTotal: GrandTotalCollection
}

export interface StateWiseCollection {
  State: string
  MonthlyData: MonthlyCollection[]
  TotalProjectMarket: number
  TotalOpenMarket: number
  TotalProjectBusiness: number
  TotalInstitutionalAndOthers: number
  GrandTotal: number
}

export interface MonthlyCollection {
  Month: number
  Year: number
  MonthName: string
  ProjectMarket: number
  OpenMarket: number
  ProjectBusiness: number
  InstitutionalAndOthers: number
  Total: number
}

export interface GrandTotalCollection {
  Label: string
  StateWiseTotals: StateWiseTotalCollection[]
  MarketTypeWiseTotals: MarketTypeWiseTotalsCollection
}

export interface StateWiseTotalCollection {
  State: string
  TotalProjectMarket: number
  TotalOpenMarket: number
  TotalProjectBusiness: number
  TotalInstitutionalAndOthers: number
  GrandTotal: number
}

export interface MarketTypeWiseTotalsCollection {
  TotalProjectMarket: number
  TotalOpenMarket: number
  TotalProjectBusiness: number
  TotalInstitutionalAndOthers: number
  GrandTotal: number
}