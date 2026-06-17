export interface StatePortal {
  displayName: string;
  apiValue: string;
  manualLink: string;
}

export interface StatusMessage {
  message: string;
  timestamp: Date;
}

export interface StatusResponse {
  progressMessage: string;
  status: 'waiting_captcha' | 'running' | 'failed' | 'cancelled' | 'finished' | 'waiting_otp';
}

//for indexdb automation
export interface ScrapingState {
  jobId: string;
  selectedState: string;
  messages: StatusMessage[];
  isActive: boolean;
  lastUpdated: number;
}

//dashboard
export interface jobsResponse{
    finished: number,
    failed: number
}


//jobs
export interface stateWiseJobs {
  State: string;
  Status: string;
  StartedAt: string;
  FinishedAt: string;
}



export interface ScrapperReportResponse {
  message: string;
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  items: ScrapperReportItem[];
}

export interface ScrapperReportItem {
  job_id: string;
  state: string;
  started: string;
  finished: string;
  status: string;
  scrapping_DateTime: string;
}


