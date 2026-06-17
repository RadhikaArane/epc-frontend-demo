import { Component, signal, OnInit, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { breadCrumbItems } from '../../../../shared/models/models';
import { BreadcrumbsComponent } from '../../../common/breadcrumbs/breadcrumbs.component';
import { TrHistoricalDownloadService } from '../../../../shared/services/tradeReceivable/tr-historical-download.service';
import { HistoricalCategory, HistoricalDownloadResponse } from '../../../../shared/models/tradeReceivable-models/trHistoricalDownload';


// ===== UI SPECIFIC MODELS =====
export interface DownloadableFile {
  fileId: string;
  fileName: string;
  generatedDate: string;
  fileSize: string;
  uploadedBy: string; 
  category: string;
  subFolder: string;
}

export interface DownloadCategory {
  categoryId: string;
  title: string;
  isOpen: boolean;
  files: DownloadableFile[];
}

@Component({
  selector: 'app-historical-downloads',
  standalone: true,
  imports: [CommonModule, FormsModule, BreadcrumbsComponent],
  templateUrl: './historical-downloads.component.html',
  styleUrl: './historical-downloads.component.scss'
})
export class HistoricalDownloadsComponent implements OnInit {
  
  // Inject the service
  private historicalService = inject(TrHistoricalDownloadService);

  breadCrumbItems = signal<breadCrumbItems[]>([
    { label: 'Reports' }, 
    { label: 'Historical Downloads' }
  ]);

  // ===== UI STATE =====
  activeTab = signal<'RECEIVABLES' | 'REVENUE' | 'COLLECTIONS'>('RECEIVABLES'); 
  isLoading = signal<boolean>(false);
  isExporting = signal<string | null>(null); 

  // ===== FILTERS =====
  months: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  years: number[] = this.generateYears();
  
  // Default values dynamically set to current month and year
  selectedMonth = signal<string>(this.months[new Date().getMonth()]);
  selectedYear = signal<string>(new Date().getFullYear().toString());

  // ===== DATA MODELS =====
  rawApiData = signal<HistoricalCategory[]>([]); // Stores the complete un-filtered API response
  receivablesData = signal<DownloadCategory[]>([]);
  revenueData = signal<DownloadCategory[]>([]);
  collectionsData = signal<DownloadCategory[]>([]); 

  currentViewData = computed(() => {
    if (this.activeTab() === 'RECEIVABLES') return this.receivablesData();
    if (this.activeTab() === 'REVENUE') return this.revenueData();
    return this.collectionsData();
  });

  ngOnInit(): void {
    this.fetchHistoricalData();
  }

  // ============ HELPERS ============

  generateYears(): number[] {
    const currentYear = new Date().getFullYear();
    const years: number[] = [];
    for (let year = 2020; year <= currentYear + 1; year++) {
      years.push(year);
    }
    return years;
  }

  // ============ TAB & TOGGLE HANDLERS ============

  switchTab(tab: 'RECEIVABLES' | 'REVENUE' | 'COLLECTIONS'): void {
    this.activeTab.set(tab);
  }

  toggleCategory(categoryId: string): void {
    let dataSignal = this.activeTab() === 'RECEIVABLES' ? this.receivablesData : 
                     this.activeTab() === 'REVENUE' ? this.revenueData : 
                     this.collectionsData;
    
    const updatedData = dataSignal().map(cat => 
      cat.categoryId === categoryId ? { ...cat, isOpen: !cat.isOpen } : cat
    );
    
    dataSignal.set(updatedData);
  }

  onFilterChange(): void {
    if (this.selectedMonth() && this.selectedYear()) {
      if (this.rawApiData().length > 0) {
        // If data is already fetched, just filter it locally
        this.processApiData();
      } else {
        // Fallback in case data hasn't loaded yet
        this.fetchHistoricalData();
      }
    } else {
      // Clear tables if user unselects month/year
      this.receivablesData.set([]);
      this.revenueData.set([]);
      this.collectionsData.set([]);
    }
  }

  // ============ API INTEGRATION ============

  fetchHistoricalData(): void {
    this.isLoading.set(true);

    this.historicalService._getHistoricalDownloads().subscribe({
      next: (response: HistoricalDownloadResponse) => {
        if (response && response.success && response.data) {
          this.rawApiData.set(response.data.Categories || []);
          this.processApiData(); // Map and filter the data to UI
        }
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error fetching historical downloads:', error);
        this.isLoading.set(false);
      }
    });
  }

  processApiData(): void {
    const month = this.selectedMonth().toLowerCase();
    const year = this.selectedYear().toString();
    const allCategories = this.rawApiData();

    // Helper function to map the API response format to our UI Component format
    const mapCategoryData = (categoryName: string): DownloadCategory[] => {
      const foundCategory = allCategories.find(c => c.Category.toLowerCase() === categoryName.toLowerCase());
      if (!foundCategory) return [];

      return foundCategory.SubFolders.map(sub => {
        
        // Filter files intelligently
        const filteredFiles = sub.Files.filter(f => {
          const fileNameLower = f.FileName.toLowerCase();
          const displayDateLower = f.DisplayDate.toLowerCase();

          const hasDateInName = fileNameLower.includes(`${month}_${year}`);
          
          const hasDateInDisplay = displayDateLower.includes(month) && displayDateLower.includes(year);

          return hasDateInName || hasDateInDisplay;
        }).map(f => ({
          fileId: f.FileName, 
          fileName: f.FileName,
          generatedDate: f.DisplayDate,
          fileSize: f.FileSizeKb,
          uploadedBy: 'System', 
          category: foundCategory.Category,
          subFolder: sub.SubFolder
        }));

        return {
          categoryId: sub.SubFolder,
          title: sub.SubFolder,
          isOpen: filteredFiles.length > 0, 
          files: filteredFiles
        };
      });
    };

    // Apply the mapped data to our signals
    this.receivablesData.set(mapCategoryData('Receivables'));
    this.revenueData.set(mapCategoryData('Revenue'));
    this.collectionsData.set(mapCategoryData('Collections'));
  }

  downloadFile(file: DownloadableFile): void {
    if (this.isExporting()) return;
    this.isExporting.set(file.fileId); // Sets loading spinner on the specific row

    const payload = {
      category: file.category,
      subFolder: file.subFolder,
      fileName: file.fileName
    };

    this.historicalService._downloadHistoricalFile(payload).subscribe({
      next: (blob: Blob) => {
        // Create an invisible link to trigger the browser's download prompt
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.fileName;
        a.click();
        
        // Clean up
        window.URL.revokeObjectURL(url);
        this.isExporting.set(null);
      },
      error: (error) => {
        console.error('Error downloading file:', error);
        this.isExporting.set(null);
      }
    });
  }
}