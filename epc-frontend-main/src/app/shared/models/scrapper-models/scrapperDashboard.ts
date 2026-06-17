export interface JobStats {
  finished: number;
  failed: number;
}


export interface Root {
  state: string;
  table: string;
  scrapDateInput?: any;
  selectedScrappingDateTime: string;
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  items: any;  //[]
}

//madhyaPradesh
export interface MpItem {
  Id: number;
  SrNo: string;
  'पंजीयन क्र.': string;
  'कृषक का नाम': string;
  'आवेदन दिनांक': string;
  'मोबाइल नंबर': string;
  'पता': string;
  'जिला': string;
  'ब्लॉक': string;
  'आवेदन की वर्तमान स्थिति': string;
  'न्यूनतम कृषक अंश': string;
  'आवेदित रकवा': string;
  'कुल रकवा': string;
  'योजना': string;
  'सामग्री': string;
  'गाँव': string;
  'जमा कृषक अंश': string;
  'आवेदन नंबर': string;
  FinancialYear: string;
}

export interface ApItem {
  Id: number;
  'S.No.': string;
  'Farmer Name': string;
  'Father Name': string;
  'Farmer ID': string;
  'Farmer Reg. Date': string;
  District: string;
  Mandal: string;
  Panchayat: string;
  Village: string;
  Caste: string;
  'Area Proposed': string;
  'Survey No': string;
  Crop: string;
  Category: string;
  'MI Company Name': string;
  'MI System': string;
  'Mobile Number': string;
  'Status of Application': string;
}

export interface WbItem {
  Id: number;
  'Farmer Registration Number': string;
  'Name of Beneficiary': string;
  'Beneficiary Type': string;
  'Farmer Category': string;
  Sex: string;
  'Farmer Status': string;
  'Epic Number': string;
  'Aadhar Number': string;
  'Enrollment Number': string;
  'District Name': string;
  'Block Name': string;
  'Gram Panchayet': string;
  'Mouza Name': string;
  'Police Station': string;
  'Post Office': string;
  'Sub Division': string;
  Pincode: string;
  'Mobile No': string;
  'Irrigation Type': string;
  'Irrigation Area': string;
  'Crop Type': string;
  'Crop Spacing': string;
  'Is Pump Available': string;
  'Pump Type': string;
  'Pump Capacity': string;
  'Indicative Cost': string;
  'Water Source': string;
  'Other Water Source': string;
  'Registration Date': string;
  'Current Status': string;
  'DLIC Number': string;
  'DLIC Date': string;
  'Quotation No': string;
  'Quotation Date': string;
  'Total Amount': string;
  'PMKSY Subsidy': string;
  'BKSY Subsidy': string;
  'GST Amount': string;
  'Farmers Share': string;
  'PMKSY Subsidy (Addl. Item)': string;
  'BKSY Subsidy (Addl. Item)': string;
  'GST Amount (Addl. Item)': string;
  'Farmers Share (Addl. Item)': string;
  'Total Subsidy': string;
  'Total Farmer Share': string;
  'Paid By Farmer': string;
  'Type of Payment': string;
  'Payment Reference': string;
  'Payment Date': string;
  'Joint Insp. Date': string;
  'Quot. Approval Date': string;
  'Work Order Date': string;
  'Work Order Memo': string;
  'Inspection Date': string;
  'Installation Date': string;
  'Bill No.': string;
  'Tax Inv. No.': string;
  'Bill Date': string;
  'Approved on': string;
  'PMKSY Amount Paid': string;
  'PMKSY CGST': string;
  'PMKSY SGST': string;
  'PMKSY TDS': string;
  'PMKSY Released On': string;
  'PMKSY Transaction Ref.': string;
  'PMKSY Transaction Date': string;
  'PMKSY Paid By': string;
  'BKSY Amount Paid': string;
  'BKSY CGST': string;
  'BKSY SGST': string;
  'BKSY TDS': string;
  'BKSY Released On': string;
  'BKSY Transaction Ref.': string;
  'BKSY Transaction Date': string;
  'BKSY Paid By': string;
  'Doc. Upload Status': string;
  FinancialYear: string;
}


export interface UpItem {
  Id: number;
  'Reg. No.': string;
  'Reg. Date.': string;
  taluka: string;
  village: string;
  'Sanc. Ltr. Date': string;
  'Lapse Days': string;
  'Farmer Name': string;
  'MIS System': string;
  'Loanee / Non Loanee': string;
  'Area (Hac)': string;
  Status: string;
  'Est. Miscost': string;
  'Remaining days for Auto delete': string;
  'Est. Subsidy Amount': string;
  'Est. Tribal Subsidy Amount': string;
  'TPA Signed Date': string;
  'TPA Signed Lapse Days': string;
  Source: string;
}

export interface TnItem {
  Id: number;
  'Srl No': string;
  Year: string;
  'Application Id': string;
  'Farmer Name': string;
  'Father Name': string;
  Caste: string;
  Mobile: string;
  Gender: string;
  'Work Order No': string;
  District: string;
  Block: string;
  Village: string;
  Crop: string;
  Spacing: string;
  'Survey No Subdivision No': string;
  'Total Area Ha': string;
  'Applied Area Ha': string;
  Department: string;
  Scheme: string;
  'Irrigation Type': string;
  'Sprinkler Type': string;
  'Sprinkler Spacing': string;
  'Sugar Mill': string;
  'Sugar Drip Type': string;
  'Sugar Well Type': string;
  'MI Company': string;
  'MI Referrence No': string;
  'Dealer Name': string;
  'Farmer Type': string;
  'Quotation Subsidy Amount Rs 100': string;
  'Farmer Contribution Rs 25': string;
  'Invoice Amount Rs 100': string;
  'State Restricted Amount Rs 100': string;
  'First Fund amount Lakhs': string;
  'GOI Share amount': string;
  'State Share amount': string;
  'First Fund Proceeding No': string;
  'First Fund UTR No': string;
  'AE Restricted Amount Rs 100': string;
  'Bank Gaurantee Deducted': string;
  'Bank Gaurantee Deducted Amount': string;
  'Second Fund amount Lakhs': string;
  'Addl State Share amount': string;
  'GST amount': string;
  'Second Fund Proceeding No': string;
  'Final Fund UTR No': string;
  'Treasury Fund UTR No': string;
  'Total Fund Released Lakhs': string;
  'Application Received Date': string;
  'Quotation Date': string;
  'Work Order Date': string;
  'Supply Date': string;
  'Invoice Date': string;
  'First Fund UTR Date': string;
  'JV Recommended Date': string;
  'Final Fund UTR Date': string;
  'Treasury Fund UTR Date': string;
  'Current Status Date': string;
  'Current Status': string;
  'Current Status Remarks': string;
  'Fund type': string;
  'Proceeding Status': string;
  'FRA Act': string;
  'col_7YC Renewal Days': string;
}

export interface GjItem {
  Id: number;
  'Reg. No.': string;
  'Reg. Date.': string;
  Taluka: string;
  VILLAGE: string;
  'WO Date': string;
  'Lapse Days': string;
  'Farmer Name': string;
  'MIS System': string;
  'Loanee / Non Loanee': string;
  'Area (Hac)': string;
  Status: string;
  'Est. Miscost': string;
  'Remaining Days for Auto Delete': string;
  'Est. Subsidy Amount': string;
  'Est. Tribal Subsidy Amount': string;
  'TPA Signed Date': string;
  'TPA Signed Lapse Days': string;
  Stage: string;
}

export interface CgItem {
  Id: number
  SRNO: string
  REGNO: string
  FARMERNAME: string
  DTL: string
  DISTRICT: string
  TALUKA: string
  VILLAGE: string
  SUPPLIER: string
  STAGECODE: string
  STATUSCODE: string
  ONLINESTAGE: string
  ONLINESTATUS: string
  REGNLSTATUSDESCR: string
  PHYSTAGECODE: string
  PHYSTATUSCODE: string
  UPDBY: string
  UPDDT1: string
  UPDDT: string
  REGDT1: string
  REGDT: string
  BIOSTATUS: string
  custid: string
  MISNAME: string
  "INSP Name": string
  "INSP Call Date": string
  INSPDate: string
  "FARMER CONTACT NO": string
  "TPA Date": string
  FinancialYear: string
}

export interface TgItem {
  "S.No": string
  FarmerID: string
  "Farmer Name": string
  "Father Name": string
  Caste: string
  Category: string
  "DPAP / Non DPAP": string
  "Aadhar No.": string
  "Mobile No": string
  District: string
  Mandal: string
  "Gram panchayat": string
  Village: string
  "Survey No.": string
  "Crop Category": string
  "Crop Name": string
  Spacing?: string
  "Area (Ha)": string
  "MI System Type": string
  "System Cost": any
  "Subsidy Eligibility (%)"?: string
  "Subsidy Amount"?: string
  "10% Admin Sanction": any
  VAT: any
  TDS: any
  "Central Share": any
  "Additional State Share": any
  "State Share": any
  "Final Gross Amount": any
  "Farmer Contribution": any
  "MI Company Name": string
  "Status Description": string
  Scrapping_DateTime: string
}

export interface Kartaka_AgriItem {
  Id: number
  Stage: string
  "Sl.No"?: string
  "Fin Year"?: string
  District?: string
  Taluk?: string
  RSK?: string
  Village?: string
  "Farmer ID"?: string
  Name?: string
  "Father Name"?: string
  Category?: string
  "Farmer  Type"?: string
  "Survey No"?: string
  "Item Category"?: string
  Item?: string
  "Sub Item"?: string
  Manufacture?: string
  "Implement Cost"?: string
  "Subsidy Rate"?: string
  "Farmer Share"?: string
  "Submission Date"?: string
  "Challan No"?: string
  "Challan Amount"?: string
  "Challan Paid Date"?: string
  Scrapping_DateTime: string
}

export interface Kartaka_HortiItem {
  Id: number
  SlNo: string
  BID: string
  FID: string
  "Farmer Name": string
  "Father Name": string
  District: string
  Taluk: string
  Hobli: string
  Village: string
  "Application Status": string
  "Sanction Order Amount"?: string
  Year: string
  Taluka: string
  SourceFile: string
  Scrapping_DateTime: string
}