// import { inject, Injectable } from '@angular/core';
// import { BehaviorSubject, firstValueFrom, Observable, of, throwError } from 'rxjs';
// import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
// import { tap, catchError, finalize } from 'rxjs/operators';
// import { Router } from '@angular/router';
// import { environment } from '../../../../environments/environment';
// import { LoginResponseModel } from '../../models/common-models/apiResponseMasl';
// import { jwtDecode } from 'jwt-decode';
// import { AuthStorageService } from './auth-storage.service';
// import { ConfirmationDialogService } from '../componentServices/confirmation-dialog.service';
// import { HttpEncSrvWrapperService } from './http-enc-srv-wrapper.service';
// import { CustomerModel, LoginModel } from '../../models/common-models/auth';
// import { DataService } from './data.service';

// // API Response interfaces
// export interface LoginApiResponse {
//   StatusCode: number
//   Status: number
//   Message: string
//   AccessToken: string
//   RefreshToken: string
//   data: {
//     UserId: number
//     EmployeeId: string
//     Name: string
//     Email: any
//     RoleId: number
//     RoleName: string
//     OrganisationId: string
//     IsActive: boolean
//     ReportingMgr: string
//     AccessLevel: string
//     DealerCode: any
//     DealerName: any
//     ProjectTypeId: number
//     ProjectTypeName: string
//   };
// }

// export interface RefreshTokenApiResponse {
//   accessToken: string;
//   refreshToken: string;
//   expiresIn: number;
// }

// export interface RefreshTokenApiRequest {
//   refreshToken: string;
// }

// interface JwtPayload {
//   exp: number;
//   iat?: number;
//   iss?: string;
//   aud?: string;
//   'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'?: string;
//   'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'?: string;
//   FullName: string;
//   UserId: number;
//   EmployeeId: string;
//   RoleId: number;
//   OrganisationId: string;
//   IsActive: boolean;
//   ReportingMgr: string;
//   AccessLevel: string;
//   DealerCode?: string | null;
//   DealerName?: string | null;
//   ProjectTypeId: number;
//   ProjectTypeName: string;
// }

// @Injectable({ providedIn: 'root' })
// export class AuthService {
//   private apiURL = environment.apiUrl;
//   private refreshInProgress = false;

//   // State management - ONLY IN MEMORY for VAPT compliance
//   private userDetails$ = new BehaviorSubject<CustomerModel | null>(null);
//   private token$ = new BehaviorSubject<string | null>(null);
//   public isAuthenticated$ = new BehaviorSubject<boolean>(false);

//   // Dependencies
//   private http = inject(HttpClient);
//   private dataSrv = inject(DataService);
//   private authStorageSrv = inject(AuthStorageService);
//   private router = inject(Router);
//   private httpWrapper = inject(HttpEncSrvWrapperService);
//   private confirmationDialogSrv = inject(ConfirmationDialogService);

//   // ==================
//   // IDLE TIMEOUT CONFIGURATION
//   // ==================
//   private readonly IDLE_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds
//   private readonly WARNING_TIME = 5 * 60 * 1000;  // 5 minutes warning in milliseconds
//   private readonly ACTIVITY_EVENTS = ['click', 'keydown', 'mousemove', 'scroll', 'touchstart'];

//   // Idle timeout state
//   private idleTimer: any = null;
//   private warningTimer: any = null;
//   private lastActivityTime = Date.now();
//   private warningDialogShown = false;
//   private activityListenerAttached = false;

//   loading: boolean = false;
//   private logoutInProgress = false;

//   constructor() {
//     // Session restoration handled by APP_INITIALIZER
//   }

//   // ==================
//   // PUBLIC OBSERVABLES & GETTERS
//   // ==================

//   get user$(): Observable<CustomerModel | null> {
//     return this.userDetails$.asObservable();
//   }

//   get isAuthentication$(): Observable<boolean> {
//     return this.isAuthenticated$.asObservable();
//   }

//   get userDetails(): CustomerModel | null {
//     return this.userDetails$.value;
//   }

//   get tokenValue(): string | null {
//     return this.token$.value;
//   }

//   get isLoggedIn(): boolean {
//     return this.isAuthenticated$.value;
//   }

//   _getJWTToken(): string | null {
//     return this.token$.value;
//   }

//   _getLoggedRole(): string | null {
//     return this.userDetails?.roleName || null;
//   }

//   get currentUser(): CustomerModel | null {
//     return this.userDetails$.value;
//   }

//   // ==================
//   // LOGIN METHOD
//   // ==================

//   _loginUser(loginData: LoginModel): Observable<LoginResponseModel> {
//     // Clear any existing state
//     this._clearAuthState();

//     return this.httpWrapper.post<LoginApiResponse>(`${this.apiURL}AuthService/api/Auth/Login`, loginData, {
//       headers: new HttpHeaders({
//         'Content-Type': 'application/json',
//         'Cache-Control': 'no-cache',
//         'Pragma': 'no-cache',
//         'Expires': '0',
//       }),
//     }).pipe(
//       tap(async (response) => {
//         if (this._isValidLoginResponse(response)) {
//           await this._setAuthStateFromLogin(response);
//           console.log('✅ Login successful - Starting idle timeout monitoring');
//         } else {
//           this._clearAuthState();
//           throw new Error('Invalid login response structure');
//         }
//       }),
//       catchError((error: HttpErrorResponse) => {
//         console.error('❌ Login failed:', error);
//         this._clearAuthState();
//         return throwError(() => this._handleAuthError(error));
//       })
//     );
//   }

//   forceEmitUserState(): void {
//     const currentUser = this.userDetails$.value;
//     console.log('Force emitting user state:', currentUser);

//     // Re-emit current value to ensure all subscribers get it
//     if (currentUser) {
//       this.userDetails$.next(currentUser);
//       this.isAuthenticated$.next(true);
//     } else {
//       this.userDetails$.next(null);
//       this.isAuthenticated$.next(false);
//     }
//   }

//   getCurrentUserSync(): CustomerModel | null {
//     return this.userDetails$.value;
//   }

//   // ==================
//   // SESSION RESTORATION
//   // ==================

//   async restoreSession(): Promise<void> {
//     try {
//       console.log('🔄 Attempting to restore session from encrypted RefreshToken...');

//       const hasRefreshToken = await this.authStorageSrv.hasValidRefreshToken();
//       if (!hasRefreshToken) {
//         console.log('❌ No valid refresh token found in IndexedDB');
//         this.isAuthenticated$.next(false);
//         return;
//       }

//       const refreshToken = await this.authStorageSrv.get<string>('refreshToken');
//       if (!refreshToken) {
//         console.log('❌ Failed to decrypt refresh token from IndexedDB');
//         this.isAuthenticated$.next(false);
//         return;
//       }

//       console.log('🔓 RefreshToken decrypted, attempting to refresh AccessToken...');
//       this.isAuthenticated$.next(true);

//       const refreshResult = await firstValueFrom(this._performRefreshToken(refreshToken));
//       if (refreshResult) {
//         console.log('✅ Session restored successfully - Starting idle monitoring');

//         setTimeout(() => {
//           this.forceEmitUserState();
//         }, 100);

//         this.dataSrv.reloadSidebar();
//         this.initIdleTimeout(); // Start idle monitoring only
//       } else {
//         console.log('❌ Session restoration failed - User will be logged out');
//         await this._performCompleteLogout();
//       }
//     } catch (error) {
//       console.error('❌ Session restoration error:', error);
//       await this._performCompleteLogout();
//     }
//   }

//   // ==================
//   // TOKEN REFRESH
//   // ==================

//   private _performRefreshToken(refreshToken: string): Observable<RefreshTokenApiResponse | null> {
//     if (this.refreshInProgress) {
//       console.log('⏳ Refresh already in progress, skipping...');
//       return of(null);
//     }

//     this.refreshInProgress = true;
//     console.log('🔄 Calling RefreshToken API...');

//     const requestBody: RefreshTokenApiRequest = {
//       refreshToken: refreshToken
//     };

//     return this.httpWrapper.post<RefreshTokenApiResponse>(`${this.apiURL}AuthService/api/Auth/RefreshToken`, requestBody, {
//       headers: new HttpHeaders({
//         'Content-Type': 'application/json',
//         'Cache-Control': 'no-cache',
//         'Pragma': 'no-cache',
//         'Expires': '0',
//       }),
//     }).pipe(
//       tap(async (response) => {
//         if (this._isValidRefreshResponse(response)) {
//           await this._updateTokensFromRefresh(response);
//           console.log(`✅ Tokens refreshed successfully - New AccessToken expires in ${response.expiresIn} minutes`);
//         } else {
//           throw new Error('Invalid refresh response structure');
//         }
//       }),
//       catchError((error: HttpErrorResponse) => {
//         console.error('❌ RefreshToken API failed:', error);

//         // Force immediate logout on refresh failure
//         this._clearAuthStateImmediately();
//         this._forceNavigateToLogin();

//         return of(null);
//       }),
//       finalize(() => {
//         this.refreshInProgress = false;
//       })
//     );
//   }

//   refreshToken(): Observable<RefreshTokenApiResponse | null> {
//     return new Observable(observer => {
//       if (!this.isLoggedIn) {
//         observer.next(null);
//         observer.complete();
//         return;
//       }

//       this.authStorageSrv.get<string>('refreshToken').then(refreshToken => {
//         if (!refreshToken) {
//           this._clearAuthStateImmediately();
//           this._forceNavigateToLogin();
//           observer.next(null);
//           observer.complete();
//           return;
//         }

//         this._performRefreshToken(refreshToken).subscribe({
//           next: (result) => {
//             if (!result) {
//               // Refresh failed - force logout
//               console.log('❌ Refresh failed - forcing logout');
//               this._clearAuthStateImmediately();
//               this._forceNavigateToLogin();
//             }
//             observer.next(result);
//             observer.complete();
//           },
//           error: (error) => {
//             console.error('❌ Refresh error - forcing logout');
//             this._clearAuthStateImmediately();
//             this._forceNavigateToLogin();
//             observer.error(error);
//           }
//         });
//       }).catch(error => {
//         console.error('❌ Storage error - forcing logout');
//         this._clearAuthStateImmediately();
//         this._forceNavigateToLogin();
//         observer.error(error);
//       });
//     });
//   }

//   // ==================
//   // IDLE TIMEOUT MANAGEMENT
//   // ==================

//   private initIdleTimeout(): void {
//     if (this.activityListenerAttached) {
//       this.resetIdleTimers();
//       return;
//     }

//     this.activityListenerAttached = true;
//     this.lastActivityTime = Date.now();

//     // Attach activity listeners
//     this.ACTIVITY_EVENTS.forEach(event => {
//       document.addEventListener(event, this.handleUserActivity.bind(this), true);
//     });

//     // Start idle monitoring
//     this.startIdleMonitoring();
//     console.log('✅ Idle timeout initialized - 30min timeout, 5min warning');
//   }

//   private handleUserActivity(): void {
//     const now = Date.now();
//     const timeSinceLastActivity = now - this.lastActivityTime;

//     // Only process if significant time has passed (avoid excessive calls)
//     if (timeSinceLastActivity < 1000) return;

//     this.lastActivityTime = now;

//     // Reset idle timers
//     this.resetIdleTimers();

//     // Close warning dialog if shown
//     if (this.warningDialogShown) {
//       this.warningDialogShown = false;
//       console.log('🔄 User activity detected - warning dismissed');
//     }

//     // Check if token needs refresh (independent of idle timeout)
//     this.checkAndRefreshTokenIfNeeded();

//     // Restart idle monitoring
//     this.startIdleMonitoring();
//   }

//   private startIdleMonitoring(): void {
//     this.resetIdleTimers();

//     // Set warning timer (25 minutes)
//     this.warningTimer = setTimeout(() => {
//       this.showIdleWarning();
//     }, this.IDLE_TIMEOUT - this.WARNING_TIME);

//     // Set logout timer (30 minutes)
//     this.idleTimer = setTimeout(() => {
//       this.handleIdleTimeout();
//     }, this.IDLE_TIMEOUT);
//   }

//   private resetIdleTimers(): void {
//     if (this.idleTimer) {
//       clearTimeout(this.idleTimer);
//       this.idleTimer = null;
//     }
//     if (this.warningTimer) {
//       clearTimeout(this.warningTimer);
//       this.warningTimer = null;
//     }
//   }

//   private showIdleWarning(): void {
//     if (this.warningDialogShown || !this.isLoggedIn) return;
//     this.warningDialogShown = true;
//     console.log('⚠️ Showing idle timeout warning');

//     this.confirmationDialogSrv.showWarning(
//       'Your session will expire in 5 minutes due to inactivity. Please interact with the page to continue.',
//       'Session Timeout Warning',
//       false  // Don't auto-close
//     );
//   }

//   private async handleIdleTimeout(): Promise<void> {
//     if (!this.isLoggedIn || this.logoutInProgress) return;
//     console.log('⏰ Idle timeout reached - logging out user');

//     // Clear state FIRST, show dialog AFTER
//     this._clearAuthStateImmediately();

//     this.confirmationDialogSrv.showError(
//       'Your session has expired due to 30 minutes of inactivity.',
//       'Session Expired',
//       false  // Don't auto-close
//     );

//     // Force immediate redirect
//     this._forceNavigateToLogin();
//   }

//   private checkAndRefreshTokenIfNeeded(): void {
//     // Safety check - if not logged in, don't try to refresh
//     if (!this.isLoggedIn || !this.currentUser) {
//       return;
//     }

//     if (!this._shouldRefreshToken() || this.refreshInProgress) return;

//     console.log('🔄 Token needs refresh - refreshing silently on user activity');

//     this.refreshToken().subscribe({
//       next: (response) => {
//         if (response?.accessToken) {
//           console.log('✅ Token refreshed silently - session extended');
//         } else {
//           console.log('⚠️ Token refresh returned empty - session may expire soon');
//         }
//       },
//       error: (error) => {
//         console.error('❌ Silent token refresh failed:', error);
//         // Don't force logout here - let interceptor handle it
//       }
//     });
//   }

//   // ==================
//   // TOKEN VALIDATION
//   // ==================

//   _isTokenValid(token: string): boolean {
//     try {
//       const decoded = jwtDecode<JwtPayload>(token);
//       const currentTime = Math.floor(Date.now() / 1000);
//       return decoded.exp > currentTime;
//     } catch (error) {
//       console.error('Token validation failed:', error);
//       return false;
//     }
//   }

//   _shouldRefreshToken(): boolean {
//     const token = this.token$.value;
//     if (!token) return false;

//     try {
//       const decoded = jwtDecode<JwtPayload>(token);
//       const currentTime = Math.floor(Date.now() / 1000);
//       const bufferTime = 15 * 60; // ✅ FIXED: 15 minutes buffer (was 5)
//       return decoded.exp - currentTime < bufferTime;
//     } catch (error) {
//       return true;
//     }
//   }

//   // ==================
//   // LOGOUT
//   // ==================

//   async logout(): Promise<void> {
//     if (this.logoutInProgress) return; // Prevent multiple logout calls

//     this.logoutInProgress = true;
//     console.log('🚪 User logout initiated...');

//     // Clear state IMMEDIATELY (don't wait)
//     this._clearAuthStateImmediately();

//     // Perform cleanup
//     await this._performCompleteLogout();

//     // Navigate immediately
//     this._forceNavigateToLogin();
//   }

//   async logoutOnPasswordChanged(): Promise<void> {
//     if (this.logoutInProgress) return;

//     this.logoutInProgress = true;
//     this._clearAuthStateImmediately();
//     await this._performCompleteLogout();
//     this._forceNavigateToLogin();
//   }

//   private _clearAuthStateImmediately(): void {
//     console.log('🧹 Clearing auth state immediately');

//     // Clear memory state instantly
//     this.userDetails$.next(null);
//     this.token$.next(null);
//     this.isAuthenticated$.next(false);

//     // Clear timers immediately
//     this.resetIdleTimers();

//     // Remove activity listeners immediately
//     if (this.activityListenerAttached) {
//       this.ACTIVITY_EVENTS.forEach(event => {
//         document.removeEventListener(event, this.handleUserActivity.bind(this), true);
//       });
//       this.activityListenerAttached = false;
//     }

//     // Reset flags
//     this.warningDialogShown = false;
//     this.refreshInProgress = false;
//   }

//   private _forceNavigateToLogin(): void {
//     console.log('🔄 Force navigating to login');

//     // Multiple approaches to ensure redirect happens
//     setTimeout(() => {
//       if (this.router.url !== '/login') {
//         this.router.navigateByUrl('/login').then(() => {
//           this._clearBrowserDataForVAPT();
//           this.logoutInProgress = false;

//           // Force page reload to clear any remaining component state
//           setTimeout(() => {
//             window.location.reload();
//           }, 100);
//         }).catch(() => {
//           // If navigation fails, force page reload to login
//           window.location.href = '/login';
//         });
//       }
//     }, 200);
//   }

//   // ==================
//   // JWT DECODING
//   // ==================

//   private _extractUserDetailsFromJWT(accessToken: string): CustomerModel | null {
//     try {
//       console.log('🔍 Decoding JWT to extract user details...');
//       const decodedToken = jwtDecode<JwtPayload>(accessToken);
//       console.log("decodedToken", decodedToken);

//       const rawProjectTypeId = Number(decodedToken.ProjectTypeId) || 0;
//       const projectTypeNameMap: Record<number, string> = {
//         1: 'Scrapper',
//         2: 'Trade Receivable',
//         3: 'Unrecognised Invoice',
//         4: 'Project Business',
//         6: 'Fixed Asset',
//       };

//       const userDetails: CustomerModel = {
//         userId: Number(decodedToken.UserId),
//         employeeId: decodedToken.EmployeeId?.toString() || '',
//         name: decodedToken.FullName || '',
//         email: decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || '',
//         roleId: Number(decodedToken.RoleId),
//         roleName: decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || '',
//         organisationId: decodedToken.OrganisationId?.toString() || '',
//         isActive: Boolean(decodedToken.IsActive),
//         reportingMgr: decodedToken.ReportingMgr || '',
//         accessLevel: decodedToken.AccessLevel || '',
//         dealerCode: decodedToken.DealerCode || null,
//         dealerName: decodedToken.DealerName || null,
//         projectTypeId: Number(decodedToken.ProjectTypeId) || 0,
//         projectTypeName: projectTypeNameMap[rawProjectTypeId] ?? ''
//       };

//       console.log('✅ User details extracted from JWT:', userDetails);
//       return userDetails;
//     } catch (error) {
//       console.error('❌ Failed to decode JWT and extract user details:', error);
//       return null;
//     }
//   }

//   // ==================
//   // PRIVATE HELPER METHODS
//   // ==================

//   private async _setAuthStateFromLogin(response: LoginApiResponse): Promise<void> {
//     try {
//       const customerData: CustomerModel = {
//         userId: response.data.UserId,
//         employeeId: response.data.EmployeeId,
//         name: response.data.Name,
//         email: response.data.Email,
//         roleId: response.data.RoleId,
//         roleName: response.data.RoleName,
//         organisationId: response.data.OrganisationId,
//         isActive: response.data.IsActive,
//         reportingMgr: response.data.ReportingMgr,
//         accessLevel: response.data.AccessLevel,
//         dealerCode: response.data.DealerCode,
//         dealerName: response.data.DealerName,
//         projectTypeId: response.data.ProjectTypeId,
//         projectTypeName: response.data.ProjectTypeName
//       };

//       this.userDetails$.next(customerData);
//       this.token$.next(response.AccessToken);
//       this.isAuthenticated$.next(true);

//       await this.authStorageSrv.set('refreshToken', response.RefreshToken);

//       this.dataSrv.reloadSidebar();

//       // Initialize idle timeout monitoring only
//       this.initIdleTimeout();

//     } catch (error) {
//       console.error('Failed to set auth state:', error);
//       throw new Error('Authentication state setup failed');
//     }
//   }

//   private async _updateTokensFromRefresh(response: RefreshTokenApiResponse): Promise<void> {
//     try {
//       this.token$.next(response.accessToken);

//       const userDetails = this._extractUserDetailsFromJWT(response.accessToken);
//       if (userDetails) {
//         this.userDetails$.next(userDetails);
//         console.log('✅ User details restored from JWT token');
//       } else {
//         console.error('❌ Failed to extract user details from JWT');
//         throw new Error('Failed to extract user details from JWT');
//       }

//       await this.authStorageSrv.set('refreshToken', response.refreshToken);
//       this.isAuthenticated$.next(true);

//     } catch (error) {
//       console.error('Failed to update tokens from refresh:', error);
//       await this.logout();
//     }
//   }

//   private _clearAuthState(): void {
//     this.userDetails$.next(null);
//     this.token$.next(null);
//     this.isAuthenticated$.next(false);
//   }

//   private async _performCompleteLogout(): Promise<void> {
//     try {
//       console.log('🧹 Performing complete logout cleanup...');

//       // Auth state already cleared in _clearAuthStateImmediately

//       // Secure wipe of IndexedDB (async but don't wait)
//       this.authStorageSrv.secureWipe().catch(error => {
//         console.error('IndexedDB cleanup failed:', error);
//       });

//       // Clear application data (async but don't wait)
//       setTimeout(() => {
//         this.dataSrv.resetData();
//         this.dataSrv.clearSidebar();
//       }, 200);

//     } catch (error) {
//       console.error('Logout cleanup failed:', error);
//     }
//   }

//   private _clearBrowserDataForVAPT(): void {
//     try {
//       if (console.clear) {
//         console.clear();
//       }

//       localStorage.clear();
//       sessionStorage.clear();

//       if ('serviceWorker' in navigator) {
//         navigator.serviceWorker.getRegistrations().then(registrations => {
//           registrations.forEach(registration => registration.unregister());
//         });
//       }

//       console.log('🧹 Browser data cleared for VAPT compliance');
//     } catch (error) {
//       console.error('Failed to clear browser data:', error);
//     }
//   }

//   // ==================
//   // RESPONSE VALIDATION
//   // ==================

//   private _isValidLoginResponse(response: LoginApiResponse): boolean {
//     return !!(
//       response &&
//       response.Status === 200 &&
//       response.AccessToken &&
//       response.RefreshToken &&
//       response.data &&
//       response.data.UserId &&
//       response.data.RoleName &&
//       response.data.ProjectTypeName
//     );
//   }

//   private _isValidRefreshResponse(response: RefreshTokenApiResponse): boolean {
//     return !!(
//       response &&
//       response.accessToken &&
//       response.refreshToken &&
//       typeof response.expiresIn === 'number'
//     );
//   }

//   // ==================
//   // ERROR HANDLING
//   // ==================

//   private _handleAuthError(error: HttpErrorResponse): Error {
//     let errorMessage = 'Authentication failed';

//     if (error.status === 401) {
//       errorMessage = 'Invalid credentials';
//     } else if (error.status === 403) {
//       errorMessage = 'Access forbidden';
//     } else if (error.status === 0) {
//       errorMessage = 'Network error - please check your connection';
//     } else if (error.error?.message) {
//       errorMessage = error.error.message;
//     }

//     return new Error(errorMessage);
//   }

//   // ==================
//   // DIALOG HELPER
//   // ==================

//   openDialog(title: any, message: any, type: any) {
//     let dialogData = {
//       title: title,
//       message: message,
//       type: type
//     };
//     this.confirmationDialogSrv.openDialog(dialogData);
//   }
// }