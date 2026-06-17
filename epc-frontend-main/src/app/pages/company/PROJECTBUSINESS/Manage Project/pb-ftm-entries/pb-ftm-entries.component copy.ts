// import { Component, inject, signal, computed, OnInit, OnDestroy } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { Subject, takeUntil } from 'rxjs';
// import { BreadcrumbsComponent } from '../../../../common/breadcrumbs/breadcrumbs.component';
// import { breadCrumbItems } from '../../../../../shared/models/models';
// import { ToastService } from '../../../../../shared/services/componentServices/toast.service';
// import { PbFtmEntriesService } from '../../../../../shared/services/projectBusiness/pb-ftm-entries.service';
// import { FTMApiResponse, FTMProject, FTMProjectDetailResponse } from '../../../../../shared/models/projectBusiness-models/pbFtmEntries';

// @Component({
//   selector: 'app-pb-ftm-entries',
//   standalone: true,
//   imports: [CommonModule, BreadcrumbsComponent, FormsModule],
//   templateUrl: './pb-ftm-entries.component.html',
//   styleUrl: './pb-ftm-entries.component.scss'
// })
// export class PbFtmEntriesComponent implements OnInit, OnDestroy {

//   private toastSrv = inject(ToastService);
//   private projectFtmEntriesSrv = inject(PbFtmEntriesService);
//   private destroy$ = new Subject<void>();

//   breadCrumbItems = signal<breadCrumbItems[]>([
//     { label: 'Project Management' },
//     { label: 'FTM Entries' }
//   ]);

//   // State signals
//   isLoading = signal(false);
//   isDownloading = signal(false);
//   projects = signal<FTMProject[]>([]);
//   expandedProjects = signal<Record<string, boolean>>({});
//   expandedCostTypes = signal<Set<string>>(new Set());
//   projectDetails = signal<Record<string, FTMProjectDetailResponse>>({});
//   loadingDetails = signal<Record<string, boolean>>({});

//   // Pagination signals
//   currentPage = signal(1);
//   pageSize = signal(10);
//   totalRecords = signal(0);
//   totalPages = signal(0);

//   // Computed signals
//   hasProjects = computed(() => this.projects().length > 0);

//   // Get all unique cost heads across all projects for table rows
//   allCostHeads = computed(() => {
//     const costHeadsSet = new Map<string, { CostHeadName: string; CostType: string }>();
//     this.projects().forEach(project => {
//       project.CostHeads.forEach(costHead => {
//         if (!costHeadsSet.has(costHead.CostHeadId)) {
//           costHeadsSet.set(costHead.CostHeadId, {
//             CostHeadName: costHead.CostHeadName,
//             CostType: costHead.CostType || 'Other'
//           });
//         }
//       });
//     });
//     return Array.from(costHeadsSet.entries()).map(([id, data]) => ({
//       CostHeadId: id,
//       CostHeadName: data.CostHeadName,
//       CostType: data.CostType
//     }));
//   });

//   costHeadsByType = computed(() => {
//     const groups = new Map<string, { CostHeadId: string; CostHeadName: string; CostType: string }[]>();
//     for (const ch of this.allCostHeads()) {
//       const type = ch.CostType || 'Other';
//       if (!groups.has(type)) groups.set(type, []);
//       groups.get(type)!.push(ch);
//     }
//     return groups;
//   });

//   costTypes = computed(() => Array.from(this.costHeadsByType().keys()));

//   ngOnInit(): void {
//     this.loadProjectData();
//   }

//   ngOnDestroy(): void {
//     this.destroy$.next();
//     this.destroy$.complete();
//   }

//   // ==================== LOAD PROJECTS ====================

//   loadProjectData(): void {
//     this.isLoading.set(true);

//     this.projectFtmEntriesSrv._getAllFTMProjects(this.currentPage(), this.pageSize())
//       .pipe(takeUntil(this.destroy$))
//       .subscribe({
//         next: (response: FTMApiResponse) => {
//           if (response.StatusCode === 200 && response.result) {
//             this.projects.set(response.result.Projects);
//             this.totalRecords.set(response.result.Pagination.Total);
//             this.totalPages.set(response.result.Pagination.TotalPages);

//             const expandedState: Record<string, boolean> = {};
//             response.result.Projects.forEach(project => {
//               expandedState[project.ProjectId] = false;
//             });
//             this.expandedProjects.set(expandedState);
//           }
//           this.isLoading.set(false);
//         },
//         error: (error) => {
//           console.error('Failed to load project data', error);
//           this.toastSrv.showToast('Failed to load project data', 'error');
//           this.isLoading.set(false);
//           this.projects.set([]);
//         }
//       });
//   }

//   // ==================== PAGINATION ====================

//   onPageChange(newPage: number): void {
//     if (newPage < 1 || newPage > this.totalPages() || newPage === this.currentPage()) return;
//     this.currentPage.set(newPage);
//     this.loadProjectData();
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   }

//   onPageSizeChange(event: Event): void {
//     const target = event.target as HTMLSelectElement;
//     this.pageSize.set(parseInt(target.value, 10));
//     this.currentPage.set(1);
//     this.loadProjectData();
//   }

//   getVisiblePages(): number[] {
//     const current = this.currentPage();
//     const total = this.totalPages();
//     const pages: number[] = [];

//     if (total === 0) return pages;
//     if (total <= 7) {
//       for (let i = 1; i <= total; i++) pages.push(i);
//       return pages;
//     }

//     pages.push(1);
//     let rangeStart = Math.max(2, current - 1);
//     let rangeEnd = Math.min(total - 1, current + 1);

//     if (rangeStart > 2) pages.push(-1);
//     for (let i = rangeStart; i <= rangeEnd; i++) pages.push(i);
//     if (rangeEnd < total - 1) pages.push(-2);
//     pages.push(total);

//     return pages;
//   }

//   getStartRecord(): number {
//     return this.totalRecords() === 0 ? 0 : (this.currentPage() - 1) * this.pageSize() + 1;
//   }

//   getEndRecord(): number {
//     return Math.min(this.currentPage() * this.pageSize(), this.totalRecords());
//   }

//   // ==================== EXPAND/COLLAPSE ====================

//   toggleProject(projectId: string, event?: Event): void {
//     if (event) event.stopPropagation();

//     const isCurrentlyExpanded = this.isProjectExpanded(projectId);
//     this.expandedProjects.update(state => ({
//       ...state,
//       [projectId]: !isCurrentlyExpanded
//     }));

//     if (!isCurrentlyExpanded && !this.projectDetails()[projectId]) {
//       this.loadProjectDetails(projectId);
//     }
//   }

//   loadProjectDetails(projectId: string): void {
//     this.loadingDetails.update(state => ({ ...state, [projectId]: true }));

//     this.projectFtmEntriesSrv._getFTMProjectDetails(projectId)
//       .pipe(takeUntil(this.destroy$))
//       .subscribe({
//         next: (response: FTMProjectDetailResponse) => {
//           this.projectDetails.update(state => ({ ...state, [projectId]: response }));
//           this.loadingDetails.update(state => ({ ...state, [projectId]: false }));
//         },
//         error: (error) => {
//           console.error('Failed to load project details', error);
//           this.toastSrv.showToast('Failed to load project details', 'error');
//           this.loadingDetails.update(state => ({ ...state, [projectId]: false }));
//         }
//       });
//   }

//   isProjectExpanded(projectId: string): boolean {
//     return this.expandedProjects()[projectId] || false;
//   }

//   isLoadingDetail(projectId: string): boolean {
//     return this.loadingDetails()[projectId] || false;
//   }

//   // ==================== DATA DRILL DOWN ====================

//   isCostTypeExpanded(type: string): boolean {
//     return this.expandedCostTypes().has(type);
//   }

//   toggleCostType(type: string): void {
//     this.expandedCostTypes.update(set => {
//       const newSet = new Set(set);
//       newSet.has(type) ? newSet.delete(type) : newSet.add(type);
//       return newSet;
//     });
//   }

//   getCostTypeActualTotal(project: FTMProject, costType: string): number {
//     const heads = this.costHeadsByType().get(costType) || [];
//     return heads
//       .filter(ch => this.projectHasCostHead(project, ch.CostHeadId))
//       .reduce((sum, ch) => sum + (this.getCostHeadActualAmount(project, ch.CostHeadId) || 0), 0);
//   }

//   getCostTypeBudgetTotal(project: FTMProject, costType: string): number {
//     const heads = this.costHeadsByType().get(costType) || [];
//     return heads
//       .filter(ch => this.projectHasCostHead(project, ch.CostHeadId))
//       .reduce((sum, ch) => sum + (this.getCostHeadBudgetedAmount(project, ch.CostHeadId) || 0), 0);
//   }

//   // ==================== DATA RETRIEVAL ====================

//   getMonthsForProject(projectId: string): string[] {
//     const detail = this.projectDetails()[projectId];
//     if (!detail?.MonthlyMetrics || detail.MonthlyMetrics.length === 0) return [];
//     return detail.MonthlyMetrics.map(m => m.Month);
//   }

//   getCostHeadBudgetedAmount(project: FTMProject, costHeadId: string): number {
//     const costHead = project.CostHeads.find(ch => ch.CostHeadId === costHeadId);
//     return costHead?.BudgetedAmount || 0;
//   }

//   getCostHeadActualAmount(project: FTMProject, costHeadId: string): number {
//     const costHead = project.CostHeads.find(ch => ch.CostHeadId === costHeadId);
//     return costHead?.ActualAmount || 0;
//   }

//   getCostHeadBudget(projectId: string, costHeadId: string): number {
//     const detail = this.projectDetails()[projectId];
//     if (!detail?.CostHeads) return 0;
//     const costHead = detail.CostHeads.find(ch => ch.CostHeadId === costHeadId);
//     return costHead?.BudgetedCost || 0;
//   }

//   getMonthlyValue(projectId: string, costHeadId: string, month: string): number {
//     const detail = this.projectDetails()[projectId];
//     if (!detail?.CostHeads) return 0;
//     const costHead = detail.CostHeads.find(ch => ch.CostHeadId === costHeadId);
//     if (!costHead?.MonthlyBreakdown) return 0;
//     return costHead.MonthlyBreakdown[month]?.Amount || 0;
//   }

//   getMonthlyMetric(projectId: string, month: string, metricName: string): number {
//     const detail = this.projectDetails()[projectId];
//     if (!detail?.MonthlyMetrics) return 0;
//     const monthData = detail.MonthlyMetrics.find(m => m.Month === month);
//     if (!monthData) return 0;
//     return (monthData as any)[metricName] || 0;
//   }

//   projectHasCostHead(project: FTMProject, costHeadId: string): boolean {
//     return project.CostHeads.some(ch => ch.CostHeadId === costHeadId);
//   }

//   // ==================== FORMATTING ====================

//   formatNumber(value: number): string {
//     if (value === 0) return '-';
//     return value.toLocaleString('en-IN');
//   }

//   formatPercent(value: number): string {
//     if (value === 0) return '0';
//     return `${value.toFixed(2)}%`;
//   }

//   // ==================== AGGREGATE METRICS ====================

//   getProjectMetric(project: FTMProject, metric: string): string {
//     const metricMap: Record<string, () => string> = {
//       'totalExpenseCost': () => this.formatNumber(project.TotalExpenseCost),
//       'totalExpenseCostPercent': () => this.formatPercent(project.TotalExpenseCostPercent),
//       'totalMaterialCost': () => this.formatNumber(project.TotalMaterialCost),
//       'totalMaterialCostPercent': () => this.formatPercent(project.TotalMaterialCostPercent),
//       'totalProjectCost': () => this.formatNumber(project.TotalProjectCost),
//       'totalProjectCostPercent': () => this.formatPercent(project.TotalProjectCostPercent),
//       'expsIncurred': () => this.formatPercent(project.TotalExpsIncurredVsBudgetedPercent),
//       'margin': () => this.formatPercent(project.Margin),
//       'pendingRevenue': () => this.formatNumber(project.PendingRevenuevsBudget),
//       'pendingExpense': () => this.formatNumber(project.PendingExpensevsBudget),
//       'pendingMaterial': () => this.formatNumber(project.PendingMaterialvsBudget),
//       'totalPendingCost': () => this.formatNumber(project.TotalPendingProjectCost),
//       'projectedProfit': () => this.formatNumber(project.ProjectedProfit),
//       'profitPercent': () => this.formatPercent(project.ProfitPercent),
//       'budgetedTotalExpenseCost': () => this.formatNumber(project.BudgetedTotalExpenseCost),
//       'budgetedTotalExpenseCostPercent': () => this.formatPercent(project.BudgetedTotalExpenseCostPercent),
//       'budgetedTotalMaterialCost': () => this.formatNumber(project.BudgetedTotalMaterialCost),
//       'budgetedTotalMaterialCostPercent': () => this.formatPercent(project.BudgetedTotalMaterialCostPercent),
//       'budgetedTotalProjectCost': () => this.formatNumber(project.BudgetedTotalProjectCost),
//       'budgetedTotalProjectCostPercent': () => this.formatPercent(project.BudgetedTotalProjectCostPercent),
//       'budgetedMargin': () => this.formatPercent(project.BudgetedMargin)
//     };
//     return metricMap[metric]?.() || '-';
//   }

//   getRowBgColor(rowKey: string): string {
//     const yellowRows = ['dealerCommission', 'godownRent', 'foundation', 'employeeExps',
//       'pendingExpense', 'pendingMaterial', 'totalPendingCost'];
//     const blueRows = ['expenseCost', 'materialCost', 'projectedProfit'];
//     const lightGrayRows = ['totalProjectCost', 'totalProjectCostPercent', 'expsIncurred', 'ytdSale',
//       'margin', 'pendingRevenue'];
//     const lightBlueRows = ['expenseCostPercent', 'materialCostPercent', 'profitPercent'];

//     if (yellowRows.includes(rowKey)) return '#fff3cd';
//     if (blueRows.includes(rowKey)) return '#5b9bd5';
//     if (lightGrayRows.includes(rowKey)) return '#d3d3d3';
//     if (lightBlueRows.includes(rowKey)) return '#e8f4f8';
//     return '#fff';
//   }

//   // ==================== EXPORT ====================

//   exportProjectRevenue(): void {
//     this.isDownloading.set(true);
//     this.projectFtmEntriesSrv._downloadFTMExcel()
//       .pipe(takeUntil(this.destroy$))
//       .subscribe({
//         next: (blob: Blob) => {
//           if (blob && blob.size > 0) {
//             const date = new Date().toISOString().split('T')[0];
//             const url = window.URL.createObjectURL(blob);
//             const link = document.createElement('a');
//             link.href = url;
//             link.download = `Project_Revenue_Details_${date}.xlsx`;
//             document.body.appendChild(link);
//             link.click();
//             document.body.removeChild(link);
//             window.URL.revokeObjectURL(url);
//             this.toastSrv.showToast('Export completed successfully!', 'success');
//           } else {
//             this.toastSrv.showToast('Export file is empty', 'error');
//           }
//           this.isDownloading.set(false);
//         },
//         error: () => {
//           this.toastSrv.showToast('Failed to export projects', 'error');
//           this.isDownloading.set(false);
//         }
//       });
//   }
// }