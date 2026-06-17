import { ApplicationConfig, APP_INITIALIZER, LOCALE_ID, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideNativeDateAdapter } from '@angular/material/core';
import { AuthService } from './shared/services/common/auth.service';
import { authInterceptor } from './shared/core/interceptors/auth.interceptor';  
import { epcLoaderInterceptor } from './shared/core/interceptors/epc-loader.interceptor';

import { registerLocaleData } from '@angular/common';
import localeEnIN from '@angular/common/locales/en-IN';
registerLocaleData(localeEnIN, 'en-IN');

export function initializeAuth(authService: AuthService): () => Promise<void> {
  return () => {
    console.log('🚀 Initializing authentication system...');
    console.log('📋 VAPT Compliance: No tokens in localStorage/sessionStorage/cookies');
    console.log('🔐 Security: RefreshToken encrypted in IndexedDB, AccessToken in memory only');
    
    return authService.restoreSession()
      .then(() => {
        console.log('✅ Authentication initialization completed successfully');
      })
      .catch((error) => {
        console.error('❌ Authentication initialization failed:', error);
        console.log('ℹ️ User will start with fresh login session');
        // Don't throw error - let app start even if session restore fails
      });
  };
}
 
export const appConfig: ApplicationConfig = {
  providers: [
    // HTTP Client with JWT auth interceptor
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(
      withInterceptors([authInterceptor]),
    ),
    provideHttpClient(withInterceptors([epcLoaderInterceptor])),
    provideNativeDateAdapter(), 
  
    provideRouter(routes),
    
    // Authentication initialization before app starts
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAuth,
      deps: [AuthService],
      multi: true,
    },
    
    { provide: LOCALE_ID, useValue: 'en-IN' },
     
  ],
};