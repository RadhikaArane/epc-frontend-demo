import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import * as forge from 'node-forge';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

interface PublicKeyResponse {
  success: boolean;
  publicKey: string;
  keyType: string;
  usage: string;
  timestamp: string;
}

interface RequestKeyMapping {
  requestId: string;
  aesKey: Uint8Array;
  timestamp: number;
  apiUrl?: string; // NEW: Store API URL for logging
}

@Injectable({ providedIn: 'root' })
export class EncryptionServiceService {
  private apiURL = environment.apiUrl;
  private readonly PUBLIC_KEY_URL = `${this.apiURL}AuthService/api/KeyManagement/public-key`;
  private cachedPublicKey: string | null = null;

  private keyMap = new Map<string, RequestKeyMapping>();
  private readonly KEY_EXPIRY_TIME = 5 * 60 * 1000; // 5 minutes
  private cleanupInterval: any;

  constructor(private http: HttpClient) {
    this.startKeyCleanup();
  }

  private generateRequestId(): string {
    const timestamp = Date.now().toString(36);
    const randomPart = Math.random().toString(36).substring(2);
    return `req_${timestamp}_${randomPart}`;
  }

  // UPDATED: Store API URL with key
  private storeKeyForRequest(requestId: string, aesKey: Uint8Array, apiUrl?: string): void {
    this.keyMap.set(requestId, {
      requestId,
      aesKey: new Uint8Array(aesKey),
      timestamp: Date.now(),
      apiUrl: apiUrl // Store API URL for logging
    });

    console.log(`[KEY MANAGER] Stored key for request ${requestId}. Total keys in memory: ${this.keyMap.size}`);
    if (apiUrl) {
      console.log(`[KEY MANAGER] Associated API URL: ${apiUrl}`);
    }
  }

  private getKeyForRequest(requestId: string): Uint8Array | null {
    const keyMapping = this.keyMap.get(requestId);
    if (keyMapping) {
      console.log(`[KEY MANAGER] Retrieved key for request ${requestId}`);
      return keyMapping.aesKey;
    }

    console.error(`[KEY MANAGER] ❌ No key found for request ${requestId}`);
    return null;
  }

  // NEW: Get API URL for request
  private getApiUrlForRequest(requestId: string): string | null {
    const keyMapping = this.keyMap.get(requestId);
    return keyMapping?.apiUrl || null;
  }

  private startKeyCleanup(): void {
    this.cleanupInterval = setInterval(() => {
      const now = Date.now();
      const keysToRemove: string[] = [];

      this.keyMap.forEach((mapping, requestId) => {
        if (now - mapping.timestamp > this.KEY_EXPIRY_TIME) {
          keysToRemove.push(requestId);
        }
      });

      keysToRemove.forEach(requestId => {
        this.keyMap.delete(requestId);
        console.log(`[KEY MANAGER] Cleaned up expired key for request ${requestId}`);
      });

      if (keysToRemove.length > 0) {
        console.log(`[KEY MANAGER] Cleanup complete. Removed ${keysToRemove.length} expired keys. Remaining: ${this.keyMap.size}`);
      }
    }, 60000);
  }

  private removeKeyForRequest(requestId: string): void {
    if (this.keyMap.delete(requestId)) {
      console.log(`[KEY MANAGER] Removed key for completed request ${requestId}. Remaining keys: ${this.keyMap.size}`);
    }
  }

  private fetchPublicKey(): Observable<string> {
    return this.http.get<PublicKeyResponse>(this.PUBLIC_KEY_URL).pipe(
      map(response => {
        if (response.success && response.publicKey) {
          this.cachedPublicKey = response.publicKey;
          return response.publicKey;
        } else {
          throw new Error('Invalid public key response from server');
        }
      }),
      catchError(error => throwError(() => new Error(`Failed to fetch public key: ${error.message}`)))
    );
  }

  private getPublicKey(): Observable<string> {
    if (this.cachedPublicKey) {
      return new Observable(observer => {
        observer.next(this.cachedPublicKey!);
        observer.complete();
      });
    }
    return this.fetchPublicKey();
  }

  private generateAESKey(): Uint8Array {
    const key = new Uint8Array(32);
    window.crypto.getRandomValues(key);
    return key;
  }

  private uint8ArrayToWordArray(u8: Uint8Array): CryptoJS.lib.WordArray {
    const words = [];
    for (let i = 0; i < u8.length; i += 4) {
      words.push(
        ((u8[i] << 24) | (u8[i + 1] << 16) | (u8[i + 2] << 8) | (u8[i + 3]))
      );
    }
    return CryptoJS.lib.WordArray.create(words, u8.length);
  }

  private encryptWithAES(data: string, key: Uint8Array): string {
    const keyWordArray = this.uint8ArrayToWordArray(key);
    const ivArray = key.slice(0, 16);
    const ivWordArray = this.uint8ArrayToWordArray(ivArray);
    const encrypted = CryptoJS.AES.encrypt(data, keyWordArray, {
      iv: ivWordArray,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
  }

  private decryptWithAES(encryptedData: string, key: Uint8Array): string {
    const keyWordArray = this.uint8ArrayToWordArray(key);
    const ivArray = key.slice(0, 16);
    const ivWordArray = this.uint8ArrayToWordArray(ivArray);
    const decrypted = CryptoJS.AES.decrypt(encryptedData, keyWordArray, {
      iv: ivWordArray,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
  }

  private encryptAESKeyWithRSA(aesKey: Uint8Array, publicKeyPem: string): string {
    const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
    const keyBinary = String.fromCharCode(...aesKey);
    const encrypted = publicKey.encrypt(keyBinary, 'RSAES-PKCS1-V1_5');
    return forge.util.encode64(encrypted);
  }

  public encryptSensitiveData(params: { [key: string]: any }): Promise<{
    encryptedParams: { [key: string]: string },
    xAesKey: string,
    requestId: string
  }> {
    return new Promise((resolve, reject) => {
      this.getPublicKey().subscribe({
        next: (publicKey) => {
          try {
            const requestId = this.generateRequestId();
            const aesKey = this.generateAESKey();

            // Store key WITHOUT API URL (will be set later in wrapper)
            this.storeKeyForRequest(requestId, aesKey);

            const keyHex = Array.from(aesKey).map(b => b.toString(16).padStart(2, '0')).join('');
            const ivArray = aesKey.slice(0, 16);
            const ivHex = Array.from(ivArray).map(b => b.toString(16).padStart(2, '0')).join('');

            const encryptedParams: { [key: string]: string } = {};
            Object.keys(params).forEach(key => {
              const value = params[key];
              if (value !== null && value !== undefined) {
                encryptedParams[key] = this.encryptWithAES(value.toString(), aesKey);
              }
            });

            const encryptedAESKey = this.encryptAESKeyWithRSA(aesKey, publicKey);

            console.log('---------------- ENCRYPTION DEBUG ----------------');
            console.log(`[ENCRYPTION] Request ID: ${requestId}`);
            console.log('[ENCRYPTION] AES KEY (Uint8Array):', aesKey);
            console.log('[ENCRYPTION] AES KEY (hex):', keyHex);
            console.log('[ENCRYPTION] IV (hex):', ivHex);
            console.log('[ENCRYPTION] x-aes-key header (base64):', encryptedAESKey.substring(0, 100) + (encryptedAESKey.length > 100 ? '...' : ''));
            console.log('[ENCRYPTION] Encrypted params:', Object.keys(encryptedParams));
            console.log(`[ENCRYPTION] Keys in memory: ${this.keyMap.size}`);
            console.log('---------------------------------------------------');

            resolve({
              encryptedParams,
              xAesKey: encryptedAESKey,
              requestId
            });
          } catch (error) {
            reject(error);
          }
        },
        error: (error) => reject(error)
      });
    });
  }

  // UPDATED: Decrypt error responses too
  public decryptResponse(encryptedResponse: string, requestId: string, isErrorResponse: boolean = false): Promise<any> {
    return new Promise((resolve, reject) => {
      const aesKey = this.getKeyForRequest(requestId);
      const apiUrl = this.getApiUrlForRequest(requestId);

      if (!aesKey) {
        console.error(`[DECRYPTION] ❌ No AES key found for request ${requestId}`);
        reject(new Error(`No AES key available for decryption of request ${requestId}`));
        return;
      }

      const keyHex = Array.from(aesKey).map(b => b.toString(16).padStart(2, '0')).join('');
      const ivArray = aesKey.slice(0, 16);
      const ivHex = Array.from(ivArray).map(b => b.toString(16).padStart(2, '0')).join('');

      console.log('============================================================');
      console.log(isErrorResponse ? '❌ ERROR RESPONSE DECRYPTION' : '🔓 SUCCESS RESPONSE DECRYPTION');
      console.log('============================================================');
      console.log(`📍 API URL: ${apiUrl || 'Unknown'}`);
      // console.log(`🆔 Request ID: ${requestId}`);
      // console.log(`📦 Encrypted Response (first 200 chars): ${encryptedResponse.substring(0, 200)}${encryptedResponse.length > 200 ? '...' : ''}`);
      // console.log(`🔑 AES KEY (hex): ${keyHex}`);
      // console.log(`🔑 IV (hex): ${ivHex}`);

      try {
        const decryptedString = this.decryptWithAES(encryptedResponse, aesKey);
        let decryptedData;

        try {
          decryptedData = JSON.parse(decryptedString);
          console.log(isErrorResponse ? '❌ Decrypted Error Response (JSON):' : '✅ Decrypted Response (JSON):', decryptedData);
        } catch {
          decryptedData = decryptedString;
          console.log(isErrorResponse ? '❌ Decrypted Error Response (String):' : '✅ Decrypted Response (String):', decryptedData);
        }

        // Clean up the key after successful decryption
        this.removeKeyForRequest(requestId);

        console.log(`${isErrorResponse ? '❌' : '✅'} Successfully decrypted ${isErrorResponse ? 'error' : 'success'} response for request ${requestId}`);
        console.log('============================================================\n');

        // CRITICAL: Return exact decrypted data WITHOUT normalization
        resolve(decryptedData);
      } catch (error) {
        console.error(`❌ Decryption error for request ${requestId}:`, error);
        console.log('============================================================\n');
        reject(error);
      }
    });
  }

  public isResponseEncrypted(response: any): boolean {
    if (typeof response === 'string') {
      const trimmed = response.trim();
      const isLongString = trimmed.length > 20;
      const notJsonLike = !trimmed.startsWith('{') && !trimmed.startsWith('[');
      const isBase64Like = /^[A-Za-z0-9+/=]+={0,2}$/.test(trimmed);
      return isLongString && notJsonLike && isBase64Like;
    }
    return false;
  }

  // UPDATED: Return exact decrypted response without normalization
  public processApiResponse(response: any, requestId: string): Promise<any> {
    console.log(`[ENCRYPTION DEBUG] processApiResponse called for request ${requestId}`);
    console.log('[ENCRYPTION DEBUG] Response type:', typeof response);
    console.log('[ENCRYPTION DEBUG] Response length:', typeof response === 'string' ? response.length : 'N/A');

    if (response === null || response === undefined) {
      console.log('[ENCRYPTION DEBUG] Response is null/undefined, returning as-is');
      this.removeKeyForRequest(requestId);
      return Promise.resolve(response);
    }

    if (typeof response !== 'string') {
      console.log('[ENCRYPTION DEBUG] Response is not a string, returning as-is (NO NORMALIZATION)');
      this.removeKeyForRequest(requestId);
      return Promise.resolve(response); // Return exact response
    }

    if (this.isResponseEncrypted(response)) {
      console.log(`[ENCRYPTION DEBUG] String response appears encrypted for request ${requestId}, decrypting...`);

      const aesKey = this.getKeyForRequest(requestId);
      if (!aesKey) {
        console.error(`[ENCRYPTION DEBUG] ❌ No AES key found for request ${requestId}`);
        return Promise.reject(new Error(`No AES key available for decryption of request ${requestId}`));
      }

      return this.decryptResponse(response, requestId)
        .then(res => {
          console.log(`[ENCRYPTION DEBUG] ✅ Decryption successful for ${requestId}`);
          return res; // Return exact decrypted response
        })
        .catch(error => {
          console.error(`[ENCRYPTION DEBUG] ❌ Decryption failed for ${requestId}:`, error);
          throw new Error(`Decryption failed for request ${requestId}: ${error.message}`);
        });
    } else {
      console.log('[ENCRYPTION DEBUG] String response is not encrypted, parsing as JSON...');
      this.removeKeyForRequest(requestId);
      try {
        const parsed = JSON.parse(response);
        console.log('[ENCRYPTION DEBUG] Successfully parsed JSON response');
        return Promise.resolve(parsed); // Return exact parsed response
      } catch (error) {
        console.log('[ENCRYPTION DEBUG] Failed to parse as JSON, returning string as-is');
        return Promise.resolve(response);
      }
    }
  }

  public shouldEncrypt(url: string): boolean {
    return true;
  }

  // NEW: Update API URL for request (called from wrapper)
  public setApiUrlForRequest(requestId: string, apiUrl: string): void {
    const keyMapping = this.keyMap.get(requestId);
    if (keyMapping) {
      keyMapping.apiUrl = apiUrl;
      console.log(`[KEY MANAGER] Updated API URL for request ${requestId}: ${apiUrl}`);
    }
  }

  public clearKeyForRequest(requestId: string): void {
    this.removeKeyForRequest(requestId);
  }

  public clearKeys(): void {
    console.log(`[KEY MANAGER] Clearing all keys. Total keys cleared: ${this.keyMap.size}`);
    this.keyMap.clear();
  }

  public getKeyCount(): number {
    return this.keyMap.size;
  }

  ngOnDestroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.clearKeys();
  }
}