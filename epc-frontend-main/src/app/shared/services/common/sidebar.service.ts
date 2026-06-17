import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SideBar, SideBarMenu } from '../../models/models';
import { DataService } from './data.service';
import { HttpEncSrvWrapperService } from './http-enc-srv-wrapper.service';
import { environment } from '../../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class SideBarService {

  private apiURL = environment.apiUrl;
  private httpWrapper = inject(HttpEncSrvWrapperService);

  constructor(private data: DataService) {}

  getSidebarMenus(roleId: number, projectTypeId: number): Observable<any> {
  return this.httpWrapper.get<any>(
    `${this.apiURL}AuthService/api/Sidebar/GetSidebar`,
    {
      encryptedParams: {
        RoleId: roleId,
        ProjectTypeId: projectTypeId
      }
    }
  );
}

  // Sidebar state variables (booleans for cleaner logic)
  private isMiniSidebar: boolean = false;
  private isMobileSidebar: boolean = false;
  private selectedMenuValue: string = '';

  // BehaviorSubjects for component binding
  public toggleSideBar: BehaviorSubject<string> = new BehaviorSubject<string>(this.isMiniSidebar.toString());
  public toggleMobileSideBar: BehaviorSubject<string> = new BehaviorSubject<string>(this.isMobileSidebar.toString());
  public expandSideBar: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  // constructor(private data: DataService) {}

  // Toggle Mini Sidebar (for general use)
  toggleMiniSidebar(): void {
    this.isMiniSidebar = !this.isMiniSidebar;
    this.toggleSideBar.next(this.isMiniSidebar.toString());
  }

  // Toggle Mobile Sidebar (for general use)
  toggleMobileSidebar(): void {
    this.isMobileSidebar = !this.isMobileSidebar;
    this.toggleMobileSideBar.next(this.isMobileSidebar.toString());
  }

  // Set selected menu (used instead of sessionStorage menuValue)
  public setSelectedMenu(menuValue: string): void {
    this.selectedMenuValue = menuValue;
  }

  // Switch Mini Sidebar and handle submenu visibility
  public switchSideMenuPosition(): void {
    this.isMiniSidebar = !this.isMiniSidebar;
    this.toggleSideBar.next(this.isMiniSidebar.toString());

    this.data.sideBar.forEach((mainMenus: SideBar) => {
      mainMenus.menu.forEach((resMenu: SideBarMenu) => {
        if (!this.isMiniSidebar && resMenu.menuValue === this.selectedMenuValue) {
          resMenu.showSubRoute = true;
        } else {
          resMenu.showSubRoute = false;
        }
      });
    });
  }

  // Switch Mobile Sidebar toggle state
  public switchMobileSideBarPosition(): void {
    this.isMobileSidebar = !this.isMobileSidebar;
    this.toggleMobileSideBar.next(this.isMobileSidebar.toString());
  }
}
