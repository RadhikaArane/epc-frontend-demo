import { inject, Injectable } from '@angular/core';
import { HttpEncSrvWrapperService } from '../common/http-enc-srv-wrapper.service';
import { environment } from '../../../../environments/environment';
import { from, Observable, switchMap, tap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EncryptionServiceService } from '../common/encryption-service.service';
import { CreateMobileUserPayload, faMobileUser } from '../../models/fixedAsset-models/fa-mobileUser';

@Injectable({
  providedIn: 'root'
})
export class MobileUserService {
  private httpWrapper = inject(HttpEncSrvWrapperService);
  private encryptionSrv = inject(EncryptionServiceService);
  private http = inject(HttpClient);

  private apiUrl = environment.apiUrl;
  private controllerUrl = `${this.apiUrl}FixedAssetVerification/api/users/mobile`;

  // -------------------------
  // GET USERS (wrapper)
  // -------------------------
  // getMobileUsers(name?: string, id?: string): Observable<faMobileUser[]> {

  //   const params: any = {};
  //   if (name) params['Name'] = name;
  //   if (id) params['Id'] = id;

  //   return this.httpWrapper.get<any>(this.controllerUrl, { plainParams: params }).pipe(
  //     tap(res => console.log('✅ [Service] GET Response:', res))
  //   );
  // }

  // // -------------------------
  // // CREATE (wrapper)
  // // -------------------------
  // createMobileUser(user: any): Observable<any> {
  //   return this.httpWrapper.post(this.controllerUrl, user).pipe(
  //     tap(res => console.log('✅ [Service] POST Response:', res))
  //   );
  // }








// getMobileUsers(name?: string, id?: string): Observable<faMobileUser[]> {

//   const params: any = {};
//   if (name) params['Name'] = name;
//   if (id) params['Id'] = id;

//   return this.httpWrapper
//     .get<any>(this.controllerUrl, { plainParams: params })
//     .pipe(
//       tap(res => console.log('✅ [Service] GET Response:', res)),
//       switchMap(res => [Array.isArray(res) ? res : (res?.Items ?? [])])
//     );
// }





// final caling 

getMobileUsers(name?: string, id?: string): Observable<faMobileUser[]> {

  const queryParams = this.httpWrapper.createParams({
    Name: name,
    Id: id
  });

  return this.httpWrapper.get<faMobileUser[]>(
    this.controllerUrl,
    { params: queryParams }
  );
}


createMobileUser(user: CreateMobileUserPayload): Observable<any> {
  return this.httpWrapper.post(this.controllerUrl, user).pipe(
    tap(res => console.log(' [Service] POST Response:', res))
  );
}



































  // // -------------------------
  // UPDATE (encrypted like GhostAssetService)
  // -------------------------
//  updateMobileUser(userId: number, user: any): Observable<any> {
//   return from(
//     this.encryptionSrv.encryptSensitiveData({
//       UserId: userId,
//       username: user.username,
//       password: user.password,
//       fullName: user.fullName,
//       email: user.email,
//       mobileNumber: user.mobileNumber,
//       employeeId: user.employeeId
//     })
//   ).pipe(
//     switchMap(({ encryptedParams, xAesKey, requestId }) => {

//       const headers = new HttpHeaders()
//         .set('x-aes-key', xAesKey)
//         .set('x-request-id', requestId);

//       const encryptedId = encodeURIComponent(encryptedParams['UserId']);
//       const url = `${this.controllerUrl}/${encryptedId}`;

//       const body: any = {
//         username: encryptedParams['username'],
//         fullName: encryptedParams['fullName'],
//         email: encryptedParams['email'],
//         mobileNumber: encryptedParams['mobileNumber'],
//         employeeId: encryptedParams['employeeId']
//       };

//       if (user.password?.trim()) {
//         body.password = encryptedParams['password'];
//       }

//       return this.http.put(url, body, { headers });
//     })
//   );
// }











updateMobileUser(userId: number, user: any): Observable<any> {
  return from(
    this.encryptionSrv.encryptSensitiveData({
      UserId: userId, // ✅ include here
      username: user.username,
      password: user.password,
      fullName: user.fullName,
      email: user.email,
      mobileNumber: user.mobileNumber,
      employeeId: user.employeeId
    })
  ).pipe(
    switchMap(({ encryptedParams, xAesKey, requestId }) => {

      const headers = new HttpHeaders()
        .set('x-aes-key', xAesKey)
        .set('x-request-id', requestId);

      // ✅ encrypted UserId from same result
      const encryptedId = encodeURIComponent(encryptedParams['UserId']);
      const url = `${this.controllerUrl}/${encryptedId}`;

      const body: any = {
        username: encryptedParams['username'],
        fullName: encryptedParams['fullName'],
        email: encryptedParams['email'],
        mobileNumber: encryptedParams['mobileNumber'],
        employeeId: encryptedParams['employeeId']
      };

      if (user.password?.trim()) {
        body.password = encryptedParams['password'];
      }

      return this.http.put(url, body, { headers ,
      responseType: 'text'

      });
      
    })
  );
}























//   deleteMobileUser(userId: number): Observable<any> {
//   return from(
//     this.encryptionSrv.encryptSensitiveData({ UserId: userId })
//   ).pipe(
//     switchMap(({ encryptedParams, xAesKey, requestId }) => {

//       const headers = new HttpHeaders()
//         .set('x-aes-key', xAesKey)
//         .set('x-request-id', requestId);

//       const encryptedId = encryptedParams['UserId'];

//       return this.http.delete(this.controllerUrl, {
//         headers,
//         params: {
//           Id: encryptedId   // ✅ QUERY PARAM (very important)
//         }
//       });
//     })
//   );
// }











deleteMobileUser(userId: number): Observable<any> {
  return from(
    this.encryptionSrv.encryptSensitiveData({ Id: userId })
  ).pipe(
    switchMap(({ encryptedParams, xAesKey, requestId }) => {

      const headers = new HttpHeaders()
        .set('x-aes-key', xAesKey)
        .set('x-request-id', requestId);

      return this.http.delete(this.controllerUrl, {
        headers,
        params: { Id: encryptedParams['Id'] },
        responseType: 'text' as 'json' // 🔥 IMPORTANT
      });
    })
  );
}



















}