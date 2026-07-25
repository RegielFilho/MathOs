const DB_NAME = "MathOS_Database";
const DB_VERSION = 1;
const STORE_NAME = "user_state";

export class StorageEngine {
    static async openDB() {
        return new Promise((resolve, reject) => {
            if (!window.indexedDB) {
                reject("IndexedDB não suportado neste navegador.");
                return;
            }
            const request = indexedDB.open(DB_NAME, DB_VERSION);
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
            request.onupgradeneeded = (e) => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    db.createObjectStore(STORE_NAME);
                }
            };
        });
    }

    static async save(key, value) {
        try {
            const db = await this.openDB();
            const tx = db.transaction(STORE_NAME, "readwrite");
            tx.objectStore(STORE_NAME).put(value, key);
            return tx.complete;
        } catch (err) {
            console.warn("IndexedDB indisponível, usando LocalStorage:", err);
            localStorage.setItem(`mathos_${key}`, JSON.stringify(value));
        }
    }

    static async load(key) {
        try {
            const db = await this.openDB();
            return new Promise((resolve) => {
                const tx = db.transaction(STORE_NAME, "readonly");
                const request = tx.objectStore(STORE_NAME).get(key);
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => resolve(null);
            });
        } catch (err) {
            const data = localStorage.getItem(`mathos_${key}`);
            return data ? JSON.parse(data) : null;
        }
    }
}