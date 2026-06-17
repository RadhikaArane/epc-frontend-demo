export interface OLSPagedResponse {
  PageNumber: number
  PageSize: number
  TotalCount: number
  TotalPages: number
  Items: OLSDetailItem[]
}

export interface OLSDetailItem {
  State: string;
  Customer: string;
  Name: string;
  NotDue: number;
  LessThan90Days: number;
  Days90To180: number;
  Days180To270: number;
  Days270To365: number;
  OneYrTo2Yr: number;
  TwoYrTo3Yr: number;
  MoreThan3Years: number;
  Total: number;
  LessAdv: number;
  OS: number;
  AssignmentPending: number;
  Adv: number;
  [key: string]: any;
}

// One Line Summary DAshboard Models
export type Root = OneLineSummaryDashboard[]

export interface OneLineSummaryDashboard {
  State: string
  TotalAssignmentPending: number
  TotalAdv: number
}
