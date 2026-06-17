//using indexdb we can storing refresh token in indexdb for 
import { Injectable, inject } from '@angular/core';
import { openDB, IDBPDatabase } from 'idb';
import { JwtService } from './jwt.service'; 

@Injectable({
  providedIn: 'root',  
})
export class AuthStorageService {
  private jwtSrv = inject(JwtService);
  private dbPromise: Promise<IDBPDatabase>;
  private readonly DB_NAME = 'auth-secure-db';
  private readonly DB_VERSION = 1;
  private readonly STORE_NAME = 'secure-auth-store';

  constructor() { 
    this.dbPromise = this.initDB();
  }

  // Fixed initDB method in AuthStorageService
private async initDB(): Promise<IDBPDatabase> {
  try {
    const storeName = this.STORE_NAME; // Capture in variable for closure
    return await openDB(this.DB_NAME, this.DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName);
        }
      },
    });
  } catch (error) {
    console.error('Failed to initialize IndexedDB:', error);
    throw new Error('Database initialization failed');
  }
}

  async set<T>(key: string, val: T): Promise<void> {
    try {
      const db = await this.dbPromise;
      
      // Only encrypt refresh token for security
      let valueToStore: any;
      if (key === 'refreshToken' && typeof val === 'string') {
        valueToStore = this.jwtSrv.encrypt(val);
        console.log('🔐 RefreshToken encrypted and stored in IndexedDB');
      } else {
        valueToStore = val;
      }

      await db.put(this.STORE_NAME, valueToStore, key);
    } catch (error) {
      console.error(`Failed to store ${key}:`, error);
      throw new Error(`Storage operation failed for key: ${key}`);
    }
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const db = await this.dbPromise;
      const value = await db.get(this.STORE_NAME, key);
      
      if (!value) return null;

      // Decrypt refresh token if retrieving it
      if (key === 'refreshToken' && typeof value === 'string') {
        const decryptedValue = this.jwtSrv.decrypt(value);
        console.log('🔓 RefreshToken decrypted from IndexedDB');
        return decryptedValue as T;
      }

      return value as T;
    } catch (error) {
      console.error(`Failed to retrieve ${key}:`, error);
      return null;
    }
  }

  async delete(key: string): Promise<void> {
    try {
      const db = await this.dbPromise;
      await db.delete(this.STORE_NAME, key);
    } catch (error) {
      console.error(`Failed to delete ${key}:`, error);
      throw new Error(`Delete operation failed for key: ${key}`);
    }
  }

  async clear(): Promise<void> {
    try {
      const db = await this.dbPromise;
      await db.clear(this.STORE_NAME);
    } catch (error) {
      console.error('Failed to clear storage:', error);
      throw new Error('Clear operation failed');
    }
  }

  // VAPT Security: Complete cleanup including database deletion
  async secureWipe(): Promise<void> {
    try {
      await this.clear();
      
      // Close database connection
      const db = await this.dbPromise;
      db.close();
      
      // Delete the entire database for complete cleanup
      await new Promise<void>((resolve, reject) => {
        const deleteReq = indexedDB.deleteDatabase(this.DB_NAME);
        deleteReq.onsuccess = () => {
          console.log('🗑️ IndexedDB completely wiped for security');
          resolve();
        };
        deleteReq.onerror = () => reject(deleteReq.error);
        deleteReq.onblocked = () => {
          console.warn('Database deletion blocked');
          resolve(); // Continue anyway
        };
      });

      // Reinitialize for future use
      this.dbPromise = this.initDB();
    } catch (error) {
      console.error('Failed to perform secure wipe:', error);
      throw new Error('Secure wipe operation failed');
    }
  }

  // Check if refresh token exists and is valid
  async hasValidRefreshToken(): Promise<boolean> {
    try {
      const refreshToken = await this.get<string>('refreshToken');
      return refreshToken !== null && refreshToken.length > 0;
    } catch (error) {
      console.error('Failed to check refresh token validity:', error);
      return false;
    }
  }
}