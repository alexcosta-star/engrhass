// IndexedDB utility for offline-first data caching

const DB_NAME = "portfolioCache";
const DB_VERSION = 1;

interface CacheItem<T> {
    key: string;
    data: T;
    timestamp: number;
}

let dbInstance: IDBDatabase | null = null;

const openDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
        if (dbInstance) {
            resolve(dbInstance);
            return;
        }

        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => reject(request.error);

        request.onsuccess = () => {
            dbInstance = request.result;
            resolve(dbInstance);
        };

        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;

            if (!db.objectStoreNames.contains("cache")) {
                db.createObjectStore("cache", { keyPath: "key" });
            }
        };
    });
};

export const setCache = async <T>(key: string, data: T): Promise<void> => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(["cache"], "readwrite");
        const store = transaction.objectStore("cache");

        const item: CacheItem<T> = {
            key,
            data,
            timestamp: Date.now()
        };

        const request = store.put(item);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
};

export const getCache = async <T>(key: string): Promise<T | null> => {
    try {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(["cache"], "readonly");
            const store = transaction.objectStore("cache");
            const request = store.get(key);

            request.onsuccess = () => {
                const result = request.result as CacheItem<T> | undefined;
                resolve(result ? result.data : null);
            };
            request.onerror = () => reject(request.error);
        });
    } catch {
        return null;
    }
};

export const clearCache = async (): Promise<void> => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(["cache"], "readwrite");
        const store = transaction.objectStore("cache");
        const request = store.clear();

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
};
