import { Component, signal } from '@angular/core';
import { breadCrumbItems } from '../../../../../../shared/models/models';
import { BreadcrumbsComponent } from '../../../../../common/breadcrumbs/breadcrumbs.component';

@Component({
  selector: 'app-fa-ghost-report',
  standalone: true,
  imports: [BreadcrumbsComponent],
  templateUrl: './fa-ghost-report.component.html',
  styleUrl: './fa-ghost-report.component.scss'
})
export class FaGhostReportComponent {






 breadCrumbItems = signal<breadCrumbItems[]>([]);
  constructor() {
    this.breadCrumbItems.set([
      { label: 'Ghost Report' },
    ]);

}


}
