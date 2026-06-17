import { Component, signal } from '@angular/core';
import { breadCrumbItems } from '../../../../../../shared/models/models';
import { BreadcrumbsComponent } from '../../../../../common/breadcrumbs/breadcrumbs.component';

@Component({
  selector: 'app-fa-manuel-report',
  standalone: true,
  imports: [BreadcrumbsComponent],
  templateUrl: './fa-manuel-report.component.html',
  styleUrl: './fa-manuel-report.component.scss'
})
export class FaManuelReportComponent {




 breadCrumbItems = signal<breadCrumbItems[]>([]);
  constructor() {
    this.breadCrumbItems.set([
      { label: 'Manual Report' },
    ]);

}




}
