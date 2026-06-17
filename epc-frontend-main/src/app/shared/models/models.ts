  export interface pageSelection {
  skip: number;
  limit: number;
}
export interface apiResultFormat {
  data: [];
  totalData: number;
}
export interface adminSidebar {
  tittle: string;
  showAsTab: boolean;
  separateRoute: boolean;
  menu: adminMenu[];
}
export interface adminMenu {
  menuValue: string;
  hasSubRoute: boolean;
  showSubRoute: boolean;
  route?: string;
  subMenus?: adminSubMenus[];
  base?: string;
  boxIcon?: string;
}
export interface adminSubMenus {
  menuValue?: string;
  route?: string;
}
export interface url {
  url: string;
}

export interface apiResultFormat {
  data: [];
  totalData: number;
}
export interface adminSidebar {
  tittle: string;
  showAsTab: boolean;
  separateRoute: boolean;
  menu: adminMenu[];
}
export interface adminMenu {
  menuValue: string;
  hasSubRoute: boolean;
  showSubRoute: boolean;
  route?: string;
  subMenus?: adminSubMenus[];
  base?: string;
  boxIcon?: string;
}
export interface adminSubMenus {
  menuValue?: string;
  route?: string;
}
export interface url {
  url: string;
}
export class register {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export class passwordResponce {
  passwordResponceText?: string;
  passwordResponceImage?: string;
  passwordResponceKey?: string;
}
export interface reportUser {
  isSelected?: boolean;
  id: number;
  name: string;
  phoneNumber: string;
  emailAddress: string;
  reportDate: string;
  reportedBy: string;
  img1: string;
  img2: string;
}

export interface language {
  isSelected?: boolean;
  id: number;
  name: string;
  code: string;
  total: string;
  done: string;
  progress: number;
  img: string;
}
export interface languageadmin {
  isSelected?: boolean;
  id: number;
  medium: string;
  file: string;
  total: string;
  complete: string;
  progress: number;
}
export interface languageapp {
  isSelected?: boolean;
  id: number;
  medium: string;
  file: string;
  total: string;
  complete: string;
  progress: number;
}
export interface languagetranslate {
  isSelected?: boolean;
  id: number;
  medium: string;
  file: string;
  total: string;
  complete: string;
  progress: number;
}
export interface languageweb {
  isSelected?: boolean;
  moduleName: string;
  id: number;
  total: number;
  complete: number;
  progress: number;
}
export interface stories {
  isSelected?: boolean;
  id: number;
  name: string;
  phoneNumber: string;
  emailAddress: string;
  storiesDate: string;
  img: string;
}
export interface userList {
  id: number;
  name: string;
  phoneNumber: string;
  emailAddress: string;
  regDate: string;
  country: string;
  lastSeen: string;
  img: string;
  isSelected?: boolean;
}
export interface inviteUser {
  id: number;
  name: string;
  phoneNumber: string;
  emailAddress: string;
  inviteDate: string;
  country: string;
  img: string;
  isSelected?: boolean;
}
export interface abuseMessage {
  isSelected?: boolean;
  id: number;
  reportedBy: string;
  reportedUser: string;
  totalMessageCount: string;
  date: string;
  img1: string;
  img: string;
}
export interface chatSidebar {
  boxIcon: string;
  tooltip: string;
  route: string;
  class?: string;
}
export interface CompanyAccount {
  sNo?: number;
  isSelected: boolean;
  CompanyName: string;
  Email: string;
  AccountURL: string;
  Plan: string;
  CreatedDate: string; // Alternatively, use Date if you want to store it as a Date object
  Image: string;
  Status: string;
}
export interface CompanyInfo {
  sNo?: number;
  isSelected: boolean;
  CompanyName: string;
  BillCycle: string;
  PaymentMethod: string;
  Email: string;
  AccountURL: string;
  Plan: string;
  CreatedDate: string;
  ExpiringDate: string;
  Image: string;
  Status: string;
  Amount: string;
  DomainStatus: string;
  InvoiceID: string;
}
export interface PackageList {
  sNo?: number;
  isSelected: boolean;
  Plan_Name: string;
  Plan_Type: string;
  Total_Subscribers: string; // Alternatively, use number if you want a numerical type
  Price: string; // Alternatively, use number if you want to remove the "$" symbol
  Created_Date: string; // Alternatively, use Date if you want to store it as a Date object
  Status: string;
}
export interface dataTables {
  isSelected: boolean;
  sNo?: number;
  name?: string;
  position?: string;
  office?: string;
  age?: string;
  salary?: string;
  startDate?: string;
  id?: string;
}
export interface Star {
  show?: boolean;
  half?: boolean;
}
export interface SideBarMenu {
  roles?:Roles[], 
  projectTypeName?:ProjectTypeName[];
  showMyTab?: boolean;
  menuValue: string;
  route?: string;
  hasSubRoute?: boolean;
  showSubRoute: boolean;
  icon: string;
  base?: string;
  base2?:string;
  base3?:string;
  base4?:string;
  base5?:string;
  base7?:string;
  base8?:string;
  base9?:string;
  base10?:string;
  last1?: string;
  last?: string;
  page?: string;
  last2?: string;
  materialicons?: string;
  subMenus: SubMenu[];
  dot?: boolean;
  changeLogVersion?: boolean;
  hasSubRouteTwo?: boolean;
  page1?: string;

}

export interface Roles {
  roleName?:string
}
 
export interface ProjectTypeName {
  projectTypeName?:string
} 


export interface breadCrumbItems {
  label: string;
  active?: boolean;
}
export interface SubMenu {
  roles?:Roles[]
  projectTypeName?:ProjectTypeName[];
  menuValue: string;
  route?: string;
  base?: string;
  page?: string;
  page1?: string;
  page2?: string;
  base2?: string;
  base3?: string;
  base4?: string;
  base5?: string;
  base6?: string;
  base7?: string;
  base8?: string;
  dot?:boolean;
  currentActive?: boolean;
  hasSubRoute?: boolean;
  showSubRoute?: boolean;

  customSubmenuTwo?: boolean;
  subMenusTwo?: SubMenu[];

}
export interface SubMenusTwo {
  menuValue: string;
  route?: string;
  base?: string;
  page?: string;
  base2?: string;
  base3?: string;
  base4?: string;
  base5?: string;
  base6?: string;
  base7?: string;
  base8?: string;
  currentActive?: boolean;
  materialicons?: string;
  hasSubRoute?: boolean;
  showSubRoute?: boolean;
}

export interface SideBar {
  showMyTab?: boolean;
  tittle: string;
  icon?: string;
  showAsTab: boolean;
  base?:string;
  base2?:string;
  separateRoute: boolean;
  materialicons?: string;
  menu: SideBarMenu[];
  hasSubRoute?: boolean;
}

export interface SubMenuTwo {
  menuValue: string;
  route: string;
  base?: string;
  base1?: string;
  base2?: string;
  base3?: string;
  hasSubRoute?: boolean;
  showSubRoute?: boolean;
}

export interface SubMenu2 {
  menuValue: string;
  route?: string;
  base?: string;
  base1?: string;
  base2?: string;
  base3?: string;
  hasSubRoute?: boolean;
  showSubRoute?: boolean;
  customSubmenuTwo?: boolean;
  subMenusTwo?: SubMenuTwo[];
}

export interface Menu {
  menuValue: string;
  hasSubRouteTwo?: boolean;
  showSubRoute?: boolean;
  hasSubRoute?: boolean;
  icon?: string;
  base?: string;
  base1?: string;
  base2?: string;
  base3?: string;
  base4?: string;
  base5?: string;
  base6?: string;
  base7?: string;
  base8?: string;
  base9?: string;
  base10?: string;
  subMenus?: SubMenu2[];
  customSubmenuTwo?: boolean;
  subMenusTwo?: SubMenuTwo[];
}

export interface MainMenu {
  title: string;
  showAsTab: boolean;
  separateRoute: boolean;
  menu: Menu[];
}

export interface Client {
  sNo?: number;
  isSelected: boolean;
  ClientID: string;
  ClientName: string;
  Work: string;
  CompanyName: string;
  Email: string;
  Phone: string;
  Image: string;
  Status: string;
}

export interface Project {
  sNo?: number;
  isSelected: boolean;
  ProjectID: string;
  ProjectName: string;
  Leader: string;
  Team: string;
  UserImg: string;
  share: string[];
  Deadline: string;
  Priority: string;
  Status: string;
}
export interface activities {
  sNo?: number;
  isSelected: boolean;
  title: string;
  activityType: string;
  dueDate: string;
  owner: string;
  createdAt: string;
}
export interface contactList {
  sNo?: number;
  isSelected?: boolean;
  Image: string;
  Name: string;
  Roll: string;
  Email: string;
  Phone: string;
  Location: string;
  Rating: string;
  Owner: string;
  Status: string;
}
export interface Company {
  sNo?: number;
  isSelected: boolean;
  Company_Name: string;
  Image: string;
  Image2: string;
  Email: string;
  Phone: string;
  Location: string;
  Rating: string;
  Owner: string;
  Status: string;
  share: string[];
}
export interface Pipeline {
  sNo?: number;
  isSelected: boolean;
  Pipeline_Name: string;
  Total_Deal_Value: string;
  No_of_Deals: string;
  Stages: string;
  Created_Date: string;
  Status: string;
}
export interface Activity {
  sNo?: number;
  isSelected: boolean;
  Title: string;
  Activity_Type: string;
  Due_Date: string;
  Owner: string;
  Created_Date: string;
}

export interface employees {
  sNo?: number;
  isSelected: boolean;
  EmpId: string;
  Image: string;
  Name: string;
  CurrentRole: string;
  Email: string;
  Phone: string;
  Designation: string;
  JoiningDate: string;
  Status: string;
}

export interface department {
  sNo?: number;
  isSelected: boolean;
  Department: string;
  NoOfEmployees: string;
  Status: string;
}

export interface designation {
  sNo?: number;
  isSelected: boolean;
  Designation: string;
  Department: string;
  NoOfEmployees: string;
  Status: string;
}

export interface policy {
  sNo?: number;
  isSelected: boolean;
  Name: string;
  Department: string;
  Description: string;
  CreatedDate: string;
}
export interface holiday {
  sNo?: number;
  isSelected: boolean;
  Title: string;
  Date: string;
  Description: string;
  Status: string;
}

export interface attendanceadmin {
  sNo?: number;
  isSelected: boolean;
  Employee: string;
  Image: string;
  Role: string;
  CheckIn: string;
  CheckOut: string;
  Break: string;
  Late: string;
  Production: number;
  ProductionHours: string;
  Status: string;
}

export interface attendanceemployee {
  sNo?: number;
  isSelected: boolean;
  Date: string;
  CheckIn: string;
  Status: string;
  CheckOut: string;
  Break: string;
  Late: string;
  Overtime: string;
  Production: number;
  ProductionHours: string;
}

export interface timesheet {
  sNo?: number;
  isSelected: boolean;
  Employee: string;
  Image: string;
  Role: string;
  Date: string;
  Project: string;
  AssignedHours: number;
  WorkedHours: number;
}

export interface shiftschedule {
  sNo?: number;
  isSelected: boolean;
  Image: string;
  Name: string;
  JobTitle: string;
}

export interface overtime {
  sNo?: number;
  isSelected: boolean;
  EmpImage: string;
  Employee: string;
  Role: string;
  Date: string;
  OvertimeHours: string;
  Project: string;
  Image: string;
  Name: string;
  Status: string;
}

export interface promotion {
  sNo?: number;
  isSelected: boolean;
  Image: string;
  PromotedEmployee: string;
  Department: string;
  DesignationFrom: string;
  DesignationTo: string;
  PromotionDate: string;
}

export interface resignation {
  sNo?: number;
  isSelected: boolean;
  Image: string;
  ResigningEmployee: string;
  Department: string;
  Reason: string;
  NoticeDate: string;
  ResignationDate: string;
}
export interface termination {
  sNo?: number;
  isSelected: boolean;
  Image: string;
  ResigningEmployee: string;
  Department: string;
  TerminationType: string;
  NoticeDate: string;
  Reason: string;
  ResignationDate: string;
}

export interface DealInfo {
  sNo?: number;
  isSelected: boolean;
  DealName: string;
  Stage: string;
  DealValue: string;
  Tags: string;
  ExpectedClosedDate: string;
  Owner: string;
  Probability: string;
  Status: string;
}
export interface LeadInfo {
  sNo?: number;
  isSelected: boolean;
  LeadName: string;
  CompanyName: string;
  Phone: string;
  Email: string;
  Tags: string;
  CreatedDate: string;
  Image: string;
  LeadOwner: string;
}
export interface PipelineInfo {
  sNo?: number;
  isSelected: boolean;
  Pipeline_Name: string;
  Total_Deal_Value: string;
  No_of_Deals: string;
  Stages: string;
  Created_Date: string;
  Status: string;
}
export interface Activity {
  sNo?: number;
  isSelected: boolean;
  Title: string;
  Activity_Type: string;
  Due_Date: string;
  Owner: string;
  Created_Date: string;
}
export interface JobsInfo {
  sNo?: number;
  isSelected: boolean;
  Job_ID: string;
  Experience: string;
  Image: string;
  Job_Title: string;
  Roll: string;
  Category: string;
  Location: string;
  Salary_Range: string;
  Posted_Date: string;
}

export interface CandidateInfo {
  sNo?: number;
  isSelected: boolean;
  Cand_ID: string;
  Image: string;
  Candidate: string;
  Email: string;
  Applied_Role: string;
  Phone: string;
  Applied_Date: string;
  Status: string;
}

export interface ReferralInfo {
  sNo?: number;
  isSelected: boolean;
  Refferals_Image: string;
  Refferals_ID: string;
  Referrer_Name: string;
  Roll: string;
  Job_Image: string;
  Job_Reffered: string;
  Refferee_Image: string;
  Referee_Name: string;
  Email: string;
  Refferals_Bonus: string;
}

export interface trainingList {
  sNo?: number;
  isSelected: boolean;
  Image: string;
  TrainingType: string;
  Trainer: string;
  Employee: string;
  Img1?: string;
  Img2?: string;
  Img3?: string;
  Img4?: string;
  Img5?: string;
  TimeDuration: string;
  Description: string;
  Cost: string;
  Status: string;
}

export interface trainers {
  sNo?: number;
  isSelected: boolean;
  Image: string;
  Name: string;
  Phone: string;
  Email: string;
  Description: string;
  Status: string;
}

export interface trainingType {
  sNo?: number;
  isSelected: boolean;
  Type: string;
  Description: string;
  Status: string;
}

export interface performanceIndicator {
  sNo?: number;
  isSelected: boolean;
  Designation: string;
  Department: string;
  Image: string;
  ApprovedBy: string;
  Role: string;
  CreatedDate: string;
  Status: string;
}

export interface performanceAppraisal {
  sNo?: number;
  isSelected: boolean;
  Image: string;
  Name: string;
  Designation: string;
  Department: string;
  AppraisalDate: string;
  Status: string;
}

export interface goalType {
  sNo?: number;
  isSelected: boolean;
  Type: string;
  Description: string;
  Status: string;
}

export interface goalTrack {
  sNo?: number;
  isSelected: boolean;
  GoalType: string;
  Subject: string;
  TargetAchievement: string;
  StartDate: string;
  EndDate: string;
  Description: string;
  Status: string;
  Progress: string;
}

export interface leaveAdmin {
  sNo?: number;
  isSelected: boolean;
  Image: string;
  Employee: string;
  Role: string;
  LeaveType: string;
  From: string;
  To: string;
  NoOfDays: string;
}

export interface leaveEmployee {
  sNo?: number;
  isSelected: boolean;
  LeaveType: string;
  Image: string;
  From: string;
  ApprovedBy: string;
  Roll: string;
  To: string;
  NoOfDays: string;
  Status: string;
}

export interface Estimate {
  sNo?: number;
  isSelected: boolean;
  Client_Name: string;
  Image: string;
  Roll: string;
  Company_Name: string;
  Estimate_Date: string;
  Expiry_Date: string;
  Amount: string;
  Status: string;
}

export interface InvoiceList {
  sNo?: number;
  isSelected: boolean;
  Invoice: string;
  Image: string;
  Name: string;
  Roll: string; // If 'Roll' represents the role, you may want to rename it to 'Role'
  Created_On: string;
  Total: string;
  Amount_Due: string;
  Due_Date: string;
  Status: string;
}

export interface InvoicePaymentDetails {
  sNo?: number;
  isSelected: boolean;
  Invoice_ID: string;
  Image: string;
  Client_Name: string;
  Roll: string; // Consider renaming to 'Role' if it refers to job role
  Company_Name: string;
  Payment_Type: string;
  Paid_Date: string;
  Paid_Amount: string;
}
export interface ExpenseDetails {
  sNo?: number;
  isSelected: boolean;
  Expense_Name: string;
  Date: string;
  Payment_Method: string;
  Amount: string;
}

export interface ProvidentFundDetails {
  sNo?: number;
  isSelected: boolean;
  Employee_Name: string;
  Image: string;
  Roll: string;
  Provident_Fund_Type: string;
  Employee_Share: string;
  Organization_Share: string;
  Status: string;
}
export interface TaxDetails {
  sNo?: number;
  isSelected: boolean;
  Tax_Name: string;
  Tax_Percentage: string;
  Status: string;
}
export interface UserMangementUser {
  sNo?: number;
  isSelected: boolean;
  Name: string;
  Email: string;
  CreatedDate: string;
  Role: string;
  Status: string;
  Image: string;
}
export interface RoleInfo {
  sNo?: number;
  isSelected: boolean;
  Role: string;
  CreatedDate: string;
  Status: string;
}
export interface budgetRevenue {
  sNo?: number
  isSelected: boolean
  RevenueName: string
  CategoryName: string
  SubCategoryName: string
  Amount: string
  ExpenseDate: string
}

export interface budgetExpense {
  sNo?: number
  isSelected: boolean
  ExpenseName: string
  CategoryName: string
  SubCategoryName: string
  Amount: string
  ExpenseDate: string
}

export interface budget {
  sNo?: number
  isSelected: boolean
  BudgetTitle: string
  BudgetType: string
  StartDate: string
  EndDate: string
  TotalRevenue: string
  TotalExpense: string
  TaxAmount: string
  BudgetAmount: string
}

export interface categories {
  sNo?: number
  isSelected: boolean
  CategoryName: string
  SubCategoryName: string
}


export interface payrollAddition {
  sNo?: number;
  isSelected: boolean;
  Name: string;
  Category: string;
  Amount: string;
}

export interface payrollOvertime {
  sNo?: number;
  isSelected: boolean;
  Name: string;
  Rate: string;
}

export interface payrollDeduction {
  sNo?: number;
  isSelected: boolean;
  Name: string
  Category: string;
  Amount: string;
}

export interface employeeSalary {
  sNo?: number;
  isSelected: boolean;
  Image:string;
  EmpID: string;
  Name: string;
  Department: string;
  Email: string;
  Phone: string;
  Designation: string;
  JoiningDate: string;
  Salary: string;
  PaySlip: string;
};

export interface assetList {
  sNo?: number;
  isSelected: boolean;
  Image:string;
  AssetName: string;
  AssetUser: string;
  PurchaseDate: string;
  Warranty: string;
  WarrantyEndDate: string;
  Status: string;
}

export interface assetCategories{
  sNo?: number;
  isSelected: boolean;
  CategoryName: string;
  Status: string;
}

export interface userReport {
  sNo?: number;
  isSelected: boolean;
  Image: string;
  Name: string;
  Email: string;
  CreatedDate: string;
  Role: string;
  Status: string;
}

export interface taskReport {
  sNo?: number;
  isSelected: boolean;
  TaskName: string;
  ProjectName: string;
  CreatedDate: string;
  DueDate: string;
  Priority: string;
  Status: string;
}

export interface projectReport {
  sNo?: number;
  isSelected: boolean;
  Image: string;
  ProjectID: string;
  ProjectName: string;
  Leader: string;
  Img: string;
  Img1: string;
  Img2: string;
  Team: number;
  Deadline: string;
  Priority: string;
  Status: string;
}

export interface payslipReport {
  sNo?: number;
  isSelected: boolean;
  Image: string;
  Name: string;
  Role: string;
  PaidAmount: string;
  PaidMonth: string;
  PaidYear: string;
}

export interface paymentReport {
  sNo?: number;
  isSelected: boolean;
  Image: string;
  InvoiceID: string;
  ClientName: string;
  Role: string;
  CompanyName: string;
  PaymentType: string;
  PaidDate: string;
  PaidAmount: string;
}

export interface leaveReport {
  sNo?: number;
  isSelected: boolean;
  Image: string;
  InvoiceID: string;
  ClientName: string;
  Role: string;
  CompanyName: string;
  CreatedDate: string;
  DueDate: string;
  Amount: string;
  Status: string;
}


export interface invoiceReport {
  sNo?: number;
  isSelected: boolean;
  Image: string;
  InvoiceID: string;
  ClientName: string;
  Role: string;
  CompanyName: string;
  CreatedDate: string;
  DueDate: string;
  Amount: string;
  Status: string;
}



export interface expenseReport {
  sNo?: number;
  isSelected: boolean;
  ExpenseName: string;
  Date: string;
  PaymentMethod: string;
  Amount: string;
}

export interface employeeReport {
  sNo?: number;
  isSelected: boolean;
  EmpID: string;
  Image: string;
  Name: string;
  Role: string;
  Email: string;
  Department: string;
  Phone: string;
  JoiningDate: string;
  Status: string;
}


export interface dailyReport {
  sNo?: number;
  isSelected: boolean;
  Image: string;
  Name: string;
  Role: string;
  Date: string;
  Department: string;
  Status: string;
}

export interface attendanceReport {
  sNo?: number;
  isSelected: boolean;
  Name: string;
  Image: string;
  Role: string;
  Date: string;
  CheckIn: string;
  Status: string;
  CheckOut: string;
  Break: string;
  Late: string;
  Overtime: string;
  Progress:number;
  ProductionHours: string;
}
export interface ApiData {
  sNo?: number;
  isSelected: boolean;
  Image: string;
  serviceName: string;
  createdBy: string;
  apiKey: string;
  status: string;
  createdDate: string;
}


export interface page {
  sNo?: number;
  isSelected: boolean;
  Page: string;
  PageSlug: string;
  Status: string;
}

export interface blogCategories {
  sNo?: number;
  isSelected: boolean;
  Category: string;
  CreatedDate: string;
  Status: string;
}

export interface blogComments {
  sNo?: number;
  isSelected: boolean;
  Comment: string;
  CreatedDate: string;
  Blog: string;
  By: string;
}

export interface blogTags {
  sNo?: number;
  isSelected: boolean;
  Tag: string;
  CreatedDate: string;
  Status: string;
}

export interface cities {
  sNo?: number;
  isSelected: boolean;
  CityName: string;
  StateName: string;
  CountryName: string;
  Status: string;
}

export interface countries {
  sNo?: number;
  isSelected: boolean;
  CountryName: string;
  CountryCode: string;
  Status: string;
}

export interface faq {
  sNo?: number;
  isSelected: boolean;
  Questions: string;
  Answers: string;
  Categories: string;
}


export interface states {
  sNo?: number;
  isSelected: boolean;
  StateName: string;
  CountryName: string;
  Status: string;
}

export interface testimonial {
  sNo?: number;
  isSelected: boolean;
  Image: string;
  Author: string;
  Role: string;
  Content: string;
  CreatedDate: string;
}

export interface callHistory {
  sNo?: number;
  isSelected: boolean;
  Name: string;
  Email: string;
  Phone: string;
  CallType: string;
  Class: string;
  Duration: string;
  Image: string;
  DateTime: string;
}


//mahindra  models
export interface userInterface {
  id: string;
  name: string ,
  password: string;
  email: string,
  gender: string,
  companyCode:number,
  role: string,
  isActive: boolean
  // token: string;
}

export interface Products {
  companyCode: number,
  material_Code: string,
  material_Description: string,
  crop:string,
  variety: string,
  stage: string,
  grade: string,
  unit_of_Measurement: string
  Image1: string;
}


//mahindra  models end
