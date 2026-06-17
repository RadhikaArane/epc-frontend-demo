export interface DashboardAgingData {
  AgingBucket: string;
  Amount: number;
}

export interface DashboardStateData {
  State: string;
  AgingData: DashboardAgingData[];
  StateTotal: number;
}

export interface DashboardAllStateTotal {
  AgingBucket: string;
  Amount: number;
}

export interface DashboardSummaryResponse {
  TotalStates: number;
  Page: number;
  PageSize: number;
  States: DashboardStateData[];
  AllStateTotal: DashboardAllStateTotal[];
}

export interface PipelineData {
  FsCollectedPendingSubmission: number | null;
  CummDmioPending: number | null;
  CummDmioApproval: number | null;
  CummDhsoSubmission: number | null;
  CummDhsoPending: number | null;
  CummDhsoApproved: number | null;
  CummWo: number | null;
  Total: number | null;
}

export interface PipelineSummaryResponse {
  StateName: string;
  SelectedDate: string;
  Data: PipelineData;
}