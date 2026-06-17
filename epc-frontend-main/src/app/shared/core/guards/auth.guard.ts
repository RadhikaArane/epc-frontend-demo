import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../services/common/auth.service';
import { of, switchMap, take } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authSrv = inject(AuthService);

  debugger
  // if (authSrv.userDetails) { 
  //   console.log("auth guard",authSrv.userDetails);
  //   return true;
  // } else {
  //   router.navigateByUrl('login'); 
  //   return false;
  // }

  // Check if user is already authenticated
  if (authSrv.userDetails) {
    console.log("auth guard - user authenticated:", authSrv.userDetails);
    return true;
  }
  
  // If no user details, check if session restoration is in progress
  // Wait for authentication state to be determined
  return authSrv.isAuthenticated$.pipe(
    // delay(50),
    take(1),
    switchMap(isAuthenticated => {
      if (isAuthenticated && authSrv.userDetails) {
        console.log("auth guard - session restored:", authSrv.userDetails);
        return of(true);
      } else {
        console.log("auth guard - no valid session, redirecting to login");
        router.navigateByUrl('login');
        return of(false);
      }
    })
  );

};
