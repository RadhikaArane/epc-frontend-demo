import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpEncSrvWrapperService } from '../common/http-enc-srv-wrapper.service';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';


export interface ApiResponse<T> {
  Status: number;
  Message: string;
  Data: T;
}

export interface ProjectTypeDto {
  ProjectTypeId: number;
  ProjectTypeName: string;
}

export interface RoleDto {
  RoleId: number;
  RoleName: string;
}

export interface MenuItemDto {
  MenuItemId: number;
  MenuValue: string;
  Icon: string;
  Route: string;
  HasSubRoute: boolean;
  HasSubRouteTwo: boolean;
  SortOrder: number;
  IsActive: boolean;
}

export interface SubMenuItemDto {
  SubMenuItemId: number;
  MenuItemId: number;
  MenuValue: string;
  Route: string;
  SortOrder: number;
  IsActive: boolean;
}

export interface ToggleMenuAccessRequest {
  menuItemId: string;
  roleId: string;
  projectTypeId: string;
  isActive: string;
}

export interface ToggleSubMenuAccessRequest {
  subMenuItemId: string;
  roleId: string;
  projectTypeId: string;
  isActive: string;
}

@Injectable({
  providedIn: 'root'
})
export class SrcSideMenuAccessService {

  private httpWrapper = inject(HttpEncSrvWrapperService);
  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);

  getProjectTypes(): Observable<ApiResponse<ProjectTypeDto[]>> {
    return this.httpWrapper.get<ApiResponse<ProjectTypeDto[]>>(
      `${this.apiUrl}AuthService/api/Sidebar/GetProjectTypes`
    );
  }

  getRoles(): Observable<ApiResponse<RoleDto[]>> {
    return this.httpWrapper.get<ApiResponse<RoleDto[]>>(
      `${this.apiUrl}AuthService/api/Sidebar/GetRoles`
    );
  }

  getMenuItems(projectTypeId: string, roleId: string): Observable<ApiResponse<MenuItemDto[]>> {
    return this.httpWrapper.get<ApiResponse<MenuItemDto[]>>(
      `${this.apiUrl}AuthService/api/Sidebar/GetMenuItems`,
      {
        encryptedParams: {
          projectTypeId,
          roleId
        }
      }
    );
  }

  getSubMenuItems(projectTypeId: string, roleId: string): Observable<ApiResponse<SubMenuItemDto[]>> {
    return this.httpWrapper.get<ApiResponse<SubMenuItemDto[]>>(
      `${this.apiUrl}AuthService/api/Sidebar/GetSubMenuItems`,
      {
        encryptedParams: {
          projectTypeId,
          roleId
        }
      }
    );
  }

//   toggleMenuAccess(payload: ToggleMenuAccessRequest): Observable<ApiResponse<any>> {
//   const { isActive, ...encryptedPart } = payload; // isActive separate

//   return this.httpWrapper.put<ApiResponse<any>>(
//     `${this.apiUrl}AuthService/api/Sidebar/ToggleMenuAccess`,
//     encryptedPart,           
//     {
//       plainBody: { isActive } 
//     }
//   );
// }

// toggleSubMenuAccess(payload: ToggleSubMenuAccessRequest): Observable<ApiResponse<any>> {
//   const { isActive, ...encryptedPart } = payload;

//   return this.httpWrapper.put<ApiResponse<any>>(
//     `${this.apiUrl}AuthService/api/Sidebar/ToggleSubMenuAccess`,
//     encryptedPart,
//     {
//       plainBody: { isActive }
//     }
//   );
// }

toggleMenuAccess(payload: ToggleMenuAccessRequest): Observable<ApiResponse<any>> {
  return this.httpWrapper.put<ApiResponse<any>>(
    `${this.apiUrl}AuthService/api/Sidebar/ToggleMenuAccess`,
    payload   
  );
}

toggleSubMenuAccess(payload: ToggleSubMenuAccessRequest): Observable<ApiResponse<any>> {
  return this.httpWrapper.put<ApiResponse<any>>(
    `${this.apiUrl}AuthService/api/Sidebar/ToggleSubMenuAccess`,
    payload   
  );
}

}