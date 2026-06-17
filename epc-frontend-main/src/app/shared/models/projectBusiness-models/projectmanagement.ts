export interface GetAllProject {
  ProjectId: string
  ChakNo: string
  ProjectNumber: string
  WbsNo: string
  ProjectName: string
  AgreementDate: string
  EndDate: string
  ProjectStartDate: string
  ExpectedCompletionDate: string
  TotalSaleValueExclGst: number
  TotalSaleValueInclGst: number
  IsDeleted: boolean
  CreatedOnUtc: string
  ModifiedOnUtc: string
  IsEstimationDone: boolean
  NodalAgencyId?: string
  ProjectIncharge?: string
  ProjectArea?: number
  NodalAgencyName?: string
  HectareRate?:string
}




export interface GetCostHead {
  DocType: string;
  CostHeadId: string;
  Name: string;
  IsActive: boolean;
}

export interface GetSubHead {
  SubHeadId: string;
  CostHeadId: string;
  CostHeadName: string;
  Name: string;
  IsActive: boolean;
}

export interface Vendor {
  VendorId: string;
  Name: string;
  IsActive: boolean;
}

export interface VendorAttachment {
  vendorId: string;
  vendorName: string;
  file: File | null;
  files: File[];
  assignedAmount: string;
}

export interface EditVendorAttachment {
  projectCostHeadVendorId: string;
  vendorId: string;
  vendorName: string;
  files: File[];
  existingAttachments: ExistingAttachment[];
  isLoadingAttachments: boolean;
  assignedAmount: string;
}

export interface VendorAttachmentsResponse {
  StatusCode: number;
  items: ExistingAttachment[];
}

export interface ExistingAttachment {
  AttachmentId: string;
  FileNameOriginal: string;
  ContentType: string;
  FileSizeBytes: number;
  StorageProvider: string;
  StoragePath: string;
  CreatedOnUtc: string;
  ProjectId: string | null;
  ProjectCostHeadVendorId: string;
}

export interface CostEstimationRow {
  id: string;
  costHeadId: string;
  costHeadName: string;
  costBasis: string;
  amount: string;
  vendorAttachments: VendorAttachment[];
  availableVendors: Vendor[];
  isLoadingVendors: boolean;
}

export interface EditCostEstimationRow {
  id: string;
  projectCostHeadId: string;
  costHeadId: string;
  costHeadName: string;
  costBasis: string;
  amount: string;
  originalAmount: string;
  originalCostBasis: string;

  // Excel fields
  hasExcel: boolean;
  excelData: any[][] | null;
  isLoadingExcel: boolean;
  excelMetadata: any | null;
  excelFullData: any | null;

  selectedVendors: Vendor[];
  vendorAttachments: EditVendorAttachment[];
  showVendorDropdown: boolean;
  isLoadingVendors: boolean;
}

export interface VendorPaginationState {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  searchTerm: string;
}


//customer
export interface CustomerItem {
  Id: number;
  Customer: string;
  Cty: string;
  Name1: string;
  Name2: string;
  City: string;
  PostalCode: string;
  Rg: string;
  SearchTerm: string;
  Street: string;
  Telephone1: string;
  FaxNumber: string;
  Address: string;
  Title: string;
  Date: string;
  CreatedByUser: string;
  District: string;
  TaxNumber1: string;
  Telephone2: string;
  VATRegistrationNo: string;
  Employees: string;
  TaxNumber3: string;
  State: string;
  PermanentAccountNumber: string;
  SOrg: string;
  DChl: string;
  Dv: string;
  CreatedDate: string;
  CreatedBy: string;
  IsActive: boolean;
}




//view FTM cost
export interface CostHeadItem {
  ProjectCostHeadId: string;
  CostHeadId: string;
  CostHeadName: string;
  CostBasis: string;
  Amount: number;
  vendors: VendorInfo[];
  revisions: RevisionInfo[];
  isLoadingVendors: boolean;
  isLoadingRevisions: boolean;
}

export interface VendorInfo {
  ProjectCostHeadVendorId: string;
  VendorId: string;
  Name: string;
  attachments: ExistingAttachment[];
  isLoadingAttachments: boolean;
}

export interface RevisionInfo {
  historyId: string;
  amount: number;
  periodMonth: number;
  periodMonthDisplay: string;
  source: string;
  createdOnUtc: string;
  revisionNumber: number;
  runningTotal: number;
}


//ftm entries
export interface FTMEntry {
  CostElementName: string;
  ProjectId: string;
  Amount: number;
  CostElementDescription: string;
  CreatedOnUtc: string;
}

//manage data
export interface GetVendorList {
  Id: number;
  Customer: string;
  Cty: string;
  Name1: string;
  Name2: string;
  City: string;
  PostalCode: string;
  Rg: string;
  SearchTerm: string;
  Street: string;
  Telephone1: string;
  FaxNumber: string;
  Address: string;
  Title: string;
  Date: string;
  CreatedByUser: string;
  District: string;
  TaxNumber1: string;
  Telephone2: string;
  VATRegistrationNo: string;
  Employees: string;
  TaxNumber3: string;
  State: string;
  PermanentAccountNumber: string;
  SOrg: string;
  DChl: string;
  Dv: string;
  CreatedDate: string;
  CreatedBy: string;
  IsActive: boolean;
}

export interface GetCustomerList {
  Id: number;
  Customer: string;
  Cty: string;
  Name1: string;
  Name2: string;
  City: string;
  PostalCode: string;
  Rg: string;
  SearchTerm: string;
  Street: string;
  Telephone1: string;
  FaxNumber: string;
  Address: string;
  Title: string;
  Date: string;
  CreatedByUser: string;
  District: string;
  TaxNumber1: string;
  Telephone2: string;
  VATRegistrationNo: string;
  Employees: string;
  TaxNumber3: string;
  State: string;
  PermanentAccountNumber: string;
  SOrg: string;
  DChl: string;
  Dv: string;
  CreatedDate: string;
  CreatedBy: string;
  IsActive: boolean;
}

