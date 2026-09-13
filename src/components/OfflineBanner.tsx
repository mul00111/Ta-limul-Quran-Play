import React, { useSyncExternalStore } from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';

function subscribeOnlineStatus(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}

function getOnlineSnapshot(): boolean {
  if (typeof navigator !== 'undefined') {
    return navigator.onLine;
  }
  return true;
}

function getOnlineServerSnapshot(): boolean {
  return true;
}

export const OfflineBanner: React.FC = () => {
  const isOnline = useSyncExternalStore(
    subscribeOnlineStatus,
    getOnlineSnapshot,
    getOnlineServerSnapshot
  );

  if (isOnline) return null;

  return (
    <div className="bg-amber-950/90 border-b border-amber-800 text-amber-200 px-4 py-2 text-xs font-bold flex items-center justify-between z-50">
      <div className="flex items-center gap-2">
        <WifiOff className="w-4 h-4 text-amber-400 animate-pulse" />
        <span>آف لائن موڈ: انٹرنیٹ سے منقطع ہے۔ کچھ اسباق اور گیمز بغير انٹرنیٹ کے بھی دستیاب ہیں۔</span>
      </div>
      <button
        type="button"
        onClick={() => {
          if (typeof window !== 'undefined') {
            window.location.reload();
          }
        }}
        className="px-2.5 py-1 bg-amber-900 hover:bg-amber-800 text-amber-100 rounded-lg border border-amber-700 text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
      >
        <RefreshCw className="w-3 h-3" />
        <span>دوبارہ کوشش</span>
      </button>
    </div>
  );
};
