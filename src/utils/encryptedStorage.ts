/**
 * Encrypted session storage for enhanced security
 */

interface StorageData {
  data: string;
  timestamp: number;
  hash: string;
}

// Simple encryption using Web Crypto API
class EncryptedStorage {
  private readonly key: CryptoKey | null = null;
  private readonly algorithm = 'AES-GCM';

  constructor() {
    this.initializeKey();
  }

  private async initializeKey(): Promise<void> {
    try {
      // Generate or retrieve encryption key
      const keyData = localStorage.getItem('_enc_key');
      if (keyData) {
        const keyBuffer = this.base64ToArrayBuffer(keyData);
        (this as any).key = await crypto.subtle.importKey(
          'raw',
          keyBuffer,
          { name: this.algorithm },
          false,
          ['encrypt', 'decrypt']
        );
      } else {
        (this as any).key = await crypto.subtle.generateKey(
          { name: this.algorithm, length: 256 },
          true,
          ['encrypt', 'decrypt']
        );
        
        const exportedKey = await crypto.subtle.exportKey('raw', (this as any).key);
        localStorage.setItem('_enc_key', this.arrayBufferToBase64(exportedKey));
      }
    } catch (error) {
      console.error('Failed to initialize encryption key:', error);
    }
  }

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    bytes.forEach(byte => binary += String.fromCharCode(byte));
    return btoa(binary);
  }

  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  }

  private async generateHash(data: string): Promise<string> {
    const encoder = new TextEncoder();
    const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(data));
    return this.arrayBufferToBase64(hashBuffer);
  }

  async setItem(key: string, value: string): Promise<void> {
    if (!this.key) {
      // Fallback to regular storage if encryption fails
      sessionStorage.setItem(key, value);
      return;
    }

    try {
      const encoder = new TextEncoder();
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const encodedData = encoder.encode(value);

      const encryptedData = await crypto.subtle.encrypt(
        { name: this.algorithm, iv },
        this.key,
        encodedData
      );

      const hash = await this.generateHash(value);
      const storageData: StorageData = {
        data: this.arrayBufferToBase64(encryptedData) + '.' + this.arrayBufferToBase64(iv),
        timestamp: Date.now(),
        hash
      };

      sessionStorage.setItem(key, JSON.stringify(storageData));
    } catch (error) {
      console.error('Encryption failed, using fallback:', error);
      sessionStorage.setItem(key, value);
    }
  }

  async getItem(key: string): Promise<string | null> {
    const stored = sessionStorage.getItem(key);
    if (!stored) return null;

    try {
      const storageData: StorageData = JSON.parse(stored);
      
      // Check if data is too old (24 hours)
      if (Date.now() - storageData.timestamp > 24 * 60 * 60 * 1000) {
        this.removeItem(key);
        return null;
      }

      if (!this.key || !storageData.data.includes('.')) {
        // Fallback: return as-is if not encrypted
        return stored;
      }

      const [encryptedB64, ivB64] = storageData.data.split('.');
      const encryptedData = this.base64ToArrayBuffer(encryptedB64);
      const iv = this.base64ToArrayBuffer(ivB64);

      const decryptedData = await crypto.subtle.decrypt(
        { name: this.algorithm, iv },
        this.key,
        encryptedData
      );

      const decoder = new TextDecoder();
      const decryptedValue = decoder.decode(decryptedData);

      // Verify integrity
      const expectedHash = await this.generateHash(decryptedValue);
      if (expectedHash !== storageData.hash) {
        console.warn('Data integrity check failed');
        this.removeItem(key);
        return null;
      }

      return decryptedValue;
    } catch (error) {
      console.error('Decryption failed:', error);
      // Remove corrupted data
      this.removeItem(key);
      return null;
    }
  }

  removeItem(key: string): void {
    sessionStorage.removeItem(key);
  }

  clear(): void {
    sessionStorage.clear();
  }
}

export const encryptedStorage = new EncryptedStorage();