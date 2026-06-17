import { Component, inject, signal } from '@angular/core';  
import { CommonModule } from '@angular/common';
import { UiPanIndiaSummaryComponent } from '../panIndia/ui-pan-india-summary/ui-pan-india-summary.component';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { UiStateWiseStageComponent } from '../stateWise/ui-state-wise-stage/ui-state-wise-stage.component';
import { UiAreaWiseAgingComponent } from '../areaWise/ui-area-wise-aging/ui-area-wise-aging.component';
import { breadCrumbItems } from '../../../../../shared/models/models';
import { BreadcrumbsComponent } from '../../../../common/breadcrumbs/breadcrumbs.component';
import { AuthService } from '../../../../../shared/services/common/auth.service';
import { UrToggelAccessService } from '../../../../../shared/services/unrecognisedInvoice/ur-toggel-access.service';

export type TabType = 'pan' | 'state' | 'area';

@Component({
  selector: 'app-unrecogmised-inventory', 
  standalone: true,
  imports: [UiPanIndiaSummaryComponent, UiStateWiseStageComponent, UiAreaWiseAgingComponent, CommonModule, BreadcrumbsComponent],
  templateUrl: './unrecogmised-inventory.component.html',
  styleUrl: './unrecogmised-inventory.component.scss'
})
export class UnrecogmisedInventoryComponent {
  private route              = inject(ActivatedRoute);
  authSrv                    = inject(AuthService);
  private urToggleAccessSrv  = inject(UrToggelAccessService);

  userName  = signal(this.authSrv.userDetails?.name);
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
          const myItems = items.filter(x => x.ParentRouteKey === 'unrecogmisedInventoryComponent');

          myItems.forEach(item => {
            if (item.RouteKey === 'uiPanIndiaSummaryComponent')  this.showPan.set(item.IsActive);
            if (item.RouteKey === 'uiStateWiseStageComponent')   this.showState.set(item.IsActive);
            if (item.RouteKey === 'uiAreaWiseAgingComponent')    this.showArea.set(item.IsActive);
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