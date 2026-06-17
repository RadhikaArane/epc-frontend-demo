import { Component, inject, signal, WritableSignal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { TopNavComponent } from "../top-nav/top-nav.component";
import { SidebarComponent } from "../sidebar/sidebar.component";
import { FooterComponent } from "../footer/footer.component";
import { CommonModule } from '@angular/common';
import { CommonService } from '../../../shared/services/common/common.service'; 
import { SideBarService } from '../../../shared/services/common/sidebar.service';
import { AuthService } from '../../../shared/services/common/auth.service';
import { ConfirmationDialogComponent } from '../../common/confirmation-dialog/confirmation-dialog.component';
import { ToastComponent } from '../../common/toast/toast.component';
// import { SettingService } from '../../../shared/services/common/setting.service';
import { DataService } from '../../../shared/services/common/data.service';
import { OfflineNetworkComponent } from "../../common/offline-network/offline-network.component";


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet, CommonModule, TopNavComponent, SidebarComponent, FooterComponent, ConfirmationDialogComponent, ToastComponent, OfflineNetworkComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  base = '';
  page = '';
  last = '';
  layoutMode = '1';
  sidebarSize = '1';
  public miniSidebar = false;
  layoutWidth = '1';
  public expandMenu = false;
  public mobileSidebar = false;
  dthemeColor = '84, 109, 254, 1';
  selectedColor = '84, 109, 254, 1';
  selectedColor1 = '84, 109, 254, 1';
  horizontalColor = '84, 109, 254, 1';
  showPreloader = false;
  withoutWrapperPages: boolean | null = false;
  withoutLayouts: boolean | null = false;
  isCollapsed = false;
  topbarColor = 'white';
  primaryColor = '1';
  withoutWrapperPagesArray = ['login', 'login-2', 'login-3', 'register', 'register-2', 'register-3', 'forgot-password', 'forgot-password-2', 'forgot-password-3', 'reset-password', 'reset-password-2', 'reset-password-3', 'email-verification', 'email-verification-2', 'email-verification-3', 'two-step-verification', 'two-step-verification-2', 'two-step-verification-3', 'success', 'success-2', 'success-3', 'under-construction', 'under-maintenance', 'coming-soon', 'lock-screen', 'error-404', 'error-500'];
  withoutLayoutArray = ['layout-horizontal', 'layout-hovered', 'layout-detached', 'layout-horizontal-overlay',
    'layout-horizontal-single', 'layout-two-column', 'layout-modern', 'layout-without-header', 'layout-vertical-transparent',
    'layout-horizontal-sidemenu', 'layout-horizontal-box', 'layout-dark', 'layout-box', 'layout-rtl'
  ];

  showPreloaderState = '';

  loggedUser: any

  authSrv = inject(AuthService);



  constructor(
    private common: CommonService,
    // public settings: SettingService,
    private data: DataService,
    private sideBar: SideBarService,
  ) {
    this.loggedUser = this.authSrv.userDetails;


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
    this.sideBar.toggleSideBar.subscribe((res: string) => {
      if (res === 'true') {
        this.miniSidebar = true;
      } else {
        this.miniSidebar = false;
      }
    });

    this.sideBar.toggleMobileSideBar.subscribe((res: string) => {
      if (res == 'true' || res == 'true') {
        this.mobileSidebar = true;
      } else {
        this.mobileSidebar = false;
      }
    });
    this.sideBar.expandSideBar.subscribe((res) => {
      this.expandMenu = res;
      if (res == false && this.miniSidebar == true) {
        this.data.sideBar.map((mainMenus) => {
          mainMenus.menu.map((resMenu) => {
            resMenu.showSubRoute = false;
          });
        });
      }
      // if (res == true && this.miniSidebar == true) {
      //   this.data.sideBar.map((mainMenus) => {
      //     mainMenus.menu.map((resMenu) => {
      //       const menuValue = sessionStorage.getItem('menuValue');
      //       if (menuValue && menuValue == resMenu.menuValue) {
      //         resMenu.showSubRoute = true;
      //       } else {
      //         resMenu.showSubRoute = false;
      //       }
      //     });
      //   });
      // }
      if (res === true && this.miniSidebar === true) {
        this.data.sideBar.forEach((mainMenus) => {
          mainMenus.menu.forEach((resMenu) => {
            // Open Dashboard by default, or customize
            resMenu.showSubRoute = resMenu.menuValue === 'Dashboard';
          });
        });
      }

    });
  }
  //isCollapsed = false;
  ngOnInit() {
    this.data.collapse$.subscribe((collapse: boolean) => {
      this.isCollapsed = collapse;
    });
    this.showPreloader = true;
    setTimeout(() => {
      this.showPreloader = false;
    }, 1000);
  }



}
