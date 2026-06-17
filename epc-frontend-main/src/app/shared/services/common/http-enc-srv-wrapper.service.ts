import {
  HttpClient,
  HttpParams,
  HttpHeaders,
  HttpResponse,
  HttpContext,
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, from, throwError } from 'rxjs';
import { switchMap, tap, map, catchError } from 'rxjs/operators';
import { EncryptionServiceService } from './encryption-service.service';
import { SecondaryDiscountsPatch } from '../../models/tradeReceivable-models/trManageSales';
import { StageMasterDeleteRequest } from '../../models/tradeReceivable-models/stageMaster';

export interface HttpOptions {
  headers?: HttpHeaders | { [header: string]: string | string[] };
  params?: HttpParams | { [param: string]: string | string[] };
  body?: any;
  responseType?: 'json' | 'text' | 'blob' | 'arraybuffer';
  withCredentials?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class HttpEncSrvWrapperService {
  request<T>(
    arg0: string,
    arg1: string,
    arg2: { body: StageMasterDeleteRequest },
  ): Observable<
    import('../../models/tradeReceivable-models/stageMaster').ApiResponse<any>
  > {
    throw new Error('Method not implemented.');
  }

  private http = inject(HttpClient);
  private encryptionSrv = inject(EncryptionServiceService);

  constructor() { }
  //---------------------------------------------------------------------
  get<T = any>(
    url: string,
    options?: HttpOptions & {
      encryptedParams?: { [key: string]: any };
      plainParams?: { [key: string]: any };
      context?: HttpContext;
    },
  ): Observable<T> {
    console.log('============================================================');
    console.log('🚀 GET REQUEST');
    console.log('============================================================');
    console.log(`📍 API URL: ${url}`);
    console.log('📋 Options:', options);

    // 🔥 CRITICAL: Check if this is a blob/file download request
    const isBlobRequest = options?.responseType === 'blob';
    const needsEncryption = this.encryptionSrv.shouldEncrypt(url);

    // 🔥 For blob downloads, handle differently - NO DECRYPTION
    if (isBlobRequest) {
      console.log('📦 Blob download request detected - bypassing decryption');

      if (needsEncryption) {
        const encryptedParams = options?.encryptedParams || {};
        const plainParams = options?.plainParams || {};

        let legacyParams = {};
        if (
          Object.keys(encryptedParams).length === 0 &&
          Object.keys(plainParams).length === 0
        ) {
          legacyParams = this.extractParamsFromOptions(options);
        }

        const paramsToEncrypt =
          Object.keys(encryptedParams).length > 0
            ? encryptedParams
            : legacyParams;

        return from(
          this.encryptionSrv.encryptSensitiveData(paramsToEncrypt),
        ).pipe(
          switchMap(({ encryptedParams: encrypted, xAesKey, requestId }) => {
            console.log(
              `✅ Parameters encrypted for blob download with requestId: ${requestId}`,
            );

            let combinedParams = new HttpParams();

            Object.keys(encrypted).forEach((key) => {
              combinedParams = combinedParams.set(key, encrypted[key]);
            });

            Object.keys(plainParams).forEach((key) => {
              const value = plainParams[key];
              if (value !== null && value !== undefined) {
                combinedParams = combinedParams.set(key, value.toString());
              }
            });

            const headers = this.createHeadersWithEncryption(
              options?.headers,
              xAesKey,
              requestId,
            );

            const requestOptions: any = {
              ...options,
              params: combinedParams,
              headers: headers,
              responseType: 'blob', // 🔥 Keep blob type for binary data
            };

            delete requestOptions.encryptedParams;
            delete requestOptions.plainParams;

            console.log(
              `📤 Making blob download request with requestId: ${requestId}`,
            );
            console.log(
              '============================================================\n',
            );

            // 🔥 Direct return without decryption for blob
            return this.http.get(url, requestOptions).pipe(
              map((response) => response as T),
              catchError((err) => {
                console.error('❌ Blob download failed:', err);
                return throwError(() => err);
              }),
            );
          }),
        );
      } else {
        // Non-encrypted blob download
        console.log('📦 Non-encrypted blob download');
        const requestOptions: any = {
          ...options,
          responseType: 'blob',
        };

        delete requestOptions.encryptedParams;
        delete requestOptions.plainParams;

        return this.http.get(url, requestOptions).pipe(
          map((response) => response as T),
          catchError((err) => throwError(() => err)),
        );
      }
    }

    // 🔥 Rest of your existing encryption logic for non-blob requests...
    if (needsEncryption) {
      console.log('🔐 GET endpoint requires encryption processing...');

      const encryptedParams = options?.encryptedParams || {};
      const plainParams = options?.plainParams || {};

      let legacyParams = {};
      if (
        Object.keys(encryptedParams).length === 0 &&
        Object.keys(plainParams).length === 0
      ) {
        legacyParams = this.extractParamsFromOptions(options);
      }

      const paramsToEncrypt =
        Object.keys(encryptedParams).length > 0
          ? encryptedParams
          : legacyParams;

      console.log('🔐 Params to encrypt:', Object.keys(paramsToEncrypt));
      console.log('📋 Plain params:', Object.keys(plainParams));

      if (
        Object.keys(paramsToEncrypt).length > 0 ||
        Object.keys(plainParams).length > 0
      ) {
        console.log('📋 Processing mixed or encrypted parameters...');

        return from(
          this.encryptionSrv.encryptSensitiveData(paramsToEncrypt),
        ).pipe(
          switchMap(({ encryptedParams: encrypted, xAesKey, requestId }) => {
            console.log(
              `✅ GET parameters encrypted with requestId: ${requestId}`,
            );

            this.encryptionSrv.setApiUrlForRequest(requestId, url);

            let combinedParams = new HttpParams();

            Object.keys(encrypted).forEach((key) => {
              combinedParams = combinedParams.set(key, encrypted[key]);
            });

            Object.keys(plainParams).forEach((key) => {
              const value = plainParams[key];
              if (value !== null && value !== undefined) {
                combinedParams = combinedParams.set(key, value.toString());
              }
            });

            const headers = this.createHeadersWithEncryption(
              options?.headers,
              xAesKey,
              requestId,
            );

            const requestOptions: any = {
              ...options,
              params: combinedParams,
              headers: headers,
              responseType: 'text' as 'json',
            };

            delete requestOptions.encryptedParams;
            delete requestOptions.plainParams;

            console.log(
              `📤 Making mixed encryption GET request with requestId: ${requestId}`,
            );
            console.log(
              '============================================================\n',
            );

            return this.http.get(url, requestOptions).pipe(
              tap((response) => {
                console.log(
                  '============================================================',
                );
                console.log('📥 GET RESPONSE RECEIVED');
                console.log(
                  '============================================================',
                );
                console.log(`📍 API URL: ${url}`);
                console.log(`🆔 Request ID: ${requestId}`);
                console.log(`📦 Response Type: ${typeof response}`);
                console.log(
                  '============================================================\n',
                );
              }),
              switchMap((response) => {
                return from(
                  this.encryptionSrv.processApiResponse(response, requestId),
                );
              }),
              map((processedResponse) => {
                return processedResponse as T;
              }),
              catchError((err) => {
                return this.handleError(err, requestId, url);
              }),
            );
          }),
          catchError((encryptionError) => {
            console.error('❌ GET encryption failed:', encryptionError);
            return throwError(() => encryptionError);
          }),
        );
      } else {
        console.log(
          '🔐 No parameters to encrypt, but API requires encryption - generating AES key for response decryption',
        );

        return from(this.encryptionSrv.encryptSensitiveData({})).pipe(
          switchMap(({ encryptedParams, xAesKey, requestId }) => {
            console.log(
              `✅ GET AES key generated for no-param API with requestId: ${requestId}`,
            );

            this.encryptionSrv.setApiUrlForRequest(requestId, url);

            const headers = this.createHeadersWithEncryption(
              options?.headers,
              xAesKey,
              requestId,
            );

            const requestOptions: any = {
              ...options,
              headers: headers,
              responseType: 'text' as 'json',
            };

            delete requestOptions.encryptedParams;
            delete requestOptions.plainParams;

            console.log(
              `📤 Making encrypted GET request (no params) with requestId: ${requestId}`,
            );
            console.log(
              '============================================================\n',
            );

            return this.http.get(url, requestOptions).pipe(
              tap((response) => {
                console.log(
                  '============================================================',
                );
                console.log('📥 GET RESPONSE RECEIVED (NO PARAMS)');
                console.log(
                  '============================================================',
                );
                console.log(`📍 API URL: ${url}`);
                console.log(`🆔 Request ID: ${requestId}`);
                console.log(`📦 Response Type: ${typeof response}`);
                console.log(
                  '============================================================\n',
                );
              }),
              switchMap((response) => {
                return from(
                  this.encryptionSrv.processApiResponse(response, requestId),
                );
              }),
              map((processedResponse) => {
                return processedResponse as T;
              }),
              catchError((err) => {
                return this.handleError(err, requestId, url);
              }),
            );
          }),
          catchError((encryptionError) => {
            console.error(
              '❌ GET AES key generation failed for no-param API:',
              encryptionError,
            );
            return throwError(() => encryptionError);
          }),
        );
      }
    }

    console.log("📄 GET endpoint doesn't require encryption");
    console.log(
      '============================================================\n',
    );
    const requestOptions: any = {
      ...options,
      responseType: options?.responseType || 'json',
    };

    delete requestOptions.encryptedParams;
    delete requestOptions.plainParams;

    return this.http.get(url, requestOptions).pipe(
      map((response) => response as T),
      catchError((err) => throwError(() => err)),
    );
  }

  post<T = any>(url: string, body: any, options?: HttpOptions): Observable<T> {
    console.log('============================================================');
    console.log('🚀 POST REQUEST');
    console.log('============================================================');
    console.log(`📍 API URL: ${url}`);
    console.log('📋 Original body type:', typeof body);

    // 🔥 CRITICAL: Check if this is a blob/file download request
    const isBlobRequest = options?.responseType === 'blob';
    const needsEncryption = this.encryptionSrv.shouldEncrypt(url);

    // 🔥 For blob downloads, handle differently - NO DECRYPTION
    if (isBlobRequest) {
      console.log('📦 Blob download request detected - bypassing decryption');

      if (needsEncryption) {
        console.log(
          '🔐 POST blob endpoint requires encryption, encrypting body...',
        );

        return from(this.encryptBodyData(body)).pipe(
          switchMap(({ encryptedBody, xAesKey, requestId }) => {
            console.log(
              `✅ POST body encrypted for blob download with requestId: ${requestId}`,
            );

            let headers = this.createHeadersWithEncryption(
              options?.headers,
              xAesKey,
              requestId,
            );

            if (encryptedBody instanceof FormData) {
              console.log('🔐 FormData detected - NOT setting Content-Type');
            } else {
              console.log(
                '🔐 JSON body detected - setting Content-Type to application/json',
              );
              headers = headers.set('Content-Type', 'application/json');
            }

            const requestOptions: any = {
              ...options,
              headers: headers,
              responseType: 'blob', // 🔥 Keep blob type for binary data
            };

            console.log(
              `📤 Making encrypted POST blob request with requestId: ${requestId}`,
            );
            console.log(
              '============================================================\n',
            );

            // 🔥 Direct return without decryption for blob
            return this.http.post(url, encryptedBody, requestOptions).pipe(
              map((response) => response as T),
              catchError((err) => {
                console.error('❌ Blob download failed:', err);
                return throwError(() => err);
              }),
            );
          }),
          catchError((encryptionError) => {
            console.error(
              '❌ POST body encryption failed for blob download:',
              encryptionError,
            );
            return throwError(() => encryptionError);
          }),
        );
      } else {
        // Non-encrypted blob download
        console.log('📦 Non-encrypted POST blob download');

        const requestOptions: any = {
          ...options,
          responseType: 'blob',
        };

        return this.http.post(url, body, requestOptions).pipe(
          map((response) => response as T),
          catchError((err) => throwError(() => err)),
        );
      }
    }

    // 🔥 Rest of your existing encryption logic for non-blob requests...
    if (needsEncryption) {
      console.log('🔐 POST endpoint requires encryption, encrypting body...');

      return from(this.encryptBodyData(body)).pipe(
        switchMap(({ encryptedBody, xAesKey, requestId }) => {
          console.log(`✅ POST body encrypted with requestId: ${requestId}`);

          // Store API URL for logging
          this.encryptionSrv.setApiUrlForRequest(requestId, url);

          let headers = this.createHeadersWithEncryption(
            options?.headers,
            xAesKey,
            requestId,
          );

          if (encryptedBody instanceof FormData) {
            console.log('🔐 FormData detected - NOT setting Content-Type');
          } else {
            console.log(
              '🔐 JSON body detected - setting Content-Type to application/json',
            );
            headers = headers.set('Content-Type', 'application/json');
          }

          const requestOptions: any = {
            ...options,
            headers: headers,
            responseType: 'text' as 'json',
          };

          console.log(
            `📤 Making encrypted POST request with requestId: ${requestId}`,
          );
          console.log(
            '============================================================\n',
          );

          return this.http.post(url, encryptedBody, requestOptions).pipe(
            tap((response) => {
              console.log(
                '============================================================',
              );
              console.log('📥 POST RESPONSE RECEIVED');
              console.log(
                '============================================================',
              );
              console.log(`📍 API URL: ${url}`);
              console.log(`🆔 Request ID: ${requestId}`);
              console.log('📦 Response type:', typeof response);
              console.log(
                '============================================================\n',
              );
            }),
            switchMap((response) => {
              return from(
                this.encryptionSrv.processApiResponse(response, requestId),
              );
            }),
            map((processedResponse) => {
              return processedResponse as T;
            }),
            catchError((err) => {
              return this.handleError(err, requestId, url);
            }),
          );
        }),
        catchError((encryptionError) => {
          console.error('❌ POST body encryption failed:', encryptionError);
          return throwError(() => encryptionError);
        }),
      );
    } else {
      console.log("📄 POST endpoint doesn't require encryption");
      console.log(
        '============================================================\n',
      );

      const requestOptions: any = {
        ...options,
        responseType: options?.responseType || 'json',
      };

      return this.http.post(url, body, requestOptions).pipe(
        map((response) => response as T),
        catchError((err) => throwError(() => err)),
      );
    }
  }

  patch<T = any>(url: string, body: any, options?: HttpOptions): Observable<T> {
    console.log('============================================================');
    console.log('🚀 PATCH REQUEST');
    console.log('============================================================');
    console.log(`📍 API URL: ${url}`);

    const needsEncryption = this.encryptionSrv.shouldEncrypt(url);

    if (needsEncryption) {
      console.log('🔐 PATCH endpoint requires encryption, processing...');

      const hasParams = options?.params && this.hasParameters(options.params);
      const hasBody = body && Object.keys(body).length > 0;

      console.log(
        `📋 PATCH request analysis: hasParams=${hasParams}, hasBody=${hasBody}`,
      );

      if (hasParams && hasBody) {
        console.log('📋 Scenario 3: Encrypting both params and body');

        const paramsToEncrypt = this.extractParamsFromOptions(options);
        const bodyToEncrypt = this.prepareBodyForEncryption(body);

        const combinedData: { [key: string]: any } = {};

        Object.keys(paramsToEncrypt).forEach((key) => {
          combinedData[`param_${key}`] = paramsToEncrypt[key];
        });

        Object.keys(bodyToEncrypt).forEach((key) => {
          combinedData[`body_${key}`] = bodyToEncrypt[key];
        });

        return from(this.encryptionSrv.encryptSensitiveData(combinedData)).pipe(
          switchMap(({ encryptedParams, xAesKey, requestId }) => {
            console.log(
              `✅ PATCH params and body encrypted with requestId: ${requestId}`,
            );

            this.encryptionSrv.setApiUrlForRequest(requestId, url);

            const encryptedUrlParams: { [key: string]: string } = {};
            const encryptedBodyData: { [key: string]: string } = {};

            Object.keys(encryptedParams).forEach((key) => {
              if (key.startsWith('param_')) {
                const originalKey = key.replace('param_', '');
                encryptedUrlParams[originalKey] = encryptedParams[key];
              } else if (key.startsWith('body_')) {
                const originalKey = key.replace('body_', '');
                encryptedBodyData[originalKey] = encryptedParams[key];
              }
            });

            let newParams = new HttpParams();
            Object.keys(encryptedUrlParams).forEach((key) => {
              newParams = newParams.set(key, encryptedUrlParams[key]);
            });

            const headers = this.createHeadersWithEncryption(
              options?.headers,
              xAesKey,
              requestId,
            ).set('Content-Type', 'application/json');

            const requestOptions: any = {
              ...options,
              params: newParams,
              headers: headers,
              responseType: 'text' as 'json',
            };

            console.log(
              `📤 Making encrypted PATCH request (params + body) with requestId: ${requestId}`,
            );
            console.log(
              '============================================================\n',
            );

            return this.http.patch(url, encryptedBodyData, requestOptions).pipe(
              tap((response) => {
                console.log(
                  '============================================================',
                );
                console.log('📥 PATCH RESPONSE RECEIVED');
                console.log(
                  '============================================================',
                );
                console.log(`📍 API URL: ${url}`);
                console.log(`🆔 Request ID: ${requestId}`);
                console.log(
                  '============================================================\n',
                );
              }),
              switchMap((response) => {
                return from(
                  this.encryptionSrv.processApiResponse(response, requestId),
                );
              }),
              map((processedResponse) => processedResponse as T),
              catchError((err) => {
                return this.handleError(err, requestId, url);
              }),
            );
          }),
        );
      } else if (hasParams && !hasBody) {
        console.log('📋 Scenario 1: Encrypting only params');

        const paramsToEncrypt = this.extractParamsFromOptions(options);

        return from(
          this.encryptionSrv.encryptSensitiveData(paramsToEncrypt),
        ).pipe(
          switchMap(({ encryptedParams, xAesKey, requestId }) => {
            console.log(
              `✅ PATCH params encrypted with requestId: ${requestId}`,
            );

            this.encryptionSrv.setApiUrlForRequest(requestId, url);

            let newParams = new HttpParams();
            Object.keys(encryptedParams).forEach((key) => {
              newParams = newParams.set(key, encryptedParams[key]);
            });

            const headers = this.createHeadersWithEncryption(
              options?.headers,
              xAesKey,
              requestId,
            );

            const requestOptions: any = {
              ...options,
              params: newParams,
              headers: headers,
              responseType: 'text' as 'json',
            };

            console.log(
              `📤 Making encrypted PATCH request (params only) with requestId: ${requestId}`,
            );
            console.log(
              '============================================================\n',
            );

            return this.http.patch(url, {}, requestOptions).pipe(
              tap((response) => {
                console.log(
                  '============================================================',
                );
                console.log('📥 PATCH RESPONSE RECEIVED (PARAMS ONLY)');
                console.log(
                  '============================================================',
                );
                console.log(`📍 API URL: ${url}`);
                console.log(`🆔 Request ID: ${requestId}`);
                console.log(
                  '============================================================\n',
                );
              }),
              switchMap((response) => {
                return from(
                  this.encryptionSrv.processApiResponse(response, requestId),
                );
              }),
              map((processedResponse) => processedResponse as T),
              catchError((err) => {
                return this.handleError(err, requestId, url);
              }),
            );
          }),
        );
      } else if (!hasParams && hasBody) {
        console.log('📋 Scenario 2: Encrypting only body');

        return from(this.encryptBodyData(body)).pipe(
          switchMap(({ encryptedBody, xAesKey, requestId }) => {
            console.log(`✅ PATCH body encrypted with requestId: ${requestId}`);

            this.encryptionSrv.setApiUrlForRequest(requestId, url);

            const headers = this.createHeadersWithEncryption(
              options?.headers,
              xAesKey,
              requestId,
            ).set('Content-Type', 'application/json');

            const requestOptions: any = {
              ...options,
              headers: headers,
              responseType: 'text' as 'json',
            };

            console.log(
              `📤 Making encrypted PATCH request (body only) with requestId: ${requestId}`,
            );
            console.log(
              '============================================================\n',
            );

            return this.http.patch(url, encryptedBody, requestOptions).pipe(
              tap((response) => {
                console.log(
                  '============================================================',
                );
                console.log('📥 PATCH RESPONSE RECEIVED (BODY ONLY)');
                console.log(
                  '============================================================',
                );
                console.log(`📍 API URL: ${url}`);
                console.log(`🆔 Request ID: ${requestId}`);
                console.log(
                  '============================================================\n',
                );
              }),
              switchMap((response) => {
                return from(
                  this.encryptionSrv.processApiResponse(response, requestId),
                );
              }),
              map((processedResponse) => processedResponse as T),
              catchError((err) => {
                return this.handleError(err, requestId, url);
              }),
            );
          }),
          catchError((encryptionError) => {
            console.error('❌ PATCH encryption failed:', encryptionError);
            return throwError(() => encryptionError);
          }),
        );
      } else {
        console.log('📋 No params or body to encrypt for PATCH request');

        const requestOptions: any = {
          ...options,
          responseType: 'text' as 'json',
        };

        return this.http.patch(url, body || {}, requestOptions).pipe(
          switchMap((response) => {
            const tempRequestId = `temp_${Date.now()}_${Math.random().toString(36).substring(2)}`;
            return from(
              this.encryptionSrv.processApiResponse(response, tempRequestId),
            );
          }),
          map((processedResponse) => processedResponse as T),
        );
      }
    } else {
      console.log("📄 PATCH endpoint doesn't require encryption");
      console.log(
        '============================================================\n',
      );

      const requestOptions: any = {
        ...options,
        responseType: options?.responseType || 'json',
      };

      return this.http
        .patch(url, body, requestOptions)
        .pipe(map((response) => response as T));
    }
  }

  put<T = any>(url: string, body: any, options?: HttpOptions): Observable<T> {
    console.log('============================================================');
    console.log('🚀 PUT REQUEST');
    console.log('============================================================');
    console.log(`📍 API URL: ${url}`);

    const needsEncryption = this.encryptionSrv.shouldEncrypt(url);

    if (needsEncryption) {
      console.log('🔐 PUT endpoint requires encryption, processing...');

      const hasParams = options?.params && this.hasParameters(options.params);
      const hasBody = body && Object.keys(body).length > 0;

      console.log(
        `📋 PUT request analysis: hasParams=${hasParams}, hasBody=${hasBody}`,
      );

      if (hasParams && hasBody) {
        console.log('📋 Scenario 3: Encrypting both params and body');

        const paramsToEncrypt = this.extractParamsFromOptions(options);
        const bodyToEncrypt = this.prepareBodyForEncryption(body);

        const combinedData: { [key: string]: any } = {};

        Object.keys(paramsToEncrypt).forEach((key) => {
          combinedData[`param_${key}`] = paramsToEncrypt[key];
        });

        Object.keys(bodyToEncrypt).forEach((key) => {
          combinedData[`body_${key}`] = bodyToEncrypt[key];
        });

        return from(this.encryptionSrv.encryptSensitiveData(combinedData)).pipe(
          switchMap(({ encryptedParams, xAesKey, requestId }) => {
            console.log(
              `✅ PUT params and body encrypted with requestId: ${requestId}`,
            );

            // Store API URL for logging
            this.encryptionSrv.setApiUrlForRequest(requestId, url);

            const encryptedUrlParams: { [key: string]: string } = {};
            const encryptedBodyData: { [key: string]: string } = {};

            Object.keys(encryptedParams).forEach((key) => {
              if (key.startsWith('param_')) {
                const originalKey = key.replace('param_', '');
                encryptedUrlParams[originalKey] = encryptedParams[key];
              } else if (key.startsWith('body_')) {
                const originalKey = key.replace('body_', '');
                encryptedBodyData[originalKey] = encryptedParams[key];
              }
            });

            let newParams = new HttpParams();
            Object.keys(encryptedUrlParams).forEach((key) => {
              newParams = newParams.set(key, encryptedUrlParams[key]);
            });

            const headers = this.createHeadersWithEncryption(
              options?.headers,
              xAesKey,
              requestId,
            ).set('Content-Type', 'application/json');

            const requestOptions: any = {
              ...options,
              params: newParams,
              headers: headers,
              responseType: 'text' as 'json',
            };

            console.log(
              `📤 Making encrypted PUT request (params + body) with requestId: ${requestId}`,
            );
            console.log(
              '============================================================\n',
            );

            return this.http.put(url, encryptedBodyData, requestOptions).pipe(
              tap((response) => {
                console.log(
                  '============================================================',
                );
                console.log('📥 PUT RESPONSE RECEIVED');
                console.log(
                  '============================================================',
                );
                console.log(`📍 API URL: ${url}`);
                console.log(`🆔 Request ID: ${requestId}`);
                console.log(
                  '============================================================\n',
                );
              }),
              switchMap((response) => {
                return from(
                  this.encryptionSrv.processApiResponse(response, requestId),
                );
              }),
              map((processedResponse) => {
                return processedResponse as T;
              }),
              catchError((err) => {
                return this.handleError(err, requestId, url);
              }),
            );
          }),
        );
      } else if (hasParams && !hasBody) {
        console.log('📋 Scenario 1: Encrypting only params');

        const paramsToEncrypt = this.extractParamsFromOptions(options);

        return from(
          this.encryptionSrv.encryptSensitiveData(paramsToEncrypt),
        ).pipe(
          switchMap(({ encryptedParams, xAesKey, requestId }) => {
            console.log(`✅ PUT params encrypted with requestId: ${requestId}`);

            // Store API URL for logging
            this.encryptionSrv.setApiUrlForRequest(requestId, url);

            let newParams = new HttpParams();
            Object.keys(encryptedParams).forEach((key) => {
              newParams = newParams.set(key, encryptedParams[key]);
            });

            const headers = this.createHeadersWithEncryption(
              options?.headers,
              xAesKey,
              requestId,
            );

            const requestOptions: any = {
              ...options,
              params: newParams,
              headers: headers,
              responseType: 'text' as 'json',
            };

            console.log(
              `📤 Making encrypted PUT request (params only) with requestId: ${requestId}`,
            );
            console.log(
              '============================================================\n',
            );

            return this.http.put(url, {}, requestOptions).pipe(
              tap((response) => {
                console.log(
                  '============================================================',
                );
                console.log('📥 PUT RESPONSE RECEIVED (PARAMS ONLY)');
                console.log(
                  '============================================================',
                );
                console.log(`📍 API URL: ${url}`);
                console.log(`🆔 Request ID: ${requestId}`);
                console.log(
                  '============================================================\n',
                );
              }),
              switchMap((response) => {
                return from(
                  this.encryptionSrv.processApiResponse(response, requestId),
                );
              }),
              map((processedResponse) => {
                return processedResponse as T;
              }),
              catchError((err) => {
                return this.handleError(err, requestId, url);
              }),
            );
          }),
        );
      } else if (!hasParams && hasBody) {
        console.log('📋 Scenario 2: Encrypting only body');

        return from(this.encryptBodyData(body)).pipe(
          switchMap(({ encryptedBody, xAesKey, requestId }) => {
            console.log(`✅ PUT body encrypted with requestId: ${requestId}`);

            // Store API URL for logging
            this.encryptionSrv.setApiUrlForRequest(requestId, url);

            const headers = this.createHeadersWithEncryption(
              options?.headers,
              xAesKey,
              requestId,
            ).set('Content-Type', 'application/json');

            const requestOptions: any = {
              ...options,
              headers: headers,
              responseType: 'text' as 'json',
            };

            console.log(
              `📤 Making encrypted PUT request (body only) with requestId: ${requestId}`,
            );
            console.log(
              '============================================================\n',
            );

            return this.http.put(url, encryptedBody, requestOptions).pipe(
              tap((response) => {
                console.log(
                  '============================================================',
                );
                console.log('📥 PUT RESPONSE RECEIVED (BODY ONLY)');
                console.log(
                  '============================================================',
                );
                console.log(`📍 API URL: ${url}`);
                console.log(`🆔 Request ID: ${requestId}`);
                console.log(
                  '============================================================\n',
                );
              }),
              switchMap((response) => {
                return from(
                  this.encryptionSrv.processApiResponse(response, requestId),
                );
              }),
              map((processedResponse) => {
                return processedResponse as T;
              }),
              catchError((err) => {
                return this.handleError(err, requestId, url);
              }),
            );
          }),
          catchError((encryptionError) => {
            console.error('❌ PUT encryption failed:', encryptionError);
            return throwError(() => encryptionError);
          }),
        );
      } else {
        console.log('📋 No params or body to encrypt for PUT request');

        const requestOptions: any = {
          ...options,
          responseType: 'text' as 'json',
        };

        return this.http.put(url, body || {}, requestOptions).pipe(
          switchMap((response) => {
            const tempRequestId = `temp_${Date.now()}_${Math.random().toString(36).substring(2)}`;
            return from(
              this.encryptionSrv.processApiResponse(response, tempRequestId),
            );
          }),
          map((processedResponse) => processedResponse as T),
        );
      }
    } else {
      console.log("📄 PUT endpoint doesn't require encryption");
      console.log(
        '============================================================\n',
      );

      const requestOptions: any = {
        ...options,
        responseType: options?.responseType || 'json',
      };

      return this.http
        .put(url, body, requestOptions)
        .pipe(map((response) => response as T));
    }
  }

  // delete<T = any>(url: string, options?: HttpOptions): Observable<T> {
  //   console.log('============================================================');
  //   console.log('🚀 DELETE REQUEST');
  //   console.log('============================================================');
  //   console.log(`📍 API URL: ${url}`);

  //   const needsEncryption = this.encryptionSrv.shouldEncrypt(url);

  //   if (needsEncryption) {
  //     console.log('🔐 DELETE endpoint requires encryption processing...');

  //     const params = this.extractParamsFromOptions(options);

  //     if (Object.keys(params).length > 0) {
  //       console.log('📋 Parameters found for DELETE encryption:', Object.keys(params));

  //       return from(this.encryptionSrv.encryptSensitiveData(params)).pipe(
  //         switchMap(({ encryptedParams, xAesKey, requestId }) => {
  //           console.log(`✅ DELETE parameters encrypted with requestId: ${requestId}`);

  //           // Store API URL for logging
  //           this.encryptionSrv.setApiUrlForRequest(requestId, url);

  //           let newParams = new HttpParams();
  //           Object.keys(encryptedParams).forEach(key => {
  //             newParams = newParams.set(key, encryptedParams[key]);
  //           });

  //           const headers = this.createHeadersWithEncryption(options?.headers, xAesKey, requestId);

  //           const requestOptions: any = {
  //             ...options,
  //             params: newParams,
  //             headers: headers,
  //             responseType: 'text' as 'json'
  //           };

  //           console.log(`📤 Making encrypted DELETE request with requestId: ${requestId}`);
  //           console.log('============================================================\n');

  //           return this.http.delete(url, requestOptions).pipe(
  //             tap(response => {
  //               console.log('============================================================');
  //               console.log('📥 DELETE RESPONSE RECEIVED');
  //               console.log('============================================================');
  //               console.log(`📍 API URL: ${url}`);
  //               console.log(`🆔 Request ID: ${requestId}`);
  //               console.log('============================================================\n');
  //             }),
  //             switchMap(response => {
  //               return from(this.encryptionSrv.processApiResponse(response, requestId));
  //             }),
  //             map(processedResponse => {
  //               return processedResponse as T;
  //             }),
  //             catchError(err => {
  //               return this.handleError(err, requestId, url);
  //             })
  //           );
  //         }),
  //         catchError(encryptionError => {
  //           console.error('❌ DELETE parameter encryption failed:', encryptionError);
  //           return throwError(() => encryptionError);
  //         })
  //       );
  //     } else {
  //       console.log('ℹ️ No parameters found for DELETE encryption');
  //     }
  //   }

  //   console.log('📄 DELETE endpoint processed without encryption');
  //   console.log('============================================================\n');

  //   const requestOptions: any = {
  //     ...options,
  //     responseType: needsEncryption ? 'text' as 'json' : (options?.responseType || 'json')
  //   };

  //   return this.http.delete(url, requestOptions).pipe(
  //     switchMap(response => {
  //       if (needsEncryption) {
  //         const tempRequestId = `temp_${Date.now()}_${Math.random().toString(36).substring(2)}`;
  //         return from(this.encryptionSrv.processApiResponse(response, tempRequestId));
  //       } else {
  //         return Promise.resolve(response);
  //       }
  //     }),
  //     map(processedResponse => {
  //       return processedResponse as T;
  //     }),
  //     catchError(err => throwError(() => err))
  //   );
  // }

  // NEW: Unified error handler with decryption support

  delete<T = any>(url: string, options?: HttpOptions): Observable<T> {
    console.log('============================================================');
    console.log('🚀 DELETE REQUEST');
    console.log('============================================================');
    console.log(`📍 API URL: ${url}`);

    const needsEncryption = this.encryptionSrv.shouldEncrypt(url);

    if (needsEncryption) {
      console.log('🔐 DELETE endpoint requires encryption, processing...');

      const hasParams = options?.params && this.hasParameters(options.params);
      const hasBody = options?.body && Object.keys(options.body).length > 0;

      console.log(
        `📋 DELETE request analysis: hasParams=${hasParams}, hasBody=${hasBody}`,
      );

      if (hasParams && hasBody) {
        console.log('📋 Scenario 3: Encrypting both params and body');

        const paramsToEncrypt = this.extractParamsFromOptions(options);
        const bodyToEncrypt = this.prepareBodyForEncryption(options.body);

        const combinedData: { [key: string]: any } = {};

        Object.keys(paramsToEncrypt).forEach((key) => {
          combinedData[`param_${key}`] = paramsToEncrypt[key];
        });

        Object.keys(bodyToEncrypt).forEach((key) => {
          combinedData[`body_${key}`] = bodyToEncrypt[key];
        });

        return from(this.encryptionSrv.encryptSensitiveData(combinedData)).pipe(
          switchMap(({ encryptedParams, xAesKey, requestId }) => {
            console.log(
              `✅ DELETE params and body encrypted with requestId: ${requestId}`,
            );

            // Store API URL for logging
            this.encryptionSrv.setApiUrlForRequest(requestId, url);

            const encryptedUrlParams: { [key: string]: string } = {};
            const encryptedBodyData: { [key: string]: string } = {};

            Object.keys(encryptedParams).forEach((key) => {
              if (key.startsWith('param_')) {
                const originalKey = key.replace('param_', '');
                encryptedUrlParams[originalKey] = encryptedParams[key];
              } else if (key.startsWith('body_')) {
                const originalKey = key.replace('body_', '');
                encryptedBodyData[originalKey] = encryptedParams[key];
              }
            });

            let newParams = new HttpParams();
            Object.keys(encryptedUrlParams).forEach((key) => {
              newParams = newParams.set(key, encryptedUrlParams[key]);
            });

            const headers = this.createHeadersWithEncryption(
              options?.headers,
              xAesKey,
              requestId,
            ).set('Content-Type', 'application/json');

            const requestOptions: any = {
              ...options,
              params: newParams,
              headers: headers,
              body: encryptedBodyData,
              responseType: 'text' as 'json',
            };

            console.log(
              `📤 Making encrypted DELETE request (params + body) with requestId: ${requestId}`,
            );
            console.log(
              '============================================================\n',
            );

            return this.http.delete(url, requestOptions).pipe(
              tap((response) => {
                console.log(
                  '============================================================',
                );
                console.log('📥 DELETE RESPONSE RECEIVED');
                console.log(
                  '============================================================',
                );
                console.log(`📍 API URL: ${url}`);
                console.log(`🆔 Request ID: ${requestId}`);
                console.log(
                  '============================================================\n',
                );
              }),
              switchMap((response) => {
                return from(
                  this.encryptionSrv.processApiResponse(response, requestId),
                );
              }),
              map((processedResponse) => {
                return processedResponse as T;
              }),
              catchError((err) => {
                return this.handleError(err, requestId, url);
              }),
            );
          }),
        );
      } else if (hasParams && !hasBody) {
        console.log('📋 Scenario 1: Encrypting only params');

        const paramsToEncrypt = this.extractParamsFromOptions(options);

        return from(
          this.encryptionSrv.encryptSensitiveData(paramsToEncrypt),
        ).pipe(
          switchMap(({ encryptedParams, xAesKey, requestId }) => {
            console.log(
              `✅ DELETE params encrypted with requestId: ${requestId}`,
            );

            // Store API URL for logging
            this.encryptionSrv.setApiUrlForRequest(requestId, url);

            let newParams = new HttpParams();
            Object.keys(encryptedParams).forEach((key) => {
              newParams = newParams.set(key, encryptedParams[key]);
            });

            const headers = this.createHeadersWithEncryption(
              options?.headers,
              xAesKey,
              requestId,
            );

            const requestOptions: any = {
              ...options,
              params: newParams,
              headers: headers,
              responseType: 'text' as 'json',
            };

            console.log(
              `📤 Making encrypted DELETE request (params only) with requestId: ${requestId}`,
            );
            console.log(
              '============================================================\n',
            );

            return this.http.delete(url, requestOptions).pipe(
              tap((response) => {
                console.log(
                  '============================================================',
                );
                console.log('📥 DELETE RESPONSE RECEIVED (PARAMS ONLY)');
                console.log(
                  '============================================================',
                );
                console.log(`📍 API URL: ${url}`);
                console.log(`🆔 Request ID: ${requestId}`);
                console.log(
                  '============================================================\n',
                );
              }),
              switchMap((response) => {
                return from(
                  this.encryptionSrv.processApiResponse(response, requestId),
                );
              }),
              map((processedResponse) => {
                return processedResponse as T;
              }),
              catchError((err) => {
                return this.handleError(err, requestId, url);
              }),
            );
          }),
          catchError((encryptionError) => {
            console.error(
              '❌ DELETE parameter encryption failed:',
              encryptionError,
            );
            return throwError(() => encryptionError);
          }),
        );
      } else if (!hasParams && hasBody) {
        console.log('📋 Scenario 2: Encrypting only body');

        return from(this.encryptBodyData(options.body)).pipe(
          switchMap(({ encryptedBody, xAesKey, requestId }) => {
            console.log(
              `✅ DELETE body encrypted with requestId: ${requestId}`,
            );

            // Store API URL for logging
            this.encryptionSrv.setApiUrlForRequest(requestId, url);

            const headers = this.createHeadersWithEncryption(
              options?.headers,
              xAesKey,
              requestId,
            ).set('Content-Type', 'application/json');

            const requestOptions: any = {
              ...options,
              headers: headers,
              body: encryptedBody,
              responseType: 'text' as 'json',
            };

            console.log(
              `📤 Making encrypted DELETE request (body only) with requestId: ${requestId}`,
            );
            console.log(
              '============================================================\n',
            );

            return this.http.delete(url, requestOptions).pipe(
              tap((response) => {
                console.log(
                  '============================================================',
                );
                console.log('📥 DELETE RESPONSE RECEIVED (BODY ONLY)');
                console.log(
                  '============================================================',
                );
                console.log(`📍 API URL: ${url}`);
                console.log(`🆔 Request ID: ${requestId}`);
                console.log(
                  '============================================================\n',
                );
              }),
              switchMap((response) => {
                return from(
                  this.encryptionSrv.processApiResponse(response, requestId),
                );
              }),
              map((processedResponse) => {
                return processedResponse as T;
              }),
              catchError((err) => {
                return this.handleError(err, requestId, url);
              }),
            );
          }),
          catchError((encryptionError) => {
            console.error('❌ DELETE body encryption failed:', encryptionError);
            return throwError(() => encryptionError);
          }),
        );
      } else {
        console.log('📋 No params or body to encrypt for DELETE request');

        const requestOptions: any = {
          ...options,
          responseType: 'text' as 'json',
        };

        return this.http.delete(url, requestOptions).pipe(
          switchMap((response) => {
            const tempRequestId = `temp_${Date.now()}_${Math.random().toString(36).substring(2)}`;
            return from(
              this.encryptionSrv.processApiResponse(response, tempRequestId),
            );
          }),
          map((processedResponse) => processedResponse as T),
        );
      }
    } else {
      console.log("📄 DELETE endpoint doesn't require encryption");
      console.log(
        '============================================================\n',
      );

      const requestOptions: any = {
        ...options,
        responseType: options?.responseType || 'json',
      };

      return this.http
        .delete(url, requestOptions)
        .pipe(map((response) => response as T));
    }
  }

  private handleError(
    err: any,
    requestId: string,
    apiUrl: string,
  ): Observable<never> {
    console.log('============================================================');
    console.log('❌ ERROR RESPONSE');
    console.log('============================================================');
    console.log(`📍 API URL: ${apiUrl}`);
    console.log(`🆔 Request ID: ${requestId}`);
    console.log('❌ Error Status:', err.status);
    console.log('❌ Error Status Text:', err.statusText);
    console.log('❌ Error Message:', err.message);

    if (err.error) {
      console.log('❌ Error Response Type:', typeof err.error);

      // Check if error response is encrypted
      if (typeof err.error === 'string' && err.error.length > 50) {
        console.log(
          '🔍 Error response appears to be encrypted, attempting decryption...',
        );
        console.log(
          '🔍 Encrypted Error (first 200 chars):',
          err.error.substring(0, 200) + '...',
        );

        // Decrypt error response
        return from(
          this.encryptionSrv.decryptResponse(err.error, requestId, true),
        ).pipe(
          switchMap((decryptedError) => {
            console.log('🔓 Decrypted Error Response:', decryptedError);
            console.log(
              '============================================================\n',
            );

            const errorMessage =
              typeof decryptedError === 'string'
                ? decryptedError
                : JSON.stringify(decryptedError);

            const newError = {
              ...err,
              decryptedError: decryptedError,
              message: `Server Error (Status ${err.status}): ${errorMessage}`,
            };

            return throwError(() => newError);
          }),
          catchError((decryptError) => {
            console.error('❌ Failed to decrypt error response:', decryptError);
            console.log(
              '============================================================\n',
            );
            this.encryptionSrv.clearKeyForRequest(requestId);
            return throwError(() => err);
          }),
        );
      } else {
        console.log('🔍 Error response is not encrypted');
        console.log('🔍 Raw Error Response:', err.error);
        console.log(
          '============================================================\n',
        );
      }
    }

    console.log(
      '============================================================\n',
    );
    this.encryptionSrv.clearKeyForRequest(requestId);
    return throwError(() => err);
  }

  createParams(params: { [key: string]: any }): HttpParams {
    let httpParams = new HttpParams();
    Object.keys(params).forEach((key) => {
      const value = params[key];
      if (value !== null && value !== undefined) {
        httpParams = httpParams.set(key, value.toString());
      }
    });
    return httpParams;
  }

  createHeaders(headers: { [key: string]: string }): HttpHeaders {
    return new HttpHeaders(headers);
  }

  private createHeadersWithEncryption(
    existingHeaders?: HttpHeaders | { [header: string]: string | string[] },
    xAesKey?: string,
    requestId?: string,
  ): HttpHeaders {
    let headers: HttpHeaders;

    if (existingHeaders instanceof HttpHeaders) {
      headers = existingHeaders;
    } else if (existingHeaders) {
      headers = new HttpHeaders(existingHeaders);
    } else {
      headers = new HttpHeaders();
    }

    if (xAesKey) {
      headers = headers.set('x-aes-key', xAesKey);
    }

    if (requestId) {
      headers = headers.set('x-request-id', requestId);
    }

    return headers;
  }

  private extractParamsFromOptions(options?: HttpOptions): {
    [key: string]: any;
  } {
    const params: { [key: string]: any } = {};

    if (options?.params) {
      if (options.params instanceof HttpParams) {
        const httpParams = options.params as HttpParams;
        const keys = httpParams.keys();
        keys.forEach((key) => {
          const value = httpParams.get(key);
          if (value !== null) {
            params[key] = value;
          }
        });
      } else {
        const paramObj = options.params as {
          [param: string]: string | string[];
        };
        Object.keys(paramObj).forEach((key) => {
          const value = paramObj[key];
          if (value !== null && value !== undefined) {
            if (Array.isArray(value)) {
              params[key] = value[0];
            } else {
              params[key] = value;
            }
          }
        });
      }
    }

    return params;
  }

  // http-enc-srv-wrapper.service.ts
  // REPLACE your encryptBodyData method with this:

  // http-enc-srv-wrapper.service.ts
  // REPLACE your encryptBodyData method with this FINAL CORRECT version:

  private encryptBodyData(body: any): Promise<{
    encryptedBody: any;
    xAesKey: string;
    requestId: string;
  }> {
    console.log('🔐 Encrypting request body...');
    console.log(
      '📦 Body type:',
      Array.isArray(body)
        ? 'Array'
        : body instanceof FormData
          ? 'FormData'
          : typeof body,
    );

    // Handle FormData
    if (body instanceof FormData) {
      console.log(
        '📋 FormData detected - handling file upload with encryption',
      );
      const textFieldsToEncrypt: { [key: string]: any } = {};
      const fileFields: { key: string; file: File }[] = [];

      body.forEach((value, key) => {
        if (value instanceof File) {
          fileFields.push({ key, file: value });
        } else {
          textFieldsToEncrypt[key] = value;
        }
      });

      return this.encryptionSrv
        .encryptSensitiveData(textFieldsToEncrypt)
        .then(({ encryptedParams, xAesKey, requestId }) => {
          const encryptedFormData = new FormData();
          Object.keys(encryptedParams).forEach((key) => {
            encryptedFormData.set(key, encryptedParams[key]);
          });
          fileFields.forEach(({ key, file }) => {
            encryptedFormData.append(key, file, file.name);  // ← fix
          });
          return {
            encryptedBody: encryptedFormData,
            xAesKey: xAesKey,
            requestId: requestId,
          };
        });
    }

    // Handle Arrays - Create a flat object with all properties, encrypt, then reconstruct array
    if (Array.isArray(body)) {
      console.log('📋 Array detected with', body.length, 'item(s)');
      console.log('📋 Original array:', JSON.stringify(body, null, 2));

      // Flatten array into a single object with indexed keys
      const flattenedObject: { [key: string]: any } = {};

      body.forEach((item, index) => {
        if (typeof item === 'object' && item !== null) {
          Object.keys(item).forEach((key) => {
            const value = item[key];
            if (value !== null && value !== undefined) {
              // Create indexed key: items[0].projectId, items[0].projectCostHeadId, etc.
              flattenedObject[`items[${index}].${key}`] = value;
            }
          });
        }
      });

      console.log('📦 Flattened object:', flattenedObject);

      // Encrypt the flattened object
      return this.encryptionSrv
        .encryptSensitiveData(flattenedObject)
        .then(({ encryptedParams, xAesKey, requestId }) => {
          console.log('🔐 Encrypted flat object:', encryptedParams);

          // Reconstruct the array from encrypted values
          const encryptedArray: any[] = [];

          // Group encrypted values back into array items
          Object.keys(encryptedParams).forEach((key) => {
            // Parse: items[0].projectId -> index: 0, property: projectId
            const match = key.match(/items\[(\d+)\]\.(.+)/);
            if (match) {
              const index = parseInt(match[1]);
              const property = match[2];

              // Initialize object if needed
              if (!encryptedArray[index]) {
                encryptedArray[index] = {};
              }

              // Set encrypted value
              encryptedArray[index][property] = encryptedParams[key];
            }
          });

          console.log(
            '✅ Reconstructed encrypted array:',
            JSON.stringify(encryptedArray, null, 2),
          );

          return {
            encryptedBody: encryptedArray,
            xAesKey: xAesKey,
            requestId: requestId,
          };
        });
    }

    // Handle Objects
    if (typeof body === 'object' && body !== null) {
      console.log('📋 Object detected - encrypting object properties');
      const bodyToEncrypt: { [key: string]: any } = {};

      Object.keys(body).forEach((key) => {
        const value = body[key];
        if (value !== null && value !== undefined) {
          bodyToEncrypt[key] = value;
        }
      });

      return this.encryptionSrv
        .encryptSensitiveData(bodyToEncrypt)
        .then(({ encryptedParams, xAesKey, requestId }) => {
          return {
            encryptedBody: { ...encryptedParams },
            xAesKey: xAesKey,
            requestId: requestId,
          };
        });
    }

    // Handle primitives
    console.log('📋 Primitive value detected');
    const bodyToEncrypt = { data: body };

    return this.encryptionSrv
      .encryptSensitiveData(bodyToEncrypt)
      .then(({ encryptedParams, xAesKey, requestId }) => {
        return {
          encryptedBody: { ...encryptedParams },
          xAesKey: xAesKey,
          requestId: requestId,
        };
      });
  }

  // private encryptBodyData(body: any): Promise<{
  //   encryptedBody: any,
  //   xAesKey: string,
  //   requestId: string
  // }> {
  //   console.log('🔐 Encrypting request body...');

  //   if (body instanceof FormData) {
  //     console.log('📋 FormData detected - handling file upload with encryption');

  //     const textFieldsToEncrypt: { [key: string]: any } = {};
  //     const fileFields: { key: string, file: File }[] = [];

  //     body.forEach((value, key) => {
  //       if (value instanceof File) {
  //         fileFields.push({ key, file: value });
  //       } else {
  //         textFieldsToEncrypt[key] = value;
  //       }
  //     });

  //     return this.encryptionSrv.encryptSensitiveData(textFieldsToEncrypt).then(
  //       ({ encryptedParams, xAesKey, requestId }) => {
  //         const encryptedFormData = new FormData();

  //         Object.keys(encryptedParams).forEach(key => {
  //           encryptedFormData.set(key, encryptedParams[key]);
  //         });

  //         fileFields.forEach(({ key, file }) => {
  //           encryptedFormData.set(key, file);
  //         });

  //         return {
  //           encryptedBody: encryptedFormData,
  //           xAesKey: xAesKey,
  //           requestId: requestId
  //         };
  //       }
  //     );
  //   }

  //   const bodyToEncrypt: { [key: string]: any } = {};

  //   if (typeof body === 'object' && body !== null && !Array.isArray(body)) {
  //     Object.keys(body).forEach(key => {
  //       const value = body[key];
  //       if (value !== null && value !== undefined) {
  //         bodyToEncrypt[key] = value;
  //       }
  //     });
  //   } else if (Array.isArray(body)) {
  //     bodyToEncrypt['data'] = JSON.stringify(body);
  //   } else {
  //     bodyToEncrypt['data'] = body;
  //   }

  //   return this.encryptionSrv.encryptSensitiveData(bodyToEncrypt).then(
  //     ({ encryptedParams, xAesKey, requestId }) => {
  //       return {
  //         encryptedBody: { ...encryptedParams },
  //         xAesKey: xAesKey,
  //         requestId: requestId
  //       };
  //     }
  //   );
  // }

  private hasParameters(
    params: HttpParams | { [param: string]: string | string[] },
  ): boolean {
    if (params instanceof HttpParams) {
      return params.keys().length > 0;
    } else if (params && typeof params === 'object') {
      return Object.keys(params).length > 0;
    }
    return false;
  }

  private prepareBodyForEncryption(body: any): { [key: string]: any } {
    const bodyToEncrypt: { [key: string]: any } = {};

    if (typeof body === 'object' && body !== null && !Array.isArray(body)) {
      Object.keys(body).forEach((key) => {
        const value = body[key];
        if (value !== null && value !== undefined) {
          bodyToEncrypt[key] = value;
        }
      });
    } else if (Array.isArray(body)) {
      bodyToEncrypt['data'] = JSON.stringify(body);
    } else {
      bodyToEncrypt['data'] = body;
    }

    return bodyToEncrypt;
  }
}
