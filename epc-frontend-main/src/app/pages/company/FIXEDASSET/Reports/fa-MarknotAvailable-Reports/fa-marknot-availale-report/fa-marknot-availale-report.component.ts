import { Component, signal } from '@angular/core';
import { breadCrumbItems } from '../../../../../../shared/models/models';
import { BreadcrumbsComponent } from '../../../../../common/breadcrumbs/breadcrumbs.component';

@Component({
  selector: 'app-fa-marknot-availale-report',
  standalone: true,
  imports: [BreadcrumbsComponent],
  templateUrl: './fa-marknot-availale-report.component.html',
  styleUrl: './fa-marknot-availale-report.component.scss'
})
export class FaMarknotAvailaleReportComponent {


  
   breadCrumbItems = signal<breadCrumbItems[]>([]);
    constructor() {
      this.breadCrumbItems.set([
        { label: 'Mark Not Available Report' },
      ]);
  
  }
  
  
  
}
