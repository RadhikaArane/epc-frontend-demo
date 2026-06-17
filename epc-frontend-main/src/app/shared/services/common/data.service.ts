import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  MainMenu,
  SideBar,
  SideBarMenu, apiResultFormat
} from '../../models/models';
import { routes } from '../../routes/routes';

@Injectable({
  providedIn: 'root',
})
export class DataService {

  public sidebarReloadTrigger$ = new Subject<void>();

  private collapseSubject = new BehaviorSubject<boolean>(false);
  collapse$ = this.collapseSubject.asObservable();

  toggleCollapse() {
    this.collapseSubject.next(!this.collapseSubject.value);
  }
  constructor(private http: HttpClient) { }
  public getDataTable(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/json/data-tables.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }

  public horizontalSidebar: MainMenu[] = [
  ];

  public getSideBarData3: BehaviorSubject<MainMenu[]> = new BehaviorSubject<
    MainMenu[]
  >(this.horizontalSidebar);

  public resetData3(): void {
    this.sideBar.map((res: SideBar) => {
      res.showAsTab = false;
      res.menu.map((menus: SideBarMenu) => {
        menus.showSubRoute = false;
      });
    });
  }


  //mahindra code

  public sideBar: SideBar[] = [

    {
      tittle: 'Main',
      icon: 'airplay',
      showAsTab: true,
      separateRoute: false,
      menu: 
      [


      //  //scrapper
      //   {
      //     menuValue: 'Dashboard',
      //     route: routes.scrDashboardComponent,
      //     hasSubRoute: false, // uncomment this to show menu in menu
      //     //hasSubRouteTwo: false,  // comment this to not show menu in menu
      //     showSubRoute: false,
      //     icon: 'smart-home',
      //     base: 'dashboard',
      //     materialicons: 'start',
      //     dot: false,
      //     subMenus: [],

      //     roles: [{ roleName: 'National Sales Head' }],
      //     projectTypeName: [{ projectTypeName: 'Scrapper' }]
      //   },
      //   {
      //     menuValue: 'Manage jobs',
      //     route: routes.scrapperMenuList,
      //     hasSubRouteTwo: true,
      //     showSubRoute: false,
      //     icon: 'cpu',
      //     base: 'orders',
      //     materialicons: 'dashboard',
      //     subMenus: [

      //       {
      //         menuValue: 'Run Jobs',
      //         hasSubRoute: true,
      //         showSubRoute: false,
      //         route: routes.scrRunJobsComponent,
      //         customSubmenuTwo: false,
      //         base: 'todo',
      //         roles: [{ roleName: 'National Sales Head' }],
      //         projectTypeName: [{ projectTypeName: 'Scrapper' }]

      //       },
      //       {
      //         menuValue: 'Job Status',
      //         hasSubRoute: true,
      //         showSubRoute: false,
      //         route: routes.scrJobStatusComponent,
      //         customSubmenuTwo: false,
      //         base: 'todo',
      //         roles: [{ roleName: 'National Sales Head' }],
      //         projectTypeName: [{ projectTypeName: 'Scrapper' }]
      //       },
      //       {
      //         menuValue: 'Manual Upload',
      //         hasSubRoute: true,
      //         showSubRoute: false,
      //         route: routes.scrManualUploadComponent,
      //         customSubmenuTwo: false,
      //         base: 'todo',
      //         roles: [{ roleName: 'National Sales Head' }],
      //         projectTypeName: [{ projectTypeName: 'Scrapper' }]
      //       },
      //     ],
      //     roles: [{ roleName: 'National Sales Head' }],
      //     projectTypeName: [{ projectTypeName: 'Scrapper' }]

      //   },
      //   {
      //     menuValue: 'Reports',
      //     route: routes.scrapperMenuList,
      //     hasSubRouteTwo: true,
      //     showSubRoute: false,
      //     icon: 'clipboard-data',
      //     base: 'orders',
      //     materialicons: 'dashboard',
      //     subMenus: [
      //       {
      //         menuValue: 'Show Data',
      //         hasSubRoute: true,
      //         showSubRoute: false,
      //         route: routes.urShowDataComponent,
      //         customSubmenuTwo: false,
      //         base: 'todo',
      //         roles: [{ roleName: 'National Sales Head' }],
      //         projectTypeName: [{ projectTypeName: 'Scrapper' }]
      //       },
      //     ],
      //     roles: [{ roleName: 'National Sales Head' }],
      //     projectTypeName: [{ projectTypeName: 'Scrapper' }]

      //   },
      //   {
      //     menuValue: 'Log Reports',
      //     route: routes.scrapperMenuList,
      //     hasSubRouteTwo: true,
      //     showSubRoute: false,
      //     icon: 'clipboard-data',
      //     base: 'orders',
      //     materialicons: 'dashboard',
      //     subMenus: [
      //       {
      //         menuValue: 'Scrapper Logs',
      //         hasSubRoute: true,
      //         showSubRoute: false,
      //         route: routes.scrapperLogsComponent,
      //         customSubmenuTwo: false,
      //         base: 'todo',
      //         roles: [{ roleName: 'National Sales Head' }],
      //         projectTypeName: [{ projectTypeName: 'Scrapper' }]
      //       },
      //       {
      //         menuValue: 'User Logs',
      //         hasSubRoute: true,
      //         showSubRoute: false,
      //         route: routes.scrUserLogsComponent,
      //         customSubmenuTwo: false,
      //         base: 'todo',
      //         roles: [{ roleName: 'National Sales Head' }],
      //         projectTypeName: [{ projectTypeName: 'Scrapper' }]
      //       },
      //       // {
      //       //   menuValue: 'State Portals',
      //       //   hasSubRoute: true,
      //       //   showSubRoute: false,
      //       //   route: routes.scrStatePortalsComponent,
      //       //   customSubmenuTwo: false,
      //       //   base: 'todo',
      //       //   roles: [{ roleName: 'National Sales Head' }],
      //       //   projectTypeName: [{ projectTypeName: 'Scrapper' }]
      //       // },
      //       // {
      //       //   menuValue: 'All Logs',
      //       //   hasSubRoute: true,
      //       //   showSubRoute: false,
      //       //   route: routes.scrAllLogsComponent,
      //       //   customSubmenuTwo: false,
      //       //   base: 'todo',
      //       //   roles: [{ roleName: 'National Sales Head' }],
      //       //   projectTypeName: [{ projectTypeName: 'Scrapper' }]
      //       // },


      //     ],
      //     roles: [{ roleName: 'National Sales Head' }],
      //     projectTypeName: [{ projectTypeName: 'Scrapper' }]

      //   },
      //   {
      //     menuValue: 'Add Sidebar Menu',
      //     route: routes.addSidebarMenuComponent,
      //     hasSubRoute: false, // uncomment this to show menu in menu
      //     //hasSubRouteTwo: false,  // comment this to not show menu in menu
      //     showSubRoute: false,
      //     icon: 'settings-2',
      //     base: 'dashboard',
      //     materialicons: 'start',
      //     dot: false,
      //     subMenus: [],

      //     roles: [{ roleName: 'National Sales Head' }],
      //     projectTypeName: [{ projectTypeName: 'Scrapper' }]
      //   },
      //   {
      //     menuValue: 'Side Menu Access',
      //     route: routes.sideMenuAccessComponent,
      //     hasSubRoute: false, // uncomment this to show menu in menu
      //     //hasSubRouteTwo: false,  // comment this to not show menu in menu
      //     showSubRoute: false,
      //     icon: 'user-shield',
      //     base: 'dashboard',
      //     materialicons: 'start',
      //     dot: false,
      //     subMenus: [],

      //     roles: [{ roleName: 'National Sales Head' }],
      //     projectTypeName: [{ projectTypeName: 'Scrapper' }]
      //   },










      //   //trade

      //   {
      //     menuValue: 'Dashboard',
      //     route: routes.trManagerDashboardComponent,
      //     hasSubRoute: false, // uncomment this to show menu in menu
      //     //hasSubRouteTwo: false,  // comment this to not show menu in menu
      //     showSubRoute: false,
      //     icon: 'smart-home',
      //     base: 'dashboard',
      //     materialicons: 'start',
      //     dot: false,
      //     subMenus: [],

      //     roles: [{ roleName: 'National Sales Head' }],
      //     projectTypeName: [{ projectTypeName: 'Trade Receivable' }]
      //   },
        
      //   // {
      //   //   menuValue: 'Manage Data',
      //   //   route: routes.tradeMenuList,
      //   //   hasSubRouteTwo: true,
      //   //   showSubRoute: false,
      //   //   icon: 'database',
      //   //   base: 'orders',
      //   //   materialicons: 'dashboard',
      //   //   subMenus: [
      //   //     {
      //   //       menuValue: 'User Master',
      //   //       hasSubRoute: true,
      //   //       showSubRoute: false,
      //   //       route: routes.tRUserMasterComponent,
      //   //       customSubmenuTwo: false,
      //   //       base: 'todo',
      //   //       roles: [{ roleName: 'National Sales Head' }],
      //   //       projectTypeName: [{ projectTypeName: 'Trade Receivable' }]
      //   //     },
      //   //   ],
      //   //   roles: [{ roleName: 'National Sales Head' }],
      //   //   projectTypeName: [{ projectTypeName: 'Trade Receivable' }]

      //   // },

      //   {
      //     menuValue: 'Manage Revenue Recognition',
      //     route: routes.tradeMenuList,
      //     hasSubRouteTwo: true,
      //     showSubRoute: false,
      //     icon: 'graph',
      //     base: 'orders',
      //     materialicons: 'dashboard',
      //     subMenus: [
      //       // {
      //       //   menuValue: 'Upload',
      //       //   hasSubRoute: true,
      //       //   showSubRoute: false,
      //       //   route: routes.trUploadComponent,
      //       //   customSubmenuTwo: false,
      //       //   base: 'todo',
      //       //   roles: [{ roleName: 'National Sales Head' }],
      //       //   projectTypeName: [{ projectTypeName: 'Trade Receivable' }]
      //       // },
      //       {
      //         menuValue: 'Sales',
      //         hasSubRoute: true,
      //         showSubRoute: false,
      //         route: routes.trSalesNov2025Component,
      //         customSubmenuTwo: false,
      //         base: 'todo',
      //         roles: [{ roleName: 'National Sales Head' }],
      //         projectTypeName: [{ projectTypeName: 'Trade Receivable' }]
      //       },
      //       {
      //         menuValue: 'Projects RR',
      //         hasSubRoute: true,
      //         showSubRoute: false,
      //         route: routes.trProjectsRrComponent,
      //         customSubmenuTwo: false,
      //         base: 'todo',
      //         roles: [{ roleName: 'National Sales Head' }],
      //         projectTypeName: [{ projectTypeName: 'Trade Receivable' }]
      //       },
      //       {
      //         menuValue: 'Grouping Sales',
      //         hasSubRoute: true,
      //         showSubRoute: false,
      //         route: routes.trGroupingSaleComponent,
      //         customSubmenuTwo: false,
      //         base: 'todo',
      //         roles: [{ roleName: 'National Sales Head' }],
      //         projectTypeName: [{ projectTypeName: 'Trade Receivable' }]
      //       },
      //       {
      //         menuValue: 'Projects',
      //         hasSubRoute: true,
      //         showSubRoute: false,
      //         route: routes.trProjectsComponent,
      //         customSubmenuTwo: false,
      //         base: 'todo',
      //         roles: [{ roleName: 'National Sales Head' }],
      //         projectTypeName: [{ projectTypeName: 'Trade Receivable' }]
      //       },
      //       // {
      //       //   menuValue: 'Rough Summary',
      //       //   hasSubRoute: true,
      //       //   showSubRoute: false,
      //       //   route: routes.trRoughSummaryComponent,
      //       //   customSubmenuTwo: false,
      //       //   base: 'todo',
      //       //   roles: [{ roleName: 'National Sales Head' }],
      //       //   projectTypeName: [{ projectTypeName: 'Trade Receivable' }]
      //       // },
      //       {
      //         menuValue: 'Final Summary',
      //         hasSubRoute: true,
      //         showSubRoute: false,
      //         route: routes.trFinalSummaryComponent,
      //         customSubmenuTwo: false,
      //         base: 'todo',
      //         roles: [{ roleName: 'National Sales Head' }],
      //         projectTypeName: [{ projectTypeName: 'Trade Receivable' }]
      //       },
      //       {
      //         menuValue: 'Secondary Discount',
      //         hasSubRoute: true,
      //         showSubRoute: false,
      //         route: routes.trSecondaryDiscountComponent,
      //         customSubmenuTwo: false,
      //         base: 'todo',
      //         roles: [{ roleName: 'National Sales Head' }],
      //         projectTypeName: [{ projectTypeName: 'Trade Receivable' }]
      //       },
      //       {
      //         menuValue: 'Entries',
      //         hasSubRoute: true,
      //         showSubRoute: false,
      //         route: routes.trEntriesComponent,
      //         customSubmenuTwo: false,
      //         base: 'todo',
      //         roles: [{ roleName: 'National Sales Head' }],
      //         projectTypeName: [{ projectTypeName: 'Trade Receivable' }]
      //       },


      //     ],
      //     roles: [{ roleName: 'National Sales Head' }],
      //     projectTypeName: [{ projectTypeName: 'Trade Receivable' }]

      //   },

      //   {
      //     menuValue: 'Manage Receivables',
      //     route: routes.tradeMenuList,
      //     hasSubRouteTwo: true,
      //     showSubRoute: false,
      //     icon: 'files',
      //     base: 'orders',
      //     materialicons: 'dashboard',
      //     subMenus: [
      //       {
      //         menuValue: 'Credit',
      //         hasSubRoute: true,
      //         showSubRoute: false,
      //         route: routes.creditReportComponent,
      //         customSubmenuTwo: false,
      //         base: 'todo',
      //         roles: [{ roleName: 'National Sales Head' }],
      //         projectTypeName: [{ projectTypeName: 'Trade Receivable' }]
      //       },
      //       {
      //         menuValue: 'Debit',
      //         hasSubRoute: true,
      //         showSubRoute: false,
      //         route: routes.debitReportComponent,
      //         customSubmenuTwo: false,
      //         base: 'todo',
      //         roles: [{ roleName: 'National Sales Head' }],
      //         projectTypeName: [{ projectTypeName: 'Trade Receivable' }]
      //       },
      //       // {
      //       //   menuValue: 'Working Sheet',
      //       //   hasSubRoute: true,
      //       //   showSubRoute: false,
      //       //   route: routes.trWorkingSheetComponent,
      //       //   customSubmenuTwo: false,
      //       //   base: 'todo',
      //       //   roles: [{ roleName: 'National Sales Head' }],
      //       //   projectTypeName: [{ projectTypeName: 'Trade Receivable' }]
      //       // }, 
      //       // {
      //       //   menuValue: 'Historical Reports',
      //       //   hasSubRoute: true,
      //       //   showSubRoute: false,
      //       //   route: routes.trHistoricalReportsComponent,
      //       //   customSubmenuTwo: false,
      //       //   base: 'todo',
      //       //   roles: [{ roleName: 'National Sales Head' }],
      //       //   projectTypeName: [{ projectTypeName: 'Trade Receivable' }]
      //       // },
      //       {
      //         menuValue: 'One Line Summary',
      //         hasSubRoute: true,
      //         showSubRoute: false,
      //         route: routes.trOneLineSummaryComponent,
      //         customSubmenuTwo: false,
      //         base: 'todo',
      //         roles: [{ roleName: 'National Sales Head' }],
      //         projectTypeName: [{ projectTypeName: 'Trade Receivable' }]
      //       },
      //     ],
      //     roles: [{ roleName: 'National Sales Head' }],
      //     projectTypeName: [{ projectTypeName: 'Trade Receivable' }]

      //   },

      //   {
      //     menuValue: 'Stage Master',
      //     route: routes.trStageMasterComponent,
      //     hasSubRoute: false,
      //     showSubRoute: false,
      //     icon: 'file-spreadsheet',
      //     base: 'dashboard',
      //     materialicons: 'start',
      //     dot: false,
      //     subMenus: [],
      //     roles: [{ roleName: 'National Sales Head' }],
      //     projectTypeName: [{ projectTypeName: 'Trade Receivable' }]

      //   },

      //   {
      //     menuValue: 'Head Office Review',
      //     route: routes.tradeMenuList,
      //     hasSubRouteTwo: true,
      //     showSubRoute: false,
      //     icon: 'clipboard-check',
      //     base: 'orders',
      //     materialicons: 'dashboard',
      //     subMenus: [
      //       {
      //         menuValue: 'PM Comparison',
      //         hasSubRoute: true,
      //         showSubRoute: false,
      //         route: routes.trPmComparisonComponent,
      //         customSubmenuTwo: false,
      //         base: 'todo',
      //         roles: [{ roleName: 'National Sales Head' }],
      //         projectTypeName: [{ projectTypeName: 'Trade Receivable' }]
      //       },
      //       {
      //         menuValue: 'Open Comparison',
      //         hasSubRoute: true,
      //         showSubRoute: false,
      //         route: routes.trOpenComparisonComponent,
      //         customSubmenuTwo: false,
      //         base: 'todo',
      //         roles: [{ roleName: 'National Sales Head' }],
      //         projectTypeName: [{ projectTypeName: 'Trade Receivable' }]
      //       },
      //       // {
      //       //   menuValue: 'PM Ageing',
      //       //   hasSubRoute: true,
      //       //   showSubRoute: false,
      //       //   route: routes.trPmAgeingComponent,
      //       //   customSubmenuTwo: false,
      //       //   base: 'todo',
      //       //   roles: [{ roleName: 'National Sales Head' }],
      //       //   projectTypeName: [{ projectTypeName: 'Trade Receivable' }]
      //       // },
      //       {
      //         menuValue: 'Project Market',
      //         hasSubRoute: true,
      //         showSubRoute: false,
      //         route: routes.trProjectMarketComponent,
      //         customSubmenuTwo: false,
      //         base: 'todo',
      //         roles: [{ roleName: 'National Sales Head' }],
      //         projectTypeName: [{ projectTypeName: 'Trade Receivable' }]
      //       },
      //        {
      //         menuValue: 'Open Market',
      //         hasSubRoute: true,
      //         showSubRoute: false,
      //         route: routes.trOpenMarketComponent,
      //         customSubmenuTwo: false,
      //         base: 'todo',
      //         roles: [{ roleName: 'National Sales Head' }],
      //         projectTypeName: [{ projectTypeName: 'Trade Receivable' }]
      //       },
      //       //  {
      //       //   menuValue: 'Query Data',
      //       //   hasSubRoute: true,
      //       //   showSubRoute: false,
      //       //   route: routes.trQueryDataComponent,
      //       //   customSubmenuTwo: false,
      //       //   base: 'todo',
      //       //   roles: [{ roleName: 'National Sales Head' }],
      //       //   projectTypeName: [{ projectTypeName: 'Trade Receivable' }]
      //       // },
      //        {
      //         menuValue: 'Project Market Addition',
      //         hasSubRoute: true,
      //         showSubRoute: false,
      //         route: routes.trProjectMarketAditionalComponent,
      //         customSubmenuTwo: false,
      //         base: 'todo',
      //         roles: [{ roleName: 'National Sales Head' }],
      //         projectTypeName: [{ projectTypeName: 'Trade Receivable' }]
      //       },
      //        {
      //         menuValue: 'Open Additional',
      //         hasSubRoute: true,
      //         showSubRoute: false,
      //         route: routes.trOpenAdditionalComponent,
      //         customSubmenuTwo: false,
      //         base: 'todo',
      //         roles: [{ roleName: 'National Sales Head' }],
      //         projectTypeName: [{ projectTypeName: 'Trade Receivable' }]
      //       },
      //        {
      //         menuValue: 'Institutional',
      //         hasSubRoute: true,
      //         showSubRoute: false,
      //         route: routes.trInstitutionalComponent,
      //         customSubmenuTwo: false,
      //         base: 'todo',
      //         roles: [{ roleName: 'National Sales Head' }],
      //         projectTypeName: [{ projectTypeName: 'Trade Receivable' }]
      //       },
      //       //  {
      //       //   menuValue: 'Additional Add Open Market',
      //       //   hasSubRoute: true,
      //       //   showSubRoute: false,
      //       //   route: routes.trAdditionalPddOpenMarketComponent,
      //       //   customSubmenuTwo: false,
      //       //   base: 'todo',
      //       //   roles: [{ roleName: 'National Sales Head' }],
      //       //   projectTypeName: [{ projectTypeName: 'Trade Receivable' }]
      //       // },
      //        {
      //         menuValue: 'Collection',
      //         hasSubRoute: true,
      //         showSubRoute: false,
      //         route: routes.trCollectionComponent,
      //         customSubmenuTwo: false,
      //         base: 'todo',
      //         roles: [{ roleName: 'National Sales Head' }],
      //         projectTypeName: [{ projectTypeName: 'Trade Receivable' }]
      //       },
      //        {
      //         menuValue: 'Sales',
      //         hasSubRoute: true,
      //         showSubRoute: false,
      //         route: routes.trSalesComponent,
      //         customSubmenuTwo: false,
      //         base: 'todo',
      //         roles: [{ roleName: 'National Sales Head' }],
      //         projectTypeName: [{ projectTypeName: 'Trade Receivable' }]
      //       },
            
      //     ],
      //     roles: [{ roleName: 'National Sales Head' }],
      //     projectTypeName: [{ projectTypeName: 'Trade Receivable' }]

      //   },

        

      //   // {
      //   //   menuValue: 'customerOutstandingComponent',
      //   //   route: routes.customerOutstandingComponent,
      //   //   hasSubRoute: false, // uncomment this to show menu in menu
      //   //   //hasSubRouteTwo: false,  // comment this to not show menu in menu
      //   //   showSubRoute: false,
      //   //   icon: 'clock',
      //   //   base: 'dashboard',
      //   //   materialicons: 'start',
      //   //   dot: false,
      //   //   subMenus: [],

      //   //   roles: [{ roleName: 'National Sales Head' }],
      //   //   projectTypeName: [{ projectTypeName: 'Trade Receivable' }]
      //   // },
      //   {
      //     menuValue: 'Upload Center',
      //     route: routes.tradeMenuList,
      //     hasSubRouteTwo: true,
      //     showSubRoute: false,
      //     icon: 'cloud-upload',
      //     base: 'orders',
      //     materialicons: 'dashboard',
      //     subMenus: [
      //       {
      //         menuValue: 'Upload Revenue Recognition',
      //         hasSubRoute: true,
      //         showSubRoute: false,
      //         route: routes.trUploadComponent,
      //         customSubmenuTwo: false,
      //         base: 'todo',
      //         roles: [{ roleName: 'National Sales Head' }],
      //         projectTypeName: [{ projectTypeName: 'Trade Receivable' }]
      //       },
      //       {
      //         menuValue: 'Upload Receivable',
      //         hasSubRoute: true,
      //         showSubRoute: false,
      //         route: routes.trUploadSapFilesComponent,
      //         customSubmenuTwo: false,
      //         base: 'todo',
      //         roles: [{ roleName: 'National Sales Head' }],
      //         projectTypeName: [{ projectTypeName: 'Trade Receivable' }]
      //       },
      //        {
      //         menuValue: 'Upload Collections',
      //         hasSubRoute: true,
      //         showSubRoute: false,
      //         route: routes.trUploadCollectionsComponent,
      //         customSubmenuTwo: false,
      //         base: 'todo',
      //         roles: [{ roleName: 'National Sales Head' }],
      //         projectTypeName: [{ projectTypeName: 'Trade Receivable' }]
      //       },

      //     ],
      //     roles: [{ roleName: 'National Sales Head' }],
      //     projectTypeName: [{ projectTypeName: 'Trade Receivable' }]

      //   },
      //   {
      //     menuValue: 'Log Reports',
      //     route: routes.tradeMenuList,
      //     hasSubRouteTwo: true,
      //     showSubRoute: false,
      //     icon: 'clipboard-data',
      //     base: 'orders',
      //     materialicons: 'dashboard',
      //     subMenus: [
      //       {
      //         menuValue: 'SAP Dump Logs',
      //         hasSubRoute: true,
      //         showSubRoute: false,
      //         route: routes.trSapDumpLogComponent,
      //         customSubmenuTwo: false,
      //         base: 'todo',
      //         roles: [{ roleName: 'National Sales Head' }],
      //         projectTypeName: [{ projectTypeName: 'Trade Receivable' }]
      //       },
      //       {
      //         menuValue: 'User Logs',
      //         hasSubRoute: true,
      //         showSubRoute: false,
      //         route: routes.trUserLogComponent,
      //         customSubmenuTwo: false,
      //         base: 'todo',
      //         roles: [{ roleName: 'National Sales Head' }],
      //         projectTypeName: [{ projectTypeName: 'Trade Receivable' }]
      //       },
      //     ],
      //     roles: [{ roleName: 'National Sales Head' }],
      //     projectTypeName: [{ projectTypeName: 'Trade Receivable' }]

      //   },









      //   //Unrecognised 
      //   {
      //     menuValue: 'Unrecognised Invoices',
      //     route: routes.unrecogmisedInventoryComponent,
      //     hasSubRoute: false, // uncomment this to show menu in menu
      //     //hasSubRouteTwo: false,  // comment this to not show menu in menu
      //     showSubRoute: false,
      //     icon: 'smart-home',
      //     base: 'dashboard',
      //     materialicons: 'start',
      //     dot: false,
      //     subMenus: [],
      //     roles: [{ roleName: 'National Sales Head' }],
      //     projectTypeName: [{ projectTypeName: 'Unrecognised Invoice' }]
      //   },
      //   {
      //     menuValue: 'Consignment Stock',
      //     route: routes.unrecognisedRevenueComponent,
      //     hasSubRoute: false, // uncomment this to show menu in menu
      //     //hasSubRouteTwo: false,  // comment this to not show menu in menu
      //     showSubRoute: false,
      //     icon: 'file-spreadsheet',
      //     base: 'dashboard',
      //     materialicons: 'start',
      //     dot: false,
      //     subMenus: [],
      //     roles: [{ roleName: 'National Sales Head' }, { roleName: 'Zonal Manager' }],
      //     projectTypeName: [{ projectTypeName: 'Unrecognised Invoice' }]
      //   },

      //   {
      //     menuValue: 'Manage Data',
      //     route: routes.unrecognisedMenuList,
      //     hasSubRouteTwo: true,
      //     showSubRoute: false,
      //     icon: 'inbox',
      //     base: 'orders',
      //     materialicons: 'dashboard',
      //     subMenus: [
      //       {
      //         menuValue: 'Dealer Master',
      //         hasSubRoute: true,
      //         showSubRoute: false,
      //         route: routes.urDealerMasterComponent,
      //         customSubmenuTwo: false,
      //         base: 'todo',
      //         roles: [{ roleName: 'National Sales Head' }, { roleName: 'Zonal Manager' }],
      //         projectTypeName: [{ projectTypeName: 'Unrecognised Invoice' }]
      //       },
      //       {
      //         menuValue: 'User Master',
      //         hasSubRoute: true,
      //         showSubRoute: false,
      //         route: routes.urUserMasterComponent,
      //         customSubmenuTwo: false,
      //         base: 'todo',
      //         roles: [{ roleName: 'National Sales Head' }, { roleName: 'Zonal Manager' }],
      //         projectTypeName: [{ projectTypeName: 'Unrecognised Invoice' }]
      //       },
      //       {
      //         menuValue: 'Stage Master',
      //         hasSubRoute: true,
      //         showSubRoute: false,
      //         route: routes.urStageMasterComponent,
      //         customSubmenuTwo: false,
      //         base: 'todo',
      //         roles: [{ roleName: 'National Sales Head' }, { roleName: 'Zonal Manager' }],
      //         projectTypeName: [{ projectTypeName: 'Unrecognised Invoice' }]
      //       },
      //       {
      //         menuValue: 'State Factor',
      //         hasSubRoute: true,
      //         showSubRoute: false,
      //         route: routes.urStateFactorComponent,
      //         customSubmenuTwo: false,
      //         base: 'todo',
      //         roles: [{ roleName: 'National Sales Head' }, { roleName: 'Zonal Manager' }],
      //         projectTypeName: [{ projectTypeName: 'Unrecognised Invoice' }]
      //       },
      //     ],
      //     roles: [{ roleName: 'National Sales Head' }, { roleName: 'Zonal Manager' }],
      //     projectTypeName: [{ projectTypeName: 'Unrecognised Invoice' }]

      //   },

      //   {
      //     menuValue: 'Upload Center',
      //     route: routes.unrecognisedMenuList,
      //     hasSubRouteTwo: true,
      //     showSubRoute: false,
      //     icon: 'upload',
      //     base: 'orders',
      //     materialicons: 'dashboard',
      //     subMenus: [
      //       {
      //         menuValue: 'Upload',
      //         hasSubRoute: true,
      //         showSubRoute: false,
      //         route: routes.urUploadComponent,
      //         customSubmenuTwo: false,
      //         base: 'todo',
      //         roles: [{ roleName: 'National Sales Head' }, { roleName: 'Zonal Manager' }],
      //         projectTypeName: [{ projectTypeName: 'Unrecognised Invoice' }]
      //       },
      //       {
      //         menuValue: 'Logs',
      //         hasSubRoute: true,
      //         showSubRoute: false,
      //         route: routes.UrLogsComponent,
      //         customSubmenuTwo: false,
      //         base: 'todo',
      //         roles: [{ roleName: 'National Sales Head' }],
      //         projectTypeName: [{ projectTypeName: 'Unrecognised Invoice' }]
      //       },
      //       {
      //         menuValue: 'Download Uploaded File',
      //         hasSubRoute: true,
      //         showSubRoute: false,
      //         route: routes.DownloadUploadedFileComponent,
      //         customSubmenuTwo: false,
      //         base: 'todo',
      //         roles: [{ roleName: 'National Sales Head' }],
      //         projectTypeName: [{ projectTypeName: 'Unrecognised Invoice' }]
      //       },
      //     ],
      //     roles: [{ roleName: 'National Sales Head' }, { roleName: 'Zonal Manager' }],
      //     projectTypeName: [{ projectTypeName: 'Unrecognised Invoice' }]

      //   },
      //   {
      //     menuValue: 'Reports',
      //     route: routes.unrecognisedMenuList,
      //     hasSubRouteTwo: true,
      //     showSubRoute: false,
      //     icon: 'clipboard-data',
      //     base: 'orders',
      //     materialicons: 'dashboard',
      //     subMenus: [
      //       // {
      //       //   menuValue: 'Remarks',
      //       //   hasSubRoute: true,
      //       //   showSubRoute: false,
      //       //   route: routes.urRemarksComponent,
      //       //   customSubmenuTwo: false,
      //       //   base: 'todo',
      //       //   roles: [{ roleName: 'National Sales Head' }, { roleName: 'Zonal Manager' }],
      //       //   projectTypeName: [{ projectTypeName: 'Unrecognised Invoice' }]
      //       // },
      //       {
      //         menuValue: 'Remarks Master',
      //         hasSubRoute: true,
      //         showSubRoute: false,
      //         route: routes.urRemarksMasterComponent,
      //         customSubmenuTwo: false,
      //         base: 'todo',
      //         roles: [{ roleName: 'National Sales Head' }, { roleName: 'Zonal Manager' }],
      //         projectTypeName: [{ projectTypeName: 'Unrecognised Invoice' }]
      //       },
      //       {
      //         menuValue: 'Audit logs',
      //         hasSubRoute: true,
      //         showSubRoute: false,
      //         route: routes.urAuditLogsComponent,
      //         customSubmenuTwo: false,
      //         base: 'todo',
      //         roles: [{ roleName: 'National Sales Head' }, { roleName: 'Zonal Manager' }],
      //         projectTypeName: [{ projectTypeName: 'Unrecognised Invoice' }]
      //       },
      //       {
      //         menuValue: 'User logs',
      //         hasSubRoute: true,
      //         showSubRoute: false,
      //         route: routes.urUsersLogsComponent,
      //         customSubmenuTwo: false,
      //         base: 'todo',
      //         roles: [{ roleName: 'National Sales Head' }, { roleName: 'Zonal Manager' }],
      //         projectTypeName: [{ projectTypeName: 'Unrecognised Invoice' }]
      //       }
      //     ],
      //     roles: [{ roleName: 'National Sales Head' }, { roleName: 'Zonal Manager' }],
      //     projectTypeName: [{ projectTypeName: 'Unrecognised Invoice' }]

      //   },























      //   //project business


      //   {
      //     menuValue: 'Dashboard',
      //     route: routes.pbDashboardComponent,
      //     hasSubRoute: false,
      //     showSubRoute: false,
      //     icon: 'smart-home',
      //     base: 'dashboard',
      //     materialicons: 'start',
      //     dot: false,
      //     subMenus: [],
      //     roles: [{ roleName: 'National Sales Head' }],
      //     projectTypeName: [{ projectTypeName: 'Project Business' }]
      //   },
      //  {
      //     menuValue: 'Project Master',
      //     route: routes.projectBMenuList,
      //     hasSubRouteTwo: true,
      //     showSubRoute: false,
      //     icon: 'folder',
      //     base: 'orders',
      //     materialicons: 'dashboard',
      //     subMenus: [
      //       {
      //         menuValue: 'Manage Project',
      //         hasSubRoute: true,
      //         showSubRoute: false,
      //         route: routes.pbProjectManagementComponent,
      //         customSubmenuTwo: false,
      //         base: 'todo',
      //         roles: [{ roleName: 'National Sales Head' }],
      //         projectTypeName: [{ projectTypeName: 'Project Business' }]
      //       },
      //       {
      //         menuValue: 'Cost Estimation/ Incurred',
      //         hasSubRoute: true,
      //         showSubRoute: false,
      //         route: routes.pbCostEstimationComponent,
      //         customSubmenuTwo: false,
      //         base: 'todo',
      //         roles: [{ roleName: 'National Sales Head' }],
      //         projectTypeName: [{ projectTypeName: 'Project Business' }]
      //       },
      //       {
      //         menuValue: 'FTM Entries',
      //         hasSubRoute: true,
      //         showSubRoute: false,
      //         route: routes.pbFtmEntriesComponent,
      //         customSubmenuTwo: false,
      //         base: 'todo',
      //         roles: [{ roleName: 'National Sales Head' }],
      //         projectTypeName: [{ projectTypeName: 'Project Business' }]
      //       },
      //       {
      //         menuValue: 'Unrecognised Projects',
      //         hasSubRoute: true,
      //         showSubRoute: false,
      //         route: routes.pbUnrecognisedProjectsComponent,
      //         customSubmenuTwo: false,
      //         base: 'todo',
      //         roles: [{ roleName: 'National Sales Head' }],
      //         projectTypeName: [{ projectTypeName: 'Project Business' }]
      //       },
      //     ],
      //     roles: [{ roleName: 'National Sales Head' }],
      //     projectTypeName: [{ projectTypeName: 'Project Business' }]
      //   },
      //   {
      //     menuValue: 'Manage Data',
      //     route: routes.projectBMenuList,
      //     hasSubRouteTwo: true,
      //     showSubRoute: false,
      //     icon: 'database',
      //     base: 'orders',
      //     materialicons: 'dashboard',
      //     subMenus: [
      //       {
      //         menuValue: 'Manage Vendor',
      //         hasSubRoute: true,
      //         showSubRoute: false,
      //         route: routes.pbManageVendorComponent,
      //         customSubmenuTwo: false,
      //         base: 'todo',
      //         roles: [{ roleName: 'National Sales Head' }],
      //         projectTypeName: [{ projectTypeName: 'Project Business' }]
      //       },
      //       {
      //         menuValue: 'Manage Expense Head',
      //         hasSubRoute: true,
      //         showSubRoute: false,
      //         route: routes.pbManageExpenseHeadComponent,
      //         customSubmenuTwo: false,
      //         base: 'todo',
      //         roles: [{ roleName: 'National Sales Head' }],
      //         projectTypeName: [{ projectTypeName: 'Project Business' }]
      //       },
      //       {
      //         menuValue: 'Manage Customer',
      //         hasSubRoute: true,
      //         showSubRoute: false,
      //         route: routes.pbManageCustomerComponent,
      //         customSubmenuTwo: false,
      //         base: 'todo',
      //         roles: [{ roleName: 'National Sales Head' }],
      //         projectTypeName: [{ projectTypeName: 'Project Business' }]
      //       },
      //     ],
      //     roles: [{ roleName: 'National Sales Head' }],
      //     projectTypeName: [{ projectTypeName: 'Project Business' }]
      //   },
      //   {
      //     menuValue: 'Reports',
      //     route: routes.projectBMenuList,
      //     hasSubRouteTwo: true,
      //     showSubRoute: false,
      //     icon: 'clipboard-data',
      //     base: 'orders',
      //     materialicons: 'dashboard',
      //     subMenus: [

      //       // {
      //       //   menuValue: 'WorkOrder and Agreements',
      //       //   hasSubRoute: true,
      //       //   showSubRoute: false,
      //       //   route: routes.pbWorkOrderAgreementsComponent,
      //       //   customSubmenuTwo: false,
      //       //   base: 'todo',
      //       //   roles: [{ roleName: 'National Sales Head' }],
      //       //   projectTypeName: [{ projectTypeName: 'Project Business' }]
      //       // },
      //       // {
      //       //   menuValue: 'Purchase Order',
      //       //   hasSubRoute: true,
      //       //   showSubRoute: false,
      //       //   route: routes.pbPurchaseOrderComponent,
      //       //   customSubmenuTwo: false,
      //       //   base: 'todo',
      //       //   roles: [{ roleName: 'National Sales Head' }],
      //       //   projectTypeName: [{ projectTypeName: 'Project Business' }]
      //       // },
      //       // {
      //       //   menuValue: 'Expence Tracking',
      //       //   hasSubRoute: true,
      //       //   showSubRoute: false,
      //       //   route: routes.pbExpenceTrackingComponent,
      //       //   customSubmenuTwo: false,
      //       //   base: 'todo',
      //       //   roles: [{ roleName: 'National Sales Head' }],
      //       //   projectTypeName: [{ projectTypeName: 'Project Business' }]
      //       // },
      //       // {
      //       //   menuValue: 'Stage Progression',
      //       //   hasSubRoute: true,
      //       //   showSubRoute: false,
      //       //   route: routes.pbStageProgressionComponent,
      //       //   customSubmenuTwo: false,
      //       //   base: 'todo',
      //       //   roles: [{ roleName: 'National Sales Head' }],
      //       //   projectTypeName: [{ projectTypeName: 'Project Business' }]
      //       // },
      //       {
      //         menuValue: 'Reporting Analytics',
      //         hasSubRoute: true,
      //         showSubRoute: false,
      //         route: routes.pbReportingAnalyticsComponent,
      //         customSubmenuTwo: false,
      //         base: 'todo',
      //         roles: [{ roleName: 'National Sales Head' }],
      //         projectTypeName: [{ projectTypeName: 'Project Business' }]
      //       },
      //       // {
      //       //   menuValue: 'User & Role Management',
      //       //   hasSubRoute: true,
      //       //   showSubRoute: false,
      //       //   route: routes.pbUserRoleManagementComponent,
      //       //   customSubmenuTwo: false,
      //       //   base: 'todo',
      //       //   roles: [{ roleName: 'National Sales Head' }],
      //       //   projectTypeName: [{ projectTypeName: 'Project Business' }]
      //       // },
      //       {
      //         menuValue: 'All Projects',
      //         hasSubRoute: true,
      //         showSubRoute: false,
      //         route: routes.pbAllProjectAnalyticsComponent,
      //         customSubmenuTwo: false,
      //         base: 'todo',
      //         roles: [{ roleName: 'National Sales Head' }],
      //         projectTypeName: [{ projectTypeName: 'Project Business' }]
      //       },

      //     ],
      //     roles: [{ roleName: 'National Sales Head' }],
      //     projectTypeName: [{ projectTypeName: 'Project Business' }]

      //   },








        
      //   //fixasset 
      //   {
      //     menuValue: 'Dashboard',
      //     route: routes.faDashboardComponent,
      //     hasSubRoute: false, // uncomment this to show menu in menu
      //     //hasSubRouteTwo: false,  // comment this to not show menu in menu
      //     showSubRoute: false,
      //     icon: 'smart-home',
      //     base: 'dashboard',
      //     materialicons: 'start',
      //     dot: false,
      //     subMenus: [],

      //     roles: [{ roleName: 'National Sales Head' }],
      //     projectTypeName: [{ projectTypeName: 'Fixed Asset' }]
      //   }, 
      //   {
      //     menuValue: 'Campaigns',
      //     route: routes.faCampaignsComponent,
      //     hasSubRoute: false, // uncomment this to show menu in menu
      //     //hasSubRouteTwo: false,  // comment this to not show menu in menu
      //     showSubRoute: false,
      //     icon: 'broadcast',
      //     base: 'dashboard',
      //     materialicons: 'start',
      //     dot: false,
      //     subMenus: [],

      //     roles: [{ roleName: 'National Sales Head' }],
      //     projectTypeName: [{ projectTypeName: 'Fixed Asset' }]
      //   }, 
      //   {
      //     menuValue: 'Asset Master',
      //     route: routes.faAssetMasteraComponent,
      //     hasSubRoute: false, // uncomment this to show menu in menu
      //     //hasSubRouteTwo: false,  // comment this to not show menu in menu
      //     showSubRoute: false,
      //     icon: 'box-seam',
      //     base: 'dashboard',
      //     materialicons: 'start',
      //     dot: false,
      //     subMenus: [],

      //     roles: [{ roleName: 'National Sales Head' }],
      //     projectTypeName: [{ projectTypeName: 'Fixed Asset' }]
      //   }, 
      //   {
      //     menuValue: 'Upload',
      //     route: routes.faUploaddataComponent,
      //     hasSubRoute: false, // uncomment this to show menu in menu
      //     //hasSubRouteTwo: false,  // comment this to not show menu in menu
      //     showSubRoute: false,
      //     icon: 'smart-home',
      //     base: 'dashboard',
      //     materialicons: 'start',
      //     dot: false,
      //     subMenus: [],

      //     roles: [{ roleName: 'National Sales Head' }],
      //     projectTypeName: [{ projectTypeName: 'Fixed Asset' }]
      //   }, 
      //   {
      //     menuValue: 'Ghost Assets',
      //     route: routes.faGhostAssetComponent,
      //     hasSubRoute: false, // uncomment this to show menu in menu
      //     //hasSubRouteTwo: false,  // comment this to not show menu in menu
      //     showSubRoute: false,
      //     icon: 'smart-home',
      //     base: 'dashboard',
      //     materialicons: 'start',
      //     dot: false,
      //     subMenus: [],

      //     roles: [{ roleName: 'National Sales Head' }],
      //     projectTypeName: [{ projectTypeName: 'Fixed Asset' }]
      //   }, 
      //   {
      //     menuValue: 'User',
      //     route: routes.faCreateUserComponent,
      //     hasSubRoute: false, // uncomment this to show menu in menu
      //     //hasSubRouteTwo: false,  // comment this to not show menu in menu
      //     showSubRoute: false,
      //     icon: 'user',
      //     base: 'dashboard',
      //     materialicons: 'start',
      //     dot: false,
      //     subMenus: [],

      //     roles: [{ roleName: 'National Sales Head' }],
      //     projectTypeName: [{ projectTypeName: 'Fixed Asset' }]
      //   },
      //   {
      //     menuValue: 'Reports',
      //     route: routes.fixedassetMenuList,
      //     hasSubRouteTwo: true,
      //     showSubRoute: false,
      //     icon: 'clipboard-data',
      //     base: 'orders',
      //     materialicons: 'dashboard',
      //     subMenus: [
      //       {
      //         menuValue: 'Excel report',
      //         hasSubRoute: true,
      //         showSubRoute: false,
      //         route: routes.faExcelReportsComponent,
      //         customSubmenuTwo: false,
      //         base: 'todo',
      //         roles: [{ roleName: 'National Sales Head' }],
      //         projectTypeName: [{ projectTypeName: 'Fixed Asset' }]
      //       }, 
      //       // {
      //       //   menuValue: 'Scanned History',
      //       //   hasSubRoute: true,
      //       //   showSubRoute: false,
      //       //   route: routes.faScannedHistoryComponent,
      //       //   customSubmenuTwo: false,
      //       //   base: 'todo',
      //       //   roles: [{ roleName: 'National Sales Head' }],
      //       //   projectTypeName: [{ projectTypeName: 'Fixed Asset' }]
      //       // },
      //         {
      //         menuValue: 'Verified assets', 
      //         hasSubRoute: true,
      //         showSubRoute: false,
      //         route: routes.faVerifiedAssetComponent,
      //         customSubmenuTwo: false,
      //         base: 'todo',
      //         roles: [{ roleName: 'National Sales Head' }],
      //         projectTypeName: [{ projectTypeName: 'Fixed Asset' }]
      //       },
      //       //  {
      //       //   menuValue: 'Manuel Report',
      //       //   hasSubRoute: true,
      //       //   showSubRoute: false,
      //       //   route: routes.faManuelReportComponent,
      //       //   customSubmenuTwo: false,
      //       //   base: 'todo',
      //       //   roles: [{ roleName: 'National Sales Head' }],
      //       //   projectTypeName: [{ projectTypeName: 'Fixed Asset' }]
      //       // },
            

      //       // {
      //       //   menuValue: 'Ghost Report',
      //       //   hasSubRoute: true,
      //       //   showSubRoute: false,
      //       //   route: routes.faGhostReportComponent,
      //       //   customSubmenuTwo: false,
      //       //   base: 'todo',
      //       //   roles: [{ roleName: 'National Sales Head' }],
      //       //   projectTypeName: [{ projectTypeName: 'Fixed Asset' }]
      //       // },


      //       {
      //         menuValue: 'Non-Taggable Report',
      //         hasSubRoute: true,
      //         showSubRoute: false,
      //         route: routes.faNonTaggableReportComponent,
      //         customSubmenuTwo: false,
      //         base: 'todo',
      //         roles: [{ roleName: 'National Sales Head' }],
      //         projectTypeName: [{ projectTypeName: 'Fixed Asset' }]
      //       },
           
      //       // {
      //       //   menuValue: 'Mark Not Available Report',
      //       //   hasSubRoute: true,
      //       //   showSubRoute: false,
      //       //   route: routes.faMarknotAvailaleReportComponent,
      //       //   customSubmenuTwo: false,
      //       //   base: 'todo',
      //       //   roles: [{ roleName: 'National Sales Head' }],
      //       //   projectTypeName: [{ projectTypeName: 'Fixed Asset' }]
      //       // },
      //       {
      //         menuValue: 'Pending Verified Asset',
      //         hasSubRoute: true,
      //         showSubRoute: false,
      //         route: routes.faPendingVerifiedAssetReportComponent,
      //         customSubmenuTwo: false,
      //         base: 'todo',
      //         roles: [{ roleName: 'National Sales Head' }],
      //         projectTypeName: [{ projectTypeName: 'Fixed Asset' }]
      //       },

      //     ],

      //     roles: [{ roleName: 'National Sales Head' }],
      //     projectTypeName: [{ projectTypeName: 'Fixed Asset' }]
      //   },












      //   //common
      //   {
      //     menuValue: 'Settings',
      //     route: routes.projectBMenuList,
      //     hasSubRouteTwo: true,
      //     showSubRoute: false,
      //     icon: 'settings',
      //     base: 'orders',
      //     materialicons: 'dashboard',
      //     subMenus: [
      //       {
      //         menuValue: 'Manage Jobs',
      //         hasSubRoute: true,
      //         showSubRoute: false,
      //         route: routes.scrManageJobsComponent,
      //         customSubmenuTwo: false,
      //         base: 'todo',
      //         roles: [{ roleName: 'National Sales Head' }],
      //         projectTypeName: [{ projectTypeName: 'Scrapper' }] 
      //       },
      //       {
      //         menuValue: 'Manage Access',
      //         hasSubRoute: true,
      //         showSubRoute: false,
      //         route: routes.urAccessComponent,
      //         customSubmenuTwo: false,
      //         base: 'todo',
      //         roles: [{ roleName: 'National Sales Head' }],
      //         projectTypeName: [{ projectTypeName: 'Unrecognised Invoice' }, { projectTypeName: 'Project Business' }, { projectTypeName: 'Scrapper' }, { projectTypeName: 'Trade Receivable' }]
      //       },
      //       {
      //         menuValue: 'Manage AccessLevels',
      //         hasSubRoute: true,
      //         showSubRoute: false,
      //         route: routes.urAccessLevelsComponent,
      //         customSubmenuTwo: false,
      //         base: 'todo',
      //         roles: [{ roleName: 'National Sales Head' }],
      //         projectTypeName: [{ projectTypeName: 'Unrecognised Invoice' }, { projectTypeName: 'Project Business' }, { projectTypeName: 'Scrapper' }, { projectTypeName: 'Trade Receivable' }]
      //       },
      //       {
      //         menuValue: 'Manage Areas',
      //         hasSubRoute: true,
      //         showSubRoute: false,
      //         route: routes.urAreasComponent,
      //         customSubmenuTwo: false,
      //         base: 'todo',
      //         roles: [{ roleName: 'National Sales Head' }],
      //         projectTypeName: [{ projectTypeName: 'Unrecognised Invoice' }, { projectTypeName: 'Project Business' }, { projectTypeName: 'Scrapper' }, { projectTypeName: 'Trade Receivable' }]
      //       },
      //       {
      //         menuValue: 'Manage Regions',
      //         hasSubRoute: true,
      //         showSubRoute: false,
      //         route: routes.urRegionsComponent,
      //         customSubmenuTwo: false,
      //         base: 'todo',
      //         roles: [{ roleName: 'National Sales Head' }],
      //         projectTypeName: [{ projectTypeName: 'Unrecognised Invoice' }, { projectTypeName: 'Project Business' }, { projectTypeName: 'Scrapper' }, { projectTypeName: 'Trade Receivable' }]
      //       },
      //       {
      //         menuValue: 'Manage Roles',
      //         hasSubRoute: true,
      //         showSubRoute: false,
      //         route: routes.urRolesComponent,
      //         customSubmenuTwo: false,
      //         base: 'todo',
      //         roles: [{ roleName: 'National Sales Head' }],
      //         projectTypeName: [{ projectTypeName: 'Unrecognised Invoice' }, { projectTypeName: 'Project Business' }, { projectTypeName: 'Scrapper' }, { projectTypeName: 'Trade Receivable' }]
      //       },
      //       {
      //         menuValue: 'Manage States',
      //         hasSubRoute: true,
      //         showSubRoute: false,
      //         route: routes.urStatesComponent,
      //         customSubmenuTwo: false,
      //         base: 'todo',
      //         roles: [{ roleName: 'National Sales Head' }],
      //         projectTypeName: [{ projectTypeName: 'Unrecognised Invoice' }, { projectTypeName: 'Project Business' }, { projectTypeName: 'Scrapper' }, { projectTypeName: 'Trade Receivable' }]
      //       },
      //       {
      //         menuValue: 'Manage Zones',
      //         hasSubRoute: true,  
      //         showSubRoute: false,
      //         route: routes.urZonesComponent,
      //         customSubmenuTwo: false,
      //         base: 'todo',
      //         roles: [{ roleName: 'National Sales Head' }],
      //         projectTypeName: [{ projectTypeName: 'Unrecognised Invoice' }, { projectTypeName: 'Project Business' }, { projectTypeName: 'Scrapper' }, { projectTypeName: 'Trade Receivable' }]
      //       },
      //     ],
      //     roles: [{ roleName: 'National Sales Head' }],
      //     projectTypeName: [{ projectTypeName: 'Scrapper' }, { projectTypeName: 'Trade Receivable' }, { projectTypeName: 'Unrecognised Invoice' }, { projectTypeName: 'Project Business' }]

      //   },

      ],
    },


  ];
  public getSideBarData = new BehaviorSubject<SideBar[]>(this.sideBar);

  public resetData(): void {
    console.log("Resetting sidebar data...data.srv");
    // this.sideBar.map((res: SideBar) => {
    //   res.showAsTab = false;
    //   res.menu.map((menus: SideBarMenu) => {
    //     menus.showSubRoute = false;
    //   });
    // });
    this.sideBar.forEach((res: SideBar) => {
      res.showAsTab = false;
      res.menu.forEach((menus: SideBarMenu) => {
        menus.showSubRoute = false;
      });
    });
  }

  public clearSidebar(): void {
  console.log('Clearing sidebar data...');
  this.getSideBarData.next([]);
}

  public reloadSidebar(): void {
  console.log('reloadSidebar from dataSrv');

  this.resetData();

  setTimeout(() => {
    this.getSideBarData.next([...this.sideBar]);
    this.sidebarReloadTrigger$.next();
    console.log('Sidebar reloaded with fresh data');
  }, 50);
}


  //new
  // authSrv = inject(AuthService);
  // // public sideBar: SideBar[] = []
  // getMenuItems(): SideBar[] {
  //   const userRole = this.authSrv._getLoggedRole();
  //   const userCompanyCode = String(this.authSrv._getCompanyCode());

  //   return this.sideBar.filter((item:any) => {
  //     return item.data.role.includes(userRole) && item.data.companyCode.includes(userCompanyCode);
  //   });
  // }
}
