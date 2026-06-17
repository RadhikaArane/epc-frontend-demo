 
export class LoginModel {
  employeeId: string;
  password: string;
  // isLogin: boolean;
  constructor() {
    this.employeeId = '';
    this.password = '';
    // this.isLogin = true
  }
}

 
export class CustomerModel {
  userId: number | null;
  employeeId: string | null;
  name: string | null;
  email: any | null;
  roleId: number | null;
  roleName: string | null;
  organisationId: string | null;
  isActive: boolean | null;
  reportingMgr: string | null;
  accessLevel: string | null; 
  dealerCode: any | null;
  dealerName: any | null;
  projectTypeId: number | null;
  projectTypeName: string | null;

  constructor() {
    this.userId = 0;
    this.employeeId = '';
    this.name = '';
    this.email = '';
    this.roleId = 0;
    this.roleName = '';
    this.organisationId = '';
    this.isActive = true;
    this.reportingMgr = '';
    this.accessLevel = '';
    this.dealerCode = '';
    this.dealerName = '';
    this.projectTypeId = 0;
    this.projectTypeName = '';
  }
}