import { Injectable } from '@angular/core';
// import { AuthService } from './common/auth.service';
// import { routes } from '../routes/routes';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  // private menuItems: MenuItem[] = [
  //   { label: 'Dashboard sf',  route: routes.maslCustomerDashboard, roles: [{roleName: "Superadmin"},{ roleName: 'Customer' }],companyCode:[{companyCode:1049}] },
  //   { label: 'Admin',  route: routes.mhzpcProfile, roles: [{ roleName: 'Superadmin ' }],companyCode:[{companyCode:1054}] },
  //   { label: 'User',  route: routes.mhzpcManageBookings,roles: [{roleName: " Customer"}],companyCode:[{companyCode:1054}] },
  // ];
  // constructor(private authSrv: AuthService) { }
  // getMenuItems(): MenuItem[] {
  //   ;
  //   const userRole = this.authSrv.getRole();
  //   const userCompanyCode = this.authSrv.getCompanyCode1();

  //  this.menuItems = this.menuItems.filter((item:any) => {
  //   item.filter((roles:any)=>{
  //     console.log('item',roles.roleName);
  //   })















  //     return item.roles.includes('Customer') && item.companyCodes.includes(1049);
  //   });
  //   console.log('this.menuItems',this.menuItems);

  //   return this.menuItems
  // }
}

export interface MenuItem {
  label: string;
  route: string;
  roles: Roles[];
  companyCode: CompanyCode[];
}

export interface Roles {
roleName?:string
}
export interface CompanyCode {
  companyCode?:number
  }

