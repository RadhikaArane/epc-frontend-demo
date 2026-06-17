// models/scrapper-state.model.ts
export interface ScrapperState {
  id?: number;
  stateName: string;
  portalLink: string;
  userName: string;
  password: string;
  otpRequired: boolean;
  otpNumber: string;
  isActive?: boolean;
}

export interface ScrapperStateResponse {
  totalCount: number;
  items: ScrapperState[];
}