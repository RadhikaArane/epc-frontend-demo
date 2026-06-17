import { Component, inject, signal, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { BreadcrumbsComponent } from '../../../../common/breadcrumbs/breadcrumbs.component';
import { breadCrumbItems } from '../../../../../shared/models/models';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ScrAutomationService } from '../../../../../shared/services/scrapper/scr-automation.service';
import { Subject, takeUntil, finalize, interval, switchMap, catchError, of } from 'rxjs';
import { ToastService } from '../../../../../shared/services/componentServices/toast.service';
import { StatePortal, StatusMessage, StatusResponse } from '../../../../../shared/models/scrapper-models/scrapperAutomation';
import { ConfirmationDialogService } from '../../../../../shared/services/componentServices/confirmation-dialog.service';
import { AuthService } from '../../../../../shared/services/common/auth.service';
declare var bootstrap: any;

@Component({
  selector: 'app-scr-run-jobs',
  standalone: true,
  imports: [BreadcrumbsComponent, CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './scr-run-jobs.component.html',
  styleUrl: './scr-run-jobs.component.scss'
})
export class ScrRunJobsComponent implements OnInit, OnDestroy {

  private scrapperSrv = inject(ScrAutomationService);
  private toastSrv = inject(ToastService);
  private authSrv = inject(AuthService)

  @ViewChild("captchaModal") captchaModal!: ElementRef;
  @ViewChild("otpModal") otpModal!: ElementRef;  
  @ViewChild('captchaFrame') captchaFrame!: ElementRef;

  breadCrumbItems = signal<breadCrumbItems[]>([]);
  isLoading = signal<boolean>(false);
  showStateError = signal<boolean>(false);

  // Status tracking - now using service signals
  statusMessages = this.scrapperSrv.persistentMessages;
  currentJobId = this.scrapperSrv.persistentJobId;
  isScrapingActive = this.scrapperSrv.persistentIsActive;

  // Captcha modal
  captchaImageBase64 = signal<string | null>(null);
  captchaInput = signal<string>('');
  isCaptchaLoading = signal<boolean>(false);
  captchaFetched = signal<boolean>(false);
  isImageZoomed = signal<boolean>(false);

  // Add these signals after captcha signals
  showOtpModal = signal<boolean>(false);
  otpInput = signal<string>('');
  isOtpLoading = signal<boolean>(false);
  otpFetched = signal<boolean>(false);

  //zoom captcha imagee
  zoomLevel = signal<number>(1);
  panX = signal<number>(0);
  panY = signal<number>(0);
  isDragging = signal<boolean>(false);
  private dragStartX = 0;
  private dragStartY = 0;
  private lastPanX = 0;
  private lastPanY = 0;

  employeeId = signal(this.authSrv.userDetails?.employeeId);

  private destroy$ = new Subject<void>();
  private statusPolling$ = new Subject<void>();

  statePortals: StatePortal[] = [
    {
      displayName: 'Andhra Pradesh',
      apiValue: 'andhra_pradesh',
      manualLink: 'https://horticulturedept.ap.gov.in'
    },
    {
      displayName: 'Chhattisgarh',
      apiValue: 'chhattisgarh',
      manualLink: 'http://champs.cgstate.gov.in/PAGES/TRNS_DASHBOARD'
    },
    {
      displayName: 'Gujarat',
      apiValue: 'gujarat',
      manualLink: 'https://portal.ggrc.co.in/ggrcmain/page/login.aspx'
    },
    {
      displayName: 'Karnataka (Horticulture)',
      apiValue: 'karnataka_horti',
      manualLink: 'https://hasiru.karnataka.gov.in/'
    },
    {
      displayName: 'Karnataka (K-Kisan)',
      apiValue: 'karnataka_kkisan',
      manualLink: 'https://kkisan.karnataka.gov.in/'
    },
    {
      displayName: 'Madhya Pradesh',
      apiValue: 'madhya_pradesh',
      manualLink: 'https://mpfsts.mp.gov.in/'
    },
    {
      displayName: 'Tamil Nadu',
      apiValue: 'tamil_nadu',
      manualLink: 'https://tnhorticulture.tn.gov.in:8080/Home/Index'
    },
    {
      displayName: 'Telangana',
      apiValue: 'telangana',
      manualLink: 'https://horticulturedept.telangana.gov.in/horticulturetelangana/(S(sfwppztjctdz1o4324tfqs2u))/newhome.aspx'
    },
    {
      displayName: 'Uttar Pradesh',
      apiValue: 'uttar_pradesh',
      manualLink: 'https://upmip.in/upmip/LOGIN.ASPX'
    },
    {
      displayName: 'West Bengal',
      apiValue: 'west_bengal',
      manualLink: 'https://bksy.wb.gov.in/pdmc/admin/mi-login.php'
    }
  ];

  private readonly stateToCaptchaMapping: { [key: string]: string } = {
    'andhra_pradesh': 'AndhraPradesh',
    'chhattisgarh': 'Chhattisgarh',
    'gujarat': 'Gujarat',
    'karnataka_horti': 'Karnataka_Horti',
    'karnataka_kkisan': 'Karnataka_Agri',
    'madhya_pradesh': 'MadhyaPradesh',
    'tamil_nadu': 'Tamilnadu',
    'telangana': 'Telangana',
    'uttar_pradesh': 'UttarPradesh',
    'west_bengal': 'WestBengal'
  };

  automationRunForm: FormGroup = new FormGroup({
    state: new FormControl('andhra_pradesh', [Validators.required]),
  });

  constructor() {
    this.breadCrumbItems.set([
      { label: 'Manage Jobs' },
    ]);
  }

  // ngOnInit() {
  //   // Listen to form changes
  //   this.automationRunForm.get('state')?.valueChanges
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe(() => {
  //       this.showStateError.set(false);
  //     });

  //   // Check if there's an active job and resume polling
  //   if (this.scrapperSrv.hasActiveJob()) {
  //     const jobId = this.currentJobId();
  //     const selectedState = this.scrapperSrv.persistentSelectedState();

  //     if (jobId) {
  //       console.log('Resuming scraping job:', jobId);

  //       // Set form value to the state that was being scraped
  //       if (selectedState) {
  //         this.automationRunForm.patchValue({ state: selectedState }, { emitEvent: false });
  //       }

  //       // Resume status polling
  //       this.startStatusPolling(jobId);
  //     }
  //   }
  // }
  ngOnInit() {
    // Listen to form changes
    this.automationRunForm.get('state')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.showStateError.set(false);
      });

    // Wait a moment for service to load from IndexedDB
    setTimeout(() => {
      // Check if there's an active job and resume polling
      if (this.scrapperSrv.hasActiveJob()) {
        const jobId = this.currentJobId();
        const selectedState = this.scrapperSrv.persistentSelectedState();

        if (jobId) {
          console.log('🔄 Resuming scraping job from IndexedDB:', jobId);

          // Set form value to the state that was being scraped
          if (selectedState) {
            this.automationRunForm.patchValue({ state: selectedState }, { emitEvent: false });
          }

          this.automationRunForm.get('state')?.disable();
          // Resume status polling
          this.startStatusPolling(jobId);
        }
      }
    }, 100); // Small delay to ensure IndexedDB load completes
  }

  /**
   * Start scraping
   */
  startScraping() {
    if (this.automationRunForm.invalid) {
      this.automationRunForm.markAllAsTouched();
      this.showStateError.set(true);
      return;
    }

    this.automationRunForm.get('state')?.disable()
    // Clear previous state
    this.scrapperSrv.clearScrapingState();
    this.captchaFetched.set(false);
    this.otpFetched.set(false);
    this.isLoading.set(true);

    const selectedState = this.automationRunForm.value.state;
    const requestBody = {
      state: selectedState,
      runBy: this.employeeId()
    };

    this.scrapperSrv._automationRun(requestBody)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.isLoading.set(false))
      )
      .subscribe({
        next: (res: any) => {
          if (res && res.jobId) {
            // Store in service for persistence
            this.scrapperSrv.setScrapingState(res.jobId, selectedState);
            this.addStatusMessage('Scraping job started successfully');
            this.toastSrv.showToast('Scraping started successfully!', 'success');
            this.startStatusPolling(res.jobId);
          } else {
            this.handleError('Invalid response from server');
          }
        },
        error: (err) => {
          this.handleError('Failed to start scraping. Please try again.');
          this.scrapperSrv.persistentIsActive.set(false);
        }
      });
  }

  /**
   * Start polling for status every 3 seconds
   */
  private startStatusPolling(jobId: string) {
    // Stop any existing polling
    this.stopStatusPolling();

    // Create new polling subject
    this.statusPolling$ = new Subject<void>();

    interval(5000)
      .pipe(
        takeUntil(this.statusPolling$),
        takeUntil(this.destroy$),
        switchMap(() => this.scrapperSrv._getAutomationStatus(jobId)),
        catchError((error) => {
          console.error('Error fetching status:', error);
          return of(null);
        })
      )
      .subscribe({
        next: (res: StatusResponse | null) => {
          if (!res) return;

          // Add status message
          if (res.progressMessage) {
            this.addStatusMessage(res.progressMessage);
          }

          // Handle different status
          switch (res.status) {
            case 'waiting_captcha':
              // Check if it's OTP request (Telangana case)
              if (res.progressMessage.toLowerCase().includes('otp')) {
                if (!this.otpFetched()) {
                  this.otpFetched.set(true);
                  setTimeout(() => this.showOtpInput(), 1000);
                }
              }
              // Otherwise it's captcha request (Tamil Nadu case)
              else {
                if (!this.captchaFetched()) {
                  this.captchaFetched.set(true);
                  setTimeout(() => this.fetchCaptcha(), 3000);
                }
              }
              break;

            case 'waiting_otp':
              // Check if OTP is needed after captcha (Tamil Nadu case)
              if (!this.otpFetched()) {
                this.otpFetched.set(true);
                setTimeout(() => this.showOtpInput(), 1000);
              }
              break;

             case 'running': {
              const msg = res.progressMessage.toLowerCase();
              const otpAlreadyProcessed =
                msg.includes('otp received') ||
                msg.includes('otp completed');

              if (msg.includes('otp') && !otpAlreadyProcessed && !this.otpFetched()) {
                this.otpFetched.set(true);
                setTimeout(() => this.showOtpInput(), 1000);
              }
              break;
            }


            case 'failed':
              // Stop everything
              this.stopScraping('Scraping failed!', 'error');

              // Show detailed error message with line breaks
              const message = 'Password changed or Site Issue. [BREAK] Please Contact Developer';
              this.confirmationDialogSrv.showError(message, 'Action Failed');

              const domFixInterval = setInterval(() => {
                const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
                let textNode;
                while ((textNode = walker.nextNode())) {
                  if (textNode.nodeValue && textNode.nodeValue.includes('[BREAK]')) {
                    const parent = textNode.parentNode as HTMLElement;
                    
                    parent.innerHTML = parent.innerHTML.replace('[BREAK]', '<br><br>');
                    
                    clearInterval(domFixInterval);
                    break;
                  }
                }
              }, 20); 
              setTimeout(() => clearInterval(domFixInterval), 2000);
              break;

            case 'cancelled':
              // Stop everything
              this.stopScraping('Scraping cancelled!', 'error');
              break;

            case 'finished':
              // Stop everything - success
              this.stopScraping('Scraping completed successfully!', 'success');
              break;
          }
        }
      });
  }

  private stopScraping(message: string, type: 'success' | 'error') {
    this.stopStatusPolling();
    this.scrapperSrv.setIsActive(false);
    this.addStatusMessage(message);
    this.toastSrv.showToast(message, type);

    this.automationRunForm.get('state')?.enable();

    // const jobId = this.currentJobId();

    //  const requestBody = {
    //   jobId : jobId
    // };
    // this.scrapperSrv._stopScrapping(requestBody)
    //   .pipe(
    //     takeUntil(this.destroy$),
    //   )
    //   .subscribe({
    //     next: (res: any) => {
    //     },
    //     error: (err) => {
    //       // this.handleError('Failed to stop scraping in server. Please try again.');
    //     }
    //   });

    // Clear IndexedDB after 5 seconds
    setTimeout(async () => {
      await this.scrapperSrv.clearScrapingState();
      console.log('🧹 Scraping state cleared from IndexedDB');
    }, 5000);
  }

  confirmationDialogSrv = inject(ConfirmationDialogService);

  async stopScrappingDialog(): Promise<void> {
    const confirmed = await this.confirmationDialogSrv.showConfirm(
      'Do you want to stop this scrapping?',
      'Stop Scrapping'
    );
    if (confirmed) this.stopScrapping();
  }

  stopScrapping(): void {
    const jobId = this.currentJobId();

    const requestBody = {
      jobId: jobId
    };

    this.scrapperSrv._stopScrapping(requestBody)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.toastSrv.showToast('Scrapping Stopped Successfully', 'success');
        },
        error: (error) => {
          this.toastSrv.showToast('Scrapping Stopped', 'error');
          
        }
      });
  }

  /**
   * Stop status polling
   */
  private stopStatusPolling() {
    this.statusPolling$.next();
    this.statusPolling$.complete();
  }

  /**
   * Fetch captcha image
   */
  private fetchCaptcha() {
    const selectedState = this.scrapperSrv.persistentSelectedState() || this.automationRunForm.value.state;

    if (!selectedState) {
      this.toastSrv.showToast('State not selected', 'error');
      return;
    }

    const captchaStateValue = this.stateToCaptchaMapping[selectedState];

    if (!captchaStateValue) {
      this.toastSrv.showToast('Invalid state selected', 'error');
      return;
    }

    this.isCaptchaLoading.set(true);

    this.scrapperSrv._getCaptcha(captchaStateValue)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.isCaptchaLoading.set(false))
      )
      .subscribe({
        next: (res: any) => {
          if (res && res.ImageBase64) {
            this.captchaImageBase64.set(res.ImageBase64);
            this.captchaInput.set('');
            this.openModal();
          } else {
            this.toastSrv.showToast('Failed to fetch captcha image', 'error');
          }
        },
        error: (err) => {
          this.toastSrv.showToast('Error fetching captcha. Please try again.', 'error');
        }
      });
  }

  zoomIn(): void {
    const newZoom = Math.min(this.zoomLevel() + 0.5, 5);
    this.zoomLevel.set(newZoom);
    this.clampPan();
  }

  /** Zoom Out */
  zoomOut(): void {
    const newZoom = Math.max(this.zoomLevel() - 0.5, 1);
    this.zoomLevel.set(newZoom);
    if (newZoom === 1) {
      this.panX.set(0);
      this.panY.set(0);
    } else {
      this.clampPan();
    }
  }

  /** Reset zoom and pan */
  resetZoom(): void {
    this.zoomLevel.set(1);
    this.panX.set(0);
    this.panY.set(0);
  }

  /** Mouse wheel zoom */
  onMouseWheel(event: WheelEvent): void {
    event.preventDefault();
    const delta = event.deltaY > 0 ? -0.25 : 0.25;
    const newZoom = Math.min(Math.max(this.zoomLevel() + delta, 1), 5);
    this.zoomLevel.set(newZoom);
    if (newZoom === 1) {
      this.panX.set(0);
      this.panY.set(0);
    } else {
      this.clampPan();
    }
  }

  /** Drag start */
  onDragStart(event: MouseEvent): void {
    if (this.zoomLevel() <= 1) return;
    event.preventDefault();
    this.isDragging.set(true);
    this.dragStartX = event.clientX;
    this.dragStartY = event.clientY;
    this.lastPanX = this.panX();
    this.lastPanY = this.panY();
  }

  /** Drag move */
  onDragMove(event: MouseEvent): void {
    if (!this.isDragging()) return;
    event.preventDefault();
    const dx = event.clientX - this.dragStartX;
    const dy = event.clientY - this.dragStartY;
    this.panX.set(this.lastPanX + dx);
    this.panY.set(this.lastPanY + dy);
    this.clampPan();
  }

  /** Drag end */
  onDragEnd(): void {
    this.isDragging.set(false);
  }

  /** Touch start */
  onTouchStart(event: TouchEvent): void {
    if (this.zoomLevel() <= 1 || event.touches.length !== 1) return;
    this.isDragging.set(true);
    this.dragStartX = event.touches[0].clientX;
    this.dragStartY = event.touches[0].clientY;
    this.lastPanX = this.panX();
    this.lastPanY = this.panY();
  }

  /** Touch move */
  onTouchMove(event: TouchEvent): void {
    if (!this.isDragging() || event.touches.length !== 1) return;
    event.preventDefault();
    const dx = event.touches[0].clientX - this.dragStartX;
    const dy = event.touches[0].clientY - this.dragStartY;
    this.panX.set(this.lastPanX + dx);
    this.panY.set(this.lastPanY + dy);
    this.clampPan();
  }

  /** Clamp pan so image stays within bounds */
  private clampPan(): void {
    if (!this.captchaFrame) return;
    const frame = this.captchaFrame.nativeElement as HTMLElement;
    const frameW = frame.clientWidth;
    const frameH = frame.clientHeight;
    const zoom = this.zoomLevel();

    // How much extra the image extends beyond the frame
    const overflowX = (frameW * (zoom - 1)) / 2;
    const overflowY = (frameH * (zoom - 1)) / 2;

    this.panX.set(Math.min(overflowX, Math.max(-overflowX, this.panX())));
    this.panY.set(Math.min(overflowY, Math.max(-overflowY, this.panY())));
  }

  /**
   * Submit captcha answer
   */
  submitCaptcha() {
    const captchaAnswer = this.captchaInput().trim();
    const jobId = this.currentJobId();

    if (!captchaAnswer) {
      this.toastSrv.showToast('Please enter the captcha', 'error');
      return;
    }

    if (!jobId) {
      this.toastSrv.showToast('Job ID not found', 'error');
      return;
    }

    this.isCaptchaLoading.set(true);

    const requestBody = {
      jobId: jobId,
      answer: captchaAnswer
    };

    this.scrapperSrv._postCaptcha(requestBody)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.isCaptchaLoading.set(false))
      )
      .subscribe({
        next: () => {
          this.toastSrv.showToast('Captcha submitted successfully!', 'success');
          this.addStatusMessage('Captcha submitted, continuing scraping...');
          this.closeModal();

          this.captchaFetched.set(false); // Reset flag to allow new captcha
          // Polling continues automatically  
        },
        error: (err) => {
          this.toastSrv.showToast('Error submitting captcha. Please try again.', 'error');
        }
      });
  }

  /**
   * Open modal
   */
  openModal(): void {
    if (this.captchaModal) {
      const modalElement = this.captchaModal.nativeElement;
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  /**
   * Close modal
   */
  closeModal(): void {
    if (this.captchaModal) {
      const modalElement = this.captchaModal.nativeElement;
      const activeElement = document.activeElement as HTMLElement;

      if (modalElement.contains(activeElement)) {
        activeElement.blur();
      }

      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      }

      this.captchaImageBase64.set(null);
      this.captchaInput.set('');
      this.isImageZoomed.set(false);
      this.resetZoom(); // Reset zoom on close
    }
  }

  /**
   * Toggle image zoom
   */
  toggleImageZoom() {
    this.isImageZoomed.update(zoomed => !zoomed);
  }

  /**
   * Add status message
   */
  private addStatusMessage(message: string) {
    this.scrapperSrv.addPersistentMessage(message);
  }

  /**
   * Handle errors
   */
  private handleError(message: string) {
    this.toastSrv.showToast(message, 'error');
    this.addStatusMessage(`Error: ${message}`);
  }

  /**
   * Open manual portal
   */
  openManual() {
    if (this.automationRunForm.invalid) {
      this.automationRunForm.markAllAsTouched();
      this.showStateError.set(true);
      return;
    }

    const selectedStateValue = this.automationRunForm.value.state;
    const selectedPortal = this.statePortals.find(
      portal => portal.apiValue === selectedStateValue
    );

    if (selectedPortal) {
      window.open(selectedPortal.manualLink, '_blank');
    } else {
      this.toastSrv.showToast('Portal link not found for selected state.', 'error');
    }
  }

  /**
   * Handle state change
   */
  onStateChange(event: Event) {
    this.showStateError.set(false);
  }

  /**
   * Get captcha image source
   */
  getCaptchaImageSrc(): string {
    const base64 = this.captchaImageBase64();
    return base64 ? `data:image/png;base64,${base64}` : '';
  }

  /**
 * Show OTP input modal
 */
  private showOtpInput(): void {
    this.otpInput.set('');
    this.openOtpModal();
  }

  /**
   * Submit OTP
   */
  submitOtp() {
    const otpValue = this.otpInput().trim();
    const jobId = this.currentJobId();

    if (!otpValue) {
      this.toastSrv.showToast('Please enter the OTP', 'error');
      return;
    }

    if (!jobId) {
      this.toastSrv.showToast('Job ID not found', 'error');
      return;
    }

    this.isOtpLoading.set(true);

    const requestBody = {
      jobId: jobId,
      answer: otpValue  // Using same 'answer' field as captcha
    };

    this.scrapperSrv._postCaptcha(requestBody)  // Using same API endpoint
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.isOtpLoading.set(false))
      )
      .subscribe({
        next: () => {
          this.toastSrv.showToast('OTP submitted successfully!', 'success');
          this.addStatusMessage('OTP submitted, continuing scraping...');
          this.closeOtpModal();
          this.otpFetched.set(false); // Reset flag to allow new OTP if needed
        },
        error: (err) => {
          this.toastSrv.showToast('Error submitting OTP. Please try again.', 'error');
        }
      });
  }

  /**
   * Open OTP modal
   */
  openOtpModal(): void {
    if (this.otpModal) {
      const modalElement = this.otpModal.nativeElement;
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  /**
   * Close OTP modal
   */
  closeOtpModal(): void {
    if (this.otpModal) {
      const modalElement = this.otpModal.nativeElement;
      const activeElement = document.activeElement as HTMLElement;

      if (modalElement.contains(activeElement)) {
        activeElement.blur();
      }

      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      }

      this.otpInput.set('');
    }
  }

  ngOnDestroy() {
    // Only clean up component-specific subjects
    // DO NOT stop polling - let it continue in the service
    this.destroy$.next();
    this.destroy$.complete();

    // Note: We intentionally do NOT call stopStatusPolling() here
    // so the polling continues even when navigating away
  }
}

