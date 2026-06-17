export interface Access {
  AccessPK: number;
  ExternalId: string;
  AccessName: string;
  ActiveStatus: number;
  CreatedOn?: any;
  ModifiedOn?: any;
  CreatedBy?: any;
  ModifiedBy?: any;
}

export interface AccessLevels {
  AccessLevelPK: number;
  ExternalId: string;
  AccessLevelName: string;
  ActiveStatus: number;
  InsertedOn: string;
}

export interface Areas {
  AreaPK: number;
  ExternalId: string;
  AreaName: string;
  RegionId: number;
  UserId: string;
  ActiveStatus: number;
  CreatedOn: string;
  ModifiedOn: string;
  CreatedBy: string;
  ModifiedBy?: string;
}

export interface Regions {
  RegionPK: number;
  ExternalId: string;
  RegionName: string;
  ZoneId: number;
  UserId: string;
  ActiveStatus: number;
  CreatedOn: string;
  ModifiedOn: string;
  CreatedBy: string;
  ModifiedBy?: string;
}

export interface Roles {
  RolePK: number;
  ExternalId: string;
  RoleName: string;
  RoleId: string;
  AccessLevel: string;
  ActiveStatus: number;
  CreatedOn: string;
  ModifiedOn: string;
  CreatedBy: string;
  ModifiedBy: string;
}

export interface States {
  StatePK: number;
  ExternalId: string;
  StateCode: string;
  StateName: string;
  ShortName: string;
  StateOrUT: string;
  ActiveStatus: number;
  PlantCode: string;
  RegionCode: string;
  GstIn: string;
  StateGovId: string;
  ZoneId: number;
  CreatedOn: string;
  ModifiedOn: string;
  CreatedBy: string;
  ModifiedBy: string;
}

export interface Zones {
  ZonePK: number;
  ExternalId: string;
  ZoneName: string;
  ZoneDesc: string;
  UserId: string;
  ActiveStatus: number;
  CreatedOn: string;
  ModifiedOn: string;
  CreatedBy: string;
  ModifiedBy?: string;
}

//manage data

//dealer
export interface Item {
  DealerPK: number;
  DealerCode: string;
  AsmCode?: any;
  AsmName?: any;
  FirstName: string;
  LastName?: any;
  Name: string;
  Email?: any;
  Mobile?: any;
  EmployeeType?: any;
  ActiveStatus: number;
  Address: string;
  Pincode: string;
  GstIn: string;
  StateCode: string;
  ReportingManager: string;
  CreatedOn: string;
  ModifiedOn: string;
  CreatedBy: string;
  ModifiedBy: string;
  Locations: Location[];
}
export  interface Location {
  DealerLocationPK: number;
  ZoneName: string;
  RegionName: string;
  AreaName: string;
  StateName: string;
  DistrictName: string;
  SubDistName: string;
  Village?: any;
}


//user

export interface UserItem {
  UserPK: number;
  UserId?: any;
  Password?: string;
  FirstName: string;
  LastName: string;
  UserName: string;
  Email?: string;
  Mobile: string;
  AltMobile?: string;
  Designation: string;
  RoleId: string;
  Role?: any;
  ActiveStatus: number;
  ReportingManagerRole: string;
  AccessLevel: string;
  DealerCode: string;
  EmployeeId: string;
  DealerName?: any;
  LockStatus: number;
  CreatedOn: string;
  ModifiedOn: string;
  CreatedBy?: string;
  ModifiedBy?: string;
  Locations: UserLocation[];
}
export interface UserLocation {
  LocationPK: number;
  UserFK: number;
  LocationExternalId: string;
  LocationUserId: string;
  Zone: number;
  ZoneName: string;
  Region: number;
  RegionName: string;
  Area: number;
  AreaName: string;
  StateName?: any;
  DistrictName?: any;
  SubDistName?: any;
  Village?: any;
}

// ---Manage Data--
// Stage Master

export type Root = StageMaster[]

export interface StageMaster {
  Id: number
  StateName: string
  StageName: string
  Category: string
}

// ---Manage Data--
// State Factor

export interface StateStockFactor {
  Id: number;
  State: string;
  StockMultFact: string;
  CreatedBy: string;
   UpdatedBy: string;

  // optional fields if API returns
  CreatedAt?: string;
  UpdatedAt?: string;
}

// ---Manage Data--
// Task / Todo Table Model

export interface TodoTask {
  userId: number;
  id: number;      
  title: string;
  completed: boolean;
}