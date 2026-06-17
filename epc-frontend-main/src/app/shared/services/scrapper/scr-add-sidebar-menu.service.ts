import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { HttpEncSrvWrapperService } from '../common/http-enc-srv-wrapper.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ScrAddSidebarMenuService {
  private apiURL = environment.apiUrl;
  private httpWrapper = inject(HttpEncSrvWrapperService);
  private http = inject(HttpClient);

  constructor() { }

  createSidebarMenu(payload: {
  menuValue: string;
  icon: string;
  route: string;
  hasSubRoute: string;
  hasSubRouteTwo: string;
  sortOrder: string;
  projectTypeIds: number[];
  roleIds: number[];
}): Observable<any> {
  return this.http.post<any>(`${this.apiURL}AuthService/api/Sidebar/CreateMenu`, payload);
}

  createSubMenu(payload: {
  menuItemId: number;
  menuValue: string;
  route: string;
  sortOrder: string;
  projectTypeIds: number[];
  roleIds: number[];
}): Observable<any> {
  return this.http.post<any>(
    `${this.apiURL}AuthService/api/Sidebar/CreateSubMenu`,
    payload
  );
}

getProjectTypes(): Observable<any> {
  return this.httpWrapper.get<any>(
    `${this.apiURL}AuthService/api/Sidebar/GetProjectTypes`,
    {}
  );
}

getRoles(): Observable<any> {
  return this.httpWrapper.get<any>(
    `${this.apiURL}AuthService/api/Sidebar/GetRoles`,
    {}
  );
}

updateMenu(payload: {
  menuItemId: number;
  menuValue: string;
  icon: string;
  sortOrder: number;
  isActive: boolean;
  projectTypeIds: number[];
  roleIds: number[];
}): Observable<any> {
  return this.http.put<any>(
    `${this.apiURL}AuthService/api/Sidebar/UpdateMenu`,
    payload
  );
}

deleteMenu(payload: {
  menuItemId: string;
}): Observable<any> {
  return this.http.request<any>('delete',
    `${this.apiURL}AuthService/api/Sidebar/DeleteMenu`,
    {
      body: payload
    }
  );
}

updateSubMenu(payload: {
  subMenuItemId: number;
  menuValue: string;
  route: string;
  sortOrder: string;
  isActive: boolean;
  projectTypeIds: number[];
  roleIds: number[];
}): Observable<any> {
  return this.http.put<any>(
    `${this.apiURL}AuthService/api/Sidebar/UpdateSubMenu`,
    payload
  );
}

deleteSubMenu(payload: {
  subMenuItemId: string;
}): Observable<any> {
  return this.http.request<any>('delete',
    `${this.apiURL}AuthService/api/Sidebar/DeleteSubMenu`,
    {
      body: payload
    }
  );
}
}