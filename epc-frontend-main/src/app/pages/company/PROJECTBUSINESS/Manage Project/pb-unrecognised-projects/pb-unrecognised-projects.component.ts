import {
  Component, inject, signal, OnInit, OnDestroy,
  ViewChild, ElementRef, computed
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { BreadcrumbsComponent } from '../../../../common/breadcrumbs/breadcrumbs.component';
import { breadCrumbItems } from '../../../../../shared/models/models';
import { ToastService } from '../../../../../shared/services/componentServices/toast.service';
import { PbFtmEntriesService } from '../../../../../shared/services/projectBusiness/pb-ftm-entries.service';
import { UnionCostHead, UnrecognisedProject } from '../../../../../shared/models/projectBusiness-models/pbFtmEntries';

declare var bootstrap: any;

@Component({
  selector: 'app-pb-unrecognised-projects',
  standalone: true,
  imports: [CommonModule, BreadcrumbsComponent],
  templateUrl: './pb-unrecognised-projects.component.html',
  styleUrl: './pb-unrecognised-projects.component.scss'
})
export class PbUnrecognisedProjectsComponent implements OnInit, OnDestroy {
  private toastSrv = inject(ToastService);
  private projectFtmEntriesSrv = inject(PbFtmEntriesService);

  breadCrumbItems = signal<breadCrumbItems[]>([{ label: 'Project Management' }]);
  isLoading = signal(true);
  projects = signal<UnrecognisedProject[]>([]);
  expandedProjects = signal<{ [id: string]: boolean }>({});

  private destroy$ = new Subject<void>();

  // ==================== Computed ====================

  hasProjects = computed(() => this.projects().length > 0);

  /** Union of all cost heads across every project */
  unionCostHeads = computed<UnionCostHead[]>(() => {
    const seen = new Map<string, UnionCostHead>();
    this.projects().forEach(p => {
      p.BudgetedValues.forEach(b => {
        if (!seen.has(b.CostHeadId))
          seen.set(b.CostHeadId, { CostHeadId: b.CostHeadId, CostHeadName: b.CostHeadName });
      });
      p.MonthlyExpenses.forEach(me => {
        me.CostHeadEntries.forEach(e => {
          if (!seen.has(e.CostHeadId))
            seen.set(e.CostHeadId, { CostHeadId: e.CostHeadId, CostHeadName: e.CostHeadName });
        });
      });
    });
    return Array.from(seen.values());
  });

  // ==================== Lifecycle ====================

  ngOnInit(): void { this.load(); }

  load(): void {
    this.isLoading.set(true);
    this.projectFtmEntriesSrv._getUnrecognisedProjects()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.projects.set(res?.StatusCode === 200 ? (res.projects || []) : []);
          this.isLoading.set(false);
        },
        error: () => {
          this.toastSrv.showToast('Failed to load projects', 'error');
          this.isLoading.set(false);
        }
      });
  }

  // ==================== Expand/Collapse ====================

  toggleProject(projectId: string, event?: Event): void {
    event?.stopPropagation();
    this.expandedProjects.update(s => ({ ...s, [projectId]: !s[projectId] }));
  }

  isProjectExpanded(projectId: string): boolean {
    return this.expandedProjects()[projectId] || false;
  }

  // ==================== Month Helpers ====================

  getMonths(project: UnrecognisedProject): string[] {
    return [...project.MonthlyExpenses]
      .sort((a, b) => a.PeriodMonth - b.PeriodMonth)
      .map(m => m.MonthLabel);
  }

  getMonthlyValue(project: UnrecognisedProject, costHeadId: string, monthLabel: string): number {
    const me = project.MonthlyExpenses.find(m => m.MonthLabel === monthLabel);
    return me?.CostHeadEntries.find(e => e.CostHeadId === costHeadId)?.TotalValue || 0;
  }

  getBudget(project: UnrecognisedProject, costHeadId: string): number | null {
    const bv = project.BudgetedValues.find(b => b.CostHeadId === costHeadId);
    return bv ? bv.BudgetedAmount : null;
  }

  projectHasCostHead(project: UnrecognisedProject, costHeadId: string): boolean {
    return project.BudgetedValues.some(b => b.CostHeadId === costHeadId) ||
      project.MonthlyExpenses.some(me => me.CostHeadEntries.some(e => e.CostHeadId === costHeadId));
  }

  // ==================== Format ====================

  fmt(v: number | null | undefined): string {
    if (v === null || v === undefined || isNaN(v)) return '-';
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 0, maximumFractionDigits: 0
    }).format(v);
  }

  fmtPct(v: number | null | undefined): string {
    if (v === null || v === undefined || isNaN(v)) return '-';
    return Math.round(v * 100) + '%';
  }

  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }
}
