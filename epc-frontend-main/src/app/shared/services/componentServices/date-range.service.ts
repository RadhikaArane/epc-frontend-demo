import { Injectable, signal, computed } from '@angular/core';

export interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

@Injectable({
  providedIn: 'root'
})
export class DateRangeService {

  private startDate = signal<Date | null>(null);
  private endDate = signal<Date | null>(null);
 
  dateRange = computed<DateRange>(() => ({
    startDate: this.startDate(),
    endDate: this.endDate()
  }));
 
  hasDateRange = computed<boolean>(() => {
    return this.startDate() !== null && this.endDate() !== null;
  });
 
  isValidRange = computed<boolean>(() => {
    const start = this.startDate();
    const end = this.endDate();
    if (!start || !end) return false;
    return end >= start;
  });
 
  setDateRange(startDate: Date | null, endDate: Date | null): void {
    this.startDate.set(startDate);
    this.endDate.set(endDate);
  }
 
  setStartDate(date: Date | null): void {
    this.startDate.set(date);
  }
 
  setEndDate(date: Date | null): void {
    this.endDate.set(date);
  }
 
  clearDateRange(): void {
    this.startDate.set(null);
    this.endDate.set(null);
  }
 
  getFormattedDateRange(): { startDate: string | null; endDate: string | null } {
    return {
      startDate: this.startDate() ? this.formatDate(this.startDate()!) : null,
      endDate: this.endDate() ? this.formatDate(this.endDate()!) : null
    };
  }
 
  getFormattedDateRangeDDMMYYYY(): { startDate: string | null; endDate: string | null } {
    return {
      startDate: this.startDate() ? this.formatDateDDMMYYYY(this.startDate()!) : null,
      endDate: this.endDate() ? this.formatDateDDMMYYYY(this.endDate()!) : null
    };
  }
 
  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
 
  private formatDateDDMMYYYY(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${day}/${month}/${year}`;
  }
 
  getISODateRange(): { startDate: string | null; endDate: string | null } {
    return {
      startDate: this.startDate()?.toISOString() || null,
      endDate: this.endDate()?.toISOString() || null
    };
  }
 
  isDateInRange(date: Date): boolean {
    const start = this.startDate();
    const end = this.endDate();
    
    if (!start || !end) return false;
    
    return date >= start && date <= end;
  }
 
  getRangeDuration = computed<number>(() => {
    const start = this.startDate();
    const end = this.endDate();
    
    if (!start || !end) return 0;
    
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  });
}
