
//FTM ENtries
// ==================== GET ALL PROJECTS API MODELS ====================

export interface FTMApiResponse {
    StatusCode: number;
    result: FTMResult;
}

export interface FTMResult {
    Pagination: FTMPagination;
    Projects: FTMProject[];
}

export interface FTMPagination {
    Page: number;
    PageSize: number;
    Total: number;
    TotalPages: number;
}

export interface FTMProject {
    ProjectId: string
    ProjectName: string
    TotalBudgetedCost: number
    TotalSaleValueRecognized: number
    CostHeads: FTMCostHead[]
    TotalExpenseCost: number
    TotalExpenseCostPercent: number
    TotalMaterialCost: number
    TotalMaterialCostPercent: number
    TotalProjectCost: number
    TotalProjectCostPercent: number
    TotalExpsIncurredVsBudgetedPercent: number
    Margin: number
    BudgetedTotalExpenseCost: number
    BudgetedTotalExpenseCostPercent: number
    BudgetedTotalMaterialCost: number
    BudgetedTotalMaterialCostPercent: number
    BudgetedTotalProjectCost: number
    BudgetedTotalProjectCostPercent: number
    BudgetedMargin: number
    PendingRevenuevsBudget: number
    PendingExpensevsBudget: number
    PendingMaterialvsBudget: number
    TotalPendingProjectCost: number
    ProjectedProfit: number
    ProfitPercent: number

}

export interface FTMCostHead {
    CostHeadId: string;
    CostHeadName: string;
    CostType: string;
    BudgetedAmount: number;
    ActualAmount: number;
    PendingAmount: number;
}

// ==================== GET PROJECT DETAILS API MODELS ====================

export interface FTMProjectDetailResponse {
    BudgetedCost: number;
    CostHeads: FTMCostHeadDetail[];
    MonthlyMetrics: MonthlyMetric[];
    FinancialMetrics: FinancialMetrics;
}

export interface FTMCostHeadDetail {
    CostHeadId: string;  // PascalCase from API
    CostHeadName: string;
    CostType: string;
    TotalCost: number;
    BudgetedCost: number;
    MonthlyBreakdown: MonthlyBreakdown;
}

export interface MonthlyBreakdown {
    [month: string]: {
        Amount: number;  // PascalCase from API
    };
}

export interface MonthlyMetric {
    Month: string;
    ExpenseCost: number;
    ExpenseCostPercent: number;
    MaterialCost: number;
    MaterialCostPercent: number;
    TotalProjectCost: number;
    TotalProjectCostPercent: number;
    Margin: number;
    RevenueRecognitionPercent: number;
    SaleValue: number;
    YTDSaleValue: number;
    TotalSaleValueRecognized: number //new
}

export interface FinancialMetrics {
    TotalExpenseCost: number;
    TotalExpenseCostPercent: number;
    TotalMaterialCost: number;
    TotalMaterialCostPercent: number;
    TotalProjectCost: number;
    TotalProjectCostPercent: number;
    TotalExpsIncurredVsBudgetedPercent: number;
    TotalMargin: number;
    PendingRevenueVsBudget: number;
    PendingExpenseVsBudget: number;
    PendingMaterialVsBudget: number;
    TotalPendingProjectCost: number;
    BudgetVariance: number;
    ProjectedProfit: number;
    ProjectedProfitPercent: number;
    TotalRevenueRecognitionPercent: number;
    TotalSaleValueRecognized: number;
}



//unrecognised projects 
export interface CostHeadEntry {
    CostHeadId: string;
    CostHeadName: string;
    TotalValue: number;
}

export interface MonthlyExpense {
    PeriodMonth: number;
    PeriodYear: number;
    PeriodMonthNum: number;
    MonthLabel: string;
    CostHeadEntries: CostHeadEntry[];
}

export interface BudgetedValue {
    CostHeadId: string;
    CostHeadName: string;
    BudgetedAmount: number;
}

export interface UnrecognisedProject {
    ProjectId: string;
    ProjectNumber: string | null;
    ProjectName: string;
    WbsNo: string;
    ProjectTotalSaleValueExclGst: number;
    Status: string;
    ProjectArea: string;
    ProjectIncharge: string;
    Month: number;
    Year: number;
    ExpsIncurredPercent: number;
    RecognizedSaleValueExclGst: number;
    TotalSaleValueRecognized: number;
    BudgetedValues: BudgetedValue[];
    MonthlyExpenses: MonthlyExpense[];
}

export interface UnionCostHead {
    CostHeadId: string;
    CostHeadName: string;
}


//ftm quarters
/// =====================================================================
// ADD THESE TO: shared/models/projectBusiness-models/pbFtmEntries.ts
// =====================================================================

export interface QuarterMonth {
  CostYear: number;
  CostMonth: number;
  MonthLabel: string;
  Sale: number;
  ExpenseCost: number;
  ExpenseCostPercent: number;
  MaterialCost: number;
  MaterialCostPercent: number;
  TotalProjectCost: number;
  TotalProjectCostPercent: number;
  Margin: number;
  CostHeadAmounts: Record<string, number>;
}

export interface QuarterEntry {
  FiscalYear: number;
  FiscalQuarter: number;
  QuarterLabel: string;
  Sale: number;
  ExpenseCost: number;
  ExpenseCostPercent: number;
  MaterialCost: number;
  MaterialCostPercent: number;
  TotalProjectCost: number;
  TotalProjectCostPercent: number;
  Margin: number;
  CostHeadAmounts: Record<string, number>;
  Months: QuarterMonth[];
}

export interface FYSummary {
  FiscalYear: number;
  FYLabel: string;
  Sale: number;
  ExpenseCost: number;
  ExpenseCostPercent: number;
  MaterialCost: number;
  MaterialCostPercent: number;
  TotalProjectCost: number;
  TotalProjectCostPercent: number;
  Margin: number;
  CostHeadAmounts: Record<string, number>;
}

export interface QuarterlyResult {
  AllCostHeads: { CostHeadId: string; CostHeadName: string; CostType: string }[];
  Quarters: QuarterEntry[];
  FiscalYearSummaries: FYSummary[];
}

export interface QuarterlyApiResponse {
  StatusCode: number;
  result: QuarterlyResult;
}