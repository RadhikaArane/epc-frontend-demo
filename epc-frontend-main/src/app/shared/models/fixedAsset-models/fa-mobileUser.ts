export type mobileUserData = faMobileUser[]

export interface faMobileUser {
  UserId: number
  Username: string
  PasswordHash: string
  FullName: string
  Role: string
  DepartmentId: number
  IsActive: boolean
  CreatedOn: string
  MobileNumber?: string
  Email?: string
  IsMobileVerified: boolean
  IsEmailVerified: boolean
  ExternalId: any
  FirstName: any
  LastName: any
  Mobile?: string
  AltMobile: any
  Designation: any
  RoleId?: number
  ActiveStatus: boolean
  LockStatus?: boolean
  StartDate: any
  EndDate: any
  AccessLevel?: number
  EmployeeId?: string
  CreatedBy?: number
  ModifiedBy: any
  ModifiedOn: any
}













export class CreateMobileUserPayload {
  username: string;
  password: string;
  fullName: string;
  email?: string;
  mobileNumber?: string;
  employeeId: string;

  constructor() {
    this.username = '';
    this.password = '';
    this.fullName = '';
    this.employeeId = '';
    this.mobileNumber='';
  }
}
