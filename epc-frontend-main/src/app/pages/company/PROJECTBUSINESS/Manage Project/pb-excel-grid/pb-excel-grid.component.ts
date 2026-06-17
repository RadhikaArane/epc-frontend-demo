import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { PbProjectManagementService } from '../../../../../shared/services/projectBusiness/pb-project-management.service';
import { ToastService } from '../../../../../shared/services/componentServices/toast.service';

interface EditableLineItem {
  SrNo: any;
  ItemCode: string;
  Item: string;
  Qty: any;
  Unit: string;
  Rate: any;
  Amount: any;
  isCalculating?: boolean;
  originalData?: any;
  isNewRow?: boolean; // ✅ NEW: Track new rows
}

@Component({
  selector: 'app-pb-excel-grid',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pb-excel-grid.component.html',
  styleUrl: './pb-excel-grid.component.scss'
}) 
export class PbExcelGridComponent implements OnInit {
  @Input() lineItems: any[] = [];
  @Input() metadata: any = null;
  @Input() totalAmount: number = 0;
  @Input() estimateTitle: string = '';
  @Input() projectId: string = '';
  @Input() costHeadId: string = '';
  @Input() costBasis: string = '';

  @Output() dataChanged = new EventEmitter<any>();
  @Output() updateComplete = new EventEmitter<void>();

  private projectSrv = inject(PbProjectManagementService);
  private toastSrv = inject(ToastService);
  private destroy$ = new Subject<void>();

  editableLineItems: EditableLineItem[] = [];
  calculatedTotal: number = 0;
  isUpdating: boolean = false;
  hasChanges: boolean = false;

  ngOnInit(): void {
    this.initializeEditableData();
    this.calculateTotal();
  }

  private initializeEditableData(): void {
    this.editableLineItems = this.lineItems.map(item => ({
      SrNo: item.SrNo,
      ItemCode: item.ItemCode || '',
      Item: item.Item || '',
      Qty: item.Qty,
      Unit: item.Unit || '',
      Rate: item.Rate,
      Amount: item.Amount,
      isCalculating: false,
      originalData: { ...item },
      isNewRow: false // ✅ Existing rows
    }));
  }

  // ✅ NEW: Add new row
  addNewRow(): void {
    const newRow: EditableLineItem = {
      SrNo: '',
      ItemCode: '',
      Item: '',
      Qty: 0,
      Unit: '',
      Rate: 0,
      Amount: 0,
      isCalculating: false,
      originalData: null,
      isNewRow: true
    };

    this.editableLineItems.push(newRow);
    this.hasChanges = true;
    this.toastSrv.showToast('New row added', 'success');
  }

  // ✅ NEW: Remove row
  removeRow(index: number): void {
    const item = this.editableLineItems[index];
    
    // Only allow removing new rows
    if (!item.isNewRow) {
      this.toastSrv.showToast('Cannot delete existing rows', 'error');
      return;
    }

    this.editableLineItems.splice(index, 1);
    this.calculateTotal();
    this.hasChanges = true;
    this.toastSrv.showToast('Row removed', 'success');
  }

  onCellChange(index: number, field: string, value: any): void {
    this.hasChanges = true;
    const item = this.editableLineItems[index];

    // Update the field
    (item as any)[field] = value;

    // If qty or rate changed, recalculate amount
    if (field === 'Qty' || field === 'Rate') {
      this.calculateAmountForRow(index);
    }
  }

  private calculateAmountForRow(index: number): void {
    const item = this.editableLineItems[index];
    const qty = parseFloat(item.Qty);
    const rate = parseFloat(item.Rate);

    if (isNaN(qty) || isNaN(rate) || qty <= 0 || rate <= 0) {
      item.Amount = 0;
      this.calculateTotal();
      return;
    }

    // Show loading
    item.isCalculating = true;

    this.projectSrv._calculateLineItemAmount(qty, rate)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          if (response?.statusCode === 200 && response?.data?.amount !== undefined) {
            item.Amount = response.data.amount;
            this.calculateTotal();
          }
          item.isCalculating = false;
        },
        error: (err) => {
          console.error('Error calculating amount:', err);
          this.toastSrv.showToast('Error calculating amount', 'error');
          item.isCalculating = false;
        }
      });
  }

  calculateTotal(): void {
    this.calculatedTotal = this.editableLineItems.reduce((sum, item) => {
      const amount = parseFloat(item.Amount) || 0;
      return sum + amount;
    }, 0);
  }

  async updateEstimation(): Promise<void> {
    if (!this.hasChanges) {
      this.toastSrv.showToast('No changes to save', 'info');
      return;
    }

    // ✅ UPDATED: Validate - only ItemCode is required
    for (let i = 0; i < this.editableLineItems.length; i++) {
      const item = this.editableLineItems[i];
      
      // Only ItemCode is required
      if (!item.ItemCode || item.ItemCode.trim() === '') {
        this.toastSrv.showToast(`Row ${i + 1}: Item Code is required`, 'error');
        return;
      }
    }

    this.isUpdating = true;

    // Build lineItemsJson (including new rows)
    const lineItemsArray = this.editableLineItems.map(item => ({
      srNo: item.SrNo?.toString() || '',
      itemCode: item.ItemCode || '',
      item: item.Item || '',
      qty: item.Qty?.toString() || '0',
      unit: item.Unit || '',
      rate: item.Rate?.toString() || '0',
      amount: item.Amount?.toString() || '0'
    }));

    const payload = {
      projectId: this.projectId,
      costHeadId: this.costHeadId,
      costBasis: this.costBasis,
      totalAmount: this.calculatedTotal.toString(),
      lineItemsJson: JSON.stringify(lineItemsArray)
    };

    console.log('📤 Update Payload:', payload);

    this.projectSrv._updateCostHeadEstimation(payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          if (response?.StatusCode === 200) {
            this.toastSrv.showToast('Excel data updated successfully!', 'success');
            this.hasChanges = false;
            this.updateComplete.emit();
          } else {
            this.toastSrv.showToast('Update failed', 'error');
          }
          this.isUpdating = false;
        },
        error: (err) => {
          console.error('Error updating estimation:', err);
          this.toastSrv.showToast('Error updating estimation', 'error');
          this.isUpdating = false;
        }
      });
  }

  resetChanges(): void {
    this.initializeEditableData();
    this.calculateTotal();
    this.hasChanges = false;
    this.toastSrv.showToast('Changes reset', 'info');
  }

  formatNumber(num: any): string {
    if (!num && num !== 0) return '0.00';
    return Number(num).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  formatDate(date: string): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-GB');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}