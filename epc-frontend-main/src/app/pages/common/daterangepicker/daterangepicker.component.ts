import { Component, inject, signal, computed, output, OnInit, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { DateRangeService } from '../../../shared/services/componentServices/date-range.service';

@Component({
  selector: 'app-daterangepicker',
  standalone: true,
  imports: [CommonModule],

  templateUrl: './daterangepicker.component.html',
  styleUrl: './daterangepicker.component.scss',
})
export class DaterangepickerComponent {
  private dateRangeService = inject(DateRangeService);
  private elementRef = inject(ElementRef);

  // UI state
  showCalendar = signal<boolean>(false);
  selectionStep = signal<'start' | 'end'>('start');
  hoveredDate = signal<Date | null>(null);

  // Calendar state
  currentMonth = signal<Date>(new Date());
  selectedStartDate = signal<Date | null>(null);
  selectedEndDate = signal<Date | null>(null);

  // Max date (today)
  maxDate = new Date();

  // Output events
  dateRangeApplied = output<void>();
  dateRangeCleared = output<void>();

  // Computed: Available years (from 2020 to current year)
  availableYears = computed(() => {
    const currentYear = new Date().getFullYear();
    const years: number[] = [];
    for (let year = 2020; year <= currentYear; year++) {
      years.push(year);
    }
    return years.reverse(); // Most recent first
  });

  // Computed: Current selected year
  selectedYear = computed(() => this.currentMonth().getFullYear());

  // Computed: Current selected month
  selectedMonth = computed(() => this.currentMonth().getMonth());

  // Computed: Display text for input
  displayText = computed(() => {
    const start = this.selectedStartDate();
    const end = this.selectedEndDate();

    if (!start && !end) return '';
    if (start && !end) return `${this.formatDisplay(start)} - ...`;
    if (start && end) return `${this.formatDisplay(start)} - ${this.formatDisplay(end)}`;
    
    return '';
  });

  // Computed: Placeholder text
  placeholderText = computed(() => {
    if (this.selectionStep() === 'start') return 'Select start date';
    if (this.selectionStep() === 'end') return 'Select end date';
    return 'DD/MM/YYYY - DD/MM/YYYY';
  });

  // Computed: Calendar days
  calendarDays = computed(() => {
    const date = this.currentMonth();
    const year = date.getFullYear();
    const month = date.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startingDayOfWeek = firstDay.getDay();
    
    const days: (Date | null)[] = [];
    
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    for (let day = 1; day <= lastDay.getDate(); day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  });

  // Computed: Month name
  monthName = computed(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[this.currentMonth().getMonth()];
  });

  // Computed: Can apply
  canApply = computed(() => {
    return this.selectedStartDate() !== null && this.selectedEndDate() !== null;
  });

  // Computed: Has changes
  hasChanges = computed(() => {
    const serviceRange = this.dateRangeService.dateRange();
    const localStart = this.selectedStartDate();
    const localEnd = this.selectedEndDate();

    if (!serviceRange.startDate && !serviceRange.endDate && !localStart && !localEnd) {
      return false;
    }

    return (
      localStart?.getTime() !== serviceRange.startDate?.getTime() ||
      localEnd?.getTime() !== serviceRange.endDate?.getTime()
    );
  });

  // Computed: Can clear
  canClear = computed(() => {
    const serviceRange = this.dateRangeService.dateRange();
    return !!(
      serviceRange.startDate || 
      serviceRange.endDate || 
      this.selectedStartDate() || 
      this.selectedEndDate()
    );
  });

  // Computed: Has active filter
  hasActiveDateRange = computed(() => this.dateRangeService.hasDateRange());

  ngOnInit(): void {
    const currentRange = this.dateRangeService.dateRange();
    if (currentRange.startDate && currentRange.endDate) {
      this.selectedStartDate.set(currentRange.startDate);
      this.selectedEndDate.set(currentRange.endDate);
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.showCalendar.set(false);
    }
  }

  toggleCalendar(): void {
    this.showCalendar.set(!this.showCalendar());
    if (this.showCalendar()) {
      if (!this.selectedStartDate()) {
        this.selectionStep.set('start');
      } else if (!this.selectedEndDate()) {
        this.selectionStep.set('end');
      }
    }
  }

  selectDate(date: Date): void {
    if (this.isDateDisabled(date)) return;

    const step = this.selectionStep();
    
    if (step === 'start') {
      this.selectedStartDate.set(date);
      this.selectedEndDate.set(null);
      this.selectionStep.set('end');
    } else {
      const start = this.selectedStartDate();
      if (start && date >= start) {
        this.selectedEndDate.set(date);
      } else {
        this.selectedStartDate.set(date);
        this.selectedEndDate.set(null);
        this.selectionStep.set('end');
      }
    }
  }

  previousMonth(): void {
    const current = this.currentMonth();
    this.currentMonth.set(new Date(current.getFullYear(), current.getMonth() - 1, 1));
  }

  nextMonth(): void {
    const current = this.currentMonth();
    const next = new Date(current.getFullYear(), current.getMonth() + 1, 1);
    
    if (next <= new Date()) {
      this.currentMonth.set(next);
    }
  }

  onYearChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const year = parseInt(select.value, 10);
    const month = this.currentMonth().getMonth();
    
    // Check if the selected month/year is in the future
    const newDate = new Date(year, month, 1);
    const today = new Date();
    
    if (newDate > today) {
      // Set to current month of that year or current month if year is current
      this.currentMonth.set(new Date(year, today.getMonth(), 1));
    } else {
      this.currentMonth.set(newDate);
    }
  }

  isDateDisabled(date: Date): boolean {
    return date > this.maxDate;
  }

  isDateSelected(date: Date): boolean {
    return this.isStartDate(date) || this.isEndDate(date);
  }

  isDateInRange(date: Date): boolean {
    const start = this.selectedStartDate();
    const end = this.selectedEndDate() || this.hoveredDate();
    
    if (!start || !end) return false;
    
    return date > start && date < end;
  }

  isStartDate(date: Date): boolean {
    return this.isSameDay(date, this.selectedStartDate());
  }

  isEndDate(date: Date): boolean {
    return this.isSameDay(date, this.selectedEndDate());
  }

  isToday(date: Date): boolean {
    return this.isSameDay(date, new Date());
  }

  onDateHover(date: Date | null): void {
    if (this.selectionStep() === 'end' && !this.selectedEndDate()) {
      this.hoveredDate.set(date);
    }
  }

  private isSameDay(date1: Date | null, date2: Date | null): boolean {
    if (!date1 || !date2) return false;
    return date1.toDateString() === date2.toDateString();
  }

  applyDateRange(): void {
    const start = this.selectedStartDate();
    const end = this.selectedEndDate();

    if (start && end) {
      this.dateRangeService.setDateRange(start, end);
      this.showCalendar.set(false);
      this.selectionStep.set('start');
      this.dateRangeApplied.emit();
    }
  }

  clearDateRange(): void {
    this.selectedStartDate.set(null);
    this.selectedEndDate.set(null);
    this.dateRangeService.clearDateRange();
    this.showCalendar.set(false);
    this.selectionStep.set('start');
    this.dateRangeCleared.emit();
  }

  formatDisplay(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  canGoNext(): boolean {
    const current = this.currentMonth();
    const next = new Date(current.getFullYear(), current.getMonth() + 1, 1);
    return next <= new Date();
  }
}
