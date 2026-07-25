import { Asset } from '../types';

const DB_NAME = 'AssetDoctorDB';
const DB_VERSION = 2;
const STORE_NAME = 'assets';
const FASTAG_STORE_NAME = 'fastag_queries';

export interface FastagRecord {
  id: string;
  vehicleNumber: string;
  bankName: string;
  tagStatus: 'ACTIVE' | 'LOW_BALANCE' | 'BLACK_LISTED' | 'EXPIRED';
  balanceAmount: number;
  lastUpdated: string;
  tagId?: string;
}

export function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error('IndexedDB is not supported in this browser.'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('category', 'category', { unique: false });
        store.createIndex('status', 'status', { unique: false });
        store.createIndex('expiryDate', 'expiryDate', { unique: false });
      }
      if (!db.objectStoreNames.contains(FASTAG_STORE_NAME)) {
        const fastagStore = db.createObjectStore(FASTAG_STORE_NAME, { keyPath: 'id' });
        fastagStore.createIndex('vehicleNumber', 'vehicleNumber', { unique: false });
        fastagStore.createIndex('lastUpdated', 'lastUpdated', { unique: false });
      }
    };

    request.onsuccess = (event) => {
      resolve((event.target as IDBOpenDBRequest).result);
    };

    request.onerror = (event) => {
      reject((event.target as IDBOpenDBRequest).error);
    };
  });
}

export async function getAllAssetsFromDB(): Promise<Asset[]> {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result || []);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  } catch (error) {
    console.warn('IndexedDB fetch error, falling back:', error);
    return [];
  }
}

export async function saveAssetToDB(asset: Asset): Promise<void> {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(asset);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.warn('IndexedDB save error:', error);
  }
}

export async function saveAllAssetsToDB(assets: Asset[]): Promise<void> {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      
      assets.forEach((asset) => {
        store.put(asset);
      });

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  } catch (error) {
    console.warn('IndexedDB bulk save error:', error);
  }
}

export async function deleteAssetFromDB(id: string): Promise<void> {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.warn('IndexedDB delete error:', error);
  }
}

export async function clearAllAssetsFromDB(): Promise<void> {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.warn('IndexedDB clear error:', error);
  }
}

export async function getFastagRecordsFromDB(): Promise<FastagRecord[]> {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(FASTAG_STORE_NAME, 'readonly');
      const store = transaction.objectStore(FASTAG_STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result || []);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  } catch (error) {
    console.warn('IndexedDB fastag fetch error:', error);
    return [];
  }
}

export async function saveFastagRecordToDB(record: FastagRecord): Promise<void> {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(FASTAG_STORE_NAME, 'readwrite');
      const store = transaction.objectStore(FASTAG_STORE_NAME);
      const request = store.put(record);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.warn('IndexedDB fastag save error:', error);
  }
}

export async function deleteFastagRecordFromDB(id: string): Promise<void> {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(FASTAG_STORE_NAME, 'readwrite');
      const store = transaction.objectStore(FASTAG_STORE_NAME);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.warn('IndexedDB fastag delete error:', error);
  }
}
