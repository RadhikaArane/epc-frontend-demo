import { Component, signal } from '@angular/core';
import { breadCrumbItems } from '../../../../../shared/models/models';
import { BreadcrumbsComponent } from '../../../../common/breadcrumbs/breadcrumbs.component';

@Component({
  selector: 'app-scr-user-logs',
  standalone: true,
  imports: [BreadcrumbsComponent],
  templateUrl: './scr-user-logs.component.html',
  styleUrl: './scr-user-logs.component.scss'
})
export class ScrUserLogsComponent {

  breadCrumbItems = signal<breadCrumbItems[]>([]);
  
      constructor() {
          this.breadCrumbItems.set([
            { label: 'Logs' },
          ]);
      }

}
