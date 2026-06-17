import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { UrAreaWiseAgingComponent } from '../areaWise/ur-area-wise-aging/ur-area-wise-aging.component';
import { UrStateWiseStageComponent } from '../stateWise/ur-state-wise-stage/ur-state-wise-stage.component'; 
import { UrPanIndiaSummaryComponent } from '../panIndia/ur-pan-india-summary/ur-pan-india-summary.component';
import { breadCrumbItems } from '../../../../../shared/models/models';
import { BreadcrumbsComponent } from '../../../../common/breadcrumbs/breadcrumbs.component';
import { AuthService } from '../../../../../shared/services/common/auth.service';
import { UrToggelAccessService } from '../../../../../shared/services/unrecognisedInvoice/ur-toggel-access.service';

export type TabType = 'pan' | 'state' | 'area';

@Component({
  selector: 'app-unrecognised-revenue',
  standalone: true,
  imports: [UrPanIndiaSummaryComponent, UrStateWiseStageComponent, UrAreaWiseAgingComponent, CommonModule, BreadcrumbsComponent],
  templateUrl: './unrecognised-revenue.component.html',
  styleUrl: './unrecognised-revenue.component.scss'
})
export class UnrecognisedRevenueComponent {
  private route             = inject(ActivatedRoute);
  authSrv                   = inject(AuthService);
  private urToggleAccessSrv = inject(UrToggelAccessService);

  activeTab = signal<TabType>('pan');

  showPan   = signal<boolean>(true);
  showState = signal<boolean>(true);
  showArea  = signal<boolean>(true);

  breadCrumbItems = signal<breadCrumbItems[]>([]);
  private destroy$ = new Subject<void>();

  constructor() {
    this.breadCrumbItems.set([{ label: 'Dashboard' }]);
  }

  ngOnInit(): void {
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const tab = params['tab'] as TabType;
      if (tab && (tab === 'pan' || tab === 'state' || tab === 'area')) {
        this.activeTab.set(tab);
      }
    });

    this.loadRouteAccess();
  }

  private loadRouteAccess(): void {
    const user = this.authSrv.userDetails;
    if (!user) return;

    this.urToggleAccessSrv
      .getRouteAccessItems(Number(user.projectTypeId), Number(user.roleId))
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          const items: any[] = res?.Data || [];
          const myItems = items.filter(x => x.ParentRouteKey === 'consignmentComponent');

          myItems.forEach(item => {
            if (item.RouteKey === 'conPanIndiaComponent')  this.showPan.set(item.IsActive);
            if (item.RouteKey === 'conStateWiseComponent') this.showState.set(item.IsActive);
            if (item.RouteKey === 'conAreaWiseComponent')  this.showArea.set(item.IsActive);
          });

          this.fallbackToFirstVisibleTab();
        },
        error: (err: any) => console.error('GetRouteAccessItems error:', err)
      });
  }

  private fallbackToFirstVisibleTab(): void {
    const current = this.activeTab();
    if (current === 'pan'   && !this.showPan())   this.setFirstVisible();
    if (current === 'state' && !this.showState()) this.setFirstVisible();
    if (current === 'area'  && !this.showArea())  this.setFirstVisible();
  }

  private setFirstVisible(): void {
    if (this.showPan())   { this.activeTab.set('pan');   return; }
    if (this.showState()) { this.activeTab.set('state'); return; }
    if (this.showArea())  { this.activeTab.set('area');  return; }
  }

  setActiveTab(tab: TabType): void { this.activeTab.set(tab); }

  ngOnDestroy() { this.destroy$.next(); this.destroy$.complete(); }
}