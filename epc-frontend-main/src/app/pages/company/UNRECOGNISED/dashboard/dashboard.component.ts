import { Component, inject, signal, DestroyRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { forkJoin, of } from 'rxjs'; 
import { catchError } from 'rxjs/operators';
import { UrDashboardService } from '../../../../shared/services/unrecognisedInvoice/ur-dashboard.service'; 
import { JwtService } from '../../../../shared/services/common/jwt.service'; 
import { ToastService } from '../../../../shared/services/componentServices/toast.service'; 

import { NgApexchartsModule } from "ng-apexcharts";
import {
  ApexNonAxisChartSeries,
  ApexAxisChartSeries,
  ApexResponsive,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexXAxis,
  ApexPlotOptions,
  ApexStroke,
  ApexTooltip 
} from "ng-apexcharts";

export interface ColumnConfig {
  key: string;
  label: string;
  isRowLabel: boolean;
}

export type PieChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  legend: any;
};

export type BarChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  legend: any;
  tooltip: any; 
};

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DRDashboardComponent implements OnInit {
  @ViewChild("pieChart") pieChart!: ChartComponent;
  @ViewChild("barChart") barChart!: ChartComponent;
  
  public pieChartOptions: Partial<PieChartOptions>;
  public barChartOptions: Partial<BarChartOptions>;

  private destroyRef = inject(DestroyRef);
  private dashboardSrv = inject(UrDashboardService);
  private router = inject(Router);
  private jwtSrv = inject(JwtService);
  private toastSrv = inject(ToastService);

  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);
  
  rows = signal<Record<string, any>[]>([]);
  pipelineRows = signal<Record<string, any>[]>([]); 

  summaryColumns = signal<ColumnConfig[]>([]);
  pipelineColumns = signal<ColumnConfig[]>([]);

  selectedDate = signal<string>('');
  stageName = signal<string>(''); 
  stateName = signal<string>('Andhra Pradesh'); 

  stateOptions = [
    { label: 'All States', value: 'All States' },
    { label: 'Andhra Pradesh', value: 'Andhra Pradesh' },
    { label: 'Gujarat', value: 'Gujarat' },
    { label: 'Telangana', value: 'Telangana' },
    { label: 'Madhya Pradesh', value: 'Madhya Pradesh' },
    { label: 'Uttar Pradesh', value: 'Uttar Pradesh' },
    { label: 'West Bengal', value: 'West Bengal' },
    { label: 'Chhattisgarh', value: 'Chhattisgarh' }
  ];

  constructor() {
    this.pieChartOptions = {
      series: [],
      chart: {
        width: 550, 
        type: "pie"
      },
      labels: [],
      legend: {
        position: 'right',
        verticalAlign: 'middle',
        formatter: function (seriesName: string, opts: any) {
          const value = opts.w.globals.series[opts.seriesIndex];
          return seriesName + ": " + Number(value).toFixed(2);
        }
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: { width: 320 },
            legend: {
              position: "bottom",
              formatter: function (seriesName: string, opts: any) {
                const value = opts.w.globals.series[opts.seriesIndex];
                return seriesName + ": " + Number(value).toFixed(2);
              }
            }
          }
        }
      ]
    };

    this.barChartOptions = {
      series: [],
      chart: {
        type: "bar",
        height: 400
      },
      plotOptions: {
        bar: {
          horizontal: true,
          dataLabels: { position: "top" }
        }
      },
      dataLabels: {
        enabled: true,
        offsetX: -6,
        style: {
          fontSize: "12px",
          colors: ["#fff"]
        },
        
        formatter: function (val: any, opts: any) {
          const rawValue = opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex];
          
          if (rawValue === null || rawValue === undefined) return '';
          return Number(rawValue).toFixed(2); 
        }
      },
      // ---------------------------------------------
      stroke: {
        show: true,
        width: 1,
        colors: ["#fff"]
      },
      xaxis: {
        categories: [],
        labels: {
          formatter: function(val: string) {
            return Number(val).toFixed(2);
          }
        }
      },
      tooltip: {
        y: {
          formatter: function(val: number) {
            return Number(val).toFixed(2);
          }
        }
      },
      legend: {
        position: 'top'
      }
    };
  }

  ngOnInit(): void { 
    const today = new Date().toISOString().split('T')[0];
    this.selectedDate.set(today);
    this.loadDashboardData(this.selectedDate(), this.stageName(), this.stateName()); 
  }

  onDateChange(event: any): void {
    const selectedDate = event.target.value;
    this.selectedDate.set(selectedDate);
    this.loadDashboardData(selectedDate, this.stageName(), this.stateName()); 
  }

  onStateChange(event: any): void {
    const selectedState = event.target.value;
    this.stateName.set(selectedState);
    this.loadDashboardData(this.selectedDate(), this.stageName(), selectedState);
  }

  loadDashboardData(selectedDate: string, stageName: string, stateName: string): void {
    if(!selectedDate) return; 

    this.isLoading.set(true);
    const apiStateName = stateName === 'All States' ? '' : stateName;

    forkJoin({
      summary: this.dashboardSrv._getDashboardSummary(selectedDate, stageName, apiStateName).pipe(
        catchError(err => {
          console.error("Summary API failed", err);
          return of({ Rows: [] }); 
        })
      ),
      pipeline: this.dashboardSrv._getDashboardPipeline(selectedDate, stageName, apiStateName).pipe(
        catchError(err => {
          console.error("Pipeline API failed", err);
          return of({ Rows: [] }); 
        })
      )
    })
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: (responses: any) => { 
        
        const summaryData = responses.summary?.Rows || [];
        this.rows.set(summaryData);
        if (summaryData.length > 0) {
          this.buildColumnsFromData(summaryData[0], this.summaryColumns);
          this.updateBarChartData(summaryData); 
        } else {
          this.summaryColumns.set([]);
          this.barChartOptions.series = [];
          this.barChartOptions.xaxis = { categories: [] };
        }

        const pipelineRaw = responses.pipeline?.Rows || responses.pipeline?.Data;
        let pipelineArray: any[] = [];

        if (Array.isArray(pipelineRaw)) {
          pipelineArray = pipelineRaw;
        } else if (pipelineRaw && typeof pipelineRaw === 'object') {
          pipelineArray = Object.keys(pipelineRaw).map(key => ({
            RowType: this.formatDynamicKey(key),
            TotalPipeline: pipelineRaw[key]
          }));
        }

        this.pipelineRows.set(pipelineArray);
        
        if (pipelineArray.length > 0) {
          this.buildColumnsFromData(pipelineArray[0], this.pipelineColumns);
          this.updatePieChartData(pipelineArray); 
        } else {
          this.pipelineColumns.set([]);
          this.pieChartOptions.series = [];
          this.pieChartOptions.labels = [];
        }

        this.isLoading.set(false);
      },
      error: (err) => {
        this.toastSrv.showToast('Error connecting to server', 'error');
        this.isLoading.set(false);
      }
    });
  }

  /**
   * Maps dynamic summary rows into series and categories for the Bar Chart
   */
  private updateBarChartData(summaryArray: any[]): void {
    const labelKey = this.summaryColumns().find(c => c.isRowLabel)?.key || 'RowType';

    const dataCols = this.summaryColumns().filter(c => !c.isRowLabel && !c.key.toLowerCase().includes('total'));
    const categories = dataCols.map(c => c.label);

    const chartRows = summaryArray.filter(row => row[labelKey] !== 'Grand Total' && row[labelKey] !== 'Total');

    const series = chartRows.map(row => {
      return {
        name: row[labelKey],
        data: dataCols.map(c => Number(row[c.key]) || 0)
      };
    });

    this.barChartOptions.xaxis = { ...this.barChartOptions.xaxis, categories: categories };
    this.barChartOptions.series = series;
  }

  /**
   * Maps dynamic pipeline rows into series and labels for the Pie Chart
   */
  private updatePieChartData(pipelineArray: any[]): void {
    const labelKey = this.pipelineColumns().find(c => c.isRowLabel)?.key || 'RowType';
    const valueKey = this.pipelineColumns().find(c => !c.isRowLabel)?.key || Object.keys(pipelineArray[0]).find(k => k !== labelKey) || '';

    const chartData = pipelineArray.filter(row => 
      row[labelKey] !== 'Total' && 
      row[labelKey] !== 'Grand Total' &&
      row[valueKey] !== null 
    );

    this.pieChartOptions.labels = chartData.map(row => row[labelKey]);
    this.pieChartOptions.series = chartData.map(row => Number(row[valueKey]) || 0);
  }

  private buildColumnsFromData(sampleItem: Record<string, any>, targetSignal: ReturnType<typeof signal<ColumnConfig[]>>): void {
    const keys = Object.keys(sampleItem);
    const labelKey = keys.find(k => k.toLowerCase().includes('rowtype') || k.toLowerCase().includes('status')) || keys[0];

    const cols: ColumnConfig[] = keys.map(key => ({
      key: key,
      label: this.formatDynamicKey(key),
      isRowLabel: key === labelKey
    }));

    cols.sort((a, b) => (a.isRowLabel ? -1 : b.isRowLabel ? 1 : 0));
    targetSignal.set(cols);
  }

  private formatDynamicKey(key: string): string {
    if (key === 'RowType') return 'Status'; 
    if (key === 'RrDoneCc') return 'CC done'; 
    if (key === 'TotalPipeline') return 'Total Pipe line';
    
    let formatted = key.replace(/([A-Z])/g, ' $1').trim();
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  }
}