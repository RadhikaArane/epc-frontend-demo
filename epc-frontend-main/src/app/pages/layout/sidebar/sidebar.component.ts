import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { SideBarService } from '../../../shared/services/common/sidebar.service';
import {
  MainMenu,
  Menu,
  SideBar,
  SideBarMenu,
} from '../../../shared/models/models';
import {
  NavigationEnd,
  NavigationStart,
  Router,
  RouterLink,
  RouterModule,
} from '@angular/router';
import { CommonModule } from '@angular/common';
import { CommonService } from '../../../shared/services/common/common.service';
import { routes } from '../../../shared/routes/routes';
import { menu, subMenus } from '../../../shared/models/sidebar.model';
import { AuthService } from '../../../shared/services/common/auth.service';
import { distinctUntilChanged, Subscription } from 'rxjs';
// import { SettingService } from '../../../shared/services/common/setting.service';
import { DataService } from '../../../shared/services/common/data.service';
import { rolesBaseGuard } from '../../../shared/core/guards/roles-base.guard';
import { authGuard } from '../../../shared/core/guards/auth.guard';
import { ROUTE_REGISTRY } from '../../../app.routes';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit, OnDestroy{

  private sidebarLoadInProgress = false;

  base = '';
  page = '';
  last = '';
  public miniSidebar = false;
  public expandMenu = false;
  public mobileSidebar = false;
  layoutMode = '1';
  layoutWidth = '1';
  sidebarSize = '1';
  topbarColor = 'white';
  primaryColor = '1';
  withoutWrapperPagesArray = [
    'login',
    'login-2',
    'login-3',
    'register',
    'register-2',
    'register-3',
    'forgot-password',
    'forgot-password-2',
    'forgot-password-3',
    'reset-password',
    'reset-password-2',
    'reset-password-3',
    'email-verification',
    'email-verification-2',
    'email-verification-3',
    'two-step-verification',
    'two-step-verification-2',
    'two-step-verification-3',
    'success',
    'success-2',
    'success-3',
    'under-construction',
    'under-maintenance',
    'coming-soon',
    'lock-screen',
    'error-404',
    'error-500',
  ];
  withoutLayoutArray = [
    'layout-horizontal',
    'layout-hovered',
    'layout-detached',
    'layout-horizontal-overlay',
    'layout-horizontal-single',
    'layout-two-column',
    'layout-modern',
    'layout-without-header',
    'layout-vertical-transparent',
    'layout-horizontal-sidemenu',
    'layout-horizontal-box',
    'layout-dark',
    'layout-box',
    'layout-rtl',
  ];
  withoutWrapperPages: boolean | null = false;
  withoutLayouts: boolean | null = false;
  showPreloader = false;
  showPreloaderState = '';
  selectedColor = '84, 109, 254, 1';
  selectedColor1 = '84, 109, 254, 1';
  horizontalColor = '84, 109, 254, 1';
  dthemeColor = '84, 109, 254, 1';

  side_bar_data: SideBar[] = [];
  side_bar_data1: MainMenu[] = [];
  loggedUser: any;
  loggedRole: any;
  logoCompanyCode: any;
  roleBasedMenu: any;
  output1: any;
  filteredMenu: any;
  
  authSrv = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);
  
  menuItems: any;
  roleName: any;
  projectTypeName: any;
  logoprojectTypeName: any;
  roleId: any;
  distributionChannel: any;
  homeLink: string = '';
  
  // Subscriptions for cleanup
  private userSubscription?: Subscription;
  private sidebarSubscription?: Subscription;

  // Properties for submenu functionality
  showSubMenusTab = true;
  public multilevel: boolean[] = [false, false, false];
  openMenuItem: any = null;
  openSubmenuOneItem: any = null;
  public routes = routes;
  page1 = '';
  isOpen = false;
  isCollapsed = false;
  public submenus = false;

  constructor(
    private common: CommonService,
    // public settings: SettingService,
    private data: DataService,
    private sideBar: SideBarService,
    private router: Router,
  ) {
    this.setupCommonSubscriptions();
    this.setupSidebarSubscriptions();
    this.setupSettingsSubscriptions();
  }

  private setupCommonSubscriptions() {
    this.common.base.subscribe((res: string) => {
      this.base = res;
      this.withoutWrapperPages = this.withoutWrapperPagesArray.includes(this.base);
      this.withoutLayouts = this.withoutLayoutArray.includes(this.base);

      if (this.showPreloaderState === '1') {
        this.showPreloader = true;
        setTimeout(() => {
          this.showPreloader = false;
        }, 2000);
      } else {
        this.showPreloader = false;
      }
    });

    this.common.page.subscribe((res: string) => {
      this.page = res;
    });

    this.common.last.subscribe((res: string) => {
      this.last = res;
    });

    this.router.events.subscribe((event: object) => {
      if (event instanceof NavigationEnd) {
        const splitVal = event.url.split('/');
        this.base = splitVal[1];
        this.page = splitVal[2];
      }
    });
  }

  private setupSidebarSubscriptions() {
    // // Subscribe to sidebar data changes
    // this.sidebarSubscription = this.data.getSideBarData.subscribe((res: SideBar[]) => {
    //   console.log('Raw sidebar data received in sidebar component:', res);
      
    //   // ✅ FIX: Schedule update in next cycle instead of calling immediately
    //   setTimeout(() => {
    //     this.handleSidebarDataUpdate(res);
    //   });
    // });

    // Subscribe to sidebar data3
    this.data.getSideBarData3.subscribe((res: MainMenu[]) => {
      this.side_bar_data1 = res;
    });

    // Sidebar toggle subscriptions
    this.sideBar.toggleSideBar.subscribe((res: string) => {
      this.miniSidebar = res === 'true';
    });

    this.sideBar.toggleMobileSideBar.subscribe((res: string) => {
      this.mobileSidebar = res === 'true';
    });

    this.sideBar.expandSideBar.subscribe((res) => {
      this.expandMenu = res;
      setTimeout(() => {
        this.handleSidebarExpansion(res);
      });
    });

    this.data.collapse$.subscribe((collapse: boolean) => {
      this.isCollapsed = collapse;
    });
  }

  private setupSettingsSubscriptions() {
    // this.settings.isLoader.subscribe((res: string) => {
    //   this.showPreloaderState = res;
    // });

    // this.settings.layoutMode.subscribe((res: string) => {
    //   this.layoutMode = res;
    // });

    // this.settings.layoutWidth.subscribe((res: string) => {
    //   this.layoutWidth = res;
    // });

    // this.settings.sidebarSize.subscribe((res: string) => {
    //   this.sidebarSize = res;
    // });

    // this.settings.sidebarColor2.subscribe((res: string) => {
    //   this.selectedColor = res;
    // });

    // this.settings.topbarColor2.subscribe((res: string) => {
    //   this.topbarColor = res;
    // });

    // this.settings.topbarColor3.subscribe((res: string) => {
    //   this.selectedColor1 = res;
    // });

    // this.settings.topbarColor4.subscribe((res: string) => {
    //   this.horizontalColor = res;
    // });

    // this.settings.primaryColor1.subscribe((res: string) => {
    //   this.dthemeColor = res;
    // });
  }

  private handleSidebarDataUpdate(res: SideBar[]) {
    // Get current user details
    const currentUser = this.authSrv.userDetails;
    
    if (!currentUser) {
      console.log('No current user, clearing sidebar data');
      //this.side_bar_data = [];
      // ✅ REMOVED: cdr.detectChanges() - Let Angular handle it automatically
      return;
    }

    console.log('Processing sidebar data for user:', {
      roleName: currentUser.roleName,
      projectTypeName: currentUser.projectTypeName
    });

    // Create a deep copy to avoid mutating original data
    this.side_bar_data = JSON.parse(JSON.stringify(res));

    // Filter menu items based on current user's role and company
    this.side_bar_data = this.filterSidebarData(this.side_bar_data, currentUser);

    console.log('Filtered sidebar data:', this.side_bar_data);
    console.log('Total menu items after filtering:',
      this.side_bar_data.reduce((total, section) => total + (section.menu ? section.menu.length : 0), 0)
    );

    // Initialize submenu states after data is loaded
    this.initializeSubmenuStates();

    // ✅ REMOVED: Force change detection - Angular will handle this automatically
  }

  private filterSidebarData(sidebarData: SideBar[], currentUser: any): SideBar[] {
    return sidebarData.map((item) => {
      if (item.menu && Array.isArray(item.menu)) {
        item.menu = item.menu.filter((menuItem) => {
          // Only check projectTypeName (role check temporarily removed)
          if (menuItem.projectTypeName) {
            const hasProject = menuItem.projectTypeName.some((p: any) => 
              p.projectTypeName === currentUser.projectTypeName
            );
            if (!hasProject) {
              return false;
            }
          }

          // Filter submenus - only by projectTypeName
          if (menuItem.subMenus && Array.isArray(menuItem.subMenus)) {
            menuItem.subMenus = menuItem.subMenus.filter((subMenu: any) => {
              if (subMenu.projectTypeName) {
                return subMenu.projectTypeName.some((p: any) => 
                  p.projectTypeName === currentUser.projectTypeName
                );
              }
              return true;
            });
          }

          if (menuItem.showSubRoute === undefined) {
            menuItem.showSubRoute = false;
          }

          return true;
        });

        return { ...item, menu: item.menu };
      }
      return item;
    }).filter(item => !item.menu || item.menu.length > 0);
  }

  private initializeSubmenuStates() {
    // Initialize all submenu states
    this.side_bar_data.forEach((mainMenus: SideBar) => {
      if (mainMenus.menu) {
        mainMenus.menu.forEach((resMenu: SideBarMenu) => {
          // Initialize showSubRoute if not already set
          if (resMenu.showSubRoute === undefined) {
            resMenu.showSubRoute = false;
          }
        });
      }
    });
  }

  private handleSidebarExpansion(res: boolean) {
    if (res === false && this.miniSidebar === true) {
      this.side_bar_data.forEach((mainMenus) => {
        if (mainMenus.menu) {
          mainMenus.menu.forEach((resMenu) => {
            resMenu.showSubRoute = false;
          });
        }
      });
      // ✅ REMOVED: cdr.detectChanges()
    }

    if (res === true && this.miniSidebar === true) {
      this.side_bar_data.forEach((mainMenus) => {
        if (mainMenus.menu) {
          mainMenus.menu.forEach((resMenu) => {
            resMenu.showSubRoute = resMenu.menuValue === 'Dashboard';
          });
        }
      });
      // ✅ REMOVED: cdr.detectChanges()
    }
  }

  ngOnInit(): void {
    console.log('Sidebar component initialized');

  this.userSubscription = this.authSrv.user$.pipe(
  distinctUntilChanged((prev, curr) =>
    prev?.userId === curr?.userId &&
    prev?.roleId === curr?.roleId
  )
).subscribe((user) => {
    console.log('User updated in sidebar:', user);

    if (user) {
      this.roleId = user.roleId;
      this.logoprojectTypeName = user.projectTypeName;
      this.projectTypeName = user.projectTypeName;
      this.roleName = user.roleName;

      // if (this.roleId === 1 && this.projectTypeName === 'TR01') {
      //   this.homeLink = routes.trManagerDashboardComponent;
      // }

      console.log('Sidebar user data updated:', {
        roleId: this.roleId,
        projectTypeName: this.projectTypeName,
        homeLink: this.homeLink
      });

      // ✅ API call here
      this.loadSidebarMenus();
    } else {
      this.roleId = null;
      this.logoprojectTypeName = null;
      this.projectTypeName = null;
      this.roleName = null;
      this.homeLink = '';
      this.side_bar_data = [];
      this.sidebarLoadInProgress = false;
    }
  });

  this.data.sidebarReloadTrigger$.subscribe(() => {
  console.log('🔄 Sidebar reload triggered');
  this.sidebarLoadInProgress = false;  // ← guard reset 
  this.loadSidebarMenus();
});

  this.expandSubMenusActive();

  this.router.events.subscribe((event: object) => {
    if (event instanceof NavigationStart) {
      const splitVal = event.url.split('/');
      this.base = splitVal[1];
      this.page = splitVal[2];
      this.last = splitVal[3];
      this.page1 = splitVal[4];
    }
  });
  }

  // ===== SUBMENU METHODS - FIXED =====

  /**
   * Toggle main menu items and their submenus
   */
  public expandSubMenus(menu: SideBarMenu): void {
    console.log('Expanding submenu for:', menu.menuValue);
    
    // Find and toggle the clicked menu
    this.side_bar_data.forEach((mainMenus: SideBar) => {
      if (mainMenus.menu) {
        mainMenus.menu.forEach((resMenu: SideBarMenu) => {
          if (resMenu.menuValue === menu.menuValue) {
            // Toggle the clicked menu
            resMenu.showSubRoute = !resMenu.showSubRoute;
            console.log(`${menu.menuValue} submenu is now: ${resMenu.showSubRoute ? 'open' : 'closed'}`);
          } else {
            // Close other menus
            resMenu.showSubRoute = false;
          }
        });
      }
    });

    // ✅ REMOVED: Force change detection - Angular handles this
  }

  /**
   * Initialize default submenu states (expand Dashboard by default)
   */
  public expandSubMenusActive(): void {
    console.log('Setting default submenu states');
    
    this.side_bar_data.forEach((mainMenus: SideBar) => {
      if (mainMenus.menu) {
        mainMenus.menu.forEach((resMenu: SideBarMenu) => {
          // Expand Dashboard by default, close others
          resMenu.showSubRoute = resMenu.menuValue === 'Dashboard';
          console.log(`${resMenu.menuValue} default state: ${resMenu.showSubRoute ? 'open' : 'closed'}`);
        });
      }
    });

    // ✅ REMOVED: cdr.detectChanges()
  }

  /**
   * Check if a menu item has submenus
   */
  hasSubMenus(menuItem: SideBarMenu): boolean {
    return menuItem.subMenus && Array.isArray(menuItem.subMenus) && menuItem.subMenus.length > 0;
  }

  /**
   * Handle mobile menu toggle
   */
  public menuToggle() {
    this.showSubMenusTab = !this.showSubMenusTab;
    // ✅ REMOVED: cdr.detectChanges()
  }

  /**
   * Open/close mobile submenus
   */
  openSubmenus() {
    this.submenus = !this.submenus;
    // ✅ REMOVED: cdr.detectChanges()
  }

  /**
   * Handle general menu opening (for mobile)
   */
  openMenu(menu: any): void {
    if (this.openMenuItem === menu) {
      this.openMenuItem = null;
    } else {
      this.openMenuItem = menu;
    }
    // ✅ REMOVED: cdr.detectChanges()
  }

  /**
   * Handle submenu level 1 opening
   */
  openSubmenuOne(subMenus: any): void {
    if (this.openSubmenuOneItem === subMenus) {
      this.openSubmenuOneItem = null;
    } else {
      this.openSubmenuOneItem = subMenus;
    }
    // ✅ REMOVED: cdr.detectChanges()
  }

  // ===== SIDEBAR CONTROL METHODS =====

  public toggleSideBar(): void {
    this.sideBar.switchSideMenuPosition();
  }

  elem = document.documentElement;
  fullscreen() {
    if (!document.fullscreenElement) {
      this.elem.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }

  public togglesMobileSideBar(): void {
    this.sideBar.switchMobileSideBarPosition();
  }

  public miniSideBarMouseHover(position: string): void {
    this.sideBar.toggleSideBar.subscribe((res: string) => {
      if (res === 'true') {
        if (position === 'over') {
          this.sideBar.expandSideBar.next(true);
          this.showSubMenusTab = false;
        } else {
          this.sideBar.expandSideBar.next(false);
          this.showSubMenusTab = true;
        }
      }
    });
  }

  public miniSideBarMouseHover1(position: string): void {
    if (position === 'over') {
      this.sideBar.expandSideBar.next(true);
    } else {
      this.sideBar.expandSideBar.next(false);
    }
  }

  miniSideBarBlur(position: string) {
    if (position === 'over') {
      this.sideBar.expandSideBar.next(true);
    } else {
      this.sideBar.expandSideBar.next(false);
    }
  }

  miniSideBarFocus(position: string) {
    if (position === 'over') {
      this.sideBar.expandSideBar.next(true);
    } else {
      this.sideBar.expandSideBar.next(false);
    }
  }

  ngOnDestroy(): void {
    // Clean up subscriptions
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
    if (this.sidebarSubscription) {
      this.sidebarSubscription.unsubscribe();
    }
    
    this.data.resetData();
  }

  // ✅ ADD: Track by function for better performance
  trackByTittle(index: number, item: SideBar): any {
    return item.tittle || index;
  }

  trackByMenu(index: number, item: SideBarMenu): any {
    return item.menuValue || index;
  }

  trackBySubMenu(index: number, item: any): any {
    return item.route || item.menuValue || index;
  }

  loadSidebarMenus(): void {
  // Guard — prevent double API call
  if (this.sidebarLoadInProgress) {
    console.log('⚠ Sidebar load already in progress, skipping');
    return;
  }
  this.sidebarLoadInProgress = true;

  const currentUser = this.authSrv.userDetails;
  if (!currentUser) {
    console.warn('⚠ No logged in user found, sidebar API not called');
    this.side_bar_data = [];
    this.sidebarLoadInProgress = false;
    return;
  }

  const roleId        = Number(currentUser.roleId);
  const projectTypeId = Number(currentUser.projectTypeId);

  console.log('📤 GetSidebar Request Params:', { RoleId: roleId, ProjectTypeId: projectTypeId });

  this.sideBar.getSidebarMenus(roleId, projectTypeId).subscribe({
    next: (res: any) => {
      console.log('✅ GetSidebar API raw response:', res);

      let list: SideBar[] = Array.isArray(res)
        ? res
        : (res?.Data ?? res?.data ?? []);

      list = list.map((section: any) => ({
        ...section,
        menu: (section.menu || []).map((menuItem: any) => ({
          ...menuItem,
          route: menuItem.route ? '/' + menuItem.route : null,
          subMenus: (menuItem.subMenus || []).map((sub: any) => ({
            ...sub,
            route: sub.route ? '/' + sub.route : null
          }))
        }))
      }));

      this.side_bar_data = list;
      this.initializeSubmenuStates();
      this.sidebarLoadInProgress = false;   // ← reset on success
    },
    error: (err: any) => {
      console.error('❌ GetSidebar API error:', err);
      this.side_bar_data = [];
      this.sidebarLoadInProgress = false;   // ← reset on error
    }
  });
}

private registerDynamicRoutes(sidebarList: any[], projectTypeName: string): void {
  const permittedPaths = new Set<string>();

  sidebarList.forEach(section => {
    (section.menu || []).forEach((menuItem: any) => {
      if (menuItem.route) {
        permittedPaths.add(menuItem.route.replace(/^\//, ''));
      }
      (menuItem.subMenus || []).forEach((sub: any) => {
        if (sub.route) {
          permittedPaths.add(sub.route.replace(/^\//, ''));
        }
      });
    });
  });

  const dynamicChildren = [...permittedPaths]
    .filter(path => !!ROUTE_REGISTRY[path])
    .map(path => ({
      path,
      component: ROUTE_REGISTRY[path],
      canActivate: [authGuard, rolesBaseGuard],
      data: { projectTypeName: [projectTypeName] }
    }));

  const updatedRoutes = this.router.config.map(r =>
    r.path === '' && r.component !== undefined
      ? { ...r, children: dynamicChildren }
      : r
  );

  this.router.resetConfig(updatedRoutes);
  console.log(`✅ ${dynamicChildren.length} dynamic routes registered`);

  // ✅ Routes register ayaka navigate cheyyi
  const dashboardRouteMap: Record<string, string> = {
    'Scrapper':             '/scrDashboardComponent',
    'Trade Receivable':     '/trManagerDashboardComponent',
    'Unrecognised Invoice': '/unrecogmisedInventoryComponent',
    'Project Business':     '/pbDashboardComponent',
    'Fixed Asset':          '/faDashboardComponent',
  };

  const targetRoute = dashboardRouteMap[projectTypeName];
  if (targetRoute) {
    this.router.navigateByUrl(targetRoute);
  }
}
}