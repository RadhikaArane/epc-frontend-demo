import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { openDB, IDBPDatabase } from 'idb';

export interface CacheEntry<T = any> {
  data: string; // Encrypted data
  timestamp: number;
  ttl: number;
}

export interface CacheConfig {
  dbName: string;
  storeName: string;
  version: number;
  ttl?: number; // Time to live in milliseconds
}

@Injectable({
  providedIn: 'root'
})
export class JwtService {

  private readonly SECRET_KEY = 'salesapp123456789012345678901234'; // 32 chars for AES-256
  private readonly IV_STRING = '1234567890123456'; // 16 chars for AES

  private dbInstances: Map<string, Promise<IDBPDatabase>> = new Map();

  constructor() {
    // Security validation
    if (this.SECRET_KEY.length !== 32) {
      console.warn('⚠️ SECRET_KEY should be exactly 32 characters for AES-256');
    }
    if (this.IV_STRING.length !== 16) {
      console.warn('⚠️ IV should be exactly 16 characters for AES');
    }
  }

  /**
   * Initialize a database with given configuration
   */
  private async initDB(config: CacheConfig): Promise<IDBPDatabase> {
    const dbKey = `${config.dbName}_${config.version}`;

    if (!this.dbInstances.has(dbKey)) {
      const dbPromise = openDB(config.dbName, config.version, {
        upgrade(db) {
          if (!db.objectStoreNames.contains(config.storeName)) {
            const store = db.createObjectStore(config.storeName);
            store.createIndex('timestamp', 'timestamp');
          }
        },
      });

      this.dbInstances.set(dbKey, dbPromise);
    }

    return this.dbInstances.get(dbKey)!;
  }

  /**
   * Store data in IndexedDB with encryption
   */
  async store<T = any>(
    key: string,
    data: T,
    config: CacheConfig
  ): Promise<void> {
    try {
      const db = await this.initDB(config);

      const encryptedData = this.encrypt(data);

      const cacheEntry: CacheEntry = {
        data: encryptedData,
        timestamp: Date.now(),
        ttl: config.ttl || 24 * 60 * 60 * 1000 // Default 24 hours
      };

      await db.put(config.storeName, cacheEntry, key);

      console.log(`✅ Data stored with key: ${key}`);

      // Clean up old entries
      this.cleanupExpired(config).catch(err =>
        console.warn('⚠️ Cleanup failed:', err)
      );
    } catch (error) {
      console.error('❌ Failed to store data:', error);
      throw new Error('Data storage failed');
    }
  }

  /**
   * Retrieve data from IndexedDB with decryption
   */
  async get<T = any>(
    key: string,
    config: CacheConfig
  ): Promise<T | null> {
    try {
      const db = await this.initDB(config);
      const cacheEntry = await db.get(config.storeName, key);

      if (!cacheEntry) {
        console.warn(`⚠️ Data not found for key: ${key}`);
        return null;
      }

      // Check if expired
      const now = Date.now();
      if (now - cacheEntry.timestamp > cacheEntry.ttl) {
        console.warn(`⚠️ Data expired for key: ${key}`);
        await db.delete(config.storeName, key);
        return null;
      }

      const decryptedData = this.decrypt(cacheEntry.data);
      console.log(`✅ Data retrieved for key: ${key}`);

      return decryptedData as T;
    } catch (error) {
      console.error('❌ Failed to retrieve data:', error);
      return null;
    }
  }

  /**
   * Delete specific entry
   */
  async delete(key: string, config: CacheConfig): Promise<void> {
    try {
      const db = await this.initDB(config);
      await db.delete(config.storeName, key);
      console.log(`✅ Data deleted for key: ${key}`);
    } catch (error) {
      console.error('❌ Failed to delete data:', error);
    }
  }

  /**
   * Get all keys from store
   */
  async getAllKeys(config: CacheConfig): Promise<string[]> {
    try {
      const db = await this.initDB(config);
      const keys = await db.getAllKeys(config.storeName);
      return keys as string[];
    } catch (error) {
      console.error('❌ Failed to get all keys:', error);
      return [];
    }
  }

  /**
   * Clean up expired entries
   */
  private async cleanupExpired(config: CacheConfig): Promise<void> {
    try {
      const db = await this.initDB(config);
      const tx = db.transaction(config.storeName, 'readwrite');
      const store = tx.objectStore(config.storeName);
      const index = store.index('timestamp');

      const now = Date.now();
      let cursor = await index.openCursor();

      while (cursor) {
        const entry = cursor.value;
        if (now - entry.timestamp > entry.ttl) {
          await cursor.delete();
          console.log('🧹 Expired entry cleaned:', cursor.key);
        }
        cursor = await cursor.continue();
      }

      await tx.done;
      console.log('✅ Cleanup completed');
    } catch (error) {
      console.error('❌ Cleanup failed:', error);
    }
  }

  /**
   * Clear all data from store
   */
  async clearAll(config: CacheConfig): Promise<void> {
    try {
      const db = await this.initDB(config);
      await db.clear(config.storeName);
      console.log(`✅ All data cleared from ${config.storeName}`);
    } catch (error) {
      console.error('❌ Failed to clear data:', error);
    }
  }






  /**
   * Encrypt RefreshToken using AES-256-CBC with PKCS7 padding
   * Used for storing RefreshToken securely in IndexedDB
   * @param data - RefreshToken string to encrypt
   * @returns Base64 encoded encrypted string
   */
  encrypt(data: any): string {
    try {
      // Ensure data is a string
      const stringData = typeof data === 'string' ? data : JSON.stringify(data);

      console.log('🔐 Encrypting data...');

      // Use CryptoJS default encryption (includes PKCS7 padding)
      const encrypted = CryptoJS.AES.encrypt(stringData, this.SECRET_KEY, {
        iv: CryptoJS.enc.Utf8.parse(this.IV_STRING),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });

      const encryptedString = encrypted.toString();
      console.log('✅ Data encryption successful');
      return encryptedString;
    } catch (error) {
      console.error('❌ Data encryption failed:', error);
      throw new Error('Data encryption failed');
    }
  }

  /**
   * Decrypt RefreshToken using AES-256-CBC with PKCS7 padding
   * Used for retrieving RefreshToken from IndexedDB
   * @param ciphertext - Base64 encoded encrypted string
   * @returns Decrypted RefreshToken string
   */
  decrypt(ciphertext: string): any {
    try {
      if (!ciphertext || ciphertext.trim() === '') {
        console.warn('⚠️ Empty ciphertext provided for decryption');
        return null;
      }

      console.log('🔓 Decrypting data...');

      const decrypted = CryptoJS.AES.decrypt(ciphertext, this.SECRET_KEY, {
        iv: CryptoJS.enc.Utf8.parse(this.IV_STRING),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });

      const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);

      if (!decryptedString) {
        console.error('❌ Decryption resulted in empty string');
        return null;
      }

      console.log('✅ Data decryption successful');

      // Try to parse as JSON, fallback to string
      try {
        return JSON.parse(decryptedString);
      } catch {
        return decryptedString;
      }
    } catch (error) {
      console.error('❌ Data decryption failed:', error);
      return null;
    }
  }



}
