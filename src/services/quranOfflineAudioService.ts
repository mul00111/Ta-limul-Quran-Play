/**
 * Quran Offline Audio Service
 * Provides full offline caching, downloading, and streaming for Para 30 (Juz 30) Surahs.
 * Supports both CacheStorage API and IndexedDB fallback for maximum browser & WebView compatibility.
 */

import { getAlafasyUrlForSurahAyah, QARI_VOICES } from '../utils/qariAudioService';

const CACHE_NAME = 'quran-audio-v2';
const DB_NAME = 'QuranAudioDB_v2';
const STORE_NAME = 'audio_blobs';

// Memory cache of active ObjectURLs to revoke when no longer needed
const activeBlobUrls = new Map<string, string>();

/**
 * Open IndexedDB for offline audio blobs fallback
 */
function openAudioDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      return reject(new Error('IndexedDB not supported'));
    }
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Save audio blob to IndexedDB
 */
async function saveBlobToIDB(key: string, blob: Blob): Promise<void> {
  try {
    const db = await openAudioDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(blob, key);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('saveBlobToIDB failed:', err);
  }
}

/**
 * Retrieve audio blob from IndexedDB
 */
async function getBlobFromIDB(key: string): Promise<Blob | null> {
  try {
    const db = await openAudioDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

/**
 * Delete audio blob from IndexedDB
 */
async function deleteBlobFromIDB(key: string): Promise<void> {
  try {
    const db = await openAudioDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(key);
      req.onsuccess = () => resolve();
      req.onerror = () => resolve();
    });
  } catch {
    // Ignore
  }
}

/**
 * Build unique cache key for a specific Ayah and Qari
 */
export function getAyahAudioKey(surah: number, ayah: number, qariId: string): string {
  const voice = QARI_VOICES.find((q) => q.id === qariId);
  const folder = voice?.folder || qariId;
  return `quran_${qariId}_${folder}_s${String(surah).padStart(3, '0')}_a${String(ayah).padStart(3, '0')}`;
}

/**
 * Check if a specific Ayah is already cached for offline listening
 */
export async function isAyahCached(surah: number, ayah: number, qariId: string): Promise<boolean> {
  const key = getAyahAudioKey(surah, ayah, qariId);
  const targetUrl = getAlafasyUrlForSurahAyah(surah, ayah, qariId);

  // 1. Try CacheStorage
  if (typeof caches !== 'undefined') {
    try {
      const cache = await caches.open(CACHE_NAME);
      const matched = await cache.match(targetUrl);
      if (matched) return true;
    } catch {
      // Sandbox restrictions may throw SecurityError
    }
  }

  // 2. Try IndexedDB
  const idbBlob = await getBlobFromIDB(key);
  return idbBlob !== null;
}

/**
 * Retrieve audio source URL (Offline ObjectURL if cached, or Network URL with auto-cache)
 */
export async function getAyahAudioSource(
  surah: number,
  ayah: number,
  qariId: string
): Promise<{ url: string; isOffline: boolean; blobUrl?: string }> {
  const key = getAyahAudioKey(surah, ayah, qariId);
  const networkUrl = getAlafasyUrlForSurahAyah(surah, ayah, qariId);

  // 1. Try CacheStorage
  if (typeof caches !== 'undefined') {
    try {
      const cache = await caches.open(CACHE_NAME);
      const matched = await cache.match(networkUrl);
      if (matched) {
        const blob = await matched.blob();
        if (blob && blob.size > 1000) {
          // Revoke prior blob URL for this key if exists
          if (activeBlobUrls.has(key)) {
            URL.revokeObjectURL(activeBlobUrls.get(key)!);
          }
          const blobUrl = URL.createObjectURL(blob);
          activeBlobUrls.set(key, blobUrl);
          return { url: blobUrl, isOffline: true, blobUrl };
        }
      }
    } catch {
      // Fallback
    }
  }

  // 2. Try IndexedDB
  const idbBlob = await getBlobFromIDB(key);
  if (idbBlob && idbBlob.size > 1000) {
    if (activeBlobUrls.has(key)) {
      URL.revokeObjectURL(activeBlobUrls.get(key)!);
    }
    const blobUrl = URL.createObjectURL(idbBlob);
    activeBlobUrls.set(key, blobUrl);
    return { url: blobUrl, isOffline: true, blobUrl };
  }

  // 3. Not cached: return streaming network URL and auto-cache in background
  cacheAyahInBackground(surah, ayah, qariId, networkUrl).catch(() => {});

  return { url: networkUrl, isOffline: false };
}

/**
 * Background auto-caching for smooth offline accumulation
 */
async function cacheAyahInBackground(
  surah: number,
  ayah: number,
  qariId: string,
  networkUrl: string
): Promise<void> {
  const key = getAyahAudioKey(surah, ayah, qariId);
  try {
    const res = await fetch(networkUrl);
    if (!res.ok) return;
    const blob = await res.blob();
    if (!blob || blob.size < 1000) return;

    if (typeof caches !== 'undefined') {
      try {
        const cache = await caches.open(CACHE_NAME);
        const cacheResponse = new Response(blob, {
          headers: {
            'Content-Type': 'audio/mpeg',
            'Content-Length': String(blob.size),
            'X-Cached-At': new Date().toISOString()
          }
        });
        await cache.put(networkUrl, cacheResponse);
      } catch {
        // Fallback to IDB
        await saveBlobToIDB(key, blob);
      }
    } else {
      await saveBlobToIDB(key, blob);
    }
  } catch {
    // Network may be offline
  }
}

/**
 * Check Surah download status
 */
export async function getSurahDownloadStatus(
  surah: number,
  totalAyahs: number,
  qariId: string
): Promise<{
  downloadedCount: number;
  totalAyahs: number;
  isFullyDownloaded: boolean;
  percent: number;
}> {
  let count = 0;
  for (let a = 1; a <= totalAyahs; a++) {
    const cached = await isAyahCached(surah, a, qariId);
    if (cached) count++;
  }

  const isFullyDownloaded = totalAyahs > 0 && count === totalAyahs;
  const percent = totalAyahs > 0 ? Math.round((count / totalAyahs) * 100) : 0;

  return {
    downloadedCount: count,
    totalAyahs,
    isFullyDownloaded,
    percent
  };
}

export interface DownloadProgress {
  completed: number;
  total: number;
  percent: number;
  currentAyah: number;
}

/**
 * Download an entire Surah for offline playback
 */
export async function downloadSurahOffline(
  surah: number,
  ayahNumbers: number[],
  qariId: string,
  onProgress?: (progress: DownloadProgress) => void,
  abortSignal?: AbortSignal
): Promise<boolean> {
  const total = ayahNumbers.length;
  let completed = 0;

  // Cache Bismillah (1:1) if not already cached
  try {
    const bismillahKey = getAyahAudioKey(1, 1, qariId);
    const bismillahCached = await isAyahCached(1, 1, qariId);
    if (!bismillahCached) {
      const bismillahUrl = getAlafasyUrlForSurahAyah(1, 1, qariId);
      const res = await fetch(bismillahUrl, { signal: abortSignal });
      if (res.ok) {
        const b = await res.blob();
        if (typeof caches !== 'undefined') {
          const cache = await caches.open(CACHE_NAME);
          await cache.put(bismillahUrl, new Response(b, { headers: { 'Content-Type': 'audio/mpeg' } }));
        }
        await saveBlobToIDB(bismillahKey, b);
      }
    }
  } catch {
    // Continue
  }

  // Process Ayahs with concurrency = 2 for fast & gentle network usage
  const concurrency = 2;
  const queue = [...ayahNumbers];

  const worker = async (): Promise<void> => {
    while (queue.length > 0) {
      if (abortSignal?.aborted) throw new Error('Aborted');
      const ayahNum = queue.shift();
      if (ayahNum === undefined) break;

      const key = getAyahAudioKey(surah, ayahNum, qariId);
      const networkUrl = getAlafasyUrlForSurahAyah(surah, ayahNum, qariId);

      const alreadyCached = await isAyahCached(surah, ayahNum, qariId);
      if (!alreadyCached) {
        try {
          const res = await fetch(networkUrl, { signal: abortSignal });
          if (res.ok) {
            const blob = await res.blob();
            if (blob && blob.size > 1000) {
              if (typeof caches !== 'undefined') {
                try {
                  const cache = await caches.open(CACHE_NAME);
                  await cache.put(
                    networkUrl,
                    new Response(blob, {
                      headers: {
                        'Content-Type': 'audio/mpeg',
                        'Content-Length': String(blob.size)
                      }
                    })
                  );
                } catch {
                  await saveBlobToIDB(key, blob);
                }
              } else {
                await saveBlobToIDB(key, blob);
              }
            }
          }
        } catch (e: any) {
          if (e.name === 'AbortError' || abortSignal?.aborted) {
            throw e;
          }
          console.warn(`Failed downloading ayah ${ayahNum}:`, e);
        }
      }

      completed++;
      if (onProgress) {
        onProgress({
          completed,
          total,
          percent: Math.round((completed / total) * 100),
          currentAyah: ayahNum
        });
      }
    }
  };

  try {
    const workers = Array.from({ length: concurrency }, () => worker());
    await Promise.all(workers);
    return true;
  } catch (err: any) {
    if (err.name === 'AbortError' || abortSignal?.aborted) {
      return false;
    }
    console.error('Download surah failed:', err);
    return false;
  }
}

/**
 * Delete cached offline audio for a specific Surah
 */
export async function deleteSurahOfflineAudio(
  surah: number,
  ayahNumbers: number[],
  qariId: string
): Promise<void> {
  for (const ayahNum of ayahNumbers) {
    const key = getAyahAudioKey(surah, ayahNum, qariId);
    const networkUrl = getAlafasyUrlForSurahAyah(surah, ayahNum, qariId);

    // Delete from CacheStorage
    if (typeof caches !== 'undefined') {
      try {
        const cache = await caches.open(CACHE_NAME);
        await cache.delete(networkUrl);
      } catch {
        // Ignore
      }
    }

    // Delete from IndexedDB
    await deleteBlobFromIDB(key);

    // Revoke object URL if exists
    if (activeBlobUrls.has(key)) {
      URL.revokeObjectURL(activeBlobUrls.get(key)!);
      activeBlobUrls.delete(key);
    }
  }
}

/**
 * Get map of all downloaded Surah numbers in Para 30
 */
export async function getAllDownloadedSurahsSet(
  surahs: { number: number; totalAyahs: number }[],
  qariId: string
): Promise<Set<number>> {
  const downloadedSet = new Set<number>();
  for (const s of surahs) {
    // Quick check: test first and last ayah of the surah
    const firstCached = await isAyahCached(s.number, 1, qariId);
    if (firstCached) {
      const lastCached = await isAyahCached(s.number, s.totalAyahs, qariId);
      if (lastCached) {
        downloadedSet.add(s.number);
      }
    }
  }
  return downloadedSet;
}

/**
 * Clear all cached audio to free storage
 */
export async function clearAllQuranAudioCache(): Promise<void> {
  if (typeof caches !== 'undefined') {
    try {
      await caches.delete(CACHE_NAME);
    } catch {
      // Ignore
    }
  }

  try {
    const db = await openAudioDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).clear();
  } catch {
    // Ignore
  }

  activeBlobUrls.forEach((url) => URL.revokeObjectURL(url));
  activeBlobUrls.clear();
}
