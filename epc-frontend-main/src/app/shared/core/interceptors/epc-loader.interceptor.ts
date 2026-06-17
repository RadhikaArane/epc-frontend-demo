import { HttpContextToken, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { EpcLoaderService } from '../../services/common/epc-loader.service';
import { finalize } from 'rxjs';

export const SKIP_LOADER = new HttpContextToken<boolean>(() => false);

export const epcLoaderInterceptor: HttpInterceptorFn = (req, next) => {

  if (req.context.get(SKIP_LOADER)) {
    return next(req);
  }
  
  const epcLoaderService = inject(EpcLoaderService);

  epcLoaderService.show();

  return next(req).pipe(
    finalize(() => epcLoaderService.hide())
  );
};
