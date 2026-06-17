import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../../services/common/auth.service';

export const rolesBaseGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authSrv = inject(AuthService);
  const router = inject(Router);

  // Make sure userDetails is initialized
  const user = authSrv.userDetails;

  if (!user || !user.roleName || !user.projectTypeName) {
    alert('Access Denied: User is not authenticated.');
    router.navigateByUrl('unauthorized');
    return false;
  }

  // Extract required roles and project types from route data
  // const requiredRoles = route.data['expectedRoles'] as string[] ?? [];
  const requiredProjectTypes = route.data['projectTypeName'] as string[] ?? [];

  // const userRole = user.roleName;
  const userProjectType = user.projectTypeName;

  // Validate role
  // const isRoleValid = requiredRoles.length === 0 || requiredRoles.includes(userRole);
  // const isRoleValid = true

  // Validate project type
  const isProjectTypeValid = requiredProjectTypes.length === 0 || requiredProjectTypes.includes(userProjectType);

  console.log('🔒 Guard Check:', {
    userRole: user.roleName,
    userProjectType,
    requiredProjectTypes,
    isProjectTypeValid
  });

  debugger
  if (isProjectTypeValid) {
    return true;
  } else {
    alert('Access Denied: Role or Project Type mismatch.');
    router.navigateByUrl('unauthorized');
    return false;
  }
};