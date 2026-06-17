import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink, Router, NavigationEnd } from '@angular/router';
import { SideBarService } from '../../../shared/services/common/sidebar.service';
import { MainMenu, Menu } from '../../../shared/models/models';
import { routes } from '../../../shared/routes/routes'; 
import { CommonService } from '../../../shared/services/common/common.service';
import { AuthService } from '../../../shared/services/common/auth.service';
import { Subscription } from 'rxjs'; 
import { CustomerModel } from '../../../shared/models/common-models/auth'; 
import { DataService } from '../../../shared/services/common/data.service'; 



@Component({
  selector: 'app-top-nav',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './top-nav.component.html',
  styleUrl: './top-nav.component.scss'
})

export class TopNavComponent implements OnInit {
  // Injected services
  private authSrv = inject(AuthService); 
  private cdr = inject(ChangeDetectorRef);
  private data = inject(DataService);
  private sideBar = inject(SideBarService);
  private common = inject(CommonService);
  private router = inject(Router); 

  // Routes
  public routes = routes; 

  // Signals for reactive state
  user = signal<CustomerModel | null>(null);
  notifications = signal<any[]>([]);
  maslCartItems = signal<any[]>([]);
  mhzpcCartItems = signal<any[]>([]);
  isCartVisible = signal<boolean>(false);

  // Computed properties
  isAuthenticated = computed(() => !!this.user());
  userName = computed(() => this.user()?.name || '');
  userEmail = computed(() => this.user()?.email || ''); 
  
   
  // Sidebar and navigation properties
  public miniSidebar = false;
  public showSubMenusTab = true;
  public multilevel: boolean[] = [false, false, false];
  openMenuItem: any = null;
  openSubmenuOneItem: any = null;
  base = 'dashboard';
  public page = '';
  last = '';
  side_bar_data: MainMenu[] = [];

  // Subscriptions
  private subscriptions: Subscription[] = []; 
   
 
  ngOnInit() {
    console.log("🔄 TopNav ngOnInit started"); 
    this.initializeComponent();
  }

  private initializeComponent() {
    this.subscribeToUser();
    // Setup navigation subscriptions
    this.setupNavigationSubscriptions();
    
    // Setup sidebar subscriptions
    this.setupSidebarSubscriptions(); 
  }

  private subscribeToUser() {
    const userSub = this.authSrv.user$.subscribe({
      next: (user) => {
        console.log("👤 User updateddddddddddddddddddddddddddddddddddddddd:", user);
        this.user.set(user); 
      },
      error: (error) => {
        console.error("❌ Error in user subscription:", error);
        this.user.set(null);
      }
    });
    
    this.subscriptions.push(userSub);
  }

  
 
  
  
 

  private setupNavigationSubscriptions() {
    const baseSub = this.common.base.subscribe((res: string) => {
      this.base = res;
    });
    
    const pageSub = this.common.page.subscribe((res: string) => {
      this.page = res;
      this.last = res;
    });
    
    const navigationSub = this.router.events.subscribe((event: object) => {
      if (event instanceof NavigationEnd) {
        const splitVal = event.url.split('/');
        this.base = splitVal[1];
        this.page = splitVal[2];
      }
    });
    
    this.subscriptions.push(baseSub, pageSub, navigationSub);
  }

  private setupSidebarSubscriptions() {
    const sidebarSub = this.sideBar.toggleSideBar.subscribe((res: string) => {
      this.miniSidebar = res === 'true';
    });
    
    const sidebarDataSub = this.data.getSideBarData3.subscribe((res: MainMenu[]) => {
      this.side_bar_data = res;
    });
    
    this.subscriptions.push(sidebarSub, sidebarDataSub);
  }

  // Template helper methods - these return the computed values
  getUserName(): string {
    return this.userName();
  }

  getUserEmail(): string {
    return this.userEmail();
  }

  isUserAuthenticated(): boolean {
    return this.isAuthenticated();
  }
  
  // Action methods
  logout() {
    console.log("🚪 Logout initiated");
    this.authSrv.logout();
  }

  

  public toggleSideBar(): void {
    this.sideBar.switchSideMenuPosition();
  }

  public togglesMobileSideBar(): void {
    this.sideBar.switchMobileSideBarPosition();
  }

  public menuToggle() {
    this.showSubMenusTab = !this.showSubMenusTab;
  }

  public expandSubMenus(menu: Menu): void {
    this.side_bar_data.map((mainMenus: MainMenu) => {
      mainMenus.menu.map((resMenu: Menu) => {
        if (resMenu.menuValue === menu.menuValue) {
          menu.showSubRoute = !menu.showSubRoute;
        } else {
          resMenu.showSubRoute = false;
        }
      });
    });
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

  fullscreen() {
    const elem = document.documentElement;
    if (!document.fullscreenElement) {
      elem.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }

  openMenu(menu: any): void {
    this.openMenuItem = this.openMenuItem === menu ? null : menu;
  }

  openSubmenuOne(subMenus: any): void {
    this.openSubmenuOneItem = this.openSubmenuOneItem === subMenus ? null : subMenus;
  }

  ngOnDestroy(): void {
    console.log("🧹 TopNav component destroying");
    
    // Unsubscribe from all subscriptions
    this.subscriptions.forEach(sub => {
      if (sub && !sub.closed) {
        sub.unsubscribe();
      }
    });
    
    console.log("✅ TopNav cleanup completed");
  }
}
