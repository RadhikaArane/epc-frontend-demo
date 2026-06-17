import { CommonModule } from "@angular/common";
import { Component, signal, ViewChild } from "@angular/core";
import { ChartComponent, NgApexchartsModule } from "ng-apexcharts";

import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
  ApexLegend
} from "ng-apexcharts"; 
export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: string[];
  colors: string[];
  legend: ApexLegend;
  dataLabels?: any;
  tooltip?: any;
};

@Component({
  selector: 'app-pb-all-project-analytics',
  standalone: true,
  imports: [CommonModule,NgApexchartsModule],
  templateUrl: './pb-all-project-analytics.component.html',
  styleUrl: './pb-all-project-analytics.component.scss'
})
export class PbAllProjectAnalyticsComponent {
  @ViewChild("chart") chart!: ChartComponent;
    public unrecognisedChartOptions: ChartOptions;

    constructor() { 
    // Unrecognised Sales Chart - Colorful like the image
    this.unrecognisedChartOptions = {
      series: [540, 460, 55],
      chart: {
        type: "pie",
        height: 225,
        animations: {
          enabled: true,
          // easing: 'easeinout',
          speed: 800
        }
      },
      labels: ["Material Cost", "Freight", "Installation"],
      colors: ["#007bff", "#28a745",  "#28a888"], // Blue, Green, Yellow, Red
      legend: {
        position: "bottom",
        fontSize: '12px'
      },
      dataLabels: {
        enabled: true,
        formatter: function (val: number) {
          return Math.round(val) + "%"
        }
      },
      tooltip: {
        y: {
          formatter: function (val: number) {
            return "₹" + val + " Lakhs"
          }
        }
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              height: 200
            }
          }
        }
      ]
    };
    }
}
