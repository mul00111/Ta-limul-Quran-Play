import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RotateCcw, AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error in ErrorBoundary:", error, errorInfo);
  }

  public handleReset = async () => {
    try {
      if ('serviceWorker' in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations();
        for (const reg of regs) {
          await reg.unregister();
        }
      }
      if ('caches' in window) {
        const keys = await caches.keys();
        for (const key of keys) {
          await caches.delete(key);
        }
      }
    } catch (e) {
      console.warn('Cleanup during reset:', e);
    }
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0e131d] text-white flex items-center justify-center p-4" dir="rtl">
          <div className="max-w-md w-full bg-zinc-900 border border-rose-500/30 rounded-3xl p-6 shadow-2xl text-center space-y-4">
            <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-center justify-center mx-auto text-rose-400 shadow-inner">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-black text-rose-300">تعلیم القرآن پلے</h2>
              <p className="text-sm text-zinc-400">ایپلی کیشن میں ایک عارضی خرابی پیش آئی ہے۔</p>
            </div>

            <p className="text-xs text-zinc-500 bg-zinc-950 p-3 rounded-xl border border-zinc-800 break-words font-mono text-left" dir="ltr">
              {this.state.error?.message || "Unexpected runtime error"}
            </p>

            <button
              onClick={this.handleReset}
              className="w-full py-3 bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 hover:from-rose-500 hover:to-pink-500 text-white font-extrabold rounded-2xl shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
            >
              <RotateCcw className="w-5 h-5" />
              <span>ایپ دوبارہ شروع کریں (Reload)</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
