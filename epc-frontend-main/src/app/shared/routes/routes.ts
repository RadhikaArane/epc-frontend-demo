export class routes {
  private static Url = '';
  // static faCreateUserComponent: string | undefined;

  public static get baseUrl(): string {
    return this.Url;
  }


  public static get signin(): string {
    return this.baseUrl + '/signin';
  }
  public static get signup(): string {
    return this.baseUrl + '/signup';
  }


  public static get orderDetails(): string {
    return this.baseUrl + '/orderDetails';
  }
  public static get resetPassword(): string {
    return this.baseUrl + '/reset-password';
  }
  public static get forgotPassword(): string {
    return this.baseUrl + '/forgot-password';
  }
  public static get changePassword(): string {
    return this.baseUrl + '/changePassword';
  }
  public static get success(): string {
    return this.baseUrl + '/success';
  }
  public static get success2(): string {
    return this.baseUrl + '/success-2';
  }
  public static get success3(): string {
    return this.baseUrl + '/success-3';
  }

  // page routes

  // mahindra router
  // public static get maslindex(): string {
  // return  this.baseUrl + 'maslindex';
  // }
  // public static get dealerDashboard(): string {
  //   return this.baseUrl + '/dealerDashboard';
  //   }

  //Trade Receivable
  // public static get trDashboardComponent(): string {
  //   return this.baseUrl + '/trDashboardComponent';
  //   }





  // page routes

  // mahindra router

  //scrapper

  // public static get scrapperMenuList(): string {
  //   return this.baseUrl + '/scrapperMenuList';
  // }
  // public static get scrDashboardComponent(): string {
  //   return this.baseUrl + '/scrDashboardComponent';
  // }
  // public static get scrAPComponent(): string {
  //   return this.baseUrl + '/scrAPComponent';
  // }
  // public static get scrCGComponent(): string {
  //   return this.baseUrl + '/scrCGComponent';
  // }
  // public static get scrGJComponent(): string {
  //   return this.baseUrl + '/scrGJComponent';
  // }
  // public static get scrKAHComponent(): string {
  //   return this.baseUrl + '/scrKAHComponent';
  // }
  // public static get scrKAKComponent(): string {
  //   return this.baseUrl + '/scrKAKComponent';
  // }
  // public static get scrMPComponent(): string {
  //   return this.baseUrl + '/scrMPComponent';
  // }
  // public static get scrTNComponent(): string {
  //   return this.baseUrl + '/scrTNComponent';
  // }
  // public static get scrTGComponent(): string {
  //   return this.baseUrl + '/scrTGComponent';
  // }
  // public static get scrUPComponent(): string {
  //   return this.baseUrl + '/scrUPComponent';
  // }
  // public static get scrWBComponent(): string {
  //   return this.baseUrl + '/scrWBComponent';
  // }




  // public static get scrJobStatusComponent(): string {
  //   return this.baseUrl + '/scrJobStatusComponent';
  // }
  // public static get scrRunJobsComponent(): string {
  //   return this.baseUrl + '/scrRunJobsComponent';
  // }
  // public static get scrManualUploadComponent(): string {
  //   return this.baseUrl + '/scrManualUploadComponent';
  // }
  // public static get scrStatePortalsComponent(): string {
  //   return this.baseUrl + '/scrStatePortalsComponent';
  // }
  // public static get scrAllLogsComponent(): string {
  //   return this.baseUrl + '/scrAllLogsComponent';
  // }
  // public static get urShowDataComponent(): string {
  //   return this.baseUrl + '/urShowDataComponent';
  // }
  // public static get scrapperLogsComponent(): string {
  //   return this.baseUrl + '/scrapperLogsComponent';
  // }
  // public static get scrUserLogsComponent(): string {
  //   return this.baseUrl + '/scrUserLogsComponent';
  // }
  // public static get scrManageJobsComponent(): string {
  //   return this.baseUrl + '/scrManageJobsComponent';
  // }
  // public static get addSidebarMenuComponent(): string {
  //   return this.baseUrl + '/addSidebarMenuComponent';
  // }
  // public static get sideMenuAccessComponent(): string {
  //   return this.baseUrl + '/sideMenuAccessComponent';
  // }












  //Unrecognised
  // public static get unrecognisedMenuList(): string {
  //   return this.baseUrl + '/unrecognisedMenuList';
  // }
  // public static get unrecognisedRevenueComponent(): string {
  //   return this.baseUrl + '/unrecognisedRevenueComponent';
  // }
  // public static get urPanIndiaSummaryComponent(): string {
  //   return this.baseUrl + '/urPanIndiaSummaryComponent';
  // }
  // public static get urCogsPanWiseBucketComponent(): string {
  //   return this.baseUrl + '/urCogsPanWiseBucketComponent';
  // }
  // public static get urStateWiseStageComponent(): string {
  //   return this.baseUrl + '/urStateWiseStageComponent';
  // }
  // public static get urCogsStateWiseBucketComponent(): string {
  //   return this.baseUrl + '/urCogsStateWiseBucketComponent';
  // }
  // public static get urAreaWiseAgingComponent(): string {
  //   return this.baseUrl + '/urAreaWiseAgingComponent';
  // }
  // public static get urCogsAreaWiseBucketComponent(): string {
  //   return this.baseUrl + '/urCogsAreaWiseBucketComponent';
  // }

  // public static get unrecogmisedInventoryComponent(): string {
  //   return this.baseUrl + '/unrecogmisedInventoryComponent';
  // }
  // public static get uiPanIndiaSummaryComponent(): string {
  //   return this.baseUrl + '/uiPanIndiaSummaryComponent';
  // }
  // public static get urPanIndiaBucketSummaryComponent(): string {
  //   return this.baseUrl + '/urPanIndiaBucketSummaryComponent';
  // }
  // public static get uiStateWiseStageComponent(): string {
  //   return this.baseUrl + '/uiStateWiseStageComponent';
  // }
  // public static get urStateWiseAgingBucketComponent(): string {
  //   return this.baseUrl + '/urStateWiseAgingBucketComponent';
  // }
  // public static get uiAreaWiseAgingComponent(): string {
  //   return this.baseUrl + '/uiAreaWiseAgingComponent';
  // }
  // public static get urAreaWiseAgingBucketComponent(): string {
  //   return this.baseUrl + '/urAreaWiseAgingBucketComponent';
  // }
  // public static get urRemarksComponent(): string {
  //   return this.baseUrl + '/urRemarksComponent';
  // }
  // public static get urUploadComponent(): string {
  //   return this.baseUrl + '/urUploadComponent';
  // }
  // public static get urDealerMasterComponent(): string {
  //   return this.baseUrl + '/urDealerMasterComponent';
  // }
  // public static get urUserMasterComponent(): string {
  //   return this.baseUrl + '/urUserMasterComponent';
  // }
  // public static get urStageMasterComponent(): string {
  //   return this.baseUrl + '/urStageMasterComponent';
  // }
  // public static get urStateFactorComponent(): string {
  //   return this.baseUrl + '/urStateFactorComponent';
  // }
  // public static get urRemarksMasterComponent(): string {
  //   return this.baseUrl + '/urRemarksMasterComponent';
  // }
  // public static get urUsersLogsComponent(): string {
  //   return this.baseUrl + '/urUsersLogsComponent';
  // }
  // public static get urAuditLogsComponent(): string {
  //   return this.baseUrl + '/urAuditLogsComponent';
  // }
  // public static get UrLogsComponent(): string {
  //   return this.baseUrl + '/UrLogsComponent';
  // }
  // public static get DownloadUploadedFileComponent(): string {
  //   return this.baseUrl + '/DownloadUploadedFileComponent';
  // }

  //settings

  // public static get urAccessComponent(): string {
  //   return this.baseUrl + '/urAccessComponent';
  // }
  // public static get urAccessLevelsComponent(): string {
  //   return this.baseUrl + '/urAccessLevelsComponent';
  // }
  // public static get urAreasComponent(): string {
  //   return this.baseUrl + '/urAreasComponent';
  // }
  // public static get urRegionsComponent(): string {
  //   return this.baseUrl + '/urRegionsComponent';
  // }
  // public static get urRolesComponent(): string {
  //   return this.baseUrl + '/urRolesComponent';
  // }
  // public static get urStatesComponent(): string {
  //   return this.baseUrl + '/urStatesComponent';
  // }
  // public static get urZonesComponent(): string {
  //   return this.baseUrl + '/urZonesComponent';
  // }










  //trade receivable

  // public static get tradeMenuList(): string {
  //   return this.baseUrl + '/tradeMenuList';
  // }
  public static get trManagerDashboardComponent(): string {
    return this.baseUrl + '/trManagerDashboardComponent';
  }
  // public static get trStageMasterComponent(): string {
  //   return this.baseUrl + '/trStageMasterComponent';
  // }
  // public static get creditReportComponent(): string {
  //   return this.baseUrl + '/creditReportComponent';
  // }
  // public static get debitReportComponent(): string {
  //   return this.baseUrl + '/debitReportComponent';
  // }
  // public static get headOfficeReviewComponent(): string {
  //   return this.baseUrl + '/headOfficeReviewComponent';
  // }
  // public static get customerOutstandingComponent(): string {
  //   return this.baseUrl + '/customerOutstandingComponent';
  // }
  // public static get tRUserMasterComponent(): string {
  //   return this.baseUrl + '/tRUserMasterComponent';
  // }
  // public static get trUserLogComponent(): string {
  //   return this.baseUrl + '/trUserLogComponent';
  // }
  // public static get trSapDumpLogComponent(): string {
  //   return this.baseUrl + '/trSapDumpLogComponent';
  // }
  // public static get trWorkingSheetComponent(): string {
  //   return this.baseUrl + '/trWorkingSheetComponent';
  // }
  // public static get trHistoricalReportsComponent(): string {
  //   return this.baseUrl + '/trHistoricalReportsComponent';
  // }
  // public static get trOneLineSummaryComponent(): string {
  //   return this.baseUrl + '/trOneLineSummaryComponent';
  // }
  // public static get trUploadSapFilesComponent(): string {
  //   return this.baseUrl + '/trUploadSapFilesComponent';
  // }
  // public static get trEntriesComponent(): string {
  //   return this.baseUrl + '/trEntriesComponent';
  // }
  // public static get trFinalSummaryComponent(): string {
  //   return this.baseUrl + '/trFinalSummaryComponent';
  // }
  // public static get trGroupingSaleComponent(): string {
  //   return this.baseUrl + '/trGroupingSaleComponent';
  // }
  // public static get trProjectsComponent(): string {
  //   return this.baseUrl + '/trProjectsComponent';
  // }
  // public static get trProjectsRrComponent(): string {
  //   return this.baseUrl + '/trProjectsRrComponent';
  // }
  // public static get trRoughSummaryComponent(): string {
  //   return this.baseUrl + '/trRoughSummaryComponent';
  // }
  // public static get trSalesNov2025Component(): string {
  //   return this.baseUrl + '/trSalesNov2025Component';
  // }
  // public static get trUploadComponent(): string {
  //   return this.baseUrl + '/trUploadComponent';
  // }
  //  public static get trUploadCollectionsComponent(): string {
  //   return this.baseUrl + '/trUploadCollectionsComponent';
  // }
  // public static get trPmComparisonComponent(): string {
  //   return this.baseUrl + '/trPmComparisonComponent';
  // }
  // public static get trOpenComparisonComponent(): string {
  //   return this.baseUrl + '/trOpenComparisonComponent';
  // }
  // public static get trPmAgeingComponent(): string {
  //   return this.baseUrl + '/trPmAgeingComponent';
  // }
  // public static get trProjectMarketComponent(): string {
  //   return this.baseUrl + '/trProjectMarketComponent';
  // }
  // public static get trOpenMarketComponent(): string {
  //   return this.baseUrl + '/trOpenMarketComponent';
  // }
  // public static get trQueryDataComponent(): string {
  //   return this.baseUrl + '/trQueryDataComponent';
  // }
  // public static get trProjectMarketAditionalComponent(): string {
  //   return this.baseUrl + '/trProjectMarketAditionalComponent';
  // }
  // public static get trOpenAdditionalComponent(): string {
  //   return this.baseUrl + '/trOpenAdditionalComponent';
  // }
  // public static get trInstitutionalComponent(): string {
  //   return this.baseUrl + '/trInstitutionalComponent';
  // }
  // public static get trAdditionalPddOpenMarketComponent(): string {
  //   return this.baseUrl + '/trAdditionalPddOpenMarketComponent';
  // }
  // public static get trCollectionComponent(): string {
  //   return this.baseUrl + '/trCollectionComponent';
  // }
  // public static get trSalesComponent(): string {
  //   return this.baseUrl + '/trSalesComponent';
  // }
  // public static get trSecondaryDiscountComponent(): string {
  //   return this.baseUrl + '/trSecondaryDiscountComponent';
  // }


















  //projectbusiness  

  // public static get projectBMenuList(): string {
  //   return this.baseUrl + '/projectBMenuList';
  // }
  // public static get pbDashboardComponent(): string {
  //   return this.baseUrl + '/pbDashboardComponent';
  // }
  // public static get pbProjectManagementComponent(): string {
  //   return this.baseUrl + '/pbProjectManagementComponent';
  // }
  // public static get pbEditCostEstimationComponent(): string {
  //   return this.baseUrl + '/pbEditCostEstimationComponent';
  // }
  // public static get pbAddNewProjectComponent(): string {
  //   return this.baseUrl + '/pbAddNewProjectComponent';
  // }
  // public static get pbAddCostEstimationComponent(): string {
  //   return this.baseUrl + '/pbAddCostEstimationComponent';
  // }
  // public static get pbCostEstimationComponent(): string {
  //   return this.baseUrl + '/pbCostEstimationComponent';
  // }
  // public static get pbViewCostEstimationComponent(): string {
  //   return this.baseUrl + '/pbViewCostEstimationComponent';
  // }
  // public static get pbFtmEntriesComponent(): string {
  //   return this.baseUrl + '/pbFtmEntriesComponent';
  // }
  // public static get pbUnrecognisedProjectsComponent(): string {
  //   return this.baseUrl + '/pbUnrecognisedProjectsComponent';
  // }
  // public static get pbWorkOrderAgreementsComponent(): string {
  //   return this.baseUrl + '/pbWorkOrderAgreementsComponent';
  // }
  // public static get pbPurchaseOrderComponent(): string {
  //   return this.baseUrl + '/pbPurchaseOrderComponent';
  // }
  // public static get pbExpenceTrackingComponent(): string {
  //   return this.baseUrl + '/pbExpenceTrackingComponent';
  // }
  // public static get pbStageProgressionComponent(): string {
  //   return this.baseUrl + '/pbStageProgressionComponent';
  // }
  // public static get pbReportingAnalyticsComponent(): string {
  //   return this.baseUrl + '/pbReportingAnalyticsComponent';
  // }
  // public static get pbUserRoleManagementComponent(): string {
  //   return this.baseUrl + '/pbUserRoleManagementComponent';
  // }
  // public static get pbManageVendorComponent(): string {
  //   return this.baseUrl + '/pbManageVendorComponent';
  // }
  // public static get pbManageCustomerComponent(): string {
  //   return this.baseUrl + '/pbManageCustomerComponent';
  // }
  // public static get pbManageExpenseHeadComponent(): string {
  //   return this.baseUrl + '/pbManageExpenseHeadComponent';
  // }
  // public static get pbAllProjectAnalyticsComponent(): string {
  //   return this.baseUrl + '/pbAllProjectAnalyticsComponent';
  // }



  // fixasset

  // public static get fixedassetMenuList(): string {
  //   return this.baseUrl + '/fixedassetMenuList';
  // }
  // public static get faDashboardComponent(): string {
  //   return this.baseUrl + '/faDashboardComponent';
  // }
  // public static get faCampaignsComponent(): string {
  //   return this.baseUrl + '/faCampaignsComponent';
  // }
  // public static get faAssetMasteraComponent(): string {
  //   return this.baseUrl + '/faAssetMasteraComponent';
  // }
  // public static get faUploaddataComponent(): string {
  //   return this.baseUrl + '/faUploaddataComponent';
  // }
  // public static get faGhostAssetComponent(): string {
  //   return this.baseUrl + '/faGhostAssetComponent';
  // }
  // public static get faReportsComponent(): string {
  //   return this.baseUrl + '/faReportsComponent';
  // }
  // public static get faExcelReportsComponent(): string {
  //   return this.baseUrl + '/faExcelReportsComponent';
  // }
  // public static get faScannedHistoryComponent(): string {
  //   return this.baseUrl + '/faScannedHistoryComponent';
  // }
  // public static get faVerifiedAssetComponent(): string {
  //   return this.baseUrl + '/faVerifiedAssetComponent';
  // }
  // public static get faManuelReportComponent(): string {
  //   return this.baseUrl + '/faManuelReportComponent';
  // }
  // public static get faGhostReportComponent(): string {
  //   return this.baseUrl + '/faGhostReportComponent';
  // }
  // public static get faMarknotAvailaleReportComponent(): string {
  //   return this.baseUrl + '/faMarknotAvailaleReportComponent';
  // }
  // public static get faNonTaggableReportComponent(): string {
  //   return this.baseUrl + '/faNonTaggableReportComponent';
  // }
  // public static get faCreateUserComponent(): string {
  //   return this.baseUrl + '/faCreateUserComponent';
  // }
  // public static get faPendingVerifiedAssetReportComponent(): string {
  //   return this.baseUrl + '/faPendingVerifiedAssetReportComponent';
  // }
}
