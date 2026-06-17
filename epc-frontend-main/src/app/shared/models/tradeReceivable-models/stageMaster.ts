// stage master states
export interface StageMasterStates {
  Success: boolean
  Message: string
  Data: string[]
}

// stage master by state
export interface StageMasterbyState {
  Success: boolean
  Message: string
  Data: Daum[]
}

export interface Daum {
  StateName: string
  PortalStatus: string
  Category: string
  CreatedAt: string
  UpdatedAt: any
}

// stage master category
export interface StageMasterCategory {
  Success: boolean
  Message: string
  Data: string[]
}

// Generic API Response
export interface ApiResponse<T> {
  Success: boolean;
  Message: string;
  Data: T;
}

// ===== Responses =====
export type StageMasterStatesResponse = ApiResponse<string[]>;
export type StageMasterCategoryResponse = ApiResponse<string[]>;
export type StageMasterByStateResponse = ApiResponse<StageMasterEntry[]>;

export interface StageMasterEntry {
  StateName: string;
  PortalStatus: string;
  Category: string;
  Steps: string;
  IsActive: boolean;
  CreatedAt: string;
  UpdatedAt: string | null;
}

// ===== Requests =====
export interface StageMasterAddRequest {
  StateName: string;
  PortalStatus: string;
  Category: string;
  Steps: string;
}

export interface StageMasterUpdateRequest {
  StateName: string;
  OldPortalStatus: string;
  NewPortalStatus: string;
  Category: string;
  Steps: string;
}

export interface StageMasterDeleteRequest {
  StateName: string;
  PortalStatus: string;
}




