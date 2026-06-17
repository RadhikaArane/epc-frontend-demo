export interface Root {
  encryptedParams: EncryptedParams;
}

export interface EncryptedParams {
  DashboardType: string;
  SummaryType: string;
  EmployeeId: string;
  State: string;
  AreaName: string;
  Id: string;
}

export interface urGetPredefinedRemarks {
  totalCount: number;
  page: number;
  pageSize: number;
  items: PredefinedRemarksItem[];
}

export interface PredefinedRemarksItem {
  PredefinedRemarkNo: number;
  BillingRRPendingReason: string;
  ActionToBeTakenForCompletionRR: string;
  IsActive: boolean;
  CreatedAt: string;
  CreatedBy: string;
  UpdatedAt: any;
  UpdatedBy: any;
}

export class UpsertRemarksPayload {
  // id: string;         
  // remarkId: string;   
  
  year: string;
  month: string;
  
  predefinedReasonRemarkNo: string; 
  predefinedActionRemarkNo: string;
  
  // billingRRPendingReason: string;
  actionToBeTakenForCompletionRR: string;
  // billingRRCompletionTargetDate: string;
  custRegNumbers: string[]; 
  actorEmployeeId: string;
  remarkFor: string;
  approve: string; 

  constructor() {
    // this.id = '';
    // this.remarkId = '';
    this.year = '';
    this.month = '';
    this.predefinedReasonRemarkNo = '';
    this.predefinedActionRemarkNo = '';
    // this.billingRRPendingReason = '';
    this.actionToBeTakenForCompletionRR = '';
    // this.billingRRCompletionTargetDate = '';
    this.custRegNumbers = []; 
    this.actorEmployeeId = '';
    this.remarkFor = '';
    this.approve = '';
  }
}