import { Component, inject, signal, ViewChild, computed, ElementRef, OnInit, OnDestroy } from "@angular/core";
import { ChartComponent, NgApexchartsModule } from "ng-apexcharts";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { Subject, takeUntil } from "rxjs";

import { ApexNonAxisChartSeries, ApexResponsive, ApexChart, ApexLegend } from "ng-apexcharts";

import { breadCrumbItems } from "../../../../shared/models/models";
import { BreadcrumbsComponent } from "../../../common/breadcrumbs/breadcrumbs.component";
import { TrDashboardService } from "../../../../shared/services/tradeReceivable/tr-dashboard.service";
import { AuthService } from "../../../../shared/services/common/auth.service";
import { ToastService } from "../../../../shared/services/componentServices/toast.service";
import { ConfirmationDialogService } from "../../../../shared/services/componentServices/confirmation-dialog.service";

import { ReceivablesData, CollectionsResponse, MonthlyCollection, TotalCollection, Recognised, Unrecognised, Total, MonthlyUploadStatusResponse } from "../../../../shared/models/tradeReceivable-models/trDashboard";

declare var bootstrap: any;

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: string[];
  colors: string[];
  legend: ApexLegend;
  dataLabels?: any;
  tooltip?: any;
  plotOptions: any;
};

export interface ChecklistItem {
  key: 'IsFbl5nAvailable' | 'IsSalesFtmAvailable' | 'IsPddUploaded' | 'IsUnbookedCollectionUploaded' | 'IsProjectBusinessAvailable' | 'IsDebitGenerated';
  label: string;
  trueText: string;
  falseText: string;
}

@Component({
  selector: 'app-tr-manager-dashboard',
  standalone: true,
  imports: [NgApexchartsModule, BreadcrumbsComponent, FormsModule, CommonModule],
  templateUrl: './tr-manager-dashboard.component.html',
  styleUrl: './tr-manager-dashboard.component.scss'
})
export class TrManagerDashboardComponent implements OnInit, OnDestroy {

  tradeSrv = inject(TrDashboardService);
  authSrv = inject(AuthService);
  toastSrv = inject(ToastService);
  confirmationDialogSrv = inject(ConfirmationDialogService);

  breadCrumbItems = signal<breadCrumbItems[]>([]);

  // Global Filters
  currencyUnit = signal<string>('Lakhs');
  selectedState = signal<string>('All');
  selectedMonthYear = signal<string>(this.getDefaultLastMonth());
  selectedYear = computed(() => parseInt(this.selectedMonthYear().split('-')[0], 10));

  // Portal Filters
  receivablePortalDates = signal<string[]>([]);
  selectedDate = signal<string>('');
  selectedPortalMonthYear = signal<string>(this.getDefaultLastMonth());

  // Loading States
  isLoading = signal<boolean>(false);
  isCollectionsLoading = signal<boolean>(false);
  isSalesLoading = signal<boolean>(false);

  // ==========================================
  // GENERATE REPORT / LOCK STATES
  // ==========================================
  isReportGenerated = signal<boolean>(false); 
  uploadStatus = signal<MonthlyUploadStatusResponse | null>(null);
  isUploadStatusLoading = signal<boolean>(false);
  
  @ViewChild('generateReportModal') generateReportModal!: ElementRef;
  // ==========================================

  // Receivables Data
  receivablesData = signal<ReceivablesData | null>(null);
  pmTotal = signal<number>(0);
  omTotal = signal<number>(0);
  pbTotal = signal<number>(0);
  instTotal = signal<number>(0);

  receivablesGrandTotal = computed(() => {
    const data = this.receivablesData();
    if (!data) return 0;
    if (this.selectedState() !== 'All') {
      return data.Pm.Total + data.Om.Total;
    }
    return data.Pm.Total + data.Om.Total + data.Pb.Total + data.InstOthers.Total;
  });

  // Collections data 
  collectionsData = signal<MonthlyCollection[]>([]);
  totalCollectionsData = signal<TotalCollection | null>(null);
  pmCollectionTotal = signal<number>(0);
  omCollectionTotal = signal<number>(0);
  pbCollectionTotal = signal<number>(0);
  instCollectionTotal = signal<number>(0);
  
  collectionsGrandTotal = computed(() =>
    this.pmCollectionTotal() + this.omCollectionTotal() +
    this.pbCollectionTotal() + this.instCollectionTotal()
  );

  // Sales data
  salesRecognised = signal<Recognised | null>(null);
  salesUnrecognised = signal<Unrecognised | null>(null);
  salesTotal = signal<Total | null>(null);
  salesUpto = signal<string>('');
  salesAsOn = signal<string>('');
  salesPmTotal = signal<number>(0);
  salesOmTotal = signal<number>(0);
  salesPbTotal = signal<number>(0);
  salesInstTotal = signal<number>(0);

  // Charts
  @ViewChild("chart") chart!: ChartComponent;
  public unrecognisedChartOptions = signal<ChartOptions | null>(null);
  public receivablesChartOptions = signal<ChartOptions | null>(null);
  public collectionsChartOptions = signal<ChartOptions | null>(null);

  allStates: string[] = [
    'All',
    'Andhra Pradesh',
    // 'Bihar',          
    'Chhattisgarh',
    'Gujarat',
    'Karnataka',
    'Kerala',
    'Madhya Pradesh',
    'Maharashtra',
    'Rajasthan',
    'Tamil Nadu',
    'Telangana',
    'Uttar Pradesh',
    'West Bengal',
  ];

  userName = signal(this.authSrv.userDetails?.name);
  private destroy$ = new Subject<void>();

  constructor() {
    this.breadCrumbItems.set([{ label: 'Dashboard' }]);
  }

  ngOnInit(): void {
    this.loadCollections();
    this.loadSales();
    this.checkAutoUnlockReceivables();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ==========================================
  // DYNAMIC CHECKLIST CONFIG
  // ==========================================
  reportChecklist: ChecklistItem[] = [
    { key: 'IsFbl5nAvailable', label: 'FBL5N', trueText: 'Available', falseText: 'Missing' },
    { key: 'IsSalesFtmAvailable', label: 'Sales FTM', trueText: 'Available', falseText: 'Missing' },
    { key: 'IsPddUploaded', label: 'PDD', trueText: 'Uploaded', falseText: 'Missing' },
    { key: 'IsUnbookedCollectionUploaded', label: 'Unbooked Collection', trueText: 'Uploaded', falseText: 'Missing' },
    { key: 'IsProjectBusinessAvailable', label: 'Project Business', trueText: 'Available', falseText: 'Missing' },
    { key: 'IsDebitGenerated', label: 'Debit', trueText: 'Generated', falseText: 'Not Generated' }
  ];

  getChecklistValue(key: ChecklistItem['key']): boolean {
    const status = this.uploadStatus();
    return status ? !!status[key] : false;
  }

  toggleChecklistValue(key: ChecklistItem['key'], event: Event): void {
    const status = this.uploadStatus();
    if (status) {
      const isChecked = (event.target as HTMLInputElement).checked;
      this.uploadStatus.set({ ...status, [key]: isChecked });
    }
  }

  // ==========================================
  // GENERATE REPORT (PRE-FLIGHT CHECK) LOGIC
  // ==========================================

  openGenerateReportModal(source: 'global' | 'receivables' = 'global'): void {
    if (this.generateReportModal) {
      const modal = new bootstrap.Modal(this.generateReportModal.nativeElement);
      modal.show();
    }

    this.isUploadStatusLoading.set(true);

    const { month, year } = source === 'receivables' 
      ? this.parsePortalMonthYear() 
      : this.parseMonthYear();

    this.tradeSrv._getMonthlyUploadStatus(month, year)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.uploadStatus.set(res);
          this.isUploadStatusLoading.set(false);
        },
        error: (err) => {
          console.error("Error fetching upload status", err);
          this.isUploadStatusLoading.set(false);
          this.toastSrv.showToast('Error loading upload status', 'error');
        }
      });
  }

  // ==========================================
  // AUTO-UNLOCK LOGIC
  // ==========================================
  checkAutoUnlockReceivables(): void {
    const { month, year } = this.parseMonthYear();

    this.tradeSrv._getMonthlyUploadStatus(month, year)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.uploadStatus.set(res);
          
          if (res) {
            const hasMissingFiles = this.reportChecklist.some(item => !res[item.key]);
            const hasWarnings = hasMissingFiles || res.MissingCount > 0;

            if (!hasWarnings) {
              this.isReportGenerated.set(true);
              this.loadPortalDates(); 
            } else {
              this.isReportGenerated.set(false);
            }
          }
        },
        error: (err) => {
          console.error("Error auto-checking upload status", err);
          this.isReportGenerated.set(false);
        }
      });
  }

  closeGenerateModal(): void {
    if (this.generateReportModal) {
      const modal = bootstrap.Modal.getInstance(this.generateReportModal.nativeElement);
      if (modal) modal.hide();
    }
  }

  async confirmGenerateReport(): Promise<void> {
    const status = this.uploadStatus();
    if (!status) return;

    const hasMissingFiles = this.reportChecklist.some(item => !status[item.key]);
    const hasWarnings = hasMissingFiles || status.MissingCount > 0;

    if (hasWarnings) {
      const confirmed = await this.confirmationDialogSrv.showConfirm(
        'Some files are missing or the missing count is greater than 0. Still you want to generate the report?', 
        'Warning'
      );
      if (!confirmed) return; 
    }

    this.isReportGenerated.set(true);
    this.closeGenerateModal();
    this.toastSrv.showToast('Report generated successfully.', 'success');
    
    this.loadPortalDates(); 
  }


  // ==========================================
  // CLEAR HELPERS
  // ==========================================
  
  clearSalesData(): void {
    this.salesRecognised.set(null);
    this.salesUnrecognised.set(null);
    this.salesTotal.set(null);
    this.salesUpto.set('');
    this.salesAsOn.set('');
    this.salesPmTotal.set(0);
    this.salesOmTotal.set(0);
    this.salesPbTotal.set(0);
    this.salesInstTotal.set(0);
    this.unrecognisedChartOptions.set(null);
  }

  clearReceivablesData(): void {
    this.receivablesData.set(null);
    this.pmTotal.set(0);
    this.omTotal.set(0);
    this.pbTotal.set(0);
    this.instTotal.set(0);
    this.receivablesChartOptions.set(null);
  }

  clearCollectionsData(): void {
    this.collectionsData.set([]);
    this.totalCollectionsData.set(null);
    this.pmCollectionTotal.set(0);
    this.omCollectionTotal.set(0);
    this.pbCollectionTotal.set(0);
    this.instCollectionTotal.set(0);
    this.collectionsChartOptions.set(null);
  }


  // ==========================================
  // UTILITY HELPERS
  // ==========================================
  
  getDefaultLastMonth(): string {
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const year = lastMonth.getFullYear();
    const month = String(lastMonth.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  }

  formatDateForAPI(date: string): string {
    const [year, month, day] = date.split('-');
    return `${year}-${month}-${day}`;
  }

  formatDateForUI(dateStr: string): string {
    if (!dateStr) return '';
    const datePart = dateStr.split('T')[0];
    const [y, m, d] = datePart.split('-');
    return `${d}-${m}-${y}`;
  }

  sumSalesRow(row: { PM: any; OM: any; PB: any; InstOthers: any } | null | undefined): string {
    if (!row) return '0.00';
    const total = (Number(row.PM) || 0) + (Number(row.OM) || 0) + (Number(row.PB) || 0) + (Number(row.InstOthers) || 0);
    return total.toFixed(2);
  }

  parseMonthYear(): { month: string; year: number } {
    const [year, monthNum] = this.selectedMonthYear().split('-');
    const monthIndex = parseInt(monthNum, 10) - 1;
    const monthName = new Date(parseInt(year, 10), monthIndex).toLocaleString('en-US', { month: 'long' });
    return { month: monthName, year: parseInt(year, 10) };
  }

  parsePortalMonthYear(): { month: string; year: number } {
    const [year, monthNum] = this.selectedPortalMonthYear().split('-');
    const monthIndex = parseInt(monthNum, 10) - 1;
    const monthName = new Date(parseInt(year, 10), monthIndex).toLocaleString('en-US', { month: 'long' });
    return { month: monthName, year: parseInt(year, 10) };
  }

  // ==========================================
  // FILTER EVENT HANDLERS
  // ==========================================

  onFilterChange(): void {
    this.clearSalesData();
    this.clearReceivablesData();
    this.clearCollectionsData();
    this.selectedDate.set('');
    
    if (this.isReportGenerated()) {
      this.receivablePortalDates.set([]);
      this.loadPortalDates(); 
    }
    
    this.loadSales();
    this.loadCollections();
  }

  onGlobalMonthYearChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedMonthYear.set(input.value);
    
    this.selectedPortalMonthYear.set(input.value);
    this.isReportGenerated.set(false);

    this.clearSalesData();
    this.clearReceivablesData();
    this.clearCollectionsData();
    this.selectedDate.set('');
    this.receivablePortalDates.set([]);
    
    this.loadSales();
    this.loadCollections();
    this.checkAutoUnlockReceivables();
  }

  onPortalMonthYearChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedPortalMonthYear.set(input.value);
    this.clearReceivablesData();
    this.selectedDate.set('');
    this.receivablePortalDates.set([]);
    this.loadPortalDates();
  }

  onDateChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedDate.set(select.value);
    this.clearReceivablesData();
    this.loadTradeReceivables();
  }


  // ==========================================
  // DATA LOADERS
  // ==========================================
  
  loadPortalDates(): void {
    this.isLoading.set(true);
    const { month, year } = this.parsePortalMonthYear();

    const data = {
      state: this.selectedState(),
      month,
      year,
    };

    this.tradeSrv._getReceivablesPortalDates(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          const dates: string[] = res?.AvailableDates || [];
          this.receivablePortalDates.set(dates);

          if (dates.length > 0 && !this.selectedDate()) {
            
            const firstDayOfMonth = dates.find(d => {
              const dateString = d.split('T')[0];
              const day = dateString.split('-')[2]; 
              return day === '01';
            });


            this.selectedDate.set(firstDayOfMonth || dates[0]);
          }

          this.isLoading.set(false);
          this.loadTradeReceivables(); 
        },
        error: (err: any) => {
          console.error('❌ Error loading portal dates:', err);
          this.clearReceivablesData();
          this.receivablePortalDates.set([]);
          this.toastSrv.showToast('Error loading portal dates', 'error');
          this.isLoading.set(false);
        }
      });
  }

  loadTradeReceivables(): void {
    if (!this.selectedDate() || !this.isReportGenerated()) {
      this.clearReceivablesData();
      this.isLoading.set(false);
      return;
    }

    this.isLoading.set(true);
    const { month, year } = this.parseMonthYear();
    const isAll = this.selectedState() === 'All';
    const formattedDate = this.formatDateForAPI(this.selectedDate().split('T')[0]);

    const data = {
      portalStatusDate: formattedDate,
      state: this.selectedState(),
      month,
      year,
      unit: this.currencyUnit()
    };

    this.tradeSrv._getDashboardReceivables(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          if (res) {
            const receivables: ReceivablesData = res;
            this.receivablesData.set(receivables);
            this.pmTotal.set(receivables.Pm.Total || 0);
            this.omTotal.set(receivables.Om.Total || 0);
            this.pbTotal.set(receivables.Pb.Total || 0);
            this.instTotal.set(receivables.InstOthers.Total || 0);

            const series = isAll
              ? [this.pmTotal(), this.omTotal(), this.pbTotal(), this.instTotal()]
              : [this.pmTotal(), this.omTotal()];

            const labels = isAll
              ? ['PM', 'OM', 'PB', 'Inst/Others']
              : ['PM', 'OM'];

            const colors = isAll
              ? ['#dc3545', '#28a745', '#ffc107', '#6c757d']
              : ['#dc3545', '#28a745'];

            this.receivablesChartOptions.set({
              series,
              chart: { type: 'pie', height: 250, animations: { enabled: true, speed: 800 } },
              labels,
              colors,
              legend: {
                position: 'bottom',
                fontSize: '12px',
                formatter: (seriesName: string, opts: any) =>
                  seriesName + ' - ' + opts.w.globals.series[opts.seriesIndex].toFixed(2)
              },
              dataLabels: {
                enabled: true,
                formatter: (val: number, opts: any) => {
                  const value = opts.w.globals.series[opts.seriesIndex];
                  return value === 0 ? '' : Math.round(val) + '%';
                },
                style: { fontSize: '14px', fontWeight: 'bold' }
              },
              tooltip: {
                enabled: true,
                y: { formatter: (val: number) => '₹' + val.toFixed(2) }
              },
              plotOptions: { pie: { donut: { labels: { show: false } } } },
              responsive: [{ breakpoint: 480, options: { chart: { height: 220 }, legend: { fontSize: '10px' } } }]
            });
          } else {
            this.clearReceivablesData();
          }
          this.isLoading.set(false);
        },
        error: (err: any) => {
          console.error('❌ Error loading receivables:', err);
          this.clearReceivablesData();
          this.toastSrv.showToast('Error loading receivables', 'error');
          this.isLoading.set(false);
        }
      });
  }

  loadCollections(): void {
    this.isCollectionsLoading.set(true);
    const year = this.selectedYear();
    const unit = this.currencyUnit();

    this.tradeSrv._getDashboardCollections(year, unit)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: CollectionsResponse) => {
          if (res) {
            this.collectionsData.set(res.monthlyCollections || []);
            const totalData = res.totalCollections?.length > 0 ? res.totalCollections[0] : null;
            this.totalCollectionsData.set(totalData);

            if (totalData) {
              this.pmCollectionTotal.set(totalData.PMTotal || 0);
              this.omCollectionTotal.set(totalData.OMTotal || 0);
              this.pbCollectionTotal.set(totalData.PBTotal || 0);
              this.instCollectionTotal.set(totalData.InstOthersTotal || 0);

              this.collectionsChartOptions.set({
                series: [
                  this.pmCollectionTotal(),
                  this.omCollectionTotal(),
                  this.pbCollectionTotal(),
                  this.instCollectionTotal()
                ],
                chart: { type: 'pie', height: 300, animations: { enabled: true, speed: 800 } },
                labels: ['PM', 'OM', 'PB', 'Inst/Others'],
                colors: ['#dc3545', '#28a745', '#ffc107', '#6c757d'],
                legend: {
                  position: 'bottom',
                  fontSize: '12px',
                  formatter: (seriesName: string, opts: any) =>
                    seriesName + ' - ₹' + opts.w.globals.series[opts.seriesIndex].toFixed(2)
                },
                dataLabels: {
                  enabled: true,
                  formatter: (val: number, opts: any) => {
                    const value = opts.w.globals.series[opts.seriesIndex];
                    return value === 0 ? '' : Math.round(val) + '%';
                  },
                  style: { fontSize: '14px', fontWeight: 'bold' }
                },
                tooltip: {
                  enabled: true,
                  y: { formatter: (val: number) => '₹' + val.toFixed(2) }
                },
                plotOptions: { pie: { donut: { labels: { show: false } } } },
                responsive: [{ breakpoint: 480, options: { chart: { height: 240 }, legend: { fontSize: '10px' } } }]
              });
            }
          } else {
            this.clearCollectionsData();
          }
          this.isCollectionsLoading.set(false);
        },
        error: (err: any) => {
          console.error('❌ Error loading collections:', err);
          this.clearCollectionsData();
          this.toastSrv.showToast('Error loading collections', 'error');
          this.isCollectionsLoading.set(false);
        }
      });
  }

  loadSales(): void {
    this.isSalesLoading.set(true);
    const { month, year } = this.parseMonthYear();
    const state = this.selectedState();

    this.tradeSrv._getDashboardSales(month, year, this.currencyUnit(), state)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res) {
            this.salesAsOn.set(res.AsOn);
            this.salesUpto.set(res.Upto);
            this.salesRecognised.set(res.Recognised);
            this.salesUnrecognised.set(res.Unrecognised);
            this.salesTotal.set(res.Total);

            if (res.Total) {
              const pmValue = Number(res.Total.PM) || 0;
              const omValue = Number(res.Total.OM) || 0;
              const pbValue = Number(res.Total.PB) || 0;
              const instValue = Number(res.Total.InstOthers) || 0;

              this.salesPmTotal.set(pmValue);
              this.salesOmTotal.set(omValue);
              this.salesPbTotal.set(pbValue);
              this.salesInstTotal.set(instValue);

              this.unrecognisedChartOptions.set({
                series: [pmValue, omValue, pbValue, instValue],
                chart: { type: 'pie', height: 250, animations: { enabled: true, speed: 800 } },
                labels: ['PM', 'OM', 'PB', 'Inst/Others'],
                colors: ['#dc3545', '#28a745', '#ffc107', '#6c757d'],
                legend: {
                  position: 'bottom',
                  fontSize: '12px',
                  formatter: (seriesName: string, opts: any) =>
                    seriesName + ' - ' + opts.w.globals.series[opts.seriesIndex].toFixed(2)
                },
                dataLabels: {
                  enabled: true,
                  formatter: (val: number, opts: any) => {
                    const value = opts.w.globals.series[opts.seriesIndex];
                    return value === 0 ? '' : Math.round(val) + '%';
                  },
                  style: { fontSize: '14px', fontWeight: 'bold' }
                },
                tooltip: {
                  enabled: true,
                  y: { formatter: (val: number) => '₹' + val.toFixed(2) + ' ' + this.currencyUnit() }
                },
                plotOptions: { pie: { donut: { labels: { show: false } } } },
                responsive: [{ breakpoint: 480, options: { chart: { height: 200 }, legend: { fontSize: '10px' } } }]
              });
            }
          } else {
            this.clearSalesData();
          }
          this.isSalesLoading.set(false);
        },
        error: (err: any) => {
          console.error('❌ Error loading sales:', err);
          this.clearSalesData();
          this.toastSrv.showToast('Error loading sales', 'error');
          this.isSalesLoading.set(false);
        }
      });
  }
}