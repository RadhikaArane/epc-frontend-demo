export interface HORPmCompResModel {
  AsOn: string
  MonthLabel: string
  Items: PmCompItem[]
  TotalFP: number
  TotalInspDone: number
  TotalInspPendLt90: number
  TotalInspPendGt90: number
}

export interface PmCompItem {
  State: string
  ZonalManager: string
  FP: number
  InspDone: number
  InspPendLt90: number
  InspPendGt90: number
}

//========= Open Market =============

export interface ProjectMarketItems {
  statusCode: number
  message: string
  month: number
  year: number
  tableName: string
  ageingColumnName: string
  previousMonth: number
  previousYear: number
  stateWiseData: StateWiseDays[]
  currentMonthTotals: CurrentMonthTotals
  previousMonthTotals: PreviousMonthTotals
}

export interface StateWiseDays {
  state: string
  zonalManager: string
  opOsIncluPDD: number
  unbookedCollection: number
  pdd: number
  opOsExcluPDDIncluRetention: number
  retention: number
  daysLessThan30: number
  days30To60: number
  days60To90: number
  days90To120: number
  days120To180: number
  days180To365: number
  days1YrTo2Yr: number
  daysGreaterThan2Yr: number
  opFPClear: number
  inspectionDone: number
  inspectionDueLessThan90Days: number
  inspectionDueGreaterThan90Days: number
  inspPendPercentage: number
}

export interface CurrentMonthTotals {
  totalStates: number
  opOsIncluPDD: number
  unbookedCollection: number
  pdd: number
  opOsExcluPDDIncluRetention: number
  retention: number
  daysLessThan30: number
  days30To60: number
  days60To90: number
  days90To120: number
  days120To180: number
  days180To365: number
  days1YrTo2Yr: number
  daysGreaterThan2Yr: number
  opFPClear: number
  inspectionDone: number
  inspectionDueLessThan90Days: number
  inspectionDueGreaterThan90Days: number
  inspPendPercentage: number
}

export interface PreviousMonthTotals {
  opOsIncluPDD: number
  unbookedCollection: number
  pdd: number
  opOsExcluPDDIncluRetention: number
  retention: number
  daysLessThan30: number
  days30To60: number
  days60To90: number
  days90To120: number
  days120To180: number
  days180To365: number
  days1YrTo2Yr: number
  daysGreaterThan2Yr: number
  opFPClear: number
  inspectionDone: number
  inspectionDueLessThan90Days: number
  inspectionDueGreaterThan90Days: number
  inspPendPercentage: number
}


//===================================


// =========== Project-MArket-Additional ================

export interface ProjectMarketAddItems {
  statusCode: number
  message: string
  month: number
  year: number
  tableName: string
  ageingColumnName: string
  previousMonth: number
  previousYear: number
  unbookedCollectionBreakdown: UnbookedCollectionBreakdown
  stateWiseData: StateWiseDaum[]
  currentMonthTotals: CurrentMonthTotals
}

export interface UnbookedCollectionBreakdown {
  Karnataka: number
  "Madhya Pradesh": number
  "Tamil Nadu": number
  Telangana: number
  "Andhra Pradesh": number
}

export interface StateWiseDaum {
  state: string
  zonalManager: string
  fpClear_Lt30: number
  fpClear_30To60: number
  fpClear_60To90: number
  fpClear_90To120: number
  fpClear_120To180: number
  fpClear_180To365: number
  fpClear_Gt365: number
  fpClear_Unbooked: number
  fpClear_SubTotal: number
  inspDone_Lt30: number
  inspDone_30To60: number
  inspDone_60To90: number
  inspDone_90To120: number
  inspDone_120To180: number
  inspDone_180To365: number
  inspDone_Gt365: number
  inspDone_SubTotal: number
  offeredLt90_Lt30: number
  offeredLt90_30To60: number
  offeredLt90_60To90: number
  offeredLt90_SubTotal: number
  offeredGt90_90To120: number
  offeredGt90_120To180: number
  offeredGt90_180To365: number
  offeredGt90_Gt365: number
  offeredGt90_SubTotal: number
  grandTotal: number
}

export interface CurrentMonthTotals {
  totalStates: number
  fpClear_Lt30: number
  fpClear_30To60: number
  fpClear_60To90: number
  fpClear_90To120: number
  fpClear_120To180: number
  fpClear_180To365: number
  fpClear_Gt365: number
  fpClear_Unbooked: number
  fpClear_Total: number
  inspDone_Lt30: number
  inspDone_30To60: number
  inspDone_60To90: number
  inspDone_90To120: number
  inspDone_120To180: number
  inspDone_180To365: number
  inspDone_Gt365: number
  inspDone_Total: number
  offeredLt90_Lt30: number
  offeredLt90_30To60: number
  offeredLt90_60To90: number
  offeredLt90_Total: number
  offeredGt90_90To120: number
  offeredGt90_120To180: number
  offeredGt90_180To365: number
  offeredGt90_Gt365: number
  offeredGt90_Total: number
}

// ============================================================