// import { Component, inject, signal } from '@angular/core';
// import { BreadcrumbsComponent } from '../../../../common/breadcrumbs/breadcrumbs.component';
// import { breadCrumbItems } from '../../../../../shared/models/models';
// import { CommonModule } from '@angular/common';
// import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
// import { ScrAutomationService } from '../../../../../shared/services/scrapper/scr-automation.service';
// import { Subject, takeUntil, finalize, interval, switchMap, catchError, of } from 'rxjs';
// import { ToastService } from '../../../../../shared/services/common/toast.service';
// import { StatePortal } from '../../../../../shared/models/scrapper-models/scrapperAutomation';

// interface StatusMessage {
//   message: string;
//   timestamp: Date;
// }

// @Component({
//   selector: 'app-scr-run-jobs',
//   standalone: true,
//   imports: [BreadcrumbsComponent, CommonModule, ReactiveFormsModule, FormsModule],
//   templateUrl: './scr-run-jobs.component.html',
//   styleUrl: './scr-run-jobs.component.scss'
// })
// export class ScrRunJobsComponent {

//   private scrapperSrv = inject(ScrAutomationService);
//   private toastSrv = inject(ToastService);

//   breadCrumbItems = signal<breadCrumbItems[]>([]);
//   isLoading = signal<boolean>(false);
//   showStateError = signal<boolean>(false);

//   // Status tracking
//   statusMessages = signal<StatusMessage[]>([]);
//   currentJobId = signal<string | null>(null);
//   isScrapingActive = signal<boolean>(false);

//   // Captcha modal
//   showCaptchaModal = signal<boolean>(false);
//   captchaImageBase64 = signal<string | null>(null);
//   captchaInput = signal<string>('');
//   isCaptchaLoading = signal<boolean>(false);
//   captchaJobId = signal<string | null>(null);
//   captchaFetched = signal<boolean>(false); // Track if captcha has been fetched

//   private destroy$ = new Subject<void>();
//   private statusPolling$ = new Subject<void>();

//   statePortals: StatePortal[] = [
//     {
//       displayName: 'Andhra Pradesh',
//       apiValue: 'andhra_pradesh',
//       manualLink: 'https://horticulturedept.ap.gov.in'
//     },
//     {
//       displayName: 'Chhattisgarh',
//       apiValue: 'chhattisgarh',
//       manualLink: 'http://champs.cgstate.gov.in/PAGES/TRNS_DASHBOARD'
//     },
//     {
//       displayName: 'Gujarat',
//       apiValue: 'gujarat',
//       manualLink: 'https://portal.ggrc.co.in/ggrcmain/page/login.aspx'
//     },
//     {
//       displayName: 'Karnataka (Horticulture)',
//       apiValue: 'karnataka_horticulture',
//       manualLink: 'https://hasiru.karnataka.gov.in/'
//     },
//     {
//       displayName: 'Karnataka (K-Kisan)',
//       apiValue: 'karnataka_agriculture',
//       manualLink: 'https://kkisan.karnataka.gov.in/'
//     },
//     {
//       displayName: 'Madhya Pradesh',
//       apiValue: 'madhya_pradesh',
//       manualLink: 'https://mpfsts.mp.gov.in/'
//     },
//     {
//       displayName: 'Tamil Nadu',
//       apiValue: 'tamil_nadu',
//       manualLink: 'https://tnhorticulture.tn.gov.in:8080/Home/Index'
//     },
//     {
//       displayName: 'Telangana',
//       apiValue: 'telangana',
//       manualLink: 'https://horticulturedept.telangana.gov.in/horticulturetelangana/(S(sfwppztjctdz1o4324tfqs2u))/newhome.aspx'
//     },
//     {
//       displayName: 'Uttar Pradesh',
//       apiValue: 'uttar_pradesh',
//       manualLink: 'https://upmip.in/upmip/LOGIN.ASPX'
//     },
//     {
//       displayName: 'West Bengal',
//       apiValue: 'west_bengal',
//       manualLink: 'https://bksy.wb.gov.in/pdmc/admin/mi-login.php'
//     }
//   ];

//   automationRunForm: FormGroup = new FormGroup({
//     state: new FormControl('andhra_pradesh', [Validators.required]),
//   });

//   constructor() {
//     this.breadCrumbItems.set([
//       { label: 'Manage Jobs' },
//     ]);
//   }

//   ngOnInit() {
//     this.automationRunForm.get('state')?.valueChanges
//       .pipe(takeUntil(this.destroy$))
//       .subscribe(() => {
//         this.showStateError.set(false);
//       });
//   }

//   /**
//    * Start scraping with selected state
//    */
//   startScraping() {
//     // Validate form
//     if (this.automationRunForm.invalid) {
//       this.automationRunForm.markAllAsTouched();
//       this.showStateError.set(true);
//       return;
//     }

//     // Reset previous state
//     this.statusMessages.set([]);
//     this.currentJobId.set(null);
//     this.captchaFetched.set(false); // Reset captcha fetch flag
//     this.isLoading.set(true);
//     this.isScrapingActive.set(true);

//     const requestBody = {
//       state: this.automationRunForm.value.state
//     };

//     // Call automation run API
//     this.scrapperSrv._automationRun(requestBody)
//       .pipe(
//         takeUntil(this.destroy$),
//         finalize(() => {
//           this.isLoading.set(false);
//         })
//       )
//       .subscribe({
//         next: (res: any) => {
//           if (res && res.jobId) {
//             console.log('Scraping started successfully:', res);
//             this.currentJobId.set(res.jobId);
//             this.addStatusMessage('Scraping job started successfully');
//             this.toastSrv.showToast('Scraping started successfully!', 'success');

//             // Start polling for status
//             this.startStatusPolling(res.jobId);
//           } else {
//             this.handleError('Invalid response from server');
//           }
//         },
//         error: (err) => {
//           console.error('Error starting scraping:', err);
//           this.handleError('Failed to start scraping. Please try again.');
//           this.isScrapingActive.set(false);
//         }
//       });
//   }

//   /**
//    * Start polling for job status every 3 seconds
//    */
//   private startStatusPolling(jobId: string) {
//     // Create new Subject for this polling session
//     this.statusPolling$ = new Subject<void>();

//     interval(3000)
//       .pipe(
//         takeUntil(this.statusPolling$),
//         takeUntil(this.destroy$),
//         switchMap(() => this.scrapperSrv._getAutomationStatus(jobId)),
//         catchError((error) => {
//           console.error('Error fetching status:', error);
//           return of(null);
//         })
//       )
//       .subscribe({
//         next: (res: any) => {
//           if (res && res.progressMessage) {
//             this.addStatusMessage(res.progressMessage);

//             // Check if captcha is required and fetch only once
//             if (res.progressMessage.toLowerCase().includes('waiting for user to solve captcha')
//               && !this.captchaFetched()) {
//             console.log("res.progressMessage.toLowerCase().includes('waiting for user to solve captcha')");
//               this.captchaFetched.set(true); // Mark as fetched to prevent multiple calls
//               // Wait 3 seconds before fetching captcha
//               setTimeout(() => {
//                 this.fetchCaptcha();
//               }, 3000);
//             }

//             // Check if job is complete
//             if (res.status === "Failed") {
//               console.log("Status Failed");
//               this.stopStatusPolling();
//               this.isScrapingActive.set(false);
//               this.toastSrv.showToast('Scraping completed successfully!', 'success');
//             }
//           }
//         },
//         error: (err) => {
//           console.error('Error in status polling:', err);
//           this.addStatusMessage('Error fetching status');
//         }
//       });
//   }

//   /**
//    * Stop status polling
//    */
//   private stopStatusPolling() {
//     this.statusPolling$.next();
//     this.statusPolling$.complete();
//   }

//   /**
//    * Fetch captcha image (called only once)
//    */
//   private fetchCaptcha() {
//     const selectedState = this.automationRunForm.value.state;

//     if (!selectedState) {
//       this.toastSrv.showToast('State not selected', 'error');
//       return;
//     }

//     this.isCaptchaLoading.set(true);

//     this.scrapperSrv._getCaptcha(selectedState)
//       .pipe(
//         takeUntil(this.destroy$),
//         finalize(() => {
//           this.isCaptchaLoading.set(false);
//         })
//       )
//       .subscribe({
//         next: (res: any) => {
//           if (res && res.ImageBase64) {
//             console.log('Captcha fetched successfully');
//             this.captchaImageBase64.set(res.ImageBase64);
//             this.captchaJobId.set(res.JobId || this.currentJobId());
//             this.showCaptchaModal.set(true);
//             this.captchaInput.set('');
//           } else {
//             this.toastSrv.showToast('Failed to fetch captcha image', 'error');
//           }
//         },
//         error: (err) => {
//           console.error('Error fetching captcha:', err);
//           this.toastSrv.showToast('Error fetching captcha. Please try again.', 'error');
//         }
//       });
//   }

//   /**
//    * Submit captcha answer
//    */
//   submitCaptcha() {
//     const captchaAnswer = this.captchaInput().trim();
//     const jobId = this.captchaJobId();

//     if (!captchaAnswer) {
//       this.toastSrv.showToast('Please enter the captcha', 'error');
//       return;
//     }

//     if (!jobId) {
//       this.toastSrv.showToast('Job ID not found', 'error');
//       return;
//     }

//     this.isCaptchaLoading.set(true);

//     const requestBody = {
//       jobId: jobId,
//       answer: captchaAnswer
//     };

//     this.scrapperSrv._postCaptcha(requestBody)
//       .pipe(
//         takeUntil(this.destroy$),
//         finalize(() => {
//           this.isCaptchaLoading.set(false);
//         })
//       )
//       .subscribe({
//         next: (response) => {
//           console.log('Captcha submitted successfully', response);
//           this.toastSrv.showToast('Captcha submitted successfully!', 'success');
//           this.addStatusMessage('Captcha submitted, continuing scraping...');
//           this.closeCaptchaModal();

//           // IMPORTANT: Restart status polling after captcha submission
//           // Status polling continues with the same jobId
//           const currentJobId = this.currentJobId();
//           if (currentJobId) {
//             console.log('Restarting status polling after captcha submission');
//             this.startStatusPolling(currentJobId);
//           }
//         },
//         error: (err) => {
//           console.error('Error submitting captcha:', err);
//           this.toastSrv.showToast('Error submitting captcha. Please try again.', 'error');
//         }
//       });
//   }

//   /**
//    * Close captcha modal
//    */
//   closeCaptchaModal() {
//     this.showCaptchaModal.set(false);
//     this.captchaImageBase64.set(null);
//     this.captchaInput.set('');
//     this.captchaJobId.set(null);
//   }

//   /**
//    * Add status message to the list
//    */
//   private addStatusMessage(message: string) {
//     const messages = this.statusMessages();
//     const newMessage: StatusMessage = {
//       message: message,
//       timestamp: new Date()
//     };

//     // Add new message at the beginning (latest first)
//     this.statusMessages.set([newMessage, ...messages]);
//   }

//   /**
//    * Handle errors
//    */
//   private handleError(message: string) {
//     this.toastSrv.showToast(message, 'error');
//     this.addStatusMessage(`Error: ${message}`);
//   }

//   /**
//    * Open manual portal for selected state
//    */
//   openManual() {
//     if (this.automationRunForm.invalid) {
//       this.automationRunForm.markAllAsTouched();
//       this.showStateError.set(true);
//       return;
//     }

//     const selectedStateValue = this.automationRunForm.value.state;
//     const selectedPortal = this.statePortals.find(
//       portal => portal.apiValue === selectedStateValue
//     );

//     if (selectedPortal) {
//       window.open(selectedPortal.manualLink, '_blank');
//       console.log(`Opening manual portal for ${selectedPortal.displayName}:`, selectedPortal.manualLink);
//     } else {
//       this.toastSrv.showToast('Portal link not found for selected state.', 'error');
//     }
//   }

//   /**
//    * Handle state change
//    */
//   onStateChange(event: Event) {
//     const target = event.target as HTMLSelectElement;
//     this.showStateError.set(false);
//     console.log('Selected state value:', target.value);
//   }

//   /**
//    * Get captcha image source
//    */
//   getCaptchaImageSrc(): string {
//     const base64 = this.captchaImageBase64();
//     return base64 ? `data:image/png;base64,${base64}` : '';
//   }

//   ngOnDestroy() {
//     this.stopStatusPolling();
//     this.destroy$.next();
//     this.destroy$.complete();
//   }
// }