export interface ReceivablesData {
  StateCode: string;
  AsOnDate: string;
  Unit: string;
  Pm: {
    Fp: number;
    InspDone: number;
    InspLt90: number;
    InspGt90: number;
    Total: number;
  };
  Om: {
    Overdue: number;
    NotDue: number;
    Total: number;
  };
  InstOthers: {
    Overdue: number;
    NotDue: number;
    Total: number;
  };
  Pb: {
    Overdue: number;
    NotDue: number;
    Total: number;
  };
}


//collections
export interface MonthlyCollection {
  MonthName: string;
  Year: number;
  PM: number;
  OM: number;
  PB: number;
  InstOthers: number;
  Total: number;
}

export interface TotalCollection {
  Year: number;
  PMTotal: number;
  OMTotal: number;
  PBTotal: number;
  InstOthersTotal: number;
}

export interface CollectionsResponse {
  monthlyCollections: MonthlyCollection[];
  totalCollections: TotalCollection[];
}


//sales
export interface SalesResponse {
  Month: string
  Year: number
  Upto: string
  AsOn: string
  Recognised: Recognised
  Unrecognised: Unrecognised
  Total: Total
}

export interface Recognised {
  PM: number
  OM: number
  PB: number
  InstOthers: number
}

export interface Unrecognised {
  PM: number
  OM: number
  PB: number
  InstOthers: number
}

export interface Total {
  PM: number
  OM: number
  PB: number
  InstOthers: number
}


//New
export interface MonthlyUploadStatusResponse {
  Month: string;
  Year: string;
  IsFbl5nAvailable: boolean;
  IsSalesFtmAvailable: boolean;
  IsPddUploaded: boolean;
  IsUnbookedCollectionUploaded: boolean;
  IsProjectBusinessAvailable: boolean;
  MissingCount: number;
  IsDebitGenerated: boolean;
  CanGenerateReport: boolean;
  Message: string;
}