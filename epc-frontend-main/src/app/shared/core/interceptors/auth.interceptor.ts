import { HttpInterceptorFn, HttpErrorResponse, HttpParams, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../services/common/auth.service';
import { catchError, switchMap, filter, take, map } from 'rxjs/operators';
import { throwError, BehaviorSubject, Observable } from 'rxjs';

// Global refresh state to prevent multiple simultaneous refresh attempts
let isRefreshing = false;
let refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authSrv = inject(AuthService);
  
  // Skip auth header for login and refresh token endpoints
  const skipAuthEndpoints = [
    '/AuthAPI/api/Auth/Login',
    '/AuthAPI/api/Auth/RefreshToken'
  ];

  const shouldSkipAuth = skipAuthEndpoints.some(endpoint => req.url.includes(endpoint));

  if (shouldSkipAuth) {
    console.log(`🔓 Skipping auth for endpoint: ${req.url}`);
    return next(req);
  }

  // Get current access token from memory
  const token = authSrv._getJWTToken();

  // Add Bearer token to request if available
  let authReq = req;
  if (token) {
    authReq = addTokenToRequest(req, token);
    console.log('🔑 Bearer token added to request header');
  } else {
    console.log('⚠️ No access token available for request');
  }

  // Check if this is an encrypted request from HttpWrapper
  const isEncryptedRequest = authReq.headers.has('x-request-id') && authReq.headers.has('x-aes-key');
  
  if (isEncryptedRequest) {
    console.log('🔄 Encrypted request from HttpWrapper detected - passing through');
    const requestId = authReq.headers.get('x-request-id');
    
    // Just pass through - HttpWrapper handles all encryption/decryption
    return next(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error(`❌ Encrypted request failed: ${error.status} ${error.message}`);

        if (error.status === 401 && token) {
          console.log('🚫 401 Unauthorized - Attempting token refresh...');
          return handle401Error(authReq, next, authSrv);
        }
        return throwError(() => error);
      })
    );
  }

  // Handle regular non-encrypted requests
  console.log('📄 Regular non-encrypted request');
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Handle 401 Unauthorized errors
      if (error.status === 401 && token) {
        console.log('🚫 401 Unauthorized - Attempting token refresh...');
        return handle401Error(authReq, next, authSrv);
      }

      // Handle other errors
      return throwError(() => error);
    })
  );
};

function addTokenToRequest(request: any, token: string) {
  return request.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });
}

function handle401Error(request: any, next: any, authSrv: AuthService): Observable<any> {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    console.log('🔄 Starting token refresh process...');

    return authSrv.refreshToken().pipe(
      switchMap((result: any) => {
        if (result && result.accessToken) {
          isRefreshing = false;
          refreshTokenSubject.next(result.accessToken);

          console.log('✅ Token refresh successful - Retrying original request');

          // Retry original request with new token
          const newAuthRequest = addTokenToRequest(request, result.accessToken);
          return next(newAuthRequest);
        } else {
          // Refresh failed - logout user
          isRefreshing = false;
          console.log('❌ Token refresh failed - Logging out user');
          authSrv.logout();
          return throwError(() => new Error('Session expired. Please login again.'));
        }
      }),
      catchError((error) => {
        isRefreshing = false;
        console.log('❌ Token refresh error - Logging out user');
        authSrv.logout();
        return throwError(() => error);
      })
    );
  } else {
    // Wait for the refresh to complete
    console.log('⏳ Waiting for ongoing token refresh...');
    return refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap((token) => {
        console.log('✅ Using refreshed token for queued request');
        const newAuthRequest = addTokenToRequest(request, token);
        return next(newAuthRequest);
      })
    );
  }
}