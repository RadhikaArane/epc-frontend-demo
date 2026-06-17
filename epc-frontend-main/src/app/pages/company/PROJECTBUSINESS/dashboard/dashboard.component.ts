import { Component, signal } from '@angular/core';
import { breadCrumbItems } from '../../../../shared/models/models';
import { CommonModule } from '@angular/common';
import { BreadcrumbsComponent } from '../../../common/breadcrumbs/breadcrumbs.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, BreadcrumbsComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  breadCrumbItems = signal<breadCrumbItems[]>([]);

  constructor() {
    this.breadCrumbItems.set([
      { label: 'Dashboard' },
    ]);
  }
}
