import { Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { HomeComponent } from './pages/layout/home/home.component';
import { authGuard } from './shared/core/guards/auth.guard';
import { rolesBaseGuard } from './shared/core/guards/roles-base.guard';




import { ScrAllLogsComponent } from './pages/company/SCRAPPER/scr-all-logs/scr-all-logs.component';
import { UrShowDataComponent } from './pages/company/SCRAPPER/Reports/ur-show-data/ur-show-data.component';
import { ScrapperLogsComponent } from './pages/company/SCRAPPER/logs/scrapper-logs/scrapper-logs.component';
import { ScrUserLogsComponent } from './pages/company/SCRAPPER/logs/scr-user-logs/scr-user-logs.component';
import { ScrManageJobsComponent } from './pages/company/SCRAPPER/Settings/scr-manage-jobs/scr-manage-jobs.component';
import { TrManagerDashboardComponent } from './pages/company/TradeReceivable/tr-manager-dashboard/tr-manager-dashboard.component';
import { CreditReportComponent } from './pages/company/TradeReceivable/Reports/credit-report/credit-report.component';
import { DebitReportComponent } from './pages/company/TradeReceivable/Reports/debit-report/debit-report.component'; 
import { CustomerOutstandingComponent } from './pages/company/TradeReceivable/customer-outstanding/customer-outstanding.component';
import { TRUserMasterComponent } from './pages/company/TradeReceivable/ManageData/t-ruser-master/t-ruser-master.component';
import { TrUserLogComponent } from './pages/company/TradeReceivable/LogReports/tr-user-log/tr-user-log.component';
import { TrSapDumpLogComponent } from './pages/company/TradeReceivable/LogReports/tr-sap-dump-log/tr-sap-dump-log.component';
import { TrWorkingSheetComponent } from './pages/company/TradeReceivable/Reports/tr-working-sheet/tr-working-sheet.component';
import { TrHistoricalReportsComponent } from './pages/company/TradeReceivable/Reports/tr-historical-reports/tr-historical-reports.component';
import { TrOneLineSummaryComponent } from './pages/company/TradeReceivable/Reports/tr-one-line-summary/tr-one-line-summary.component';
import { TrUploadSapFilesComponent } from './pages/company/TradeReceivable/upload/tr-upload-sap-files/tr-upload-sap-files.component';
import { UnrecogmisedInventoryComponent } from './pages/company/UNRECOGNISED/unrecognisedInventory/unrecogmised-inventory/unrecogmised-inventory.component';
import { UiPanIndiaSummaryComponent } from './pages/company/UNRECOGNISED/unrecognisedInventory/panIndia/ui-pan-india-summary/ui-pan-india-summary.component';
import { UiStateWiseStageComponent } from './pages/company/UNRECOGNISED/unrecognisedInventory/stateWise/ui-state-wise-stage/ui-state-wise-stage.component';
import { UiAreaWiseAgingComponent } from './pages/company/UNRECOGNISED/unrecognisedInventory/areaWise/ui-area-wise-aging/ui-area-wise-aging.component';
import { UrDealerMasterComponent } from './pages/company/UNRECOGNISED/manageData/ur-dealer-master/ur-dealer-master.component';
import { UrUserMasterComponent } from './pages/company/UNRECOGNISED/manageData/ur-user-master/ur-user-master.component';
import { UrRemarksMasterComponent } from './pages/company/UNRECOGNISED/Reports/ur-remarks-master/ur-remarks-master.component';
import { UrUsersLogsComponent } from './pages/company/UNRECOGNISED/Reports/ur-users-logs/ur-users-logs.component';
import { UrAuditLogsComponent } from './pages/company/UNRECOGNISED/Reports/ur-audit-logs/ur-audit-logs.component';
import { DashboardComponent } from './pages/company/PROJECTBUSINESS/dashboard/dashboard.component';
import { PbProjectManagementComponent } from './pages/company/PROJECTBUSINESS/Manage Project/pb-project-management/pb-project-management.component';
import { PbAddNewProjectComponent } from './pages/company/PROJECTBUSINESS/Manage Project/pb-add-new-project/pb-add-new-project.component';
import { PbCostEstimationComponent } from './pages/company/PROJECTBUSINESS/Manage Project/pb-cost-estimation/pb-cost-estimation.component';
import { PbWorkOrderAgreementsComponent } from './pages/company/PROJECTBUSINESS/pb-work-order-agreements/pb-work-order-agreements.component';
import { PbPurchaseOrderComponent } from './pages/company/PROJECTBUSINESS/pb-purchase-order/pb-purchase-order.component';
import { PbExpenceTrackingComponent } from './pages/company/PROJECTBUSINESS/pb-expence-tracking/pb-expence-tracking.component';
import { PbStageProgressionComponent } from './pages/company/PROJECTBUSINESS/pb-stage-progression/pb-stage-progression.component';
import { PbReportingAnalyticsComponent } from './pages/company/PROJECTBUSINESS/pb-reporting-analytics/pb-reporting-analytics.component';
import { PbUserRoleManagementComponent } from './pages/company/PROJECTBUSINESS/pb-user-role-management/pb-user-role-management.component';
import { PbManageVendorComponent } from './pages/company/PROJECTBUSINESS/ManageData/pb-manage-vendor/pb-manage-vendor.component';
import { PbManageCustomerComponent } from './pages/company/PROJECTBUSINESS/ManageData/pb-manage-customer/pb-manage-customer.component';
import { PbManageExpenseHeadComponent } from './pages/company/PROJECTBUSINESS/ManageData/pb-manage-expense-head/pb-manage-expense-head.component';
import { PbAllProjectAnalyticsComponent } from './pages/company/PROJECTBUSINESS/Reports/pb-all-project-analytics/pb-all-project-analytics.component';
import { ScrDashboardComponent } from './pages/company/SCRAPPER/Dashboard/scr-dashboard/scr-dashboard.component';
import { ScrJobStatusComponent } from './pages/company/SCRAPPER/ManageJobs/scr-job-status/scr-job-status.component';
import { ScrRunJobsComponent } from './pages/company/SCRAPPER/ManageJobs/scr-run-jobs/scr-run-jobs.component';
import { PbEditCostEstimationComponent } from './pages/company/PROJECTBUSINESS/Manage Project/pb-edit-cost-estimation/pb-edit-cost-estimation.component';
import { PbAddCostEstimationComponent } from './pages/company/PROJECTBUSINESS/Manage Project/pb-add-cost-estimation/pb-add-cost-estimation.component';
import { PbViewCostEstimationComponent } from './pages/company/PROJECTBUSINESS/Manage Project/pb-view-cost-estimation/pb-view-cost-estimation.component';
import { UrAccessComponent } from './pages/company/UNRECOGNISED/Settings/ur-access/ur-access.component';
import { UrAccessLevelsComponent } from './pages/company/UNRECOGNISED/Settings/ur-access-levels/ur-access-levels.component';
import { UrAreasComponent } from './pages/company/UNRECOGNISED/Settings/ur-areas/ur-areas.component';
import { UrRegionsComponent } from './pages/company/UNRECOGNISED/Settings/ur-regions/ur-regions.component';
import { UrRolesComponent } from './pages/company/UNRECOGNISED/Settings/ur-roles/ur-roles.component';
import { UrStatesComponent } from './pages/company/UNRECOGNISED/Settings/ur-states/ur-states.component';
import { UrZonesComponent } from './pages/company/UNRECOGNISED/Settings/ur-zones/ur-zones.component';
import { UrStageMasterComponent } from './pages/company/UNRECOGNISED/manageData/ur-stage-master/ur-stage-master.component';
import { PbFtmEntriesComponent } from './pages/company/PROJECTBUSINESS/Manage Project/pb-ftm-entries/pb-ftm-entries.component';
import { ScrAPComponent } from './pages/company/SCRAPPER/Dashboard/Data-overview/scr-ap/scr-ap.component';
import { ScrCGComponent } from './pages/company/SCRAPPER/Dashboard/Data-overview/scr-cg/scr-cg.component';
import { ScrGJComponent } from './pages/company/SCRAPPER/Dashboard/Data-overview/scr-gj/scr-gj.component';
import { ScrKAHComponent } from './pages/company/SCRAPPER/Dashboard/Data-overview/scr-kah/scr-kah.component';
import { ScrKAKComponent } from './pages/company/SCRAPPER/Dashboard/Data-overview/scr-kak/scr-kak.component';
import { ScrMPComponent } from './pages/company/SCRAPPER/Dashboard/Data-overview/scr-mp/scr-mp.component';
import { ScrTNComponent } from './pages/company/SCRAPPER/Dashboard/Data-overview/scr-tn/scr-tn.component';
import { ScrUPComponent } from './pages/company/SCRAPPER/Dashboard/Data-overview/scr-up/scr-up.component';
import { ScrTGComponent } from './pages/company/SCRAPPER/Dashboard/Data-overview/scr-tg/scr-tg.component';
import { ScrWBComponent } from './pages/company/SCRAPPER/Dashboard/Data-overview/scr-wb/scr-wb.component';
import { UrPanIndiaBucketSummaryComponent } from './pages/company/UNRECOGNISED/unrecognisedInventory/panIndia/ur-pan-india-bucket-summary/ur-pan-india-bucket-summary.component';
import { UrStateWiseAgingBucketComponent } from './pages/company/UNRECOGNISED/unrecognisedInventory/stateWise/ur-state-wise-aging-bucket/ur-state-wise-aging-bucket.component';
import { UrAreaWiseAgingBucketComponent } from './pages/company/UNRECOGNISED/unrecognisedInventory/areaWise/ur-area-wise-aging-bucket/ur-area-wise-aging-bucket.component';
import { UnrecognisedRevenueComponent } from './pages/company/UNRECOGNISED/unrecognisedCOGS/unrecognised-revenue/unrecognised-revenue.component';
import { UrPanIndiaSummaryComponent } from './pages/company/UNRECOGNISED/unrecognisedCOGS/panIndia/ur-pan-india-summary/ur-pan-india-summary.component';
import { UrStateWiseStageComponent } from './pages/company/UNRECOGNISED/unrecognisedCOGS/stateWise/ur-state-wise-stage/ur-state-wise-stage.component';
import { UrAreaWiseAgingComponent } from './pages/company/UNRECOGNISED/unrecognisedCOGS/areaWise/ur-area-wise-aging/ur-area-wise-aging.component';
import { UrCogsPanWiseBucketComponent } from './pages/company/UNRECOGNISED/unrecognisedCOGS/panIndia/ur-cogs-pan-wise-bucket/ur-cogs-pan-wise-bucket.component';
import { UrCogsStateWiseBucketComponent } from './pages/company/UNRECOGNISED/unrecognisedCOGS/stateWise/ur-cogs-state-wise-bucket/ur-cogs-state-wise-bucket.component';
import { UrCogsAreaWiseBucketComponent } from './pages/company/UNRECOGNISED/unrecognisedCOGS/areaWise/ur-cogs-area-wise-bucket/ur-cogs-area-wise-bucket.component';
import { TEntriesComponent } from './pages/company/TradeReceivable/ManageSales/t-entries/t-entries.component';
import { TFinalSummaryComponent } from './pages/company/TradeReceivable/ManageSales/t-final-summary/t-final-summary.component';
import { TGroupingSaleComponent } from './pages/company/TradeReceivable/ManageSales/t-grouping-sale/t-grouping-sale.component';
import { TProjectsComponent } from './pages/company/TradeReceivable/ManageSales/t-projects/t-projects.component';
import { TProjectsRrComponent } from './pages/company/TradeReceivable/ManageSales/t-projects-rr/t-projects-rr.component';
import { TRoughSummaryComponent } from './pages/company/TradeReceivable/ManageSales/t-rough-summary/t-rough-summary.component';
import { TSalesNov2025Component } from './pages/company/TradeReceivable/ManageSales/t-sales-nov2025/t-sales-nov2025.component';
import { TUploadComponent } from './pages/company/TradeReceivable/ManageSales/t-upload/t-upload.component';
import { FaDashboardComponent } from './pages/company/FIXEDASSET/fix-dashboard/fa-dashboard/fa-dashboard.component';
import { FaCampaignsComponent } from './pages/company/FIXEDASSET/campaigns/fa-campaigns/fa-campaigns.component';
import { FaAssetMasteraComponent } from './pages/company/FIXEDASSET/AssetMaster/fa-asset-mastera/fa-asset-mastera.component';
import { FaUploaddataComponent } from './pages/company/FIXEDASSET/UploadData/fa-uploaddata/fa-uploaddata.component';
import { FaGhostAssetComponent } from './pages/company/FIXEDASSET/GhostAssets/fa-ghost-asset/fa-ghost-asset.component';
import { FaExcelReportsComponent } from './pages/company/FIXEDASSET/Reports/fa-excel-reports/fa-excel-reports.component';
import { FaScannedHistoryComponent } from './pages/company/FIXEDASSET/Reports/fa-scanned-history/fa-scanned-history.component';
// import { UrRemarksComponent } from './pages/company/UNRECOGNISED/Reports/ur-remarks/ur-remarks.component';
import { FaManuelReportComponent } from './pages/company/FIXEDASSET/Reports/fa-manuel-reports/fa-manuel-report/fa-manuel-report.component';
import { FaGhostReportComponent } from './pages/company/FIXEDASSET/Reports/fa-Ghost-Reports/fa-ghost-report/fa-ghost-report.component';
import { FaMarknotAvailaleReportComponent } from './pages/company/FIXEDASSET/Reports/fa-MarknotAvailable-Reports/fa-marknot-availale-report/fa-marknot-availale-report.component';
import { FaNonTaggableReportComponent } from './pages/company/FIXEDASSET/Reports/fa-NonTaggable-Reports/fa-non-taggable-report/fa-non-taggable-report.component';
import { FaVerifiedAssetComponent } from './pages/company/FIXEDASSET/Reports/fa-verified-asset/fa-verified-asset.component';
import { TrPmComparisonComponent } from './pages/company/TradeReceivable/Reports/HeadOfficeReview/tr-pm-comparison/tr-pm-comparison.component';
import { TrOpenComparisonComponent } from './pages/company/TradeReceivable/Reports/HeadOfficeReview/tr-open-comparison/tr-open-comparison.component';
import { TrPmAgeingComponent } from './pages/company/TradeReceivable/Reports/HeadOfficeReview/tr-pm-ageing/tr-pm-ageing.component';
import { TrProjectMarketComponent } from './pages/company/TradeReceivable/Reports/HeadOfficeReview/tr-project-market/tr-project-market.component';
import { TrOpenMarketComponent } from './pages/company/TradeReceivable/Reports/HeadOfficeReview/tr-open-market/tr-open-market.component';
import { TrQueryDataComponent } from './pages/company/TradeReceivable/Reports/HeadOfficeReview/tr-query-data/tr-query-data.component';
import { TrProjectMarketAditionalComponent } from './pages/company/TradeReceivable/Reports/HeadOfficeReview/tr-project-market-aditional/tr-project-market-aditional.component';
import { TrOpenAdditionalComponent } from './pages/company/TradeReceivable/Reports/HeadOfficeReview/tr-open-additional/tr-open-additional.component';
import { TrInstitutionalComponent } from './pages/company/TradeReceivable/Reports/HeadOfficeReview/tr-institutional/tr-institutional.component';
import { TrAdditionalPddOpenMarketComponent } from './pages/company/TradeReceivable/Reports/HeadOfficeReview/tr-additional-pdd-open-market/tr-additional-pdd-open-market.component';
import { TrCollectionComponent } from './pages/company/TradeReceivable/Reports/HeadOfficeReview/tr-collection/tr-collection.component';
import { TrSalesComponent } from './pages/company/TradeReceivable/Reports/HeadOfficeReview/tr-sales/tr-sales.component';
import { faCreateUserComponent } from './pages/company/FIXEDASSET/User/create-user/create-user.component';
import { FaPendingVerifiedAssetReportComponent } from './pages/company/FIXEDASSET/Reports/fa-pending-verified-asset-report/fa-pending-verified-asset-report.component';
import { UrLogsComponent } from './pages/company/UNRECOGNISED/Upload Center/ur-logs/ur-logs.component';
import { UrUploadComponent } from './pages/company/UNRECOGNISED/Upload Center/ur-upload/ur-upload.component';
import { TrStageMasterComponent } from './pages/company/TradeReceivable/tr-stage-master/tr-stage-master.component';
import { ScrManualUploadComponent } from './pages/company/SCRAPPER/ManageJobs/scr-manual-upload/scr-manual-upload.component';
import { UrStateFactorComponent } from './pages/company/UNRECOGNISED/manageData/ur-state-factor/ur-state-factor.component';
import { DownloadUploadedFileComponent } from './pages/company/UNRECOGNISED/Upload Center/download-uploaded-file/download-uploaded-file.component';
import { PbUnrecognisedProjectsComponent } from './pages/company/PROJECTBUSINESS/Manage Project/pb-unrecognised-projects/pb-unrecognised-projects.component';
import { UploadCollectionsComponent } from './pages/company/TradeReceivable/upload/upload-collections/upload-collections.component';
import { TSecondaryDiscountComponent } from './pages/company/TradeReceivable/ManageSales/t-secondary-discount/t-secondary-discount.component';
import { AddSidebarMenuComponent } from './pages/company/SCRAPPER/add-sidebar-menu/add-sidebar-menu.component';
import { SideMenuAccessComponent } from './pages/company/SCRAPPER/side-menu-access/side-menu-access.component';
import { DRDashboardComponent } from './pages/company/UNRECOGNISED/dashboard/dashboard.component';
import { MissingRecordComponent } from './pages/company/UNRECOGNISED/Upload Center/missing-record/missing-record.component';
import { PbUploadsComponent } from './pages/company/PROJECTBUSINESS/uploads/pb-uploads/pb-uploads.component';
import { HistoricalDownloadsComponent } from './pages/company/TradeReceivable/historical-downloads/historical-downloads.component';


export const ROUTE_REGISTRY: Record<string, any> = {
  // SCRAPPER
  'scrDashboardComponent':        ScrDashboardComponent,
  'scrAPComponent':               ScrAPComponent,
  'scrCGComponent':               ScrCGComponent,
  'scrGJComponent':               ScrGJComponent,
  'scrKAHComponent':              ScrKAHComponent,
  'scrKAKComponent':              ScrKAKComponent,
  'scrMPComponent':               ScrMPComponent,
  'scrTNComponent':               ScrTNComponent,
  'scrTGComponent':               ScrTGComponent,
  'scrUPComponent':               ScrUPComponent,
  'scrWBComponent':               ScrWBComponent,
  'scrJobStatusComponent':        ScrJobStatusComponent,
  'scrRunJobsComponent':          ScrRunJobsComponent,
  'scrManualUploadComponent':     ScrManualUploadComponent,
  'scrAllLogsComponent':          ScrAllLogsComponent,
  'scrapperLogsComponent':        ScrapperLogsComponent,
  'scrUserLogsComponent':         ScrUserLogsComponent,
  'scrManageJobsComponent':       ScrManageJobsComponent,
  'urShowDataComponent':          UrShowDataComponent,
  'addSidebarMenuComponent':      AddSidebarMenuComponent,
  'sideMenuAccessComponent':      SideMenuAccessComponent,

  // TRADE RECEIVABLE
  'trManagerDashboardComponent':           TrManagerDashboardComponent,
  'trStageMasterComponent':                TrStageMasterComponent,
  'creditReportComponent':                 CreditReportComponent,
  'debitReportComponent':                  DebitReportComponent,
  'customerOutstandingComponent':          CustomerOutstandingComponent,
  'tRUserMasterComponent':                 TRUserMasterComponent,
  'trUserLogComponent':                    TrUserLogComponent,
  'trSapDumpLogComponent':                 TrSapDumpLogComponent,
  'trWorkingSheetComponent':               TrWorkingSheetComponent,
  'trHistoricalReportsComponent':          TrHistoricalReportsComponent,
  'trOneLineSummaryComponent':             TrOneLineSummaryComponent,
  'trUploadSapFilesComponent':             TrUploadSapFilesComponent,
  'trEntriesComponent':                    TEntriesComponent,
  'trFinalSummaryComponent':               TFinalSummaryComponent,
  'trGroupingSaleComponent':               TGroupingSaleComponent,
  'trProjectsComponent':                   TProjectsComponent,
  'trProjectsRrComponent':                 TProjectsRrComponent,
  'trRoughSummaryComponent':               TRoughSummaryComponent,
  'trSalesNov2025Component':               TSalesNov2025Component,
  'trUploadComponent':                     TUploadComponent,
  'trUploadCollectionsComponent':          UploadCollectionsComponent,
  'trPmComparisonComponent':               TrPmComparisonComponent,
  'trOpenComparisonComponent':             TrOpenComparisonComponent,
  'trPmAgeingComponent':                   TrPmAgeingComponent,
  'trProjectMarketComponent':              TrProjectMarketComponent,
  'trOpenMarketComponent':                 TrOpenMarketComponent,
  'trQueryDataComponent':                  TrQueryDataComponent,
  'trProjectMarketAditionalComponent':     TrProjectMarketAditionalComponent,
  'trOpenAdditionalComponent':             TrOpenAdditionalComponent,
  'trInstitutionalComponent':              TrInstitutionalComponent,
  'trAdditionalPddOpenMarketComponent':    TrAdditionalPddOpenMarketComponent,
  'trCollectionComponent':                 TrCollectionComponent,
  'trSalesComponent':                      TrSalesComponent,
  'trSecondaryDiscountComponent':          TSecondaryDiscountComponent,
  'trsideMenuAccessComponent':             SideMenuAccessComponent,
  'trHistoricalDownloadsComponent':         HistoricalDownloadsComponent,
  

  // UNRECOGNISED INVOICE
  'drdashboardcomponent':                  DRDashboardComponent,
  'unrecogmisedInventoryComponent':        UnrecogmisedInventoryComponent,
  'unrecognisedRevenueComponent':          UnrecognisedRevenueComponent,
  'uiPanIndiaSummaryComponent':            UiPanIndiaSummaryComponent,
  'urPanIndiaBucketSummaryComponent':      UrPanIndiaBucketSummaryComponent,
  'urPanIndiaSummaryComponent':            UrPanIndiaSummaryComponent,
  'urCogsPanWiseBucketComponent':          UrCogsPanWiseBucketComponent,
  'uiStateWiseStageComponent':             UiStateWiseStageComponent,
  'urStateWiseAgingBucketComponent':       UrStateWiseAgingBucketComponent,
  'urStateWiseStageComponent':             UrStateWiseStageComponent,
  'urCogsStateWiseBucketComponent':        UrCogsStateWiseBucketComponent,
  'uiAreaWiseAgingComponent':              UiAreaWiseAgingComponent,
  'urAreaWiseAgingBucketComponent':        UrAreaWiseAgingBucketComponent,
  'urAreaWiseAgingComponent':              UrAreaWiseAgingComponent,
  'urCogsAreaWiseBucketComponent':         UrCogsAreaWiseBucketComponent,
  'urUploadComponent':                     UrUploadComponent,
  'UrLogsComponent':                       UrLogsComponent,
  'DownloadUploadedFileComponent':         DownloadUploadedFileComponent,
  'MissingRecordComponent':                MissingRecordComponent,
  'urDealerMasterComponent':               UrDealerMasterComponent,
  'urUserMasterComponent':                 UrUserMasterComponent,
  'urStageMasterComponent':                UrStageMasterComponent,
  'urStateFactorComponent':                UrStateFactorComponent,
  'urRemarksMasterComponent':              UrRemarksMasterComponent,
  'urUsersLogsComponent':                  UrUsersLogsComponent,
  'urAuditLogsComponent':                  UrAuditLogsComponent,
  'ursideMenuAccessComponent':             SideMenuAccessComponent,

  // PROJECT BUSINESS
  'pbDashboardComponent':                  DashboardComponent,
  'pbProjectManagementComponent':          PbProjectManagementComponent,
  'pbAddNewProjectComponent':              PbAddNewProjectComponent,
  'pbCostEstimationComponent':             PbCostEstimationComponent,
  'pbAddCostEstimationComponent':          PbAddCostEstimationComponent,
  'pbEditCostEstimationComponent':         PbEditCostEstimationComponent,
  'pbViewCostEstimationComponent':         PbViewCostEstimationComponent,
  'pbFtmEntriesComponent':                 PbFtmEntriesComponent,
  'pbUnrecognisedProjectsComponent':       PbUnrecognisedProjectsComponent,
  'pbWorkOrderAgreementsComponent':        PbWorkOrderAgreementsComponent,
  'pbPurchaseOrderComponent':              PbPurchaseOrderComponent,
  'pbExpenceTrackingComponent':            PbExpenceTrackingComponent,
  'pbStageProgressionComponent':           PbStageProgressionComponent,
  'pbReportingAnalyticsComponent':         PbReportingAnalyticsComponent,
  'pbUserRoleManagementComponent':         PbUserRoleManagementComponent,
  'pbManageVendorComponent':               PbManageVendorComponent,
  'pbManageCustomerComponent':             PbManageCustomerComponent,
  'pbManageExpenseHeadComponent':          PbManageExpenseHeadComponent,
  'pbAllProjectAnalyticsComponent':        PbAllProjectAnalyticsComponent,
  'pbUploadsComponent':                    PbUploadsComponent,
  'pbsideMenuAccessComponent':             SideMenuAccessComponent,

  // FIXED ASSET
  'faDashboardComponent':                  FaDashboardComponent,
  'faCampaignsComponent':                  FaCampaignsComponent,
  'faAssetMasteraComponent':               FaAssetMasteraComponent,
  'faUploaddataComponent':                 FaUploaddataComponent,
  'faGhostAssetComponent':                 FaGhostAssetComponent,
  'faExcelReportsComponent':               FaExcelReportsComponent,
  'faScannedHistoryComponent':             FaScannedHistoryComponent,
  'faVerifiedAssetComponent':              FaVerifiedAssetComponent,
  'faManuelReportComponent':               FaManuelReportComponent,
  'faGhostReportComponent':                FaGhostReportComponent,
  'faMarknotAvailaleReportComponent':      FaMarknotAvailaleReportComponent,
  'faNonTaggableReportComponent':          FaNonTaggableReportComponent,
  'faCreateUserComponent':                 faCreateUserComponent,
  'faPendingVerifiedAssetReportComponent': FaPendingVerifiedAssetReportComponent,

  // COMMON / SETTINGS
  'urAccessComponent':       UrAccessComponent,
  'urAccessLevelsComponent': UrAccessLevelsComponent,
  'urAreasComponent':        UrAreasComponent,
  'urRegionsComponent':      UrRegionsComponent,
  'urRolesComponent':        UrRolesComponent,
  'urStatesComponent':       UrStatesComponent,
  'urZonesComponent':        UrZonesComponent,
};

export const routes: Routes = [

  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },


  {
    path: '',
    component: HomeComponent,
    children: [


      // //Trade Receivable 
      // // {
      // //   path: 'trDashboardComponent',
      // //   component: TrDashboardComponent,
      // //   //canActivate: [authGuard],
      // //   canActivate: [authGuard, rolesBaseGuard],
      // //   data: {
      // //     // expectedRoles: ['National Sales Head'],
      // //     companyCode: [1049]
      // //   },
      // // },


      // // scrapper
      
      // {
      //   path: 'scrDashboardComponent',
      //   component: ScrDashboardComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head'],
      //     projectTypeName: ['Scrapper']
      //   },
      // },
      // {
      //   path: 'scrAPComponent',
      //   component: ScrAPComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head'],
      //     projectTypeName: ['Scrapper']
      //   },
      // },
      // {
      //   path: 'scrCGComponent',
      //   component: ScrCGComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head'],
      //     projectTypeName: ['Scrapper']
      //   },
      // },
      // {
      //   path: 'scrGJComponent',
      //   component: ScrGJComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head'],
      //     projectTypeName: ['Scrapper']
      //   },
      // },
      // {
      //   path: 'scrKAHComponent',
      //   component: ScrKAHComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head'],
      //     projectTypeName: ['Scrapper']
      //   },
      // },
      // {
      //   path: 'scrKAKComponent',
      //   component: ScrKAKComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head'],
      //     projectTypeName: ['Scrapper']
      //   },
      // },
      // {
      //   path: 'scrMPComponent',
      //   component: ScrMPComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head'],
      //     projectTypeName: ['Scrapper']
      //   },
      // },
      // {
      //   path: 'scrTNComponent',
      //   component: ScrTNComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head'],
      //     projectTypeName: ['Scrapper']
      //   },
      // },
      // {
      //   path: 'scrTGComponent',
      //   component: ScrTGComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head'],
      //     projectTypeName: ['Scrapper']
      //   },
      // },
      // {
      //   path: 'scrUPComponent',
      //   component: ScrUPComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head'],
      //     projectTypeName: ['Scrapper']
      //   },
      // },
      // {
      //   path: 'scrWBComponent',
      //   component: ScrWBComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head'],
      //     projectTypeName: ['Scrapper']
      //   },
      // },
      // {
      //   path: 'scrJobStatusComponent',
      //   component: ScrJobStatusComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head'],
      //     projectTypeName: ['Scrapper']
      //   },
      // },
      // {
      //   path: 'scrRunJobsComponent',
      //   component: ScrRunJobsComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head'],
      //     projectTypeName: ['Scrapper']
      //   },
      // },
      // {
      //   path: 'scrManualUploadComponent',
      //   component: ScrManualUploadComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head'],
      //     projectTypeName: ['Scrapper']
      //   },
      // },
      // {
      //   path: 'scrAllLogsComponent',
      //   component: ScrAllLogsComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head'],
      //     projectTypeName: ['Scrapper']
      //   },
      // },
      // {
      //   path: 'urShowDataComponent',
      //   component: UrShowDataComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head'],
      //     projectTypeName: ['Scrapper']
      //   },
      // },
      // {
      //   path: 'scrapperLogsComponent',
      //   component: ScrapperLogsComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head'],
      //     projectTypeName: ['Scrapper']
      //   },
      // },
      // {
      //   path: 'scrUserLogsComponent',
      //   component: ScrUserLogsComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head'],
      //     projectTypeName: ['Scrapper']
      //   },
      // },
      // {
      //   path: 'scrManageJobsComponent',
      //   component: ScrManageJobsComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head'],
      //     projectTypeName: ['Scrapper']
      //   },
      // },
      // {
      //   path: 'addSidebarMenuComponent',
      //   component: AddSidebarMenuComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head'],
      //     projectTypeName: ['Scrapper']
      //   },
      // },
      // {
      //   path: 'sideMenuAccessComponent',
      //   component: SideMenuAccessComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head'],
      //     projectTypeName: ['Scrapper']
      //   },
      // },












      // //trade receivable
      // {
      //   path: 'trManagerDashboardComponent',
      //   component: TrManagerDashboardComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head'],
      //     projectTypeName: ['Trade Receivable']
      //   },
      // },
      // {
      //   path: 'trStageMasterComponent',
      //   component: TrStageMasterComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head'],
      //     projectTypeName: ['Trade Receivable']
      //   },
      // },
      // {
      //   path: 'creditReportComponent',
      //   component: CreditReportComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head'],
      //     projectTypeName: ['Trade Receivable']
      //   },
      // },
      // {
      //   path: 'debitReportComponent',
      //   component: DebitReportComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head'],
      //     projectTypeName: ['Trade Receivable']
      //   },
      // }, 
      // {
      //   path: 'customerOutstandingComponent',
      //   component: CustomerOutstandingComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head'],
      //     projectTypeName: ['Trade Receivable']
      //   },
      // },
      // {
      //   path: 'tRUserMasterComponent',
      //   component: TRUserMasterComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head'],
      //     projectTypeName: ['Trade Receivable']
      //   },
      // },
      // {
      //   path: 'trUserLogComponent',
      //   component: TrUserLogComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head'],
      //     projectTypeName: ['Trade Receivable']
      //   },
      // },
      // {
      //   path: 'trSapDumpLogComponent',
      //   component: TrSapDumpLogComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head'],
      //     projectTypeName: ['Trade Receivable']
      //   },
      // },
      // {
      //   path: 'trWorkingSheetComponent',
      //   component: TrWorkingSheetComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head'],
      //     projectTypeName: ['Trade Receivable']
      //   },
      // },
      // {
      //   path: 'trHistoricalReportsComponent',
      //   component: TrHistoricalReportsComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head'],
      //     projectTypeName: ['Trade Receivable']
      //   },
      // },
      // {
      //   path: 'trOneLineSummaryComponent',
      //   component: TrOneLineSummaryComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head'],
      //     projectTypeName: ['Trade Receivable']
      //   },
      // },
      // {
      //   path: 'trUploadSapFilesComponent',
      //   component: TrUploadSapFilesComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head'],
      //     projectTypeName: ['Trade Receivable']
      //   },
      // },
      // {
      //   path: 'trEntriesComponent',
      //   component: TEntriesComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head'],
      //     projectTypeName: ['Trade Receivable']
      //   },
      // },
      // {
      //   path: 'trFinalSummaryComponent',
      //   component: TFinalSummaryComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head'],
      //     projectTypeName: ['Trade Receivable']
      //   },
      // },
      // {
      //   path: 'trGroupingSaleComponent',
      //   component: TGroupingSaleComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head'],
      //     projectTypeName: ['Trade Receivable']
      //   },
      // },
      // {
      //   path: 'trProjectsComponent',
      //   component: TProjectsComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head'],
      //     projectTypeName: ['Trade Receivable']
      //   },
      // },
      // {
      //   path: 'trProjectsRrComponent',
      //   component: TProjectsRrComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head'],
      //     projectTypeName: ['Trade Receivable']
      //   },
      // },
      // {
      //   path: 'trRoughSummaryComponent',
      //   component: TRoughSummaryComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head'],
      //     projectTypeName: ['Trade Receivable']
      //   },
      // },
      // {
      //   path: 'trSalesNov2025Component',
      //   component: TSalesNov2025Component,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head'],
      //     projectTypeName: ['Trade Receivable']
      //   },
      // },
      // {
      //   path: 'trUploadComponent',
      //   component: TUploadComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head'],
      //     projectTypeName: ['Trade Receivable']
      //   },
      // },
      //  {
      //   path: 'trUploadCollectionsComponent',
      //   component: UploadCollectionsComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head'],
      //     projectTypeName: ['Trade Receivable']
      //   },
      // },
      // {
      //   path: 'trPmComparisonComponent',
      //   component: TrPmComparisonComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head'],
      //     projectTypeName: ['Trade Receivable']
      //   },
      // },
      // {
      //   path: 'trOpenComparisonComponent',
      //   component: TrOpenComparisonComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head'],
      //     projectTypeName: ['Trade Receivable']
      //   },
      // },
      // {
      //   path: 'trPmAgeingComponent',
      //   component: TrPmAgeingComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head'],
      //     projectTypeName: ['Trade Receivable']
      //   },
      // },
      //   {
      //   path: 'trProjectMarketComponent',
      //   component: TrProjectMarketComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head'],
      //     projectTypeName: ['Trade Receivable']
      //   },
      // },
      // {
      //   path: 'trOpenMarketComponent',
      //   component: TrOpenMarketComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head'],
      //     projectTypeName: ['Trade Receivable']
      //   },
      // },
      // {
      //   path: 'trQueryDataComponent',
      //   component: TrQueryDataComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head'],
      //     projectTypeName: ['Trade Receivable']
      //   },
      // },
      //  {
      //   path: 'trProjectMarketAditionalComponent',
      //   component: TrProjectMarketAditionalComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head'],
      //     projectTypeName: ['Trade Receivable']
      //   },
      // },
      // {
      //   path: 'trOpenAdditionalComponent',
      //   component: TrOpenAdditionalComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head'],
      //     projectTypeName: ['Trade Receivable']
      //   },
      // },
      //  {
      //   path: 'trInstitutionalComponent',
      //   component: TrInstitutionalComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head'],
      //     projectTypeName: ['Trade Receivable']
      //   },
      // },
      //   {
      //   path: 'trAdditionalPddOpenMarketComponent',
      //   component: TrAdditionalPddOpenMarketComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head'],
      //     projectTypeName: ['Trade Receivable']
      //   },
      // },
      //     {
      //   path: 'trCollectionComponent',
      //   component: TrCollectionComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head'],
      //     projectTypeName: ['Trade Receivable']
      //   },
      // },
      //  {
      //   path: 'trSalesComponent',
      //   component: TrSalesComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head'],
      //     projectTypeName: ['Trade Receivable']
      //   },
      // },
      // {
      //   path: 'trSecondaryDiscountComponent',
      //   component: TSecondaryDiscountComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head'],
      //     projectTypeName: ['Trade Receivable']
      //   },
      // },






















      // //Unrecognised Revenue

      // {
      //   path: 'unrecognisedRevenueComponent',
      //   component: UnrecognisedRevenueComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head','Zonal Manager'],
      //     projectTypeName: ['Unrecognised Invoice']
      //   },
      // },
      // {
      //   path: 'urPanIndiaSummaryComponent',
      //   component: UrPanIndiaSummaryComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head','Zonal Manager'],
      //     projectTypeName: ['Unrecognised Invoice']
      //   },
      // },
      // {
      //   path: 'urCogsPanWiseBucketComponent',
      //   component: UrCogsPanWiseBucketComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head','Zonal Manager'],
      //     projectTypeName: ['Unrecognised Invoice']
      //   },
      // },
      // {
      //   path: 'urStateWiseStageComponent',
      //   component: UrStateWiseStageComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head','Zonal Manager'],
      //     projectTypeName: ['Unrecognised Invoice']
      //   },
      // },
      // {
      //   path: 'urCogsStateWiseBucketComponent',
      //   component: UrCogsStateWiseBucketComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head','Zonal Manager'],
      //     projectTypeName: ['Unrecognised Invoice']
      //   },
      // },
      // {
      //   path: 'urAreaWiseAgingComponent',
      //   component: UrAreaWiseAgingComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head','Zonal Manager'],
      //     projectTypeName: ['Unrecognised Invoice']
      //   },
      // },
      // {
      //   path: 'urCogsAreaWiseBucketComponent',
      //   component: UrCogsAreaWiseBucketComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head','Zonal Manager'],
      //     projectTypeName: ['Unrecognised Invoice']
      //   },
      // },

      // {
      //   path: 'unrecogmisedInventoryComponent',
      //   component: UnrecogmisedInventoryComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head','Zonal Manager'],
      //     projectTypeName: ['Unrecognised Invoice']
      //   },
      // },
      // {
      //   path: 'uiPanIndiaSummaryComponent',
      //   component: UiPanIndiaSummaryComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head','Zonal Manager'],
      //     projectTypeName: ['Unrecognised Invoice']
      //   },
      // },
      // {
      //   path: 'urPanIndiaBucketSummaryComponent',
      //   component: UrPanIndiaBucketSummaryComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head','Zonal Manager'],
      //     projectTypeName: ['Unrecognised Invoice']
      //   },
      // },
      // {
      //   path: 'uiStateWiseStageComponent',
      //   component: UiStateWiseStageComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head','Zonal Manager'],
      //     projectTypeName: ['Unrecognised Invoice']
      //   },
      // },
      // {
      //   path: 'urStateWiseAgingBucketComponent',
      //   component: UrStateWiseAgingBucketComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head','Zonal Manager'],
      //     projectTypeName: ['Unrecognised Invoice']
      //   },
      // },
      // {
      //   path: 'uiAreaWiseAgingComponent',
      //   component: UiAreaWiseAgingComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head','Zonal Manager'],
      //     projectTypeName: ['Unrecognised Invoice']
      //   },
      // },
      // {
      //   path: 'urAreaWiseAgingBucketComponent',
      //   component: UrAreaWiseAgingBucketComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head','Zonal Manager'],
      //     projectTypeName: ['Unrecognised Invoice']
      //   },
      // },
      // // {
      // //   path: 'urRemarksComponent',
      // //   component: UrRemarksComponent,
      // //   //canActivate: [authGuard],
      // //   canActivate: [authGuard, rolesBaseGuard],
      // //   data: {
      // //     // expectedRoles: ['National Sales Head','Zonal Manager'],
      // //     projectTypeName: ['Unrecognised Invoice']
      // //   },
      // // },
      // {
      //   path: 'urUploadComponent',
      //   component: UrUploadComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head','Zonal Manager'],
      //     projectTypeName: ['Unrecognised Invoice']
      //   },
      // },
      // {
      //   path: 'UrLogsComponent',
      //   component: UrLogsComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head'],
      //     projectTypeName: ['Unrecognised Invoice']
      //   },
      // },
      // {
      //   path: 'DownloadUploadedFileComponent',
      //   component: DownloadUploadedFileComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head'],
      //     projectTypeName: ['Unrecognised Invoice']
      //   },
      // },
      // {
      //   path: 'urDealerMasterComponent',
      //   component: UrDealerMasterComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head','Zonal Manager'],
      //     projectTypeName: ['Unrecognised Invoice']
      //   },
      // },
      // {
      //   path: 'urUserMasterComponent',
      //   component: UrUserMasterComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head','Zonal Manager'],
      //     projectTypeName: ['Unrecognised Invoice']
      //   },
      // },
      // {
      //   path: 'urStageMasterComponent',
      //   component: UrStageMasterComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head','Zonal Manager'],
      //     projectTypeName: ['Unrecognised Invoice']
      //   },
      // },
      // {
      //   path: 'urStateFactorComponent',
      //   component: UrStateFactorComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head','Zonal Manager'],
      //     projectTypeName: ['Unrecognised Invoice']
      //   },
      // },
      // {
      //   path: 'urRemarksMasterComponent',
      //   component: UrRemarksMasterComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head','Zonal Manager'],
      //     projectTypeName: ['Unrecognised Invoice']
      //   },
      // },
      // {
      //   path: 'urUsersLogsComponent',
      //   component: UrUsersLogsComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head','Zonal Manager'],
      //     projectTypeName: ['Unrecognised Invoice']
      //   },
      // },
      // {
      //   path: 'urAuditLogsComponent',
      //   component: UrAuditLogsComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head','Zonal Manager'],
      //     projectTypeName: ['Unrecognised Invoice']
      //   },
      // },






















      // //project business
      // {
      //   path: 'pbDashboardComponent',
      //   component: DashboardComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head'],
      //     projectTypeName: ['Project Business']
      //   },
      // },
      // {
      //   path: 'pbProjectManagementComponent',
      //   component: PbProjectManagementComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head'],
      //     projectTypeName: ['Project Business']
      //   },
      // },
      // {
      //   path: 'pbEditCostEstimationComponent',
      //   component: PbEditCostEstimationComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head'],
      //     projectTypeName: ['Project Business']
      //   },
      // },
      // {
      //   path: 'pbAddNewProjectComponent',
      //   component: PbAddNewProjectComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head'],
      //     projectTypeName: ['Project Business']
      //   },
      // },
      // {
      //   path: 'pbAddCostEstimationComponent',
      //   component: PbAddCostEstimationComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head'],
      //     projectTypeName: ['Project Business']
      //   },
      // },
      // {
      //   path: 'pbCostEstimationComponent',
      //   component: PbCostEstimationComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head'],
      //     projectTypeName: ['Project Business']
      //   },
      // },
      // {
      //   path: 'pbViewCostEstimationComponent',
      //   component: PbViewCostEstimationComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head'],
      //     projectTypeName: ['Project Business']
      //   },
      // },
      // {
      //   path: 'pbFtmEntriesComponent',
      //   component: PbFtmEntriesComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head'],
      //     projectTypeName: ['Project Business']
      //   },
      // },
      //      {
      //   path: 'pbUnrecognisedProjectsComponent',
      //   component: PbUnrecognisedProjectsComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head'],
      //     projectTypeName: ['Project Business']
      //   },
      // },
      // {
      //   path: 'pbWorkOrderAgreementsComponent',
      //   component: PbWorkOrderAgreementsComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head'],
      //     projectTypeName: ['Project Business']
      //   },
      // },
      // {
      //   path: 'pbPurchaseOrderComponent',
      //   component: PbPurchaseOrderComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head'],
      //     projectTypeName: ['Project Business']
      //   },
      // },
      // {
      //   path: 'pbExpenceTrackingComponent',
      //   component: PbExpenceTrackingComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head'],
      //     projectTypeName: ['Project Business']
      //   },
      // },
      // {
      //   path: 'pbStageProgressionComponent',
      //   component: PbStageProgressionComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head'],
      //     projectTypeName: ['Project Business']
      //   },
      // },
      // {
      //   path: 'pbReportingAnalyticsComponent',
      //   component: PbReportingAnalyticsComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head'],
      //     projectTypeName: ['Project Business']
      //   },
      // },
      // {
      //   path: 'pbUserRoleManagementComponent',
      //   component: PbUserRoleManagementComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head'],
      //     projectTypeName: ['Project Business']
      //   },
      // },
      // {
      //   path: 'pbManageVendorComponent',
      //   component: PbManageVendorComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head'],
      //     projectTypeName: ['Project Business']
      //   },
      // },
      // {
      //   path: 'pbManageCustomerComponent',
      //   component: PbManageCustomerComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head'],
      //     projectTypeName: ['Project Business']
      //   },
      // },
      // {
      //   path: 'pbManageExpenseHeadComponent',
      //   component: PbManageExpenseHeadComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head'],
      //     projectTypeName: ['Project Business']
      //   },
      // },
      // {
      //   path: 'pbAllProjectAnalyticsComponent',
      //   component: PbAllProjectAnalyticsComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head'],
      //     projectTypeName: ['Project Business']
      //   },
      // },



      // // fixasset
      // {
      //   path: 'faDashboardComponent',
      //   component: FaDashboardComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head'],
      //     projectTypeName: ['Fixed Asset']
      //   },
      // },
      // {
      //   path: 'faCampaignsComponent',
      //   component: FaCampaignsComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head'],
      //     projectTypeName: ['Fixed Asset']
      //   },
      // },
      // {
      //   path: 'faAssetMasteraComponent',
      //   component: FaAssetMasteraComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head'],
      //     projectTypeName: ['Fixed Asset']
      //   },
      // },
      // {
      //   path: 'faUploaddataComponent',
      //   component: FaUploaddataComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head'],
      //     projectTypeName: ['Fixed Asset']
      //   },
      // },
      // {
      //   path: 'faGhostAssetComponent',
      //   component: FaGhostAssetComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head'],
      //     projectTypeName: ['Fixed Asset']
      //   },
      // },
      // {
      //   path: 'faExcelReportsComponent',
      //   component: FaExcelReportsComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head'],
      //     projectTypeName: ['Fixed Asset']
      //   },
      // },
      // {
      //   path: 'faScannedHistoryComponent',
      //   component: FaScannedHistoryComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head'],
      //     projectTypeName: ['Fixed Asset']
      //   },
      // },

      // {
      //   path: 'faVerifiedAssetComponent',
      //   component: FaVerifiedAssetComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head'],
      //     projectTypeName: ['Fixed Asset']
      //   },
      // },

      // {
      //   path: 'faManuelReportComponent',
      //   component: FaManuelReportComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head'],
      //     projectTypeName: ['Fixed Asset']
      //   },
      // },

      // {
      //   path: 'faGhostReportComponent',
      //   component: FaGhostReportComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head'],
      //     projectTypeName: ['Fixed Asset']
      //   },
      // },
      // {
      //   path: 'faMarknotAvailaleReportComponent',
      //   component: FaMarknotAvailaleReportComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head'],
      //     projectTypeName: ['Fixed Asset']
      //   },
      // },

      // {
      //   path: 'faNonTaggableReportComponent',
      //   component: FaNonTaggableReportComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head'],
      //     projectTypeName: ['Fixed Asset']
      //   },
      // },
      // {
      //   path: 'faCreateUserComponent',
      //   component: faCreateUserComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head'],
      //     projectTypeName: ['Fixed Asset']
      //   },
      // },
      // {
      //   path: 'faPendingVerifiedAssetReportComponent',
      //   component: FaPendingVerifiedAssetReportComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head'],
      //     projectTypeName: ['Fixed Asset']
      //   },
      // },









      // //common

      // //settings
      // {
      //   path: 'urAccessComponent',
      //   component: UrAccessComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head'],
      //     projectTypeName: ['Scrapper', 'Trade Receivable', 'Unrecognised Invoice', 'Project Business']
      //   },
      // },
      // {
      //   path: 'urAccessLevelsComponent',
      //   component: UrAccessLevelsComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head'],
      //     projectTypeName: ['Scrapper', 'Trade Receivable', 'Unrecognised Invoice', 'Project Business']
      //   },
      // },
      // {
      //   path: 'urAreasComponent',
      //   component: UrAreasComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head'],
      //     projectTypeName: ['Scrapper', 'Trade Receivable', 'Unrecognised Invoice', 'Project Business']
      //   },
      // },
      // {
      //   path: 'urRegionsComponent',
      //   component: UrRegionsComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head'],
      //     projectTypeName: ['Scrapper', 'Trade Receivable', 'Unrecognised Invoice', 'Project Business']
      //   },
      // },
      // {
      //   path: 'urRolesComponent',
      //   component: UrRolesComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head'],
      //     projectTypeName: ['Scrapper', 'Trade Receivable', 'Unrecognised Invoice', 'Project Business']
      //   },
      // },
      // {
      //   path: 'urStatesComponent',
      //   component: UrStatesComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head'],
      //     projectTypeName: ['Scrapper', 'Trade Receivable', 'Unrecognised Invoice', 'Project Business']
      //   },
      // },
      // {
      //   path: 'urZonesComponent',
      //   component: UrZonesComponent,
      //   //canActivate: [authGuard],
      //   canActivate: [authGuard, rolesBaseGuard],
      //   data: {
      //     // expectedRoles: ['National Sales Head'],
      //     projectTypeName: ['Scrapper', 'Trade Receivable', 'Unrecognised Invoice', 'Project Business']
      //   },
      // },





    ],
  },

];
