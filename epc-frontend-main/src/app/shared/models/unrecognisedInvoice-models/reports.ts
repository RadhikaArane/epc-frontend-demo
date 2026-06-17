export interface PredefinedRemarksItem {
  PredefinedRemarkNo: number;
  BillingRRPendingReason: string;
  ActionToBeTakenForCompletionRR: string;
  IsActive: boolean;
  CreatedAt: string;
  CreatedBy: string;
  UpdatedAt?: string | null;
  UpdatedBy?: string | null;
}

export interface PredefinedRemarksPagedResponse {
  totalCount: number;
  page: number;
  pageSize: number;
  items: PredefinedRemarksItem[];
}

export interface CreatePredefinedRemarkRequest {
  billingRRPendingReason: string;
  actionToBeTakenForCompletionRR: string;
}

