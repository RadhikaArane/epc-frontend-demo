import { Component, inject, signal } from '@angular/core';
import { breadCrumbItems } from '../../../../shared/models/models';
import { AuthService } from '../../../../shared/services/common/auth.service';
import { ToastService } from '../../../../shared/services/componentServices/toast.service';
import { BreadcrumbsComponent } from "../../../common/breadcrumbs/breadcrumbs.component";
import { MenuItemDto, ProjectTypeDto, RoleDto, SrcSideMenuAccessService, SubMenuItemDto } from '../../../../shared/services/scrapper/src-side-menu-access.service';
import { UrToggelAccessService } from '../../../../shared/services/unrecognisedInvoice/ur-toggel-access.service';
import { DataService } from '../../../../shared/services/common/data.service';

export interface RouteAccessItemDto {
  RouteAccessItemId : number;
  RouteKey          : string;
  DisplayName       : string;
  ParentRouteKey    : string;
  ParentDisplayName : string;
  ProjectTypeId     : number; 
  IsActive          : boolean;
}

@Component({
  selector: 'app-side-menu-access',
  standalone: true,
  imports: [BreadcrumbsComponent],
  templateUrl: './side-menu-access.component.html',
  styleUrl: './side-menu-access.component.scss'
})
export class SideMenuAccessComponent {

  private dataSrv = inject(DataService);

  breadCrumbItems = signal<breadCrumbItems[]>([]);
  authSrv = inject(AuthService);
  toastSrv = inject(ToastService);
  sideMenuAccessSrv = inject(SrcSideMenuAccessService);
  urToggleSrv       = inject(UrToggelAccessService);   // ← NEW


  projectTypes = signal<ProjectTypeDto[]>([]);
  roles = signal<RoleDto[]>([]);
  menus = signal<MenuItemDto[]>([]);
  subMenus = signal<SubMenuItemDto[]>([]);

  selectedProjectTypeId = signal<string>('');
  selectedRoleId = signal<string>('');
  expandedMenuIds = signal<number[]>([]);
  isLoading = signal<boolean>(false);

  // ── NEW signals ──
  routeAccessItems  = signal<RouteAccessItemDto[]>([]);
  groupedRoutes     = signal<{ parent: string; parentKey: string; items: RouteAccessItemDto[] }[]>([]);
  isRouteLoading    = signal<boolean>(false);
  expandedParents   = signal<string[]>([]);

  constructor() {
    this.breadCrumbItems.set([
      { label: 'Dashboard' },
      { label: 'Side Menu Access' }
    ]);

    this.loadInitialData();

    // ── Auto-select logged in user's project type ──
    const user = this.authSrv.userDetails;
      if (user?.projectTypeId) {
        this.selectedProjectTypeId.set(String(user.projectTypeId));
      }
  }

  loadInitialData(): void {
    this.sideMenuAccessSrv.getProjectTypes().subscribe({
      next: (res) => {
        this.projectTypes.set(res?.Data || []);
        this.loadAccessDataIfReady();
      },
      error: (err: any) => {
        console.error('GetProjectTypes error:', err);
        this.toastSrv.showToast('Failed to load project types', 'error');
      }
    });

    this.sideMenuAccessSrv.getRoles().subscribe({
      next: (res) => {
        this.roles.set(res?.Data || []);
      },
      error: (err: any) => {
        console.error('GetRoles error:', err);
        this.toastSrv.showToast('Failed to load roles', 'error');
      }
    });
  }

  onProjectTypeChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedProjectTypeId.set(value);
    this.loadAccessDataIfReady();
  }

  onRoleChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedRoleId.set(value);
    this.loadAccessDataIfReady();
  }

  loadAccessDataIfReady(): void {
    if (!this.selectedProjectTypeId() || !this.selectedRoleId()) {
      this.menus.set([]);
      this.subMenus.set([]);
      this.expandedMenuIds.set([]);
      this.routeAccessItems.set([]);   // ← NEW
      this.groupedRoutes.set([]);      // ← NEW
      return;
    }

    this.loadMenusAndSubMenus();
    this.loadRouteAccessItems();       // ← NEW
  }

  loadMenusAndSubMenus(): void {
    this.isLoading.set(true);
    this.expandedMenuIds.set([]);

    this.sideMenuAccessSrv
      .getMenuItems(this.selectedProjectTypeId(), this.selectedRoleId())
      .subscribe({
        next: (menuRes) => {
          this.menus.set(menuRes?.Data || []);

          this.sideMenuAccessSrv
            .getSubMenuItems(this.selectedProjectTypeId(), this.selectedRoleId())
            .subscribe({
              next: (subMenuRes) => {
                this.subMenus.set(subMenuRes?.Data || []);
                this.isLoading.set(false);
              },
              error: (err: any) => {
                console.error('GetSubMenuItems error:', err);
                this.subMenus.set([]);
                this.isLoading.set(false);
                this.toastSrv.showToast('Failed to load sub menu items', 'error');
              }
            });
        },
        error: (err: any) => {
          console.error('GetMenuItems error:', err);
          this.menus.set([]);
          this.subMenus.set([]);
          this.isLoading.set(false);
          this.toastSrv.showToast('Failed to load menu items', 'error');
        }
      });
  }

  getSubMenusByMenuId(menuItemId: number): SubMenuItemDto[] {
    return this.subMenus().filter(x => x.MenuItemId === menuItemId);
  }

  toggleExpand(menuItemId: number): void {
    const current = this.expandedMenuIds();
    if (current.includes(menuItemId)) {
      this.expandedMenuIds.set(current.filter(x => x !== menuItemId));
    } else {
      this.expandedMenuIds.set([...current, menuItemId]);
    }
  }

  onMenuToggle(menu: MenuItemDto, event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    const oldValue = menu.IsActive;

    menu.IsActive = isChecked;
    this.menus.set([...this.menus()]);

    const payload = {
  menuItemId: String(menu.MenuItemId),
  roleId: String(this.selectedRoleId()),
  projectTypeId: String(this.selectedProjectTypeId()),
  isActive: isChecked ? 'true' : 'false'  
};

    this.sideMenuAccessSrv.toggleMenuAccess(payload).subscribe({
      next: (res) => {
        this.toastSrv.showToast(res?.Message || 'Menu access updated successfully', 'success');
        this.dataSrv.reloadSidebar();
      },
      error: (err: any) => {
        console.error('ToggleMenuAccess error:', err);
        menu.IsActive = oldValue;
        this.menus.set([...this.menus()]);
        this.toastSrv.showToast('Failed to update menu access', 'error');
      }
    });
  }

  onSubMenuToggle(subMenu: SubMenuItemDto, event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    const oldValue = subMenu.IsActive;

    subMenu.IsActive = isChecked;
    this.subMenus.set([...this.subMenus()]);

    const payload = {
  subMenuItemId: String(subMenu.SubMenuItemId),
  roleId: String(this.selectedRoleId()),
  projectTypeId: String(this.selectedProjectTypeId()),
  isActive: isChecked ? 'true' : 'false'  
};

    this.sideMenuAccessSrv.toggleSubMenuAccess(payload).subscribe({
      next: (res) => {
        this.toastSrv.showToast(res?.Message || 'Sub menu access updated successfully', 'success');
        this.dataSrv.reloadSidebar();
      },
      error: (err: any) => {
        console.error('ToggleSubMenuAccess error:', err);
        subMenu.IsActive = oldValue;
        this.subMenus.set([...this.subMenus()]);
        this.toastSrv.showToast('Failed to update sub menu access', 'error');
      }
    });
  }

   // ── NEW methods ──────────────────────────────────────────────

  loadRouteAccessItems(): void {
    this.isRouteLoading.set(true);
    this.expandedParents.set([]);

    this.urToggleSrv
      .getRouteAccessItems(
        Number(this.selectedProjectTypeId()),
        Number(this.selectedRoleId())
      )
      .subscribe({
        next: (res: any) => {
          const items: RouteAccessItemDto[] = res?.Data || [];
          this.routeAccessItems.set(items);
          this.buildGroupedRoutes(items);
          this.isRouteLoading.set(false);
        },
        error: (err: any) => {
          console.error('GetRouteAccessItems error:', err);
          this.routeAccessItems.set([]);
          this.groupedRoutes.set([]);
          this.isRouteLoading.set(false);
          this.toastSrv.showToast('Failed to load route access items', 'error');
        }
      });
  }

  private buildGroupedRoutes(items: RouteAccessItemDto[]): void {
    const map = new Map<string, { parent: string; parentKey: string; items: RouteAccessItemDto[] }>();

    items.forEach(item => {
      if (!map.has(item.ParentRouteKey)) {
        map.set(item.ParentRouteKey, {
          parent   : item.ParentDisplayName,
          parentKey: item.ParentRouteKey,
          items    : []
        });
      }
      map.get(item.ParentRouteKey)!.items.push(item);
    });

    this.groupedRoutes.set(Array.from(map.values()));
  }

  toggleParentExpand(parentKey: string): void {
    const current = this.expandedParents();
    if (current.includes(parentKey)) {
      this.expandedParents.set(current.filter(x => x !== parentKey));
    } else {
      this.expandedParents.set([...current, parentKey]);
    }
  }

  onRouteToggle(item: RouteAccessItemDto, event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    const oldValue  = item.IsActive;

    item.IsActive = isChecked;
    this.routeAccessItems.set([...this.routeAccessItems()]);
    this.buildGroupedRoutes(this.routeAccessItems());

    const payload = {
      RouteAccessItemId: String(item.RouteAccessItemId),
      RoleId           : String(this.selectedRoleId()),
      ProjectTypeId    : String(this.selectedProjectTypeId()),
      IsActive         : isChecked ? '1' : '0'
    };

    this.urToggleSrv.toggleRouteAccess(payload).subscribe({
      next: (res: any) => {
        this.toastSrv.showToast(res?.Message || 'Route access updated successfully', 'success');
        this.dataSrv.reloadSidebar();
      },
      error: (err: any) => {
        console.error('ToggleRouteAccess error:', err);
        item.IsActive = oldValue;
        this.routeAccessItems.set([...this.routeAccessItems()]);
        this.buildGroupedRoutes(this.routeAccessItems());
        this.toastSrv.showToast('Failed to update route access', 'error');
      }
    });
  }

  

}