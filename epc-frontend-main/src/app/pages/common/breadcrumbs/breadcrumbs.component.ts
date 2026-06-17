import { Component, inject, Input, OnInit } from '@angular/core';
import { routes } from '../../../shared/routes/routes';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../shared/services/common/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-breadcrumbs',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './breadcrumbs.component.html',
  styleUrl: './breadcrumbs.component.scss',
})
export class BreadcrumbsComponent implements OnInit {
  router = inject(Router);
  authSrv = inject(AuthService);
  routes = routes;

  @Input() title: string | undefined;
  @Input() breadcrumbItems!: {
    active?: boolean;
    label?: string;
  }[];

  roleId: any; 
  projectTypeName:any;

  homeLink: string = '';

  ngOnInit(): void {
    this.roleId = this.authSrv.userDetails?.roleId; 
    this.projectTypeName = this.authSrv.userDetails?.projectTypeName;

    if (this.roleId === 1 && this.projectTypeName === 'Trade Receivable') {
      this.homeLink = routes.trManagerDashboardComponent;
    } 
    // else if(this.roleId != 2 && this.companyCode === 1054) {
    //   this.homeLink = routes.mhzpcEmployeeDashboard;
    // } else {
    //   this.homeLink = routes.maslDealerDashboard;
    // }
  }
}
