import { Component, signal } from '@angular/core';
import { breadCrumbItems } from '../../../../../shared/models/models';
import { BreadcrumbsComponent } from '../../../../common/breadcrumbs/breadcrumbs.component';

@Component({
  selector: 'app-ur-audit-logs',
  standalone: true,
  imports: [BreadcrumbsComponent],
  templateUrl: './ur-audit-logs.component.html',
  styleUrl: './ur-audit-logs.component.scss'
})
export class UrAuditLogsComponent {

  breadCrumbItems = signal<breadCrumbItems[]>([]); 
      
        constructor() {
          this.breadCrumbItems.set([
            { label: 'Reports' },
          ]);
        }

}
