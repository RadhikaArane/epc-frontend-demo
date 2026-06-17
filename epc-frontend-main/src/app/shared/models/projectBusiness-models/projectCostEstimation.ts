export interface AuditProjectTotals {
    TotalProjects: number;
    GSTRate: number;
    PercentCompletion: number;
    TotalGrossValue: number;
    TotalBasicValue: number;
    OAndMAmount: number;
    BasicRevenueAmount: number;
    YTDBasicRevenueRecognition: number;
    YTDCollectionAsOn: number;
    BasicValueCollection: number;
    Retention: number;
    YTDBilledRevenueAsOn: number;
    BasicBillAmountBilled: number;
    AdvanceFromCustomer: number;
    RRBillsRaise: number;
    Debtors: number;
    ContractsAssetsLiability: number;
    CheckFor_UBR: number;
    ProjectCostToCompletion: number;
}

export interface AuditProject {
    ProjectId: string;
    ChaksGroup: string;
    SrNo: number;
    CustomerCode: string;
    ProjectName: string;
    WBSNumber: string;
    AgreementDate: string;
    ProjectStartDate: string;
    ExpCompletionDate: string;
    ExtensionLetterDate: string | null;
    GSTRate: number;
    IsRecognized: boolean;
    MarginFTM: number;
    ProjectCostToCompletion: number;
    PercentCompletion: number;
    TotalGrossValue: number;
    TotalBasicValue: number;
    OAndMAmount: number;
    BasicRevenueAmount: number;
    YTDBasicRevenueRecognition: number;
    YTDCollectionAsOn: number;
    BasicValueCollection: number;
    Retention: number;
    YTDBilledRevenueAsOn: number;
    BasicBillAmountBilled: number;
    AdvanceFromCustomer: number;
    RRBillsRaise: number;
    Debtors: number;
    ContractsAssetsLiability: number;
    Type: string;
    CheckFor_UBR: number;
}

export interface AuditNodalAgency {
    NodalAgencyId: string;
    NodalAgencyName: string;
    StateName: string; 
    Projects: AuditProject[];
    Totals: AuditProjectTotals;
}

export interface ProjectSummaryAuditResponse {
    StatusCode: number;
    result: {
        NodalAgencies: AuditNodalAgency[];
    };
}
