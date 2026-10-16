import { StoreState } from '../types';
import { initialStoreState } from '../data/initialData';

const LOCAL_STORAGE_KEY = 'nowtech_solar_campaigns_v1';
const SYNC_CHANNEL_NAME = 'nowtech_solar_sync_channel';

class StorageService {
  private broadcastChannel: BroadcastChannel | null = null;
  private isServerAvailable: boolean = true;
  private lastSyncedTime: string | null = null;
  private syncListeners: Set<(state: StoreState) => void> = new Set();

  constructor() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.broadcastChannel = new BroadcastChannel(SYNC_CHANNEL_NAME);
        this.broadcastChannel.onmessage = (event) => {
          if (event.data && event.data.type === 'STORE_UPDATED' && event.data.state) {
            this.notifyListeners(event.data.state);
          }
        };
      } catch (e) {
        console.warn('BroadcastChannel not supported or blocked:', e);
      }
    }
  }

  public subscribe(callback: (state: StoreState) => void): () => void {
    this.syncListeners.add(callback);
    return () => {
      this.syncListeners.delete(callback);
    };
  }

  private notifyListeners(state: StoreState) {
    this.syncListeners.forEach((cb) => {
      try {
        cb(state);
      } catch (e) {
        console.error('Error in storage listener:', e);
      }
    });
  }

  public async loadStore(): Promise<StoreState> {
    // 1. Try to fetch from server first (shared between devices on network/Vercel/server)
    try {
      const response = await fetch('/api/store', {
        headers: { Accept: 'application/json' },
      });
      if (response.ok) {
        const data = await response.json();
        if (data && !data.empty && data.campaigns && Array.isArray(data.campaigns)) {
          this.isServerAvailable = true;
          this.lastSyncedTime = new Date().toISOString();
          // Cache in local storage
          this.saveToLocal(data);
          return data as StoreState;
        } else if (data && data.empty) {
          // Store is empty on server, push seed data
          this.isServerAvailable = true;
          await this.saveStore(initialStoreState);
          return initialStoreState;
        }
      }
    } catch {
      // Server endpoint not reachable or running in static mode
      this.isServerAvailable = false;
    }

    // 2. Fallback to LocalStorage
    const local = this.loadFromLocal();
    if (local) {
      return local;
    }

    // 3. Return initial seeded data and initialize both
    this.saveToLocal(initialStoreState);
    if (this.isServerAvailable) {
      this.saveToServer(initialStoreState).catch(() => {});
    }
    return initialStoreState;
  }

  public async saveStore(state: StoreState): Promise<void> {
    const updated: StoreState = {
      ...state,
      version: (state.version || 1) + 1,
      lastUpdated: new Date().toISOString(),
    };

    // Save locally
    this.saveToLocal(updated);

    // Broadcast to other open tabs in browser
    if (this.broadcastChannel) {
      this.broadcastChannel.postMessage({
        type: 'STORE_UPDATED',
        state: updated,
      });
    }

    // Notify listeners in this tab
    this.notifyListeners(updated);

    // Save to server
    try {
      await this.saveToServer(updated);
      this.isServerAvailable = true;
      this.lastSyncedTime = updated.lastUpdated;
    } catch (e) {
      console.warn('Could not sync with server backend:', e);
      this.isServerAvailable = false;
    }
  }

  private saveToLocal(state: StoreState): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to write to localStorage:', e);
    }
  }

  private loadFromLocal(): StoreState | null {
    if (typeof window === 'undefined') return null;
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.campaigns && Array.isArray(parsed.campaigns)) {
          return parsed as StoreState;
        }
      }
    } catch (e) {
      console.error('Failed to read from localStorage:', e);
    }
    return null;
  }

  private async saveToServer(state: StoreState): Promise<void> {
    const res = await fetch('/api/store', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(state),
    });
    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }
  }

  public async resetToDefaults(): Promise<StoreState> {
    const freshState: StoreState = {
      ...initialStoreState,
      lastUpdated: new Date().toISOString(),
    };

    this.saveToLocal(freshState);

    try {
      await fetch('/api/store/reset', { method: 'POST' });
      await this.saveToServer(freshState);
    } catch (e) {
      console.warn('Could not reset server store:', e);
    }

    if (this.broadcastChannel) {
      this.broadcastChannel.postMessage({
        type: 'STORE_UPDATED',
        state: freshState,
      });
    }

    this.notifyListeners(freshState);
    return freshState;
  }

  public exportDataJson(state: StoreState): string {
    return JSON.stringify(state, null, 2);
  }

  public importDataJson(jsonString: string): StoreState {
    const parsed = JSON.parse(jsonString);
    if (!parsed || !parsed.campaigns || !Array.isArray(parsed.campaigns)) {
      throw new Error('Arquivo JSON inválido: não contém a estrutura de campanhas da NowTech Solar.');
    }
    return parsed as StoreState;
  }

  public getSyncStatus() {
    return {
      isServerConnected: this.isServerAvailable,
      lastSynced: this.lastSyncedTime,
    };
  }
}

export const storageService = new StorageService();
